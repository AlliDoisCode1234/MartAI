/**
 * Stripe Integration Module
 *
 * Initializes @convex-dev/stripe component and exports helpers
 * for checkout, subscriptions, and customer portal.
 *
 * Security:
 * - STRIPE_SECRET_KEY stored in Convex dashboard (never in code)
 * - Webhook signatures validated by component automatically
 * - All mutations require auth checks
 */

import { StripeSubscriptions } from '@convex-dev/stripe';
import { components } from '../_generated/api';

// Initialize Stripe client
export const stripeClient = new StripeSubscriptions(components.stripe, {});
