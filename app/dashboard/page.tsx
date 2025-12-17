'use client';

/**
 * Dashboard Page
 *
 * Component Hierarchy:
 * App → Dashboard (this file)
 *
 * Unified dashboard with MART guidance, stats, charts, and insights.
 * Merged from previous Home + Dashboard pages.
 */

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  VStack,
  Grid,
  HStack,
  Heading,
  SimpleGrid,
  Box,
  Button,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { FiTrendingUp, FiTarget, FiZap, FiActivity, FiPlus } from 'react-icons/fi';
import { useProject } from '@/lib/hooks';
import Link from 'next/link';

// Dashboard components
import {
  StatCard,
  TrafficChart,
  KeywordGrowthChart,
  MartAIRatingWidget,
  DashboardHero,
  WelcomeEmptyState,
  IntelligenceCard,
  DashboardSkeleton,
  TopKeywordsCard,
  QuickWinsCard,
} from '@/src/components/dashboard';
import { IntegrationPromptBanner } from '@/src/components/analytics/IntegrationPromptBanner';
import { InsightList } from '@/src/components/insights';
import {
  MartCharacter,
  TutorialCard,
  POST_ONBOARDING_STEPS,
  WHATS_NEXT_STEPS,
  type TutorialStep,
} from '@/src/components/assistant';
import { KeywordsPreview, TopicsPreview } from '@/src/components/strategy';

// Constants
import { MOCK_TRAFFIC_DATA, MOCK_KEYWORD_PERFORMANCE } from '@/lib/constants/dashboard';

const MotionGrid = motion(Grid);
const MotionBox = motion(Box);

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const user = useQuery(api.users.current);

  // Use enhanced useProject hook with autoSelect
  const {
    projectId,
    project,
    ga4Connection,
    mrScore,
    strategyData,
    isLoading: projectLoading,
  } = useProject(null, { autoSelect: true });

  const latestAiReport = useQuery(
    api.ai.reports.getLatestAiReport,
    projectId ? { projectId: projectId as Id<'projects'> } : 'skip'
  );

  const keywords = useQuery(
    api.seo.keywords.getKeywordsByProject,
    projectId ? { projectId: projectId as Id<'projects'> } : 'skip'
  );

  // Auth redirect
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) router.replace('/auth/login');
  }, [isAuthenticated, authLoading, router]);

  const stats = strategyData?.stats ?? null;
  const loadingDashboard = authLoading || projectLoading;

  // Determine user state for MART guidance
  const hasClusters = (strategyData?.clusters?.length ?? 0) > 0;
  const hasGA4 = !!ga4Connection;
  const isNewUser = !hasGA4 && !hasClusters;
  const userName = user?.name?.split(' ')[0] || 'there';

  // Build tutorial steps based on state
  const tutorialSteps = useMemo((): TutorialStep[] => {
    if (!hasClusters) {
      return POST_ONBOARDING_STEPS.map((step) => ({
        ...step,
        completed:
          (step.id === 'view-keywords' && (keywords?.length ?? 0) > 0) ||
          (step.id === 'create-clusters' && hasClusters),
      }));
    }
    return WHATS_NEXT_STEPS;
  }, [hasClusters, keywords?.length]);

  // MART's contextual message
  const getMartMessage = () => {
    if (isNewUser) {
      return `Hey ${userName}! Let's get your SEO strategy off the ground. Here's what to focus on first:`;
    }
    if (mrScore && mrScore.overall >= 70) {
      return `Nice work, ${userName}! Your MR score is looking great. Here are ways to keep the momentum:`;
    }
    return `Welcome back, ${userName}! Here's what I'd focus on next to boost your SEO:`;
  };

  if (loadingDashboard) return <DashboardSkeleton />;
  if (!project) return <WelcomeEmptyState />;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <DashboardHero userName={user?.name} projectName={project.name || 'Your Project'} />

        {/* MART Guidance Section */}
        <MotionBox initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <MartCharacter message={getMartMessage()} size="md" />
        </MotionBox>

        <IntegrationPromptBanner isConnected={!!ga4Connection} projectId={projectId || undefined} />

        <Grid templateColumns={{ base: '1fr', lg: '300px 1fr' }} gap={6}>
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
              value={keywords?.length ?? 0}
              trend="increase"
              trendValue="Tracked keywords"
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

        {/* What's Next Section */}
        <Box>
          <HStack justify="space-between" mb={4}>
            <Heading size="md" color="gray.700">
              {isNewUser ? 'Getting Started' : "What's Next"}
            </Heading>
            <Link href="/projects/new">
              <Button colorScheme="orange" leftIcon={<FiPlus />} size="sm">
                New Project
              </Button>
            </Link>
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {tutorialSteps.slice(0, 4).map((step, i) => (
              <TutorialCard key={step.id} step={step} index={i} />
            ))}
          </SimpleGrid>
        </Box>

        {/* Keywords & Topics Preview */}
        {projectId && (
          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
            <KeywordsPreview projectId={projectId as Id<'projects'>} maxPreview={8} />
            <TopicsPreview projectId={projectId as Id<'projects'>} maxPreview={4} />
          </Grid>
        )}

        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
          <TrafficChart data={MOCK_TRAFFIC_DATA} />
          <KeywordGrowthChart data={MOCK_TRAFFIC_DATA} />
        </Grid>

        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
          <TopKeywordsCard keywords={MOCK_KEYWORD_PERFORMANCE} />
          {projectId && <QuickWinsCard projectId={projectId as Id<'projects'>} />}
        </Grid>

        {projectId && (
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
            gap={6}
          >
            <InsightList
              projectId={projectId as Id<'projects'>}
              type="quick_win"
              title="Quick Wins"
              maxItems={3}
              columns={1}
            />
            <InsightList
              projectId={projectId as Id<'projects'>}
              type="content_gap"
              title="Content Gaps"
              maxItems={3}
              columns={1}
            />
            <InsightList
              projectId={projectId as Id<'projects'>}
              type="semantic_opportunity"
              title="Opportunities"
              maxItems={3}
              columns={1}
            />
          </Grid>
        )}

        <IntelligenceCard report={latestAiReport ?? null} />
      </VStack>
    </Container>
  );
}
