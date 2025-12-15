'use client';

/**
 * SubscriptionCard Component
 *
 * Component Hierarchy:
 * App → Admin → Users → [id] → SubscriptionCard (this file)
 *
 * Displays subscription details for a user in the admin portal.
 */

import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  HStack,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import { format, formatDistanceToNow } from 'date-fns';
import { SUBSCRIPTION_STATUS_COLORS } from '@/lib/constants/admin';
import type { SubscriptionData } from '@/types/admin';

type Props = {
  subscription: SubscriptionData | null;
};

export function SubscriptionCard({ subscription }: Props) {
  if (!subscription) {
    return (
      <Card>
        <CardHeader pb={0}>
          <Heading size="md">Subscription</Heading>
        </CardHeader>
        <CardBody>
          <Text color="gray.500">No active subscription</Text>
        </CardBody>
      </Card>
    );
  }

  const statusColor = SUBSCRIPTION_STATUS_COLORS[subscription.status || ''] || 'gray';

  return (
    <Card>
      <CardHeader pb={0}>
        <HStack justify="space-between">
          <Heading size="md">Subscription</Heading>
          <Badge colorScheme={statusColor} fontSize="sm">
            {subscription.status?.replace('_', ' ')}
          </Badge>
        </HStack>
      </CardHeader>
      <CardBody>
        <SimpleGrid columns={2} gap={4}>
          <Stat size="sm">
            <StatLabel>Plan</StatLabel>
            <StatNumber fontSize="lg">{subscription.planTier}</StatNumber>
            <StatHelpText>${subscription.priceMonthly}/mo</StatHelpText>
          </Stat>
          <Stat size="sm">
            <StatLabel>Billing Cycle</StatLabel>
            <StatNumber fontSize="lg" textTransform="capitalize">
              {subscription.billingCycle || 'Monthly'}
            </StatNumber>
          </Stat>
          {subscription.renewsAt && (
            <Stat size="sm">
              <StatLabel>Renews</StatLabel>
              <StatNumber fontSize="md">{format(subscription.renewsAt, 'MMM d, yyyy')}</StatNumber>
            </Stat>
          )}
          {subscription.graceStartedAt && (
            <Stat size="sm">
              <StatLabel>Grace Period Started</StatLabel>
              <StatNumber fontSize="md">
                {formatDistanceToNow(subscription.graceStartedAt, { addSuffix: true })}
              </StatNumber>
              <StatHelpText color="orange.500">7 days to resolve</StatHelpText>
            </Stat>
          )}
          {(subscription.failedPaymentCount ?? 0) > 0 && (
            <Stat size="sm">
              <StatLabel>Failed Payments</StatLabel>
              <StatNumber color="red.500">{subscription.failedPaymentCount}</StatNumber>
              {subscription.lastPaymentFailedAt && (
                <StatHelpText>
                  Last: {format(subscription.lastPaymentFailedAt, 'MMM d')}
                </StatHelpText>
              )}
            </Stat>
          )}
        </SimpleGrid>
      </CardBody>
    </Card>
  );
}
