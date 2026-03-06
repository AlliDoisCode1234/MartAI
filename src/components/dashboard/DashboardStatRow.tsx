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
          bg={stat.isHighlighted ? 'linear-gradient(135deg, #F7941E 0%, #E8851A 100%)' : 'white'}
          border={stat.isHighlighted ? 'none' : '1px solid'}
          borderColor={stat.isHighlighted ? 'transparent' : 'gray.200'}
          boxShadow={
            stat.isHighlighted
              ? '0 4px 20px rgba(247, 148, 30, 0.35)'
              : '0 2px 8px rgba(0, 0, 0, 0.06)'
          }
          borderRadius="xl"
          p={{ base: 4, md: 5 }}
          position="relative"
          overflow="hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.08 }}
          _hover={{
            boxShadow: stat.isHighlighted
              ? '0 8px 30px rgba(247, 148, 30, 0.45)'
              : '0 4px 12px rgba(0, 0, 0, 0.08)',
          }}
        >
          <VStack align="start" spacing={3}>
            <HStack spacing={2}>
              <Box
                p={2}
                borderRadius="lg"
                bg={stat.isHighlighted ? 'rgba(255,255,255,0.25)' : stat.iconBg}
              >
                <Icon
                  as={stat.icon}
                  boxSize={4}
                  color={stat.isHighlighted ? 'white' : stat.iconColor}
                />
              </Box>
              <Text
                color={stat.isHighlighted ? 'white' : 'gray.500'}
                fontSize="xs"
                fontWeight="semibold"
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
                color={stat.isHighlighted ? 'white' : 'gray.800'}
                fontSize={{ base: '2xl', md: '3xl' }}
                fontWeight="bold"
                lineHeight="1"
              >
                {stat.value}
              </Text>
              {stat.change && (
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color={stat.isHighlighted ? 'rgba(255,255,255,0.85)' : stat.changeColor}
                >
                  {stat.change}
                </Text>
              )}
            </HStack>

            <Text color={stat.isHighlighted ? 'rgba(255,255,255,0.8)' : 'gray.500'} fontSize="xs">
              {stat.subtitle}
            </Text>
          </VStack>
        </MotionBox>
      ))}
    </Grid>
  );
}
