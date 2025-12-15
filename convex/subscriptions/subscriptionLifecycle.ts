/**
 * Subscription Lifecycle Management
 *
 * State machine for subscription transitions:
 * - active → grace_period (payment fails)
 * - grace_period → active (payment succeeds within 7 days)
 * - grace_period → maintenance_mode (7 days pass without payment)
 * - maintenance_mode → active (payment succeeds)
 * - any → cancelled (user cancels)
 * - cancelled → active (resubscribes)
 *
 * Security: All admin mutations require requireAdmin/requireSuperAdmin
 */

import { mutation, query, internalMutation } from '../_generated/server';
import { v } from 'convex/values';
import { requireAdmin, requireSuperAdmin } from '../lib/rbac';
import type { Id } from '../_generated/dataModel';

// ============================================
// CONSTANTS
// ============================================

export const GRACE_PERIOD_DAYS = 7;
export const GRACE_PERIOD_MS = GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000;

/**
 * Maintenance mode limits - what users CAN and CANNOT do
 */
export const MAINTENANCE_MODE_LIMITS = {
  canRead: true, // View dashboard, data
  canGenerate: false, // Generate keywords, briefs, drafts
  canPublish: false, // Publish to WordPress, etc.
  canExport: false, // Export data
  canConnect: false, // Connect new integrations
} as const;

/**
 * Subscription status type for type safety
 */
export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'grace_period'
  | 'maintenance_mode'
  | 'past_due'
  | 'cancelled'
  | 'expired';

/**
 * User account status (separate from subscription)
 */
export type AccountStatus = 'active' | 'inactive' | 'churned' | 'suspended';

// ============================================
// INTERNAL HELPERS
// ============================================

async function getSubscriptionByUserId(ctx: any, userId: Id<'users'>) {
  return await ctx.db
    .query('subscriptions')
    .withIndex('by_user', (q: any) => q.eq('userId', userId))
    .first();
}

// ============================================
// QUERIES
// ============================================

/**
 * Get effective limits based on subscription status
 * Called by client to determine what actions are available
 * Security: User can only query their own limits (or admin)
 */
export const getEffectiveLimits = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    // RLS: Verify caller owns this userId or is admin
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    // Get the caller's user record
    const callerUser = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', identity.email))
      .first();

    if (!callerUser) {
      throw new Error('User not found');
    }

    // RLS: Must be own user OR admin
    const isAdmin = callerUser.role === 'admin' || callerUser.role === 'super_admin';
    if (callerUser._id !== userId && !isAdmin) {
      throw new Error('Access denied');
    }

    const subscription = await getSubscriptionByUserId(ctx, userId);

    if (!subscription) {
      return {
        hasSubscription: false,
        status: null,
        limits: MAINTENANCE_MODE_LIMITS,
        message: 'No active subscription',
      };
    }

    // Maintenance mode or grace period = limited access
    if (
      subscription.status === 'maintenance_mode' ||
      subscription.status === 'grace_period' ||
      subscription.status === 'past_due'
    ) {
      return {
        hasSubscription: true,
        status: subscription.status,
        limits: MAINTENANCE_MODE_LIMITS,
        message:
          subscription.status === 'grace_period'
            ? 'Payment failed. Please update your payment method.'
            : 'Subscription inactive. Please reactivate to continue.',
        graceEndsAt:
          subscription.status === 'grace_period' && subscription.graceStartedAt
            ? subscription.graceStartedAt + GRACE_PERIOD_MS
            : null,
      };
    }

    // Cancelled or expired = limited access
    if (subscription.status === 'cancelled' || subscription.status === 'expired') {
      return {
        hasSubscription: true,
        status: subscription.status,
        limits: MAINTENANCE_MODE_LIMITS,
        message: 'Subscription ended. Reactivate to continue creating content.',
      };
    }

    // Active or trialing = full access
    return {
      hasSubscription: true,
      status: subscription.status,
      limits: {
        canRead: true,
        canGenerate: true,
        canPublish: true,
        canExport: true,
        canConnect: true,
      },
      message: null,
    };
  },
});

