'use client';

/**
 * StrategyStatCards Component
 *
 * Component Hierarchy:
 * App → Strategy → StrategyStatCards (this file)
 *
 * Displays 4 hero stat cards for strategy metrics using shared MetricCard.
 */

import { SimpleGrid } from '@chakra-ui/react';
import { FiLayers, FiFileText, FiTrendingUp, FiZap } from 'react-icons/fi';
import { MetricCard } from '@/src/components/shared';

type Props = {
  clusterCount: number;
  briefCount: number;
  contentVelocity: number;
  keywordCount: number;
};

export function StrategyStatCards({
  clusterCount,
  briefCount,
  contentVelocity,
  keywordCount,
}: Props) {
  const stats = [
    {
      label: 'Topic Clusters',
      value: clusterCount,
      icon: FiLayers,
      color: 'purple' as const,
      delay: 0.1,
    },
    {
      label: 'Planned Briefs',
      value: briefCount,
      icon: FiFileText,
      color: 'blue' as const,
      delay: 0.2,
    },
    {
      label: 'Posts/Week',
      value: contentVelocity,
      icon: FiTrendingUp,
      color: 'green' as const,
      delay: 0.3,
    },
    {
      label: 'Target Keywords',
      value: keywordCount,
      icon: FiZap,
      color: 'yellow' as const,
      delay: 0.4,
    },
  ];

  return (
    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
      {stats.map((stat) => (
        <MetricCard
          key={stat.label}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          color={stat.color}
          theme="dark"
          delay={stat.delay}
        />
      ))}
    </SimpleGrid>
  );
}
