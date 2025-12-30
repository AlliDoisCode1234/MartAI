'use client';

/**
 * MetricCard Component
 *
 * Component Hierarchy:
 * App → shared/MetricCard (this file)
 *
 * Unified stat card component with light/dark theme support.
 * Consolidates: dashboard/StatCard, strategy/StrategyStatCards, shared/StatItem
 *
 * @example
 * <MetricCard
 *   icon={FiTrendingUp}
 *   label="Traffic Growth"
 *   value="+247%"
 *   color="green"
 *   theme="dark"
 * />
 */

import { Card, CardBody, HStack, Box, Text, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import type { IconType } from 'react-icons';

const MotionCard = motion(Card);

type Props = {
  icon: IconType;
  label: string;
  value: string | number;
  color?: 'purple' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'gray';
  theme?: 'light' | 'dark';
  trend?: 'up' | 'down';
  trendValue?: string;
  size?: 'sm' | 'md' | 'lg';
  delay?: number;
};

export function MetricCard({
  icon,
  label,
  value,
  color = 'blue',
  theme = 'light',
  trend,
  trendValue,
  size = 'md',
  delay = 0,
}: Props) {
  const isDark = theme === 'dark';

  // Theme-aware styles
  const cardBg = isDark ? 'rgba(30, 30, 30, 0.6)' : 'white';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'gray.100';
  const iconBg = isDark ? `${color}.900` : `${color}.100`;
  const iconColor = isDark ? `${color}.400` : `${color}.600`;
  const valueColor = isDark ? 'white' : 'gray.800';
  const labelColor = isDark ? 'gray.400' : 'gray.600';

  // Size variants
  const sizeConfig = {
    sm: { iconBox: 2, iconSize: 4, valueSize: 'lg', labelSize: 'xs', padding: 3 },
    md: { iconBox: 3, iconSize: 5, valueSize: '2xl', labelSize: 'sm', padding: 4 },
    lg: { iconBox: 4, iconSize: 6, valueSize: '3xl', labelSize: 'md', padding: 5 },
  };

  const config = sizeConfig[size];

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      bg={cardBg}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow={isDark ? 'lg' : 'md'}
      backdropFilter={isDark ? 'blur(10px)' : undefined}
    >
      <CardBody p={config.padding}>
        <HStack spacing={3}>
          <Box p={config.iconBox} borderRadius="lg" bg={iconBg}>
            <Icon as={icon} color={iconColor} boxSize={config.iconSize} />
          </Box>
          <Box>
            <Text fontSize={config.valueSize} fontWeight="bold" color={valueColor}>
              {value}
              {trend && trendValue && (
                <Text
                  as="span"
                  fontSize="sm"
                  color={trend === 'up' ? 'green.400' : 'red.400'}
                  ml={2}
                >
                  {trend === 'up' ? '↑' : '↓'} {trendValue}
                </Text>
              )}
            </Text>
            <Text fontSize={config.labelSize} color={labelColor}>
              {label}
            </Text>
          </Box>
        </HStack>
      </CardBody>
    </MotionCard>
  );
}
