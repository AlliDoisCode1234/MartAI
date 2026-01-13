/**
 * ShopifyConnect Component
 *
 * Component Hierarchy:
 * App → Settings → Integrations → ShopifyConnect
 *
 * OAuth-based connection to Shopify store for blog publishing.
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Text,
  Badge,
  IconButton,
  useToast,
  Collapse,
  Link,
  Skeleton,
} from '@chakra-ui/react';
import { FiExternalLink, FiTrash2, FiCheck } from 'react-icons/fi';
import { SiShopify } from 'react-icons/si';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { useSearchParams } from 'next/navigation';

interface Props {
  projectId: Id<'projects'>;
}

export function ShopifyConnect({ projectId }: Props) {
  const toast = useToast();
  const searchParams = useSearchParams();

  // Form state
  const [shopDomain, setShopDomain] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Convex hooks
  const connection = useQuery(api.integrations.platformConnections.getConnection, {
    projectId,
    platform: 'shopify',
  });

  const deleteConnection = useMutation(api.integrations.platformConnections.deleteConnection);

  // Check for OAuth callback success
  useEffect(() => {
    const shopifyStatus = searchParams?.get('shopify');
    const shop = searchParams?.get('shop');

    if (shopifyStatus === 'connected' && shop) {
      toast({
        title: 'Shopify connected',
        description: `Connected to ${shop}`,
        status: 'success',
        duration: 5000,
      });
    }
  }, [searchParams, toast]);

  const handleConnect = async () => {
    if (!shopDomain) {
      toast({
        title: 'Missing shop domain',
        description: 'Please enter your Shopify store domain',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setIsConnecting(true);
    try {
      // Clean up shop domain
      const shop = shopDomain
        .replace('https://', '')
        .replace('http://', '')
        .replace('.myshopify.com', '')
        .trim();

      // Call our OAuth initiation endpoint
      const response = await fetch(
        `/api/oauth/shopify?shop=${encodeURIComponent(shop)}&projectId=${projectId}`
      );

      const data = await response.json();

      if (data.authUrl) {
        // Redirect to Shopify for authorization
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
        description: 'Shopify connection removed',
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
            <SiShopify size={24} color="#96BF48" />
            <Text fontWeight="bold">Shopify</Text>
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
              Store:
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

  // Show connect form
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" borderColor="gray.200">
      <HStack justify="space-between" mb={4}>
        <HStack>
          <SiShopify size={24} color="#96BF48" />
          <Text fontWeight="bold">Shopify</Text>
          <Badge colorScheme="gray">Not Connected</Badge>
        </HStack>
        <Button size="sm" colorScheme="green" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Connect'}
        </Button>
      </HStack>

      <Collapse in={showForm} animateOpacity>
        <VStack spacing={4} align="stretch">
          <Text fontSize="sm" color="gray.600">
            Enter your Shopify store domain to connect via OAuth.
          </Text>

          <FormControl isRequired>
            <FormLabel>Shopify Store Domain</FormLabel>
            <Input
              placeholder="mystore.myshopify.com or mystore"
              value={shopDomain}
              onChange={(e) => setShopDomain(e.target.value)}
            />
          </FormControl>

          <Button
            colorScheme="green"
            onClick={handleConnect}
            isLoading={isConnecting}
            loadingText="Redirecting to Shopify..."
            leftIcon={<FiCheck />}
          >
            Connect with Shopify
          </Button>
        </VStack>
      </Collapse>
    </Box>
  );
}

export default ShopifyConnect;
