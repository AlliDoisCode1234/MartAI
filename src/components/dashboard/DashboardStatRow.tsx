'use client';

/**
 * DashboardStatRow
 *
 * Component Hierarchy:
 * App → Dashboard → DashboardStatRow (this file)
 *
 * 4 glassmorphic stat cards showing combined GA4 + GSC metrics.
 */

import { Grid, Box, HStack, VStack, Text, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiUsers, FiEye, FiClock, FiTarget } from 'react-icons/fi';

const MotionBox = motion(Box);

type StatItem = {
  label: string;
  value: string | number;
  change: string;
  changeColor: string;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
};

type Props = {
  sessions: number;
  pageViews: number;
  avgSessionDuration: number;
  bounceRate: number;
  avgPosition: number;
  impressions: number;
  visibilityScore: number;
  visibilityChange: number;
  sessionsChange: number;
  pageViewsChange: number;
  hasData: boolean;
};

function formatDuration(seconds: number): string {
  if (seconds <= 0) return '--';
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatChange(change: number): string {
  if (change === 0) return '';
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(0)}%`;
}

export function DashboardStatRow({
  sessions,
  pageViews,
  avgSessionDuration,
  bounceRate,
  avgPosition,
  impressions,
  visibilityScore,
  visibilityChange,
  sessionsChange,
  pageViewsChange,
  hasData,
}: Props) {
  const stats: StatItem[] = [
    {
      label: 'Site Traffic',
      value: hasData ? sessions.toLocaleString() : '--',
      change: hasData ? `${pageViews.toLocaleString()} views` : '',
      changeColor: '#34d399',
      subtitle: hasData ? `Sessions (Last 30d)` : 'Connect Google to see data',
      icon: FiUsers,
      iconColor: '#F99F2A',
      iconBg: 'rgba(249, 159, 42, 0.15)',
    },
    {
      label: 'Page Views',
      value: hasData ? pageViews.toLocaleString() : '--',
      change: hasData ? formatChange(pageViewsChange) : '',
      changeColor: pageViewsChange >= 0 ? '#34d399' : '#f87171',
      subtitle: hasData ? 'Total Page Views' : 'Sync data to populate',
      icon: FiEye,
      iconColor: '#818cf8',
      iconBg: 'rgba(129, 140, 248, 0.15)',
    },
    {
      label: 'Avg Session',
      value: hasData ? formatDuration(avgSessionDuration) : '--',
      change: hasData && bounceRate > 0 ? `${(bounceRate * 100).toFixed(0)}% bounce` : '',
      changeColor: bounceRate < 0.5 ? '#34d399' : '#f87171',
      subtitle: hasData ? 'Session Duration' : 'Connect Google to see data',
      icon: FiClock,
      iconColor: '#34d399',
      iconBg: 'rgba(52, 211, 153, 0.15)',
    },
    {
      label: 'Search Visibility',
      value:
        hasData && avgPosition > 0
          ? avgPosition.toFixed(1)
          : visibilityScore > 0
            ? visibilityScore
            : '--',
      change:
        hasData && impressions > 0
          ? `${impressions} impressions`
          : visibilityChange > 0
            ? `+${visibilityChange}`
            : '',
      changeColor: '#F99F2A',
      subtitle: hasData && avgPosition > 0 ? 'Avg Search Position' : 'Phoo Rating',
      icon: FiTarget,
      iconColor: '#a78bfa',
      iconBg: 'rgba(167, 139, 250, 0.15)',
    },
  ];

  return (
    <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
      {stats.map((stat, i) => (
        <MotionBox
          key={stat.label}
          bg="rgba(255, 255, 255, 0.03)"
          backdropFilter="blur(20px)"
          border="1px solid rgba(255, 255, 255, 0.08)"
          borderRadius="2xl"
          p={{ base: 4, md: 5 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.08 }}
        >
          <VStack align="start" spacing={3}>
            <HStack spacing={2}>
              <Box p={2} borderRadius="lg" bg={stat.iconBg}>
                <Icon as={stat.icon} boxSize={4} color={stat.iconColor} />
              </Box>
              <Text color="gray.300" fontSize="xs" fontWeight="semibold" letterSpacing="wider">
                {stat.label}
              </Text>
            </HStack>

            <HStack align="baseline" spacing={2}>
              <Text
                color="white"
                fontSize={{ base: '2xl', md: '3xl' }}
                fontWeight="bold"
                lineHeight="1"
              >
                {stat.value}
              </Text>
              {stat.change && (
                <Text fontSize="sm" fontWeight="semibold" color={stat.changeColor}>
                  {stat.change}
                </Text>
              )}
            </HStack>

            <Text color="gray.500" fontSize="xs">
              {stat.subtitle}
            </Text>
          </VStack>
        </MotionBox>
      ))}
    </Grid>
  );
}
