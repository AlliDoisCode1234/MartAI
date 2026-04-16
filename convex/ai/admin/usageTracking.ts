/**
 * AI Usage Tracking
 *
 * Records and aggregates AI usage for cost tracking.
 * Part of INFRA-003: AI Cost Tracking Dashboard.
 */

import { v } from 'convex/values';
import { internalMutation, query, internalQuery } from '../../_generated/server';
import { Id } from '../../_generated/dataModel';
import { requireSuperAdmin } from '../../lib/rbac';
import { getMaxTokensForTier } from '../../lib/tierLimits';

// Model cost rates per 1K tokens (in USD)
const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  // OpenAI
  'gpt-4o': { input: 0.0025, output: 0.01 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'o3-mini': { input: 0.0011, output: 0.0044 },
  // Anthropic
  'claude-sonnet-4-20250514': { input: 0.003, output: 0.015 },
  'claude-haiku-4-20251015': { input: 0.00025, output: 0.00125 },
  'claude-opus-4-20250522': { input: 0.015, output: 0.075 },
  // Google
  'gemini-2.5-flash': { input: 0.00015, output: 0.0006 },
  'gemini-2.0-flash': { input: 0.000075, output: 0.0003 },
  'gemini-2.5-pro': { input: 0.00125, output: 0.005 },
};

/**
 * Calculate cost in USD from token usage (cache-aware)
 */
function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number,
  cachedTokens: number = 0,
  cacheCreationTokens: number = 0
): number {
  const rates = MODEL_COSTS[model] || { input: 0.001, output: 0.002 };

  // Uncached input tokens at full price
  const uncachedInputTokens = Math.max(0, inputTokens - cachedTokens - cacheCreationTokens);
  const inputCost = (uncachedInputTokens / 1000) * rates.input;

  // Cache reads: Anthropic = 10% of input price, OpenAI = 50%, Google = implicit (free)
  let cacheReadDiscount = 0.5; // default (OpenAI)
  if (model.startsWith('claude')) cacheReadDiscount = 0.1;
  else if (model.startsWith('gemini')) cacheReadDiscount = 0;
  const cacheCost = (cachedTokens / 1000) * rates.input * cacheReadDiscount;

  // Cache writes: Anthropic = 125% of input price, others = free
  const cacheWriteMultiplier = model.startsWith('claude') ? 1.25 : 1.0;
  const cacheWriteCost = (cacheCreationTokens / 1000) * rates.input * cacheWriteMultiplier;

  const outputCost = (outputTokens / 1000) * rates.output;
  return Math.round((inputCost + cacheCost + cacheWriteCost + outputCost) * 1000000) / 1000000;
}

/**
 * Get date key in YYYY-MM-DD format
 */
function getDateKey(timestamp: number = Date.now()): string {
  const date = new Date(timestamp);
  return date.toISOString().split('T')[0];
}

/**
 * Record AI usage (called internally after each AI request)
 */
export const recordUsage = internalMutation({
  args: {
    userId: v.id('users'),
    projectId: v.optional(v.id('projects')),
    provider: v.string(),
    model: v.string(),
    taskType: v.string(),
    inputTokens: v.number(),
    outputTokens: v.number(),
    cachedTokens: v.optional(v.number()),
    cacheCreationTokens: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const dateKey = getDateKey();
    const cachedTokens = args.cachedTokens || 0;
    const cacheCreationTokens = args.cacheCreationTokens || 0;
    const cost = calculateCost(args.model, args.inputTokens, args.outputTokens, cachedTokens, cacheCreationTokens);
    const now = Date.now();

    // Try to find existing aggregation record for this user/project/provider/model/day
    const existing = await ctx.db
      .query('aiUsage')
      .withIndex('by_user_date', (q) => q.eq('userId', args.userId).eq('dateKey', dateKey))
      .filter((q) =>
        q.and(
          q.eq(q.field('provider'), args.provider),
          q.eq(q.field('model'), args.model),
          q.eq(q.field('projectId'), args.projectId)
        )
      )
      .first();

    if (existing) {
      // Update existing record
      const taskBreakdown = existing.taskBreakdown || {};
      const taskCount = (taskBreakdown[args.taskType as keyof typeof taskBreakdown] || 0) + 1;

      await ctx.db.patch(existing._id, {
        requestCount: existing.requestCount + 1,
        inputTokens: existing.inputTokens + args.inputTokens,
        outputTokens: existing.outputTokens + args.outputTokens,
        totalTokens: existing.totalTokens + args.inputTokens + args.outputTokens,
        costUsd: existing.costUsd + cost,
        cachedTokens: (existing.cachedTokens || 0) + cachedTokens,
        cacheCreationTokens: (existing.cacheCreationTokens || 0) + cacheCreationTokens,
        taskBreakdown: {
          ...taskBreakdown,
          [args.taskType]: taskCount,
        },
        updatedAt: now,
      });

      return { type: 'updated', id: existing._id, cost };
    } else {
      // Create new record
      const id = await ctx.db.insert('aiUsage', {
        userId: args.userId,
        projectId: args.projectId,
        provider: args.provider,
        model: args.model,
        dateKey,
        requestCount: 1,
        inputTokens: args.inputTokens,
        outputTokens: args.outputTokens,
        totalTokens: args.inputTokens + args.outputTokens,
        costUsd: cost,
        cachedTokens,
        cacheCreationTokens,
        taskBreakdown: {
          [args.taskType]: 1,
        },
        createdAt: now,
        updatedAt: now,
      });

      return { type: 'created', id, cost };
    }
  },
});

