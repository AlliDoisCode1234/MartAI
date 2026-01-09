'use client';

/**
 * StrategyStatCards Component
 *
 * Component Hierarchy:
 * App → Strategy → StrategyStatCards (this file)
 *
 * Displays 4 hero stat cards for content studio metrics using shared MetricCard.
 */

import { SimpleGrid } from '@chakra-ui/react';
import { FiFileText, FiEdit3, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { MetricCard } from '@/src/components/shared';

type Props = {
  totalContent: number;
  draftsCount: number;
  scheduledCount: number;
  publishedCount: number;
};

export function StrategyStatCards({
  totalContent,
  draftsCount,
  scheduledCount,
  publishedCount,
}: Props) {
  const stats = [
    {
      label: 'Total Content',
      value: totalContent,
      icon: FiFileText,
      color: 'purple' as const,
      delay: 0.1,
    },
    {
      label: 'In Progress',
      value: draftsCount,
      icon: FiEdit3,
      color: 'blue' as const,
      delay: 0.2,
    },
    {
      label: 'Scheduled',
      value: scheduledCount,
      icon: FiCalendar,
      color: 'green' as const,
      delay: 0.3,
    },
    {
      label: 'Published',
      value: publishedCount,
      icon: FiCheckCircle,
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
