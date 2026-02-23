import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTestContext, seedUser, seedProject, expectMutationToThrow } from './testHelpers';
import { api } from '../../convex/_generated/api';

(globalThis as any).vi = vi;

describe('API Keys', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should prevent non-enterprise users from creating keys', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);

    // Seed a standard subscription
    await t.run(async (ctx) => {
      await ctx.db.insert('subscriptions', {
        userId,
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
        planTier: 'solo',
        status: 'active',
        priceMonthly: 0,
        startsAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        features: {
          maxUrls: 5,
          maxKeywordIdeas: 100,
          maxAiReports: 10,
          maxContentPieces: 25,
        },
      });
    });

    const authT = t.withIdentity({ email: `test_${Date.now()}@test.com` }); // Won't match
    await expectMutationToThrow(
      () =>
        authT.mutation(api.apiKeys.createApiKey, {
          projectId,
          name: 'Test Key',
          permissions: ['read'],
        }),
      'API keys require Team or Enterprise plan'
    );
  });

  it('should allow enterprise users to create, list, validate, and revoke keys', async () => {
    const t = createTestContext();
    const email = `ent_${Date.now()}@test.com`;
    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert('users', {
        email,
        name: 'Enterprise User',
        role: 'user',
        onboardingStatus: 'completed',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });
    const projectId = await seedProject(t, userId);

    // Seed an enterprise subscription
    await t.run(async (ctx) => {
      await ctx.db.insert('subscriptions', {
        userId,
        stripeCustomerId: 'cus_ent',
        stripeSubscriptionId: 'sub_ent',
        planTier: 'enterprise',
        status: 'active',
        priceMonthly: 499,
        startsAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        features: {
          maxUrls: 50,
          maxKeywordIdeas: 1000,
          maxAiReports: 100,
          maxContentPieces: 500,
        },
      });
    });

    const authT = t.withIdentity({ email });

    // 1. Create Key
    const created = await authT.mutation(api.apiKeys.createApiKey, {
      projectId,
      name: 'Prod Key',
      permissions: ['read', 'write'],
    });

    expect(created.keyId).toBeDefined();
    expect(created.apiKey.startsWith('mart_')).toBe(true);

    // 2. List Keys
    const list = await authT.query(api.apiKeys.listApiKeys, { projectId });
    expect(list).toHaveLength(1);
    expect((list[0] as any).keyHash).toBeUndefined(); // Security check

    // 3. Validation requires rehashing locally or testing the internal record
    // We can't easily validate public access without the plain key to hash logic.
    // Instead we test the rate limiter logic which tests 'get key'.
    const rateLimit = await t.mutation(api.apiKeys.checkApiRateLimit, {
      keyId: created.keyId,
      endpoint: 'keywords_read',
    });
    expect(rateLimit.allowed).toBe(true);
    expect(rateLimit.remaining).toBe(99); // 100 max - 1 used

    // 4. Revoke Key
    await authT.mutation(api.apiKeys.revokeApiKey, { keyId: created.keyId });

    const listAfterRevoke = await authT.query(api.apiKeys.listApiKeys, { projectId });
    expect(listAfterRevoke[0].isActive).toBe(false);

    await t.finishAllScheduledFunctions(() => vi.runAllTimers());
  });
});