/**
 * Get usage summary for current month (for admin dashboard)
 */
export const getMonthlyUsageSummary = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startDateKey = startOfMonth.toISOString().split('T')[0];

    // Use by_dateKey index to fetch only current month records (avoids full table scan)
    const monthlyUsage = await ctx.db
      .query('aiUsage')
      .withIndex('by_dateKey', (q) => q.gte('dateKey', startDateKey))
      .collect();

    // Aggregate by provider
    const byProvider: Record<string, { cost: number; tokens: number; requests: number }> = {};
    let totalCost = 0;
    let totalTokens = 0;
    let totalRequests = 0;

    for (const usage of monthlyUsage) {
      totalCost += usage.costUsd;
      totalTokens += usage.totalTokens;
      totalRequests += usage.requestCount;

      if (!byProvider[usage.provider]) {
        byProvider[usage.provider] = { cost: 0, tokens: 0, requests: 0 };
      }
      byProvider[usage.provider].cost += usage.costUsd;
      byProvider[usage.provider].tokens += usage.totalTokens;
      byProvider[usage.provider].requests += usage.requestCount;
    }

    return {
      totalCost: Math.round(totalCost * 100) / 100,
      totalTokens,
      totalRequests,
      byProvider: Object.entries(byProvider).map(([name, data]) => ({
        provider: name,
        cost: Math.round(data.cost * 100) / 100,
        tokens: data.tokens,
        requests: data.requests,
      })),
      startDate: startDateKey,
      endDate: getDateKey(),
    };
  },
});

/**
 * Get usage for a specific user
 */
export const getUserUsage = query({
  args: {
    userId: v.id('users'),
    days: v.optional(v.number()), // Default 30
  },
  handler: async (ctx, args) => {
    const days = args.days || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateKey = startDate.toISOString().split('T')[0];

    const usage = await ctx.db
      .query('aiUsage')
      .withIndex('by_user_date', (q) => q.eq('userId', args.userId))
      .filter((q) => q.gte(q.field('dateKey'), startDateKey))
      .collect();

    const totalCost = usage.reduce((sum, u) => sum + u.costUsd, 0);
    const totalTokens = usage.reduce((sum, u) => sum + u.totalTokens, 0);
    const totalRequests = usage.reduce((sum, u) => sum + u.requestCount, 0);

    return {
      totalCost: Math.round(totalCost * 100) / 100,
      totalTokens,
      totalRequests,
      days,
      records: usage.length,
    };
  },
});

/**
 * Get daily cost trend (for charts)
 */
export const getDailyCostTrend = query({
  args: {
    days: v.optional(v.number()), // Default 7
  },
  handler: async (ctx, args) => {
    const days = args.days || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateKey = startDate.toISOString().split('T')[0];

    // Use by_dateKey index to fetch only recent records (avoids full table scan)
    const recentUsage = await ctx.db
      .query('aiUsage')
      .withIndex('by_dateKey', (q) => q.gte('dateKey', startDateKey))
      .collect();

    // Group by date
    const byDate: Record<string, number> = {};
    for (const usage of recentUsage) {
      byDate[usage.dateKey] = (byDate[usage.dateKey] || 0) + usage.costUsd;
    }

    // Build ordered array
    const trend: Array<{ date: string; cost: number }> = [];
    const current = new Date(startDate);
    const endDate = new Date();

    while (current <= endDate) {
      const dateKey = current.toISOString().split('T')[0];
      trend.push({
        date: dateKey,
        cost: Math.round((byDate[dateKey] || 0) * 100) / 100,
      });
      current.setDate(current.getDate() + 1);
    }

    return trend;
  },
});

/**
 * Get prompt cache savings summary (for admin dashboard card)
 */
