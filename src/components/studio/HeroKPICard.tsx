'use client';

/**
 * HeroKPICard
 *
 * Component Hierarchy:
 * App → StudioLayout → InsightsPage → HeroKPICard
 *
 * Gradient hero KPI card for the Insights page top row.
 * Displays a large metric value with icon, trend indicator,
 * mini sparkline, and optional sub-metric tags.
 */

import { Box, Flex, HStack, Icon, Text, Tag, TagLabel } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { STUDIO_COLORS } from '@/lib/constants/studioTokens';

const MotionBox = motion(Box);

interface Props {
  icon: IconType;
  label: string;
  value: string | number;
  trend?: { value: number; label: string };
  gradient: string;
  sparklineData?: number[];
  tags?: { label: string; active?: boolean }[];
  badge?: string;
  delay?: number;
}

/**
 * MiniSparkline — tiny SVG line chart for trend visualization.
 * Pure SVG, no external chart library dependency.
 */
function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 28;
  const padding = 2;

  const points = data
    .map((val, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((val - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Area fill */}
      <polygon
        points={`${padding},${height} ${points} ${width - padding},${height}`}
        fill={`url(#spark-${color.replace('#', '')})`}
      />
      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeroKPICard({
  icon,
  label,
  value,
  trend,
  gradient,
  sparklineData,
  tags,
  badge,
  delay = 0,
}: Props) {
  const trendColor = trend && trend.value >= 0 ? STUDIO_COLORS.green : STUDIO_COLORS.coral;
  const TrendIcon = trend && trend.value >= 0 ? FiTrendingUp : FiTrendingDown;

  return (
    <MotionBox
      bg={gradient}
      borderRadius="xl"
      borderWidth="1px"
      borderColor="rgba(255, 255, 255, 0.08)"
      p={5}
      position="relative"
      overflow="hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      _hover={{
        borderColor: 'rgba(255, 255, 255, 0.15)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
      cursor="default"
      style={{ transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s' }}
    >
      {/* Icon + Label */}
      <Flex justify="space-between" align="flex-start" mb={3}>
        <HStack spacing={2}>
          <Flex
            w="28px"
            h="28px"
            borderRadius="lg"
            bg="rgba(255, 255, 255, 0.1)"
            align="center"
            justify="center"
          >
            <Icon as={icon} boxSize={4} color={STUDIO_COLORS.amber} />
          </Flex>
          <Text fontSize="sm" fontWeight="semibold" color={STUDIO_COLORS.textSecondary}>
            {label}
          </Text>
        </HStack>
        {sparklineData && sparklineData.length > 1 && (
          <MiniSparkline data={sparklineData} color={trendColor} />
        )}
      </Flex>

      {/* Value */}
      <Text fontSize="3xl" fontWeight="bold" color="white" lineHeight="1.1" mb={1}>
        {value}
      </Text>

      {/* Trend */}
      {trend && (
        <HStack spacing={1} mb={tags ? 3 : 0}>
          <Icon as={TrendIcon} boxSize={3} color={trendColor} />
          <Text fontSize="xs" color={trendColor} fontWeight="medium">
            {trend.value > 0 ? '+' : ''}
            {trend.value}%
          </Text>
          <Text fontSize="xs" color={STUDIO_COLORS.textMuted}>
            {trend.label}
          </Text>
        </HStack>
      )}

      {/* Badge */}
      {badge && (
        <HStack mt={1}>
          <Tag
            size="sm"
            bg="rgba(34, 197, 94, 0.15)"
            color={STUDIO_COLORS.green}
            borderRadius="full"
          >
            <TagLabel fontSize="xs">{badge}</TagLabel>
          </Tag>
        </HStack>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <HStack spacing={1} flexWrap="wrap" mt={2}>
          {tags.map((tag) => (
            <Tag
              key={tag.label}
              size="sm"
              bg={tag.active ? 'rgba(255, 157, 0, 0.15)' : 'rgba(255, 255, 255, 0.06)'}
              color={tag.active ? STUDIO_COLORS.amber : STUDIO_COLORS.textMuted}
              borderRadius="full"
              cursor="pointer"
              _hover={{ bg: 'rgba(255, 157, 0, 0.2)' }}
            >
              <TagLabel fontSize="xs">{tag.label}</TagLabel>
            </Tag>
          ))}
        </HStack>
      )}
    </MotionBox>
  );
}
