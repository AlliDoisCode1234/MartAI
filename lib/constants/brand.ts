/**
 * Brand Constants
 *
 * Centralized brand configuration for Phoo.
 * Use these constants throughout the app for consistency.
 */

export const BRAND = {
  name: 'Phoo',
  tagline: 'AI-Powered SEO Automation',

  // Contact
  supportEmail: 'phoosupport@helps2.com',

  // URLs
  website: 'https://phoo.ai',

  // Social (add as needed)
  // twitter: '@phooai',
  // linkedin: 'company/phoo',
} as const;

export type Brand = typeof BRAND;
