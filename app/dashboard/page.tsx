'use client';

/**
 * Dashboard Page
 *
 * Component Hierarchy:
 * App → Dashboard (this file)
 *
 * Main dashboard view with project stats, charts, and insights.
 * Uses extracted components for modularity.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, VStack, Grid } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { FiTrendingUp, FiTarget, FiZap, FiActivity } from 'react-icons/fi';
import { useProject } from '@/lib/hooks';

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
} from '@/src/components/dashboard';
import { IntegrationPromptBanner } from '@/src/components/analytics/IntegrationPromptBanner';
import { InsightList } from '@/src/components/insights';

// Constants
import { MOCK_TRAFFIC_DATA, MOCK_KEYWORD_PERFORMANCE } from '@/lib/constants/dashboard';

const MotionGrid = motion(Grid);

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

  // Auth redirect
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) router.replace('/auth/login');
  }, [isAuthenticated, authLoading, router]);

  const stats = strategyData?.stats ?? null;
  const loadingDashboard = authLoading || projectLoading;

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

        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
          <TrafficChart data={MOCK_TRAFFIC_DATA} />
          <KeywordGrowthChart data={MOCK_TRAFFIC_DATA} />
        </Grid>

        <TopKeywordsCard keywords={MOCK_KEYWORD_PERFORMANCE} />

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
