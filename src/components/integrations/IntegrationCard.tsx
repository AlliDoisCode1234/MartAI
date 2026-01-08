'use client';

/**
 * IntegrationCard Component
 *
 * Component Hierarchy:
 * App → Integrations → IntegrationCard (this file)
 *
 * Individual integration platform card.
 */

import { Card, CardBody, VStack, HStack, Heading, Text, Button, Badge } from '@chakra-ui/react';
import { getPlatformInfo, type Integration } from '@/lib/constants/integrations';

type Props = {
  integration: Integration;
  onConnect: () => void;
  loading: boolean;
};

export function IntegrationCard({ integration, onConnect, loading }: Props) {
  const info = getPlatformInfo(integration.platform);

  return (
    <Card>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between">
            <Heading size="md">{info.name}</Heading>
            <Badge colorScheme={integration.connected ? 'green' : 'gray'}>
              {integration.connected ? 'Connected' : 'Not Connected'}
            </Badge>
          </HStack>
          <Text color="gray.600" fontSize="sm">
            {info.description}
          </Text>
          {integration.connected && (
            <VStack align="stretch" spacing={1}>
              {integration.propertyName && (
                <Text fontSize="sm" color="green.600">
                  Property: {integration.propertyName}
                </Text>
              )}
              {integration.siteUrl && (
                <Text fontSize="sm" color="green.600">
                  Site: {integration.siteUrl}
                </Text>
              )}
              {integration.lastSync && (
                <Text fontSize="xs" color="gray.500">
                  Last sync: {integration.lastSync}
                </Text>
              )}
            </VStack>
          )}
          <Button
            colorScheme={info.color}
            onClick={onConnect}
            isDisabled={loading}
            isLoading={loading}
          >
            {integration.connected ? 'Reconnect' : `Connect ${info.name}`}
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}
