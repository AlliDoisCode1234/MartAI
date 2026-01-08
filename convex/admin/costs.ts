import { query } from '../_generated/server';
import { v } from 'convex/values';
import { requireSuperAdmin } from '../lib/rbac';

/**
 * Get all AI costs across all users (Super Admin only).
 * Returns recent cost records with user info.
 * Security: Cost data is sensitive, requires super_admin role.
 */
export const getAllAICosts = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Security: Only super_admin can view all costs
    await requireSuperAdmin(ctx);

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
 * Get AI cost summary statistics for admin dashboard (Super Admin only).
 * Security: Cost data is sensitive, requires super_admin role.
 */
export const getAICostSummary = query({
  args: {},
  handler: async (ctx) => {
    // Security: Only super_admin can view cost summaries
    await requireSuperAdmin(ctx);

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

    // Calculate daily costs for trend chart (last 7 days)
    const now = Date.now();
    const dailyCosts: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = now - i * 24 * 60 * 60 * 1000;
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      const dayCost = allCosts
        .filter((c: any) => c._creationTime >= dayStart && c._creationTime < dayEnd)
        .reduce((sum: number, c: any) => sum + (c.cost?.totalCost || 0), 0);
      const date = new Date(dayStart).toISOString().slice(0, 10);
      // Store as count for TrendChart compatibility (multiply by 100 for visibility)
      dailyCosts.push({ date, count: Math.round(dayCost * 100) });
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
      dailyCosts,
    };
  },
});
