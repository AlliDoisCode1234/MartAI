'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Box,
  Grid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  Button,
  Badge,
  Stack,
  Divider,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
  useToast,
} from '@chakra-ui/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import { useConvexAuth, useQuery } from 'convex/react';
import { LoadingState } from '@/src/components/shared';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { motion } from 'framer-motion';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { FiTrendingUp, FiTarget, FiZap, FiActivity } from 'react-icons/fi';
import {
  StatCard,
  TrafficChart,
  KeywordGrowthChart,
  TopKeywordsTable,
  MartAIRatingWidget,
} from '@/src/components/dashboard';
import { IntegrationPromptBanner } from '@/src/components/analytics/IntegrationPromptBanner';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionGrid = motion(Grid);

// Mock data for charts
const trafficData = [
  { name: 'Jan', traffic: 4000, keywords: 240 },
  { name: 'Feb', traffic: 3000, keywords: 221 },
  { name: 'Mar', traffic: 5000, keywords: 290 },
  { name: 'Apr', traffic: 7800, keywords: 350 },
  { name: 'May', traffic: 8900, keywords: 410 },
  { name: 'Jun', traffic: 9500, keywords: 480 },
];

const keywordPerformanceData = [
  { keyword: 'SEO automation', position: 3, volume: 2400, trend: 'up' as const },
  { keyword: 'AI content writing', position: 7, volume: 1800, trend: 'up' as const },
  { keyword: 'keyword research tool', position: 12, volume: 3200, trend: 'down' as const },
  { keyword: 'content marketing', position: 5, volume: 5100, trend: 'up' as const },
  { keyword: 'SEO strategy', position: 9, volume: 2900, trend: 'stable' as const },
];

