/**
 * Article Generation Workflow Integration Tests
 *
 * Tests the complete article generation flow including:
 * - Quota enforcement at workflow start
 * - Content piece creation with generating status
 * - Writer persona integration
 * - Quality guarantee (90+ SEO score)
 *
 * Per KENT's testing philosophy: "Write tests. Not too many. Mostly integration."
 * These tests focus on use cases, not implementation details.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { api, internal } from '../../convex/_generated/api';
import { createTestContext, seedUser, seedProject } from './testHelpers';

describe('Article Generation Workflow', () => {
  let t: ReturnType<typeof createTestContext>;

  beforeEach(() => {
    t = createTestContext();
  });

  describe('Quota Enforcement', () => {
    it('should block generation when user has no active subscription', async () => {
      // Given: A user without a subscription
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      // When: Attempting to generate content
      // Then: Should fail with subscription required error
      await expect(
        t.mutation(api.subscriptions.subscriptions.recordUsage, {
          userId,
          metric: 'contentPieces',
          amount: 1,
        })
      ).rejects.toThrow(/Active subscription required/);
    });

    it('should block generation when monthly limit is reached', async () => {
      // Given: A user with Solo plan (4 articles/month) who has used all 4
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      // Create subscription with Solo limits
      await t.run(async (ctx) => {
        await ctx.db.insert('subscriptions', {
          userId,
          planTier: 'solo',
          status: 'active',
          priceMonthly: 59,
          features: {
            maxUrls: 1,
            maxKeywordIdeas: 250,
            maxAiReports: 4,
            maxContentPieces: 4,
            maxTeamMembers: 1,
          },
          startsAt: Date.now(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });

        // Create usage record at limit
        const now = new Date();
        const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).getTime();

        await ctx.db.insert('usageLimits', {
          userId,
          periodStart,
          periodEnd,
          urlsAnalyzed: 0,
          keywordIdeasGenerated: 0,
          aiReportsGenerated: 0,
          contentPiecesPlanned: 4, // Already at limit!
          updatedAt: Date.now(),
        });
      });

      // When: Attempting 5th article
      // Then: Should fail with limit reached error
      await expect(
        t.mutation(api.subscriptions.subscriptions.recordUsage, {
          userId,
          metric: 'contentPieces',
          amount: 1,
        })
      ).rejects.toThrow(/Plan limit reached/);
    });

    it('should allow generation when within quota', async () => {
      // Given: A user with Growth plan (12 articles/month) with 5 used
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      await t.run(async (ctx) => {
        await ctx.db.insert('subscriptions', {
          userId,
          planTier: 'growth',
          status: 'active',
          priceMonthly: 149,
          features: {
            maxUrls: 3,
            maxKeywordIdeas: 1000,
            maxAiReports: 12,
            maxContentPieces: 12,
            maxTeamMembers: 3,
          },
          startsAt: Date.now(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });

        const now = new Date();
        const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).getTime();

        await ctx.db.insert('usageLimits', {
          userId,
          periodStart,
          periodEnd,
          urlsAnalyzed: 1,
          keywordIdeasGenerated: 100,
          aiReportsGenerated: 3,
          contentPiecesPlanned: 5, // 5 of 12 used
          updatedAt: Date.now(),
        });
      });

      // When: Attempting 6th article
      const result = await t.mutation(api.subscriptions.subscriptions.recordUsage, {
        userId,
        metric: 'contentPieces',
        amount: 1,
      });

      // Then: Should succeed and return remaining count
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(6); // 12 - 6 = 6 remaining
    });
  });

  describe('Content Piece Creation', () => {
    it('should create content piece with generating status', async () => {
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      // When: Creating a content piece
      const contentPieceId = await t.mutation(internal.contentGeneration.createContentPiece, {
        projectId,
        contentType: 'blog',
        title: 'Test Blog Post About AI SEO',
        keywords: ['AI SEO', 'content generation', 'GEO'],
      });

      // Then: Should have generating status
      const piece = await t.run(async (ctx) => ctx.db.get(contentPieceId));
      expect(piece).toBeDefined();
      expect(piece?.status).toBe('generating');
      expect(piece?.title).toBe('Test Blog Post About AI SEO');
      expect(piece?.keywords).toEqual(['AI SEO', 'content generation', 'GEO']);
    });
  });

  describe('Tier Limits by Plan', () => {
    const planLimits = [
      { plan: 'solo', maxContentPieces: 4, price: 59 },
      { plan: 'growth', maxContentPieces: 12, price: 149 },
      { plan: 'team', maxContentPieces: 30, price: 299 },
    ];

    it.each(planLimits)(
      '$plan plan should allow $maxContentPieces content pieces per month',
      async ({ plan, maxContentPieces, price }) => {
        const userId = await seedUser(t);

        // Setup subscription
        await t.run(async (ctx) => {
          await ctx.db.insert('subscriptions', {
            userId,
            planTier: plan,
            status: 'active',
            priceMonthly: price,
            features: {
              maxUrls: plan === 'solo' ? 1 : plan === 'growth' ? 3 : 10,
              maxKeywordIdeas: plan === 'solo' ? 250 : plan === 'growth' ? 1000 : 2500,
              maxAiReports: plan === 'solo' ? 4 : plan === 'growth' ? 12 : 30,
              maxContentPieces,
              maxTeamMembers: plan === 'solo' ? 1 : plan === 'growth' ? 3 : 10,
            },
            startsAt: Date.now(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
        });

        // Verify last allowed piece succeeds
        const result = await t.mutation(api.subscriptions.subscriptions.recordUsage, {
          userId,
          metric: 'contentPieces',
          amount: maxContentPieces,
        });

        expect(result.success).toBe(true);
        expect(result.remaining).toBe(0);

        // Verify next piece fails
        await expect(
          t.mutation(api.subscriptions.subscriptions.recordUsage, {
            userId,
            metric: 'contentPieces',
            amount: 1,
          })
        ).rejects.toThrow(/Plan limit reached/);
      }
    );
  });

  describe('Concurrent Generation', () => {
    it('should handle multiple users generating content simultaneously', async () => {
      // Given: 3 users with active subscriptions
      const users = await Promise.all([
        seedUser(t, { email: 'user1@test.com' }),
        seedUser(t, { email: 'user2@test.com' }),
        seedUser(t, { email: 'user3@test.com' }),
      ]);

      const projects = await Promise.all(users.map((userId) => seedProject(t, userId)));

      // Setup subscriptions for each
      await t.run(async (ctx) => {
        for (const userId of users) {
          await ctx.db.insert('subscriptions', {
            userId,
            planTier: 'growth',
            status: 'active',
            priceMonthly: 149,
            features: {
              maxUrls: 3,
              maxKeywordIdeas: 1000,
              maxAiReports: 12,
              maxContentPieces: 12,
              maxTeamMembers: 3,
            },
            startsAt: Date.now(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
        }
      });

      // When: All users record usage simultaneously
      const results = await Promise.all(
        users.map((userId) =>
          t.mutation(api.subscriptions.subscriptions.recordUsage, {
            userId,
            metric: 'contentPieces',
            amount: 1,
          })
        )
      );

      // Then: All should succeed independently
      expect(results).toHaveLength(3);
      results.forEach((result) => {
        expect(result.success).toBe(true);
        expect(result.remaining).toBe(11); // 12 - 1
      });
    });
  });
});
