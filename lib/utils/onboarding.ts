/**
 * Onboarding Utils
 *
 * Helper functions for onboarding progress calculations.
 */

import { ONBOARDING_STEP_CONFIG } from '@/lib/constants/admin';
import type { OnboardingSteps } from '@/types/admin';

/**
 * Calculate onboarding progress percentage (0-100)
 */
export function calculateOnboardingProgress(steps?: OnboardingSteps): number {
  if (!steps) return 0;

  const allSteps = ONBOARDING_STEP_CONFIG.map((s) => s.key);
  const completed = allSteps.filter((key) => {
    const value = steps[key as keyof OnboardingSteps];
    return value === true || (key === 'planSelected' && typeof value === 'string');
  }).length;

  return Math.round((completed / allSteps.length) * 100);
}

/**
 * Format health tier label for display
 */
export function formatHealthTier(tier: string): string {
  if (tier === 'at_risk') return 'At Risk';
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}

/**
 * Format status label for display (replaces underscores, capitalizes)
 */
export function formatStatusLabel(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}
