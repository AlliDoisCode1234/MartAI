/**
 * User Health Scoring
 *
 * Computed health score (0-100) based on:
 * - Payment History (30%)
 * - Engagement Recency (30%)
 * - Feature Adoption (25%)
 * - Login Frequency (15%)
 *
 * Security: All queries require auth + RLS checks
 */

import { query } from '../_generated/server';
import { v } from 'convex/values';
import { requireAdmin } from '../lib/rbac';
import type { Id } from '../_generated/dataModel';

// ============================================
// CONSTANTS
// ============================================

/**
 * Health score thresholds
 */
export const HEALTH_THRESHOLDS = {
  healthy: 80, // 80-100: Actively using, paying on time
  atRisk: 50, // 50-79: Declining engagement or payment issues
  critical: 0, // 0-49: High churn probability
} as const;

export type HealthTier = 'healthy' | 'at_risk' | 'critical';

/**
 * Weight configuration for health score calculation
 */
const WEIGHTS = {
  paymentHistory: 0.3,
  engagementRecency: 0.3,
  featureAdoption: 0.25,
  loginFrequency: 0.15,
} as const;

// ============================================
// INTERNAL HELPERS
// ============================================

function calculateTier(score: number): HealthTier {
  if (score >= HEALTH_THRESHOLDS.healthy) return 'healthy';
  if (score >= HEALTH_THRESHOLDS.atRisk) return 'at_risk';
  return 'critical';
}

function calculatePaymentScore(
  subscription: { failedPaymentCount?: number; status: string } | null
): number {
  if (!subscription) return 0;

  const failCount = subscription.failedPaymentCount ?? 0;
  const statusPenalty =
    subscription.status === 'maintenance_mode'
      ? 50
      : subscription.status === 'grace_period'
        ? 30
        : subscription.status === 'past_due'
          ? 40
          : 0;

  // Each failure = -20 points, max penalty of 100
  const failurePenalty = Math.min(failCount * 20, 100);

  return Math.max(0, 100 - failurePenalty - statusPenalty);
}

function calculateEngagementScore(
  lastActiveAt: number | undefined,
  engagementMilestones: Record<string, number | undefined> | undefined
): number {
  const now = Date.now();
  const daysSinceActive = lastActiveAt ? (now - lastActiveAt) / (1000 * 60 * 60 * 24) : 365;

  // Recency score: 7 days = 100, 30 days = 50, 60+ days = 0
  let recencyScore: number;
  if (daysSinceActive <= 7) {
    recencyScore = 100;
  } else if (daysSinceActive <= 30) {
    recencyScore = 100 - ((daysSinceActive - 7) / 23) * 50;
  } else if (daysSinceActive <= 60) {
    recencyScore = 50 - ((daysSinceActive - 30) / 30) * 50;
  } else {
    recencyScore = 0;
  }

  // Bonus for recent content creation
  if (engagementMilestones) {
    const recentMilestones = [
      engagementMilestones.firstDraftCreatedAt,
      engagementMilestones.firstBriefCreatedAt,
      engagementMilestones.firstClusterCreatedAt,
    ].filter((ts) => ts && now - ts < 30 * 24 * 60 * 60 * 1000).length;

    recencyScore = Math.min(100, recencyScore + recentMilestones * 5);
  }

  return recencyScore;
}

function calculateAdoptionScore(
  engagementMilestones: Record<string, number | undefined> | undefined
): number {
  if (!engagementMilestones) return 0;

  // Count how many milestones are achieved
  const milestoneKeys = [
    'firstKeywordCreatedAt',
    'firstClusterCreatedAt',
    'firstBriefCreatedAt',
    'firstDraftCreatedAt',
    'firstContentPublishedAt',
    'firstGa4ConnectedAt',
    'firstGscConnectedAt',
    'firstWordPressConnectedAt',
  ];

  const achieved = milestoneKeys.filter(
    (key) => engagementMilestones[key as keyof typeof engagementMilestones] !== undefined
  ).length;

  return (achieved / milestoneKeys.length) * 100;
}

