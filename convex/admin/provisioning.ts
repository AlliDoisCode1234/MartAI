import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { requireAdminRole } from '../lib/rbac';
import { internal } from '../_generated/api';

/**
 * Admin Provisioning Module
 *
 * Allows Sales/Admins to manually provision subscriptions.
 * Critical for Enterprise deals or manual overrides.
 */

export const provisionSubscription = mutation({
  args: {
    targetUserId: v.id('users'),
    planTier: v.string(), // 'team', 'enterprise', 'growth', 'active'
    status: v.union(
      v.literal('active'),
      v.literal('trialing'),
      v.literal('grace_period'),
      v.literal('maintenance_mode'),
      v.literal('past_due'),
      v.literal('cancelled'),
      v.literal('expired')
    ),
    billingCycle: v.optional(v.union(v.literal('monthly'), v.literal('annual'))),
    startsAt: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    // 1. Security Check: Caller must be Sales or higher
    await requireAdminRole(ctx, 'sales');

    // 2. Call Internal Mutation via scheduler to avoid type-depth recursion
    // We pass current time as default for startsAt if not provided
    const startsAt = args.startsAt ?? Date.now();

    // Using scheduler.runAfter(0, ...) is the Convex-recommended pattern
    // for calling internal mutations from regular mutations without type recursion
    await ctx.scheduler.runAfter(0, internal.subscriptions.subscriptions.upsertSubscription, {
      userId: args.targetUserId,
      planTier: args.planTier,
      status: args.status,
      billingCycle: args.billingCycle,
      startsAt,
      oneTimeFeePaid: false, // Default for manual provision
    });

    return { success: true };
  },
});
