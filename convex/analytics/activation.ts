/**
 * Activation Metrics — Admin Queries
 *
 * Component Hierarchy:
 * convex/analytics/activation.ts (Query)
 *
 * GTM-2: Computes activation rate (% of onboarded users who generated content).
 * Uses analyticsEvents table as source of truth for content_generated events.
 */

import { query } from '../_generated/server';
import { requireSuperAdmin } from '../lib/rbac';

/**
 * Activation rate: (users with content_generated event) / (onboarded users) * 100
 *
 * NOTE: For 1000+ users, this full-scan approach should be replaced with
 * a pre-computed aggregate via cron. Document as scaling threshold.
 */
export const getActivationMetrics = query({
  args: {},
  handler: async (ctx) => {
    // Security: Admin-only
    await requireSuperAdmin(ctx);

    // Get all onboarded users (completed onboarding)
    const allUsers = await ctx.db.query('users').collect();
    const onboardedUsers = allUsers.filter(
      (u) => u.onboardingStatus === 'completed'
    );

    if (onboardedUsers.length === 0) {
      return {
        totalOnboarded: 0,
        activated: 0,
        activationRate: 0,
        recentActivations: 0,
      };
    }

    // Find users who have generated content (via analyticsEvents)
    const contentEvents = await ctx.db
      .query('analyticsEvents')
      .filter((q) => q.eq(q.field('event'), 'content_generated'))
      .collect();

    const activatedUserIds = new Set(
      contentEvents.map((e) => e.userId).filter(Boolean)
    );

    // Recent activations (last 7 days)
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentEvents = contentEvents.filter(
      (e) => e.timestamp && e.timestamp >= sevenDaysAgo
    );
    const recentActivatedUserIds = new Set(
      recentEvents.map((e) => e.userId).filter(Boolean)
    );

    const totalOnboarded = onboardedUsers.length;
    const activated = activatedUserIds.size;

    return {
      totalOnboarded,
      activated,
      activationRate: Math.round((activated / totalOnboarded) * 100),
      recentActivations: recentActivatedUserIds.size,
    };
  },
});
