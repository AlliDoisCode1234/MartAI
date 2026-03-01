/**
 * GoogleConnect Component
 *
 * Component Hierarchy:
 * App → Settings → Integrations → GoogleConnect
 *
 * OAuth-based connection for Google Analytics 4 and Search Console.
 * Uses combined scope to connect both with single OAuth flow.
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
  Icon,
  useDisclosure,
} from '@chakra-ui/react';
import { FiExternalLink, FiTrash2, FiCheck, FiZap } from 'react-icons/fi';
import { SiGoogleanalytics, SiGooglesearchconsole, SiGoogletagmanager } from 'react-icons/si';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { useSearchParams } from 'next/navigation';
import { ServiceAccountUpload } from '../integrations/ServiceAccountUpload';
import { GtmAutomationModal } from './GtmAutomationModal';

interface Props {
  projectId: Id<'projects'>;
}

// Brand colors
const GA4_COLOR = '#E37400';
const GSC_COLOR = '#458CF5';

const GTM_COLOR = '#246FDB';

export function GoogleConnect({ projectId }: Props) {
  const toast = useToast();
  const searchParams = useSearchParams();
  const { isOpen: isGtmOpen, onOpen: onGtmOpen, onClose: onGtmClose } = useDisclosure();

  const [isConnecting, setIsConnecting] = useState(false);

  // Convex hooks
  const ga4Connection = useQuery(api.integrations.ga4Connections.getGA4Connection, {
    projectId,
  });
  const gscConnection = useQuery(api.integrations.gscConnections.getGSCConnection, {
    projectId,
  });
  const gtmConnection = useQuery(api.integrations.gtmAutomation.getGTMConnection, {
    projectId,
  });

  const generateAuthUrl = useAction(api.integrations.google.generateAuthUrl);
  const deleteGA4Connection = useMutation(api.integrations.ga4Connections.deleteGA4Connection);
  const deleteGSCConnection = useMutation(api.integrations.gscConnections.deleteGSCConnection);

  // Check for OAuth callback success
  useEffect(() => {
    const setup = searchParams?.get('setup');
    const success = searchParams?.get('success');
    const error = searchParams?.get('error');
    const type = searchParams?.get('type');

    console.log('[GoogleOAuth][Client] Callback params on mount:', {
      setup,
      success,
      error,
      type,
      ga4Property: searchParams?.get('ga4Property'),
      gscSite: searchParams?.get('gscSite'),
      fullUrl: typeof window !== 'undefined' ? window.location.href : 'SSR',
    });

    if (error) {
      console.error('[GoogleOAuth][Client] OAuth returned error:', error);
      toast({
        title: 'Connection failed',
        description: 'Unable to connect to Google. Please try again.',
        status: 'error',
        duration: 8000,
      });
    }

    if (setup === 'ga4') {
      console.log('[GoogleOAuth][Client] Setup=ga4 detected, showing toast');
      toast({
        title: 'Google connected',
        description: 'Select your GA4 property and GSC site',
        status: 'info',
        duration: 5000,
      });
    }
  }, [searchParams, toast]);

  const handleConnect = async () => {
    console.log('[GoogleOAuth][Client] handleConnect triggered with projectId:', projectId);
    setIsConnecting(true);
    try {
      console.log('[GoogleOAuth][Client] Calling generateAuthUrl Convex action...');
      // Pass the current origin's callback URL so local dev auto-resolves to localhost
      const localRedirectUri = `${window.location.origin}/api/google-callback`;
      console.log('[GoogleOAuth][Client] Using redirectUri:', localRedirectUri);
      const authUrl = await generateAuthUrl({ projectId, redirectUri: localRedirectUri });
      console.log(
        '[GoogleOAuth][Client] Received authUrl:',
        authUrl ? `${authUrl.substring(0, 80)}...` : 'NULL'
      );
      if (authUrl) {
        console.log('[GoogleOAuth][Client] Redirecting to Google OAuth consent...');
        window.location.href = authUrl;
      } else {
        throw new Error('Failed to generate authorization URL');
      }
    } catch (error) {
      console.error('[GoogleOAuth][Client] handleConnect error:', error);
      toast({
        title: 'Connection failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      });
      setIsConnecting(false);
    }
  };

  const handleDisconnectGA4 = async () => {
    if (!ga4Connection) return;
    try {
      await deleteGA4Connection({ projectId, connectionId: ga4Connection._id });
      toast({
        title: 'Disconnected',
        description: 'Google Analytics 4 connection removed',
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

  const handleDisconnectGSC = async () => {
    if (!gscConnection) return;
    try {
      await deleteGSCConnection({ projectId, connectionId: gscConnection._id });
      toast({
        title: 'Disconnected',
        description: 'Search Console connection removed',
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
  if (ga4Connection === undefined || gscConnection === undefined || gtmConnection === undefined) {
    return (
      <VStack spacing={4} align="stretch">
        <Box p={4} borderWidth="1px" borderRadius="lg" borderColor="gray.200">
          <HStack>
            <Skeleton height="24px" width="24px" borderRadius="md" />
            <Skeleton height="20px" width="120px" />
            <Skeleton height="20px" width="80px" />
          </HStack>
        </Box>
        <Box p={4} borderWidth="1px" borderRadius="lg" borderColor="gray.200">
          <HStack>
            <Skeleton height="24px" width="24px" borderRadius="md" />
            <Skeleton height="20px" width="140px" />
            <Skeleton height="20px" width="80px" />
          </HStack>
        </Box>
      </VStack>
    );
  }

  const ga4Connected = !!ga4Connection;
  const gscConnected = !!gscConnection;
  const gtmConnected = !!gtmConnection;

  return (
    <VStack spacing={4} align="stretch">
      {/* Google Analytics 4 Card */}
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        borderColor={ga4Connected ? 'green.200' : 'gray.200'}
        bg={ga4Connected ? 'green.50' : 'white'}
      >
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Icon as={SiGoogleanalytics} boxSize={6} color={GA4_COLOR} />
            <Text fontWeight="bold">Google Analytics 4</Text>
            {ga4Connected ? (
              <Badge colorScheme="green" display="flex" alignItems="center" gap={1}>
                <FiCheck size={12} />
                Connected
              </Badge>
            ) : (
              <Badge colorScheme="gray">Not Connected</Badge>
            )}
          </HStack>
          {ga4Connected ? (
            <IconButton
              aria-label="Disconnect"
              icon={<FiTrash2 />}
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={handleDisconnectGA4}
            />
          ) : (
            <Button
              size="sm"
              bg={GA4_COLOR}
              color="white"
              _hover={{ bg: '#C26300' }}
              onClick={handleConnect}
              isLoading={isConnecting}
              loadingText="Connecting..."
            >
              Connect
            </Button>
          )}
        </HStack>
        {ga4Connected && ga4Connection && (
          <VStack align="start" spacing={1} mt={2}>
            <HStack>
              <Text fontSize="sm" color="gray.600">
                Property:
              </Text>
              <Text fontSize="sm" fontWeight="medium">
                {ga4Connection.propertyName || ga4Connection.propertyId}
              </Text>
            </HStack>
          </VStack>
        )}
      </Box>

      {/* Google Search Console Card */}
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        borderColor={gscConnected ? 'green.200' : 'gray.200'}
        bg={gscConnected ? 'green.50' : 'white'}
      >
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Icon as={SiGooglesearchconsole} boxSize={6} color={GSC_COLOR} />
            <Text fontWeight="bold">Google Search Console</Text>
            {gscConnected ? (
              <Badge colorScheme="green" display="flex" alignItems="center" gap={1}>
                <FiCheck size={12} />
                Connected
              </Badge>
            ) : (
              <Badge colorScheme="gray">Not Connected</Badge>
            )}
          </HStack>
          {gscConnected ? (
            <IconButton
              aria-label="Disconnect"
              icon={<FiTrash2 />}
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={handleDisconnectGSC}
            />
          ) : (
            <Button
              size="sm"
              bg={GSC_COLOR}
              color="white"
              _hover={{ bg: '#3A7AD8' }}
              onClick={handleConnect}
              isLoading={isConnecting}
              loadingText="Connecting..."
            >
              Connect
            </Button>
          )}
        </HStack>
        {gscConnected && gscConnection && (
          <VStack align="start" spacing={1} mt={2}>
            <HStack>
              <Text fontSize="sm" color="gray.600">
                Site:
              </Text>
              <Link href={gscConnection.siteUrl} isExternal fontSize="sm">
                {gscConnection.siteUrl}
                <FiExternalLink style={{ display: 'inline', marginLeft: 4 }} />
              </Link>
            </HStack>
          </VStack>
        )}
      </Box>

      {/* Google Tag Manager Card */}
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        borderColor={gtmConnected ? 'green.200' : 'gray.200'}
        bg={gtmConnected ? 'green.50' : 'white'}
      >
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Icon as={SiGoogletagmanager} boxSize={6} color={GTM_COLOR} />
            <Text fontWeight="bold">Google Tag Manager</Text>
            {gtmConnected ? (
              <Badge colorScheme="green" display="flex" alignItems="center" gap={1}>
                <FiCheck size={12} />
                Automated
              </Badge>
            ) : (
              <Badge colorScheme="gray">Not Configured</Badge>
            )}
          </HStack>
          {gtmConnected ? (
            <IconButton
              aria-label="Disconnect"
              icon={<FiTrash2 />}
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={() => {
                toast({
                  title: 'Manual Action Required',
                  description:
                    'To disconnect an automated GTM container, please remove it directly from your Google Tag Manager dashboard.',
                  status: 'info',
                  duration: 6000,
                });
              }}
            />
          ) : (
            <Button
              size="sm"
              colorScheme="orange"
              variant="outline"
              leftIcon={<FiZap />}
              onClick={onGtmOpen}
            >
              Automate Setup
            </Button>
          )}
        </HStack>
        {gtmConnected && gtmConnection && (
          <VStack align="start" spacing={1} mt={2}>
            <HStack>
              <Text fontSize="sm" color="gray.600">
                Container ID:
              </Text>
              <Text fontSize="sm" fontWeight="medium">
                {gtmConnection.containerPublicId}
              </Text>
            </HStack>
          </VStack>
        )}
      </Box>

      {/* Info text */}
      {!ga4Connected && !gscConnected && (
        <VStack align="start" spacing={1}>
          <Text fontSize="sm" color="gray.500">
            Connect your Google account to import analytics data and track search performance.
          </Text>
          <Link
            href="/resources/how-to-connect-google-analytics"
            fontSize="xs"
            color="blue.500"
            display="flex"
            alignItems="center"
            gap={1}
          >
            Need help? View setup guide <FiExternalLink size={10} />
          </Link>
        </VStack>
      )}

      {/* Service Account Upload (Advanced Option) */}
      {!ga4Connected && (
        <ServiceAccountUpload
          projectId={projectId}
          onSuccess={() => {
            toast({
              title: 'Service account connected',
              description: 'GA4 connection established via service account',
              status: 'success',
              duration: 5000,
            });
          }}
        />
      )}

      <GtmAutomationModal isOpen={isGtmOpen} onClose={onGtmClose} projectId={projectId} />
    </VStack>
  );
}

export default GoogleConnect;
