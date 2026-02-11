'use client';

/**
 * Dashboard Page - Premium Dark Glassmorphic Design
 *
 * Component Hierarchy:
 * App → Dashboard (this file)
 *
 * Quick 10-second overview of project health with prominent CTA to Studio.
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
  Icon,
  Flex,
  Progress,
  Circle,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import {
  FiArrowRight,
  FiEdit3,
  FiCalendar,
  FiTarget,
  FiTrendingUp,
  FiZap,
  FiLayers,
  FiAward,
} from 'react-icons/fi';
import { useProject } from '@/lib/hooks';
import Link from 'next/link';
import { DashboardSkeleton, WelcomeEmptyState, GSCAnalyticsCard } from '@/src/components/dashboard';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Glassmorphic card styles
const glassCard = {
  bg: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '2xl',
};

const glassCardHover = {
  bg: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid rgba(249, 159, 42, 0.3)',
  transform: 'translateY(-2px)',
};

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const user = useQuery(api.users.current);

  const {
    projectId,
    project,
    rating,
    metrics,
    isLoading: projectLoading,
  } = useProject(null, { autoSelect: true });

  // GSC data queries
  const gscConnection = useQuery(
    api.integrations.gscConnections.getGSCConnection,
    projectId ? { projectId: projectId as Id<'projects'> } : 'skip'
  );
  const gscStats = useQuery(
    api.analytics.gscKeywords.getGSCDashboardStats,
    projectId ? { projectId: projectId as Id<'projects'> } : 'skip'
  );

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }
    if (user && user.onboardingStatus !== 'completed') {
      router.replace('/onboarding');
      return;
    }
  }, [isAuthenticated, authLoading, user, router]);

  const loadingDashboard = authLoading || projectLoading;
  const userName = user?.name?.split(' ')[0] || 'there';

  // Use canonical metrics for stats (fixes data inconsistency bug)
  const clusterCount = metrics?.clusterCount ?? 0;
  const contentCount = metrics?.contentCount ?? 0;
  const keywordCount = metrics?.keywordCount ?? 0;

  if (loadingDashboard) return <DashboardSkeleton />;
  if (!project) return <WelcomeEmptyState />;

  // Use canonical rating (unified Phoo Rating)
  const healthScore = rating?.rating ?? 0;
  const hasStrategy = clusterCount > 0;

  // Quick actions
  const quickActions = [
    {
      label: 'Strategy',
      href: '/studio/strategy',
      icon: FiTarget,
      stat: `${clusterCount} clusters`,
      color: '#a78bfa',
    },
    {
      label: 'Calendar',
      href: '/studio/calendar',
      icon: FiCalendar,
      stat: `${contentCount} pieces`,
      color: '#60a5fa',
    },
    {
      label: 'Create',
      href: '/studio/create',
      icon: FiEdit3,
      stat: 'New content',
      color: '#34d399',
    },
  ];

  // Stats for cards
  const statsData = [
    { label: 'Keywords', value: keywordCount, icon: FiLayers, color: '#a78bfa' },
    { label: 'Clusters', value: clusterCount, icon: FiTarget, color: '#60a5fa' },
    { label: 'Content', value: contentCount, icon: FiEdit3, color: '#34d399' },
    { label: 'Phoo Rating', value: healthScore, icon: FiAward, color: '#f59e0b', isScore: true },
  ];

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)"
      position="relative"
      overflow="hidden"
    >
      {/* Ambient glow effects - hidden on mobile for performance */}
      <Box
        position="absolute"
        top="-20%"
        right="-10%"
        w="600px"
        h="600px"
        bg="radial-gradient(circle, rgba(249, 159, 42, 0.15) 0%, transparent 70%)"
        pointerEvents="none"
        display={{ base: 'none', md: 'block' }}
      />
      <Box
        position="absolute"
        bottom="-20%"
        left="-10%"
        w="500px"
        h="500px"
        bg="radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)"
        pointerEvents="none"
        display={{ base: 'none', md: 'block' }}
      />

      <Container
        maxW="container.xl"
        py={{ base: 4, md: 8 }}
        px={{ base: 4, md: 6 }}
        position="relative"
        zIndex={1}
      >
        <VStack spacing={8} align="stretch">
          {/* Hero Section */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
              <VStack align="start" spacing={1}>
                <Text color="gray.400" fontSize="sm" fontWeight="medium" letterSpacing="wider">
                  DASHBOARD
                </Text>
                <Heading
                  size={{ base: 'xl', md: '2xl' }}
                  bgGradient="linear(to-r, white, gray.300)"
                  bgClip="text"
                  fontWeight="bold"
                >
                  Welcome back, {userName}
                </Heading>
                <Text color="gray.400" fontSize={{ base: 'md', md: 'lg' }}>
                  {project.name}
                </Text>
              </VStack>
              <Link href="/studio">
                <Button
                  size="lg"
                  bg="linear-gradient(135deg, #F99F2A 0%, #e53e3e 100%)"
                  color="white"
                  px={8}
                  rightIcon={<FiArrowRight />}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: '0 20px 40px rgba(249, 159, 42, 0.3)',
                  }}
                  transition="all 0.3s"
                  fontWeight="semibold"
                >
                  Open Studio
                </Button>
              </Link>
            </Flex>
          </MotionBox>

          {/* Main Grid */}
          <Grid templateColumns={{ base: '1fr', lg: '340px 1fr' }} gap={6}>
            {/* PR Score Card - Large */}
            <GridItem>
              <MotionBox
                {...glassCard}
                p={{ base: 5, md: 8 }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <VStack spacing={6}>
                  <Text color="gray.400" fontSize="sm" fontWeight="semibold" letterSpacing="wider">
                    PHOO RATING
                  </Text>

                  {/* Circular Score */}
                  <Box
                    position="relative"
                    w={{ base: '160px', md: '200px' }}
                    h={{ base: '160px', md: '200px' }}
                  >
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 200 200"
                      style={{ transform: 'rotate(-90deg)' }}
                    >
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#F99F2A" />
                          <stop offset="100%" stopColor="#e53e3e" />
                        </linearGradient>
                      </defs>
                      {/* Background circle */}
                      <circle
                        cx="100"
                        cy="100"
                        r="85"
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="12"
                      />
                      {/* Progress circle */}
                      <motion.circle
                        cx="100"
                        cy="100"
                        r="85"
                        fill="none"
                        stroke="url(#scoreGradient)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={534}
                        initial={{ strokeDashoffset: 534 }}
                        animate={{ strokeDashoffset: 534 - (534 * healthScore) / 100 }}
                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                      />
                    </svg>
                    <VStack
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      spacing={0}
                    >
                      <Text
                        fontSize="5xl"
                        fontWeight="bold"
                        bgGradient="linear(to-r, #F99F2A, #e53e3e)"
                        bgClip="text"
                      >
                        {healthScore}
                      </Text>
                      <Text color="gray.500" fontSize="sm" fontWeight="medium">
                        out of 100
                      </Text>
                    </VStack>
                  </Box>

                  {/* Tier Badge */}
                  <Box
                    px={4}
                    py={2}
                    borderRadius="full"
                    bg={
                      healthScore >= 70 ? 'green.900' : healthScore >= 40 ? 'yellow.900' : 'red.900'
                    }
                    border="1px solid"
                    borderColor={
                      healthScore >= 70 ? 'green.600' : healthScore >= 40 ? 'yellow.600' : 'red.600'
                    }
                  >
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color={
                        healthScore >= 70
                          ? 'green.300'
                          : healthScore >= 40
                            ? 'yellow.300'
                            : 'red.300'
                      }
                    >
                      {healthScore >= 70 ? 'Strong' : healthScore >= 40 ? 'Fair' : 'Needs Work'}
                    </Text>
                  </Box>

                  {/* Quick insight */}
                  <Text color="gray.400" fontSize="sm" textAlign="center">
                    {healthScore >= 70
                      ? 'Your SEO is performing well!'
                      : 'Connect integrations to improve your score'}
                  </Text>
                </VStack>
              </MotionBox>
            </GridItem>

            {/* Right Column */}
            <GridItem>
              <VStack spacing={6} align="stretch">
                {/* Quick Actions */}
                <Box>
                  <Text
                    color="gray.400"
                    fontSize="sm"
                    fontWeight="semibold"
                    letterSpacing="wider"
                    mb={4}
                  >
                    QUICK ACTIONS
                  </Text>
                  <Grid templateColumns={{ base: '1fr', sm: 'repeat(3, 1fr)' }} gap={4}>
                    {quickActions.map((action, i) => (
                      <Link key={action.href} href={action.href}>
                        <MotionBox
                          {...glassCard}
                          p={{ base: 4, md: 5 }}
                          cursor="pointer"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          whileHover={glassCardHover}
                          _hover={{ cursor: 'pointer' }}
                        >
                          <VStack spacing={3}>
                            <Circle size="50px" bg={`${action.color}20`}>
                              <Icon as={action.icon} boxSize={5} color={action.color} />
                            </Circle>
                            <Text color="white" fontWeight="semibold" fontSize="sm">
                              {action.label}
                            </Text>
                            <Text color="gray.500" fontSize="xs">
                              {action.stat}
                            </Text>
                          </VStack>
                        </MotionBox>
                      </Link>
                    ))}
                  </Grid>
                </Box>

                {/* Stats Grid */}
                <Box>
                  <Text
                    color="gray.400"
                    fontSize="sm"
                    fontWeight="semibold"
                    letterSpacing="wider"
                    mb={4}
                  >
                    OVERVIEW
                  </Text>
                  <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap={4}>
                    {statsData.map((stat, i) => (
                      <MotionBox
                        key={stat.label}
                        {...glassCard}
                        p={{ base: 4, md: 5 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                      >
                        <HStack justify="space-between">
                          <VStack align="start" spacing={1}>
                            <Text color="gray.500" fontSize="xs" fontWeight="medium">
                              {stat.label}
                            </Text>
                            <Text
                              color="white"
                              fontSize={{ base: 'xl', md: '2xl' }}
                              fontWeight="bold"
                            >
                              {stat.isScore ? `${stat.value}/100` : stat.value}
                            </Text>
                          </VStack>
                          <Circle size="40px" bg={`${stat.color}15`}>
                            <Icon as={stat.icon} boxSize={4} color={stat.color} />
                          </Circle>
                        </HStack>
                        {stat.isScore && (
                          <Progress
                            value={stat.value as number}
                            size="xs"
                            mt={3}
                            borderRadius="full"
                            bg="whiteAlpha.100"
                            sx={{
                              '& > div': {
                                background: `linear-gradient(90deg, ${stat.color}, #e53e3e)`,
                              },
                            }}
                          />
                        )}
                      </MotionBox>
                    ))}
                  </Grid>
                </Box>

                {/* GSC Analytics Section */}
                <GSCAnalyticsCard
                  gscStats={gscStats ?? null}
                  isLoading={gscStats === undefined}
                  isConnected={!!gscConnection}
                />

                {/* Action Banner */}
                {!hasStrategy && (
                  <MotionBox
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    bg="linear-gradient(135deg, rgba(249, 159, 42, 0.15) 0%, rgba(229, 62, 62, 0.15) 100%)"
                    border="1px solid rgba(249, 159, 42, 0.3)"
                    borderRadius="xl"
                    p={5}
                  >
                    <HStack justify="space-between" flexDir={{ base: 'column', sm: 'row' }} gap={3}>
                      <HStack spacing={4}>
                        <Circle size="40px" bg="orange.500">
                          <Icon as={FiZap} color="white" />
                        </Circle>
                        <VStack align="start" spacing={0}>
                          <Text color="white" fontWeight="semibold">
                            Get Started with SEO Strategy
                          </Text>
                          <Text color="gray.400" fontSize="sm">
                            Generate keyword clusters to start ranking
                          </Text>
                        </VStack>
                      </HStack>
                      <Link href="/studio/strategy">
                        <Button
                          size="sm"
                          bg="orange.500"
                          color="white"
                          _hover={{ bg: 'orange.400' }}
                          rightIcon={<FiArrowRight />}
                        >
                          Start
                        </Button>
                      </Link>
                    </HStack>
                  </MotionBox>
                )}
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}
