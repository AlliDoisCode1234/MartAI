'use client';

/**
 * KeywordsClimbedCard
 *
 * Component Hierarchy:
 * App → Dashboard → KeywordsClimbedCard (this file)
 *
 * Shows tracked keywords with rank/clicks, fills empty slots with
 * suggested keywords as CTAs to drive content creation.
 */

import { Box, VStack, HStack, Text, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiArrowRight, FiZap, FiSearch } from 'react-icons/fi';
import Link from 'next/link';
import { CompactEmptyState } from '../feedback/EmptyState';

const MotionBox = motion(Box);
const MAX_SLOTS = 5;

type KeywordItem = {
  keyword: string;
  rank: number;
  clicks: number;
};

type SuggestedKeyword = {
  keyword: string;
  searchVolume?: number;
  difficulty?: string;
};

type Props = {
  keywords: KeywordItem[];
  suggestedKeywords: SuggestedKeyword[];
  totalCount: number;
  hasData: boolean;
};

export function KeywordsClimbedCard({ keywords, suggestedKeywords, totalCount, hasData }: Props) {
  const emptySlots = MAX_SLOTS - keywords.length;
  const suggestions = suggestedKeywords.slice(0, Math.max(0, emptySlots));

  return (
    <MotionBox
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderLeft="3px solid #F99F2A"
      boxShadow="0 2px 12px rgba(0, 0, 0, 0.08)"
      borderRadius="xl"
      p={{ base: 4, md: 5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      h="100%"
    >
      <VStack align="stretch" spacing={4} h="100%">
        <HStack spacing={2}>
          <Icon as={FiTrendingUp} color="#F99F2A" boxSize={4} />
          <Text color="gray.800" fontWeight="semibold" fontSize="sm">
            Top Keywords{' '}
            <Text as="span" color="gray.400" fontWeight="normal">
              by Position
            </Text>
          </Text>
        </HStack>

        <VStack align="stretch" spacing={3} flex={1}>
          {/* No data at all */}
          {!hasData && suggestions.length === 0 && (
            <Box py={4}>
              <CompactEmptyState 
                icon={FiSearch} 
                message="No keyword data yet. Click 'Sync Data' after connecting Google." 
              />
            </Box>
          )}

          {/* Tracked keywords — solid styling */}
          {keywords.map((kw) => (
            <HStack key={kw.keyword} justify="space-between">
              <Text color="gray.600" fontSize="sm" noOfLines={1} maxW="55%">
                {kw.keyword}
              </Text>
              <HStack spacing={3}>
                <Text color="#34d399" fontSize="sm" fontWeight="semibold">
                  {kw.clicks} clicks
                </Text>
                <Text color="gray.500" fontSize="xs">
                  Rank {kw.rank}
                </Text>
              </HStack>
            </HStack>
          ))}

          {/* Suggested keyword CTAs — dashed border, amber accent */}
          {suggestions.map((sk, i) => (
            <Link
              key={`${sk.keyword}-${i}`}
              href={`/studio?keyword=${encodeURIComponent(sk.keyword)}`}
            >
              <HStack
                justify="space-between"
                py={1.5}
                px={2}
                mx={-2}
                borderRadius="lg"
                borderLeft="2px dashed"
                borderLeftColor="rgba(249, 159, 42, 0.5)"
                bg="rgba(249, 159, 42, 0.04)"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  bg: 'rgba(249, 159, 42, 0.1)',
                  borderLeftColor: '#F99F2A',
                }}
              >
                <HStack spacing={2} minW={0}>
                  <Icon as={FiZap} color="#F99F2A" boxSize={3} flexShrink={0} />
                  <Text color="gray.400" fontSize="sm" noOfLines={1}>
                    {sk.keyword}
                  </Text>
                </HStack>
                <HStack spacing={1} flexShrink={0}>
                  <Text color="#F99F2A" fontSize="xs" fontWeight="medium" whiteSpace="nowrap">
                    Write about this
                  </Text>
                  <Icon as={FiArrowRight} boxSize={3} color="#F99F2A" />
                </HStack>
              </HStack>
            </Link>
          ))}
        </VStack>

        <HStack justify="space-between" pt={2} borderTop="1px solid" borderTopColor="gray.100">
          <Text color="gray.400" fontSize="xs">
            {totalCount} Total Keywords Tracked
          </Text>
          <Link href="/studio/keywords">
            <HStack spacing={1} cursor="pointer" _hover={{ color: '#F99F2A' }}>
              <Text color="gray.400" fontSize="xs" _hover={{ color: '#F99F2A' }}>
                See All
              </Text>
              <Icon as={FiArrowRight} boxSize={3} color="gray.400" />
            </HStack>
          </Link>
        </HStack>
      </VStack>
    </MotionBox>
  );
}
