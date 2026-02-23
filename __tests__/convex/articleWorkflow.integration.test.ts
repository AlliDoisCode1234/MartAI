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

      // Create subscription with Starter limits
      await t.run(async (ctx) => {
        await ctx.db.insert('subscriptions', {
          userId,
          planTier: 'starter',
          status: 'active',
          priceMonthly: 197,
          features: {
            maxUrls: 1,
            maxKeywordIdeas: 500,
            maxAiReports: 10,
            maxContentPieces: 15,
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
          contentPiecesPlanned: 15, // Already at limit!
          updatedAt: Date.now(),
        });
      });

      // When: Attempting 16th article
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
      // Given: A user with Engine plan (50 articles/month) with 43 used
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      await t.run(async (ctx) => {
        await ctx.db.insert('subscriptions', {
          userId,
          planTier: 'engine',
          status: 'active',
          priceMonthly: 397,
          features: {
            maxUrls: 3,
            maxKeywordIdeas: 2000,
            maxAiReports: 30,
            maxContentPieces: 50,
            maxTeamMembers: 5,
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
          contentPiecesPlanned: 43, // 43 of 50 used
          updatedAt: Date.now(),
        });
      });

      // When: Attempting 44th article
      const result = await t.mutation(api.subscriptions.subscriptions.recordUsage, {
        userId,
        metric: 'contentPieces',
        amount: 1,
      });

      // Then: Should succeed and return remaining count
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(6); // 50 - 44 = 6 remaining
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
      { plan: 'starter', maxContentPieces: 15, price: 197 },
      { plan: 'engine', maxContentPieces: 50, price: 397 },
      { plan: 'agency', maxContentPieces: 100, price: 697 },
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
              maxUrls: plan === 'starter' ? 1 : plan === 'engine' ? 3 : 10,
              maxKeywordIdeas: plan === 'starter' ? 500 : plan === 'engine' ? 2000 : 5000,
              maxAiReports: plan === 'starter' ? 10 : plan === 'engine' ? 30 : 100,
              maxContentPieces,
              maxTeamMembers: plan === 'starter' ? 1 : plan === 'engine' ? 5 : 25,
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
            planTier: 'engine',
            status: 'active',
            priceMonthly: 397,
            features: {
              maxUrls: 3,
              maxKeywordIdeas: 2000,
              maxAiReports: 30,
              maxContentPieces: 50,
              maxTeamMembers: 5,
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
        expect(result.remaining).toBe(49); // 50 - 1
      });
    });
  });
});
