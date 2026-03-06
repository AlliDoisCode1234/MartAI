/**
 * Feature Flags
 *
 * Component Hierarchy:
 * lib/constants/featureFlags.ts (standalone)
 *
 * Central feature flag constants for toggling beta vs launched behavior.
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

/**
 * Toggle this single flag to switch the entire product from beta → launched.
 *
 * Beta mode (IS_LAUNCHED = false):
 *   - Header CTA: "Join Beta" → /join
 *   - Hero CTA: "Join Beta" → /join
 *   - Feature/Solution CTAs: "Join Beta" → /join
 *   - Login/Signup pages: hidden from header nav
 *
 * Launched mode (IS_LAUNCHED = true):
 *   - Header CTA: "Start Getting Leads" → /auth/signup
 *   - Hero CTA: "Start Getting Leads" → /auth/signup
 *   - Feature/Solution CTAs: "See Pricing" → /pricing
 *   - Login/Signup pages: visible in header nav
 *
 * TODO: Set to true when ready to launch publicly
 */
export const IS_LAUNCHED = false;

/** Beta waitlist destination used when IS_LAUNCHED is false */
export const BETA_JOIN_HREF = '/join';

/** Launched primary CTA destination used when IS_LAUNCHED is true */
export const LAUNCHED_SIGNUP_HREF = '/auth/signup';

/** Launched pricing CTA destination used when IS_LAUNCHED is true */
export const LAUNCHED_PRICING_HREF = '/pricing';
