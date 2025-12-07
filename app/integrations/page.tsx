'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  Button,
  HStack,
  Grid,
  GridItem,
  Card,
  CardBody,
  Alert,
  AlertIcon,
  Badge,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import { useAuth } from '@/lib/useAuth';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';

type Integration = {
  platform: string;
  connected: boolean;
  siteUrl?: string;
  propertyName?: string;
  lastSync?: string;
};

function IntegrationsContent() {
  const { user, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const [integrations, setIntegrations] = useState<Integration[]>([
    { platform: 'ga4', connected: false },
    { platform: 'gsc', connected: false },
    { platform: 'wordpress', connected: false },
    { platform: 'shopify', connected: false },
    { platform: 'webflow', connected: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    // Check for OAuth callback success/error
    const success = searchParams?.get('success');
    const error = searchParams?.get('error');
    const property = searchParams?.get('property');
    const site = searchParams?.get('site');

    if (success === 'ga4' && property) {
      setIntegrations((prev) =>
        prev.map((i) =>
          i.platform === 'ga4' ? { ...i, connected: true, propertyName: property } : i
        )
      );
    }

    if (success === 'gsc' && site) {
      setIntegrations((prev) =>
        prev.map((i) => (i.platform === 'gsc' ? { ...i, connected: true, siteUrl: site } : i))
      );
    }

    if (error) {
      console.error('OAuth error:', error);
    }

    // Get project ID from localStorage or create temp
    const storedProject = localStorage.getItem('currentProjectId');
    if (storedProject) {
      setProjectId(storedProject);
    } else {
      // For now, use a temp project ID
      const tempId = `project-${Date.now()}`;
      setProjectId(tempId);
      localStorage.setItem('currentProjectId', tempId);
    }
  }, [searchParams]);

  const generateAuthUrl = useAction(api.integrations.google.generateAuthUrl);

  const handleConnectGA4 = async () => {
    if (!projectId || !isAuthenticated) {
      alert('Please complete onboarding first');
      return;
    }

    setLoading(true);
    try {
      const authUrl = await generateAuthUrl({ projectId: projectId as any });
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        alert('Failed to initiate GA4 connection');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to connect GA4');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGSC = async () => {
    if (!projectId || !isAuthenticated) {
      alert('Please complete onboarding first');
      return;
    }
    // GSC uses same Google Auth flow
    handleConnectGA4();
  };

  const [testResult, setTestResult] = useState<{
    valid: boolean;
    error?: string;
    canPublish?: boolean;
  } | null>(null);
  const {
    isOpen: isCMSModalOpen,
    onOpen: onCMSModalOpen,
    onClose: onCMSModalClose,
  } = useDisclosure();
  const [cmsPlatform, setCmsPlatform] = useState<'wordpress' | 'shopify' | 'webflow' | null>(null);
  const [cmsCredentials, setCmsCredentials] = useState<any>({});

  const handleConnectCMS = (platform: 'wordpress' | 'shopify' | 'webflow') => {
    setCmsPlatform(platform);
    setCmsCredentials({});
    setTestResult(null);
    onCMSModalOpen();
  };

  const handleTestConnection = async () => {
    if (!projectId || !cmsPlatform) return;

    setLoading(true);
    setTestResult(null);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/cms/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          platform: cmsPlatform,
          projectId,
          credentials: cmsCredentials,
        }),
      });

      const result = await response.json();
      setTestResult(result);

      if (result.valid && result.canPublish) {
        setIntegrations((prev) =>
          prev.map((i) =>
            i.platform === cmsPlatform
              ? {
                  ...i,
                  connected: true,
                  siteUrl: cmsCredentials.siteUrl || cmsCredentials.shopDomain,
                }
              : i
          )
        );
        setTimeout(() => onCMSModalClose(), 2000);
      }
    } catch (error) {
      setTestResult({ valid: false, error: 'Failed to test connection' });
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWordPress = () => handleConnectCMS('wordpress');
  const handleConnectShopify = () => handleConnectCMS('shopify');
  const handleConnectWebflow = () => handleConnectCMS('webflow');

  const getIntegrationInfo = (platform: string) => {
    switch (platform) {
      case 'ga4':
        return {
          name: 'Google Analytics 4',
          description: 'Connect your GA4 property to track traffic, sessions, and user behavior',
          color: 'orange',
        };
      case 'gsc':
        return {
          name: 'Google Search Console',
          description: 'Connect Search Console to import top queries and track rankings',
          color: 'blue',
        };
      case 'wordpress':
        return {
          name: 'WordPress',
          description: 'Connect your WordPress site to automatically publish SEO-optimized content',
          color: 'orange',
        };
      case 'shopify':
        return {
          name: 'Shopify',
          description: 'Connect your Shopify store to automatically publish SEO-optimized content',
          color: 'teal',
        };
      case 'webflow':
        return {
          name: 'Webflow',
          description: 'Connect your Webflow site to automatically publish SEO-optimized content',
          color: 'purple',
        };
      default:
        return { name: platform, description: '', color: 'gray' };
    }
  };

  if (!isAuthenticated) {
    return (
      <Box
        minH="calc(100vh - 64px)"
        bg="brand.light"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Alert status="warning" maxW="md">
          <AlertIcon />
          Please sign in to connect integrations
        </Alert>
      </Box>
    );
  }

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container
        maxW="container.xl"
        py={{ base: 8, md: 12 }}
        px={{ base: 4, sm: 6, md: 8, lg: 12 }}
      >
        <VStack spacing={8} align="stretch">
          <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">
            Data Connections
          </Heading>

          <Text color="gray.600">
            Connect your analytics and CMS platforms to enable automated SEO insights and content
            publishing.
          </Text>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
            {integrations.map((integration) => {
              const info = getIntegrationInfo(integration.platform);
              return (
                <GridItem key={integration.platform}>
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
                          colorScheme={info.color as any}
                          onClick={() => {
                            if (integration.platform === 'ga4') handleConnectGA4();
                            else if (integration.platform === 'gsc') handleConnectGSC();
                            else if (integration.platform === 'wordpress') handleConnectWordPress();
                            else if (integration.platform === 'shopify') handleConnectShopify();
                            else if (integration.platform === 'webflow') handleConnectWebflow();
                          }}
                          isDisabled={loading}
                          isLoading={loading}
                        >
                          {integration.connected ? 'Reconnect' : `Connect ${info.name}`}
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>
              );
            })}
          </Grid>

          {/* CMS Connection Modal */}
          <Modal isOpen={isCMSModalOpen} onClose={onCMSModalClose} size="lg">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                Connect{' '}
                {cmsPlatform === 'wordpress'
                  ? 'WordPress'
                  : cmsPlatform === 'shopify'
                    ? 'Shopify'
                    : 'Webflow'}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4}>
                  {cmsPlatform === 'wordpress' && (
                    <>
                      <FormControl>
                        <FormLabel>Site URL</FormLabel>
                        <Input
                          placeholder="https://yoursite.com"
                          value={cmsCredentials.siteUrl || ''}
                          onChange={(e) =>
                            setCmsCredentials({ ...cmsCredentials, siteUrl: e.target.value })
                          }
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Username</FormLabel>
                        <Input
                          placeholder="WordPress username"
                          value={cmsCredentials.username || ''}
                          onChange={(e) =>
                            setCmsCredentials({ ...cmsCredentials, username: e.target.value })
                          }
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Application Password</FormLabel>
                        <Input
                          type="password"
                          placeholder="WordPress application password"
                          value={cmsCredentials.password || ''}
                          onChange={(e) =>
                            setCmsCredentials({ ...cmsCredentials, password: e.target.value })
                          }
                        />
                      </FormControl>
                    </>
                  )}
                  {cmsPlatform === 'shopify' && (
                    <>
                      <FormControl>
                        <FormLabel>Shop Domain</FormLabel>
                        <Input
                          placeholder="your-shop"
                          value={cmsCredentials.shopDomain || ''}
                          onChange={(e) =>
                            setCmsCredentials({ ...cmsCredentials, shopDomain: e.target.value })
                          }
                        />
                        <Text fontSize="xs" color="gray.500" mt={1}>
                          Enter your shop name without .myshopify.com
                        </Text>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Access Token</FormLabel>
                        <Input
                          type="password"
                          placeholder="Shopify admin API access token"
                          value={cmsCredentials.accessToken || ''}
                          onChange={(e) =>
                            setCmsCredentials({ ...cmsCredentials, accessToken: e.target.value })
                          }
                        />
                      </FormControl>
                    </>
                  )}
                  {cmsPlatform === 'webflow' && (
                    <>
                      <FormControl>
                        <FormLabel>Site ID</FormLabel>
                        <Input
                          placeholder="Webflow site ID"
                          value={cmsCredentials.siteId || ''}
                          onChange={(e) =>
                            setCmsCredentials({ ...cmsCredentials, siteId: e.target.value })
                          }
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Access Token</FormLabel>
                        <Input
                          type="password"
                          placeholder="Webflow API access token"
                          value={cmsCredentials.accessToken || ''}
                          onChange={(e) =>
                            setCmsCredentials({ ...cmsCredentials, accessToken: e.target.value })
                          }
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Collection ID (Optional)</FormLabel>
                        <Input
                          placeholder="CMS collection ID for pages"
                          value={cmsCredentials.collectionId || ''}
                          onChange={(e) =>
                            setCmsCredentials({ ...cmsCredentials, collectionId: e.target.value })
                          }
                        />
                      </FormControl>
                    </>
                  )}

                  {testResult && (
                    <Alert status={testResult.valid && testResult.canPublish ? 'success' : 'error'}>
                      <AlertIcon />
                      {testResult.valid && testResult.canPublish
                        ? 'Connection successful! You have publishing rights.'
                        : testResult.error || 'Connection failed or insufficient permissions'}
                    </Alert>
                  )}
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onCMSModalClose}>
                  Cancel
                </Button>
                <Button
                  bg="brand.orange"
                  color="white"
                  onClick={handleTestConnection}
                  isLoading={loading}
                >
                  Test Connection
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" fontWeight="semibold">
                Setup Instructions:
              </Text>
              <Text fontSize="sm">
                <strong>GA4/GSC:</strong> Click connect to authorize with Google. You'll be
                redirected to Google to grant permissions.
              </Text>
              <Text fontSize="sm">
                <strong>WordPress:</strong> Create an Application Password in WordPress (Users →
                Your Profile → Application Passwords).
              </Text>
              <Text fontSize="sm">
                <strong>Shopify:</strong> Create a Private App with content write permissions and
                get the access token.
              </Text>
            </VStack>
          </Alert>
        </VStack>
      </Container>
    </Box>
  );
}

export default function IntegrationsPage() {
  return (
    <Suspense
      fallback={
        <Box
          minH="calc(100vh - 64px)"
          bg="brand.light"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="xl" color="brand.orange" />
        </Box>
      }
    >
      <IntegrationsContent />
    </Suspense>
  );
}
