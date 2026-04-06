'use client';

/**
 * New Project Page
 *
 * Component Hierarchy:
 * App → Projects/New (this file)
 *
 * Add a website to analyze and grow with Phoo.
 * Mapped directly to the Unified Onboarding architecture.
 */

import { OnboardingFlow } from '@/src/components/onboarding/OnboardingFlow';

export default function NewProjectPage() {
  return <OnboardingFlow isSubsequentProject={true} />;
}
