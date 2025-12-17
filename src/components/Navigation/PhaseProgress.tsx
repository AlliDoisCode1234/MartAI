/**
 * PhaseProgress Component
 *
 * Component Hierarchy:
 * App → Layout → Navigation/Sidebar → PhaseProgress (this file)
 *
 * Shows user's current phase progress in the navigation.
 * Displays phase name, progress dots, and next action.
 *
 * Reference: docs/project/USER_FLOW_LDD.md
 */

'use client';

import { Box, HStack, VStack, Text, Progress, Tooltip, Icon } from '@chakra-ui/react';
import { FiCheck, FiLock } from 'react-icons/fi';
import { type UserPhase, PHASES } from '@/lib/useUserPhase';

interface Props {
  currentPhase: UserPhase;
  hasCompletedFirstProject: boolean;
  compact?: boolean;
}

const PHASE_NAMES: Record<UserPhase, string> = {
  1: 'Setup',
  2: 'Connect',
  3: 'Discover',
  4: 'Plan',
  5: 'Create',
  6: 'Full Access',
};

export function PhaseProgress({ currentPhase, hasCompletedFirstProject, compact = false }: Props) {
  const progressPercent = ((currentPhase - 1) / 5) * 100;

  // DIY mode - show minimal indicator
  if (hasCompletedFirstProject) {
    return (
      <HStack spacing={2} px={2} py={1} bg="green.50" borderRadius="md">
        <Icon as={FiCheck} color="green.500" boxSize={4} />
        <Text fontSize="xs" color="green.700" fontWeight="medium">
          Pro Mode
        </Text>
      </HStack>
    );
  }

  if (compact) {
    return (
      <Tooltip label={`Phase ${currentPhase}: ${PHASE_NAMES[currentPhase]}`} hasArrow>
        <HStack spacing={1}>
          {([1, 2, 3, 4, 5, 6] as UserPhase[]).map((phase) => (
            <Box
              key={phase}
              w={phase === currentPhase ? '16px' : '8px'}
              h="8px"
              borderRadius="full"
              bg={
                phase < currentPhase
                  ? 'green.400'
                  : phase === currentPhase
                    ? 'orange.400'
                    : 'gray.200'
              }
              transition="all 0.2s"
            />
          ))}
        </HStack>
      </Tooltip>
    );
  }

  return (
    <VStack align="stretch" spacing={2} p={3} bg="gray.50" borderRadius="lg">
      <HStack justify="space-between">
        <Text fontSize="xs" fontWeight="semibold" color="gray.600">
          Phase {currentPhase}: {PHASE_NAMES[currentPhase]}
        </Text>
        <Text fontSize="xs" color="gray.500">
          {Math.round(progressPercent)}%
        </Text>
      </HStack>

      <Progress
        value={progressPercent}
        size="sm"
        colorScheme="orange"
        borderRadius="full"
        bg="gray.200"
      />

      <HStack spacing={1} justify="space-between">
        {([1, 2, 3, 4, 5, 6] as UserPhase[]).map((phase) => {
          const isComplete = phase < currentPhase;
          const isCurrent = phase === currentPhase;
          const isLocked = phase > currentPhase;

          return (
            <Tooltip key={phase} label={PHASE_NAMES[phase]} hasArrow>
              <Box
                w="24px"
                h="24px"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg={isComplete ? 'green.400' : isCurrent ? 'orange.400' : 'gray.200'}
                color={isComplete || isCurrent ? 'white' : 'gray.400'}
                fontSize="xs"
                fontWeight="bold"
                transition="all 0.2s"
              >
                {isComplete ? (
                  <Icon as={FiCheck} boxSize={3} />
                ) : isLocked ? (
                  <Icon as={FiLock} boxSize={3} />
                ) : (
                  phase
                )}
              </Box>
            </Tooltip>
          );
        })}
      </HStack>

      <Text fontSize="xs" color="gray.500" textAlign="center">
        {PHASES[currentPhase].nextAction}
      </Text>
    </VStack>
  );
}
