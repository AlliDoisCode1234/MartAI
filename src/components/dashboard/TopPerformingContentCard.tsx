'use client';

/**
 * TopPerformingContentCard
 *
 * Component Hierarchy:
 * App → Dashboard → TopPerformingContentCard (this file)
 *
 * Shows the most recent published/approved content pieces.
 * Wired to real contentPieces data from Convex.
 */

import { Box, VStack, HStack, Text, Icon, Badge } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiArrowRight, FiFileText, FiEdit3 } from 'react-icons/fi';
import Link from 'next/link';

const MotionBox = motion(Box);

type ContentItem = {
  _id: string;
  title: string;
  wordCount?: number;
  status: string;
  updatedAt: number;
  contentType?: string;
};

type Props = {
  content: ContentItem[];
};

function getTimeAgo(timestamp: number): string {
  const days = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'published':
      return '#34d399';
    case 'approved':
      return '#60a5fa';
    case 'scheduled':
      return '#F99F2A';
    default:
      return '#94a3b8';
  }
}

function getContentIcon(contentType?: string) {
  switch (contentType) {
    case 'blogPost':
    case 'article':
      return FiFileText;
    default:
      return FiEdit3;
  }
}

export function TopPerformingContentCard({ content }: Props) {
  const hasContent = content.length > 0;

  return (
    <MotionBox
      bg="rgba(255, 255, 255, 0.03)"
      backdropFilter="blur(20px)"
      border="1px solid rgba(255, 255, 255, 0.08)"
      borderRadius="2xl"
      p={{ base: 4, md: 5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      h="100%"
    >
      <VStack align="stretch" spacing={4} h="100%">
        <HStack spacing={2}>
          <Icon as={FiTrendingUp} color="#60a5fa" boxSize={4} />
          <Text color="white" fontWeight="semibold" fontSize="sm">
            Top Performing Content
          </Text>
        </HStack>

        <VStack align="stretch" spacing={3} flex={1}>
          {!hasContent && (
            <VStack py={6} spacing={2}>
              <Icon as={FiFileText} color="gray.600" boxSize={8} />
              <Text color="gray.500" fontSize="sm" textAlign="center">
                No published content yet
              </Text>
              <Text color="gray.600" fontSize="xs" textAlign="center">
                Create and publish content to see it here
              </Text>
            </VStack>
          )}
          {content.slice(0, 3).map((item) => {
            const ContentIcon = getContentIcon(item.contentType);
            const statusColor = getStatusColor(item.status);

            return (
              <HStack key={item._id} spacing={3} align="center">
                <Box
                  w="48px"
                  h="48px"
                  borderRadius="lg"
                  bg={`${statusColor}20`}
                  border={`1px solid ${statusColor}40`}
                  flexShrink={0}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={ContentIcon} color={statusColor} boxSize={4} />
                </Box>

                <VStack align="start" spacing={0} flex={1} minW={0}>
                  <Text color="gray.200" fontSize="xs" fontWeight="medium" noOfLines={2}>
                    {item.title}
                  </Text>
                  <HStack spacing={2}>
                    <Text color="gray.500" fontSize="xs">
                      {getTimeAgo(item.updatedAt)}
                    </Text>
                    <Badge
                      size="sm"
                      colorScheme={item.status === 'published' ? 'green' : 'blue'}
                      fontSize="9px"
                      px={1.5}
                    >
                      {item.status}
                    </Badge>
                  </HStack>
                </VStack>

                {item.wordCount && item.wordCount > 0 && (
                  <Text color="#34d399" fontSize="sm" fontWeight="bold" flexShrink={0}>
                    {item.wordCount.toLocaleString()}w
                  </Text>
                )}
              </HStack>
            );
          })}
        </VStack>

        <HStack justify="flex-end" pt={2} borderTop="1px solid rgba(255,255,255,0.06)">
          <Link href="/studio">
            <HStack spacing={1} cursor="pointer">
              <Text color="gray.400" fontSize="xs">
                View All
              </Text>
              <Icon as={FiArrowRight} boxSize={3} color="gray.400" />
            </HStack>
          </Link>
        </HStack>
      </VStack>
    </MotionBox>
  );
}
