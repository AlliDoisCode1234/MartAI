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
    <Card bg="rgba(30, 30, 30, 0.6)" borderWidth="1px" borderColor="rgba(255, 255, 255, 0.1)">
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Heading size="md" color="white">
            Quarterly Plan Summary
          </Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
            <Stat>
              <StatLabel color="gray.400">Content Velocity</StatLabel>
              <StatNumber color="white">{plan.contentVelocity} posts/week</StatNumber>
              <StatHelpText color="gray.500">
                12 weeks = {plan.contentVelocity * 12} total posts
              </StatHelpText>
            </Stat>
            {plan.goals.traffic && (
              <Stat>
                <StatLabel color="gray.400">Traffic Goal</StatLabel>
                <StatNumber color="white">{plan.goals.traffic.toLocaleString()}</StatNumber>
                <StatHelpText color="gray.500">Estimated visitors</StatHelpText>
              </Stat>
            )}
            {plan.goals.leads && (
              <Stat>
                <StatLabel color="gray.400">Leads Goal</StatLabel>
                <StatNumber color="white">{plan.goals.leads.toLocaleString()}</StatNumber>
                <StatHelpText color="gray.500">Estimated conversions</StatHelpText>
              </Stat>
            )}
          </Grid>
          {plan.assumptions && (
            <Text fontSize="sm" color="gray.400" fontStyle="italic">
              {plan.assumptions}
            </Text>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
