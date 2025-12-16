'use client';

/**
 * PlanSummaryCard Component
 *
 * Component Hierarchy:
 * App → Strategy → PlanSummaryCard (this file)
 *
 * Displays quarterly plan summary with goals.
 */

import {
  Card,
  CardBody,
  VStack,
  Heading,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Text,
} from '@chakra-ui/react';

type Props = {
  plan: {
    contentVelocity: number;
    goals: {
      traffic?: number;
      leads?: number;
    };
    assumptions?: string;
  };
};

export function PlanSummaryCard({ plan }: Props) {
  return (
    <Card>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Heading size="md">Quarterly Plan Summary</Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
            <Stat>
              <StatLabel>Content Velocity</StatLabel>
              <StatNumber>{plan.contentVelocity} posts/week</StatNumber>
              <StatHelpText>12 weeks = {plan.contentVelocity * 12} total posts</StatHelpText>
            </Stat>
            {plan.goals.traffic && (
              <Stat>
                <StatLabel>Traffic Goal</StatLabel>
                <StatNumber>{plan.goals.traffic.toLocaleString()}</StatNumber>
                <StatHelpText>Estimated visitors</StatHelpText>
              </Stat>
            )}
            {plan.goals.leads && (
              <Stat>
                <StatLabel>Leads Goal</StatLabel>
                <StatNumber>{plan.goals.leads.toLocaleString()}</StatNumber>
                <StatHelpText>Estimated conversions</StatHelpText>
              </Stat>
            )}
          </Grid>
          {plan.assumptions && (
            <Text fontSize="sm" color="gray.600" fontStyle="italic">
              {plan.assumptions}
            </Text>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
