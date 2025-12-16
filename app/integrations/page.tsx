'use client';

/**
 * Integrations Page
 *
 * Component Hierarchy:
 * App → Integrations (this file)
 *
 * Connect analytics and CMS platforms.
 * Uses extracted modal components for modularity.
 */

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  Grid,
  GridItem,
  Alert,
  AlertIcon,
  useDisclosure,
} from '@chakra-ui/react';
import { useAuth } from '@/lib/useAuth';
import { useAction, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { AnalyticsSetupWizard } from '@/src/components/analytics/AnalyticsSetupWizard';

// Extracted components
import {
  IntegrationCard,
  GA4Modal,
  GSCModal,
  CMSModal,
  IntegrationsSkeleton,
} from '@/src/components/integrations';
import {
  DEFAULT_INTEGRATIONS,
  type Integration,
  type OAuthTokens,
} from '@/lib/constants/integrations';

function IntegrationsContent() {
  const { user, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const [integrations, setIntegrations] = useState<Integration[]>(DEFAULT_INTEGRATIONS);
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);

  // Modal states
  const {
    isOpen: isGA4ModalOpen,
    onOpen: onGA4ModalOpen,
    onClose: onGA4ModalClose,
  } = useDisclosure();
  const {
    isOpen: isGSCModalOpen,
    onOpen: onGSCModalOpen,
    onClose: onGSCModalClose,
  } = useDisclosure();
  const {
    isOpen: isCMSModalOpen,
    onOpen: onCMSModalOpen,
    onClose: onCMSModalClose,
  } = useDisclosure();

  // Form states
  const [ga4PropertyId, setGA4PropertyId] = useState('');
  const [gscSiteUrl, setGscSiteUrl] = useState('');
  const [ga4Tokens, setGA4Tokens] = useState<OAuthTokens | null>(null);
  const [gscTokens, setGscTokens] = useState<OAuthTokens | null>(null);
  const [cmsPlatform, setCmsPlatform] = useState<'wordpress' | 'shopify' | 'webflow' | null>(null);
  const [cmsCredentials, setCmsCredentials] = useState<any>({});
  const [testResult, setTestResult] = useState<{
    valid: boolean;
    error?: string;
    canPublish?: boolean;
  } | null>(null);
  const [showWizard, setShowWizard] = useState(false);

  // Mutations
  const generateAuthUrl = useAction(api.integrations.google.generateAuthUrl);
  const upsertGA4Connection = useMutation(api.integrations.ga4Connections.upsertGA4Connection);
  const upsertGSCConnection = useMutation(api.integrations.gscConnections.upsertGSCConnection);

  // OAuth callback handling
  useEffect(() => {
    const success = searchParams?.get('success');
    const property = searchParams?.get('property');
    const site = searchParams?.get('site');
    if (success === 'ga4' && property)
      setIntegrations((prev) =>
        prev.map((i) =>
          i.platform === 'ga4' ? { ...i, connected: true, propertyName: property } : i
        )
      );
    if (success === 'gsc' && site)
      setIntegrations((prev) =>
        prev.map((i) => (i.platform === 'gsc' ? { ...i, connected: true, siteUrl: site } : i))
      );
    const storedProject = localStorage.getItem('currentProjectId');
    setProjectId(storedProject || `project-${Date.now()}`);
  }, [searchParams]);

  // Check for GA4 setup tokens
  useEffect(() => {
    const setup = searchParams?.get('setup');
    const tokens = searchParams?.get('tokens');
    if (setup === 'ga4' && tokens) {
      try {
        const decoded = JSON.parse(atob(decodeURIComponent(tokens)));
        setGA4Tokens(decoded);
        setShowWizard(true);
        window.history.replaceState({}, '', '/integrations');
      } catch (e) {
        console.error('Failed to parse GA4 tokens:', e);
      }
    }
  }, [searchParams]);

  // Handlers
  const handleConnectGA4 = async () => {
    if (!projectId || !isAuthenticated) {
      alert('Please complete onboarding first');
      return;
    }
    setLoading(true);
    try {
      const authUrl = await generateAuthUrl({ projectId: projectId as any });
      if (authUrl) window.location.href = authUrl;
      else alert('Failed to initiate GA4 connection');
    } catch (error) {
      console.error(error);
      alert('Failed to connect GA4');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGA4Connection = async () => {
    if (!ga4PropertyId || !ga4Tokens) {
      alert('Please enter a Property ID');
      return;
    }
    setLoading(true);
    try {
      await upsertGA4Connection({
        projectId: ga4Tokens.projectId as Id<'projects'>,
        propertyId: ga4PropertyId,
        propertyName: `Property ${ga4PropertyId}`,
        accessToken: ga4Tokens.accessToken,
        refreshToken: ga4Tokens.refreshToken,
      });
      setIntegrations((prev) =>
        prev.map((i) =>
          i.platform === 'ga4'
            ? { ...i, connected: true, propertyName: `Property ${ga4PropertyId}` }
            : i
        )
      );
      onGA4ModalClose();
      if (ga4Tokens) {
        setGscTokens(ga4Tokens);
        onGSCModalOpen();
      }
      setGA4Tokens(null);
      setGA4PropertyId('');
    } catch (error) {
      console.error('Failed to save GA4 connection:', error);
      alert('Failed to save connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGSCConnection = async () => {
    if (!gscSiteUrl || !gscTokens) {
      alert('Please enter your site URL');
      return;
    }
    setLoading(true);
    try {
      await upsertGSCConnection({
        projectId: gscTokens.projectId as Id<'projects'>,
        siteUrl: gscSiteUrl,
        accessToken: gscTokens.accessToken,
        refreshToken: gscTokens.refreshToken,
      });
      setIntegrations((prev) =>
        prev.map((i) => (i.platform === 'gsc' ? { ...i, connected: true, siteUrl: gscSiteUrl } : i))
      );
      onGSCModalClose();
      setGscTokens(null);
      setGscSiteUrl('');
    } catch (error) {
      console.error('Failed to save GSC connection:', error);
      alert('Failed to save connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectCMS = (platform: 'wordpress' | 'shopify' | 'webflow') => {
    setCmsPlatform(platform);
    setCmsCredentials({});
    setTestResult(null);
    onCMSModalOpen();
  };

  const handleTestCMS = async () => {
    if (!projectId || !cmsPlatform) return;
    setLoading(true);
    setTestResult(null);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/cms/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ platform: cmsPlatform, projectId, credentials: cmsCredentials }),
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

  const handleWizardComplete = async (data: { ga4PropertyId: string; gscSiteUrl?: string }) => {
    if (!ga4Tokens) return;
    await upsertGA4Connection({
      projectId: ga4Tokens.projectId as Id<'projects'>,
      propertyId: data.ga4PropertyId,
      propertyName: `Property ${data.ga4PropertyId}`,
      accessToken: ga4Tokens.accessToken,
      refreshToken: ga4Tokens.refreshToken,
    });
    setIntegrations((prev) =>
      prev.map((i) =>
        i.platform === 'ga4'
          ? { ...i, connected: true, propertyName: `Property ${data.ga4PropertyId}` }
          : i
      )
    );
    if (data.gscSiteUrl) {
      await upsertGSCConnection({
        projectId: ga4Tokens.projectId as Id<'projects'>,
        siteUrl: data.gscSiteUrl,
        accessToken: ga4Tokens.accessToken,
        refreshToken: ga4Tokens.refreshToken,
      });
      setIntegrations((prev) =>
        prev.map((i) =>
          i.platform === 'gsc' ? { ...i, connected: true, siteUrl: data.gscSiteUrl } : i
        )
      );
    }
    setGA4Tokens(null);
  };

  const getConnectHandler = (platform: string) => {
    if (platform === 'ga4' || platform === 'gsc') return handleConnectGA4;
    if (platform === 'wordpress') return () => handleConnectCMS('wordpress');
    if (platform === 'shopify') return () => handleConnectCMS('shopify');
    if (platform === 'webflow') return () => handleConnectCMS('webflow');
    return () => {};
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
            {integrations.map((integration) => (
              <GridItem key={integration.platform}>
                <IntegrationCard
                  integration={integration}
                  onConnect={getConnectHandler(integration.platform)}
                  loading={loading}
                />
              </GridItem>
            ))}
          </Grid>

          {/* Wizards and Modals */}
          {ga4Tokens && (
            <AnalyticsSetupWizard
              isOpen={showWizard}
              onClose={() => {
                setShowWizard(false);
                setGA4Tokens(null);
              }}
              onComplete={handleWizardComplete}
              tokens={ga4Tokens}
            />
          )}
          <GA4Modal
            isOpen={isGA4ModalOpen}
            onClose={onGA4ModalClose}
            propertyId={ga4PropertyId}
            onPropertyIdChange={setGA4PropertyId}
            onSave={handleSaveGA4Connection}
            loading={loading}
          />
          <GSCModal
            isOpen={isGSCModalOpen}
            onClose={onGSCModalClose}
            siteUrl={gscSiteUrl}
            onSiteUrlChange={setGscSiteUrl}
            onSave={handleSaveGSCConnection}
            loading={loading}
          />
          <CMSModal
            isOpen={isCMSModalOpen}
            onClose={onCMSModalClose}
            platform={cmsPlatform}
            credentials={cmsCredentials}
            onCredentialsChange={setCmsCredentials}
            onTest={handleTestCMS}
            testResult={testResult}
            loading={loading}
          />

          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" fontWeight="semibold">
                Setup Instructions:
              </Text>
              <Text fontSize="sm">
                <strong>GA4/GSC:</strong> Click connect to authorize with Google.
              </Text>
              <Text fontSize="sm">
                <strong>WordPress:</strong> Create an Application Password in WordPress.
              </Text>
              <Text fontSize="sm">
                <strong>Shopify:</strong> Create a Private App with content write permissions.
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
    <Suspense fallback={<IntegrationsSkeleton />}>
      <IntegrationsContent />
    </Suspense>
  );
}
