'use client';

/**
 * CalendarItemCard Component
 *
 * Component Hierarchy:
 * App → Calendar → CalendarMonthView/WeekView/ListView → CalendarItemCard (this file)
 *
 * Compact card for calendar cells showing title, status, and content type.
 * Includes hover tooltip with details.
 */

import { Box, Text, Badge, HStack, Icon, Tooltip, VStack } from '@chakra-ui/react';
import { FiFileText, FiVideo, FiImage, FiMic, FiClock } from 'react-icons/fi';

type Props = {
  id: string;
  title: string;
  status: string;
  contentType: string;
  publishDate?: number;
  onClick?: () => void;
};

const CONTENT_TYPE_ICONS: Record<string, typeof FiFileText> = {
  article: FiFileText,
  video: FiVideo,
  infographic: FiImage,
  podcast: FiMic,
  blog: FiFileText,
};

const STATUS_COLORS: Record<string, string> = {
  idea: 'gray',
  scheduled: 'blue',
  in_progress: 'yellow',
  draft: 'yellow',
  published: 'green',
};

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function CalendarItemCard({ id, title, status, contentType, publishDate, onClick }: Props) {
  const IconComponent = CONTENT_TYPE_ICONS[contentType.toLowerCase()] || FiFileText;
  const statusColor = STATUS_COLORS[status] || 'gray';

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
      {publishDate && (
        <HStack spacing={1} fontSize="xs" color="gray.300">
          <Icon as={FiClock} />
          <Text>{formatDate(publishDate)}</Text>
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
        </HStack>
        <Text fontSize="xs" fontWeight="medium" noOfLines={2} color="gray.700">
          {title}
        </Text>
      </Box>
    </Tooltip>
  );
}
