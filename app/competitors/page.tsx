'use client';

/**
 * Competitors Page
 *
 * Component Hierarchy:
 * App → CompetitorsPage → SerpAnalyzer
 *
 * Dedicated page for SERP analysis and competitor research.
 * Limit: 1 SERP per project (upsell for more).
 */

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  HStack,
  Icon,
  SimpleGrid,
  Button,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiUsers, FiSearch, FiTrendingUp, FiLock } from 'react-icons/fi';
import { useAuth } from '@/lib/useAuth';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { SerpAnalyzer } from '@/src/components/SerpAnalyzer';
import { assertProjectId } from '@/lib/typeGuards';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

function CompetitorsContent() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const router = useRouter();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const projects = useQuery(
    api.projects.projects.getProjectsByUser,
    user?._id ? { userId: user._id as unknown as Id<'users'> } : 'skip'
  );

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

  const limitCheck = useQuery(
    api.seo.serpAnalysis.canAnalyze,
    projectIdForQuery ? { projectId: projectIdForQuery } : 'skip'
  );

  const existingAnalyses = useQuery(
    api.seo.serpAnalysis.getByProject,
    projectIdForQuery ? { projectId: projectIdForQuery } : 'skip'
  );

  const cardBg = useColorModeValue('white', 'gray.800');

  // Auth redirect
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Project loading
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
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

  // Loading state
  if (projectsLoading && !projectId) {
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
          <Text color="gray.600">Loading competitors...</Text>
        </VStack>
      </Box>
    );
  }

  // No project
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

  // Not authenticated
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
          Please sign in to view competitors
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
            <VStack align="start" spacing={1}>
              <HStack>
                <Icon as={FiUsers} boxSize={8} color="brand.orange" />
                <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">
                  Competitor Research
                </Heading>
              </HStack>
              <Text color="gray.600">Discover who's ranking for your target keywords</Text>
            </VStack>
          </MotionBox>

          {/* Stats Cards */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              bg={cardBg}
              borderRadius="xl"
              boxShadow="sm"
            >
              <CardBody>
                <HStack spacing={3}>
                  <Box p={3} borderRadius="lg" bg="blue.100">
                    <Icon as={FiSearch} color="blue.600" boxSize={5} />
                  </Box>
                  <Box>
                    <Text fontSize="2xl" fontWeight="bold">
                      {existingAnalyses?.length || 0}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Keywords Analyzed
                    </Text>
                  </Box>
                </HStack>
              </CardBody>
            </MotionCard>

            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              bg={cardBg}
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
                      {existingAnalyses?.[0]?.results?.length || 0}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Competitors Found
                    </Text>
                  </Box>
                </HStack>
              </CardBody>
            </MotionCard>

            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              bg={cardBg}
              borderRadius="xl"
              boxShadow="sm"
            >
              <CardBody>
                <HStack spacing={3}>
                  <Box
                    p={3}
                    borderRadius="lg"
                    bg={limitCheck?.canAnalyze ? 'purple.100' : 'orange.100'}
                  >
                    <Icon
                      as={limitCheck?.canAnalyze ? FiSearch : FiLock}
                      color={limitCheck?.canAnalyze ? 'purple.600' : 'orange.600'}
                      boxSize={5}
                    />
                  </Box>
                  <Box>
                    <Text fontSize="2xl" fontWeight="bold">
                      {limitCheck?.remaining || 0}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Analyses Remaining
                    </Text>
                  </Box>
                </HStack>
              </CardBody>
            </MotionCard>
          </SimpleGrid>

          {/* SERP Analyzer */}
          {projectIdForQuery && (
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <SerpAnalyzer projectId={projectIdForQuery} />
            </MotionBox>
          )}

          {/* Upsell Card */}
          {limitCheck && !limitCheck.canAnalyze && (
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              bg="linear-gradient(135deg, #F7941E 0%, #E0183C 100%)"
              borderRadius="xl"
              color="white"
            >
              <CardBody>
                <VStack spacing={4} align="start">
                  <HStack>
                    <Icon as={FiLock} boxSize={6} />
                    <Heading size="md">Unlock Unlimited SERP Analysis</Heading>
                  </HStack>
                  <Text>
                    Upgrade to Growth or Pro to analyze unlimited keywords and discover more
                    competitor insights.
                  </Text>
                  <Button
                    bg="white"
                    color="brand.orange"
                    _hover={{ bg: 'gray.100' }}
                    onClick={() => router.push('/pricing')}
                  >
                    View Plans
                  </Button>
                </VStack>
              </CardBody>
            </MotionCard>
          )}
        </VStack>
      </Container>
    </Box>
  );
}

export default function CompetitorsPage() {
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
      <CompetitorsContent />
    </Suspense>
  );
}
