'use client';

/**
 * ContentCard
 *
 * Component Hierarchy:
 * App → StudioLayout → ContentLibrary → ContentCard
 *
 * Glassmorphism card for displaying content piece in library view.
 */

import { Box, Text, Badge, HStack, VStack, Icon } from '@chakra-ui/react';
import { FiFileText, FiClock } from 'react-icons/fi';
import Link from 'next/link';
import { getSeoGrade } from '@/lib/utils/grading';
import { getStatusHex } from '@/lib/constants/statusColors';
import { formatRelativeTime } from '@/lib/dateUtils';

interface Props {
  contentPiece: {
    _id: string;
    title: string;
    contentType: string;
    status: string;
    wordCount?: number;
    seoScore?: number;
    updatedAt: number;
  };
}

export function ContentCard({ contentPiece }: Props) {
  const { grade, color: gradeColor } = getSeoGrade(contentPiece.seoScore);
  const statusColor = getStatusHex(contentPiece.status);

  return (
    <Link href={`/studio/${contentPiece._id}`} style={{ textDecoration: 'none' }}>
      <Box
        bg="rgba(255, 255, 255, 0.03)"
        border="1px solid rgba(255, 255, 255, 0.08)"
        borderRadius="16px"
        p={5}
        cursor="pointer"
        transition="all 0.2s ease"
        _hover={{
          bg: 'rgba(255, 255, 255, 0.06)',
          borderColor: 'rgba(255, 157, 0, 0.3)',
          boxShadow: '0 0 30px rgba(255, 157, 0, 0.1)',
          transform: 'translateY(-2px)',
        }}
      >
        <VStack align="stretch" spacing={4}>
          {/* Header with type badge */}
          <HStack justify="space-between">
            <Badge
              bg="rgba(255, 255, 255, 0.1)"
              color="gray.300"
              px={2}
              py={1}
              borderRadius="6px"
              fontSize="xs"
              textTransform="capitalize"
            >
              {contentPiece.contentType}
            </Badge>
            <Icon as={FiFileText} color="gray.500" />
          </HStack>

          {/* Title */}
          <Text fontSize="md" fontWeight="semibold" color="white" noOfLines={2} lineHeight="1.4">
            {contentPiece.title}
          </Text>

          {/* Word count */}
          {contentPiece.wordCount && (
            <Text fontSize="sm" color="gray.500">
              {contentPiece.wordCount.toLocaleString()} words
            </Text>
          )}

          {/* Footer with score and status */}
          <HStack justify="space-between" align="center">
            {/* SEO Score */}
            <Box
              bg={`${gradeColor}20`}
              color={gradeColor}
              px={3}
              py={1}
              borderRadius="8px"
              fontWeight="bold"
              fontSize="lg"
              textShadow={`0 0 10px ${gradeColor}`}
            >
              {grade}
            </Box>

            {/* Status and time */}
            <VStack align="end" spacing={0}>
              <Badge
                bg={`${statusColor}20`}
                color={statusColor}
                px={2}
                py={0.5}
                borderRadius="4px"
                fontSize="xs"
                textTransform="capitalize"
              >
                {contentPiece.status}
              </Badge>
              <HStack spacing={1} color="gray.500" fontSize="xs">
                <Icon as={FiClock} boxSize={3} />
                <Text>{formatRelativeTime(contentPiece.updatedAt)}</Text>
              </HStack>
            </VStack>
          </HStack>
        </VStack>
      </Box>
    </Link>
  );
}