export default function DashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const user = useQuery(api.users.current);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Separate state for the create project modal or logic if it was here.
  // Assuming the issue was in error handling which might be in a different component or handled globally?
  // Wait, the previous edit (Step 574) was targeting `createProject` error handling.
  // But this file `app/dashboard/page.tsx` seems to just be the Dashboard *view*.
  // Does it contain the `createProject` logic?
  // Looking at the file content in Step 577, it strictly renders the dashboard.
  // It checks `if (!project)` and shows a "Create Your First Project" button that redirects to `/onboarding`.
  // So the `createProject` logic is likely in `/onboarding` or a separate component.
  // The error handling code I tried to insert in Step 574:
  // `toast({ title: "Project created" ... })`
  // `setIsNewProjectOpen(false)`
  // This implies there is a `setIsNewProjectOpen` state and a `createProject` call IN THIS FILE.
  // BUT the file content found in Step 577 DOES NOT show `setIsNewProjectOpen` or `createProject` call.
  // It shows a "Create Your First Project" button that does `router.push('/onboarding')`.

  // AHA! I might have been trying to edit the WRONG FILE in Step 574?
  // Or the file content in 577 (Total Lines: 542) was missing the Modal part?
  // Let's look closely at 577. It ends with the `Intelligence Section` card.
  // It does NOT seem to have a "New Project" modal.

  // If I inserted code into a file that didn't match the context (lines 157-167), that explains why it broke.
  // In Step 577, line 157 is inside `heroGradient` definition.
  // So my Step 574 edit was completely hallucinated context-wise or I assumed the file had different content.

  // Corrective Action:
  // 1. Restore this file to its clean state (from Step 577).
  // 2. Find where `createProject` is ACTUALLY called. It might be in `app/onboarding/page.tsx` or a component like `AddProjectModal`.

  const projects = useQuery(
    api.projects.projects.getProjectsByUser,
    user?._id ? { userId: user._id } : 'skip'
  );
  const projectList = (projects ?? []) as Array<{ _id: Id<'projects'>; name?: string }>;

  const strategy = useQuery(
    api.seo.strategy.getStrategyByProject,
    selectedProjectId ? { projectId: selectedProjectId as Id<'projects'> } : 'skip'
  );
  const latestAiReport = useQuery(
    api.ai.reports.getLatestAiReport,
    selectedProjectId ? { projectId: selectedProjectId as Id<'projects'> } : 'skip'
  );

  // Check if GA4 is connected for this project
  const ga4Connection = useQuery(
    api.integrations.ga4Connections.getGA4Connection,
    selectedProjectId ? { projectId: selectedProjectId as Id<'projects'> } : 'skip'
  );

  // Get MartAI Rating score
  const mrScore = useQuery(
    api.analytics.martaiRatingQueries.getLatestScore,
    selectedProjectId ? { projectId: selectedProjectId as Id<'projects'> } : 'skip'
  );

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    if (projects === undefined) {
      setProjectsLoading(true);
      return;
    }

    setProjectsLoading(false);

    if (!projectList || projectList.length === 0) {
      setSelectedProjectId(null);
      return;
    }

    const storedId =
      typeof window !== 'undefined' ? localStorage.getItem('currentProjectId') : null;
    const matchedProject = storedId
      ? projectList.find((p) => (p._id as string) === storedId)
      : null;

    const nextProject = matchedProject ?? projectList[0];

    const nextId = nextProject._id as string;

    if (!selectedProjectId || nextId !== selectedProjectId) {
      setSelectedProjectId(nextId);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('currentProjectId', nextId);
    }
  }, [projects, authLoading, isAuthenticated, selectedProjectId, projectList]);

  const project = useMemo(() => {
    if (!projectList || projectList.length === 0) return null;
    if (!selectedProjectId) return projectList[0];
    return projectList.find((p) => (p._id as string) === selectedProjectId) ?? projectList[0];
  }, [projectList, selectedProjectId]);

  const stats = strategy?.stats ?? null;
  const aiReport = latestAiReport ?? null;
  const loadingDashboard =
    authLoading || projectsLoading || (selectedProjectId !== null && strategy === undefined);

  const cardBg = useColorModeValue('white', 'gray.800');
  const heroGradient = useColorModeValue(
    'linear(to-r, brand.orange, brand.red)',
    'linear(to-r, brand.orange, brand.red)'
  );

  if (loadingDashboard) {
    return <LoadingState message="Loading dashboard..." fullPage />;
  }

  if (!project) {
    return (
      <Container maxW="container.xl" py={20}>
        <VStack spacing={8} textAlign="center">
          <Heading size="2xl" bgGradient={heroGradient} bgClip="text">
            Welcome to MartAI
          </Heading>
          <Text fontSize="xl" color="gray.500" maxW="lg">
            Automate your SEO strategy with AI-powered insights. Create your first project to get
            started.
          </Text>
          <Button
            size="lg"
            variant="solid"
            colorScheme="brand"
            rightIcon={<ArrowForwardIcon />}
            onClick={() => router.push('/onboarding')}
          >
            Create Your First Project
          </Button>
        </VStack>
      </Container>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Hero Section */}
        <MotionBox
          bg="brand.orange"
          bgGradient="linear(to-r, #FF6B35, #F7931E)"
          borderRadius="2xl"
          p={8}
          color="white"
          boxShadow="xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          // @ts-ignore
          transition={{ duration: 0.5 }}
        >
          <HStack justify="space-between" align="center" wrap="wrap" spacing={4}>
            <Box>
              <Heading size="lg" mb={2} color="white">
                Welcome back, {user?.name ?? 'there'}! 👋
              </Heading>
              <Text fontSize="lg" color="whiteAlpha.900">
                Here's what's happening with <b>{project.name}</b>
              </Text>
            </Box>
            <Button
              bg="whiteAlpha.300"
              _hover={{ bg: 'whiteAlpha.400' }}
              color="white"
              onClick={() => router.push('/strategy')}
              rightIcon={<ArrowForwardIcon />}
            >
              View Strategy
            </Button>
          </HStack>
        </MotionBox>

        {/* Integration Prompt Banner - shows when GA4 not connected */}
        <IntegrationPromptBanner
          isConnected={!!ga4Connection}
          projectId={selectedProjectId || undefined}
        />

        {/* MartAI Rating + Stats Grid - Hero Row */}
        <Grid templateColumns={{ base: '1fr', lg: '300px 1fr' }} gap={6}>
          {/* MartAI Rating Widget - Hero */}
          <MartAIRatingWidget
            score={
              mrScore
                ? {
                    overall: mrScore.overall,
                    tier: mrScore.tier,
                    visibility: mrScore.visibility,
                    trafficHealth: mrScore.trafficHealth,
                    ctrPerformance: mrScore.ctrPerformance,
                    engagementQuality: mrScore.engagementQuality,
                    quickWinPotential: mrScore.quickWinPotential,
                    contentVelocity: mrScore.contentVelocity,
                  }
                : null
            }
            loading={mrScore === undefined}
          />

          {/* Stats Grid */}
          <MotionGrid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
            gap={6}
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <StatCard
              label="Organic Traffic"
              value="9.5K"
              trend="increase"
              trendValue="23.5% vs last month"
              icon={FiTrendingUp}
              iconColor="orange.500"
              iconBg="orange.50"
            />
            <StatCard
              label="Ranking Keywords"
              value="480"
              trend="increase"
              trendValue="70 new this month"
              icon={FiTarget}
              iconColor="blue.500"
              iconBg="blue.50"
            />
            <StatCard
              label="Content Published"
              value={stats?.briefCount || 0}
              helpText={stats?.planExists ? 'Plan active' : 'No plan'}
              icon={FiZap}
              iconColor="purple.500"
              iconBg="purple.50"
            />
            <StatCard
              label="Avg. Position"
              value="7.2"
              trend="increase"
              trendValue="Improved 2.3 spots"
              icon={FiActivity}
              iconColor="green.500"
              iconBg="green.50"
            />
          </MotionGrid>
        </Grid>

        {/* Charts Section */}
        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
          {/* Traffic Trend Chart */}
          <MotionCard
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            bg={cardBg}
            boxShadow="lg"
            borderRadius="xl"
          >
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Heading size="md" mb={1}>
                    Traffic Trend
                  </Heading>
                  <Text color="gray.500" fontSize="sm">
                    Last 6 months organic traffic growth
                  </Text>
                </Box>
                <Box h="250px">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trafficData}>
                      <defs>
                        <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#888" fontSize={12} />
                      <YAxis stroke="#888" fontSize={12} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="traffic"
                        stroke="#FF6B35"
                        fillOpacity={1}
                        fill="url(#colorTraffic)"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </VStack>
            </CardBody>
          </MotionCard>

          {/* Keyword Growth Chart */}
          <MotionCard
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            bg={cardBg}
            boxShadow="lg"
            borderRadius="xl"
          >
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Heading size="md" mb={1}>
                    Keyword Growth
                  </Heading>
                  <Text color="gray.500" fontSize="sm">
                    Ranking keywords over time
                  </Text>
                </Box>
                <Box h="250px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trafficData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#888" fontSize={12} />
                      <YAxis stroke="#888" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="keywords" fill="#4299E1" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </VStack>
            </CardBody>
          </MotionCard>
        </Grid>

        {/* Top Keywords Section */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          bg={cardBg}
          boxShadow="lg"
          borderRadius="xl"
        >
          <CardBody>
            <HStack justify="space-between" mb={6}>
              <Box>
                <Heading size="md" mb={1}>
                  Top Performing Keywords
                </Heading>
                <Text color="gray.500" fontSize="sm">
                  Your best ranking keywords and their performance
                </Text>
              </Box>
              <Button size="sm" variant="outline" onClick={() => router.push('/keywords')}>
                View All
              </Button>
            </HStack>
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Keyword</Th>
                    <Th isNumeric>Position</Th>
                    <Th isNumeric>Search Volume</Th>
                    <Th>Trend</Th>
                    <Th>Performance</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {keywordPerformanceData.map((kw, index) => (
                    <Tr key={index} _hover={{ bg: 'gray.50' }}>
                      <Td fontWeight="medium">{kw.keyword}</Td>
                      <Td isNumeric>
                        <Badge
                          colorScheme={
                            kw.position <= 5 ? 'green' : kw.position <= 10 ? 'yellow' : 'gray'
                          }
                        >
                          #{kw.position}
                        </Badge>
                      </Td>
                      <Td isNumeric>{kw.volume.toLocaleString()}/mo</Td>
                      <Td>
                        <Badge
                          colorScheme={
                            kw.trend === 'up' ? 'green' : kw.trend === 'down' ? 'red' : 'gray'
                          }
                        >
                          {kw.trend === 'up' ? '↑' : kw.trend === 'down' ? '↓' : '→'}
                        </Badge>
                      </Td>
                      <Td>
                        <Progress
                          value={kw.position <= 3 ? 90 : kw.position <= 10 ? 60 : 30}
                          size="sm"
                          colorScheme={
                            kw.position <= 5 ? 'green' : kw.position <= 10 ? 'yellow' : 'gray'
                          }
                          borderRadius="full"
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </CardBody>
        </MotionCard>

        {/* Intelligence Section */}
        <MotionCard
          variant="outline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          bg={cardBg}
          borderColor="gray.100"
          overflow="hidden"
          boxShadow="lg"
          borderRadius="xl"
        >
          <Box h="4px" bgGradient="linear(to-r, brand.orange, brand.teal)" />
          <CardBody>
            <HStack justify="space-between" mb={6} align="flex-start">
              <Box>
                <Heading size="md" mb={1}>
                  MartAI Intelligence
                </Heading>
                <Text color="gray.500" fontSize="sm">
                  Latest automated crawl & keyword intelligence for this project.
                </Text>
              </Box>
              <Badge
                colorScheme={aiReport?.status === 'completed' ? 'green' : 'orange'}
                variant="subtle"
                borderRadius="full"
                px={3}
                py={1}
              >
                {aiReport?.status ?? 'pending'}
              </Badge>
            </HStack>

            {aiReport ? (
              <Stack spacing={6}>
                {aiReport.summary && (
                  <Text color="gray.700" fontSize="md" lineHeight="tall">
                    {aiReport.summary}
                  </Text>
                )}
                <Divider />
                <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={6}>
                  <Stat>
                    <StatLabel color="gray.500">Coverage Score</StatLabel>
                    <StatNumber fontSize="2xl" fontWeight="bold">
                      {aiReport.metrics?.coverageScore ?? '—'}
                    </StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel color="gray.500">Organic Keywords</StatLabel>
                    <StatNumber fontSize="2xl" fontWeight="bold">
                      {aiReport.metrics?.organicKeywords ?? '—'}
                    </StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel color="gray.500">Traffic Estimate</StatLabel>
                    <StatNumber fontSize="2xl" fontWeight="bold">
                      {aiReport.metrics?.trafficEstimate
                        ? aiReport.metrics.trafficEstimate.toLocaleString()
                        : '—'}
                    </StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel color="gray.500">Confidence</StatLabel>
                    <StatNumber fontSize="2xl" fontWeight="bold">
                      {aiReport.confidence?.score ?? '—'}%
                    </StatNumber>
                  </Stat>
                </Grid>
                {aiReport.dataSources?.length ? (
                  <Text fontSize="xs" color="gray.400" mt={2}>
                    Data sources: {aiReport.dataSources.join(', ')}
                  </Text>
                ) : null}
              </Stack>
            ) : (
              <Stack spacing={4} align="center" py={8} bg="gray.50" borderRadius="lg">
                <Text color="gray.500">
                  No AI intelligence report yet. Run an analysis to populate insights.
                </Text>
                <Button
                  size="sm"
                  colorScheme="brand"
                  variant="outline"
                  onClick={() => router.push('/admin')}
                >
                  Run Analysis
                </Button>
              </Stack>
            )}
          </CardBody>
        </MotionCard>
      </VStack>
    </Container>
  );
}
