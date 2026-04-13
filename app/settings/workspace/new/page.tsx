'use client';

/**
 * Create Workspace Page
 *
 * Component Hierarchy:
 * App -> Settings -> Workspace -> New (this file)
 *
 * 2-step wizard for creating a new workspace (organization).
 * Reuses onboarding components but skips user-level steps
 * (signup, plan selection, payment).
 *
 * Step 1: Workspace name + business URL -> creates org + project
 * Step 2: Connect GA4/GSC (optional, can skip)
 * Completion: Switches to new org + redirects to /studio
 */

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  VStack,
  Box,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
  Icon,
  Progress,
  useToast,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiBriefcase, FiArrowRight, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { useMutation, useAction, useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useAuth } from '@/lib/useAuth';
import { MartLoader } from '@/src/components/assistant';
import { IntegrationStep } from '@/src/components/onboarding';

const MotionBox = motion(Box);

export default function CreateWorkspacePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const convex = useConvex();

  // Wizard state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [ga4Connected, setGa4Connected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Mutations & Actions
  const createOrganization = useMutation(api.teams.teams.createOrganization);
  const createProject = useMutation(api.projects.projects.createProject);
  const switchOrganization = useMutation(api.users.switchOrganization);
  const generateAuthUrl = useAction(api.integrations.google.generateAuthUrl);
  const generateKeywordsFromUrl = useAction(api.seo.keywordActions.generateKeywordsFromUrl);
  const generateClusters = useAction(api.seo.keywordActions.generateClusters);
  const generateContentCalendar = useAction(
    api.contentCalendar.generateCalendar.generateFullCalendar
  );
  const generatePreliminaryScore = useMutation(
    api.analytics.martaiRatingQueries.generatePreliminaryScore
  );

  // Auth guards
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Onboarding completion guard — only fully onboarded users can create workspaces.
  useEffect(() => {
    if (!authLoading && user && user.onboardingStatus !== 'completed') {
      try {
        if (sessionStorage.getItem('onboarding_just_completed') === 'true') {
          return;
        }
      } catch {}
      router.replace('/onboarding');
    }
  }, [authLoading, user, router]);

  // Tier guard — Starter users shouldn't reach this page
  useEffect(() => {
    if (user && (!user.membershipTier || user.membershipTier === 'starter')) {
      toast({
        title: 'Upgrade Required',
        description: 'Multi-workspace support requires Engine tier or higher.',
        status: 'warning',
        duration: 4000,
      });
      router.replace('/subscription');
    }
  }, [user, toast, router]);

  // Handle OAuth callback return
  useEffect(() => {
    const success = searchParams?.get('success');
    if (success === 'true') {
      setGa4Connected(true);
      setStep(2);

      // Restore projectId from session storage
      try {
        const stored = sessionStorage.getItem('workspace_projectId');
        if (stored) setProjectId(stored);
      } catch {
        // Safari private browsing
      }

      toast({
        title: 'Analytics Connected',
        description: 'GA4 connected to your new workspace.',
        status: 'success',
        duration: 3000,
      });
    } else if (success === 'false') {
      const error = searchParams?.get('error');
      setConnectionError(error || 'Connection failed');
      setStep(2);

      try {
        const stored = sessionStorage.getItem('workspace_projectId');
        if (stored) setProjectId(stored);
      } catch {
        // Safari private browsing
      }

      window.history.replaceState({}, '', '/settings/workspace/new?step=2');
    }
  }, [searchParams, toast]);

  // Loading guards
  if (authLoading || !user) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="brand.light">
        <MartLoader message="Loading..." />
      </Box>
    );
  }

  // Step 1: Create workspace + project
  const handleCreateWorkspace = async () => {
    if (!workspaceName.trim()) {
      toast({ title: 'Workspace name required', status: 'error', duration: 3000 });
      return;
    }
    if (!websiteUrl.trim()) {
      toast({ title: 'Website URL required', status: 'error', duration: 3000 });
      return;
    }

    setLoading(true);
    try {
      // 1. Create the organization
      const orgId = await createOrganization({ name: workspaceName.trim() });

      // 2. Switch to the new org
      await switchOrganization({ organizationId: orgId });

      // 3. Create project in the new org
      let sanitizedUrl = websiteUrl.trim();
      if (!sanitizedUrl.startsWith('http://') && !sanitizedUrl.startsWith('https://')) {
        sanitizedUrl = 'https://' + sanitizedUrl;
      }

      const newProjectId = await createProject({
        name: workspaceName.trim(),
        websiteUrl: sanitizedUrl,
        organizationId: orgId,
      });

      setProjectId(newProjectId);

      // Explicitly set project context for the new org
      try {
        localStorage.setItem('currentProjectId', newProjectId);
        // Seed context memory for the new org
        const orgProjectMap = JSON.parse(localStorage.getItem('orgProjectMap') || '{}');
        orgProjectMap[orgId] = newProjectId;
        localStorage.setItem('orgProjectMap', JSON.stringify(orgProjectMap));
      } catch { /* Safari private browsing */ }

      // Save for OAuth return
      try {
        sessionStorage.setItem('workspace_projectId', newProjectId);
      } catch {
        // Safari private browsing
      }

      // 4. Fire-and-forget: background generation
      (async () => {
        try {
          await convex.mutation(api.projects.projects.updateProject, {
            projectId: newProjectId as Id<'projects'>,
            generationStatus: 'generating',
          });

          await generateKeywordsFromUrl({
            projectId: newProjectId as Id<'projects'>,
            limit: 30,
          });
          await generateClusters({ projectId: newProjectId as Id<'projects'> });
          await generateContentCalendar({
            projectId: newProjectId as Id<'projects'>,
            useGa4Gsc: false,
          });
          await generatePreliminaryScore({ projectId: newProjectId as Id<'projects'> });

          await convex.mutation(api.projects.projects.updateProject, {
            projectId: newProjectId as Id<'projects'>,
            generationStatus: 'complete',
          });
        } catch (bgError) {
          console.warn('[Workspace] Background generation error:', bgError);
          await convex.mutation(api.projects.projects.updateProject, {
            projectId: newProjectId as Id<'projects'>,
            generationStatus: 'error',
          }).catch(console.error);
        }
      })();

      toast({
        title: 'Workspace Created',
        description: `${workspaceName} is ready. Connect analytics to boost your score.`,
        status: 'success',
        duration: 3000,
      });

      setStep(2);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create workspace';
      toast({ title: 'Error', description: message, status: 'error', duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: GA4 connection
  const handleConnect = async () => {
    if (!projectId) return;
    setConnectionError(null);

    try {
      const authUrl = await generateAuthUrl({
        projectId: projectId as Id<'projects'>,
        returnTo: '/settings/workspace/new?step=2',
      });

      if (!authUrl) {
        toast({ title: 'Failed to start connection', status: 'error', duration: 3000 });
        return;
      }

      try {
        sessionStorage.setItem('workspace_projectId', projectId);
      } catch {
        // Safari private browsing
      }

      window.location.href = authUrl;
    } catch (error) {
      console.error('GA4 connection error:', error);
      setConnectionError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  // Complete — redirect to studio
  const handleComplete = () => {
    router.push('/studio');
  };

  return (
    <Box minH="100vh" bg="brand.light" py={12}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          {/* Progress */}
          <Box>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" color="gray.500">Step {step} of 2</Text>
              <Text fontSize="sm" color="gray.500">{step === 1 ? 'Setup' : 'Analytics'}</Text>
            </HStack>
            <Progress
              value={step * 50}
              size="sm"
              colorScheme="orange"
              borderRadius="full"
              bg="gray.100"
            />
          </Box>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <MotionBox
                key="workspace-step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Box bg="white" p={8} borderRadius="2xl" shadow="lg">
                  <VStack spacing={6} align="stretch">
                    <Box textAlign="center">
                      <Icon as={FiBriefcase} boxSize={10} color="brand.orange" mb={3} />
                      <Heading size="lg" mb={2}>
                        Create a New Workspace
                      </Heading>
                      <Text color="gray.600">
                        Each workspace is an independent brand with its own content, analytics, and team.
                      </Text>
                    </Box>

                    <Card bg="orange.50" borderWidth="1px" borderColor="orange.200">
                      <CardBody>
                        <HStack spacing={3}>
                          <Icon as={FiCheck} color="orange.500" />
                          <Text fontSize="sm" color="gray.700">
                            Your account info and billing carry over automatically. Just name the workspace
                            and provide the website URL.
                          </Text>
                        </HStack>
                      </CardBody>
                    </Card>

                    <FormControl isRequired>
                      <FormLabel>Workspace Name</FormLabel>
                      <Input
                        id="workspace-name"
                        placeholder="e.g., Acme Corp, Client Brand"
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        size="lg"
                        focusBorderColor="brand.orange"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Website URL</FormLabel>
                      <Input
                        id="workspace-url"
                        placeholder="e.g., acmecorp.com"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        size="lg"
                        focusBorderColor="brand.orange"
                      />
                    </FormControl>

                    <HStack justify="space-between" pt={4}>
                      <Button
                        variant="ghost"
                        leftIcon={<FiArrowLeft />}
                        onClick={() => router.back()}
                      >
                        Cancel
                      </Button>
                      <Button
                        colorScheme="orange"
                        rightIcon={<FiArrowRight />}
                        size="lg"
                        onClick={handleCreateWorkspace}
                        isLoading={loading}
                        isDisabled={!workspaceName.trim() || !websiteUrl.trim()}
                      >
                        Create Workspace
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              </MotionBox>
            )}

            {step === 2 && (
              <IntegrationStep
                projectId={projectId}
                ga4Connected={ga4Connected}
                connectionError={connectionError}
                onConnect={handleConnect}
                onNext={handleComplete}
                onSkip={handleComplete}
                onBack={() => setStep(1)}
              />
            )}
          </AnimatePresence>
        </VStack>
      </Container>
    </Box>
  );
}
