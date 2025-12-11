import { query, action } from './_generated/server';
import { polar } from './polar';

/**
 * Polar Billing Actions
 *
 * Component Hierarchy:
 * convex/
 * └── polarActions.ts (this file)
 *     ├── getCurrentUserWithSubscription - Query user with subscription data
 *     └── syncPolarProducts - Sync products from Polar dashboard
 *
 * Note: Most Polar functions are exported directly from polar.ts via polar.api()
 * - changeCurrentSubscription
 * - cancelCurrentSubscription
 * - getConfiguredProducts
 * - listAllProducts
 * - generateCheckoutLink
 * - generateCustomerPortalUrl
 */

/**
 * Get current user with their subscription data
 * This is the pattern shown in the official Polar docs
 */
export const getCurrentUserWithSubscription = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', identity.email!))
      .first();

    if (!user) {
      return null;
    }

    // Get subscription from Polar component
    const subscription = await polar.getCurrentSubscription(ctx, {
      userId: user._id,
    });

    return {
      ...user,
      subscription,
      isFree: !subscription,
      isPremium:
        subscription?.productKey === 'solo' ||
        subscription?.productKey === 'growth' ||
        subscription?.productKey === 'enterprise',
    };
  },
});

/**
 * Sync products from Polar dashboard
 * Run this after creating/updating products in Polar
 */
export const syncPolarProducts = action({
  args: {},
  handler: async (ctx) => {
    await polar.syncProducts(ctx);
    return { success: true };
  },
});
