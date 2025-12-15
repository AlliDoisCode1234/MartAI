'use client';

/**
 * EngagementMilestonesCard Component
 *
 * Component Hierarchy:
 * App → Admin → Users → [id] → EngagementMilestonesCard (this file)
 *
 * Displays engagement milestone stats.
 */

import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import type { EngagementMilestones } from '@/types/admin';

type Props = {
  milestones: EngagementMilestones;
};

export function EngagementMilestonesCard({ milestones }: Props) {
  const items = [
    { label: 'Keywords', count: milestones.totalKeywords, first: milestones.firstKeywordCreatedAt },
    { label: 'Clusters', count: milestones.totalClusters, first: milestones.firstClusterCreatedAt },
    { label: 'Briefs', count: milestones.totalBriefs, first: milestones.firstBriefCreatedAt },
    { label: 'Drafts', count: milestones.totalDrafts, first: milestones.firstDraftCreatedAt },
    {
      label: 'Published',
      count: milestones.totalPublished,
      first: milestones.firstContentPublishedAt,
    },
  ];

  return (
    <Card>
      <CardHeader pb={0}>
        <Heading size="md">Engagement Milestones</Heading>
      </CardHeader>
      <CardBody>
        <SimpleGrid columns={{ base: 2, md: 5 }} gap={4}>
          {items.map((item) => (
            <Stat key={item.label} size="sm">
              <StatLabel>{item.label}</StatLabel>
              <StatNumber>{item.count || 0}</StatNumber>
              {item.first && <StatHelpText>First: {format(item.first, 'MMM d')}</StatHelpText>}
            </Stat>
          ))}
        </SimpleGrid>
      </CardBody>
    </Card>
  );
}
