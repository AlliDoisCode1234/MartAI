'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, VStack, Heading, Text, Box, Button, HStack, Grid, GridItem, Card, CardBody, Alert, AlertIcon, Badge, Spinner } from '@chakra-ui/react';
import { useAuth } from '@/lib/useAuth';

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
      setIntegrations(prev => prev.map(i => 
        i.platform === 'ga4' 
          ? { ...i, connected: true, propertyName: property }
          : i
      ));
    }

    if (success === 'gsc' && site) {
      setIntegrations(prev => prev.map(i => 
        i.platform === 'gsc' 
          ? { ...i, connected: true, siteUrl: site }
          : i
      ));
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

  const handleConnectGA4 = async () => {
    if (!projectId || !isAuthenticated) {
      alert('Please complete onboarding first');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/oauth/google?type=ga4&projectId=${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        alert('Failed to initiate GA4 connection');
      }
    } catch (error) {
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

    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/oauth/google?type=gsc&projectId=${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        alert('Failed to initiate GSC connection');
      }
    } catch (error) {
      alert('Failed to connect GSC');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWordPress = () => {
    // Existing WordPress connection logic
    alert('WordPress connection - enter credentials in modal');
  };

  const handleConnectShopify = () => {
    // Existing Shopify connection logic
    alert('Shopify connection - enter credentials in modal');
  };

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
      default:
        return { name: platform, description: '', color: 'gray' };
    }
  };

  if (!isAuthenticated) {
    return (
      <Box minH="calc(100vh - 64px)" bg="brand.light" display="flex" alignItems="center" justifyContent="center">
        <Alert status="warning" maxW="md">
          <AlertIcon />
          Please sign in to connect integrations
        </Alert>
      </Box>
    );
  }

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, sm: 6, md: 8, lg: 12 }}>
        <VStack spacing={8} align="stretch">
          <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">
            Data Connections
          </Heading>

          <Text color="gray.600">
            Connect your analytics and CMS platforms to enable automated SEO insights and content publishing.
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

          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" fontWeight="semibold">Setup Instructions:</Text>
              <Text fontSize="sm">
                <strong>GA4/GSC:</strong> Click connect to authorize with Google. You'll be redirected to Google to grant permissions.
              </Text>
              <Text fontSize="sm">
                <strong>WordPress:</strong> Create an Application Password in WordPress (Users → Your Profile → Application Passwords).
              </Text>
              <Text fontSize="sm">
                <strong>Shopify:</strong> Create a Private App with content write permissions and get the access token.
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
    <Suspense fallback={
      <Box minH="calc(100vh - 64px)" bg="brand.light" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="brand.orange" />
      </Box>
    }>
      <IntegrationsContent />
    </Suspense>
  );
}
