'use client';

/**
 * OnboardingProgress Component
 *
 * Component Hierarchy:
 * App → Onboarding → OnboardingProgress (this file)
 *
 * Progress bar with step indicator.
 */

import { Box, HStack, Text, Progress } from '@chakra-ui/react';
import { TOTAL_STEPS } from '@/lib/constants/onboarding';

type Props = {
  step: number;
};

export function OnboardingProgress({ step }: Props) {
  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <Box>
      <HStack justify="space-between" mb={2}>
        <Text fontSize="sm" color="gray.500">
          Step {step} of {TOTAL_STEPS}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {Math.round(progress)}% complete
        </Text>
      </HStack>
      <Progress value={progress} size="sm" colorScheme="orange" borderRadius="full" bg="gray.200" />
    </Box>
  );
}
