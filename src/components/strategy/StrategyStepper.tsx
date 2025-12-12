/**
 * StrategyStepper Component
 *
 * Component Hierarchy:
 * App → StrategyPage → StrategyStepper
 *
 * Horizontal progress stepper showing 4 stages:
 * 1. Keywords - Find what customers search
 * 2. Topic Curator - Group into article topics
 * 3. Content Calendar - Schedule publishing
 * 4. Article Studio - Write and publish
 */

'use client';

import {
  Box,
  Icon,
  HStack,
  VStack,
  Text,
  useColorModeValue,
  useBreakpointValue,
  Skeleton,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { FiSearch, FiLayers, FiCalendar, FiEdit3, FiCheck } from 'react-icons/fi';
import { STEP_LABELS } from '@/src/lib/copyStrings';

interface Props {
  currentStage: number; // 1-4
  onStageClick?: (stage: number) => void;
  isLoading?: boolean;
}

const stages = [
  {
    title: STEP_LABELS[1].title,
    description: STEP_LABELS[1].description,
    icon: FiSearch,
  },
  {
    title: STEP_LABELS[2].title,
    description: STEP_LABELS[2].description,
    icon: FiLayers,
  },
  {
    title: STEP_LABELS[3].title,
    description: STEP_LABELS[3].description,
    icon: FiCalendar,
  },
  {
    title: STEP_LABELS[4].title,
    description: STEP_LABELS[4].description,
    icon: FiEdit3,
  },
];

export function StrategyStepper({ currentStage, onStageClick, isLoading = false }: Props) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const activeColor = useColorModeValue('orange.500', 'orange.300');
  const inactiveColor = useColorModeValue('gray.300', 'gray.600');
  const completedColor = useColorModeValue('green.500', 'green.400');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  // Use different layouts based on screen size
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (isLoading) {
    return (
      <Box
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="xl"
        p={6}
        boxShadow="sm"
      >
        <HStack justify="space-between" spacing={4}>
          {[1, 2, 3, 4].map((i) => (
            <VStack key={i} spacing={2} flex={1}>
              <Skeleton borderRadius="full" w={10} h={10} />
              <Skeleton h={3} w="60px" />
            </VStack>
          ))}
        </HStack>
      </Box>
    );
  }

  // Mobile: Compact vertical/icon-only layout
  if (isMobile) {
    return <StrategyStepperCompact currentStage={currentStage} />;
  }

  // Desktop: Full horizontal layout with grid for proper spacing
  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      p={6}
      boxShadow="sm"
      role="navigation"
      aria-label="Strategy progress"
    >
      <Grid templateColumns="repeat(4, 1fr)" gap={4}>
        {stages.map((stage, index) => {
          const stageNum = index + 1;
          const isCompleted = stageNum < currentStage;
          const isActive = stageNum === currentStage;

          return (
            <GridItem
              key={index}
              onClick={() => onStageClick?.(stageNum)}
              cursor={onStageClick ? 'pointer' : 'default'}
              aria-current={isActive ? 'step' : undefined}
            >
              <HStack spacing={3} align="flex-start">
                {/* Step indicator */}
                <Box
                  w={10}
                  h={10}
                  borderRadius="full"
                  bg={isCompleted ? completedColor : isActive ? activeColor : inactiveColor}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  flexShrink={0}
                  transition="all 0.2s"
                >
                  {isCompleted ? (
                    <Icon as={FiCheck} boxSize={5} />
                  ) : (
                    <Icon as={stage.icon} boxSize={5} />
                  )}
                </Box>

                {/* Title and description */}
                <VStack align="start" spacing={0} flex={1}>
                  <Text
                    fontSize="sm"
                    fontWeight={isActive ? 'bold' : 'semibold'}
                    color={isActive ? activeColor : isCompleted ? completedColor : 'gray.700'}
                  >
                    {stage.title}
                  </Text>
                  <Text fontSize="xs" color={textColor} lineHeight="short">
                    {stage.description}
                  </Text>
                </VStack>
              </HStack>
            </GridItem>
          );
        })}
      </Grid>
    </Box>
  );
}

/**
 * Compact version for mobile - shows only icons with titles below
 */
export function StrategyStepperCompact({ currentStage }: Props) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const activeColor = useColorModeValue('orange.500', 'orange.300');
  const inactiveColor = useColorModeValue('gray.300', 'gray.600');
  const completedColor = useColorModeValue('green.500', 'green.400');

  return (
    <Box bg={bgColor} borderRadius="xl" p={4} boxShadow="sm">
      <HStack justify="space-between" spacing={2}>
        {stages.map((stage, index) => {
          const stageNum = index + 1;
          const isCompleted = stageNum < currentStage;
          const isActive = stageNum === currentStage;

          return (
            <VStack key={index} spacing={1} flex={1}>
              <Box
                w={10}
                h={10}
                borderRadius="full"
                bg={isCompleted ? completedColor : isActive ? activeColor : inactiveColor}
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                transition="all 0.2s"
              >
                {isCompleted ? (
                  <Icon as={FiCheck} boxSize={5} />
                ) : (
                  <Icon as={stage.icon} boxSize={5} />
                )}
              </Box>
              <Text
                fontSize="xs"
                fontWeight={isActive ? 'bold' : 'normal'}
                color={isActive ? activeColor : 'gray.500'}
                textAlign="center"
              >
                {stage.title}
              </Text>
            </VStack>
          );
        })}
      </HStack>
    </Box>
  );
}
