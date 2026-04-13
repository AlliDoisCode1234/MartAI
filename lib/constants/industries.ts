/**
 * Shared Industry Options
 *
 * Single source of truth for industry selection across:
 * - Onboarding WelcomeStep
 * - Project creation (/projects/new)
 * - Settings / project context
 *
 * These values are stored in the `projects.industry` field and consumed by:
 * - Content calendar template selection (industryTemplates.ts)
 * - Keyword generation seed terms (keywordActions.ts)
 * - Writer persona prompts (writerPersonas/index.ts)
 * - Content generation context (contentGeneration.ts)
 * - AI analysis prompts (ai/analysis.ts)
 */

export type IndustryOption = {
  readonly value: string;
  readonly label: string;
};

export const INDUSTRY_OPTIONS: readonly IndustryOption[] = [
  { value: 'ecommerce', label: 'E-commerce / Retail' },
  { value: 'saas', label: 'SaaS / Software' },
  { value: 'agency', label: 'Marketing Agency' },
  { value: 'healthcare', label: 'Healthcare / Medical' },
  { value: 'legal', label: 'Legal Services' },
  { value: 'realestate', label: 'Real Estate' },
  { value: 'construction', label: 'Construction / Home Services' },
  { value: 'restaurant', label: 'Restaurant / Food Service' },
  { value: 'fitness', label: 'Fitness / Wellness' },
  { value: 'education', label: 'Education / Coaching' },
  { value: 'nonprofit', label: 'Non-Profit' },
  { value: 'local', label: 'Local Service Business' },
  { value: 'finance', label: 'Finance / Accounting' },
  { value: 'travel', label: 'Travel / Hospitality' },
  { value: 'professional', label: 'Professional Services' },
  { value: 'other', label: 'Other' },
] as const;
