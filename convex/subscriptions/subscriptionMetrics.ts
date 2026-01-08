import { query } from '../_generated/server';
import { requireSuperAdmin } from '../lib/rbac';
import { PLAN_LIMITS } from './subscriptions';

/**
 * Subscription Metrics for BI Dashboard
 *
 * Provides MRR, churn, and subscriber counts.
 * Security: super_admin only
 */

export const getSubscriptionMetrics = query({
  args: {},
  handler: async (ctx) => {
    await requireSuperAdmin(ctx);

    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const sixtyDaysAgo = now - 60 * 24 * 60 * 60 * 1000;

    // Get all subscriptions
    const allSubscriptions = await ctx.db.query('subscriptions').collect();

    // Current active subscriptions
    const activeSubscriptions = allSubscriptions.filter((s) => s.status === 'active');

    // Calculate MRR from active subscriptions
    const mrr = activeSubscriptions.reduce((sum, sub) => {
      const tier = sub.planTier?.toLowerCase() || 'solo';
      const plan = PLAN_LIMITS[tier as keyof typeof PLAN_LIMITS];
      const price = plan?.priceMonthly ?? 0;
      // Adjust for annual billing (if applicable)
      const monthlyPrice = sub.billingCycle === 'annual' ? price * 0.83 : price;
      return sum + monthlyPrice;
    }, 0);

    // Count by tier
    const tierCounts: Record<string, number> = {};
    for (const sub of activeSubscriptions) {
      const tier = sub.planTier || 'unknown';
      tierCounts[tier] = (tierCounts[tier] || 0) + 1;
    }

    // Churn: cancelled in last 30 days
    const recentCancellations = allSubscriptions.filter(
      (s) => s.status === 'cancelled' && s.cancelAt && s.cancelAt > thirtyDaysAgo
    );

    // New subscriptions in last 30 days
    const newSubscriptions = activeSubscriptions.filter(
      (s) => s.createdAt && s.createdAt > thirtyDaysAgo
    );

    // Previous period for comparison
    const previousPeriodActive = allSubscriptions.filter(
      (s) => s.createdAt && s.createdAt <= thirtyDaysAgo && s.createdAt > sixtyDaysAgo
    );

    // Calculate growth rate
    const previousCount = previousPeriodActive.length || 1;
    const growthRate = ((newSubscriptions.length - previousCount) / previousCount) * 100;

    // LTV estimate (simple: average MRR * 12 months average lifetime)
    const avgMrrPerUser = activeSubscriptions.length > 0 ? mrr / activeSubscriptions.length : 0;
    const estimatedLtv = avgMrrPerUser * 12;

    return {
      mrr,
      mrrFormatted: `$${mrr.toLocaleString()}`,
      activeCount: activeSubscriptions.length,
      tierBreakdown: Object.entries(tierCounts).map(([tier, count]) => ({
        tier,
        count,
        percentage: Math.round((count / activeSubscriptions.length) * 100) || 0,
      })),
      newThisMonth: newSubscriptions.length,
      churnedThisMonth: recentCancellations.length,
      churnRate:
        activeSubscriptions.length > 0
          ? Math.round((recentCancellations.length / activeSubscriptions.length) * 100 * 10) / 10
          : 0,
      growthRate: Math.round(growthRate * 10) / 10,
      estimatedLtv: Math.round(estimatedLtv),
      ltvFormatted: `$${Math.round(estimatedLtv).toLocaleString()}`,
    };
  },
});
