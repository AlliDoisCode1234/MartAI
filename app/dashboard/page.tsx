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
} from '@chakra-ui/react';
import { useAuth } from '@/lib/useAuth';
import { LoadingState } from '@/src/components/shared';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

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

  if (loadingDashboard) {
    return <LoadingState message="Loading dashboard..." fullPage />;
  }

  if (!project) {
    return (
      <Container maxW="container.xl" py={12}>
        <VStack spacing={6}>
          <Heading size="xl">Welcome to MartAI</Heading>
          <Text>You need to create a project to get started.</Text>
          <Button
            bg="brand.orange"
            color="white"
            onClick={() => router.push('/onboarding')}
          >
            Create Your First Project
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="xl" mb={2}>
            Welcome back, {user?.name || 'there'}! 👋
          </Heading>
          <Text color="gray.600">
            Here's what's happening with your SEO projects
          </Text>
        </Box>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Active Projects</StatLabel>
                <StatNumber>1</StatNumber>
                <StatHelpText>
                  <Badge colorScheme="green">{project.name}</Badge>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          {stats && (
            <>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Keyword Clusters</StatLabel>
                    <StatNumber>{stats.clusterCount || 0}</StatNumber>
                    <StatHelpText>{stats.activeClusterCount || 0} active</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Content Plan</StatLabel>
                    <StatNumber>{stats.planExists ? 'Active' : 'None'}</StatNumber>
                    <StatHelpText>{stats.briefCount || 0} briefs scheduled</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Quick Actions</StatLabel>
                    <StatNumber>
                      <VStack spacing={2} align="stretch">
                        <Button
                          size="sm"
                          bg="brand.orange"
                          color="white"
                          onClick={() => router.push('/strategy')}
                        >
                          View Strategy
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push('/content')}
                        >
                          Manage Content
                        </Button>
                      </VStack>
                    </StatNumber>
                  </Stat>
                </CardBody>
              </Card>
            </>
          )}
        </Grid>

        <Card variant="outline">
          <CardBody>
            <HStack justify="space-between" mb={4} align="flex-start">
              <Box>
                <Heading size="md">MartAI Intelligence</Heading>
                <Text color="gray.600" fontSize="sm">
                  Latest automated crawl & keyword intelligence for this project.
                </Text>
              </Box>
              <Badge colorScheme={aiReport?.status === 'completed' ? 'green' : 'orange'}>
                {aiReport?.status ?? 'pending'}
              </Badge>
            </HStack>

            {aiReport ? (
              <Stack spacing={4}>
                {aiReport.summary && (
                  <Text color="gray.700">{aiReport.summary}</Text>
                )}
                <Divider />
                <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={4}>
                  <Stat>
                    <StatLabel>Coverage Score</StatLabel>
                    <StatNumber>{aiReport.metrics?.coverageScore ?? '—'}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Organic Keywords</StatLabel>
                    <StatNumber>{aiReport.metrics?.organicKeywords ?? '—'}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Traffic Estimate</StatLabel>
                    <StatNumber>
                      {aiReport.metrics?.trafficEstimate
                        ? aiReport.metrics.trafficEstimate.toLocaleString()
                        : '—'}
                    </StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Confidence</StatLabel>
                    <StatNumber>{aiReport.confidence?.score ?? '—'}%</StatNumber>
                  </Stat>
                </Grid>
                {aiReport.dataSources?.length ? (
                  <Text fontSize="sm" color="gray.500">
                    Data sources: {aiReport.dataSources.join(', ')}
                  </Text>
                ) : null}
              </Stack>
            ) : (
              <Stack spacing={3}>
                <Text color="gray.600">
                  No AI intelligence report yet. Run an analysis from the Admin portal to populate insights here.
                </Text>
                <HStack>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push('/admin')}
                  >
                    Go to Admin
                  </Button>
                </HStack>
              </Stack>
            )}
          </CardBody>
        </Card>

        <HStack spacing={4}>
          <Button
            bg="brand.orange"
            color="white"
            onClick={() => router.push('/strategy')}
          >
            Go to Strategy
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/analytics')}
          >
            View Analytics
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/intelligence')}
          >
            AI Insights
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/content')}
          >
            Content Calendar
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
}

