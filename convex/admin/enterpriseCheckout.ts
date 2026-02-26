import { action } from '../_generated/server';
import { components } from '../_generated/api';
import { v } from 'convex/values';
import { requireAdminRole } from '../lib/rbac';
import { StripeSubscriptions } from '@convex-dev/stripe';

/**
 * Admin Enterprise Checkout
 *
 * Allows Sales/Admins to generate a Stripe Checkout URL for
 * enterprise customers. The link can be shared via email.
 *
 * Security: Requires 'sales' role or higher via RBAC.
 */

const stripeClient = new StripeSubscriptions(components.stripe, {});

export const generateEnterpriseCheckoutUrl = action({
  args: {
    targetUserId: v.id('users'),
    targetEmail: v.string(),
    targetName: v.optional(v.string()),
    priceId: v.string(),
  },
  returns: v.object({
    url: v.union(v.string(), v.null()),
  }),
  handler: async (ctx, args) => {
    // 1. Security: Caller must be Sales or higher
    await requireAdminRole(ctx, 'sales');

    // 2. Get or create a Stripe customer for the target user
    const customer = await stripeClient.getOrCreateCustomer(ctx, {
      userId: args.targetUserId,
      email: args.targetEmail,
      name: args.targetName,
    });

    const baseUrl = process.env.SITE_URL ?? 'http://localhost:3000';

    // 3. Create checkout session for the enterprise price
    const session = await stripeClient.createCheckoutSession(ctx, {
      priceId: args.priceId,
      customerId: customer.customerId,
      mode: 'subscription',
      successUrl: `${baseUrl}/studio?subscription=success`,
      cancelUrl: `${baseUrl}/pricing?canceled=true`,
      subscriptionMetadata: {
        userId: args.targetUserId,
        provisionedBy: 'admin_sales',
      },
    });

    return { url: session.url };
  },
});
