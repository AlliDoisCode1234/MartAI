'use client';

/**
 * Train Roadmap Component
 *
 * Component Hierarchy:
 * App → StudioLayout → Strategy → TrainRoadmap (this file)
 *
 * 6-month content roadmap with train animation metaphor.
 * Train moves left-to-right as phases complete.
 */

import { Box, VStack, HStack, Heading, Text, Icon, Tooltip } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiBookOpen, FiTarget, FiInfo } from 'react-icons/fi';

const MotionBox = motion(Box);

// Roadmap phases based on Calendar Intelligence
const ROADMAP_PHASES = [
  {
    id: 'foundation',
    label: 'Foundation',
    months: 'Month 1-2',
    description: 'Homepage, About, Core Services',
    icon: FiHome,
    color: '#FF9D00',
    contentTypes: ['homepage', 'about', 'service'],
  },
  {
    id: 'authority',
    label: 'Authority',
    months: 'Month 3-4',
    description: 'Blog posts, How-to guides',
    icon: FiBookOpen,
    color: '#4299E1',
    contentTypes: ['blog', 'blogVideo', 'contentRefresh'],
  },
  {
    id: 'conversion',
    label: 'Conversion',
    months: 'Month 5-6',
    description: 'Lead magnets, Landing pages',
    icon: FiTarget,
    color: '#48BB78',
    contentTypes: ['leadMagnet', 'paidProduct', 'landing'],
  },
];

interface Props {
  completedPhases: number; // 0, 1, 2, or 3
  contentByPhase: {
    foundation: { total: number; completed: number };
    authority: { total: number; completed: number };
    conversion: { total: number; completed: number };
  };
}

export function TrainRoadmap({ completedPhases, contentByPhase }: Props) {
  // Calculate train position (0-100%)
  const trainPosition = Math.min(completedPhases * 33 + 5, 95);

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      bg="rgba(255, 255, 255, 0.03)"
      borderRadius="16px"
      border="1px solid rgba(255, 255, 255, 0.1)"
      p={6}
      overflow="visible"
    >
      <VStack align="stretch" spacing={6}>
        {/* Header */}
        <HStack justify="space-between">
          <VStack align="start" spacing={1}>
            <Heading size="md" color="white">
              6-Month Content Roadmap
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Your journey from foundation to conversion
            </Text>
          </VStack>
          <Tooltip
            label="Content is planned across 6 months: Foundation (core pages), Authority (blogs), Conversion (lead magnets)"
            placement="top"
            hasArrow
            bg="gray.700"
          >
            <Box>
              <Icon as={FiInfo} color="gray.500" cursor="help" />
            </Box>
          </Tooltip>
        </HStack>

        {/* Track and Train */}
        <Box position="relative" py={8}>
          {/* Railway Track */}
          <Box
            position="absolute"
            left="0"
            right="0"
            top="50%"
            transform="translateY(-50%)"
            h="4px"
            bg="rgba(255, 255, 255, 0.1)"
            borderRadius="full"
          >
            {/* Completed track */}
            <MotionBox
              initial={{ width: 0 }}
              animate={{ width: `${trainPosition}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              h="100%"
              bg="linear-gradient(90deg, #FF9D00, #4299E1, #48BB78)"
              borderRadius="full"
            />
          </Box>

          {/* Train */}
          <MotionBox
            initial={{ left: '0%' }}
            animate={{ left: `${trainPosition}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            position="absolute"
            top="50%"
            transform="translate(-50%, -50%)"
            zIndex={10}
          >
            <Box
              bg="#FF9D00"
              px={3}
              py={1}
              borderRadius="8px"
              boxShadow="0 4px 20px rgba(255, 157, 0, 0.4)"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <Text fontSize="lg">🚂</Text>
              <Text color="black" fontWeight="bold" fontSize="xs">
                GO
              </Text>
            </Box>
          </MotionBox>

          {/* Station Stops */}
          <HStack justify="space-between" position="relative" zIndex={5}>
            {ROADMAP_PHASES.map((phase, index) => {
              const phaseData = contentByPhase[phase.id as keyof typeof contentByPhase];
              const isCompleted = index < completedPhases;
              const isActive = index === completedPhases;
              const progressPercent =
                phaseData.total > 0 ? (phaseData.completed / phaseData.total) * 100 : 0;

              return (
                <VStack
                  key={phase.id}
                  spacing={2}
                  flex={1}
                  align="center"
                  opacity={isCompleted || isActive ? 1 : 0.5}
                >
                  {/* Station Marker */}
                  <Box
                    w="48px"
                    h="48px"
                    borderRadius="full"
                    bg={isCompleted ? phase.color : isActive ? 'gray.700' : 'gray.800'}
                    border={isActive ? `2px solid ${phase.color}` : 'none'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow={isCompleted ? `0 0 20px ${phase.color}40` : 'none'}
                    transition="all 0.3s ease"
                  >
                    <Icon
                      as={phase.icon}
                      color={isCompleted ? 'white' : isActive ? phase.color : 'gray.500'}
                      boxSize={5}
                    />
                  </Box>

                  {/* Label */}
                  <VStack spacing={0}>
                    <Text
                      color={isCompleted ? 'white' : isActive ? 'white' : 'gray.500'}
                      fontSize="sm"
                      fontWeight="semibold"
                    >
                      {phase.label}
                    </Text>
                    <Text color="gray.500" fontSize="xs">
                      {phase.months}
                    </Text>
                    <Text color="gray.600" fontSize="xs" textAlign="center">
                      {phase.description}
                    </Text>
                  </VStack>

                  {/* Progress */}
                  {phaseData.total > 0 && (
                    <Text color={phase.color} fontSize="xs" fontWeight="medium">
                      {phaseData.completed}/{phaseData.total} done
                    </Text>
                  )}
                </VStack>
              );
            })}
          </HStack>
        </Box>
      </VStack>
    </MotionBox>
  );
}

// Helper to calculate phase data from content pieces
export function calculatePhaseData(
  contentByType: Record<string, { total: number; published: number }>
): Props['contentByPhase'] {
  const phases = {
    foundation: { total: 0, completed: 0 },
    authority: { total: 0, completed: 0 },
    conversion: { total: 0, completed: 0 },
  };

  const typeToPhase: Record<string, keyof typeof phases> = {
    homepage: 'foundation',
    about: 'foundation',
    service: 'foundation',
    blog: 'authority',
    blogVideo: 'authority',
    blogVersus: 'authority',
    contentRefresh: 'authority',
    leadMagnet: 'conversion',
    paidProduct: 'conversion',
    landing: 'conversion',
    areasWeServe: 'foundation',
    employment: 'authority',
    events: 'authority',
    mentorship: 'authority',
    donate: 'conversion',
    partner: 'authority',
    program: 'authority',
  };

  Object.entries(contentByType).forEach(([type, data]) => {
    const phase = typeToPhase[type] || 'authority';
    phases[phase].total += data.total;
    phases[phase].completed += data.published;
  });

  return phases;
}

// Calculate completed phases count
export function countCompletedPhases(phaseData: Props['contentByPhase']): number {
  let completed = 0;
  if (
    phaseData.foundation.completed >= phaseData.foundation.total &&
    phaseData.foundation.total > 0
  )
    completed++;
  if (phaseData.authority.completed >= phaseData.authority.total && phaseData.authority.total > 0)
    completed++;
  if (
    phaseData.conversion.completed >= phaseData.conversion.total &&
    phaseData.conversion.total > 0
  )
    completed++;
  return completed;
}
