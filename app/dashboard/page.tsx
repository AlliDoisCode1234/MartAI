'use client';

/**
 * Dashboard Page - Premium Dark SEO Command Center
 *
 * Component Hierarchy:
 * App → Dashboard (this file)
 *   ├── DashboardStatRow (4 stat cards)
 *   ├── KeywordsClimbedCard
 *   ├── TopPerformingContentCard
 *   ├── FastestGrowthCard
 *   └── CumulativeGrowthChart
 *
 * Quick 10-second overview of project health with prominent CTA to Studio.
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
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useConvexAuth, useQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { FiArrowRight, FiRefreshCw, FiZap, FiBarChart2, FiCalendar } from 'react-icons/fi';
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
    rating,
    hasGSC,
    hasGA4,
    isLoading: projectLoading,
  } = useProject(null, { autoSelect: true });

  // Fetch real GSC dashboard stats (for keywords component + last sync display)
  const gscStats = useQuery(
    api.analytics.gscKeywords.getGSCDashboardStats,
    projectId ? { projectId: projectId as Id<'projects'> } : 'skip'
  );

  // Fetch combined GA4+GSC KPIs — uses latest-snapshot, no date range needed
  const kpis = useQuery(
    api.analytics.analytics.getDashboardKPIs,
    projectId ? { projectId: projectId as Id<'projects'> } : 'skip'
  );

  // Fetch latest keywords for the climbed card
  const latestKeywords = useQuery(
    api.analytics.gscKeywords.getLatestKeywords,
    projectId ? { projectId: projectId as Id<'projects'>, limit: 10 } : 'skip'
  );

  // Fetch published/approved content pieces for top performing card
  const contentPieces = useQuery(
    api.contentPieces.listByProject,
    projectId ? { projectId: projectId as Id<'projects'>, limit: 10 } : 'skip'
  );

  // Fetch growth history for cumulative chart
  const growthHistory = useQuery(
    api.analytics.analytics.getGrowthHistory,
    projectId ? { projectId: projectId as Id<'projects'> } : 'skip'
  );

  // Fetch suggested keywords for CTA slots in keywords card
  const suggestedKeywordsRaw = useQuery(
    api.seo.keywords.getKeywordsByStatus,
    projectId ? { projectId: projectId as Id<'projects'>, status: 'suggested' } : 'skip'
  );

  // Sync action for THIS project only — not all 38
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

  // Post-checkout success toast
  useEffect(() => {
    if (searchParams.get('subscription') === 'success') {
      toast({
        title: 'Welcome to Phoo!',
        description: 'Your subscription is active. Let\u0027s build something great.',
        status: 'success',
        duration: 6000,
        isClosable: true,
      });
      // Clean the URL without a reload
      router.replace('/dashboard', { scroll: false });
    }
  }, [searchParams, toast, router]);

  const handleSync = async () => {
    if (!projectId) return;
    setIsSyncing(true);
    toast({ title: 'Syncing data from Google...', status: 'info', duration: 3000 });
    try {
      console.log('[Dashboard] Triggering sync for project:', projectId);
      const result = await syncProject({ projectId: projectId as Id<'projects'> });
      console.log('[Dashboard] Sync complete:', result);
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
      console.error('[Dashboard] Sync failed:', e);
      toast({
        title: 'Sync failed',
        description: String(e),
        status: 'error',
        duration: 8000,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const loadingDashboard = authLoading || projectLoading;
  const userName = user?.name?.split(' ')[0] || 'there';
  const fullName = user?.name || '';

  if (loadingDashboard) return <DashboardSkeleton />;
  if (!project) return <WelcomeEmptyState />;

  const healthScore = rating?.rating ?? 0;

  // Use backend-provided flags to determine if we have actual analytics data
  const hasKPIData = !!kpis && (kpis.hasGA4Data || kpis.hasGSCData);
  const totalKeywords = gscStats?.keywordCount ?? 0;
  const hasContent = contentPieces && contentPieces.length > 0;
  const isNewUser = !hasKPIData && !hasContent;

  // Map latest keywords to climbed card format (show all, sorted by best position)
  type SnapshotKw = { keyword: string; position: number; clicks: number };
  const keywordsClimbed = latestKeywords
    ? (latestKeywords as SnapshotKw[])
        .sort((a: SnapshotKw, b: SnapshotKw) => a.position - b.position)
        .slice(0, 5)
        .map((kw: SnapshotKw) => ({
          keyword: kw.keyword,
          rank: Math.round(kw.position),
          clicks: kw.clicks,
        }))
    : [];

  // Map suggested keywords for CTA slots (fill empty keyword card slots)
  type SuggestedKw = { keyword: string; searchVolume?: number; difficulty?: number };
  const suggestedKeywords = ((suggestedKeywordsRaw ?? []) as SuggestedKw[])
    .filter((sk) => !keywordsClimbed.some((kw) => kw.keyword === sk.keyword))
    .slice(0, 5)
    .map((sk) => ({
      keyword: sk.keyword,
      searchVolume: sk.searchVolume ?? undefined,
      difficulty: sk.difficulty !== undefined ? String(sk.difficulty) : undefined,
    }));

  // Map content pieces for top performing card (published/approved first, then by recency)
  type ContentPiece = {
    _id: string;
    title: string;
    wordCount?: number;
    status: string;
    updatedAt: number;
    contentType?: string;
  };
  const allContent = (contentPieces ?? []) as ContentPiece[];
  const topContent = allContent
    .filter((cp) => cp.status === 'published' || cp.status === 'approved')
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 3)
    .map((cp) => ({
      _id: cp._id,
      title: cp.title,
      wordCount: cp.wordCount ?? undefined,
      status: cp.status,
      updatedAt: cp.updatedAt,
      contentType: cp.contentType ?? undefined,
    }));

  // Compute growth opportunity counts from real data
  // Keywords positioned 11-20 are "one push" from page 1
  const firstPageReadyCount = latestKeywords
    ? (latestKeywords as SnapshotKw[]).filter((kw) => kw.position >= 11 && kw.position <= 20).length
    : 0;

  // Published content older than 90 days without updates = refresh candidates
  const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
  const contentRefreshCount = allContent.filter(
    (cp) => cp.status === 'published' && Date.now() - cp.updatedAt > NINETY_DAYS_MS
  ).length;

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)"
      position="relative"
      overflow="hidden"
    >
      {/* Ambient glow effects */}
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
        <VStack spacing={{ base: 5, md: 6 }} align="stretch">
          {/* Row 1: Hero */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
              <VStack align="start" spacing={1}>
                <Text
                  color="gray.400"
                  fontSize="xs"
                  fontWeight="medium"
                  letterSpacing="wider"
                  textTransform="uppercase"
                >
                  Dashboard
                </Text>
                <Badge
                  colorScheme="orange"
                  variant="subtle"
                  fontSize="2xs"
                  px={2}
                  py={0.5}
                  borderRadius="full"
                >
                  Last 30 days
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
                  <Text color="gray.400" fontSize={{ base: 'sm', md: 'md' }}>
                    {fullName}
                  </Text>
                  <Button
                    size="xs"
                    variant="ghost"
                    color="gray.400"
                    leftIcon={<FiRefreshCw />}
                    onClick={handleSync}
                    isLoading={isSyncing}
                    loadingText="Syncing..."
                    _hover={{ color: '#F99F2A' }}
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
              <HStack spacing={3} flexWrap="wrap">
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
              </HStack>
            </Flex>
          </MotionBox>

          {/* New User Awareness Banner */}
          {isNewUser && (
            <MotionCard
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              bg="linear-gradient(135deg, rgba(249, 159, 42, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)"
              borderWidth="1px"
              borderColor="rgba(249, 159, 42, 0.3)"
              borderRadius="xl"
              p={{ base: 5, md: 6 }}
              position="relative"
              overflow="hidden"
            >
              {/* Animated pulse behind the icon */}
              <Box
                position="absolute"
                top="50%"
                left="30px"
                transform="translateY(-50%)"
                w="60px"
                h="60px"
                bg="radial-gradient(circle, rgba(249, 159, 42, 0.3) 0%, transparent 70%)"
                borderRadius="full"
                animation="pulse 2s ease-in-out infinite"
                display={{ base: 'none', md: 'block' }}
              />
              <Flex align="center" gap={4} flexWrap="wrap">
                <Box
                  bg="rgba(249, 159, 42, 0.2)"
                  borderRadius="full"
                  p={3}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FiZap color="#F99F2A" size={24} />
                </Box>
                <VStack align="start" spacing={1} flex={1}>
                  <Heading size="sm" color="white">
                    Phoo is crafting your first article
                  </Heading>
                  <Text color="gray.400" fontSize="sm">
                    Your AI-generated content will appear here in a few minutes. Meanwhile, connect
                    Google Analytics for real-time insights.
                  </Text>
                </VStack>
                <HStack spacing={3}>
                  {!hasGA4 && (
                    <Link href="/settings">
                      <Button
                        size="sm"
                        variant="outline"
                        borderColor="rgba(249, 159, 42, 0.5)"
                        color="#F99F2A"
                        leftIcon={<FiBarChart2 />}
                        _hover={{ bg: 'rgba(249, 159, 42, 0.1)' }}
                      >
                        Connect Google
                      </Button>
                    </Link>
                  )}
                  <Link href="/strategy">
                    <Button
                      size="sm"
                      bg="linear-gradient(135deg, #F99F2A 0%, #e53e3e 100%)"
                      color="white"
                      rightIcon={<FiArrowRight />}
                      _hover={{
                        transform: 'translateY(-1px)',
                        boxShadow: '0 10px 20px rgba(249, 159, 42, 0.3)',
                      }}
                      transition="all 0.2s"
                    >
                      Add Keywords
                    </Button>
                  </Link>
                </HStack>
              </Flex>
            </MotionCard>
          )}

          {/* Connect Data Sources Banner — has content but no analytics */}
          {hasContent && !hasKPIData && (
            <MotionCard
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              bg="linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(249, 159, 42, 0.15) 100%)"
              borderWidth="1px"
              borderColor="rgba(139, 92, 246, 0.3)"
              borderRadius="xl"
              p={{ base: 5, md: 6 }}
            >
              <Flex align="center" gap={4} flexWrap="wrap">
                <Box
                  bg="rgba(139, 92, 246, 0.2)"
                  borderRadius="full"
                  p={3}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FiBarChart2 color="#8B5CF6" size={24} />
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
                      <Button
                        size="sm"
                        variant="outline"
                        borderColor="rgba(139, 92, 246, 0.5)"
                        color="#8B5CF6"
                        _hover={{
                          bg: 'rgba(139, 92, 246, 0.1)',
                        }}
                      >
                        Connect GA4
                      </Button>
                    </Link>
                  )}
                  {!hasGSC && (
                    <Link href="/settings">
                      <Button
                        size="sm"
                        variant="outline"
                        borderColor="rgba(139, 92, 246, 0.5)"
                        color="#8B5CF6"
                        _hover={{
                          bg: 'rgba(139, 92, 246, 0.1)',
                        }}
                      >
                        Connect GSC
                      </Button>
                    </Link>
                  )}
                </HStack>
              </Flex>
            </MotionCard>
          )}

          {/* Row 2: Stat Cards — wired to real data */}
          <DashboardStatRow
            sessions={kpis?.sessions.value ?? 0}
            pageViews={kpis?.pageViews.value ?? 0}
            avgSessionDuration={kpis?.avgSessionDuration.value ?? 0}
            bounceRate={kpis?.bounceRate.value ?? 0}
            avgPosition={kpis?.avgPosition.value ?? 0}
            impressions={kpis?.impressions.value ?? 0}
            visibilityScore={healthScore}
            visibilityChange={0}
            sessionsChange={kpis?.sessions.change ?? 0}
            pageViewsChange={kpis?.pageViews.change ?? 0}
            hasData={hasKPIData}
          />

          {/* Row 3: Three Column Layout */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={{ base: 4, md: 5 }}>
            <GridItem>
              <KeywordsClimbedCard
                keywords={keywordsClimbed}
                suggestedKeywords={suggestedKeywords}
                totalCount={totalKeywords}
                hasData={!!latestKeywords && latestKeywords.length > 0}
              />
            </GridItem>
            <GridItem>
              <TopPerformingContentCard content={topContent} />
            </GridItem>
            <GridItem>
              <FastestGrowthCard
                firstPageReadyCount={firstPageReadyCount}
                contentRefreshCount={contentRefreshCount}
              />
            </GridItem>
          </Grid>

          {/* Row 4: Cumulative Growth Chart */}
          <CumulativeGrowthChart
            totalClicks={kpis?.clicks.value ?? 0}
            keywordsInTop10={totalKeywords}
            hasData={hasKPIData}
            growthData={growthHistory ?? []}
          />
        </VStack>
      </Container>
    </Box>
  );
}
