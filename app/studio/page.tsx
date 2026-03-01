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

  const enrichedKeywordsData = useQuery(
    api.seo.keywordsData.getKeywordsEnriched,
    projectId && isAuthenticated ? { projectId: projectId as Id<'projects'> } : 'skip'
  );

  const recentContent = useQuery(
    api.contentPieces.listByProject,
    projectId && isAuthenticated ? { projectId: projectId as Id<'projects'>, limit: 10 } : 'skip'
  );

  const syncProject = useAction(api.analytics.scheduler.syncProject);

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

  useEffect(() => {
    if (searchParams.get('subscription') === 'success') {
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
      if (result.status === 'error') {
        toast({
          title: 'Sync completed with errors',
          description: result.error,
          status: 'warning',
          duration: 8000,
        });
      } else {
        toast({
          title: 'Sync complete',
          description: 'Dashboard data updated from Google.',
          status: 'success',
          duration: 5000,
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

  if (loadingDashboard || stats === undefined || enrichedKeywordsData === undefined)
    return <DashboardSkeleton />;
  if (!project) return <WelcomeEmptyState />;

  const hasKPIData = !!kpis && (kpis.hasGA4Data || kpis.hasGSCData);

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
                  Dashboard
                </Badge>
                <Heading
                  size={{ base: 'xl', md: '2xl' }}
                  bgGradient="linear(to-r, white, gray.300)"
                  bgClip="text"
                  fontWeight="bold"
                >
                  Welcome back, {userName}
                </Heading>
                <HStack spacing={4} flexWrap="wrap">
                  <Button
                    size="xs"
                    variant="ghost"
                    color="gray.400"
                    leftIcon={<FiRefreshCw />}
                    onClick={handleSync}
                    isLoading={isSyncing}
                  >
                    Sync Data
                  </Button>
                  {gscStats?.lastSyncDate && (
                    <Text color="gray.600" fontSize="xs">
                      Last synced:{' '}
                      {new Date(gscStats.lastSyncDate).toLocaleDateString('en-US', {
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
                    borderColor="rgba(255, 157, 0, 0.5)"
                    color={STUDIO_COLORS.amber}
                    rightIcon={<FiBarChart2 />}
                    _hover={{ bg: 'rgba(255, 157, 0, 0.1)' }}
                  >
                    Deep SEO Insights
                  </Button>
                </Link>
              </HStack>
            </Flex>
          </MotionBox>

          {/* ── Tier 1: The Executive Briefing ─────────────────── */}
          <Box>
            <DashboardStatRow
              sessions={kpis?.sessions?.value ?? 0}
              pageViews={kpis?.pageviews?.value ?? 0}
              avgSessionDuration={kpis?.avgSessionDuration?.value ?? 0}
              bounceRate={kpis?.bounceRate?.value ?? 0}
              avgPosition={gscStats?.avgPosition ?? 0}
              impressions={gscStats?.impressions ?? 0}
              visibilityScore={kpis?.visibilityScore ?? 0}
              visibilityChange={kpis?.visibilityScoreChange ?? 0}
              sessionsChange={kpis?.sessions?.change ?? 0}
              pageViewsChange={kpis?.pageviews?.change ?? 0}
              hasData={hasKPIData}
              hasGA4={hasGA4}
            />
          </Box>

          {/* ── Connect Scanners ───────────────────────────────── */}
          {(!hasGA4 || !hasGSC) && (
            <MotionCard
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              bg="rgba(255, 255, 255, 0.03)"
              borderWidth="1px"
              borderColor="rgba(255, 255, 255, 0.1)"
              borderRadius="xl"
              p={{ base: 5, md: 6 }}
              mt={2}
            >
              <Flex align="center" gap={4} flexWrap="wrap">
                <Box bg="rgba(255, 157, 0, 0.2)" borderRadius="full" p={3}>
                  <FiBarChart2 color={STUDIO_COLORS.amber} size={24} />
                </Box>
                <VStack align="start" spacing={1} flex={1}>
                  <Heading size="sm" color="white">
                    Connect your data sources
                  </Heading>
                  <Text color="gray.400" fontSize="sm">
                    Link Google Analytics and Search Console to unlock real-time SEO metrics.
                  </Text>
                </VStack>
                <HStack spacing={3}>
                  {!hasGA4 && (
                    <Link href="/settings">
                      <Button size="sm" colorScheme="orange" variant="outline">
                        Connect GA4
                      </Button>
                    </Link>
                  )}
                  {!hasGSC && (
                    <Link href="/settings">
                      <Button size="sm" colorScheme="orange" variant="outline">
                        Connect GSC
                      </Button>
                    </Link>
                  )}
                </HStack>
              </Flex>
            </MotionCard>
          )}

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
      </Container>
    </StudioLayout>
  );
}
