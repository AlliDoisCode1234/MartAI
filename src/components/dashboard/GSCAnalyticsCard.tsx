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
  useDisclosure,
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
  FiZap,
} from 'react-icons/fi';
import Link from 'next/link';
import { CompactEmptyState } from '../feedback/EmptyState';
import { MetricTooltip } from '@/src/components/shared';
import { LetPhooBuildItModal } from '@/src/components/content/LetPhooBuildItModal';

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
  readonly isLoading?: boolean;
  readonly isConnected?: boolean;
  readonly isInitialSyncing?: boolean;
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
  tooltipKey,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: 'up' | 'down' | null;
  sublabel?: string;
  tooltipKey?: string;
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
          <HStack spacing={1}>
            <Text color="gray.500" fontSize="xs" fontWeight="medium">
              {label}
            </Text>
            {tooltipKey && <MetricTooltip metricKey={tooltipKey} size={12} />}
          </HStack>
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

export function GSCAnalyticsCard({ gscStats, isLoading, isConnected, isInitialSyncing }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
          <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={3}>
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
        bg="linear-gradient(135deg, rgba(249, 159, 42, 0.08) 0%, rgba(255, 107, 0, 0.08) 100%)"
        border="1px solid rgba(249, 159, 42, 0.2)"
      >
        <HStack
          justify="space-between"
          flexDir={{ base: 'column', sm: 'row' }}
          gap={3}
          align={{ base: 'start', sm: 'center' }}
        >
          <VStack align="start" spacing={1}>
            <Text color="white" fontWeight="semibold">
              Connect Google Search Console
            </Text>
            <Text color="gray.400" fontSize="sm">
              See your real search performance data
            </Text>
          </VStack>
          <Link href="/settings?tab=integrations">
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
    if (isInitialSyncing) {
      return (
        <MotionBox
          {...glassCard}
          p={6}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          borderColor="orange.500"
          borderWidth="1px"
        >
          <VStack spacing={4} pt={4} pb={4}>
            <Icon as={FiTrendingUp} boxSize={8} color="orange.400" className="animate-pulse" />
            <VStack spacing={1}>
              <Text color="white" fontWeight="semibold" fontSize="lg">
                Crunching your historical data...
              </Text>
              <Text color="gray.400" fontSize="sm" textAlign="center">
                We are actively analyzing your Google Search Console performance. This usually takes less than a minute.
              </Text>
            </VStack>
            <Skeleton height="8px" width="100%" maxW="300px" borderRadius="full" startColor="orange.500" endColor="orange.200" mt={2} />
          </VStack>
        </MotionBox>
      );
    }
    
    return (
      <MotionBox
        {...glassCard}
        p={6}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <CompactEmptyState 
          icon={FiTrendingUp}
          message="GSC connected. Waiting for first data sync to complete." 
        />
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
              Synced {new Date(gscStats.lastSyncDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
            </Text>
          )}
        </HStack>

        <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={3}>
          <StatCard
            label="Search Clicks"
            value={formatNumber(gscStats.totalClicks)}
            icon={FiMousePointer}
            color="#FF9D00"
            sublabel="Total clicks from Google"
            tooltipKey="search-clicks"
          />
          <StatCard
            label="Search Views"
            value={formatNumber(gscStats.totalImpressions)}
            icon={FiEye}
            color="#FF6B00"
            sublabel="Impressions in search"
            tooltipKey="search-views"
          />
          <StatCard
            label="Click Rate"
            value={`${gscStats.avgCtr}%`}
            icon={FiPercent}
            color="#34d399"
            sublabel="Avg. CTR"
            tooltipKey="click-rate"
          />
          <StatCard
            label="Avg. Rank"
            value={gscStats.avgPosition.toFixed(1)}
            icon={FiTrendingUp}
            color="#f59e0b"
            sublabel="Lower is better"
            tooltipKey="avg-rank"
          />
        </Grid>

        {/* Top Keywords Table */}
        {gscStats.topKeywords.length > 0 && (
          <Box {...glassCard} p={4}>
            <Text color="gray.400" fontSize="xs" fontWeight="semibold" mb={3} letterSpacing="wider">
              TOP KEYWORDS
            </Text>
            <Table
              size="sm"
              variant="unstyled"
              display={{ base: 'block', md: 'table' }}
              overflowX="auto"
            >
              <Tbody>
                {gscStats.topKeywords.map((kw, i) => (
                  <Tr key={kw.keyword} _hover={{ bg: 'whiteAlpha.50' }}>
                    <Td py={2} color="gray.300" fontSize="sm" maxW="200px" isTruncated>
                      {kw.keyword}
                    </Td>
                    <Td py={2} isNumeric>
                      <Text color="orange.400" fontSize="xs">
                        {kw.clicks} clicks
                      </Text>
                    </Td>
                    <Td py={2} isNumeric>
                      <Text color="red.400" fontSize="xs">
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

            <Button
              mt={4}
              w="full"
              size="sm"
              bg="linear-gradient(135deg, rgba(249,159,42,0.1) 0%, rgba(249,159,42,0.2) 100%)"
              color="orange.400"
              borderWidth="1px"
              borderColor="orange.200"
              leftIcon={<FiZap />}
              onClick={onOpen}
              _hover={{
                bg: 'orange.500',
                color: 'white',
              }}
              transition="all 0.2s"
            >
              Generate Content to Grow Traffic
            </Button>
          </Box>
        )}
      </VStack>

      <LetPhooBuildItModal isOpen={isOpen} onClose={onClose} />
    </MotionBox>
  );
}
