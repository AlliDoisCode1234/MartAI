/**
 * Brand Constants
 *
 * Centralized brand configuration for Phoo.
 * Use these constants throughout the app for consistency.
 *
 * Updated Feb 2026: Lead generation positioning
 */

export const BRAND = {
  name: 'Phoo',
  tagline: 'Get Found on Google — and in AI Answers',

  // Contact
  supportEmail: 'phoosupport@helps2.com',

  // URLs
  website: 'https://phoo.ai',

  // Social (add as needed)
  // twitter: '@phooai',
  // linkedin: 'company/phoo',
} as const;

export type Brand = typeof BRAND;
