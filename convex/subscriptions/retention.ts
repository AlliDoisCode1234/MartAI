import { action, internalMutation, internalQuery } from '../_generated/server';
import { v } from 'convex/values';
import { internal } from '../_generated/api';

/**
 * applyRetentionOffer
 * 
 * Applies the selected churn mitigation retention offer directly into Stripe.
 * We bypass heavy SDKs by issuing direct fetch requests to Stripe's REST API.
 */
export const applyRetentionOffer = action({
  args: {
    option: v.union(v.literal('pause'), v.literal('stay20')),
  },
  handler: async (ctx, { option }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    // Get Subscription Context via Internal Query
    const context = await ctx.runQuery(internal.subscriptions.retention.getSubscriptionContext, {});
    
    if (!context.subscriptionId || !context.stripeSubscriptionId) {
      throw new Error('No active Stripe subscription found for user');
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      throw new Error('Stripe configuration missing');
    }

    const { stripeSubscriptionId, subscriptionId, userId } = context;

    // Build the Stripe API endpoint
    const url = `https://api.stripe.com/v1/subscriptions/${stripeSubscriptionId}`;
    
    // Construct Form-Encoded Body
    const body = new URLSearchParams();

    if (option === 'stay20') {
      // Apply the pre-existing STAY20 coupon
      body.append('coupon', 'STAY20');
    } else if (option === 'pause') {
      // Configure Pause Collection for 60 days
      const resumesAt = Math.floor(Date.now() / 1000) + (60 * 24 * 60 * 60);
      body.append('pause_collection[behavior]', 'void'); // Don't charge during pause
      body.append('pause_collection[resumes_at]', resumesAt.toString());
    }

    // Execute the request to Stripe
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error(`[Retention Error] Failed to apply ${option} via Stripe API:`, errorData);
      throw new Error(`Failed to apply retention offer in Stripe: ${response.statusText}`);
    }

    // Acknowledge the retention offer in Convex to log the success
    await ctx.runMutation(internal.subscriptions.retention.logRetentionSuccess, {
      subscriptionId,
      userId,
      option,
    });

    return { success: true };
  },
});

// ============================================
// INTERNAL PROCEDURES
// ============================================

export const getSubscriptionContext = internalQuery({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', identity.email))
      .first();
    
    if (!user) throw new Error('User not found');

    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .first();

    return {
      userId: user._id,
      subscriptionId: subscription?._id,
      stripeSubscriptionId: subscription?.stripeSubscriptionId,
    };
  },
});

export const logRetentionSuccess = internalMutation({
  args: {
    subscriptionId: v.id('subscriptions'),
    userId: v.id('users'),
    option: v.union(v.literal('pause'), v.literal('stay20')),
  },
  handler: async (ctx, { subscriptionId, userId, option }) => {
    // Flag the subscription with the accepted offer
    await ctx.db.patch(subscriptionId, {
      retentionOfferAccepted: option,
      // Clear out any pending cancellation marks since they chose to stay/pause
      cancelRequestedAt: undefined,
      cancelAt: undefined,
      cancelReason: undefined,
      cancelFeedback: undefined,
      updatedAt: Date.now(),
    });

    // Restore user to active state
    await ctx.db.patch(userId, {
      accountStatus: 'active',
    });
    
    console.log(`[Retention Success] User ${userId} accepted '${option}' offer.`);
  },
});
