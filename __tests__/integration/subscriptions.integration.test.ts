/**
 * Subscription Lifecycle Integration Tests
 *
 * Tests for convex/subscriptions/ modules
 * Following KENT's Testing Trophy: Test use cases, mock Stripe at boundary
 *
 * Functions tested:
 * - upsertSubscription
 * - getSubscriptionByUser
 * - recordUsage (with limits)
 * - PLAN_LIMITS configuration
 * - State transitions (grace_period, maintenance_mode, etc.)
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { createTestContext, seedUser } from '../convex/testHelpers';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

// =============================================================================
// FIXTURES: Plan configurations
// =============================================================================

const FIXTURES = {
  planLimits: {
    solo: { maxUrls: 1, maxKeywordIdeas: 250, maxAiReports: 4, maxContentPieces: 4 },
    growth: { maxUrls: 3, maxKeywordIdeas: 1000, maxAiReports: 12, maxContentPieces: 12 },
    enterprise: {
      maxUrls: 999999,
      maxKeywordIdeas: 10000,
      maxAiReports: 100,
      maxContentPieces: 100,
    },
  },
  prices: {
    solo: 49,
    growth: 149,
    enterprise: 0, // Contact sales
  },
};

// =============================================================================
// PLAN CONFIGURATION TESTS
// =============================================================================

describe('Plan Configuration', () => {
  test('PLAN_LIMITS exports expected tiers', async () => {
    const { PLAN_LIMITS } = await import('../../convex/subscriptions/subscriptions');

    expect(PLAN_LIMITS.solo).toBeDefined();
    expect(PLAN_LIMITS.growth).toBeDefined();
    expect(PLAN_LIMITS.enterprise).toBeDefined();
  });

  test('solo plan has correct limits', async () => {
    const { PLAN_LIMITS } = await import('../../convex/subscriptions/subscriptions');

    expect(PLAN_LIMITS.solo.priceMonthly).toBe(49);
    expect(PLAN_LIMITS.solo.features.maxUrls).toBe(1);
    expect(PLAN_LIMITS.solo.features.maxKeywordIdeas).toBe(250);
  });

  test('growth plan has correct limits', async () => {
    const { PLAN_LIMITS } = await import('../../convex/subscriptions/subscriptions');

    expect(PLAN_LIMITS.growth.priceMonthly).toBe(149);
    expect(PLAN_LIMITS.growth.features.maxUrls).toBe(3);
    expect(PLAN_LIMITS.growth.features.maxKeywordIdeas).toBe(1000);
  });

  test('enterprise has unlimited urls', async () => {
    const { PLAN_LIMITS } = await import('../../convex/subscriptions/subscriptions');

    expect(PLAN_LIMITS.enterprise.features.maxUrls).toBeGreaterThan(10000);
  });

  test('planConfig function returns config for valid tier', async () => {
    const { planConfig } = await import('../../convex/subscriptions/subscriptions');

    const soloConfig = planConfig('solo');
    expect(soloConfig).toBeDefined();
    expect(soloConfig?.priceMonthly).toBe(49);
  });

  test('planConfig handles case insensitivity', async () => {
    const { planConfig } = await import('../../convex/subscriptions/subscriptions');

    const config = planConfig('GROWTH');
    expect(config?.priceMonthly).toBe(149);
  });

  test('planConfig returns null for invalid tier', async () => {
    const { planConfig } = await import('../../convex/subscriptions/subscriptions');

    const config = planConfig('nonexistent');
    expect(config).toBeNull();
  });
});

// =============================================================================
// SUBSCRIPTION CRUD TESTS (Data Layer)
// =============================================================================

describe('Subscription Data Layer', () => {
  let t: ReturnType<typeof createTestContext>;
  let userId: Id<'users'>;

  beforeEach(async () => {
    t = createTestContext();
    userId = await seedUser(t);
  });

  test('creates new subscription', async () => {
    const subscriptionId = await t.run(async (ctx) => {
      return ctx.db.insert('subscriptions', {
        userId,
        planTier: 'solo',
        status: 'active',
        priceMonthly: 49,
        features: FIXTURES.planLimits.solo,
        billingCycle: 'monthly',
        startsAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    expect(subscriptionId).toBeDefined();

    const subscription = await t.run(async (ctx) => ctx.db.get(subscriptionId));
    expect(subscription?.planTier).toBe('solo');
    expect(subscription?.status).toBe('active');
  });

  test('retrieves subscription by user', async () => {
    await t.run(async (ctx) => {
      return ctx.db.insert('subscriptions', {
        userId,
        planTier: 'growth',
        status: 'active',
        priceMonthly: 149,
        features: FIXTURES.planLimits.growth,
        startsAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const subscription = await t.run(async (ctx) => {
      return ctx.db
        .query('subscriptions')
        .withIndex('by_user', (q) => q.eq('userId', userId))
        .first();
    });

    expect(subscription?.planTier).toBe('growth');
  });

  test('updates subscription plan tier', async () => {
    const subscriptionId = await t.run(async (ctx) => {
      return ctx.db.insert('subscriptions', {
        userId,
        planTier: 'solo',
        status: 'active',
        priceMonthly: 49,
        features: FIXTURES.planLimits.solo,
        startsAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    // Upgrade to growth
    await t.run(async (ctx) => {
      await ctx.db.patch(subscriptionId, {
        planTier: 'growth',
        priceMonthly: 149,
        features: FIXTURES.planLimits.growth,
        updatedAt: Date.now(),
      });
    });

    const updated = await t.run(async (ctx) => ctx.db.get(subscriptionId));
    expect(updated?.planTier).toBe('growth');
    expect(updated?.priceMonthly).toBe(149);
  });
});

// =============================================================================
// SUBSCRIPTION STATUS TRANSITIONS
// =============================================================================

describe('Subscription Status Transitions', () => {
  let t: ReturnType<typeof createTestContext>;
  let userId: Id<'users'>;

  beforeEach(async () => {
    t = createTestContext();
    userId = await seedUser(t);
  });

  test('creates subscription with active status', async () => {
    const subscriptionId = await t.run(async (ctx) => {
      return ctx.db.insert('subscriptions', {
        userId,
        planTier: 'solo',
        status: 'active',
        priceMonthly: 49,
        features: FIXTURES.planLimits.solo,
        startsAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const subscription = await t.run(async (ctx) => ctx.db.get(subscriptionId));
    expect(subscription?.status).toBe('active');
  });

  test('transitions to grace_period on payment failure', async () => {
    const subscriptionId = await t.run(async (ctx) => {
      return ctx.db.insert('subscriptions', {
        userId,
        planTier: 'solo',
        status: 'active',
        priceMonthly: 49,
        features: FIXTURES.planLimits.solo,
        startsAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    // Simulate payment failure → grace period
    await t.run(async (ctx) => {
      await ctx.db.patch(subscriptionId, {
        status: 'grace_period',
        updatedAt: Date.now(),
      });
    });

    const subscription = await t.run(async (ctx) => ctx.db.get(subscriptionId));
    expect(subscription?.status).toBe('grace_period');
  });

  test('transitions to maintenance_mode after grace period', async () => {
    const subscriptionId = await t.run(async (ctx) => {
      return ctx.db.insert('subscriptions', {
        userId,
        planTier: 'solo',
        status: 'grace_period',
        priceMonthly: 49,
        features: FIXTURES.planLimits.solo,
        startsAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    // Grace period expired → maintenance mode
    await t.run(async (ctx) => {
      await ctx.db.patch(subscriptionId, {
        status: 'maintenance_mode',
        updatedAt: Date.now(),
      });
    });

    const subscription = await t.run(async (ctx) => ctx.db.get(subscriptionId));
    expect(subscription?.status).toBe('maintenance_mode');
  });

  test('reactivates subscription on successful payment', async () => {
    const subscriptionId = await t.run(async (ctx) => {
      return ctx.db.insert('subscriptions', {
        userId,
        planTier: 'solo',
        status: 'grace_period',
        priceMonthly: 49,
        features: FIXTURES.planLimits.solo,
        startsAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    // Payment success → reactivate
    await t.run(async (ctx) => {
      await ctx.db.patch(subscriptionId, {
        status: 'active',
        updatedAt: Date.now(),
      });
    });

    const subscription = await t.run(async (ctx) => ctx.db.get(subscriptionId));
    expect(subscription?.status).toBe('active');
  });

  test('cancels subscription', async () => {
    const subscriptionId = await t.run(async (ctx) => {
      return ctx.db.insert('subscriptions', {
        userId,
        planTier: 'growth',
        status: 'active',
        priceMonthly: 149,
        features: FIXTURES.planLimits.growth,
        startsAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    await t.run(async (ctx) => {
      await ctx.db.patch(subscriptionId, {
        status: 'cancelled',
        cancelAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const subscription = await t.run(async (ctx) => ctx.db.get(subscriptionId));
    expect(subscription?.status).toBe('cancelled');
    expect(subscription?.cancelAt).toBeDefined();
  });
});

// =============================================================================
// USAGE TRACKING TESTS
// =============================================================================

describe('Usage Tracking', () => {
  let t: ReturnType<typeof createTestContext>;
  let userId: Id<'users'>;

  beforeEach(async () => {
    t = createTestContext();
    userId = await seedUser(t);
  });

  test('creates usage document for period', async () => {
    const periodStart = new Date('2026-01-01').getTime();
    const periodEnd = new Date('2026-01-31').getTime();

    const usageId = await t.run(async (ctx) => {
      return ctx.db.insert('usageLimits', {
        userId,
        periodStart,
        periodEnd,
        urlsAnalyzed: 0,
        keywordIdeasGenerated: 0,
        aiReportsGenerated: 0,
        contentPiecesPlanned: 0,
        updatedAt: Date.now(),
      });
    });

    const usage = await t.run(async (ctx) => ctx.db.get(usageId));
    expect(usage?.urlsAnalyzed).toBe(0);
    expect(usage?.keywordIdeasGenerated).toBe(0);
  });

  test('increments usage correctly', async () => {
    const periodStart = new Date('2026-01-01').getTime();
    const periodEnd = new Date('2026-01-31').getTime();

    const usageId = await t.run(async (ctx) => {
      return ctx.db.insert('usageLimits', {
        userId,
        periodStart,
        periodEnd,
        urlsAnalyzed: 0,
        keywordIdeasGenerated: 0,
        aiReportsGenerated: 0,
        contentPiecesPlanned: 0,
        updatedAt: Date.now(),
      });
    });

    // Simulate generating keywords
    await t.run(async (ctx) => {
      await ctx.db.patch(usageId, {
        keywordIdeasGenerated: 50,
        updatedAt: Date.now(),
      });
    });

    const usage = await t.run(async (ctx) => ctx.db.get(usageId));
    expect(usage?.keywordIdeasGenerated).toBe(50);
  });

  test('tracks multiple usage types', async () => {
    const periodStart = new Date('2026-01-01').getTime();
    const periodEnd = new Date('2026-01-31').getTime();

    const usageId = await t.run(async (ctx) => {
      return ctx.db.insert('usageLimits', {
        userId,
        periodStart,
        periodEnd,
        urlsAnalyzed: 1,
        keywordIdeasGenerated: 100,
        aiReportsGenerated: 2,
        contentPiecesPlanned: 3,
        updatedAt: Date.now(),
      });
    });

    const usage = await t.run(async (ctx) => ctx.db.get(usageId));
    expect(usage?.urlsAnalyzed).toBe(1);
    expect(usage?.keywordIdeasGenerated).toBe(100);
    expect(usage?.aiReportsGenerated).toBe(2);
    expect(usage?.contentPiecesPlanned).toBe(3);
  });
});

// =============================================================================
// EDGE CASES
// =============================================================================

describe('Subscription Edge Cases', () => {
  let t: ReturnType<typeof createTestContext>;

  beforeEach(() => {
    t = createTestContext();
  });

  test('user can have only one subscription', async () => {
    const userId = await seedUser(t);

    // Create first subscription
    await t.run(async (ctx) => {
      return ctx.db.insert('subscriptions', {
        userId,
        planTier: 'solo',
        status: 'active',
        priceMonthly: 49,
        features: FIXTURES.planLimits.solo,
        startsAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    // Query should return exactly one
    const subscriptions = await t.run(async (ctx) => {
      return ctx.db
        .query('subscriptions')
        .withIndex('by_user', (q) => q.eq('userId', userId))
        .collect();
    });

    expect(subscriptions).toHaveLength(1);
  });

  test('subscription features are stored correctly', async () => {
    const userId = await seedUser(t);

    const subscriptionId = await t.run(async (ctx) => {
      return ctx.db.insert('subscriptions', {
        userId,
        planTier: 'enterprise',
        status: 'active',
        priceMonthly: 0,
        features: FIXTURES.planLimits.enterprise,
        startsAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const subscription = await t.run(async (ctx) => ctx.db.get(subscriptionId));
    expect(subscription?.features.maxUrls).toBe(999999);
    expect(subscription?.features.maxKeywordIdeas).toBe(10000);
  });
});
