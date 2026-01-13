/**
 * Feature Flags
 *
 * Environment-based toggles for development/beta features.
 * Check .env.local or Convex env vars.
 */

/**
 * Bypass payment step during onboarding.
 * Set BYPASS_PAYMENT=true in environment for beta/development.
 * When true, subscription is created without Stripe confirmation.
 */
export const BYPASS_PAYMENT = process.env.BYPASS_PAYMENT === 'true';

/**
 * Enable debug logging for onboarding flow
 */
export const DEBUG_ONBOARDING = process.env.DEBUG_ONBOARDING === 'true';
