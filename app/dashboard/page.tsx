'use client';

/**
 * Dashboard Page (Executive Glance)
 *
 * Component Hierarchy:
 * App → Dashboard (this file)
 *
 * Quick 10-second overview of project health with prominent CTA to Studio.
 * Per Board Decision: Dashboard = glance, Studio = workspace.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  VStack,
  Grid,
  GridItem,
  HStack,
  Heading,
  Text,
  Box,
  Button,
  Card,
  CardBody,
  Icon,
  Badge,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useConvexAuth, useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import {
  FiArrowRight,
  FiEdit3,
  FiCalendar,
  FiTarget,
  FiTrendingUp,
  FiAlertCircle,
} from 'react-icons/fi';
import { useProject } from '@/lib/hooks';
import Link from 'next/link';

// Dashboard components
import { PRScoreWidget, WelcomeEmptyState, DashboardSkeleton } from '@/src/components/dashboard';
import { MartCharacter } from '@/src/components/assistant';
import { MetricCard } from '@/src/components/shared';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const user = useQuery(api.users.current);

  // Use enhanced useProject hook with autoSelect
  const {
    projectId,
    project,
    mrScore,
    strategyData,
    isLoading: projectLoading,
  } = useProject(null, { autoSelect: true });

  // Auto-generate PR if missing
  const generateScore = useMutation(api.analytics.martaiRatingQueries.generatePreliminaryScore);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    // If we have a project but no score, generate one
    if (projectId && mrScore === null && !hasGenerated && !projectLoading) {
      setHasGenerated(true);
      generateScore({ projectId: projectId as Id<'projects'> }).catch(console.error);
    }
  }, [projectId, mrScore, hasGenerated, projectLoading, generateScore]);

  // Auth redirect
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }
    // User must complete onboarding before accessing dashboard
    if (user && user.onboardingStatus !== 'completed') {
      router.replace('/onboarding');
      return;
    }
  }, [isAuthenticated, authLoading, user, router]);

  const loadingDashboard = authLoading || projectLoading;
  const userName = user?.name?.split(' ')[0] || 'there';
  const stats = strategyData?.stats ?? null;
  const clusterCount = strategyData?.clusters?.length ?? 0;
  const briefCount = stats?.briefCount ?? 0;

  if (loadingDashboard) return <DashboardSkeleton />;
  if (!project) return <WelcomeEmptyState />;

  // Calculate health indicators
  const hasStrategy = clusterCount > 0;
  const hasContent = briefCount > 0;
  const healthScore = mrScore?.overall ?? 0;
  const healthTier = mrScore?.tier ?? 'needs-work';

  // Quick actions for Studio
  const quickActions = [
    {
      label: 'Strategy',
      href: '/studio/strategy',
      icon: FiTarget,
      description: hasStrategy ? `${clusterCount} clusters` : 'Get started',
      color: hasStrategy ? 'green.500' : 'orange.500',
    },
    {
      label: 'Calendar',
      href: '/studio/calendar',
      icon: FiCalendar,
      description: hasContent ? `${briefCount} pieces scheduled` : 'Plan content',
      color: hasContent ? 'green.500' : 'orange.500',
    },
    {
      label: 'Create',
      href: '/studio/create',
      icon: FiEdit3,
      description: 'Write new content',
      color: 'blue.500',
    },
  ];

  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Hero - Greeting + Primary CTA */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HStack justify="space-between" align="start" flexWrap="wrap" gap={4}>
              <VStack align="start" spacing={1}>
                <Heading size="xl" fontFamily="heading" color="gray.800">
                  Welcome back, {userName}
                </Heading>
                <Text color="gray.600" fontSize="lg">
                  {project.name} • Quick overview
                </Text>
              </VStack>
              <Link href="/studio">
                <Button
                  size="lg"
                  bg="linear-gradient(135deg, #FF9D00 0%, #FF6B00 100%)"
                  color="white"
                  px={8}
                  rightIcon={<FiArrowRight />}
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                >
                  Open Content Studio
                </Button>
              </Link>
            </HStack>
          </MotionBox>

          {/* MART Quick Message */}
          <MartCharacter
            message={
              healthScore >= 70
                ? `Your SEO health is looking strong! Jump into the Studio to keep the momentum.`
                : `Let's boost your SEO performance. The Studio has everything you need.`
            }
            size="sm"
          />

          {/* Main Grid: Health Score + Quick Actions */}
          <Grid templateColumns={{ base: '1fr', lg: '300px 1fr' }} gap={6}>
            {/* Health Score Widget */}
            <GridItem>
              <PRScoreWidget
                score={
                  mrScore
                    ? {
                        overall: mrScore.overall,
                        tier: mrScore.tier,
                        visibility: mrScore.visibility ?? 0,
                        trafficHealth: mrScore.trafficHealth ?? 0,
                        ctrPerformance: mrScore.ctrPerformance ?? 0,
                        engagementQuality: mrScore.engagementQuality ?? 0,
                        quickWinPotential: mrScore.quickWinPotential ?? 0,
                        contentVelocity: mrScore.contentVelocity ?? 0,
                      }
                    : null
                }
                loading={mrScore === undefined}
              />
            </GridItem>

            {/* Quick Actions to Studio */}
            <GridItem>
              <VStack spacing={4} align="stretch">
                <Heading size="md" color="gray.700">
                  Jump to Studio
                </Heading>

                {quickActions.map((action, i) => (
                  <Link key={action.href} href={action.href} style={{ textDecoration: 'none' }}>
                    <MotionCard
                      variant="outline"
                      cursor="pointer"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      _hover={{
                        borderColor: 'orange.300',
                        transform: 'translateX(4px)',
                        boxShadow: 'sm',
                      }}
                    >
                      <CardBody py={4}>
                        <HStack>
                          <Box p={2} borderRadius="md" bg="orange.50" color="orange.500">
                            <Icon as={action.icon} boxSize={5} />
                          </Box>
                          <VStack align="start" spacing={0} flex={1}>
                            <Text fontWeight="semibold" color="gray.800">
                              {action.label}
                            </Text>
                            <Text fontSize="sm" color={action.color}>
                              {action.description}
                            </Text>
                          </VStack>
                          <Icon as={FiArrowRight} color="gray.400" />
                        </HStack>
                      </CardBody>
                    </MotionCard>
                  </Link>
                ))}
              </VStack>
            </GridItem>
          </Grid>

          {/* Urgent Items (if any) */}
          {!hasStrategy && (
            <MotionCard
              bg="orange.50"
              borderColor="orange.200"
              borderWidth={1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <CardBody>
                <HStack>
                  <Icon as={FiAlertCircle} color="orange.500" boxSize={6} />
                  <VStack align="start" spacing={0} flex={1}>
                    <Text fontWeight="semibold" color="orange.800">
                      Action Needed: Create Your SEO Strategy
                    </Text>
                    <Text fontSize="sm" color="orange.600">
                      Generate keyword clusters and content plan to start ranking.
                    </Text>
                  </VStack>
                  <Link href="/studio/strategy">
                    <Button size="sm" colorScheme="orange">
                      Go to Strategy
                    </Button>
                  </Link>
                </HStack>
              </CardBody>
            </MotionCard>
          )}

          {/* Quick Stats Row - Using shared MetricCard */}
          <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={4}>
            <MetricCard
              icon={FiTarget}
              label="Clusters"
              value={clusterCount}
              color="purple"
              theme="light"
              size="sm"
              delay={0.1}
            />
            <MetricCard
              icon={FiEdit3}
              label="Content Pieces"
              value={briefCount}
              color="blue"
              theme="light"
              size="sm"
              delay={0.2}
            />
            <MetricCard
              icon={FiTrendingUp}
              label="Keywords"
              value={strategyData?.stats?.keywordCount ?? 0}
              color="green"
              theme="light"
              size="sm"
              delay={0.3}
            />
            <MetricCard
              icon={FiTrendingUp}
              label="Health Score"
              value={`${healthScore}/100`}
              color="orange"
              theme="light"
              size="sm"
              delay={0.4}
            />
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}
