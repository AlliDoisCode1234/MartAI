import { internalQuery, internalMutation, query } from '../_generated/server';
import { v } from 'convex/values';
import { requireSuperAdmin } from '../lib/rbac';

export const getCache = internalQuery({
  args: { inputHash: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    const rows = await ctx.db
      .query('dataForSeoCache')
      .withIndex('by_hash', (q) => q.eq('inputHash', args.inputHash))
      .filter((q) => q.gt(q.field('expiresAt'), now))
      .collect();

    if (rows.length === 0) return null;

    // Return the most recently created unexpired row
    rows.sort((a, b) => b.createdAt - a.createdAt);
    return rows[0];
  },
});

export const setCache = internalMutation({
  args: {
    inputHash: v.string(),
    endpoint: v.string(),
    response: v.any(),
  },
  handler: async (ctx, args) => {
    const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
    const now = Date.now();

    // Prevent uncontrollable table growth by clearing out all existing hashes for this input
    const existing = await ctx.db
      .query('dataForSeoCache')
      .withIndex('by_hash', (q) => q.eq('inputHash', args.inputHash))
      .collect();

    for (const row of existing) {
      await ctx.db.delete(row._id);
    }

    await ctx.db.insert('dataForSeoCache', {
      inputHash: args.inputHash,
      endpoint: args.endpoint,
      response: args.response,
      createdAt: now,
      expiresAt: now + TTL_MS,
    });
  },
});

// ==========================================
// DFS COST ACCUMULATOR (Enterprise Governance)
// ==========================================

/**
 * Record DataForSEO API spend from the response's `cost` field.
 * Writes to the shared `aiUsage` table so DFS costs surface in the
 * existing admin BI dashboard alongside AI provider spend.
 *
 * Security: internalMutation — never callable from client.
 */
export const recordDfsCost = internalMutation({
  args: {
    endpoint: v.string(),
    costUsd: v.number(),
  },
  handler: async (ctx, args) => {
    // Skip zero-cost responses (cache hits, mock mode)
    if (args.costUsd <= 0) return;

    const now = Date.now();
    const dateKey = new Date(now).toISOString().split('T')[0];

    // Map DFS endpoint to a human-readable model name for the admin dashboard
    const modelName = args.endpoint.includes('keyword_ideas')
      ? 'dfs-labs-keywords'
      : args.endpoint.includes('serp')
        ? 'dfs-serp-organic'
        : 'dfs-other';

    // Check for existing aggregation record for today's DFS spend
    const existing = await ctx.db
      .query('aiUsage')
      .withIndex('by_provider', (q) => q.eq('provider', 'dataforseo').eq('dateKey', dateKey))
      .filter((q) => q.eq(q.field('model'), modelName))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        requestCount: existing.requestCount + 1,
        costUsd: existing.costUsd + args.costUsd,
        updatedAt: now,
      });
    } else {
      // Placeholder userId for system-level DFS tracking
      // DFS calls are internal actions without user context — use a synthetic key
      // We query by provider='dataforseo' so userId is just for schema compliance
      const systemUser = await ctx.db.query('users').first();
      if (!systemUser) return; // Impossible in production, but safe guard

      await ctx.db.insert('aiUsage', {
        userId: systemUser._id,
        provider: 'dataforseo',
        model: modelName,
        dateKey,
        requestCount: 1,
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        costUsd: args.costUsd,
        taskBreakdown: { other: 1 },
        createdAt: now,
        updatedAt: now,
      });
    }

    console.log(`[DFS Cost] ${modelName}: $${args.costUsd.toFixed(4)} recorded for ${dateKey}`);
  },
});

/**
 * Get DataForSEO spend summary for the admin dashboard.
 * Security: Super Admin only — exposes cost data.
 */
export const getDfsCostSummary = query({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireSuperAdmin(ctx);

    const days = args.days ?? 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateKey = startDate.toISOString().split('T')[0];

    const records = await ctx.db
      .query('aiUsage')
      .withIndex('by_provider', (q) => q.eq('provider', 'dataforseo').gte('dateKey', startDateKey))
      .collect();

    let totalCost = 0;
    let totalRequests = 0;
    const byEndpoint: Record<string, { cost: number; requests: number }> = {};
    const dailyTrend: Record<string, number> = {};

    for (const record of records) {
      totalCost += record.costUsd;
      totalRequests += record.requestCount;

      if (!byEndpoint[record.model]) {
        byEndpoint[record.model] = { cost: 0, requests: 0 };
      }
      byEndpoint[record.model].cost += record.costUsd;
      byEndpoint[record.model].requests += record.requestCount;

      dailyTrend[record.dateKey] = (dailyTrend[record.dateKey] || 0) + record.costUsd;
    }

    return {
      totalCost: Math.round(totalCost * 10000) / 10000,
      totalRequests,
      budgetRemaining: Math.round((50 - totalCost) * 100) / 100, // $50 credit tracking
      byEndpoint: Object.entries(byEndpoint).map(([model, data]) => ({
        endpoint: model,
        cost: Math.round(data.cost * 10000) / 10000,
        requests: data.requests,
      })),
      dailyTrend: Object.entries(dailyTrend)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, cost]) => ({ date, cost: Math.round(cost * 10000) / 10000 })),
      days,
      startDate: startDateKey,
    };
  },
});
