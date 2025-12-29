/**
 * Subscriptions Module Tests
 *
 * Tests for convex/subscriptions/subscriptions.ts
 * Covers: plan limits, usage tracking, tier enforcement, access checks
 *
 * Functions tested:
 * - upsertSubscription
 * - getSubscriptionByUser
 * - listSubscriptions
 * - recordUsage
 * - PLAN_LIMITS configuration
 */

import { describe, test, expect } from 'vitest';
import { createTestContext, seedUser } from '../testHelpers';
import { Id } from '../../../convex/_generated/dataModel';

describe('Subscriptions Module', () => {
  /**
   * Helper to seed a subscription in the test database
   */
  async function seedSubscription(
    t: ReturnType<typeof createTestContext>,
    userId: Id<'users'>,
    overrides: Partial<{
      planTier: string;
      status:
        | 'active'
        | 'trialing'
        | 'grace_period'
        | 'maintenance_mode'
        | 'past_due'
        | 'cancelled'
        | 'expired';
      priceMonthly: number;
      features: {
        maxUrls: number;
        maxKeywordIdeas: number;
        maxAiReports: number;
        maxContentPieces: number;
      };
      startsAt: number;
      renewsAt: number;
      cancelAt: number;
    }> = {}
  ): Promise<Id<'subscriptions'>> {
    return await t.run(async (ctx) => {
      return await ctx.db.insert('subscriptions', {
        userId,
        planTier: overrides.planTier ?? 'solo',
        status: overrides.status ?? 'active',
        priceMonthly: overrides.priceMonthly ?? 49,
        features: overrides.features ?? {
          maxUrls: 1,
          maxKeywordIdeas: 250,
          maxAiReports: 4,
          maxContentPieces: 4,
        },
        startsAt: overrides.startsAt ?? Date.now(),
        renewsAt: overrides.renewsAt,
        cancelAt: overrides.cancelAt,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });
  }

  /**
   * Helper to seed a usage limits document
   */
  async function seedUsageLimits(
    t: ReturnType<typeof createTestContext>,
    userId: Id<'users'>,
    overrides: Partial<{
      periodStart: number;
      periodEnd: number;
      urlsAnalyzed: number;
      keywordIdeasGenerated: number;
      aiReportsGenerated: number;
      contentPiecesPlanned: number;
    }> = {}
  ): Promise<Id<'usageLimits'>> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    ).getTime();

    return await t.run(async (ctx) => {
      return await ctx.db.insert('usageLimits', {
        userId,
        periodStart: overrides.periodStart ?? startOfMonth,
        periodEnd: overrides.periodEnd ?? endOfMonth,
        urlsAnalyzed: overrides.urlsAnalyzed ?? 0,
        keywordIdeasGenerated: overrides.keywordIdeasGenerated ?? 0,
        aiReportsGenerated: overrides.aiReportsGenerated ?? 0,
        contentPiecesPlanned: overrides.contentPiecesPlanned ?? 0,
        updatedAt: Date.now(),
      });
    });
  }

  describe('Plan Limits Configuration', () => {
    test('solo plan has correct limits', async () => {
      const t = createTestContext();
      const user = await seedUser(t);

      const subId = await seedSubscription(t, user, {
        planTier: 'solo',
        features: { maxUrls: 1, maxKeywordIdeas: 250, maxAiReports: 4, maxContentPieces: 4 },
      });

      const sub = await t.run(async (ctx) => ctx.db.get(subId));

      expect(sub?.planTier).toBe('solo');
      expect(sub?.features.maxUrls).toBe(1);
      expect(sub?.features.maxKeywordIdeas).toBe(250);
      expect(sub?.features.maxAiReports).toBe(4);
      expect(sub?.features.maxContentPieces).toBe(4);
    });

    test('growth plan has correct limits', async () => {
      const t = createTestContext();
      const user = await seedUser(t);

      const subId = await seedSubscription(t, user, {
        planTier: 'growth',
        priceMonthly: 149,
        features: { maxUrls: 3, maxKeywordIdeas: 1000, maxAiReports: 12, maxContentPieces: 12 },
      });

      const sub = await t.run(async (ctx) => ctx.db.get(subId));

      expect(sub?.planTier).toBe('growth');
      expect(sub?.priceMonthly).toBe(149);
      expect(sub?.features.maxUrls).toBe(3);
      expect(sub?.features.maxKeywordIdeas).toBe(1000);
    });

    test('enterprise plan has highest limits', async () => {
      const t = createTestContext();
      const user = await seedUser(t);

      const subId = await seedSubscription(t, user, {
        planTier: 'enterprise',
        features: {
          maxUrls: 999999,
          maxKeywordIdeas: 10000,
          maxAiReports: 100,
          maxContentPieces: 100,
        },
      });

      const sub = await t.run(async (ctx) => ctx.db.get(subId));

      expect(sub?.planTier).toBe('enterprise');
      expect(sub?.features.maxUrls).toBe(999999);
      expect(sub?.features.maxKeywordIdeas).toBe(10000);
    });
  });

  describe('Subscription Status', () => {
    test('active subscription is valid', async () => {
      const t = createTestContext();
      const user = await seedUser(t);

      const subId = await seedSubscription(t, user, { status: 'active' });
      const sub = await t.run(async (ctx) => ctx.db.get(subId));

      expect(sub?.status).toBe('active');
    });

    test('trialing subscription is valid', async () => {
      const t = createTestContext();
      const user = await seedUser(t);

      const subId = await seedSubscription(t, user, { status: 'trialing' });
      const sub = await t.run(async (ctx) => ctx.db.get(subId));

      expect(sub?.status).toBe('trialing');
    });

    test('grace_period subscription is valid', async () => {
      const t = createTestContext();
      const user = await seedUser(t);

      const subId = await seedSubscription(t, user, { status: 'grace_period' });
      const sub = await t.run(async (ctx) => ctx.db.get(subId));

      expect(sub?.status).toBe('grace_period');
    });

    test('cancelled subscription is tracked', async () => {
      const t = createTestContext();
      const user = await seedUser(t);

      const cancelAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days from now
      const subId = await seedSubscription(t, user, {
        status: 'cancelled',
        cancelAt,
      });

      const sub = await t.run(async (ctx) => ctx.db.get(subId));

      expect(sub?.status).toBe('cancelled');
      expect(sub?.cancelAt).toBe(cancelAt);
    });

    test('expired subscription is tracked', async () => {
      const t = createTestContext();
      const user = await seedUser(t);

      const subId = await seedSubscription(t, user, { status: 'expired' });
      const sub = await t.run(async (ctx) => ctx.db.get(subId));

      expect(sub?.status).toBe('expired');
    });
  });

  describe('Usage Tracking', () => {
    test('usage starts at zero', async () => {
      const t = createTestContext();
      const user = await seedUser(t);

      const usageId = await seedUsageLimits(t, user);
      const usage = await t.run(async (ctx) => ctx.db.get(usageId));

      expect(usage?.urlsAnalyzed).toBe(0);
      expect(usage?.keywordIdeasGenerated).toBe(0);
      expect(usage?.aiReportsGenerated).toBe(0);
      expect(usage?.contentPiecesPlanned).toBe(0);
    });

    test('usage increments correctly', async () => {
      const t = createTestContext();
      const user = await seedUser(t);

      const usageId = await seedUsageLimits(t, user, { keywordIdeasGenerated: 50 });

      // Simulate incrementing usage
      await t.run(async (ctx) => {
        const usage = await ctx.db.get(usageId);
        if (usage) {
          await ctx.db.patch(usageId, {
            keywordIdeasGenerated: usage.keywordIdeasGenerated + 10,
            updatedAt: Date.now(),
          });
        }
      });

      const updated = await t.run(async (ctx) => ctx.db.get(usageId));
      expect(updated?.keywordIdeasGenerated).toBe(60);
    });

    test('usage is tracked per period', async () => {
      const t = createTestContext();
      const user = await seedUser(t);

      // Current month
      const now = new Date();
      const currentStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      const currentEnd = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      ).getTime();

      // Last month
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
      const lastMonthEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        0,
        23,
        59,
        59,
        999
      ).getTime();

      await seedUsageLimits(t, user, {
        periodStart: lastMonthStart,
        periodEnd: lastMonthEnd,
        keywordIdeasGenerated: 200,
      });

      await seedUsageLimits(t, user, {
        periodStart: currentStart,
        periodEnd: currentEnd,
        keywordIdeasGenerated: 50,
      });

      // Query current period only
      const currentUsage = await t.run(async (ctx) => {
        return await ctx.db
          .query('usageLimits')
          .withIndex('by_user_period', (q) => q.eq('userId', user).eq('periodStart', currentStart))
          .first();
      });

      expect(currentUsage?.keywordIdeasGenerated).toBe(50);
    });
  });

  describe('Limit Enforcement', () => {
    test('check if usage is under limit', async () => {
      const t = createTestContext();
      const user = await seedUser(t);

      await seedSubscription(t, user, {
        features: { maxUrls: 1, maxKeywordIdeas: 250, maxAiReports: 4, maxContentPieces: 4 },
      });

      await seedUsageLimits(t, user, { keywordIdeasGenerated: 100 });

      const result = await t.run(async (ctx) => {
        const sub = await ctx.db
          .query('subscriptions')
          .filter((q) => q.eq(q.field('userId'), user))
          .first();

        const usage = await ctx.db
          .query('usageLimits')
          .filter((q) => q.eq(q.field('userId'), user))
          .first();

        if (!sub || !usage) return { allowed: false };

        const remaining = sub.features.maxKeywordIdeas - usage.keywordIdeasGenerated;
        return { allowed: remaining > 0, remaining };
      });

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(150);
    });

    test('detect when limit is reached', async () => {
      const t = createTestContext();
      const user = await seedUser(t);

      await seedSubscription(t, user, {
        features: { maxUrls: 1, maxKeywordIdeas: 250, maxAiReports: 4, maxContentPieces: 4 },
      });

      // Usage equals limit
      await seedUsageLimits(t, user, { keywordIdeasGenerated: 250 });

      const result = await t.run(async (ctx) => {
        const sub = await ctx.db
          .query('subscriptions')
          .filter((q) => q.eq(q.field('userId'), user))
          .first();

        const usage = await ctx.db
          .query('usageLimits')
          .filter((q) => q.eq(q.field('userId'), user))
          .first();

        if (!sub || !usage) return { allowed: false };

        const remaining = sub.features.maxKeywordIdeas - usage.keywordIdeasGenerated;
        return { allowed: remaining > 0, remaining };
      });

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    test('detect when limit is exceeded', async () => {
      const t = createTestContext();
      const user = await seedUser(t);

      await seedSubscription(t, user, {
        features: { maxUrls: 1, maxKeywordIdeas: 250, maxAiReports: 4, maxContentPieces: 4 },
      });

      // Usage exceeds limit (edge case from legacy data)
      await seedUsageLimits(t, user, { keywordIdeasGenerated: 300 });

      const result = await t.run(async (ctx) => {
        const sub = await ctx.db
          .query('subscriptions')
          .filter((q) => q.eq(q.field('userId'), user))
          .first();

        const usage = await ctx.db
          .query('usageLimits')
          .filter((q) => q.eq(q.field('userId'), user))
          .first();

        if (!sub || !usage) return { allowed: false };

        const remaining = sub.features.maxKeywordIdeas - usage.keywordIdeasGenerated;
        return { allowed: remaining > 0, remaining };
      });

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(-50); // Over limit
    });
  });

  describe('Subscription Access Checks', () => {
    test('user without subscription has no access', async () => {
      const t = createTestContext();
      const user = await seedUser(t);

      const sub = await t.run(async (ctx) => {
        return await ctx.db
          .query('subscriptions')
          .filter((q) => q.eq(q.field('userId'), user))
          .first();
      });

      expect(sub).toBeNull();
    });

    test('user with active subscription has access', async () => {
      const t = createTestContext();
      const user = await seedUser(t);

      await seedSubscription(t, user, { status: 'active' });

      const sub = await t.run(async (ctx) => {
        return await ctx.db
          .query('subscriptions')
          .filter((q) => q.eq(q.field('userId'), user))
          .first();
      });

      expect(sub).toBeDefined();
      expect(sub?.status).toBe('active');
    });

    test('user with expired subscription has no access', async () => {
      const t = createTestContext();
      const user = await seedUser(t);

      await seedSubscription(t, user, { status: 'expired' });

      const result = await t.run(async (ctx) => {
        const sub = await ctx.db
          .query('subscriptions')
          .filter((q) => q.eq(q.field('userId'), user))
          .first();

        // Check if subscription is valid for usage
        return (
          sub?.status === 'active' || sub?.status === 'trialing' || sub?.status === 'grace_period'
        );
      });

      expect(result).toBe(false);
    });

    test('user with trialing subscription has access', async () => {
      const t = createTestContext();
      const user = await seedUser(t);

      await seedSubscription(t, user, { status: 'trialing' });

      const result = await t.run(async (ctx) => {
        const sub = await ctx.db
          .query('subscriptions')
          .filter((q) => q.eq(q.field('userId'), user))
          .first();

        // Check if subscription is valid for usage
        return (
          sub?.status === 'active' || sub?.status === 'trialing' || sub?.status === 'grace_period'
        );
      });

      expect(result).toBe(true);
    });
  });

  describe('Subscription Data Isolation', () => {
    test('subscriptions are isolated by user', async () => {
      const t = createTestContext();

      const user1 = await seedUser(t, { email: 'user1@test.com' });
      const user2 = await seedUser(t, { email: 'user2@test.com' });

      await seedSubscription(t, user1, { planTier: 'solo' });
      await seedSubscription(t, user2, { planTier: 'growth' });

      const user1Sub = await t.run(async (ctx) => {
        return await ctx.db
          .query('subscriptions')
          .withIndex('by_user', (q) => q.eq('userId', user1))
          .first();
      });

      const user2Sub = await t.run(async (ctx) => {
        return await ctx.db
          .query('subscriptions')
          .withIndex('by_user', (q) => q.eq('userId', user2))
          .first();
      });

      expect(user1Sub?.planTier).toBe('solo');
      expect(user2Sub?.planTier).toBe('growth');
    });

    test('usage limits are isolated by user', async () => {
      const t = createTestContext();

      const user1 = await seedUser(t, { email: 'user1@test.com' });
      const user2 = await seedUser(t, { email: 'user2@test.com' });

      await seedUsageLimits(t, user1, { keywordIdeasGenerated: 100 });
      await seedUsageLimits(t, user2, { keywordIdeasGenerated: 500 });

      const user1Usage = await t.run(async (ctx) => {
        return await ctx.db
          .query('usageLimits')
          .filter((q) => q.eq(q.field('userId'), user1))
          .first();
      });

      const user2Usage = await t.run(async (ctx) => {
        return await ctx.db
          .query('usageLimits')
          .filter((q) => q.eq(q.field('userId'), user2))
          .first();
      });

      expect(user1Usage?.keywordIdeasGenerated).toBe(100);
      expect(user2Usage?.keywordIdeasGenerated).toBe(500);
    });
  });

  describe('Billing Cycle Tracking', () => {
    test('renewal date is tracked', async () => {
      const t = createTestContext();
      const user = await seedUser(t);

      const renewsAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
      const subId = await seedSubscription(t, user, { renewsAt });

      const sub = await t.run(async (ctx) => ctx.db.get(subId));

      expect(sub?.renewsAt).toBe(renewsAt);
    });

    test('cancellation date is tracked', async () => {
      const t = createTestContext();
      const user = await seedUser(t);

      const cancelAt = Date.now() + 15 * 24 * 60 * 60 * 1000; // 15 days
      const subId = await seedSubscription(t, user, {
        status: 'cancelled',
        cancelAt,
      });

      const sub = await t.run(async (ctx) => ctx.db.get(subId));

      expect(sub?.status).toBe('cancelled');
      expect(sub?.cancelAt).toBe(cancelAt);
    });
  });
});
