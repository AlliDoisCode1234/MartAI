/**
 * Apply Constants
 *
 * Shared constants for the apply flow.
 */

export const MONTHLY_REVENUE_OPTIONS = [
  'Less than $10k',
  '$10k - $25k',
  '$25k - $50k',
  '$50k - $100k',
  '$100k+',
] as const;

export const TIMELINE_OPTIONS = [
  'ASAP',
  'Within 30 days',
  'Within 60 days',
  'Within 90 days',
  'Just exploring',
] as const;

export const SUPPORT_OPTIONS = [
  'Website Creation/Rebuild',
  'Social Media Strategy/Content',
  'SEO or Website Traffic',
  'Branding and Design',
  'Email Marketing',
  'Marketing Consultation',
  'Paid Advertising',
  'Other',
] as const;

export const AUTOSAVE_DELAY = 800;
