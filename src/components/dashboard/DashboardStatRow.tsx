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
import { FiUsers, FiEye, FiClock, FiTarget, FiZap } from 'react-icons/fi';

const MotionBox = motion(Box);

type DataSource = 'GA4' | 'GSC' | 'GTM' | 'Content';

const SOURCE_COLORS: Record<DataSource, { bg: string; text: string }> = {
  GA4: { bg: 'rgba(249, 159, 42, 0.2)', text: '#F99F2A' },
  GSC: { bg: 'rgba(96, 165, 250, 0.2)', text: '#60a5fa' },
  GTM: { bg: 'rgba(34, 197, 94, 0.2)', text: '#22C55E' },
  Content: { bg: 'rgba(148, 163, 184, 0.2)', text: '#94a3b8' },
};

type StatItem = {
  label: string;
  value: string | number;
  change: string;
  changeColor: string;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  isHighlighted?: boolean;
  source: DataSource;
};

type Props = {
  sessions: number;
  users: number;
  pageViews: number;
  avgSessionDuration: number;
  avgPosition: number;
  impressions: number;
  visibilityScore: number;
  visibilityChange: number;
  sessionsChange: number;
  pageViewsChange: number;
  totalLeads: number;
  leadConversionRate: number;
  hasGA4Data: boolean;
  hasGSCData: boolean;
  hasGA4?: boolean;
};

function formatDuration(seconds: number): string {
  if (seconds <= 0) return '--';
  const total = Math.round(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatDurationHuman(seconds: number): string {
  if (seconds <= 0) return '';
  const total = Math.round(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

function formatChange(change: number): string {
  if (change === 0) return '';
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(0)}%`;
}

export function DashboardStatRow({
  sessions,
  users,
  pageViews,
  avgSessionDuration,
  avgPosition,
  impressions,
  visibilityScore,
  visibilityChange,
  sessionsChange,
  pageViewsChange,
  totalLeads,
  leadConversionRate,
  hasGA4Data,
  hasGSCData,
  hasGA4,
}: Props) {
  const stats: StatItem[] = [
    {
      label: 'Leads Generated',
      value: hasGA4Data ? totalLeads.toLocaleString() : '--',
      change: hasGA4Data && leadConversionRate > 0 ? `${leadConversionRate}% conv.` : '',
      changeColor: '#22C55E',
      subtitle: hasGA4Data
        ? 'Organic content-attributed leads'
        : hasGA4
          ? 'Waiting for lead data...'
          : 'Connect GTM to track leads',
      icon: FiZap,
      iconColor: '#22C55E',
      iconBg: 'rgba(34, 197, 94, 0.15)',
      source: 'GTM',
    },
    {
      label: 'Site Traffic',
      value: hasGA4Data ? users.toLocaleString() : '--',
      change: hasGA4Data ? `${pageViews.toLocaleString()} views` : '',
      changeColor: '#34d399',
      subtitle: hasGA4Data
        ? 'Organic Users (Last 30d)'
        : hasGA4
          ? 'Waiting for traffic data...'
          : 'Connect Google to see data',
      icon: FiUsers,
      iconColor: '#F99F2A',
      iconBg: 'rgba(249, 159, 42, 0.15)',
      source: 'GA4',
    },
    {
      label: 'Sessions',
      value: hasGA4Data ? sessions.toLocaleString() : '--',
      change: hasGA4Data ? formatChange(sessionsChange) : '',
      changeColor: sessionsChange >= 0 ? '#34d399' : '#f87171',
      subtitle: hasGA4Data
        ? 'Organic Sessions'
        : hasGA4
          ? 'Waiting for traffic data...'
          : 'Sync data to populate',
      icon: FiEye,
      iconColor: '#818cf8',
      iconBg: 'rgba(129, 140, 248, 0.15)',
      source: 'GA4',
    },
    {
      label: 'Avg Session',
      value: hasGA4Data ? formatDuration(avgSessionDuration) : '--',
      change: hasGA4Data && avgSessionDuration > 0 ? formatDurationHuman(avgSessionDuration) : '',
      changeColor: avgSessionDuration >= 60 ? '#34d399' : '#f87171',
      subtitle: hasGA4Data
        ? 'Avg Session Duration'
        : hasGA4
          ? 'Waiting for traffic data...'
          : 'Connect Google to see data',
      icon: FiClock,
      iconColor: '#34d399',
      iconBg: 'rgba(52, 211, 153, 0.15)',
      source: 'GA4',
    },
    {
      label: 'Phoo Rating',
      value:
        hasGSCData && avgPosition > 0
          ? avgPosition.toFixed(1)
          : visibilityScore > 0
            ? visibilityScore
            : '--',
      change:
        hasGSCData && impressions > 0
          ? `${impressions.toLocaleString()} impressions`
          : visibilityChange > 0
            ? `+${visibilityChange}`
            : '',
      changeColor: '#F99F2A',
      subtitle: hasGSCData && avgPosition > 0 ? 'Avg Organic Position' : 'Your visibility score',
      icon: FiTarget,
      iconColor: '#F99F2A',
      iconBg: 'rgba(249, 159, 42, 0.15)',
      isHighlighted: true,
      source: 'GSC',
    },
  ];

  return (
    <Grid
      templateColumns={{
        base: '1fr',
        sm: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)',
        xl: 'repeat(5, 1fr)',
      }}
      gap={4}
    >
      {stats.map((stat, i) => (
        <MotionBox
          key={stat.label}
          bg={
            stat.isHighlighted
              ? 'linear-gradient(135deg, rgba(249, 159, 42, 0.14) 0%, rgba(249, 159, 42, 0.04) 100%)'
              : 'rgba(255, 255, 255, 0.03)'
          }
          backdropFilter="blur(20px)"
          border={
            stat.isHighlighted
              ? '1.5px solid rgba(249, 159, 42, 0.55)'
              : '1px solid rgba(255, 255, 255, 0.08)'
          }
          boxShadow={
            stat.isHighlighted
              ? '0 0 30px rgba(249, 159, 42, 0.2), 0 0 60px rgba(249, 159, 42, 0.08), inset 0 1px 0 rgba(249, 159, 42, 0.2)'
              : 'none'
          }
          borderRadius="2xl"
          p={{ base: 4, md: 5 }}
          position="relative"
          overflow="hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.08 }}
          _before={
            stat.isHighlighted
              ? {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  bg: 'linear-gradient(90deg, transparent, #F99F2A, transparent)',
                }
              : undefined
          }
        >
          <VStack align="start" spacing={3}>
            <HStack spacing={2}>
              <Box p={2} borderRadius="lg" bg={stat.iconBg}>
                <Icon as={stat.icon} boxSize={4} color={stat.iconColor} />
              </Box>
              <Text
                color={stat.isHighlighted ? '#F99F2A' : 'gray.300'}
                fontSize="xs"
                fontWeight={stat.isHighlighted ? 'bold' : 'semibold'}
                letterSpacing="wider"
                textTransform={stat.isHighlighted ? 'uppercase' : undefined}
              >
                {stat.label}
              </Text>
              <Text
                fontSize="9px"
                fontWeight="bold"
                letterSpacing="wider"
                px={1.5}
                py={0.5}
                borderRadius="full"
                bg={SOURCE_COLORS[stat.source].bg}
                color={SOURCE_COLORS[stat.source].text}
              >
                {stat.source}
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
