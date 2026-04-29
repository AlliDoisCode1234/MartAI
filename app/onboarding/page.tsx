'use client';

/**
 * Onboarding Page
 *
 * Component Hierarchy:
 * App → Onboarding (this file)
 */

import { OnboardingFlow } from '@/src/components/onboarding/OnboardingFlow';
import { BetaOnboardingFlow } from '@/src/components/onboarding/BetaOnboardingFlow';
import { useAuth } from '@/lib/useAuth';
import { Box } from '@chakra-ui/react';
import { MartLoader } from '@/src/components/assistant';

export default function OnboardingPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="brand.light">
        <MartLoader message="Loading..." />
      </Box>
    );
  }

  if (user?.isBetaUser || user?.isQATester) {
    return <BetaOnboardingFlow />;
  }

  return <OnboardingFlow />;
}
