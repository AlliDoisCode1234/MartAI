import { Polar } from '@convex-dev/polar';
import { api, components } from './_generated/api';
import { DataModel } from './_generated/dataModel';

/**
 * Polar Billing Client
 *
 * Component Hierarchy:
 * convex/
 * └── polar.ts (this file) - Polar billing client initialization
 *
 * Environment Variables Required:
 * - POLAR_ORGANIZATION_TOKEN: Organization token from Polar dashboard
 * - POLAR_WEBHOOK_SECRET: Webhook secret for signature verification
 * - POLAR_SERVER: 'sandbox' or 'production'
 *
 * Sandbox Testing:
 * - Dashboard: https://sandbox.polar.sh
 * - API: https://sandbox-api.polar.sh
 * - Test Card: 4242 4242 4242 4242
 */

export const polar = new Polar<DataModel>(components.polar, {
  // Required: Get user info for checkout sessions and subscription lookups
  // Uses runQuery to call the users.current query
  getUserInfo: async (ctx): Promise<{ userId: string; email: string }> => {
    const user = await ctx.runQuery(api.users.current);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      userId: user._id as string,
      email: user.email,
    };
  },

  // Map product keys to Polar product IDs (set in Polar dashboard)
  // These can also be set via env vars: POLAR_PRODUCT_SOLO, etc.
  products: {
    solo: process.env.POLAR_PRODUCT_SOLO || '',
    growth: process.env.POLAR_PRODUCT_GROWTH || '',
    enterprise: process.env.POLAR_PRODUCT_ENTERPRISE || '',
  },

  // Optional: Set Polar configuration (falls back to env vars)
  // organizationToken: process.env.POLAR_ORGANIZATION_TOKEN,
  // webhookSecret: process.env.POLAR_WEBHOOK_SECRET,
  server: 'sandbox', // Use 'production' when ready
});

// Export API functions from the Polar client
export const {
  changeCurrentSubscription,
  cancelCurrentSubscription,
  getConfiguredProducts,
  listAllProducts,
  generateCheckoutLink,
  generateCustomerPortalUrl,
} = polar.api();
