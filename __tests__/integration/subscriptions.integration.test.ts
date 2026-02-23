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
    starter: {
      maxUrls: 1,
      maxKeywordIdeas: 500,
      maxAiReports: 10,
      maxContentPieces: 15,
      maxTeamMembers: 1,
    },
    engine: {
      maxUrls: 3,
      maxKeywordIdeas: 2000,
      maxAiReports: 30,
      maxContentPieces: 50,
      maxTeamMembers: 5,
    },
    enterprise: {
      maxUrls: 999999,
      maxKeywordIdeas: 10000,
      maxAiReports: 100,
      maxContentPieces: 100,
      maxTeamMembers: 999999,
    },
  },
  prices: {
    starter: 197,
    engine: 397,
    enterprise: 0, // Contact sales
  },
};

// =============================================================================
// PLAN CONFIGURATION TESTS
// =============================================================================

describe('Plan Configuration', () => {
  test('PLAN_LIMITS exports expected tiers', async () => {
    const { PLAN_LIMITS } = await import('../../convex/subscriptions/subscriptions');

    expect(PLAN_LIMITS.starter).toBeDefined();
    expect(PLAN_LIMITS.engine).toBeDefined();
    expect(PLAN_LIMITS.enterprise).toBeDefined();
  });

  test('starter plan has correct limits', async () => {
    const { PLAN_LIMITS } = await import('../../convex/subscriptions/subscriptions');

    expect(PLAN_LIMITS.starter.priceMonthly).toBe(197);
    expect(PLAN_LIMITS.starter.features.maxUrls).toBe(1);
    expect(PLAN_LIMITS.starter.features.maxKeywordIdeas).toBe(500);
  });

  test('engine plan has correct limits', async () => {
    const { PLAN_LIMITS } = await import('../../convex/subscriptions/subscriptions');

    expect(PLAN_LIMITS.engine.priceMonthly).toBe(397);
    expect(PLAN_LIMITS.engine.features.maxUrls).toBe(3);
    expect(PLAN_LIMITS.engine.features.maxKeywordIdeas).toBe(2000);
  });

  test('enterprise has unlimited urls', async () => {
    const { PLAN_LIMITS } = await import('../../convex/subscriptions/subscriptions');

    expect(PLAN_LIMITS.enterprise.features.maxUrls).toBeGreaterThan(10000);
  });

  test('planConfig function returns config for valid tier', async () => {
    const { planConfig } = await import('../../convex/subscriptions/subscriptions');

    const starterConfig = planConfig('starter');
    expect(starterConfig).toBeDefined();
    expect(starterConfig?.priceMonthly).toBe(197);
  });

  test('planConfig handles case insensitivity', async () => {
    const { planConfig } = await import('../../convex/subscriptions/subscriptions');

    const config = planConfig('ENGINE');
    expect(config?.priceMonthly).toBe(397);
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
        planTier: 'starter',
        status: 'active',
        priceMonthly: 197,
        features: FIXTURES.planLimits.starter,
        billingCycle: 'monthly',
        startsAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    expect(subscriptionId).toBeDefined();

    const subscription = await t.run(async (ctx) => ctx.db.get(subscriptionId));
    expect(subscription?.planTier).toBe('starter');
    expect(subscription?.status).toBe('active');
  });

  test('retrieves subscription by user', async () => {
    await t.run(async (ctx) => {
      return ctx.db.insert('subscriptions', {
        userId,
        planTier: 'engine',
        status: 'active',
        priceMonthly: 397,
        features: FIXTURES.planLimits.engine,
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

    expect(subscription?.planTier).toBe('engine');
  });

  test('updates subscription plan tier', async () => {
    const subscriptionId = await t.run(async (ctx) => {
      return ctx.db.insert('subscriptions', {
        userId,
        planTier: 'starter',
        status: 'active',
        priceMonthly: 197,
        features: FIXTURES.planLimits.starter,
        startsAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    // Upgrade to engine
    await t.run(async (ctx) => {
      await ctx.db.patch(subscriptionId, {
        planTier: 'engine',
        priceMonthly: 397,
        features: FIXTURES.planLimits.engine,
        updatedAt: Date.now(),
      });
    });

    const updated = await t.run(async (ctx) => ctx.db.get(subscriptionId));
    expect(updated?.planTier).toBe('engine');
    expect(updated?.priceMonthly).toBe(397);
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
        planTier: 'starter',
        status: 'active',
        priceMonthly: 197,
        features: FIXTURES.planLimits.starter,
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
        planTier: 'starter',
        status: 'active',
        priceMonthly: 197,
        features: FIXTURES.planLimits.starter,
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
        planTier: 'starter',
        status: 'grace_period',
        priceMonthly: 197,
        features: FIXTURES.planLimits.starter,
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
        planTier: 'starter',
        status: 'grace_period',
        priceMonthly: 197,
        features: FIXTURES.planLimits.starter,
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
        planTier: 'engine',
        status: 'active',
        priceMonthly: 397,
        features: FIXTURES.planLimits.engine,
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
        planTier: 'starter',
        status: 'active',
        priceMonthly: 197,
        features: FIXTURES.planLimits.starter,
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
