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
  StatHelpText,
  Button,
  Badge,
  Stack,
  Divider,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { useAuth } from '@/lib/useAuth';
import { LoadingState } from '@/src/components/shared';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { motion } from 'framer-motion';
import { 
  ArrowForwardIcon, 
  TimeIcon, 
  ViewIcon, 
  CopyIcon, 
  ExternalLinkIcon 
} from '@chakra-ui/icons';

const MotionGrid = motion(Grid);
const MotionCard = motion(Card);
const MotionBox = motion(Box);

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const projects = useQuery(
    api.projects.projects.getProjectsByUser,
    user?._id ? { userId: user._id as unknown as Id<'users'> } : 'skip',
  );
  const projectList = (projects ?? []) as Array<{ _id: Id<'projects'>; name?: string }>;

  const strategy = useQuery(
    api.seo.strategy.getStrategyByProject,
    selectedProjectId ? { projectId: selectedProjectId as Id<'projects'> } : 'skip',
  );
  const latestAiReport = useQuery(
    api.ai.reports.getLatestAiReport,
    selectedProjectId ? { projectId: selectedProjectId as Id<'projects'> } : 'skip',
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
  }, [projects, authLoading, isAuthenticated, selectedProjectId]);

  const project = useMemo(() => {
    if (!projectList || projectList.length === 0) return null;
    if (!selectedProjectId) return projectList[0];
    return projectList.find((p) => (p._id as string) === selectedProjectId) ?? projectList[0];
  }, [projectList, selectedProjectId]);

  const stats = strategy?.stats || null;
  const aiReport = latestAiReport ?? null;
  const loadingDashboard =
    authLoading ||
    projectsLoading ||
    (selectedProjectId !== null && strategy === undefined);

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
            Automate your SEO strategy with AI-powered insights. Create your first project to get started.
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
          bgGradient={heroGradient}
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
              <Heading size="lg" mb={2}>
                Welcome back, {user?.name || 'there'}! 👋
              </Heading>
              <Text fontSize="lg" opacity={0.9}>
                Here's what's happening with <b>{project.name}</b>
              </Text>
            </Box>
            <Button
              bg="whiteAlpha.200"
              _hover={{ bg: 'whiteAlpha.300' }}
              color="white"
              onClick={() => router.push('/strategy')}
              rightIcon={<ArrowForwardIcon />}
            >
              View Strategy
            </Button>
          </HStack>
        </MotionBox>

        {/* Stats Grid */}
        <MotionGrid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
          gap={6}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <MotionCard variants={itemVariants} variant="glass">
            <CardBody>
              <Stat>
                <HStack mb={2} color="brand.orange">
                  <Icon as={TimeIcon} boxSize={5} />
                  <StatLabel fontWeight="bold">Active Projects</StatLabel>
                </HStack>
                <StatNumber fontSize="3xl">1</StatNumber>
                <StatHelpText>
                  <Badge colorScheme="green" borderRadius="full" px={2}>
                    Active
                  </Badge>
                </StatHelpText>
              </Stat>
            </CardBody>
          </MotionCard>

          {stats && (
            <>
              <MotionCard variants={itemVariants} variant="glass">
                <CardBody>
                  <Stat>
                    <HStack mb={2} color="brand.teal">
                      <Icon as={ViewIcon} boxSize={5} />
                      <StatLabel fontWeight="bold">Keyword Clusters</StatLabel>
                    </HStack>
                    <StatNumber fontSize="3xl">{stats.clusterCount || 0}</StatNumber>
                    <StatHelpText>{stats.activeClusterCount || 0} active</StatHelpText>
                  </Stat>
                </CardBody>
              </MotionCard>

              <MotionCard variants={itemVariants} variant="glass">
                <CardBody>
                  <Stat>
                    <HStack mb={2} color="purple.500">
                      <Icon as={CopyIcon} boxSize={5} />
                      <StatLabel fontWeight="bold">Content Plan</StatLabel>
                    </HStack>
                    <StatNumber fontSize="3xl">{stats.planExists ? 'Active' : 'None'}</StatNumber>
                    <StatHelpText>{stats.briefCount || 0} briefs scheduled</StatHelpText>
                  </Stat>
                </CardBody>
              </MotionCard>

              <MotionCard variants={itemVariants} variant="glass">
                <CardBody>
                  <Stat>
                    <HStack mb={2} color="blue.500">
                      <Icon as={ExternalLinkIcon} boxSize={5} />
                      <StatLabel fontWeight="bold">Quick Actions</StatLabel>
                    </HStack>
                    <StatNumber>
                      <HStack spacing={2} mt={1}>
                        <Button
                          size="sm"
                          colorScheme="brand"
                          variant="solid"
                          onClick={() => router.push('/content')}
                        >
                          Content
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push('/analytics')}
                        >
                          Analytics
                        </Button>
                      </HStack>
                    </StatNumber>
                  </Stat>
                </CardBody>
              </MotionCard>
            </>
          )}
        </MotionGrid>

        {/* Intelligence Section */}
        <MotionCard
          variant="outline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          bg={cardBg}
          borderColor="gray.100"
          overflow="hidden"
        >
          <Box h="4px" bgGradient="linear(to-r, brand.orange, brand.teal)" />
          <CardBody>
            <HStack justify="space-between" mb={6} align="flex-start">
              <Box>
                <Heading size="md" mb={1}>MartAI Intelligence</Heading>
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
                    <StatNumber fontSize="2xl" fontWeight="bold">{aiReport.metrics?.coverageScore ?? '—'}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel color="gray.500">Organic Keywords</StatLabel>
                    <StatNumber fontSize="2xl" fontWeight="bold">{aiReport.metrics?.organicKeywords ?? '—'}</StatNumber>
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
                    <StatNumber fontSize="2xl" fontWeight="bold">{aiReport.confidence?.score ?? '—'}%</StatNumber>
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
