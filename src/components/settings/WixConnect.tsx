/**
 * WixConnect Component
 *
 * Component Hierarchy:
 * App → Settings → Integrations → WixConnect
 *
 * OAuth-based connection to Wix site for blog publishing.
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Badge,
  IconButton,
  useToast,
  Skeleton,
  Link,
} from '@chakra-ui/react';
import { FiExternalLink, FiTrash2, FiCheck } from 'react-icons/fi';
import { SiWix } from 'react-icons/si';
import { CMSCapabilityAlert } from './CMSCapabilityAlert';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { useSearchParams } from 'next/navigation';

interface Props {
  projectId: Id<'projects'>;
}

export function WixConnect({ projectId }: Props) {
  const toast = useToast();
  const searchParams = useSearchParams();

  const [isConnecting, setIsConnecting] = useState(false);

  // Convex hooks
  const connection = useQuery(api.integrations.platformConnections.getConnection, {
    projectId,
    platform: 'wix',
  });

  const deleteConnection = useMutation(api.integrations.platformConnections.deleteConnection);

  // Check for OAuth callback success
  useEffect(() => {
    const wixStatus = searchParams?.get('wix');

    if (wixStatus === 'connected') {
      toast({
        title: 'Wix connected',
        description: 'Your Wix site is now connected',
        status: 'success',
        duration: 5000,
      });
    }
  }, [searchParams, toast]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Call our OAuth initiation endpoint
      const response = await fetch(`/api/oauth/wix?projectId=${projectId}`);

      const data = await response.json();

      if (data.authUrl) {
        // Redirect to Wix for authorization
        window.location.href = data.authUrl;
      } else {
        throw new Error(data.error || 'Failed to get authorization URL');
      }
    } catch (error) {
      toast({
        title: 'Connection failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      });
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!connection) return;

    try {
      await deleteConnection({ connectionId: connection._id });
      toast({
        title: 'Disconnected',
        description: 'Wix connection removed',
        status: 'info',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to disconnect',
        status: 'error',
        duration: 3000,
      });
    }
  };

  // Loading state
  if (connection === undefined) {
    return (
      <Box p={4} borderWidth="1px" borderRadius="lg" borderColor="gray.200">
        <HStack>
          <Skeleton height="24px" width="24px" borderRadius="md" />
          <Skeleton height="20px" width="80px" />
          <Skeleton height="20px" width="60px" />
        </HStack>
      </Box>
    );
  }

  // Show connected state
  if (connection) {
    return (
      <Box p={4} borderWidth="1px" borderRadius="lg" borderColor="green.200" bg="green.50">
        <HStack justify="space-between" mb={2}>
          <HStack>
            <SiWix size={24} color="#0C6EFC" />
            <Text fontWeight="bold">Wix</Text>
            <Badge colorScheme="green">Connected</Badge>
          </HStack>
          <HStack>
            <IconButton
              aria-label="Disconnect"
              icon={<FiTrash2 />}
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={handleDisconnect}
            />
          </HStack>
        </HStack>

        <VStack align="start" spacing={1}>
          <HStack>
            <Text fontSize="sm" color="gray.600">
              Site:
            </Text>
            <Link href={connection.siteUrl} isExternal fontSize="sm">
              {connection.siteName || connection.siteUrl}
              <FiExternalLink style={{ display: 'inline', marginLeft: 4 }} />
            </Link>
          </HStack>
        </VStack>
      </Box>
    );
  }

  // Show connect button
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" borderColor="gray.200">
      <CMSCapabilityAlert platform="wix" variant="compact" />

      <HStack justify="space-between" mt={3}>
        <HStack>
          <SiWix size={24} color="#0C6EFC" />
          <Text fontWeight="bold">Wix</Text>
          <Badge colorScheme="gray">Not Connected</Badge>
        </HStack>
        <Button
          size="sm"
          colorScheme="blue"
          onClick={handleConnect}
          isLoading={isConnecting}
          loadingText="Connecting..."
          leftIcon={<FiCheck />}
        >
          Connect
        </Button>
      </HStack>

      <Link
        href="/resources/how-to-connect-wix"
        fontSize="xs"
        color="blue.500"
        mt={2}
        display="block"
      >
        Need help? View setup guide
      </Link>
    </Box>
  );
}

export default WixConnect;
