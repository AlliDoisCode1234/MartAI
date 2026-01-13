/**
 * IntegrationsPanel Component
 *
 * Component Hierarchy:
 * App → ContentStudio → IntegrationsPanel
 *
 * Compact integration status panel for Content Studio.
 * Shows connected platforms with quick publish actions.
 */

'use client';

import React from 'react';
import { Box, VStack, HStack, Text, Icon, Button, Skeleton } from '@chakra-ui/react';
import { FiZap, FiSettings } from 'react-icons/fi';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { IntegrationStatusCard } from '../shared/IntegrationStatusCard';
import Link from 'next/link';

interface Props {
  projectId: Id<'projects'>;
  onPublish?: (platform: 'wordpress' | 'shopify' | 'wix') => void;
}

export function IntegrationsPanel({ projectId, onPublish }: Props) {
  // Fetch all connections for this project
  const connections = useQuery(api.integrations.platformConnections.listConnections, {
    projectId,
  });

  const isLoading = connections === undefined;

  // Connection type
  type Connection = { platform: string; siteName?: string; siteUrl: string; updatedAt?: number };

  // Find specific connections
  const wordpress = connections?.find((c: Connection) => c.platform === 'wordpress');
  const shopify = connections?.find((c: Connection) => c.platform === 'shopify');
  const wix = connections?.find((c: Connection) => c.platform === 'wix');

  const hasAnyConnection = wordpress || shopify || wix;
  const connectedCount = [wordpress, shopify, wix].filter(Boolean).length;

  // Loading state
  if (isLoading) {
    return (
      <Box p={4} borderWidth="1px" borderRadius="lg" bg="white">
        <Skeleton height="20px" width="120px" mb={3} />
        <VStack spacing={2}>
          <Skeleton height="40px" width="100%" />
          <Skeleton height="40px" width="100%" />
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" bg="white">
      <HStack justify="space-between" mb={3}>
        <HStack>
          <Icon as={FiZap} color="orange.500" />
          <Text fontWeight="semibold" fontSize="sm">
            Publish Integrations
          </Text>
          {connectedCount > 0 && (
            <Text fontSize="xs" color="gray.500">
              ({connectedCount} connected)
            </Text>
          )}
        </HStack>
        <Link href="/settings?tab=integrations">
          <Button size="xs" variant="ghost" leftIcon={<FiSettings />}>
            Manage
          </Button>
        </Link>
      </HStack>

      {hasAnyConnection ? (
        <VStack spacing={2} align="stretch">
          {wordpress && (
            <IntegrationStatusCard
              platform="wordpress"
              mode="compact"
              isConnected={true}
              siteName={wordpress.siteName}
              siteUrl={wordpress.siteUrl}
              lastSynced={wordpress.updatedAt}
              onPublish={() => onPublish?.('wordpress')}
              onManage={() => (window.location.href = '/settings?tab=integrations')}
            />
          )}
          {shopify && (
            <IntegrationStatusCard
              platform="shopify"
              mode="compact"
              isConnected={true}
              siteName={shopify.siteName}
              siteUrl={shopify.siteUrl}
              lastSynced={shopify.updatedAt}
              onPublish={() => onPublish?.('shopify')}
              onManage={() => (window.location.href = '/settings?tab=integrations')}
            />
          )}
          {wix && (
            <IntegrationStatusCard
              platform="wix"
              mode="compact"
              isConnected={true}
              siteName={wix.siteName}
              siteUrl={wix.siteUrl}
              lastSynced={wix.updatedAt}
              onPublish={() => onPublish?.('wix')}
              onManage={() => (window.location.href = '/settings?tab=integrations')}
            />
          )}
        </VStack>
      ) : (
        <Box p={4} bg="gray.50" borderRadius="md" textAlign="center">
          <Text fontSize="sm" color="gray.600" mb={2}>
            Connect a platform to enable 1-click publishing
          </Text>
          <Link href="/settings?tab=integrations">
            <Button size="sm" colorScheme="orange">
              Connect Your CMS
            </Button>
          </Link>
        </Box>
      )}
    </Box>
  );
}

export default IntegrationsPanel;