export const getCacheSavingsSummary = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startDateKey = startOfMonth.toISOString().split('T')[0];

    // Use by_dateKey index to fetch only current month records (avoids full table scan)
    const monthlyUsage = await ctx.db
      .query('aiUsage')
      .withIndex('by_dateKey', (q) => q.gte('dateKey', startDateKey))
      .collect();

    let totalCachedTokens = 0;
    let totalCacheCreationTokens = 0;
    let totalInputTokens = 0;
    let estimatedSavingsUsd = 0;

    for (const usage of monthlyUsage) {
      const cached = usage.cachedTokens || 0;
      const cacheCreation = usage.cacheCreationTokens || 0;
      totalCachedTokens += cached;
      totalCacheCreationTokens += cacheCreation;
      totalInputTokens += usage.inputTokens;

      // Estimate savings: what we would have paid at full price vs what we actually paid
      if (cached > 0) {
        const rates = MODEL_COSTS[usage.model] || { input: 0.001 };
        const fullPriceCost = (cached / 1000) * rates.input;

        // Provider-specific cache discount
        let discount = 0.5; // OpenAI default
        if (usage.model.startsWith('claude')) discount = 0.1;
        else if (usage.model.startsWith('gemini')) discount = 0;

        const actualCost = (cached / 1000) * rates.input * discount;
        estimatedSavingsUsd += fullPriceCost - actualCost;
      }
    }

    const cacheHitRate =
      totalInputTokens > 0 ? Math.round((totalCachedTokens / totalInputTokens) * 100) : 0;

    return {
      totalCachedTokens,
      totalCacheCreationTokens,
      totalInputTokens,
      cacheHitRate, // Percentage of input tokens served from cache
      estimatedSavingsUsd: Math.round(estimatedSavingsUsd * 100) / 100,
      startDate: startDateKey,
    };
  },
});

/**
 * FIX-003: Get AI cost per user for current month (for admin dashboard)
 *
 * Aggregates aiUsage by userId → returns avg cost per active AI user,
 * plus top 5 users by cost. Enables CAC vs AI spend comparison.
 *
 * Security: Exposes user emails and spend metrics — requires super_admin role.
 */
export const getCostPerUser = query({
  args: {},
  handler: async (ctx) => {
    // Security: Only super_admin can view per-user cost breakdowns
    await requireSuperAdmin(ctx);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startDateKey = startOfMonth.toISOString().split('T')[0];

    // Use by_dateKey index to fetch only current month records (avoids full table scan)
    const monthlyUsage = await ctx.db
      .query('aiUsage')
      .withIndex('by_dateKey', (q) => q.gte('dateKey', startDateKey))
      .collect();

    // Group by userId
    const byUser: Record<string, { cost: number; tokens: number; requests: number }> = {};

    for (const usage of monthlyUsage) {
      const uid = usage.userId;
      if (!byUser[uid]) {
        byUser[uid] = { cost: 0, tokens: 0, requests: 0 };
      }
      byUser[uid].cost += usage.costUsd;
      byUser[uid].tokens += usage.totalTokens;
      byUser[uid].requests += usage.requestCount;
    }

    const activeUsers = Object.keys(byUser).length;
    const totalCost = Object.values(byUser).reduce((sum, u) => sum + u.cost, 0);
    const avgCostPerUser = activeUsers > 0 ? totalCost / activeUsers : 0;

    // Top 5 users by cost (fetch email for admin identification)
    const sorted = Object.entries(byUser)
      .sort(([, a], [, b]) => b.cost - a.cost)
      .slice(0, 5);

    const topUsers = await Promise.all(
      sorted.map(async ([userId, data]) => {
        // O(1) direct lookup by ID instead of scanning users table
        const user = await ctx.db.get(userId as Id<'users'>);
        return {
          userId,
          email: user?.email ?? 'unknown',
          cost: Math.round(data.cost * 100) / 100,
          tokens: data.tokens,
          requests: data.requests,
        };
      })
    );

    return {
      avgCostPerUser: Math.round(avgCostPerUser * 100) / 100,
      activeAIUsers: activeUsers,
      totalCost: Math.round(totalCost * 100) / 100,
      topUsers,
      startDate: startDateKey,
    };
  },
});

/**
 * Check if user has exceeded their rolling 30-day token limit.
 * Used by the AI Router circuit breaker.
 */
export const checkTokenLimit = internalQuery({
  args: { userId: v.id('users') },
  handler: async (ctx: any, args: any) => {
    // 1. Get tier limit for user
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error('[usageTracking] User not found during token limit check');
    }
    
    // Admins bypass token limits for product testing/maintenance
    if (user.role === 'admin' || user.role === 'super_admin') {
      return { 
        allowed: true, 
        usedTokens: 0, 
        maxTokens: Number.MAX_SAFE_INTEGER 
      };
    }

    // We import getMaxTokensForTier dynamically or statically
    const maxTokens = getMaxTokensForTier(user.membershipTier || 'starter');
    
    // 2. Sum up total tokens across the last 30 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const startDateKey = startDate.toISOString().split('T')[0];

    // Using index to efficiently fetch 30 days of data for this user
    const usage = await ctx.db
      .query('aiUsage')
      .withIndex('by_user_date', (q: any) => 
        q.eq('userId', args.userId).gte('dateKey', startDateKey)
      )
      .collect();

    const usedTokens = usage.reduce((sum: number, u: any) => sum + u.totalTokens, 0);

    return { 
      allowed: usedTokens < maxTokens, 
      usedTokens, 
      maxTokens 
    };
  },
});

