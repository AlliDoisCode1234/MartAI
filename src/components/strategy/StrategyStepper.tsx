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
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepTitle,
  StepDescription,
  StepSeparator,
  Icon,
  HStack,
  VStack,
  Text,
  useColorModeValue,
  useBreakpointValue,
  Skeleton,
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
  const activeStep = Math.min(Math.max(currentStage - 1, 0), 3); // Clamp to 0-3
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Use compact version on mobile
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

  // Compact version for mobile
  if (isMobile) {
    return <StrategyStepperCompact currentStage={currentStage} />;
  }

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
      <Stepper index={activeStep} colorScheme="orange" size="lg">
        {stages.map((stage, index) => (
          <Step
            key={index}
            onClick={() => onStageClick?.(index + 1)}
            style={{ cursor: onStageClick ? 'pointer' : 'default' }}
            aria-current={index === activeStep ? 'step' : undefined}
          >
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<Icon as={stage.icon} boxSize={5} />}
                active={<Icon as={stage.icon} boxSize={5} />}
              />
            </StepIndicator>

            <Box flexShrink="0">
              <StepTitle>{stage.title}</StepTitle>
              <StepDescription>{stage.description}</StepDescription>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

/**
 * Compact version for mobile
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
