'use client';

import {
  Box,
  HStack,
  Text,
  Progress,
  Tooltip,
  Badge,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ComponentType } from 'react';

const MotionBox = motion(Box);

interface ScoreBarProps {
  label: string;
  value: number;
  maxValue?: number;
  icon?: ComponentType;
  description?: string;
  /** Weight percentage shown in tooltip */
  weight?: number;
  /** Animation delay in seconds */
  delay?: number;
}

/**
 * Animated horizontal score bar with label, icon, and progress.
 * Reusable for any scored metric visualization.
 */
export function ScoreBar({
  label,
  value,
  maxValue = 100,
  icon,
  description,
  weight,
  delay = 0,
}: ScoreBarProps) {
  const textMuted = useColorModeValue('gray.600', 'gray.400');
  const barBg = useColorModeValue('gray.100', 'gray.700');

  const percentage = (value / maxValue) * 100;

  const getColorScheme = (v: number) => {
    if (v >= 80) return 'green';
    if (v >= 60) return 'blue';
    if (v >= 40) return 'yellow';
    return 'red';
  };

  const tooltipLabel = [description, weight ? `${weight}% of total` : null]
    .filter(Boolean)
    .join(' • ');

  const content = (
    <MotionBox
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      w="full"
    >
      <HStack justify="space-between" mb={1}>
        <HStack spacing={2}>
          {icon && <Icon as={icon} boxSize={4} color={textMuted} />}
          <Text fontSize="sm" color={textMuted} fontWeight="medium">
            {label}
          </Text>
        </HStack>
        <Badge colorScheme={getColorScheme(percentage)} fontSize="xs" borderRadius="full" px={2}>
          {value}
        </Badge>
      </HStack>
      <Progress
        value={percentage}
        size="sm"
        borderRadius="full"
        colorScheme={getColorScheme(percentage)}
        bg={barBg}
        sx={{
          '& > div': {
            transition: 'width 1s ease-out',
          },
        }}
      />
    </MotionBox>
  );

  return tooltipLabel ? (
    <Tooltip label={tooltipLabel} placement="top" hasArrow>
      {content}
    </Tooltip>
  ) : (
    content
  );
}
