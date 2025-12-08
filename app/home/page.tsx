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
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useAuth } from '@/lib/useAuth';
import { FiLayers, FiFileText, FiTrendingUp, FiStar } from 'react-icons/fi';
import {
  MartCharacter,
  TutorialCard,
  ONBOARDING_STEPS,
  WHATS_NEXT_STEPS,
  TutorialStep,
} from '@/src/components/assistant';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Fetch user projects
  const projects = useQuery(
    api.projects.projects.getProjectsByUser,
    user?._id ? { userId: user._id } : 'skip'
  );

  // Fetch GA4 connection status
  const ga4Connection = useQuery(
    api.integrations.ga4Connections.getGA4Connection,
    selectedProjectId ? { projectId: selectedProjectId as Id<'projects'> } : 'skip'
  );

  // Fetch MR score
  const mrScore = useQuery(
    api.analytics.martaiRatingQueries.getLatestScore,
    selectedProjectId ? { projectId: selectedProjectId as Id<'projects'> } : 'skip'
  );

  // Fetch strategy data
  const strategyData = useQuery(
    api.seo.strategy.getStrategyByProject,
    selectedProjectId ? { projectId: selectedProjectId as Id<'projects'> } : 'skip'
  );

  const cardBg = useColorModeValue('white', 'gray.800');

  // Select first project on load
  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0]._id as string);
    }
  }, [projects, selectedProjectId]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <Box
        minH="calc(100vh - 64px)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="brand.light"
      >
        <Spinner size="xl" color="brand.orange" />
      </Box>
    );
  }

  // Determine user state for contextual content
  const hasGA4 = !!ga4Connection;
  const hasClusters = (strategyData?.clusters?.length ?? 0) > 0;
  const hasPlan = !!strategyData?.plan;
  const isNewUser = !hasGA4 && !hasClusters;

  // Build tutorial steps based on state
  const getSteps = (): TutorialStep[] => {
    if (isNewUser) {
      // Show onboarding steps with completion status
      return ONBOARDING_STEPS.map((step) => ({
        ...step,
        completed:
          (step.id === 'connect-ga4' && hasGA4) ||
          (step.id === 'generate-clusters' && hasClusters) ||
          (step.id === 'create-plan' && hasPlan),
      }));
    }
    // Show "What's Next" suggestions
    return WHATS_NEXT_STEPS;
  };

  const steps = getSteps();
  const userName = user?.name?.split(' ')[0] || 'there';

  // Get Mart's message based on state
  const getMartMessage = () => {
    if (isNewUser) {
      return `Hey ${userName}! 👋 Let's get your SEO strategy off the ground. Here's what we need to do first:`;
    }
    if (mrScore && mrScore.overall >= 70) {
      return `Nice work, ${userName}! 🎉 Your MR score is looking great. Here are some ways to keep the momentum:`;
    }
    return `Welcome back, ${userName}! Here's what I'd focus on next to boost your SEO:`;
  };

  // Quick stats
  const stats = [
    {
      icon: FiLayers,
      value: strategyData?.clusters?.length ?? 0,
      label: 'Clusters',
      color: 'purple',
    },
    {
      icon: FiFileText,
      value: strategyData?.plan?.briefs?.length ?? 0,
      label: 'Briefs',
      color: 'blue',
    },
    {
      icon: FiTrendingUp,
      value: mrScore?.overall ?? '—',
      label: 'MR Score',
      color: 'green',
    },
    {
      icon: FiStar,
      value: projects?.length ?? 0,
      label: 'Projects',
      color: 'orange',
    },
  ];

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container maxW="container.xl" py={{ base: 8, md: 12 }}>
        <VStack spacing={10} align="stretch">
          {/* Mart Character Hero */}
          <MotionBox initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} py={8}>
            <VStack spacing={6}>
              <MartCharacter message={getMartMessage()} size="lg" />
            </VStack>
          </MotionBox>

          {/* Quick Stats */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            {stats.map((stat, i) => (
              <MotionCard
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                bg={cardBg}
                borderRadius="xl"
                boxShadow="sm"
              >
                <CardBody>
                  <HStack spacing={3}>
                    <Box p={3} borderRadius="lg" bg={`${stat.color}.100`}>
                      <Icon as={stat.icon} color={`${stat.color}.600`} boxSize={5} />
                    </Box>
                    <Box>
                      <Text fontSize="2xl" fontWeight="bold">
                        {stat.value}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {stat.label}
                      </Text>
                    </Box>
                  </HStack>
                </CardBody>
              </MotionCard>
            ))}
          </SimpleGrid>

          {/* Section Header */}
          <HStack justify="space-between">
            <Heading size="md" color="gray.700">
              {isNewUser ? '🚀 Getting Started' : "✨ What's Next"}
            </Heading>
          </HStack>

          {/* Tutorial/Action Cards */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {steps.map((step, i) => (
              <TutorialCard key={step.id} step={step} index={i} />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
