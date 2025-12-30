'use client';

/**
 * ProcessingStep Component
 *
 * Component Hierarchy:
 * App → Onboarding → ProcessingStep (this file)
 *
 * Step 5: Processing/analyzing state with real-time status.
 */

import { Box, VStack, HStack, Heading, Text, Badge, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiZap, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { MartCharacter } from '@/src/components/assistant';

const MotionBox = motion(Box);

interface Props {
  projectId?: string | null;
}

export function ProcessingStep({ projectId }: Props) {
  // Subscribe to project for real-time status updates
  const project = useQuery(
    api.projects.projects.getProjectById,
    projectId ? { projectId: projectId as Id<'projects'> } : 'skip'
  );

  const status = project?.generationStatus ?? 'generating';
  const isComplete = status === 'complete';
  const isError = status === 'error';

  return (
    <MotionBox
      key="step5"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Box bg="white" p={12} borderRadius="2xl" shadow="lg" textAlign="center">
        <VStack spacing={6}>
          <MartCharacter
            state={isComplete ? 'active' : isError ? 'thinking' : 'loading'}
            size="lg"
            showBubble={false}
          />
          <Heading size="lg">
            {isComplete
              ? 'Your strategy is ready!'
              : isError
                ? 'Something went wrong'
                : 'Phoo is analyzing your site...'}
          </Heading>
          <Text color="gray.600">
            {isComplete
              ? 'Keywords, clusters, and content plan generated. You can proceed!'
              : isError
                ? "We'll retry automatically. You can continue to the next step."
                : 'Finding keywords, building clusters, and creating your content plan.'}
          </Text>
          <HStack spacing={4} pt={4}>
            <Badge colorScheme={isComplete ? 'green' : isError ? 'red' : 'blue'} px={3} py={1}>
              <HStack spacing={1}>
                <Icon as={isComplete ? FiCheck : isError ? FiAlertCircle : FiZap} />
                <Text>{isComplete ? 'Complete' : isError ? 'Error' : 'Generating...'}</Text>
              </HStack>
            </Badge>
          </HStack>
        </VStack>
      </Box>
    </MotionBox>
  );
}