/**
 * Check if user can perform a specific action
 * Used by mutations before executing
 * Security: User can only check their own permissions (or admin)
 */
export const canPerformAction = query({
  args: {
    userId: v.id('users'),
    action: v.union(
      v.literal('read'),
      v.literal('generate'),
      v.literal('publish'),
      v.literal('export'),
      v.literal('connect')
    ),
  },
  handler: async (ctx, { userId, action }) => {
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

    const subscription = await getSubscriptionByUserId(ctx, userId);

    if (!subscription) {
      return { allowed: false, reason: 'No subscription found' };
    }

    const isFullAccess = subscription.status === 'active' || subscription.status === 'trialing';

    if (isFullAccess) {
      return { allowed: true, reason: null };
    }

    // Check specific action against maintenance mode limits
    const actionToLimit: Record<string, keyof typeof MAINTENANCE_MODE_LIMITS> = {
      read: 'canRead',
      generate: 'canGenerate',
      publish: 'canPublish',
      export: 'canExport',
      connect: 'canConnect',
    };

    const limitKey = actionToLimit[action];
    const allowed = MAINTENANCE_MODE_LIMITS[limitKey];

    return {
      allowed,
      reason: allowed ? null : 'Action not available in current subscription status',
    };
  },
});

// ============================================
// INTERNAL MUTATIONS (Called by webhooks/crons)
// ============================================

/**
 * Transition subscription to grace period on payment failure
 * Called by Polar webhook handler
 */
export const transitionToGracePeriod = internalMutation({
  args: { subscriptionId: v.id('subscriptions') },
  handler: async (ctx, { subscriptionId }) => {
    const subscription = await ctx.db.get(subscriptionId);
    if (!subscription) return { success: false, error: 'Subscription not found' };

    const now = Date.now();
    await ctx.db.patch(subscriptionId, {
      status: 'grace_period',
      graceStartedAt: now,
      lastPaymentFailedAt: now,
      failedPaymentCount: (subscription.failedPaymentCount ?? 0) + 1,
      updatedAt: now,
    });

    return { success: true, graceEndsAt: now + GRACE_PERIOD_MS };
  },
});

/**
 * Transition to maintenance mode after grace period expires
 * Called by scheduled cron job
 */
export const transitionToMaintenanceMode = internalMutation({
  args: { subscriptionId: v.id('subscriptions') },
  handler: async (ctx, { subscriptionId }) => {
    const subscription = await ctx.db.get(subscriptionId);
    if (!subscription) return { success: false, error: 'Subscription not found' };

    const now = Date.now();
    await ctx.db.patch(subscriptionId, {
      status: 'maintenance_mode',
      maintenanceStartedAt: now,
      updatedAt: now,
    });

    // Update user account status
    await ctx.db.patch(subscription.userId, {
      accountStatus: 'inactive',
    });

    return { success: true };
  },
});

/**
 * Reactivate subscription on successful payment
 * Called by Polar webhook handler
 */
export const reactivateSubscription = internalMutation({
  args: { subscriptionId: v.id('subscriptions') },
  handler: async (ctx, { subscriptionId }) => {
    const subscription = await ctx.db.get(subscriptionId);
    if (!subscription) return { success: false, error: 'Subscription not found' };

    const now = Date.now();
    await ctx.db.patch(subscriptionId, {
      status: 'active',
      graceStartedAt: undefined,
      maintenanceStartedAt: undefined,
      failedPaymentCount: 0,
      lastPaymentAt: now,
      updatedAt: now,
    });

    // Update user account status
    await ctx.db.patch(subscription.userId, {
      accountStatus: 'active',
      lastPaymentAt: now,
      reactivatedAt: now,
    });

    return { success: true };
  },
});

/**
 * Cancel subscription
 * Called by Polar webhook or user action
 */
export const cancelSubscription = internalMutation({
  args: {
    subscriptionId: v.id('subscriptions'),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, { subscriptionId, reason }) => {
    const subscription = await ctx.db.get(subscriptionId);
    if (!subscription) return { success: false, error: 'Subscription not found' };

    const now = Date.now();
    await ctx.db.patch(subscriptionId, {
      status: 'cancelled',
      cancelAt: now,
      updatedAt: now,
    });

    // Update user account status
    await ctx.db.patch(subscription.userId, {
      accountStatus: 'churned',
      churnedAt: now,
      churnReason: reason,
    });

    return { success: true };
  },
});

