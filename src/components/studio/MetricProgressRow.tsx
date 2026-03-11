'use client';

/**
 * MetricProgressRow
 *
 * Component Hierarchy:
 * App → StudioLayout → InsightsPage → MetricProgressRow
 *
 * Labeled horizontal progress bar for displaying optimization metrics.
 * Shows title, progress bar, and numeric value aligned right.
 */

import { Box, Flex, Text, Progress } from '@chakra-ui/react';
import { STUDIO_COLORS } from '@/lib/constants/studioTokens';

interface Props {
  title: string;
  value: number;
  maxValue?: number;
  color?: string;
  colorScheme?: string;
  showHeader?: boolean;
}

export function MetricProgressRow({
  title,
  value,
  maxValue = 100,
  color,
  colorScheme = 'orange',
  showHeader = true,
}: Props) {
  const percentage = Math.min(Math.round((value / maxValue) * 100), 100);

  return (
    <Box>
      {showHeader && (
        <Flex justify="space-between" align="center" mb={2}>
          <Text fontSize="sm" color={STUDIO_COLORS.textSecondary}>
            {title}
          </Text>
          <Text fontSize="sm" fontWeight="bold" color={color || 'white'}>
            {value}
          </Text>
        </Flex>
      )}
      <Progress
        value={percentage}
        colorScheme={colorScheme}
        bg="gray.200"
        borderRadius="full"
        size="sm"
        sx={{
          '& > div': {
            borderRadius: 'full',
          },
        }}
      />
    </Box>
  );
}
