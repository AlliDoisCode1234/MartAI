'use client';

/**
 * TrendChart - Simple CSS-based bar/line chart for trends
 *
 * Component Hierarchy:
 * App → Admin → Analytics → TrendChart (this file)
 *
 * A lightweight chart for BI dashboards without heavy charting libraries.
 */

import { Box, HStack, VStack, Text, Tooltip } from '@chakra-ui/react';

type TrendPoint = {
  date: string;
  count: number;
};

type Props = {
  data: TrendPoint[];
  height?: number;
  barColor?: string;
  showLabels?: boolean;
};

export function TrendChart({
  data,
  height = 120,
  barColor = 'orange.400',
  showLabels = true,
}: Props) {
  if (!data || data.length === 0) {
    return (
      <Box h={`${height}px`} display="flex" alignItems="center" justifyContent="center">
        <Text color="gray.400" fontSize="sm">
          No trend data available
        </Text>
      </Box>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <VStack spacing={2} align="stretch" w="full">
      <HStack spacing={1} align="flex-end" h={`${height}px`} w="full">
        {data.map((point, index) => {
          const barHeight = (point.count / maxCount) * (height - 20);
          const formattedDate = formatTrendDate(point.date);

          return (
            <Tooltip
              key={`${point.date}-${index}`}
              label={`${formattedDate}: ${point.count} events`}
              placement="top"
            >
              <Box
                flex={1}
                minW="4px"
                h={`${Math.max(barHeight, 4)}px`}
                bg={barColor}
                borderRadius="sm"
                transition="all 0.2s"
                _hover={{ opacity: 0.8, transform: 'scaleY(1.05)' }}
                cursor="pointer"
              />
            </Tooltip>
          );
        })}
      </HStack>

      {showLabels && data.length <= 14 && (
        <HStack spacing={1} w="full" justify="space-between">
          <Text fontSize="2xs" color="gray.400">
            {formatTrendDate(data[0]?.date || '')}
          </Text>
          <Text fontSize="2xs" color="gray.400">
            {formatTrendDate(data[data.length - 1]?.date || '')}
          </Text>
        </HStack>
      )}
    </VStack>
  );
}

function formatTrendDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}
