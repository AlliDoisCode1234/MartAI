import { internalMutation } from '../_generated/server';
import { v } from 'convex/values';
import { internal } from '../_generated/api';

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
    // 1. Find the user based on stripeUserId (which is typically user._id in Convex)
    // If stripeUserId is unknown, we need to locate by querying stripeCustomerId on users table?
    // Wait, let's find the user first.
    const user = await ctx.db.get(args.stripeUserId as any);
    if (!user) {
      console.warn(`[Webhook Sync] User ${args.stripeUserId} not found for subscription ${args.stripeSubscriptionId}`);
      return;
    }

    // 2. Map Stripe status to our internal SubscriptionStatus
    // 'active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'paused'
    let internalStatus: 'active' | 'trialing' | 'grace_period' | 'maintenance_mode' | 'past_due' | 'cancelled' | 'expired' = 'active';

    if (args.status === 'active' || args.status === 'trialing') {
      internalStatus = args.status as any;
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
    // We don't have hardcoded price IDs here yet, so we will use a naive mapping or store the priceId in planTier
    // Let's rely on an env variable or standard if possible. For now, we use a basic map or default to starter
    const priceToTier: Record<string, string> = {
      // PROD prices (if any exist, they should be mapped here)
      [process.env.STRIPE_STARTER_PRICE_ID || '']: 'starter',
      [process.env.STRIPE_ENGINE_PRICE_ID || '']: 'engine',
      [process.env.STRIPE_AGENCY_PRICE_ID || '']: 'agency',
    };
    const mappedTier = priceToTier[args.priceId] || 'starter'; // Default to starter if unknown

    // 4. Update the subscription in subscriptions table
    await ctx.runMutation(internal.subscriptions.subscriptions.upsertSubscription, {
      userId: user._id,
      planTier: mappedTier, // mapped from price
      status: internalStatus,
      billingCycle: 'monthly', // default, could be derived from priceId
      startsAt: Date.now(),
      renewsAt: args.currentPeriodEnd * 1000,
      cancelAt: args.cancelAtPeriodEnd ? (args.currentPeriodEnd * 1000) : undefined,
    });

    // 5. Update user's membershipTier
    await ctx.db.patch(user._id, {
      membershipTier: mappedTier as any,
      accountStatus: internalStatus === 'cancelled' ? 'churning' : 'active',
    });

    console.log(`[Webhook Sync] Updated subscription for user ${user._id} to tier ${mappedTier} (${internalStatus})`);
  },
});
