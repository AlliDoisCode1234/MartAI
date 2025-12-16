'use client';

/**
 * CalendarItemCard Component
 *
 * Component Hierarchy:
 * App → Calendar → CalendarMonthView/ListView → CalendarItemCard (this file)
 *
 * Compact card for calendar cells showing title, status, and content type.
 */

import { Box, Text, Badge, HStack, Icon } from '@chakra-ui/react';
import { FiFileText, FiVideo, FiImage, FiMic } from 'react-icons/fi';

type Props = {
  id: string;
  title: string;
  status: string;
  contentType: string;
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

export function CalendarItemCard({ id, title, status, contentType, onClick }: Props) {
  const IconComponent = CONTENT_TYPE_ICONS[contentType.toLowerCase()] || FiFileText;
  const statusColor = STATUS_COLORS[status] || 'gray';

  return (
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
  );
}
