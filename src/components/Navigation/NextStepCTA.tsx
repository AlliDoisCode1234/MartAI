/**
 * NextStepCTA Component
 *
 * Component Hierarchy:
 * App → Page → NextStepCTA (this file)
 *
 * Shows a "Next Step" call-to-action based on user's current phase.
 * Appears at the bottom of pages to guide users forward.
 *
 * Reference: docs/project/USER_FLOW_LDD.md
 */

'use client';

import { Box, HStack, VStack, Text, Button, Icon } from '@chakra-ui/react';
import { useRouter, usePathname } from 'next/navigation';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { getNextStepCTA, type UserPhase } from '@/lib/useUserPhase';

const MotionBox = motion(Box);

interface Props {
  phase: UserPhase;
  hasCompletedFirstProject: boolean;
}

export function NextStepCTA({ phase, hasCompletedFirstProject }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show CTA if user is in DIY mode (completed first project)
  if (hasCompletedFirstProject) return null;

  // Don't show CTA if at full access
  if (phase >= 6) return null;

  const nextStep = getNextStepCTA(phase, pathname || '');
  if (!nextStep) return null;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      position="fixed"
      bottom={6}
      right={6}
      zIndex={100}
    >
      <Box
        bg="white"
        borderRadius="xl"
        boxShadow="xl"
        border="1px"
        borderColor="orange.200"
        p={4}
        maxW="320px"
      >
        <VStack align="stretch" spacing={3}>
          <HStack spacing={2}>
            <Box
              w="32px"
              h="32px"
              borderRadius="full"
              bg="orange.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FiArrowRight} color="orange.500" boxSize={4} />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="sm" fontWeight="semibold" color="gray.800">
                Next Step
              </Text>
              <Text fontSize="xs" color="gray.500">
                {nextStep.description}
              </Text>
            </VStack>
          </HStack>

          <Button
            colorScheme="orange"
            size="sm"
            rightIcon={<FiArrowRight />}
            onClick={() => router.push(nextStep.path)}
            w="full"
          >
            {nextStep.label}
          </Button>
        </VStack>
      </Box>
    </MotionBox>
  );
}

/**
 * Inline version for embedding in page content
 */
export function NextStepInline({ phase, hasCompletedFirstProject }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  if (hasCompletedFirstProject) return null;
  if (phase >= 6) return null;

  const nextStep = getNextStepCTA(phase, pathname || '');
  if (!nextStep) return null;

  return (
    <Box bg="orange.50" borderRadius="lg" border="1px" borderColor="orange.200" p={4} mt={6}>
      <HStack justify="space-between" flexWrap="wrap" gap={3}>
        <VStack align="start" spacing={1}>
          <HStack spacing={2}>
            <Icon as={FiCheck} color="green.500" />
            <Text fontSize="sm" fontWeight="semibold" color="gray.700">
              Great progress!
            </Text>
          </HStack>
          <Text fontSize="sm" color="gray.600">
            {nextStep.description}
          </Text>
        </VStack>
        <Button
          colorScheme="orange"
          size="sm"
          rightIcon={<FiArrowRight />}
          onClick={() => router.push(nextStep.path)}
        >
          {nextStep.label}
        </Button>
      </HStack>
    </Box>
  );
}
