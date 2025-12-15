'use client';

/**
 * OnboardingJourneyCard Component
 *
 * Component Hierarchy:
 * App → Admin → Users → [id] → OnboardingJourneyCard (this file)
 *
 * Displays onboarding step progress with timestamps.
 */

import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  VStack,
  HStack,
  Box,
  Text,
  Badge,
  Progress,
} from '@chakra-ui/react';
import { CheckCircleIcon, TimeIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import { ONBOARDING_STEP_CONFIG } from '@/lib/constants/admin';
import { calculateOnboardingProgress } from '@/lib/utils/onboarding';
import type { OnboardingSteps } from '@/types/admin';

type Props = {
  steps: OnboardingSteps | undefined;
};

export function OnboardingJourneyCard({ steps }: Props) {
  const progress = calculateOnboardingProgress(steps);

  return (
    <Card>
      <CardHeader pb={0}>
        <Heading size="md">Onboarding Journey</Heading>
      </CardHeader>
      <CardBody>
        <Box mb={4}>
          <Progress
            value={progress}
            size="lg"
            colorScheme={progress === 100 ? 'green' : 'blue'}
            borderRadius="full"
          />
        </Box>
        <VStack spacing={3} align="stretch">
          {ONBOARDING_STEP_CONFIG.map((config) => {
            const value = steps?.[config.key as keyof OnboardingSteps];
            const isComplete =
              value === true || (config.key === 'planSelected' && typeof value === 'string');
            const timestamp = steps?.[`${config.key}At` as keyof OnboardingSteps] as
              | number
              | undefined;

            return (
              <HStack
                key={config.key}
                justify="space-between"
                p={3}
                bg={isComplete ? 'green.50' : 'gray.50'}
                borderRadius="md"
                border="1px solid"
                borderColor={isComplete ? 'green.200' : 'gray.200'}
              >
                <HStack>
                  <Text fontSize="lg">{config.icon}</Text>
                  <Text fontWeight="medium">{config.label}</Text>
                  {config.key === 'planSelected' && typeof value === 'string' && (
                    <Badge colorScheme="blue">{value}</Badge>
                  )}
                </HStack>
                <HStack>
                  {timestamp && (
                    <Text fontSize="xs" color="gray.500">
                      {format(timestamp, 'MMM d, h:mm a')}
                    </Text>
                  )}
                  {isComplete ? (
                    <CheckCircleIcon color="green.500" />
                  ) : (
                    <TimeIcon color="gray.400" />
                  )}
                </HStack>
              </HStack>
            );
          })}
        </VStack>
      </CardBody>
    </Card>
  );
}
