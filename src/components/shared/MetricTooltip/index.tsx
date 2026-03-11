'use client';

/**
 * MetricTooltip
 *
 * Component Hierarchy:
 * App -> [any page] -> MetricTooltip (this file)
 *
 * Reusable accessibility tooltip for ambiguous metrics.
 * Renders a small FiHelpCircle icon that shows a descriptive tooltip on hover.
 * Consumes text from centralized METRIC_DESCRIPTIONS.
 */

import { Tooltip, Icon, Box } from '@chakra-ui/react';
import { FiHelpCircle } from 'react-icons/fi';
import { METRIC_DESCRIPTIONS } from '@/src/constants/metricDescriptions';

type Props = Readonly<{
  metricKey: string;
  label?: string;
  size?: number;
  color?: string;
}>;

export function MetricTooltip({
  metricKey,
  label,
  size = 13,
  color = 'gray.400',
}: Props) {
  const description = label || METRIC_DESCRIPTIONS[metricKey];

  if (!description) return null;

  return (
    <Tooltip
      label={description}
      hasArrow
      placement="top"
      bg="gray.800"
      color="white"
      fontSize="xs"
      px={3}
      py={2}
      borderRadius="md"
      maxW="280px"
      textAlign="center"
      openDelay={200}
    >
      <Box
        as="span"
        display="inline-flex"
        alignItems="center"
        cursor="help"
        ml={1}
        aria-label={`Info: ${description}`}
      >
        <Icon as={FiHelpCircle} boxSize={`${size}px`} color={color} />
      </Box>
    </Tooltip>
  );
}
