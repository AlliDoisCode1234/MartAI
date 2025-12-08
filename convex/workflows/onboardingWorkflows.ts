/**
 * Onboarding Workflows
 *
 * Tracks user progress through the onboarding flow:
 * 1. Signup → 2. Plan Selection → 3. Payment → 4. Project Creation → 5. GA4/GSC Setup
 *
 * Note: This workflow is designed for future use when the Convex workflow component
 * is connected. For now, use the direct mutations in onboarding.ts
 */

import { v } from 'convex/values';

/**
 * Onboarding step types
 */
export type OnboardingStep =
  | 'signupCompleted'
  | 'planSelected'
  | 'paymentCompleted'
  | 'projectCreated'
  | 'ga4Connected'
  | 'gscConnected';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  'signupCompleted',
  'planSelected',
  'paymentCompleted',
  'projectCreated',
  'ga4Connected',
  'gscConnected',
];

export const ONBOARDING_STEP_LABELS: Record<OnboardingStep, string> = {
  signupCompleted: 'Account Created',
  planSelected: 'Plan Selected',
  paymentCompleted: 'Payment Complete',
  projectCreated: 'Project Created',
  ga4Connected: 'GA4 Connected',
  gscConnected: 'GSC Connected',
};

/**
 * Calculate onboarding progress percentage
 */
export function calculateProgress(
  steps: Partial<Record<OnboardingStep, boolean | string>>
): number {
  const requiredSteps: OnboardingStep[] = [
    'signupCompleted',
    'planSelected',
    'paymentCompleted',
    'projectCreated',
  ];
  const optionalSteps: OnboardingStep[] = ['ga4Connected', 'gscConnected'];

  const allSteps = [...requiredSteps, ...optionalSteps];
  const completed = allSteps.filter((step) => {
    const value = steps[step];
    return value === true || (step === 'planSelected' && typeof value === 'string');
  }).length;

  return Math.round((completed / allSteps.length) * 100);
}
