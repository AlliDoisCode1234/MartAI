'use client';

import { useState, useEffect, Suspense } from 'react';
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
} from 'react-icons/fi';
import { useAuth } from '@/lib/useAuth';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import type { Brief, ProjectId } from '@/types';
import { DraggableBriefList } from '@/src/components/DraggableBriefList';
import { assertProjectId } from '@/lib/typeGuards';
import { InsightList } from '@/src/components/insights';

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
  const rescheduleBrief = useMutation(api.content.quarterlyPlans.rescheduleBrief);
  const generateClustersAction = useAction(api.seo.keywordActions.generateClusters);
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
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      return;
    }
    if (projects === undefined) {
      setProjectsLoading(true);
      return;
    }

    setProjectsLoading(false);

    if (!projects || projects.length === 0) {
      setProjectId(null);
      return;
    }

    const storedId =
      typeof window !== 'undefined' ? window.localStorage.getItem('currentProjectId') : null;

    let normalizedStored: string | null = null;
    if (storedId) {
      try {
        assertProjectId(storedId);
        normalizedStored = storedId;
      } catch {
        window.localStorage.removeItem('currentProjectId');
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
              <HStack spacing={3}>
                <Button
                  onClick={onClusterModalOpen}
                  variant="outline"
                  leftIcon={<Icon as={FiLayers} />}
                >
                  Generate Topic Clusters
                </Button>
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
              </HStack>
            </HStack>
          </MotionBox>

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
                    title="🎯 Cluster Suggestions"
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
