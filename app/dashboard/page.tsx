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

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, VStack, Grid } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { FiTrendingUp, FiTarget, FiZap, FiActivity } from 'react-icons/fi';

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
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Queries
  const projects = useQuery(
    api.projects.projects.getProjectsByUser,
    user?._id ? { userId: user._id } : 'skip'
  );
  const projectList = (projects ?? []) as Array<{ _id: Id<'projects'>; name?: string }>;
  const strategy = useQuery(
    api.seo.strategy.getStrategyByProject,
    selectedProjectId ? { projectId: selectedProjectId as Id<'projects'> } : 'skip'
  );
  const latestAiReport = useQuery(
    api.ai.reports.getLatestAiReport,
    selectedProjectId ? { projectId: selectedProjectId as Id<'projects'> } : 'skip'
  );
  const ga4Connection = useQuery(
    api.integrations.ga4Connections.getGA4Connection,
    selectedProjectId ? { projectId: selectedProjectId as Id<'projects'> } : 'skip'
  );
  const mrScore = useQuery(
    api.analytics.martaiRatingQueries.getLatestScore,
    selectedProjectId ? { projectId: selectedProjectId as Id<'projects'> } : 'skip'
  );

  // Auth redirect
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) router.replace('/auth/login');
  }, [isAuthenticated, authLoading, router]);

  // Project selection
  useEffect(() => {
    if (authLoading || !isAuthenticated || projects === undefined) {
      setProjectsLoading(projects === undefined);
      return;
    }
    setProjectsLoading(false);
    if (!projectList?.length) {
      setSelectedProjectId(null);
      return;
    }
    const storedId =
      typeof window !== 'undefined' ? localStorage.getItem('currentProjectId') : null;
    const matched = storedId ? projectList.find((p) => (p._id as string) === storedId) : null;
    const next = matched ?? projectList[0];
    const nextId = next._id as string;
    if (!selectedProjectId || nextId !== selectedProjectId) setSelectedProjectId(nextId);
    if (typeof window !== 'undefined') localStorage.setItem('currentProjectId', nextId);
  }, [projects, authLoading, isAuthenticated, selectedProjectId, projectList]);

  // Derived data
  const project = useMemo(() => {
    if (!projectList?.length) return null;
    if (!selectedProjectId) return projectList[0];
    return projectList.find((p) => (p._id as string) === selectedProjectId) ?? projectList[0];
  }, [projectList, selectedProjectId]);

  const stats = strategy?.stats ?? null;
  const loadingDashboard =
    authLoading || projectsLoading || (selectedProjectId !== null && strategy === undefined);

  // Loading skeleton
  if (loadingDashboard) return <DashboardSkeleton />;

  // Empty state
  if (!project) return <WelcomeEmptyState />;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Hero */}
        <DashboardHero userName={user?.name} projectName={project.name || 'Your Project'} />

        {/* Integration Banner */}
        <IntegrationPromptBanner
          isConnected={!!ga4Connection}
          projectId={selectedProjectId || undefined}
        />

        {/* MartAI Rating + Stats Grid */}
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

        {/* Charts */}
        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
          <TrafficChart data={MOCK_TRAFFIC_DATA} />
          <KeywordGrowthChart data={MOCK_TRAFFIC_DATA} />
        </Grid>

        {/* Top Keywords */}
        <TopKeywordsCard keywords={MOCK_KEYWORD_PERFORMANCE} />

        {/* Insights */}
        {selectedProjectId && (
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
            gap={6}
          >
            <InsightList
              projectId={selectedProjectId as Id<'projects'>}
              type="quick_win"
              title="Quick Wins"
              maxItems={3}
              columns={1}
            />
            <InsightList
              projectId={selectedProjectId as Id<'projects'>}
              type="content_gap"
              title="Content Gaps"
              maxItems={3}
              columns={1}
            />
            <InsightList
              projectId={selectedProjectId as Id<'projects'>}
              type="semantic_opportunity"
              title="Opportunities"
              maxItems={3}
              columns={1}
            />
          </Grid>
        )}

        {/* Intelligence */}
        <IntelligenceCard report={latestAiReport ?? null} />
      </VStack>
    </Container>
  );
}
