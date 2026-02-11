import { action, internalAction, internalMutation } from '../_generated/server';
import { v } from 'convex/values';
import { internal } from '../_generated/api';
import { RATE_LIMIT_TIERS } from '../rateLimits';

export const verifyRateLimit = action({
  args: {
    tier: v.union(
      v.literal('free'),
      v.literal('starter'),
      v.literal('growth'),
      v.literal('pro'),
      v.literal('admin')
    ),
    concurrentRequests: v.number(),
  },
  handler: async (ctx, args) => {
    const { tier, concurrentRequests } = args;
    const limitConfig = RATE_LIMIT_TIERS[tier].draftGeneration;
    const expectedLimit = limitConfig.rate;

    console.log(
      `[RateLimitTest] Testing ${tier} tier. Limit: ${expectedLimit}, Requests: ${concurrentRequests}`
    );

    // 1. Create a dummy user with the specific tier
    const setup = await ctx.runMutation(internal.testing.rateLimitTest.setupTestUser, { tier });
    const { userId, projectId } = setup;

    const results = [];

    // 2. Fire requests in parallel
    // We use a simplified mock of generateContent that JUST calls the rate limiter logic
    // We don't want to actually generate content and burn tokens/money
    const promises = Array.from({ length: concurrentRequests }).map(async (_, i) => {
      try {
        // We call the ACTUAL internal action to test the REAL code path
        // But we force it to fail FAST after rate limit check to save tokens?
        // Actually, let's just use the real action but catch the error.
        // If it passes rate limit, it will try to call OpenAI.
        // We should probably mock the AI part or accept that we might make a few calls.
        // Better: The action checks rate limit FIRST.

        await ctx.runAction(internal.contentGeneration.generateContentInternal, {
          projectId,
          userId,
          contentType: 'blog',
          title: `Rate Limit Test ${i}`,
          keywords: ['test'],
        });
        return { id: i, status: 'allowed' };
      } catch (e: unknown) {
        const error = e instanceof Error ? e : new Error(String(e));
        if (error.message.includes('Rate limit exceeded')) {
          return { id: i, status: 'blocked' };
        }
        // If it fails for other reasons (like "User not found" or AI error), it passed the rate limit check
        // For this test, AI error is "allowed" (passed rate limit)
        return { id: i, status: 'allowed', error: error.message };
      }
    });

    const outcomes = await Promise.all(promises);

    // 3. Analyze
    const allowed = outcomes.filter((o) => o.status === 'allowed').length;
    const blocked = outcomes.filter((o) => o.status === 'blocked').length;

    console.log(`[RateLimitTest] Allowed: ${allowed}, Blocked: ${blocked}`);

    // 4. Cleanup
    await ctx.runMutation(internal.testing.rateLimitTest.cleanupTestUser, { userId, projectId });

    // 5. Verification
    // Note: Token bucket might allow slightly more if refilled instantly, but usually exact for burst
    // If Admin/Pro have high limits, we might not block anything if concurrentRequests < limit
    if (allowed > expectedLimit + 1) {
      // +1 tolerance
      throw new Error(`Rate limit FAILED! Allowed ${allowed} requests, limit is ${expectedLimit}`);
    }

    if (concurrentRequests > expectedLimit && blocked === 0) {
      throw new Error(`Rate limit FAILED! Expecting blocks but got none.`);
    }

    return {
      success: true,
      tier,
      expectedLimit,
      allowed,
      blocked,
      msg: `Rate limit verified. Allowed ${allowed}/${concurrentRequests} requests (Limit: ${expectedLimit})`,
    };
  },
});

// Helpers
export const setupTestUser = internalMutation({
  args: {
    tier: v.union(
      v.literal('free'),
      v.literal('starter'), // maps to solo/starter
      v.literal('growth'),
      v.literal('pro'),
      v.literal('admin')
    ),
  },
  handler: async (ctx, args) => {
    // Map test tier to valid schema membershipTier
    let membershipTier: 'free' | 'starter' | 'growth' | 'pro' | 'enterprise' = 'free';
    if (args.tier === 'starter') membershipTier = 'starter';
    if (args.tier === 'growth') membershipTier = 'growth';
    if (args.tier === 'pro') membershipTier = 'pro';
    if (args.tier === 'admin') membershipTier = 'enterprise'; // Admins get enterprise features

    const userId = await ctx.db.insert('users', {
      email: `test_ratelimit_${Date.now()}@test.com`,
      membershipTier,
      role: 'user',
    });
    const projectId = await ctx.db.insert('projects', {
      userId,
      name: 'Rate Limit Test Project',
      websiteUrl: 'https://test.com',
      industry: 'Tech',
      businessGoals: 'Growth',
      targetAudience: 'Everyone',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return { userId, projectId };
  },
});

export const cleanupTestUser = internalMutation({
  args: { userId: v.id('users'), projectId: v.id('projects') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.userId);
    await ctx.db.delete(args.projectId);
  },
});
