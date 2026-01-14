/**
 * AI Usage Tracking
 *
 * Records and aggregates AI usage for cost tracking.
 * Part of INFRA-003: AI Cost Tracking Dashboard.
 */

import { v } from 'convex/values';
import { internalMutation, query, QueryCtx } from '../../_generated/server';
import { Id } from '../../_generated/dataModel';

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
 * Calculate cost in USD from token usage
 */
function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
  const rates = MODEL_COSTS[model] || { input: 0.001, output: 0.002 }; // Default fallback
  const inputCost = (inputTokens / 1000) * rates.input;
  const outputCost = (outputTokens / 1000) * rates.output;
  return Math.round((inputCost + outputCost) * 1000000) / 1000000; // 6 decimal precision
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
  },
  handler: async (ctx, args) => {
    const dateKey = getDateKey();
    const cost = calculateCost(args.model, args.inputTokens, args.outputTokens);
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

    // Get all usage records for current month
    const allUsage = await ctx.db.query('aiUsage').collect();
    const monthlyUsage = allUsage.filter((u) => u.dateKey >= startDateKey);

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

    const allUsage = await ctx.db.query('aiUsage').collect();
    const recentUsage = allUsage.filter((u) => u.dateKey >= startDateKey);

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