function calculateLoginScore(lastActiveAt: number | undefined): number {
  if (!lastActiveAt) return 0;

  const now = Date.now();
  const daysSinceActive = (now - lastActiveAt) / (1000 * 60 * 60 * 24);

  // Weekly login = 100, monthly = 50, less = 0
  if (daysSinceActive <= 7) return 100;
  if (daysSinceActive <= 30) return 50;
  return 0;
}

// ============================================
// QUERIES
// ============================================

/**
 * Compute user health score
 * Security: User can query their own health OR admin can query any user
 */
export const computeUserHealth = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    // RLS: Verify caller owns this userId or is admin
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const callerUser = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', identity.email))
      .first();

    if (!callerUser) {
      throw new Error('User not found');
    }

    const isAdmin = callerUser.role === 'admin' || callerUser.role === 'super_admin';
    if (callerUser._id !== userId && !isAdmin) {
      throw new Error('Access denied');
    }

    // Get user and subscription data
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();

    // Calculate component scores
    const paymentScore = calculatePaymentScore(subscription);
    const engagementScore = calculateEngagementScore(
      user.lastActiveAt,
      user.engagementMilestones as Record<string, number | undefined> | undefined
    );
    const adoptionScore = calculateAdoptionScore(
      user.engagementMilestones as Record<string, number | undefined> | undefined
    );
    const loginScore = calculateLoginScore(user.lastActiveAt);

    // Calculate weighted overall score
    const overall = Math.round(
      paymentScore * WEIGHTS.paymentHistory +
        engagementScore * WEIGHTS.engagementRecency +
        adoptionScore * WEIGHTS.featureAdoption +
        loginScore * WEIGHTS.loginFrequency
    );

    const tier = calculateTier(overall);

    return {
      overall,
      tier,
      factors: {
        payment: Math.round(paymentScore),
        engagement: Math.round(engagementScore),
        adoption: Math.round(adoptionScore),
        login: Math.round(loginScore),
      },
      // Don't return sensitive data
    };
  },
});

/**
 * Admin: List at-risk users for proactive outreach
 * Security: Requires admin role
 */
export const listAtRiskUsers = query({
  args: {
    tier: v.optional(v.union(v.literal('at_risk'), v.literal('critical'))),
  },
  handler: async (ctx, { tier }) => {
    // Security: Admin access required
    await requireAdmin(ctx);

    // Get all users with subscriptions
    const subscriptions = await ctx.db.query('subscriptions').collect();

    const usersWithHealth: Array<{
      userId: Id<'users'>;
      email: string | undefined;
      name: string | undefined;
      healthScore: number;
      healthTier: HealthTier;
      subscriptionStatus: string;
      lastActiveAt: number | undefined;
    }> = [];

    for (const sub of subscriptions) {
      const user = await ctx.db.get(sub.userId);
      if (!user) continue;

      // Calculate health score
      const paymentScore = calculatePaymentScore(sub);
      const engagementScore = calculateEngagementScore(
        user.lastActiveAt,
        user.engagementMilestones as Record<string, number | undefined> | undefined
      );
      const adoptionScore = calculateAdoptionScore(
        user.engagementMilestones as Record<string, number | undefined> | undefined
      );
      const loginScore = calculateLoginScore(user.lastActiveAt);

      const overall = Math.round(
        paymentScore * WEIGHTS.paymentHistory +
          engagementScore * WEIGHTS.engagementRecency +
          adoptionScore * WEIGHTS.featureAdoption +
          loginScore * WEIGHTS.loginFrequency
      );

      const userTier = calculateTier(overall);

      // Filter by tier if specified
      if (tier && userTier !== tier) continue;

      // Only include at-risk and critical users if no filter
      if (!tier && userTier === 'healthy') continue;

      usersWithHealth.push({
        userId: sub.userId,
        email: user.email,
        name: user.name,
        healthScore: overall,
        healthTier: userTier,
        subscriptionStatus: sub.status,
        lastActiveAt: user.lastActiveAt,
      });
    }

    // Sort by health score ascending (worst first)
    return usersWithHealth.sort((a, b) => a.healthScore - b.healthScore);
  },
});
