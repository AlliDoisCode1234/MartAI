/**
 * Admin Constants
 *
 * Shared constants used across admin portal components.
 */

// Onboarding step configuration
export const ONBOARDING_STEP_CONFIG = [
  { key: 'signupCompleted', label: 'Signup', icon: '●' },
  { key: 'planSelected', label: 'Plan Selected', icon: '◆' },
  { key: 'paymentCompleted', label: 'Payment', icon: '■' },
  { key: 'ga4Connected', label: 'GA4 Connected', icon: '○' },
  { key: 'gscConnected', label: 'GSC Connected', icon: '◇' },
  { key: 'projectCreated', label: 'Project Created', icon: '▲' },
] as const;

// Subscription status badge colors
export const SUBSCRIPTION_STATUS_COLORS: Record<string, string> = {
  active: 'green',
  trialing: 'blue',
  grace_period: 'yellow',
  maintenance_mode: 'orange',
  past_due: 'red',
  cancelled: 'gray',
  expired: 'gray',
};

// Account status badge colors
export const ACCOUNT_STATUS_COLORS: Record<string, string> = {
  active: 'green',
  inactive: 'yellow',
  churned: 'red',
  suspended: 'purple',
};

// User health tier badge colors
export const HEALTH_TIER_COLORS: Record<string, string> = {
  healthy: 'green',
  at_risk: 'yellow',
  critical: 'red',
};

// Role badge colors
export const ROLE_COLORS: Record<string, string> = {
  super_admin: 'purple',
  admin: 'blue',
  user: 'gray',
  viewer: 'gray',
};
