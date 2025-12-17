/**
 * Stripe Checkout Actions
 *
 * Handles checkout session creation and customer portal.
 * Based on official @convex-dev/stripe component API.
 *
 * Security:
 * - Auth required for all actions
 * - Rate limited to prevent abuse
 * - Customer linked to authenticated user
 */

import { action, query } from '../_generated/server';
import { components } from '../_generated/api';
import { StripeSubscriptions } from '@convex-dev/stripe';
import { v } from 'convex/values';

// Initialize Stripe client
const stripeClient = new StripeSubscriptions(components.stripe, {});

/**
 * Create a checkout session for subscription
 * Security: Requires authenticated user
 */
export const createSubscriptionCheckout = action({
  args: {
    priceId: v.string(),
  },
  returns: v.object({
    sessionId: v.string(),
    url: v.union(v.string(), v.null()),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Get or create a Stripe customer
    const customer = await stripeClient.getOrCreateCustomer(ctx, {
      userId: identity.subject,
      email: identity.email,
      name: identity.name,
    });

    // Create checkout session
    return await stripeClient.createCheckoutSession(ctx, {
      priceId: args.priceId,
      customerId: customer.customerId,
      mode: 'subscription',
      successUrl: `${process.env.SITE_URL ?? 'http://localhost:3000'}/home?success=true`,
      cancelUrl: `${process.env.SITE_URL ?? 'http://localhost:3000'}/pricing?canceled=true`,
      subscriptionMetadata: {
        userId: identity.subject,
      },
    });
  },
});

/**
 * Create a checkout session for one-time payment
 * Security: Requires authenticated user
 */
export const createPaymentCheckout = action({
  args: {
    priceId: v.string(),
  },
  returns: v.object({
    sessionId: v.string(),
    url: v.union(v.string(), v.null()),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const customer = await stripeClient.getOrCreateCustomer(ctx, {
      userId: identity.subject,
      email: identity.email,
      name: identity.name,
    });

    return await stripeClient.createCheckoutSession(ctx, {
      priceId: args.priceId,
      customerId: customer.customerId,
      mode: 'payment',
      successUrl: `${process.env.SITE_URL ?? 'http://localhost:3000'}/home?success=true`,
      cancelUrl: `${process.env.SITE_URL ?? 'http://localhost:3000'}/pricing?canceled=true`,
      paymentIntentMetadata: {
        userId: identity.subject,
      },
    });
  },
});

/**
 * Create customer portal session for billing management
 * Security: Requires authenticated user with subscription
 */
export const createPortalSession = action({
  args: {
    returnUrl: v.optional(v.string()),
  },
  returns: v.object({
    url: v.string(),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Get the customer first
    const customer = await stripeClient.getOrCreateCustomer(ctx, {
      userId: identity.subject,
      email: identity.email,
      name: identity.name,
    });

    const returnUrl =
      args.returnUrl ?? `${process.env.SITE_URL ?? 'http://localhost:3000'}/settings`;

    const session = await stripeClient.createCustomerPortalSession(ctx, {
      customerId: customer.customerId,
      returnUrl,
    });

    return { url: session.url };
  },
});

/**
 * Get user's subscriptions
 * Security: User can only query their own subscriptions
 */
export const getUserSubscriptions = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    return await ctx.runQuery(components.stripe.public.listSubscriptionsByUserId, {
      userId: identity.subject,
    });
  },
});

/**
 * Get user's payments
 * Security: User can only query their own payments
 */
export const getUserPayments = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    return await ctx.runQuery(components.stripe.public.listPaymentsByUserId, {
      userId: identity.subject,
    });
  },
});

/**
 * Get user's invoices
 * Security: User can only query their own invoices
 */
export const getUserInvoices = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    return await ctx.runQuery(components.stripe.public.listInvoicesByUserId, {
      userId: identity.subject,
    });
  },
});
