import { internalMutation } from '../_generated/server';
import { v } from 'convex/values';
import { Id } from '../_generated/dataModel';
import { internal } from '../_generated/api';
import { getMaxSeatsForTier } from '../lib/tierLimits';
import { BI_EVENTS } from '../lib/eventTypes';

/**
 * Handle subscription updates from Stripe webhooks.
 * Maps Stripe price/product to internal tier and updates users and subscriptions tables.
 */
export const handleSubscriptionUpdate = internalMutation({
  args: {
    stripeSubscriptionId: v.string(),
    stripeUserId: v.string(),
    priceId: v.string(),
    status: v.string(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.boolean(),
  },
  handler: async (ctx, args) => {
    // 1. Find the user by casting stripeUserId to a typed users Id
    const userId = args.stripeUserId as Id<'users'>;
    const user = await ctx.db.get(userId);
    if (!user) {
      console.warn(`[Webhook Sync] User ${args.stripeUserId} not found for subscription ${args.stripeSubscriptionId}`);
      return;
    }

    // 2. Map Stripe status to our internal SubscriptionStatus
    let internalStatus: 'active' | 'trialing' | 'grace_period' | 'maintenance_mode' | 'past_due' | 'cancelled' | 'expired' = 'active';

    if (args.status === 'active' || args.status === 'trialing') {
      internalStatus = args.status as 'active' | 'trialing';
    } else if (args.status === 'past_due') {
      internalStatus = 'grace_period';
    } else if (args.status === 'canceled') {
      internalStatus = 'cancelled';
    } else if (args.status === 'unpaid' || args.status === 'paused') {
      internalStatus = 'maintenance_mode';
    } else {
      internalStatus = 'expired';
    }

    // 3. Map priceId to tier
    const priceToTier: Record<string, string> = {
      [process.env.STRIPE_STARTER_PRICE_ID || '']: 'starter',
      [process.env.STRIPE_ENGINE_PRICE_ID || '']: 'engine',
      [process.env.STRIPE_AGENCY_PRICE_ID || '']: 'agency',
    };
    const mappedTier = priceToTier[args.priceId] || 'starter';

    // 4. Update the subscription in subscriptions table
    await ctx.runMutation(internal.subscriptions.subscriptions.upsertSubscription, {
      userId: user._id,
      planTier: mappedTier,
      status: internalStatus,
      billingCycle: 'monthly',
      startsAt: Date.now(),
      renewsAt: args.currentPeriodEnd * 1000,
      cancelAt: args.cancelAtPeriodEnd ? (args.currentPeriodEnd * 1000) : undefined,
    });

    // 5. Update user's membershipTier
    await ctx.db.patch(user._id, {
      membershipTier: mappedTier as 'starter' | 'engine' | 'agency' | 'enterprise',
      accountStatus: internalStatus === 'cancelled' ? 'churning' : 'active',
    });

    // 6. Auto-sync org seats with new tier (GAP-2 fix)
    // When tier changes, org.maxMembers must update so invitations aren't blocked
    if (user.organizationId) {
      const org = await ctx.db.get(user.organizationId);
      if (org && org.ownerId === user._id) {
        const maxMembers = getMaxSeatsForTier(mappedTier);

        await ctx.db.patch(user.organizationId, {
          plan: mappedTier as 'starter' | 'engine' | 'agency' | 'enterprise',
          maxMembers,
          updatedAt: Date.now(),
        });
        console.log(`[Webhook Sync] Auto-synced org seats to ${maxMembers} (${mappedTier})`);
      }
    }

    console.log(`[Webhook Sync] Updated subscription for user ${user._id} to tier ${mappedTier} (${internalStatus})`);

    // BI Events: Revenue tracking (BI-4)
    // Uses internalTrackBiEvent which writes to analyticsEvents table
    const previousTier = user.membershipTier;
    const tierRank: Record<string, number> = { starter: 1, engine: 2, agency: 3, enterprise: 4 };
    const prevRank = tierRank[previousTier ?? ''] ?? 0;
    const newRank = tierRank[mappedTier] ?? 0;

    if (internalStatus === 'cancelled') {
      await ctx.runMutation(internal.analytics.eventTracking.internalTrackBiEvent, {
        event: BI_EVENTS.SUBSCRIPTION_CANCELLED,
        userId: user._id,
        properties: { previousTier, stripeSubscriptionId: args.stripeSubscriptionId },
      });
    } else if (newRank > prevRank && prevRank > 0) {
      await ctx.runMutation(internal.analytics.eventTracking.internalTrackBiEvent, {
        event: BI_EVENTS.PLAN_UPGRADED,
        userId: user._id,
        properties: { from: previousTier, to: mappedTier },
      });
    } else if (newRank < prevRank && newRank > 0) {
      await ctx.runMutation(internal.analytics.eventTracking.internalTrackBiEvent, {
        event: BI_EVENTS.PLAN_DOWNGRADED,
        userId: user._id,
        properties: { from: previousTier, to: mappedTier },
      });
    } else if (prevRank === 0) {
      // First subscription ever
      await ctx.runMutation(internal.analytics.eventTracking.internalTrackBiEvent, {
        event: BI_EVENTS.SUBSCRIPTION_CREATED,
        userId: user._id,
        properties: { tier: mappedTier },
      });
    }
  },
});

