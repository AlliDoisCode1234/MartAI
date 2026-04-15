/**
 * GoogleConnect Component
 *
 * Component Hierarchy:
 * App → Settings → Integrations → GoogleConnect
 *
 * OAuth-based connection for Google Analytics 4 and Search Console.
 * Uses combined scope to connect both with single OAuth flow.
 * Supports multi-account property/site selection when a Google account
 * has more than one GA4 property or GSC site.
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
  Select,
} from '@chakra-ui/react';
import { FiExternalLink, FiTrash2, FiCheck, FiZap, FiAlertCircle } from 'react-icons/fi';
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

  const [connectingService, setConnectingService] = useState<'ga4' | 'gsc' | null>(null);
  const [selectedGA4Property, setSelectedGA4Property] = useState<string>('');
  const [selectedGSCSite, setSelectedGSCSite] = useState<string>('');
  const [isSavingGA4, setIsSavingGA4] = useState(false);
  const [isSavingGSC, setIsSavingGSC] = useState(false);

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
  const selectGA4PropertyMutation = useMutation(api.integrations.ga4Connections.selectGA4Property);
  const switchGSCSiteMutation = useMutation(api.integrations.gscConnections.switchGSCSite);

  // Derived state
  const ga4Connected = !!ga4Connection;
  const ga4PendingSelection = ga4Connection?.propertyId === 'PENDING_SELECTION';
  const gscConnected = !!gscConnection;
  const gscPendingSelection = gscConnection?.siteUrl === 'PENDING_SELECTION';
  const gtmConnected = !!gtmConnection;

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

  const handleConnect = async (service: 'ga4' | 'gsc') => {
    console.log('[GoogleOAuth][Client] handleConnect triggered with projectId:', projectId, 'service:', service);
    setConnectingService(service);
    try {
      console.log('[GoogleOAuth][Client] Calling generateAuthUrl Convex action...');
      const authUrl = await generateAuthUrl({ projectId });
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
      setConnectingService(null);
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

  const handleSelectGA4Property = async () => {
    if (!selectedGA4Property) return;
    setIsSavingGA4(true);
    try {
      await selectGA4PropertyMutation({ projectId, propertyId: selectedGA4Property });
      toast({
        title: 'Property selected',
        description: 'GA4 property configured. Analytics sync starting.',
        status: 'success',
        duration: 4000,
      });
      setSelectedGA4Property('');
    } catch (error) {
      toast({
        title: 'Selection failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSavingGA4(false);
    }
  };

  const handleSelectGSCSite = async () => {
    if (!selectedGSCSite) return;
    setIsSavingGSC(true);
    try {
      await switchGSCSiteMutation({ projectId, siteUrl: selectedGSCSite });
      toast({
        title: 'Site selected',
        description: 'Search Console site configured. Analytics sync starting.',
        status: 'success',
        duration: 4000,
      });
      setSelectedGSCSite('');
    } catch (error) {
      toast({
        title: 'Selection failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSavingGSC(false);
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

  return (
    <VStack spacing={4} align="stretch">
      {/* Google Analytics 4 Card */}
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        borderColor={ga4PendingSelection ? 'orange.300' : ga4Connected ? 'green.200' : 'gray.200'}
        bg={ga4PendingSelection ? 'orange.50' : ga4Connected ? 'green.50' : 'white'}
      >
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Icon as={SiGoogleanalytics} boxSize={6} color={GA4_COLOR} />
            <Text fontWeight="bold">Google Analytics 4</Text>
            {ga4PendingSelection ? (
              <Badge colorScheme="orange" display="flex" alignItems="center" gap={1}>
                <FiAlertCircle size={12} />
                Select Property
              </Badge>
            ) : ga4Connected ? (
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
              onClick={() => handleConnect('ga4')}
              isLoading={connectingService === 'ga4'}
              loadingText="Connecting..."
            >
              Connect
            </Button>
          )}
        </HStack>

        {/* Property Picker — shown when PENDING_SELECTION */}
        {ga4PendingSelection && ga4Connection?.availableProperties && (
          <VStack align="stretch" spacing={3} mt={3}>
            <Text fontSize="sm" color="gray.600">
              Multiple GA4 properties found. Select the one for this project:
            </Text>
            <Select
              placeholder="Choose a GA4 property..."
              value={selectedGA4Property}
              onChange={(e) => setSelectedGA4Property(e.target.value)}
              size="sm"
            >
              {ga4Connection.availableProperties.map((prop: { propertyId: string; propertyName: string; accountName: string }) => (
                <option key={prop.propertyId} value={prop.propertyId}>
                  {prop.propertyName} ({prop.accountName}) &mdash; {prop.propertyId}
                </option>
              ))}
            </Select>
            <Button
              size="sm"
              colorScheme="orange"
              onClick={handleSelectGA4Property}
              isDisabled={!selectedGA4Property}
              isLoading={isSavingGA4}
              loadingText="Saving..."
            >
              Confirm Selection
            </Button>
          </VStack>
        )}

        {/* Connected property details */}
        {ga4Connected && !ga4PendingSelection && ga4Connection && (
          <VStack align="start" spacing={1} mt={2}>
            <HStack>
              <Text fontSize="sm" color="gray.600">
                Property:
              </Text>
              <Text fontSize="sm" fontWeight="medium">
                {ga4Connection.propertyName || ga4Connection.propertyId}
              </Text>
            </HStack>
            {/* Allow changing property if multiple are available */}
            {ga4Connection.availableProperties && ga4Connection.availableProperties.length > 1 && (
              <Select
                placeholder="Switch property..."
                size="xs"
                mt={1}
                value=""
                onChange={async (e) => {
                  if (e.target.value) {
                    try {
                      await selectGA4PropertyMutation({ projectId, propertyId: e.target.value });
                      toast({
                        title: 'Property switched',
                        description: 'GA4 property updated. Analytics re-syncing.',
                        status: 'success',
                        duration: 4000,
                      });
                    } catch (err) {
                      toast({
                        title: 'Switch failed',
                        description: err instanceof Error ? err.message : 'Unknown error',
                        status: 'error',
                        duration: 5000,
                      });
                    }
                  }
                }}
              >
                {ga4Connection.availableProperties
                  .filter((p: { propertyId: string }) => p.propertyId !== ga4Connection.propertyId)
                  .map((prop: { propertyId: string; propertyName: string; accountName: string }) => (
                    <option key={prop.propertyId} value={prop.propertyId}>
                      {prop.propertyName} ({prop.accountName})
                    </option>
                  ))}
              </Select>
            )}
          </VStack>
        )}
      </Box>

      {/* Google Search Console Card */}
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        borderColor={gscPendingSelection ? 'orange.300' : gscConnected ? 'green.200' : 'gray.200'}
        bg={gscPendingSelection ? 'orange.50' : gscConnected ? 'green.50' : 'white'}
      >
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Icon as={SiGooglesearchconsole} boxSize={6} color={GSC_COLOR} />
            <Text fontWeight="bold">Google Search Console</Text>
            {gscPendingSelection ? (
              <Badge colorScheme="orange" display="flex" alignItems="center" gap={1}>
                <FiAlertCircle size={12} />
                Select Site
              </Badge>
            ) : gscConnected ? (
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
              onClick={() => handleConnect('gsc')}
              isLoading={connectingService === 'gsc'}
              loadingText="Connecting..."
            >
              Connect
            </Button>
          )}
        </HStack>

        {/* Site Picker — shown when PENDING_SELECTION */}
        {gscPendingSelection && gscConnection?.availableSites && (
          <VStack align="stretch" spacing={3} mt={3}>
            <Text fontSize="sm" color="gray.600">
              Multiple sites found. Select the one for this project:
            </Text>
            <Select
              placeholder="Choose a Search Console site..."
              value={selectedGSCSite}
              onChange={(e) => setSelectedGSCSite(e.target.value)}
              size="sm"
            >
              {gscConnection.availableSites.map((site: { siteUrl: string; permissionLevel: string }) => (
                <option key={site.siteUrl} value={site.siteUrl}>
                  {site.siteUrl} ({site.permissionLevel})
                </option>
              ))}
            </Select>
            <Button
              size="sm"
              colorScheme="orange"
              onClick={handleSelectGSCSite}
              isDisabled={!selectedGSCSite}
              isLoading={isSavingGSC}
              loadingText="Saving..."
            >
              Confirm Selection
            </Button>
          </VStack>
        )}

        {/* Connected site details */}
        {gscConnected && !gscPendingSelection && gscConnection && (
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
            {/* Allow changing site if multiple are available */}
            {gscConnection.availableSites && gscConnection.availableSites.length > 1 && (
              <Select
                placeholder="Switch site..."
                size="xs"
                mt={1}
                value=""
                onChange={async (e) => {
                  if (e.target.value) {
                    try {
                      await switchGSCSiteMutation({ projectId, siteUrl: e.target.value });
                      toast({
                        title: 'Site switched',
                        description: 'Search Console site updated. Analytics re-syncing.',
                        status: 'success',
                        duration: 4000,
                      });
                    } catch (err) {
                      toast({
                        title: 'Switch failed',
                        description: err instanceof Error ? err.message : 'Unknown error',
                        status: 'error',
                        duration: 5000,
                      });
                    }
                  }
                }}
              >
                {gscConnection.availableSites
                  .filter((s: { siteUrl: string }) => s.siteUrl !== gscConnection.siteUrl)
                  .map((site: { siteUrl: string; permissionLevel: string }) => (
                    <option key={site.siteUrl} value={site.siteUrl}>
                      {site.siteUrl} ({site.permissionLevel})
                    </option>
                  ))}
              </Select>
            )}
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
