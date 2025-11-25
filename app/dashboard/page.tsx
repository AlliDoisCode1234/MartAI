'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Box,
  Grid,
  GridItem,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  Spinner,
  Badge,
} from '@chakra-ui/react';
import { useAuth } from '@/lib/useAuth';
import { LoadingState } from '@/src/components/shared';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }

    loadDashboardData();
  }, [isAuthenticated, authLoading, router]);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.replace('/auth/login');
        return;
      }

      // Get projects
      const projectsResponse = await fetch('/api/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        const projects = projectsData.projects || [];

        if (projects.length > 0) {
          const firstProject = projects[0];
          const projectIdStr = typeof firstProject._id === 'string'
            ? firstProject._id
            : firstProject._id.toString();
          localStorage.setItem('currentProjectId', projectIdStr);
          setProject(firstProject);

          // Load strategy data for stats
          const strategyResponse = await fetch(`/api/strategy?projectId=${projectIdStr}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (strategyResponse.ok) {
            const strategyData = await strategyResponse.json();
            setStats(strategyData.strategy?.stats || null);
          }
        }
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setProjectsLoading(false);
    }
  };

  if (authLoading || projectsLoading) {
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
            onClick={() => router.push('/content')}
          >
            Content Calendar
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
}