// ============================================
// ADMIN MUTATIONS (Require RBAC)
// ============================================

/**
 * Admin: Manually activate a subscription
 * Security: Requires super_admin role
 */
export const adminActivateSubscription = mutation({
  args: {
    subscriptionId: v.id('subscriptions'),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, { subscriptionId, reason }) => {
    // Security: Super admin only for subscription overrides
    await requireSuperAdmin(ctx);

    const subscription = await ctx.db.get(subscriptionId);
    if (!subscription) throw new Error('Subscription not found');

    const now = Date.now();
    await ctx.db.patch(subscriptionId, {
      status: 'active',
      graceStartedAt: undefined,
      maintenanceStartedAt: undefined,
      updatedAt: now,
    });

    // Update user status
    await ctx.db.patch(subscription.userId, {
      accountStatus: 'active',
      reactivatedAt: now,
    });

    // Log: Only IDs, not sensitive data (per security rules)
    console.log(
      `[AdminActivate] Subscription ${subscriptionId} activated by admin. Reason: ${reason ?? 'N/A'}`
    );

    return { success: true, previousStatus: subscription.status };
  },
});

/**
 * Admin: Change subscription plan tier
 * Security: Requires super_admin role
 */
export const adminChangeSubscriptionPlan = mutation({
  args: {
    subscriptionId: v.id('subscriptions'),
    newPlanTier: v.string(),
    newBillingCycle: v.optional(v.union(v.literal('monthly'), v.literal('annual'))),
  },
  handler: async (ctx, { subscriptionId, newPlanTier, newBillingCycle }) => {
    // Security: Super admin only for plan changes
    await requireSuperAdmin(ctx);

    const subscription = await ctx.db.get(subscriptionId);
    if (!subscription) throw new Error('Subscription not found');

    const now = Date.now();
    await ctx.db.patch(subscriptionId, {
      planTier: newPlanTier,
      billingCycle: newBillingCycle ?? subscription.billingCycle,
      updatedAt: now,
    });

    // Update user's membership tier
    await ctx.db.patch(subscription.userId, {
      membershipTier: newPlanTier as any,
    });

    console.log(`[AdminPlanChange] Subscription ${subscriptionId} changed to ${newPlanTier}`);

    return {
      success: true,
      previousPlan: subscription.planTier,
      newPlan: newPlanTier,
    };
  },
});

/**
 * Admin: List users in maintenance mode (for win-back campaigns)
 * Security: Requires admin role
 */
export const listMaintenanceModeSubscriptions = query({
  args: {},
  handler: async (ctx) => {
    // Security: Admin access required
    await requireAdmin(ctx);

    const subscriptions = await ctx.db
      .query('subscriptions')
      .withIndex('by_status', (q) => q.eq('status', 'maintenance_mode'))
      .collect();

    // Return only needed fields (per security rules)
    return subscriptions.map((sub) => ({
      _id: sub._id,
      userId: sub.userId,
      planTier: sub.planTier,
      maintenanceStartedAt: sub.maintenanceStartedAt,
      billingCycle: sub.billingCycle,
    }));
  },
});

/**
 * Admin: List subscriptions in grace period
 * Security: Requires admin role
 */
export const listGracePeriodSubscriptions = query({
  args: {},
  handler: async (ctx) => {
    // Security: Admin access required
    await requireAdmin(ctx);

    const subscriptions = await ctx.db
      .query('subscriptions')
      .withIndex('by_status', (q) => q.eq('status', 'grace_period'))
      .collect();

    return subscriptions.map((sub) => ({
      _id: sub._id,
      userId: sub.userId,
      planTier: sub.planTier,
      graceStartedAt: sub.graceStartedAt,
      graceEndsAt: sub.graceStartedAt ? sub.graceStartedAt + GRACE_PERIOD_MS : null,
      failedPaymentCount: sub.failedPaymentCount,
    }));
  },
});
