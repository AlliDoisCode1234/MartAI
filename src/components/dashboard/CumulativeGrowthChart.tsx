'use client';

/**
 * CumulativeGrowthChart
 *
 * Component Hierarchy:
 * App -> Dashboard -> CumulativeGrowthChart (this file)
 *
 * Full-width area chart showing real traffic growth over time.
 * Uses actual analyticsData snapshots. Follows data visualization
 * industry standards: zero baseline, always-visible timeline,
 * no dots for zero-value points, data anchored to left edge.
 */

import { Box, HStack, VStack, Text, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { FiTrendingUp, FiUsers, FiTarget } from 'react-icons/fi';

const MotionBox = motion(Box);

type GrowthDataPoint = {
  label: string;
  sessions: number;
  clicks: number;
};

type Props = {
  totalClicks: number;
  keywordsInTop10: number;
  hasData: boolean;
  growthData: GrowthDataPoint[];
};

/**
 * Build a complete 30-day timeline, merging real data on matching dates.
 * Ensures the chart always starts from the left edge with consistent ticks.
 */
function buildTimelineData(growthData: GrowthDataPoint[]): GrowthDataPoint[] {
  if (growthData.length === 0) return [];

  // Build a map of real data by label for O(1) lookup
  const dataMap = new Map<string, GrowthDataPoint>();
  for (const dp of growthData) {
    dataMap.set(dp.label, dp);
  }

  // Generate past 30 days as timeline
  const timeline: GrowthDataPoint[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const existing = dataMap.get(label);
    timeline.push(existing ?? { label, sessions: 0, clicks: 0 });
  }

  return timeline;
}

/**
 * Custom dot renderer: only show dots when value > 0.
 * Prevents misleading dots on zero-value data points.
 */
function renderDot(props: { cx?: number; cy?: number; value?: number }) {
  const { cx, cy, value } = props;
  if (!value || value <= 0) return null;
  return <circle cx={cx} cy={cy} r={3} fill="currentColor" stroke="none" opacity={0.8} />;
}

/**
 * Custom tooltip with clean dark styling.
 */
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  // Don't show tooltip for all-zero points
  const hasNonZero = payload.some((p) => p.value > 0);
  if (!hasNonZero) return null;

  return (
    <Box
      bg="rgba(15, 23, 42, 0.95)"
      border="1px solid rgba(255,255,255,0.1)"
      borderRadius="12px"
      px={3}
      py={2}
    >
      <Text color="gray.300" fontSize="xs" fontWeight="semibold" mb={1}>
        {label}
      </Text>
      {payload.map((entry) => (
        <Text key={entry.name} color={entry.color} fontSize="xs">
          {entry.name}: {entry.value.toLocaleString()}
        </Text>
      ))}
    </Box>
  );
}

export function CumulativeGrowthChart({
  totalClicks,
  keywordsInTop10,
  hasData,
  growthData,
}: Props) {
  const chartData = buildTimelineData(growthData);
  const hasChartData = chartData.some((d) => d.sessions > 0 || d.clicks > 0);

  return (
    <MotionBox
      bg="rgba(255, 255, 255, 0.03)"
      backdropFilter="blur(20px)"
      border="1px solid rgba(255, 255, 255, 0.08)"
      borderRadius="2xl"
      p={{ base: 4, md: 6 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <VStack align="stretch" spacing={5}>
        {/* Header */}
        <HStack spacing={2}>
          <Icon as={FiTrendingUp} color="#F99F2A" boxSize={4} />
          <Text color="white" fontWeight="semibold" fontSize="sm">
            Cumulative Growth{' '}
            <Text as="span" color="gray.400" fontWeight="normal">
              Since Joining Phoo
            </Text>
          </Text>
        </HStack>

        {/* Metric summaries */}
        <HStack
          spacing={{ base: 4, md: 8 }}
          flexWrap="wrap"
          justify={{ base: 'center', md: 'flex-start' }}
        >
          <HStack spacing={2}>
            <Icon as={FiUsers} color="#34d399" boxSize={4} />
            <VStack align="start" spacing={0}>
              <Text color="#34d399" fontSize="xl" fontWeight="bold">
                {hasData ? totalClicks.toLocaleString() : '--'}
              </Text>
              <Text color="gray.500" fontSize="xs" whiteSpace="nowrap">
                Total Clicks
              </Text>
            </VStack>
          </HStack>
          <HStack spacing={2}>
            <Icon as={FiTarget} color="#60a5fa" boxSize={4} />
            <VStack align="start" spacing={0}>
              <Text color="#60a5fa" fontSize="xl" fontWeight="bold">
                {hasData ? keywordsInTop10 : '--'}
              </Text>
              <Text color="gray.500" fontSize="xs" whiteSpace="nowrap">
                Keywords in Top 10
              </Text>
            </VStack>
          </HStack>
        </HStack>

        {/* Chart — always shows timeline, fills data as it comes */}
        <Box h={{ base: '200px', md: '250px' }}>
          {hasChartData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F99F2A" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#F99F2A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                {/* X-axis: always visible, consistent ticks left-to-right */}
                <XAxis
                  dataKey="label"
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                  interval="preserveStartEnd"
                  minTickGap={40}
                />
                {/* Y-axis: visible with zero baseline */}
                <YAxis
                  stroke="rgba(255,255,255,0.2)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={35}
                  domain={[0, 'auto']}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stroke="#34d399"
                  fill="url(#gradSessions)"
                  strokeWidth={2.5}
                  name="Sessions"
                  dot={renderDot}
                  activeDot={{ r: 5, stroke: '#34d399', strokeWidth: 2, fill: '#0f172a' }}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#F99F2A"
                  fill="url(#gradClicks)"
                  strokeWidth={2.5}
                  name="Clicks"
                  dot={renderDot}
                  activeDot={{ r: 5, stroke: '#F99F2A', strokeWidth: 2, fill: '#0f172a' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <VStack h="100%" justify="center" spacing={2}>
              <Icon as={FiTrendingUp} color="gray.600" boxSize={10} />
              <Text color="gray.500" fontSize="sm">
                Growth chart will populate as data syncs
              </Text>
              <Text color="gray.600" fontSize="xs">
                Click &quot;Sync Data&quot; to start tracking
              </Text>
            </VStack>
          )}
        </Box>
      </VStack>
    </MotionBox>
  );
}
