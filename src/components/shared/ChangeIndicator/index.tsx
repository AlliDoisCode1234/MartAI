'use client';

import { HStack, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import { FiArrowUp, FiArrowDown, FiMinus } from 'react-icons/fi';

interface ChangeIndicatorProps {
  current: number;
  previous?: number;
  /** Label for when there's no change */
  noChangeLabel?: string;
  /** Unit suffix (e.g., "pts", "%") */
  unit?: string;
}

/**
 * Shows change between current and previous values with directional arrows.
 * Reusable for any metric comparison.
 */
export function ChangeIndicator({
  current,
  previous,
  noChangeLabel = 'No change',
  unit = 'pts',
}: ChangeIndicatorProps) {
  const mutedColor = useColorModeValue('gray.500', 'gray.400');

  if (previous === undefined) return null;

  const diff = current - previous;
  const isUp = diff > 0;
  const isDown = diff < 0;

  if (diff === 0) {
    return (
      <HStack spacing={1} fontSize="xs" color={mutedColor}>
        <Icon as={FiMinus} />
        <Text>{noChangeLabel}</Text>
      </HStack>
    );
  }

  return (
    <HStack spacing={1} fontSize="xs" color={isUp ? 'green.500' : 'red.500'}>
      <Icon as={isUp ? FiArrowUp : FiArrowDown} />
      <Text>
        {Math.abs(diff)} {unit}
      </Text>
    </HStack>
  );
}
