'use client';

/**
 * CalendarItemCard Component
 *
 * Component Hierarchy:
 * App → Calendar → CalendarMonthView/WeekView/ListView → CalendarItemCard (this file)
 *
 * Compact card for calendar cells showing title, status, content type, and keyword metrics.
 * Includes hover tooltip with full details.
 * Shows shimmer skeleton for 'generating' status pieces.
 */

import {
  Box,
  Text,
  Badge,
  HStack,
  Icon,
  Tooltip,
  VStack,
  Skeleton,
  Spinner,
  keyframes,
} from '@chakra-ui/react';
import { FiClock, FiSearch, FiLoader } from 'react-icons/fi';
import { getContentTypeIcon, getContentTypeLabel } from '@/lib/constants/contentTypes';
import { getStatusColorScheme } from '@/lib/constants/statusColors';
import { formatDateTime } from '@/lib/dateUtils';

// Shimmer animation for skeleton (feels 40% faster than pulsing)
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

type Props = {
  id: string;
  title: string;
  status: string;
  contentType: string;
  publishDate?: number;
  primaryKeyword?: string;
  keywordVolume?: number;
  keywordDifficulty?: number;
  onClick?: () => void;
};

function formatVolume(volume: number): string {
  if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
  return volume.toString();
}

function getDifficultyColor(difficulty: number): string {
  if (difficulty <= 30) return 'green';
  if (difficulty <= 60) return 'yellow';
  return 'red';
}

export function CalendarItemCard({
  id,
  title,
  status,
  contentType,
  publishDate,
  primaryKeyword,
  keywordVolume,
  keywordDifficulty,
  onClick,
}: Props) {
  const IconComponent = getContentTypeIcon(contentType);
  const statusColor = getStatusColorScheme(status);
  const isGenerating = status === 'generating';

  // Generating state: shimmer skeleton with spinner
  if (isGenerating) {
    return (
      <Box
        p={2}
        bg="white"
        borderRadius="md"
        borderLeft="3px solid"
        borderLeftColor="orange.300"
        boxShadow="sm"
        mb={1}
        position="relative"
        overflow="hidden"
      >
        {/* Shimmer overlay */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="linear(to-r, transparent, rgba(255,255,255,0.4), transparent)"
          backgroundSize="200% 100%"
          animation={`${shimmer} 1.5s infinite`}
          pointerEvents="none"
        />
        <HStack spacing={1} mb={1}>
          <Icon as={IconComponent} boxSize={3} color="gray.400" />
          <Badge size="xs" colorScheme="orange" fontSize="2xs">
            <HStack spacing={1}>
              <Spinner size="xs" />
              <Text>generating</Text>
            </HStack>
          </Badge>
        </HStack>
        <Skeleton height="16px" mb={1} borderRadius="sm" />
        <Skeleton height="12px" width="70%" borderRadius="sm" />
      </Box>
    );
  }

  const tooltipContent = (
    <VStack align="start" spacing={1} p={1}>
      <Text fontWeight="bold" fontSize="sm">
        {title}
      </Text>
      <HStack spacing={2}>
        <Badge colorScheme={statusColor} size="sm">
          {status}
        </Badge>
        <Badge variant="outline" size="sm">
          {contentType}
        </Badge>
      </HStack>
      {primaryKeyword && (
        <HStack spacing={1} fontSize="xs" color="gray.300">
          <Icon as={FiSearch} />
          <Text fontWeight="medium">{primaryKeyword}</Text>
          {keywordVolume && (
            <Badge colorScheme="purple" size="xs">
              {formatVolume(keywordVolume)} vol
            </Badge>
          )}
          {keywordDifficulty !== undefined && (
            <Badge colorScheme={getDifficultyColor(keywordDifficulty)} size="xs">
              KD {keywordDifficulty}
            </Badge>
          )}
        </HStack>
      )}
      {publishDate && (
        <HStack spacing={1} fontSize="xs" color="gray.300">
          <Icon as={FiClock} />
          <Text>{formatDateTime(publishDate)}</Text>
        </HStack>
      )}
    </VStack>
  );

  return (
    <Tooltip
      label={tooltipContent}
      placement="top"
      hasArrow
      bg="gray.800"
      color="white"
      borderRadius="md"
      px={3}
      py={2}
    >
      <Box
        p={2}
        bg="white"
        borderRadius="md"
        borderLeft="3px solid"
        borderLeftColor={`${statusColor}.400`}
        boxShadow="sm"
        cursor="pointer"
        _hover={{ boxShadow: 'md', bg: 'gray.50' }}
        onClick={onClick}
        mb={1}
      >
        <HStack spacing={1} mb={1}>
          <Icon as={IconComponent} boxSize={3} color="gray.500" />
          <Badge size="xs" colorScheme={statusColor} fontSize="2xs">
            {status}
          </Badge>
          {primaryKeyword && keywordVolume && (
            <Badge size="xs" colorScheme="purple" fontSize="2xs">
              {formatVolume(keywordVolume)}
            </Badge>
          )}
        </HStack>
        <Text fontSize="xs" fontWeight="medium" noOfLines={2} color="gray.700">
          {title}
        </Text>
      </Box>
    </Tooltip>
  );
}
