'use client';

/**
 * Dashboard Page - The Action Center (Zero Redundancy)
 *
 * Component Hierarchy:
 * App → Dashboard (this file)
 *   ├── CumulativeGrowthChart
 *   └── IntelligenceBriefCard
 *
 * 100% focused on narrative ROI and 1-Click Execution for Business Owners.
 * All raw tabular data lives in /studio/insights.
 */

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Flex,
  useToast,
  Badge,
  Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useConvexAuth, useQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import {
  FiArrowRight,
  FiRefreshCw,
  FiZap,
  FiBarChart2,
  FiEdit3,
  FiGlobe,
  FiTarget,
  FiChevronRight,
} from 'react-icons/fi';
import { useProject } from '@/lib/hooks';
import Link from 'next/link';
import {
  DashboardSkeleton,
  WelcomeEmptyState,
  DashboardStatRow,
  KeywordsClimbedCard,
  TopPerformingContentCard,
  FastestGrowthCard,
  CumulativeGrowthChart,
  OnboardingProgressBar,
} from '@/src/components/dashboard';
import { STUDIO_COLORS, STUDIO_CARD } from '@/lib/constants/studioTokens';
import { StudioLayout } from '@/src/components/studio';

const MotionBox = motion(Box);
const MotionCard = motion(Box);

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const user = useQuery(api.users.current);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);

  const {
    projectId,
    project,
    hasGSC,
    hasGA4,
    isLoading: projectLoading,
  } = useProject(null, { autoSelect: true });

  const kpis = useQuery(
    api.analytics.analytics.getDashboardKPIs,
    projectId && isAuthenticated ? { projectId: projectId as Id<'projects'> } : 'skip'
  );

  const stats = useQuery(
    api.contentPieces.getStats,
    projectId && isAuthenticated ? { projectId } : 'skip'
  );

  const gscStats = useQuery(
    api.analytics.gscKeywords.getGSCDashboardStats,
    projectId && isAuthenticated ? { projectId: projectId as Id<'projects'> } : 'skip'
  );

  const growthHistory = useQuery(
    api.analytics.analytics.getGrowthHistory,
    projectId && isAuthenticated ? { projectId: projectId as Id<'projects'> } : 'skip'
  );

  const contentMetricsSummary = useQuery(
    api.analytics.contentMetrics.getProjectMetricsSummary,
    projectId && isAuthenticated ? { projectId: projectId as Id<'projects'> } : 'skip'
  );

  const enrichedKeywordsData = useQuery(
    api.seo.keywordsData.getKeywordsEnriched,
    projectId && isAuthenticated ? { projectId: projectId as Id<'projects'> } : 'skip'
  );

  const recentContent = useQuery(
    api.contentPieces.listByProject,
    projectId && isAuthenticated ? { projectId: projectId as Id<'projects'>, limit: 10 } : 'skip'
  );

  const syncProject = useAction(api.analytics.scheduler.syncProject);

  // ── DEBUG: Log all Google data arriving from Convex ──────────────
  useEffect(() => {
    console.group('[DASHBOARD DEBUG] Google Data Snapshot');

    console.groupEnd();
  }, [kpis, gscStats, growthHistory, contentMetricsSummary, enrichedKeywordsData, recentContent, stats, projectId, project, hasGA4, hasGSC]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }
    if (user && user.onboardingStatus !== 'completed') {
      try {
        if (sessionStorage.getItem('onboarding_just_completed') === 'true') {
          return;
        }
      } catch {}
      router.replace('/onboarding');
      return;
    }
  }, [isAuthenticated, authLoading, user, router]);

  useEffect(() => {
    if (searchParams?.get('subscription') === 'success') {
      toast({
        title: 'Welcome to Phoo!',
        description: 'Your subscription is active. Let\u0027s build something great.',
        status: 'success',
        duration: 6000,
        isClosable: true,
      });
      router.replace('/studio', { scroll: false });
    }
  }, [searchParams, toast, router]);

  const handleSync = async () => {
    if (!projectId) return;
    setIsSyncing(true);
    toast({ title: 'Syncing data from Google...', status: 'info', duration: 3000 });
    try {
      const result = await syncProject({ projectId: projectId as Id<'projects'> });
      const now = Date.now();
      setLastSyncedAt(now);

      if (result.status === 'error') {
        toast({
          title: 'Sync completed with errors',
          description: result.error,
          status: 'warning',
          duration: 8000,
          isClosable: true,
        });
      } else {
        // Build change summary for the toast
        const syncData = (result.data ?? {}) as Record<string, unknown>;
        const changes: string[] = [];
        if (syncData.gscSynced) changes.push('Search Console data');
        if (syncData.ga4Synced) changes.push('Analytics data');
        const summary = changes.length > 0
          ? `Updated: ${changes.join(', ')}.`
          : 'Sync complete. Your data is up to date.';

        toast({
          title: 'Sync complete',
          description: summary,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (e) {
      toast({ title: 'Sync failed', description: String(e), status: 'error', duration: 8000 });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleQuickLaunch = (type: string, keyword?: string) => {
    let url = `/studio/create?type=${type}`;
    if (keyword) {
      url += `&keyword=${encodeURIComponent(keyword)}&title=${encodeURIComponent(keyword)}&fromStrategy=true`;
    }
    router.push(url);
  };

  const loadingDashboard = authLoading || projectLoading;
  const userName = user?.name?.split(' ')[0] || 'there';

  if (loadingDashboard) return <DashboardSkeleton />;
  if (!project) return <WelcomeEmptyState />;
  if (stats === undefined || enrichedKeywordsData === undefined)
    return <DashboardSkeleton />;

  const hasGA4Data = !!kpis && kpis.hasGA4Data;
  const hasGSCData = !!kpis && kpis.hasGSCData;
  const hasKPIData = hasGA4Data || hasGSCData;

  // @ts-ignore
  const quickWins = (enrichedKeywordsData.keywords || [])
    // @ts-ignore
    .filter((kw) => kw.isQuickWin)
    // @ts-ignore
    .sort((a, b) => (b.searchVolume || 0) - (a.searchVolume || 0))
    .slice(0, 3);

  return (
    <StudioLayout>
      <Container
        maxW="container.xl"
        py={{ base: 4, md: 8 }}
        px={{ base: 4, md: 6 }}
        position="relative"
        zIndex={1}
      >
        <VStack spacing={{ base: 5, md: 8 }} align="stretch">
          {/* ── Header ─────────────────────────────────────────── */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
              <VStack align="start" spacing={1}>
                <Badge
                  colorScheme="orange"
                  variant="subtle"
                  fontSize="2xs"
                  px={2}
                  py={0.5}
                  borderRadius="full"
                >
                  Overview
                </Badge>
                <Heading size={{ base: 'xl', md: '2xl' }} color="gray.800" fontWeight="bold">
                  Studio Overview
                </Heading>
                <HStack spacing={4} flexWrap="wrap">
                  <Button
                    size="xs"
                    variant="ghost"
                    color="gray.500"
                    leftIcon={<FiRefreshCw />}
                    onClick={handleSync}
                    isLoading={isSyncing}
                  >
                    Sync Data
                  </Button>
                  {(lastSyncedAt || gscStats?.lastSyncDate) && (
                    <Text color="gray.400" fontSize="xs">
                      Last synced:{' '}
                      {new Date(lastSyncedAt || gscStats?.lastSyncDate || 0).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </Text>
                  )}
                </HStack>
              </VStack>
              <HStack spacing={3}>
                <Link href="/studio/insights">
                  <Button
                    size="md"
                    variant="outline"
                    borderColor="orange.300"
                    color="orange.500"
                    rightIcon={<FiBarChart2 />}
                    _hover={{ bg: 'orange.50' }}
                  >
                    Deep SEO Insights
                  </Button>
                </Link>
              </HStack>
            </Flex>
          </MotionBox>

          {/* ── Onboarding Journey ─────────────────────────────── */}
          <OnboardingProgressBar hasGA4={hasGA4} hasGSC={hasGSC} />

          {/* ── Blurred Metrics Area ───────────────────────────── */}
          <Box
            position="relative"
            sx={
              (!hasGA4 || !hasGSC) ? {
                filter: 'blur(5px)',
                pointerEvents: 'none',
                userSelect: 'none',
                opacity: 0.8
              } : {}
            }
          >
            {(!hasGA4 || !hasGSC) && (
              <Flex
                position="absolute"
                top="80px"
                left="0"
                right="0"
                zIndex={10}
                justify="center"
                align="center"
                style={{ pointerEvents: 'none' }}
              >
                <VStack
                  bg="white"
                  p={6}
                  borderRadius="xl"
                  boxShadow="2xl"
                  borderWidth="1px"
                  borderColor="orange.200"
                  spacing={4}
                  textAlign="center"
                  maxW="sm"
                >
                  <Box bg="orange.50" p={4} borderRadius="full">
                    <Icon as={FiZap} boxSize={8} color="orange.500" />
                  </Box>
                  <Heading size="md" color="gray.800">Live Data Locked</Heading>
                  <Text color="gray.600" fontSize="sm">
                    Connect your data sources above to deploy your autonomous SEO agents.
                  </Text>
                  <Link href="/settings?tab=integrations" style={{ textDecoration: 'none' }}>
                    <Button mt={2} colorScheme="brand" bg="brand.orange" color="white" _hover={{ bg: 'orange.600' }} rightIcon={<FiChevronRight />}>
                      Connect Integrations
                    </Button>
                  </Link>
                </VStack>
              </Flex>
            )}

            <VStack spacing={{ base: 5, md: 8 }} align="stretch">
              {/* ── Tier 1: The Executive Briefing ─────────────────── */}
              <Box>
                <DashboardStatRow
                  sessions={kpis?.sessions?.value ?? 0}
                  users={kpis?.users?.value ?? 0}
                  pageViews={kpis?.pageViews?.value ?? 0}
                  avgSessionDuration={kpis?.avgSessionDuration?.value ?? 0}
                  avgPosition={gscStats?.avgPosition ?? 0}
                  impressions={gscStats?.impressions ?? 0}
                  visibilityScore={kpis?.visibilityScore ?? 0}
                  visibilityChange={kpis?.visibilityScoreChange ?? 0}
                  sessionsChange={kpis?.sessions?.change ?? 0}
                  pageViewsChange={kpis?.pageViews?.change ?? 0}
                  totalLeads={contentMetricsSummary?.totalLeads ?? 0}
                  leadConversionRate={contentMetricsSummary?.leadConversionRate ?? 0}
                  hasGA4Data={hasGA4Data}
                  hasGSCData={hasGSCData}
                  hasGA4={hasGA4}
                />
              </Box>

              {/* ── Tier 2: The Action Center ──────────────────────── */}
              <Grid templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }} gap={6}>
                <GridItem>
                  <KeywordsClimbedCard
                    // @ts-ignore
                    keywords={gscStats?.keywords || []}
                    suggestedKeywords={quickWins}
                    totalCount={gscStats?.keywordCount ?? 0}
                    hasData={hasKPIData}
                  />
                </GridItem>
                <GridItem>
                  <TopPerformingContentCard
                    // @ts-ignore
                    content={recentContent || []}
                  />
                </GridItem>
                <GridItem>
                  <FastestGrowthCard
                    firstPageReadyCount={quickWins.length}
                    contentRefreshCount={stats?.published ? Math.floor(stats.published * 0.1) : 0}
                  />
                </GridItem>
              </Grid>

              {/* ── Tier 3: Growth ─────────────────────────────────── */}
              <Box>
                <CumulativeGrowthChart
                  totalClicks={kpis?.clicks?.value ?? 0}
                  keywordsInTop10={gscStats?.keywordCount ?? 0}
                  hasData={hasKPIData}
                  // @ts-ignore
                  growthData={growthHistory ?? []}
                  hasGA4={hasGA4}
                />
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </StudioLayout>
  );
}
