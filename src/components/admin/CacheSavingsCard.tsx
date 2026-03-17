'use client';

/**
 * Component Hierarchy:
 * app/admin/ai-providers/page.tsx
 * └── AICostDashboard
 *     └── CacheSavingsCard (this file)
 */

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Box,
  Flex,
  Text,
  Heading,
  Skeleton,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Progress,
} from '@chakra-ui/react';
import { FiZap, FiDatabase, FiTrendingDown } from 'react-icons/fi';

interface Props {
  /** Display compact variant inside the existing dashboard */
  compact?: boolean;
}

export function CacheSavingsCard({ compact = false }: Props) {
  const cacheSummary = useQuery(api.ai.admin.usageTracking.getCacheSavingsSummary, {});

  if (!cacheSummary) {
    return (
      <Box bg="whiteAlpha.50" p={compact ? 4 : 6} borderRadius="lg">
        <Skeleton height="80px" />
      </Box>
    );
  }

  const hasData = cacheSummary.totalCachedTokens > 0;
  const savingsColor = cacheSummary.cacheHitRate > 50 ? 'green' : cacheSummary.cacheHitRate > 20 ? 'yellow' : 'gray';

  return (
    <Box
      bg="linear-gradient(135deg, rgba(16, 40, 28, 0.95) 0%, rgba(10, 30, 20, 0.95) 100%)"
      border="1px solid"
      borderColor="green.800"
      p={compact ? 4 : 6}
      borderRadius="xl"
    >
      <Flex justify="space-between" align="center" mb={3}>
        <Heading size="sm" color="green.300">
          <Flex align="center" gap={2}>
            <FiZap /> Prompt Cache Savings
          </Flex>
        </Heading>
        {hasData && (
          <Badge colorScheme={savingsColor} fontSize="xs" px={2} py={1}>
            {cacheSummary.cacheHitRate}% hit rate
          </Badge>
        )}
      </Flex>

      {!hasData ? (
        <Text color="gray.500" fontSize="sm">
          No cache data yet. Cache metrics will appear after AI calls with caching enabled.
        </Text>
      ) : (
        <>
          {/* Cache Hit Rate Bar */}
          <Box mb={4}>
            <Flex justify="space-between" mb={1}>
              <Text color="gray.400" fontSize="xs">
                Cache Hit Rate
              </Text>
              <Text color="green.300" fontSize="xs" fontWeight="bold">
                {cacheSummary.cacheHitRate}%
              </Text>
            </Flex>
            <Progress
              value={cacheSummary.cacheHitRate}
              colorScheme="green"
              bg="whiteAlpha.100"
              borderRadius="full"
              size="sm"
            />
          </Box>

          {/* Stats */}
          <SimpleGrid columns={compact ? 2 : 3} spacing={3}>
            <Stat>
              <StatLabel color="gray.400" fontSize="xs">
                <Flex align="center" gap={1}>
                  <FiTrendingDown /> Saved
                </Flex>
              </StatLabel>
              <StatNumber color="green.300" fontSize={compact ? 'lg' : 'xl'}>
                ${cacheSummary.estimatedSavingsUsd.toFixed(2)}
              </StatNumber>
              <StatHelpText color="gray.500" fontSize="xs">
                This month
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel color="gray.400" fontSize="xs">
                <Flex align="center" gap={1}>
                  <FiDatabase /> Cached
                </Flex>
              </StatLabel>
              <StatNumber color="white" fontSize={compact ? 'lg' : 'xl'}>
                {(cacheSummary.totalCachedTokens / 1000).toFixed(1)}K
              </StatNumber>
              <StatHelpText color="gray.500" fontSize="xs">
                Tokens from cache
              </StatHelpText>
            </Stat>

            {!compact && (
              <Stat>
                <StatLabel color="gray.400" fontSize="xs">
                  <Flex align="center" gap={1}>
                    <FiZap /> Written
                  </Flex>
                </StatLabel>
                <StatNumber color="white" fontSize="xl">
                  {(cacheSummary.totalCacheCreationTokens / 1000).toFixed(1)}K
                </StatNumber>
                <StatHelpText color="gray.500" fontSize="xs">
                  Tokens cached
                </StatHelpText>
              </Stat>
            )}
          </SimpleGrid>
        </>
      )}
    </Box>
  );
}
