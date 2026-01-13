/**
 * IntegrationStatusCard Component
 *
 * Component Hierarchy:
 * App → Settings/ContentStudio → IntegrationStatusCard
 *
 * Shared component for displaying integration connection status.
 * Supports two modes:
 * - full: Full management UI (Settings page)
 * - compact: Status badge + quick actions (Content Studio)
 */

import React from 'react';
import { Box, HStack, VStack, Text, Badge, Button, Icon, Link, Skeleton } from '@chakra-ui/react';
import { FiCheck, FiExternalLink, FiSettings, FiZap } from 'react-icons/fi';
import { SiWordpress, SiShopify, SiWix } from 'react-icons/si';

type Platform = 'wordpress' | 'shopify' | 'wix';

interface Props {
  platform: Platform;
  mode: 'full' | 'compact';
  isConnected: boolean;
  isLoading?: boolean;
  siteName?: string;
  siteUrl?: string;
  lastSynced?: number; // timestamp
  onConnect?: () => void;
  onManage?: () => void;
  onPublish?: () => void;
}

const PLATFORM_CONFIG: Record<
  Platform,
  {
    name: string;
    icon: React.ElementType;
    color: string;
    description: string;
  }
> = {
  wordpress: {
    name: 'WordPress',
    icon: SiWordpress,
    color: '#21759B',
    description: 'Publish blog posts and pages',
  },
  shopify: {
    name: 'Shopify',
    icon: SiShopify,
    color: '#96BF48',
    description: 'Publish to your store blog',
  },
  wix: {
    name: 'Wix',
    icon: SiWix,
    color: '#0C6EFC',
    description: 'Publish to your Wix blog',
  },
};

function formatTimeSince(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

export function IntegrationStatusCard({
  platform,
  mode,
  isConnected,
  isLoading = false,
  siteName,
  siteUrl,
  lastSynced,
  onConnect,
  onManage,
  onPublish,
}: Props) {
  const config = PLATFORM_CONFIG[platform];
  const PlatformIcon = config.icon;

  // Loading state
  if (isLoading) {
    return (
      <Box
        p={mode === 'compact' ? 3 : 4}
        borderWidth="1px"
        borderRadius="lg"
        borderColor="gray.200"
      >
        <HStack>
          <Skeleton height="24px" width="24px" borderRadius="md" />
          <Skeleton height="20px" width="80px" />
          <Skeleton height="20px" width="60px" />
        </HStack>
      </Box>
    );
  }

  // COMPACT MODE: Status badge + quick actions
  if (mode === 'compact') {
    if (isConnected) {
      return (
        <Box p={3} borderWidth="1px" borderRadius="lg" borderColor="green.200" bg="green.50">
          <HStack justify="space-between">
            <HStack spacing={2}>
              <Icon as={PlatformIcon} boxSize={5} color={config.color} />
              <Text fontWeight="medium" fontSize="sm">
                {config.name}
              </Text>
              <Badge colorScheme="green" size="sm">
                <HStack spacing={1}>
                  <Icon as={FiCheck} boxSize={3} />
                  <Text>Connected</Text>
                </HStack>
              </Badge>
              {lastSynced && (
                <Text fontSize="xs" color="gray.500">
                  {formatTimeSince(lastSynced)}
                </Text>
              )}
            </HStack>
            <HStack spacing={2}>
              {onPublish && (
                <Button size="xs" colorScheme="green" leftIcon={<FiZap />} onClick={onPublish}>
                  Publish
                </Button>
              )}
              {onManage && (
                <Button size="xs" variant="ghost" leftIcon={<FiSettings />} onClick={onManage}>
                  Manage
                </Button>
              )}
            </HStack>
          </HStack>
        </Box>
      );
    }

    // Compact - Not connected
    return (
      <Box p={3} borderWidth="1px" borderRadius="lg" borderColor="gray.200" bg="gray.50">
        <HStack justify="space-between">
          <HStack spacing={2}>
            <Icon as={PlatformIcon} boxSize={5} color="gray.400" />
            <Text fontWeight="medium" fontSize="sm" color="gray.600">
              {config.name}
            </Text>
          </HStack>
          <Button size="xs" colorScheme="blue" onClick={onConnect}>
            Connect to publish
          </Button>
        </HStack>
      </Box>
    );
  }

  // FULL MODE: Complete management UI
  if (isConnected) {
    return (
      <Box p={4} borderWidth="1px" borderRadius="lg" borderColor="green.200" bg="green.50">
        <HStack justify="space-between" mb={3}>
          <HStack spacing={3}>
            <Icon as={PlatformIcon} boxSize={6} color={config.color} />
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold">{config.name}</Text>
              <Text fontSize="sm" color="gray.600">
                {config.description}
              </Text>
            </VStack>
          </HStack>
          <Badge colorScheme="green" fontSize="sm" px={2} py={1}>
            <HStack spacing={1}>
              <Icon as={FiCheck} />
              <Text>Connected</Text>
            </HStack>
          </Badge>
        </HStack>

        <VStack align="start" spacing={2} pl={9}>
          {siteName && (
            <HStack>
              <Text fontSize="sm" color="gray.600">
                Site:
              </Text>
              {siteUrl ? (
                <Link href={siteUrl} isExternal fontSize="sm" color="blue.600">
                  {siteName}
                  <Icon as={FiExternalLink} ml={1} boxSize={3} />
                </Link>
              ) : (
                <Text fontSize="sm">{siteName}</Text>
              )}
            </HStack>
          )}
          {lastSynced && (
            <HStack>
              <Text fontSize="sm" color="gray.600">
                Last activity:
              </Text>
              <Text fontSize="sm">{formatTimeSince(lastSynced)}</Text>
            </HStack>
          )}
        </VStack>
      </Box>
    );
  }

  // Full - Not connected
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" borderColor="gray.200">
      <HStack justify="space-between">
        <HStack spacing={3}>
          <Icon as={PlatformIcon} boxSize={6} color="gray.400" />
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold" color="gray.700">
              {config.name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {config.description}
            </Text>
          </VStack>
        </HStack>
        <Badge colorScheme="gray">Not Connected</Badge>
      </HStack>
    </Box>
  );
}

export default IntegrationStatusCard;
