'use client';

/**
 * ProgressBadge Component
 *
 * Component Hierarchy:
 * App → Strategy → ProgressBadge (this file)
 *
 * Simple visual indicator of strategy progress.
 * Replaces complex StrategyStepper.
 */

import { HStack, Box, Text, Tooltip } from '@chakra-ui/react';

type Props = {
  currentStage: number;
  totalStages?: number;
};

const STAGE_LABELS = ['Keywords', 'Topics', 'Plan', 'Content'];

export function ProgressBadge({ currentStage, totalStages = 4 }: Props) {
  return (
    <HStack spacing={2}>
      {Array.from({ length: totalStages }).map((_, index) => {
        const stageNum = index + 1;
        const isComplete = stageNum < currentStage;
        const isCurrent = stageNum === currentStage;

        return (
          <Tooltip key={stageNum} label={STAGE_LABELS[index]} hasArrow>
            <HStack spacing={1}>
              <Box
                w={isCurrent ? '24px' : '12px'}
                h="12px"
                borderRadius="full"
                bg={isComplete ? 'green.400' : isCurrent ? 'orange.400' : 'gray.200'}
                transition="all 0.2s"
              />
              {isCurrent && (
                <Text fontSize="xs" fontWeight="semibold" color="orange.600">
                  {STAGE_LABELS[index]}
                </Text>
              )}
            </HStack>
          </Tooltip>
        );
      })}
    </HStack>
  );
}
