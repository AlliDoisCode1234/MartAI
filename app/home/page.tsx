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
  Button,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useAuth } from '@/lib/useAuth';
import { TrendingUp, Star, Plus, Zap, Search } from 'lucide-react';
import {
  MartCharacter,
  MartLoader,
  TutorialCard,
  POST_ONBOARDING_STEPS,
  WHATS_NEXT_STEPS,
  TutorialStep,
} from '@/src/components/assistant';
import { KeywordsPreview, TopicsPreview } from '@/src/components/strategy';
import Link from 'next/link';

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

  // Fetch keywords count
  const keywords = useQuery(
    api.seo.keywords.getKeywordsByProject,
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
        <MartLoader message="Loading your dashboard..." />
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
    // Always show post-onboarding steps focused on strategy wins
    // (integrations can be added later from Settings)
    if (!hasClusters) {
      return POST_ONBOARDING_STEPS.map((step) => ({
        ...step,
        completed:
          (step.id === 'view-keywords' && (keywords?.length ?? 0) > 0) ||
          (step.id === 'create-clusters' && hasClusters),
      }));
    }
    // Show "What's Next" suggestions once they have clusters
    return WHATS_NEXT_STEPS;
  };

  const steps = getSteps();
  const userName = user?.name?.split(' ')[0] || 'there';

  // Get Mart's message based on state
  const getMartMessage = () => {
    if (isNewUser) {
      return `Hey ${userName}! Let's get your SEO strategy off the ground. Here's what we need to do first:`;
    }
    if (mrScore && mrScore.overall >= 70) {
      return `Nice work, ${userName}! Your MR score is looking great. Here are some ways to keep the momentum:`;
    }
    return `Welcome back, ${userName}! Here's what I'd focus on next to boost your SEO:`;
  };

  // Quick stats - focused on MR and actionable data
  const stats = [
    {
      icon: TrendingUp,
      value: mrScore?.overall ?? '—',
      label: 'MR Score',
      color: 'green',
      tooltip:
        'MartAI Rating measures your SEO health. Increase it by: connecting GA4/GSC, adding keywords, creating topic clusters, and publishing optimized content.',
    },
    {
      icon: Search,
      value: keywords?.length ?? 0,
      label: 'Keywords',
      color: 'purple',
      tooltip: 'Keywords discovered for your website. More keywords = more opportunities to rank.',
    },
    {
      icon: Star,
      value: projects?.length ?? 0,
      label: 'Projects',
      color: 'orange',
      tooltip: null,
    },
  ];

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container maxW="container.xl" py={{ base: 8, md: 12 }}>
        <VStack spacing={10} align="stretch">
          {/* Centered Mart Character */}
          <MotionBox initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} py={4}>
            <VStack spacing={4}>
              <MartCharacter message={getMartMessage()} size="lg" />
            </VStack>
          </MotionBox>

          {/* Quick Stats */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
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
                  <Tooltip
                    label={stat.tooltip}
                    isDisabled={!stat.tooltip}
                    hasArrow
                    placement="top"
                    bg="gray.700"
                    px={4}
                    py={2}
                    borderRadius="md"
                  >
                    <HStack spacing={3} cursor={stat.tooltip ? 'help' : 'default'}>
                      <Box p={3} borderRadius="lg" bg={`${stat.color}.100`}>
                        <Icon as={stat.icon} color={`${stat.color}.600`} boxSize={5} />
                      </Box>
                      <Box>
                        <Text fontSize="2xl" fontWeight="bold">
                          {stat.value}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {stat.label}
                          {stat.tooltip && (
                            <Text as="span" color="blue.500" ml={1}>
                              ⓘ
                            </Text>
                          )}
                        </Text>
                      </Box>
                    </HStack>
                  </Tooltip>
                </CardBody>
              </MotionCard>
            ))}
          </SimpleGrid>

          {/* Keywords Preview - Show user their discovered keywords */}
          {selectedProjectId && (
            <KeywordsPreview projectId={selectedProjectId as Id<'projects'>} maxPreview={10} />
          )}

          {/* Topics Preview - Show user their topic clusters */}
          {selectedProjectId && (
            <TopicsPreview projectId={selectedProjectId as Id<'projects'>} maxPreview={5} />
          )}

          {/* Section Header */}
          <HStack justify="space-between">
            <Heading size="md" color="gray.700">
              <HStack spacing={2}>
                <Icon as={isNewUser ? TrendingUp : Zap} />
                <Text>{isNewUser ? 'Getting Started' : "What's Next"}</Text>
              </HStack>
            </Heading>
            <Link href="/projects/new">
              <Button colorScheme="orange" leftIcon={<Plus size={16} />} size="sm">
                New Project
              </Button>
            </Link>
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
