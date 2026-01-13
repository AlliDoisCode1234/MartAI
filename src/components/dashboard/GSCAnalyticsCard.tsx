/**
 * GSCAnalyticsCard
 *
 * Component Hierarchy:
 * App → Dashboard → GSCAnalyticsCard
 *
 * Displays real GSC metrics: clicks, impressions, CTR, position, top keywords
 */

'use client';

import {
  Box,
  VStack,
  HStack,
  Text,
  Grid,
  Icon,
  Circle,
  Table,
  Tbody,
  Tr,
  Td,
  Skeleton,
  Button,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiMousePointer,
  FiEye,
  FiPercent,
  FiTrendingUp,
  FiLink,
  FiArrowUp,
  FiArrowDown,
} from 'react-icons/fi';
import Link from 'next/link';

const MotionBox = motion(Box);

interface Props {
  gscStats: {
    totalClicks: number;
    totalImpressions: number;
    avgCtr: number;
    avgPosition: number;
    topKeywords: Array<{
      keyword: string;
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
    }>;
    keywordCount: number;
    lastSyncDate: number | null;
  } | null;
  isLoading?: boolean;
  isConnected?: boolean;
}

const glassCard = {
  bg: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '2xl',
};

// Stat card component for individual metrics
function StatCard({
  label,
  value,
  icon,
  color,
  trend,
  sublabel,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: 'up' | 'down' | null;
  sublabel?: string;
}) {
  // For position, down is good. For others, up is good.
  const isPositionMetric = label === 'Avg. Rank';
  const trendColor = isPositionMetric
    ? trend === 'down'
      ? 'green.400'
      : 'red.400'
    : trend === 'up'
      ? 'green.400'
      : 'red.400';

  return (
    <Box {...glassCard} p={4}>
      <HStack justify="space-between">
        <VStack align="start" spacing={0}>
          <Text color="gray.500" fontSize="xs" fontWeight="medium">
            {label}
          </Text>
          <HStack spacing={2}>
            <Text color="white" fontSize="xl" fontWeight="bold">
              {value}
            </Text>
            {trend && (
              <Icon as={trend === 'up' ? FiArrowUp : FiArrowDown} color={trendColor} boxSize={4} />
            )}
          </HStack>
          {sublabel && (
            <Text color="gray.600" fontSize="xs">
              {sublabel}
            </Text>
          )}
        </VStack>
        <Circle size="36px" bg={`${color}15`}>
          <Icon as={icon} boxSize={4} color={color} />
        </Circle>
      </HStack>
    </Box>
  );
}

export function GSCAnalyticsCard({ gscStats, isLoading, isConnected }: Props) {
  // Loading state
  if (isLoading) {
    return (
      <MotionBox
        {...glassCard}
        p={6}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <VStack spacing={4} align="stretch">
          <Skeleton height="20px" width="150px" />
          <Grid templateColumns="repeat(4, 1fr)" gap={3}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height="80px" borderRadius="xl" />
            ))}
          </Grid>
          <Skeleton height="150px" borderRadius="xl" />
        </VStack>
      </MotionBox>
    );
  }

  // Not connected state
  if (!isConnected) {
    return (
      <MotionBox
        {...glassCard}
        p={6}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        bg="linear-gradient(135deg, rgba(249, 159, 42, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)"
        border="1px solid rgba(249, 159, 42, 0.2)"
      >
        <HStack justify="space-between">
          <VStack align="start" spacing={1}>
            <Text color="white" fontWeight="semibold">
              Connect Google Search Console
            </Text>
            <Text color="gray.400" fontSize="sm">
              See your real search performance data
            </Text>
          </VStack>
          <Link href="/settings/integrations">
            <Button
              size="sm"
              bg="orange.500"
              color="white"
              _hover={{ bg: 'orange.400' }}
              leftIcon={<FiLink />}
            >
              Connect
            </Button>
          </Link>
        </HStack>
      </MotionBox>
    );
  }

  // No data yet state
  if (!gscStats) {
    return (
      <MotionBox
        {...glassCard}
        p={6}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <VStack spacing={2}>
          <Text color="gray.400" fontSize="sm">
            GSC connected - waiting for data sync
          </Text>
          <Text color="gray.600" fontSize="xs">
            Data syncs automatically every 24 hours
          </Text>
        </VStack>
      </MotionBox>
    );
  }

  // Format numbers for display
  const formatNumber = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString());

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <VStack spacing={4} align="stretch">
        {/* Section Header */}
        <HStack justify="space-between">
          <Text color="gray.400" fontSize="sm" fontWeight="semibold" letterSpacing="wider">
            SEARCH PERFORMANCE
          </Text>
          {gscStats.lastSyncDate && (
            <Text color="gray.600" fontSize="xs">
              Updated {new Date(gscStats.lastSyncDate).toLocaleDateString()}
            </Text>
          )}
        </HStack>

        {/* Metrics Grid */}
        <Grid templateColumns="repeat(4, 1fr)" gap={3}>
          <StatCard
            label="Search Clicks"
            value={formatNumber(gscStats.totalClicks)}
            icon={FiMousePointer}
            color="#60a5fa"
            sublabel="Total clicks from Google"
          />
          <StatCard
            label="Search Views"
            value={formatNumber(gscStats.totalImpressions)}
            icon={FiEye}
            color="#a78bfa"
            sublabel="Impressions in search"
          />
          <StatCard
            label="Click Rate"
            value={`${gscStats.avgCtr}%`}
            icon={FiPercent}
            color="#34d399"
            sublabel="Avg. CTR"
          />
          <StatCard
            label="Avg. Rank"
            value={gscStats.avgPosition.toFixed(1)}
            icon={FiTrendingUp}
            color="#f59e0b"
            sublabel="Lower is better"
          />
        </Grid>

        {/* Top Keywords Table */}
        {gscStats.topKeywords.length > 0 && (
          <Box {...glassCard} p={4}>
            <Text color="gray.400" fontSize="xs" fontWeight="semibold" mb={3} letterSpacing="wider">
              TOP KEYWORDS
            </Text>
            <Table size="sm" variant="unstyled">
              <Tbody>
                {gscStats.topKeywords.map((kw, i) => (
                  <Tr key={kw.keyword} _hover={{ bg: 'whiteAlpha.50' }}>
                    <Td py={2} color="gray.300" fontSize="sm" maxW="200px" isTruncated>
                      {kw.keyword}
                    </Td>
                    <Td py={2} isNumeric>
                      <Text color="blue.400" fontSize="xs">
                        {kw.clicks} clicks
                      </Text>
                    </Td>
                    <Td py={2} isNumeric>
                      <Text color="purple.400" fontSize="xs">
                        {formatNumber(kw.impressions)} views
                      </Text>
                    </Td>
                    <Td py={2} isNumeric>
                      <Text
                        color={kw.position <= 10 ? 'green.400' : 'yellow.400'}
                        fontSize="xs"
                        fontWeight="medium"
                      >
                        #{Math.round(kw.position)}
                      </Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Link href="/studio/strategy">
              <Text
                color="orange.400"
                fontSize="xs"
                mt={3}
                cursor="pointer"
                _hover={{ textDecoration: 'underline' }}
              >
                View all {gscStats.keywordCount} keywords →
              </Text>
            </Link>
          </Box>
        )}
      </VStack>
    </MotionBox>
  );
}
