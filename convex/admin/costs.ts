import { query } from '../_generated/server';
import { components } from '../_generated/api';
import { v } from 'convex/values';

/**
 * Get all AI costs across all users (for super admin dashboard).
 * Returns recent cost records with user info.
 */
export const getAllAICosts = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    // Query the neutralCost aiCosts table directly
    const costs = await ctx.db
      .query('neutralCost:aiCosts' as any)
      .order('desc')
      .take(limit);

    return costs;
  },
});

/**
 * Get AI cost summary statistics for admin dashboard.
 */
export const getAICostSummary = query({
  args: {},
  handler: async (ctx) => {
    // Get all costs to calculate totals
    const allCosts = await ctx.db.query('neutralCost:aiCosts' as any).collect();

    // Calculate totals
    const totalCost = allCosts.reduce((sum: number, c: any) => sum + (c.cost?.totalCost || 0), 0);

    const totalTokens = allCosts.reduce(
      (sum: number, c: any) => sum + (c.usage?.totalTokens || 0),
      0
    );

    // Group by model
    const byModel: Record<string, { cost: number; count: number }> = {};
    for (const c of allCosts) {
      const model = (c as any).modelId || 'unknown';
      if (!byModel[model]) {
        byModel[model] = { cost: 0, count: 0 };
      }
      byModel[model].cost += c.cost?.totalCost || 0;
      byModel[model].count += 1;
    }

    return {
      totalCost,
      totalTokens,
      totalGenerations: allCosts.length,
      byModel: Object.entries(byModel).map(([model, data]) => ({
        model,
        cost: data.cost,
        count: data.count,
      })),
    };
  },
});
