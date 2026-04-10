'use client';

/**
 * New Project Page
 *
 * Component Hierarchy:
 * App -> Projects/New (this file)
 *
 * 2-step wizard for adding a new project to the current workspace.
 * Decoupled from user acquisition components.
 *
 * Step 1: Project name + business URL -> creates project
 * Step 2: Connect GA4/GSC (optional, can skip)
 * Completion: Redirects to /studio
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
  Select,
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

const INDUSTRY_OPTIONS = [
  { value: '', label: 'Select your industry (optional)' },
  { value: 'ecommerce', label: 'E-commerce / Retail' },
  { value: 'saas', label: 'SaaS / Software' },
  { value: 'agency', label: 'Marketing Agency' },
  { value: 'healthcare', label: 'Healthcare / Medical' },
  { value: 'legal', label: 'Legal Services' },
  { value: 'realestate', label: 'Real Estate' },
  { value: 'construction', label: 'Construction / Home Services' },
  { value: 'restaurant', label: 'Restaurant / Food Service' },
  { value: 'fitness', label: 'Fitness / Wellness' },
  { value: 'education', label: 'Education / Coaching' },
  { value: 'nonprofit', label: 'Non-Profit' },
  { value: 'local', label: 'Local Service Business' },
  { value: 'other', label: 'Other' },
];

export default function CreateProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const convex = useConvex();

  // Wizard state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [industry, setIndustry] = useState('');
  const [customIndustry, setCustomIndustry] = useState('');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [ga4Connected, setGa4Connected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Mutations & Actions
  const createProject = useMutation(api.projects.projects.createProject);
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

  // Handle OAuth callback return
  useEffect(() => {
    const success = searchParams?.get('success');
    if (success === 'true') {
      setGa4Connected(true);
      setStep(2);

      // Restore projectId from session storage
      try {
        const stored = sessionStorage.getItem('newProject_projectId');
        if (stored) setProjectId(stored);
      } catch {
        // Safari private browsing
      }

      toast({
        title: 'Analytics Connected',
        description: 'GA4 connected to your new project.',
        status: 'success',
        duration: 3000,
      });
    } else if (success === 'false') {
      const error = searchParams?.get('error');
      setConnectionError(error || 'Connection failed');
      setStep(2);

      try {
        const stored = sessionStorage.getItem('newProject_projectId');
        if (stored) setProjectId(stored);
      } catch {
        // Safari private browsing
      }

      window.history.replaceState({}, '', '/projects/new?step=2');
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

  // Step 1: Create project
  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      toast({ title: 'Project name required', status: 'error', duration: 3000 });
      return;
    }
    if (!websiteUrl.trim()) {
      toast({ title: 'Website URL required', status: 'error', duration: 3000 });
      return;
    }

    setLoading(true);
    try {
      let sanitizedUrl = websiteUrl.trim();
      if (!sanitizedUrl.startsWith('http://') && !sanitizedUrl.startsWith('https://')) {
        sanitizedUrl = 'https://' + sanitizedUrl;
      }

      let finalIndustry = industry;
      if (finalIndustry === 'other' && customIndustry.trim()) {
        finalIndustry = customIndustry.trim();
      }

      // Create project in the existing organization
      const newProjectId = await createProject({
        name: projectName.trim(),
        websiteUrl: sanitizedUrl,
        industry: finalIndustry || undefined,
        organizationId: user.organizationId,
      });

      setProjectId(newProjectId);

      try {
        localStorage.setItem('currentProjectId', newProjectId);
        if (user.organizationId) {
          const orgProjectMap = JSON.parse(localStorage.getItem('orgProjectMap') || '{}');
          orgProjectMap[user.organizationId] = newProjectId;
          localStorage.setItem('orgProjectMap', JSON.stringify(orgProjectMap));
        }
      } catch { /* Safari private browsing */ }

      // Save for OAuth return
      try {
        sessionStorage.setItem('newProject_projectId', newProjectId);
      } catch {
        // Safari private browsing
      }

      // Fire-and-forget: background generation
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
          console.warn('[Project] Background generation error:', bgError);
          await convex.mutation(api.projects.projects.updateProject, {
            projectId: newProjectId as Id<'projects'>,
            generationStatus: 'error',
          }).catch(console.error);
        }
      })();

      toast({
        title: 'Project Created',
        description: `${projectName} is ready. Connect analytics to boost your score.`,
        status: 'success',
        duration: 3000,
      });

      setStep(2);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create project';
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
        returnTo: '/projects/new?step=2',
      });

      if (!authUrl) {
        toast({ title: 'Failed to start connection', status: 'error', duration: 3000 });
        return;
      }

      try {
        sessionStorage.setItem('newProject_projectId', projectId);
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
                key="project-step1"
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
                        Add a New Project
                      </Heading>
                      <Text color="gray.600">
                        Add another website or brand to your current workspace.
                      </Text>
                    </Box>

                    <Card bg="orange.50" borderWidth="1px" borderColor="orange.200">
                      <CardBody>
                        <HStack spacing={3}>
                          <Icon as={FiCheck} color="orange.500" />
                          <Text fontSize="sm" color="gray.700">
                            Billing is tied to your workspace. Simply configure the details below to begin running zero-click generation.
                          </Text>
                        </HStack>
                      </CardBody>
                    </Card>

                    <FormControl isRequired>
                      <FormLabel>Project Name</FormLabel>
                      <Input
                        id="project-name"
                        placeholder="e.g., Acme Corp, New Brand"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        size="lg"
                        focusBorderColor="brand.orange"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Website URL</FormLabel>
                      <Input
                        id="project-url"
                        placeholder="e.g., acmecorp.com"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        size="lg"
                        focusBorderColor="brand.orange"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Industry</FormLabel>
                      <Select
                        placeholder="Select your industry (optional)"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        size="lg"
                        focusBorderColor="brand.orange"
                      >
                        {INDUSTRY_OPTIONS.filter((opt) => opt.value).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Select>
                      {industry === 'other' && (
                        <Box mt={3} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} as={motion.div}>
                          <Input
                            placeholder="Please specify your industry..."
                            value={customIndustry}
                            onChange={(e) => setCustomIndustry(e.target.value)}
                            size="lg"
                            focusBorderColor="brand.orange"
                            autoFocus
                          />
                        </Box>
                      )}
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
                        onClick={handleCreateProject}
                        isLoading={loading}
                        isDisabled={!projectName.trim() || !websiteUrl.trim()}
                      >
                        Create Project
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
