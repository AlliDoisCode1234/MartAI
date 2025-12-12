'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  Badge,
  Alert,
  AlertIcon,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  useToast,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Divider,
  Progress,
  Tooltip,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiTarget,
  FiTrendingUp,
  FiZap,
  FiFileText,
  FiCalendar,
  FiLayers,
  FiStar,
  FiSearch,
} from 'react-icons/fi';
import { useAuth } from '@/lib/useAuth';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import type { Brief, ProjectId } from '@/types';
import { DraggableBriefList } from '@/src/components/DraggableBriefList';
import { assertProjectId } from '@/lib/typeGuards';
import { InsightList } from '@/src/components/insights';
import {
  StrategyStepper,
  NextStepCard,
  StrategyModeToggle,
  SkipWizardLink,
  KeywordSourceModal,
  KeywordsPreview,
  StrategyDashboard,
  getSavedStrategyMode,
  type StrategyMode,
} from '@/src/components/strategy';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

function StrategyContent() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const toast = useToast();
  const projects = useQuery(
    api.projects.projects.getProjectsByUser,
    user?._id ? { userId: user._id as unknown as Id<'users'> } : 'skip'
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const [generating, setGenerating] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [strategyMode, setStrategyMode] = useState<StrategyMode>('guided');

  // Load saved mode preference on mount
  useEffect(() => {
    setStrategyMode(getSavedStrategyMode());
  }, []);
  const rescheduleBrief = useMutation(api.content.quarterlyPlans.rescheduleBrief);
  const createKeywordsMutation = useMutation(api.seo.keywords.createKeywords);
  const generateClustersAction = useAction(api.seo.keywordActions.generateClusters);
  const generateKeywordsFromUrlAction = useAction(api.seo.keywordActions.generateKeywordsFromUrl);
  const generatePlanAction = useAction((api as any).content.quarterlyPlanActions.generatePlan);
  const projectIdForQuery =
    projectId !== null
      ? (() => {
          try {
            assertProjectId(projectId);
            return projectId as unknown as Id<'projects'>;
          } catch {
            return null;
          }
        })()
      : null;
  const strategyData = useQuery(
    api.seo.strategy.getStrategyByProject,
    projectIdForQuery ? { projectId: projectIdForQuery } : 'skip'
  );
  const clusters = strategyData?.clusters ?? [];
  const plan = strategyData?.plan ?? null;
  const strategyLoading = projectIdForQuery ? strategyData === undefined : false;

  // Calculate current stage based on data
  // Stage 1: Find Topics (no keywords/clusters)
  // Stage 2: Organize (has keywords, no clusters)
  // Stage 3: Plan (has clusters, no briefs)
  // Stage 4: Write (has briefs)
  const keywordCount = clusters.reduce(
    (acc: number, c: { keywords?: string[] }) => acc + (c.keywords?.length || 0),
    0
  );
  const clusterCount = clusters.length;
  const briefCount = plan?.briefs?.length || 0;
  const draftCount =
    plan?.briefs?.filter((b: any) => b.status === 'draft' || b.status === 'in_progress')?.length ||
    0;

  const currentStage = (() => {
    if (draftCount > 0) return 4;
    if (briefCount > 0) return 4;
    if (clusterCount > 0) return 3;
    if (keywordCount > 0) return 2;
    return 1;
  })();

  // Auto-discover keywords when project has 0 keywords
  const hasAttemptedAutoDiscovery = useRef(false);
  useEffect(() => {
    const shouldAutoDiscover =
      projectIdForQuery &&
      strategyData !== undefined &&
      keywordCount === 0 &&
      !hasAttemptedAutoDiscovery.current &&
      !generating;

    if (shouldAutoDiscover) {
      hasAttemptedAutoDiscovery.current = true;
      toast({
        title: 'Discovering keywords...',
        description: 'Finding relevant keywords based on your website.',
        status: 'info',
        duration: 3000,
      });

      generateKeywordsFromUrlAction({ projectId: projectIdForQuery })
        .then((result) => {
          if (result.success && result.count > 0) {
            toast({
              title: `Found ${result.count} keywords!`,
              status: 'success',
              duration: 3000,
            });
          }
        })
        .catch((err) => {
          console.warn('Auto-discovery failed:', err);
        });
    }
  }, [
    projectIdForQuery,
    strategyData,
    keywordCount,
    generating,
    generateKeywordsFromUrlAction,
    toast,
  ]);

  // Modals
  const {
    isOpen: isClusterModalOpen,
    onOpen: onClusterModalOpen,
    onClose: onClusterModalClose,
  } = useDisclosure();
  const {
    isOpen: isPlanModalOpen,
    onOpen: onPlanModalOpen,
    onClose: onPlanModalClose,
  } = useDisclosure();
  const {
    isOpen: isKeywordModalOpen,
    onOpen: onKeywordModalOpen,
    onClose: onKeywordModalClose,
  } = useDisclosure();

  // GSC connection status
  const gscConnection = useQuery(
    api.integrations.gscConnections.getGSCConnection,
    projectIdForQuery ? { projectId: projectIdForQuery } : 'skip'
  );

  const [planFormData, setPlanFormData] = useState({
    contentVelocity: 2,
    startDate: new Date().toISOString().split('T')[0],
    trafficGoal: '',
    leadsGoal: '',
  });

  useEffect(() => {
    if (authLoading) {
      return;
    }
    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }
    // Redirect to onboarding if not completed
    if (user && user.onboardingStatus !== 'completed') {
      router.replace('/onboarding');
    }
  }, [authLoading, isAuthenticated, router, user]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      return;
    }
    if (projects === undefined) {
      setProjectsLoading(true);
      return;
    }

    setProjectsLoading(false);

    // Check localStorage for project ID
    const storedId =
      typeof window !== 'undefined' ? window.localStorage.getItem('currentProjectId') : null;

    if (!projects || projects.length === 0) {
      // If localStorage has a project ID but query returns empty,
      // this might be a timing issue right after onboarding.
      // Try to use localStorage ID directly if valid
      if (storedId) {
        try {
          assertProjectId(storedId);
          console.log('[Strategy] Query empty but localStorage has project:', storedId);
          // Use localStorage project ID - Convex will validate on use
          setProjectId(storedId);
          return;
        } catch {
          // Invalid ID in localStorage, clear it
          window.localStorage.removeItem('currentProjectId');
        }
      }
      setProjectId(null);
      return;
    }

    let normalizedStored: string | null = storedId;
    if (storedId) {
      try {
        assertProjectId(storedId);
      } catch {
        window.localStorage.removeItem('currentProjectId');
        normalizedStored = null;
      }
    }

    const matchedProject = normalizedStored
      ? projects.find((proj: any) => (proj._id as unknown as string) === normalizedStored)
      : null;

    const nextProject = matchedProject ?? projects[0];
    const nextId = (nextProject._id as unknown as string) ?? nextProject._id.toString();

    if (nextId !== projectId) {
      setProjectId(nextId);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('currentProjectId', nextId);
      }
    }
  }, [projects, authLoading, isAuthenticated, projectId]);

  // Don't try to use projectId before it's loaded
  if ((projectsLoading && !projectId) || strategyLoading) {
    return (
      <Box
        minH="calc(100vh - 64px)"
        bg="brand.light"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.orange" />
          <Text color="gray.600">Loading your strategy...</Text>
        </VStack>
      </Box>
    );
  }

  if (!projectId) {
    return (
      <Container maxW="container.xl" py={12}>
        <VStack spacing={6}>
          <Heading size="xl">No project found</Heading>
          <Text>You need to create a project first.</Text>
          <Button bg="brand.orange" color="white" onClick={() => router.push('/onboarding')}>
            Create Project
          </Button>
        </VStack>
      </Container>
    );
  }

  const handleGenerateClusters = async () => {
    if (!projectId) {
      toast({
        title: 'Select a project first',
        status: 'warning',
      });
      return;
    }

    let typedProjectId: Id<'projects'>;
    try {
      typedProjectId = assertProjectId(projectId) as unknown as Id<'projects'>;
    } catch {
      toast({
        title: 'Invalid project identifier',
        status: 'error',
      });
      return;
    }

    setGenerating(true);
    try {
      const result = await generateClustersAction({
        projectId: typedProjectId,
        importFromGSC: true,
      });
      toast({
        title: 'Clusters generated',
        description: `Created ${result?.count ?? 0} keyword clusters`,
        status: 'success',
      });
      onClusterModalClose();
    } catch (error: any) {
      console.error('Failed to generate clusters', error);
      toast({
        title: 'Failed to generate clusters',
        description: error?.message || 'Please try again.',
        status: 'error',
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleGeneratePlan = async () => {
    if (!projectId) {
      toast({
        title: 'Select a project first',
        status: 'warning',
      });
      return;
    }

    if (clusters.length === 0) {
      toast({
        title: 'Add keyword clusters first',
        status: 'info',
      });
      return;
    }

    let typedProjectId: Id<'projects'>;
    try {
      typedProjectId = assertProjectId(projectId) as unknown as Id<'projects'>;
    } catch {
      toast({
        title: 'Invalid project identifier',
        status: 'error',
      });
      return;
    }

    setGenerating(true);
    try {
      const startDate = new Date(planFormData.startDate).getTime();
      const goalPayload: { traffic?: number; leads?: number; revenue?: number } = {};
      if (planFormData.trafficGoal) {
        goalPayload.traffic = parseInt(planFormData.trafficGoal, 10);
      }
      if (planFormData.leadsGoal) {
        goalPayload.leads = parseInt(planFormData.leadsGoal, 10);
      }

      await generatePlanAction({
        projectId: typedProjectId,
        contentVelocity: planFormData.contentVelocity,
        startDate,
        goals: Object.keys(goalPayload).length ? goalPayload : undefined,
      });

      toast({
        title: 'Plan generated',
        description: 'A 12-week calendar has been created for this project.',
        status: 'success',
      });
      onPlanModalClose();
    } catch (error: any) {
      console.error('Failed to generate plan', error);
      toast({
        title: 'Failed to generate plan',
        description: error?.message || 'Please try again.',
        status: 'error',
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleRescheduleBrief = async (briefId: string, newDate: number) => {
    try {
      await rescheduleBrief({
        briefId: briefId as Id<'briefs'>,
        newDate,
      });
    } catch (error) {
      console.error('Error rescheduling:', error);
    }
  };

  // Handler for importing keywords from GSC
  const handleImportFromGSC = async () => {
    if (!projectIdForQuery) return;

    setGenerating(true);
    try {
      const result = await generateClustersAction({
        projectId: projectIdForQuery,
        importFromGSC: true,
      });
      toast({
        title: '🎯 Keywords Imported!',
        description: `Imported keywords from Google Search Console`,
        status: 'success',
      });
    } catch (error: any) {
      console.error('Failed to import GSC keywords', error);
      toast({
        title: 'Import failed',
        description: error?.message || 'Please try again.',
        status: 'error',
      });
    } finally {
      setGenerating(false);
    }
  };

  // Handler for generating keywords from website URL using semantic library
  const handleGenerateFromUrl = async () => {
    if (!projectIdForQuery) return;

    setGenerating(true);
    try {
      const result = await generateKeywordsFromUrlAction({
        projectId: projectIdForQuery,
        limit: 30,
      });
      toast({
        title: '🎯 Keywords Generated!',
        description: `Discovered ${result.count} keywords based on your website`,
        status: 'success',
      });
    } catch (error: any) {
      console.error('Failed to generate keywords from URL', error);
      toast({
        title: 'Generation failed',
        description: error?.message || 'Please try again or add keywords manually.',
        status: 'error',
      });
    } finally {
      setGenerating(false);
    }
  };

  // Handler for adding keywords manually
  const handleAddKeywordsManually = async (keywords: string[]) => {
    if (!projectIdForQuery) return;

    setGenerating(true);
    try {
      await createKeywordsMutation({
        projectId: projectIdForQuery,
        keywords: keywords.map((k) => ({ keyword: k })),
      });
      toast({
        title: '🎯 Keywords Added!',
        description: `Added ${keywords.length} keywords to your strategy`,
        status: 'success',
      });
    } catch (error: any) {
      console.error('Failed to add keywords', error);
      toast({
        title: 'Failed to add keywords',
        description: error?.message || 'Please try again.',
        status: 'error',
      });
    } finally {
      setGenerating(false);
    }
  };

  // Handler for adding a single keyword from semantic search
  const handleAddKeyword = async (keyword: string) => {
    if (!projectIdForQuery) return;

    try {
      await createKeywordsMutation({
        projectId: projectIdForQuery,
        keywords: [{ keyword }],
      });
      toast({
        title: 'Keyword added',
        description: `Added "${keyword}" to your strategy`,
        status: 'success',
        duration: 2000,
      });
    } catch (error: any) {
      console.error('Failed to add keyword', error);
      toast({
        title: 'Failed to add keyword',
        description: error?.message || 'Please try again.',
        status: 'error',
      });
    }
  };

  // Get all existing keywords from clusters for the RelatedKeywords component
  const existingKeywords = clusters.flatMap((c: { keywords?: string[] }) => c.keywords || []);

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'transactional':
        return 'red';
      case 'commercial':
        return 'orange';
      case 'informational':
        return 'blue';
      case 'navigational':
        return 'gray';
      default:
        return 'gray';
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
          Please sign in to view strategy
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
          {/* Hero Header */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HStack justify="space-between" flexWrap="wrap" gap={4}>
              <VStack align="start" spacing={1}>
                <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">
                  SEO Strategy
                </Heading>
                <Text color="gray.600">AI-powered content planning and keyword insights</Text>
              </VStack>
              <StrategyModeToggle mode={strategyMode} onModeChange={setStrategyMode} />
            </HStack>
          </MotionBox>

          {/* DIY Mode: Dashboard Layout */}
          {strategyMode === 'diy' && (
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <StrategyDashboard
                projectId={projectId}
                keywordCount={keywordCount}
                clusterCount={clusterCount}
                planExists={plan !== null}
                briefCount={briefCount}
                draftCount={draftCount}
                onImportKeywords={onKeywordModalOpen}
                onAddKeyword={handleAddKeyword}
                existingKeywords={existingKeywords}
                onGenerateClusters={handleGenerateClusters}
                onGeneratePlan={onPlanModalOpen}
                onStartWizard={() => setStrategyMode('guided')}
                clusters={clusters.map((c: any) => ({
                  _id: c._id,
                  clusterName: c.clusterName,
                  keywords: c.keywords || [],
                  intent: c.intent || 'informational',
                  status: c.status || 'active',
                }))}
                briefs={(plan?.briefs || []).map((b: any) => ({
                  _id: b._id,
                  title: b.title,
                  status: b.status,
                  scheduledDate: b.scheduledDate,
                }))}
                isGenerating={generating}
              />
            </MotionBox>
          )}

          {/* Progress Stepper - Guided mode only */}
          {strategyMode === 'guided' && (
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <StrategyStepper currentStage={currentStage} />
            </MotionBox>
          )}

          {/* Next Step Guidance Card - Guided mode only */}
          {strategyMode === 'guided' && (
            <>
              <NextStepCard
                stage={currentStage}
                keywordCount={keywordCount}
                clusterCount={clusterCount}
                briefCount={briefCount}
                draftCount={draftCount}
                isLoading={generating}
                onAction={() => {
                  switch (currentStage) {
                    case 1:
                      // Open keyword source modal for GSC import or manual entry
                      onKeywordModalOpen();
                      break;
                    case 2:
                      onClusterModalOpen();
                      break;
                    case 3:
                      onPlanModalOpen();
                      break;
                    case 4:
                      // Navigate to first brief
                      if (plan?.briefs?.[0]?._id) {
                        window.location.href = `/content?briefId=${plan.briefs[0]._id}`;
                      }
                      break;
                  }
                }}
              />
              {/* Escape hatch - switch to DIY mode */}
              <SkipWizardLink onClick={() => setStrategyMode('diy')} />
            </>
          )}

          {/* Quick Actions - Always visible in DIY mode, or after stage 2 in guided */}
          {(strategyMode === 'diy' || currentStage >= 2) && (
            <HStack spacing={3} justify={strategyMode === 'diy' ? 'flex-start' : 'flex-end'}>
              <Tooltip
                label={keywordCount < 10 ? 'Add at least 10 keywords first' : ''}
                isDisabled={keywordCount >= 10}
                hasArrow
              >
                <Button
                  onClick={onClusterModalOpen}
                  variant={strategyMode === 'diy' ? 'solid' : 'outline'}
                  bg={strategyMode === 'diy' ? 'brand.orange' : undefined}
                  color={strategyMode === 'diy' ? 'white' : undefined}
                  _hover={strategyMode === 'diy' ? { bg: '#E8851A' } : undefined}
                  leftIcon={<Icon as={FiLayers} />}
                  isDisabled={keywordCount < 10}
                >
                  Generate Topic Clusters
                </Button>
              </Tooltip>
              <Tooltip
                label={clusterCount === 0 ? 'Generate topic clusters first' : ''}
                isDisabled={clusterCount > 0}
                hasArrow
              >
                <Button
                  bg="brand.orange"
                  color="white"
                  _hover={{ bg: '#E8851A' }}
                  onClick={onPlanModalOpen}
                  isDisabled={clusters.length === 0}
                  leftIcon={<Icon as={FiCalendar} />}
                >
                  Generate Quarterly Plan
                </Button>
              </Tooltip>
            </HStack>
          )}

          {/* Keywords Preview - Shows uploaded keywords */}
          {projectIdForQuery && keywordCount > 0 && (
            <KeywordsPreview projectId={projectIdForQuery} maxPreview={15} />
          )}

          {/* Hero Stats Grid */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              bg="white"
              borderRadius="xl"
              boxShadow="sm"
            >
              <CardBody>
                <HStack spacing={3}>
                  <Box p={3} borderRadius="lg" bg="purple.100">
                    <Icon as={FiLayers} color="purple.600" boxSize={5} />
                  </Box>
                  <Box>
                    <Text fontSize="2xl" fontWeight="bold">
                      {clusters.length}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Topic Clusters
                    </Text>
                  </Box>
                </HStack>
              </CardBody>
            </MotionCard>

            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              bg="white"
              borderRadius="xl"
              boxShadow="sm"
            >
              <CardBody>
                <HStack spacing={3}>
                  <Box p={3} borderRadius="lg" bg="blue.100">
                    <Icon as={FiFileText} color="blue.600" boxSize={5} />
                  </Box>
                  <Box>
                    <Text fontSize="2xl" fontWeight="bold">
                      {plan?.briefs?.length || 0}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Planned Briefs
                    </Text>
                  </Box>
                </HStack>
              </CardBody>
            </MotionCard>

            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              bg="white"
              borderRadius="xl"
              boxShadow="sm"
            >
              <CardBody>
                <HStack spacing={3}>
                  <Box p={3} borderRadius="lg" bg="green.100">
                    <Icon as={FiTrendingUp} color="green.600" boxSize={5} />
                  </Box>
                  <Box>
                    <Text fontSize="2xl" fontWeight="bold">
                      {plan?.contentVelocity || 0}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Posts/Week
                    </Text>
                  </Box>
                </HStack>
              </CardBody>
            </MotionCard>

            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              bg="white"
              borderRadius="xl"
              boxShadow="sm"
            >
              <CardBody>
                <HStack spacing={3}>
                  <Box p={3} borderRadius="lg" bg="yellow.100">
                    <Icon as={FiZap} color="yellow.600" boxSize={5} />
                  </Box>
                  <Box>
                    <Text fontSize="2xl" fontWeight="bold">
                      {clusters.reduce(
                        (acc: number, c: { keywords?: string[] }) =>
                          acc + (c.keywords?.length || 0),
                        0
                      )}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Target Keywords
                    </Text>
                  </Box>
                </HStack>
              </CardBody>
            </MotionCard>
          </SimpleGrid>

          {/* Insights Section */}
          {projectIdForQuery && (
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
                <Box>
                  <InsightList
                    projectId={projectIdForQuery}
                    type="cluster_suggestion"
                    title="Cluster Suggestions"
                    maxItems={4}
                    columns={1}
                  />
                </Box>
                <Box>
                  <InsightList
                    projectId={projectIdForQuery}
                    type="brief_suggestion"
                    title="📝 Brief Ideas"
                    maxItems={4}
                    columns={1}
                  />
                </Box>
              </Grid>
            </MotionBox>
          )}

          <Divider />

          {/* Plan Summary */}
          {plan && (
            <Card>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Heading size="md">Quarterly Plan Summary</Heading>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                    <Stat>
                      <StatLabel>Content Velocity</StatLabel>
                      <StatNumber>{plan.contentVelocity} posts/week</StatNumber>
                      <StatHelpText>
                        12 weeks = {plan.contentVelocity * 12} total posts
                      </StatHelpText>
                    </Stat>
                    {plan.goals.traffic && (
                      <Stat>
                        <StatLabel>Traffic Goal</StatLabel>
                        <StatNumber>{plan.goals.traffic.toLocaleString()}</StatNumber>
                        <StatHelpText>Estimated visitors</StatHelpText>
                      </Stat>
                    )}
                    {plan.goals.leads && (
                      <Stat>
                        <StatLabel>Leads Goal</StatLabel>
                        <StatNumber>{plan.goals.leads.toLocaleString()}</StatNumber>
                        <StatHelpText>Estimated conversions</StatHelpText>
                      </Stat>
                    )}
                  </Grid>
                  {plan.assumptions && (
                    <Text fontSize="sm" color="gray.600" fontStyle="italic">
                      {plan.assumptions}
                    </Text>
                  )}
                </VStack>
              </CardBody>
            </Card>
          )}

          {/* Calendar View */}
          {plan && plan.briefs && plan.briefs.length > 0 && (
            <Card>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Heading size="md">12-Week Content Calendar</Heading>
                  <Box overflowX="auto">
                    <Table size="sm">
                      <Thead>
                        <Tr>
                          <Th>Week</Th>
                          <Th>Date</Th>
                          <Th>Article Topic</Th>
                          <Th>Status</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {plan.briefs.map((brief: any, index: number) => (
                          <Tr key={brief._id || index}>
                            <Td>{brief.week || Math.floor(index / plan.contentVelocity) + 1}</Td>
                            <Td>{new Date(brief.scheduledDate).toLocaleDateString()}</Td>
                            <Td>{brief.title}</Td>
                            <Td>
                              <Badge colorScheme={brief.status === 'published' ? 'green' : 'gray'}>
                                {brief.status}
                              </Badge>
                            </Td>
                            <Td>
                              <Button
                                size="xs"
                                variant="outline"
                                onClick={() =>
                                  (window.location.href = `/content?briefId=${brief._id}`)
                                }
                              >
                                View Outline
                              </Button>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          )}

          {/* Clusters Grid */}
          {clusters.length > 0 && (
            <>
              <Heading size="lg">Target Topics (Keyword Clusters)</Heading>
              <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                gap={6}
              >
                {clusters.slice(0, 6).map((cluster: any, index: number) => (
                  <GridItem key={cluster._id || index}>
                    <Card>
                      <CardBody>
                        <VStack align="stretch" spacing={2}>
                          <HStack justify="space-between">
                            <Heading size="sm" noOfLines={2}>
                              {cluster.clusterName}
                            </Heading>
                            <Badge colorScheme={getIntentColor(cluster.intent)}>
                              {cluster.intent}
                            </Badge>
                          </HStack>
                          <Text fontSize="xs" color="gray.500">
                            Impact: {cluster.impactScore.toFixed(2)} | {cluster.keywords.length}{' '}
                            keywords
                          </Text>
                          <Button
                            size="xs"
                            variant="ghost"
                            colorScheme="blue"
                            leftIcon={<Icon as={FiSearch} boxSize={3} />}
                            onClick={() => {
                              const primaryKeyword = cluster.keywords?.[0] || cluster.clusterName;
                              window.location.href = `/competitors?keyword=${encodeURIComponent(primaryKeyword)}`;
                            }}
                          >
                            Analyze SERP
                          </Button>
                        </VStack>
                      </CardBody>
                    </Card>
                  </GridItem>
                ))}
              </Grid>
            </>
          )}

          {/* Generate Plan Modal */}
          <Modal isOpen={isPlanModalOpen} onClose={onPlanModalClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Generate Quarterly Plan</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <FormLabel>Content Velocity (posts per week)</FormLabel>
                    <NumberInput
                      value={planFormData.contentVelocity}
                      min={1}
                      max={7}
                      onChange={(_, val) =>
                        setPlanFormData({ ...planFormData, contentVelocity: val })
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Start Date</FormLabel>
                    <Input
                      type="date"
                      value={planFormData.startDate}
                      onChange={(e) =>
                        setPlanFormData({ ...planFormData, startDate: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Traffic Goal (optional)</FormLabel>
                    <Input
                      type="number"
                      placeholder="e.g., 10000"
                      value={planFormData.trafficGoal}
                      onChange={(e) =>
                        setPlanFormData({ ...planFormData, trafficGoal: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Leads Goal (optional)</FormLabel>
                    <Input
                      type="number"
                      placeholder="e.g., 100"
                      value={planFormData.leadsGoal}
                      onChange={(e) =>
                        setPlanFormData({ ...planFormData, leadsGoal: e.target.value })
                      }
                    />
                  </FormControl>
                  <Alert status="info" fontSize="sm">
                    <AlertIcon />
                    This will generate a 12-week calendar with {planFormData.contentVelocity *
                      12}{' '}
                    content briefs based on your keyword clusters.
                  </Alert>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onPlanModalClose}>
                  Cancel
                </Button>
                <Button
                  bg="brand.orange"
                  color="white"
                  onClick={handleGeneratePlan}
                  isLoading={generating}
                >
                  Generate Plan
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Generate Clusters Modal */}
          <Modal isOpen={isClusterModalOpen} onClose={onClusterModalClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Generate Topic Clusters</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack align="stretch" spacing={3}>
                  <Text fontWeight="bold">What are Topic Clusters?</Text>
                  <Text>
                    MartAI analyzes your keyword data to find groups of related terms that should
                    cover a single topic. This helps you build authority by covering a subject in
                    depth rather than targeting isolated keywords.
                  </Text>
                  <Alert status="info">
                    <AlertIcon />
                    This uses your current keywords and optionally imports fresh data from Google
                    Search Console.
                  </Alert>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClusterModalClose}>
                  Cancel
                </Button>
                <Button
                  bg="brand.orange"
                  color="white"
                  onClick={handleGenerateClusters}
                  isLoading={generating}
                >
                  Generate Topics
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Keyword Source Modal for Stage 1 */}
          <KeywordSourceModal
            isOpen={isKeywordModalOpen}
            onClose={onKeywordModalClose}
            hasGSC={!!gscConnection}
            gscSiteUrl={gscConnection?.siteUrl}
            onImportFromGSC={handleImportFromGSC}
            onAddManually={handleAddKeywordsManually}
            onGenerateFromUrl={handleGenerateFromUrl}
            isLoading={generating}
            existingKeywordCount={keywordCount}
          />
        </VStack>
      </Container>
    </Box>
  );
}

export default function StrategyPage() {
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
      <StrategyContent />
    </Suspense>
  );
}
