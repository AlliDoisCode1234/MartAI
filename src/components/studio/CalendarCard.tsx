'use client';

/**
 * CalendarCard Component
 *
 * Component Hierarchy:
 * App → StudioLayout → CalendarPage → CalendarCard (this file)
 *
 * Displays content piece as a calendar card with SEO grade, status, and content type.
 */

import { Box, Text, HStack, Badge, Icon, Tooltip } from '@chakra-ui/react';
import Link from 'next/link';
import { Id } from '@/convex/_generated/dataModel';
import { getContentTypeIcon, getContentTypeLabel } from '@/lib/constants/contentTypes';
import { getSeoGrade } from '@/lib/utils/grading';
import { getStatusStyle } from '@/lib/constants/statusColors';

interface Props {
  contentPiece: {
    _id: Id<'contentPieces'>;
    title: string;
    contentType: string;
    phooContentType?: string;
    status: string;
    seoScore?: number;
    priority?: 'P0' | 'P1' | 'P2';
  };
}

export function CalendarCard({ contentPiece }: Props) {
  const { _id, title, contentType, phooContentType, status, seoScore, priority } = contentPiece;
  const IconComponent = getContentTypeIcon(contentType);
  const statusStyle = getStatusStyle(status);
  const { grade, color: gradeColor } = getSeoGrade(seoScore);

  return (
    <Link href={`/studio/${_id}`} style={{ display: 'block', textDecoration: 'none' }}>
      <Box
        bg={statusStyle.bg}
        border={`1px solid ${statusStyle.border}`}
        borderRadius="8px"
        p={2}
        cursor="pointer"
        transition="all 0.15s ease"
        _hover={{
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        }}
        position="relative"
        minH="60px"
      >
        {/* Priority Badge */}
        {priority && (
          <Badge
            position="absolute"
            top={1}
            right={1}
            fontSize="9px"
            bg={priority === 'P0' ? '#EF4444' : priority === 'P1' ? '#FF9D00' : 'gray.600'}
            color="white"
            borderRadius="4px"
            px={1}
          >
            {priority}
          </Badge>
        )}

        {/* Content Type Icon + Grade */}
        <HStack spacing={1} mb={1}>
          <Tooltip
            label={phooContentType || contentType}
            placement="top"
            hasArrow
            bg="gray.800"
            color="white"
          >
            <Box>
              <Icon as={IconComponent} boxSize={3} color={statusStyle.text} />
            </Box>
          </Tooltip>
          <Text fontSize="xs" fontWeight="bold" color={gradeColor}>
            {grade}
          </Text>
        </HStack>

        {/* Title */}
        <Text
          fontSize="xs"
          color="white"
          noOfLines={2}
          lineHeight="1.3"
          fontWeight="medium"
          title={title}
        >
          {title}
        </Text>
      </Box>
    </Link>
  );
}
