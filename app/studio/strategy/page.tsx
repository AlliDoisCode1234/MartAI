'use client';

/**
 * Studio Strategy Page
 *
 * Component Hierarchy:
 * App → StudioLayout → StudioStrategy (this file)
 *
 * AI-powered SEO strategy planning integrated into Content Studio.
 * Uses the StudioLayout wrapper for consistent navigation.
 */

import { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  VStack,
  Box,
  HStack,
  Heading,
  Text,
  Button,
  Divider,
  Grid,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/useAuth';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { InsightList } from '@/src/components/insights';
import { useProject } from '@/lib/hooks';
import { trackEvent, ANALYTICS_EVENTS } from '@/src/lib/analyticsEvents';
import { PhooRatingCard } from '@/src/components/phoo';
import { StudioLayout } from '@/src/components/studio';

// Strategy components
import {
  KeywordSourceModal,
  KeywordsPreview,
  StrategyStatCards,
  PlanSummaryCard,
  ContentCalendarCard,
  StrategySkeleton,
  // New narrative components (2026 redesign)
  StrategyNarrative,
  ContentJourney,
  mapContentToJourneyStages,
  TrainRoadmap,
  calculatePhaseData,
  countCompletedPhases,
} from '@/src/components/strategy';

// Constants
import { calculateStrategyStage, DEFAULT_PLAN_FORM } from '@/lib/constants/strategy';

const MotionBox = motion(Box);

function StrategyContent() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const router = useRouter();

  // State
  const [generating, setGenerating] = useState(false);
  const [isClusterModalOpen, setIsClusterModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isKeywordModalOpen, setIsKeywordModalOpen] = useState(false);
  const hasAttemptedAutoDiscovery = useRef(false);

  // Use enhanced useProject hook with autoSelect
  const {
    projectId,
    strategyData,
    gscConnection,
    isLoading: projectLoading,
  } = useProject(null, { autoSelect: true });
  const typedProjectId = projectId as Id<'projects'> | null;

  // Fetch real content piece stats
  const contentStats = useQuery(
    api.contentPieces.getStats,
    typedProjectId ? { projectId: typedProjectId } : 'skip'
  );

  // Mutations & Actions
  const createKeywordsMutation = useMutation(api.seo.keywords.createKeywords);
  const generateClustersAction = useAction(api.seo.keywordActions.generateClusters);
  const generateKeywordsFromUrlAction = useAction(api.seo.keywordActions.generateKeywordsFromUrl);
  // NOTE: quarterlyPlanActions was removed - use generateContentCalendar for plan generation
  const generateContentCalendarAction = useAction(
    api.contentCalendar.generateCalendar.generateFullCalendar
  );

  // Derived data
  const clusters = strategyData?.clusters ?? [];
  const plan = strategyData?.plan ?? null;
  const keywordCount = clusters.reduce(
    (acc: number, c: { keywords?: string[] }) => acc + (c.keywords?.length || 0),
    0
  );
  const clusterCount = clusters.length;
  const briefCount = plan?.briefs?.length || 0;
  const draftCount =
    plan?.briefs?.filter((b: any) => b.status === 'draft' || b.status === 'in_progress')?.length ||
    0;
  const currentStage = calculateStrategyStage(keywordCount, clusterCount, briefCount, draftCount);
  const existingKeywords = clusters.flatMap((c: { keywords?: string[] }) => c.keywords || []);

  // Auth redirect
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }
    if (user && user.onboardingStatus !== 'completed') router.replace('/onboarding');
  }, [authLoading, isAuthenticated, router, user]);

  // Auto-discover keywords
  useEffect(() => {
    if (
      typedProjectId &&
      strategyData !== undefined &&
      keywordCount === 0 &&
      !hasAttemptedAutoDiscovery.current &&
      !generating
    ) {
      hasAttemptedAutoDiscovery.current = true;
      generateKeywordsFromUrlAction({ projectId: typedProjectId }).catch(() => {});
    }
  }, [typedProjectId, strategyData, keywordCount, generating, generateKeywordsFromUrlAction]);

  // Handlers
  const handleGenerateClusters = async () => {
    if (!typedProjectId) return;
    setGenerating(true);
    try {
      await generateClustersAction({ projectId: typedProjectId, importFromGSC: true });
      trackEvent(ANALYTICS_EVENTS.CLUSTERS_GENERATED, { projectId: typedProjectId });
      setIsClusterModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleGeneratePlan = async (formData: typeof DEFAULT_PLAN_FORM) => {
    if (!typedProjectId || clusters.length === 0) return;
    setGenerating(true);
    try {
      // Use the working generateContentCalendar instead of the removed quarterlyPlanActions
      await generateContentCalendarAction({
        projectId: typedProjectId,
        monthsAhead: 6, // 6-month plan
        useGa4Gsc: !!gscConnection, // Use GSC data if connected
      });
      setIsPlanModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleImportFromGSC = async () => {
    if (!typedProjectId) return;
    setGenerating(true);
    try {
      await generateClustersAction({ projectId: typedProjectId, importFromGSC: true });
      trackEvent(ANALYTICS_EVENTS.KEYWORDS_IMPORTED, { projectId: typedProjectId, source: 'gsc' });
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateFromUrl = async () => {
    if (!typedProjectId) return;
    setGenerating(true);
    try {
      await generateKeywordsFromUrlAction({ projectId: typedProjectId, limit: 30 });
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleAddKeywordsManually = async (keywords: string[]) => {
    if (!typedProjectId) return;
    setGenerating(true);
    try {
      await createKeywordsMutation({
        projectId: typedProjectId,
        keywords: keywords.map((k) => ({ keyword: k })),
      });
      trackEvent(ANALYTICS_EVENTS.KEYWORDS_ADDED_MANUAL, {
        projectId: typedProjectId,
        count: keywords.length,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  // Loading states
  if (projectLoading || (typedProjectId && strategyData === undefined)) return <StrategySkeleton />;
  if (!projectId)
    return (
      <Container maxW="container.xl" py={12}>
        <VStack spacing={6}>
          <Heading>No project found</Heading>
          <Text>Create a project first.</Text>
          <Button onClick={() => router.push('/onboarding')}>Create Project</Button>
        </VStack>
      </Container>
    );
  if (!isAuthenticated)
    return (
      <Box minH="calc(100vh - 64px)" display="flex" alignItems="center" justifyContent="center">
        <Alert status="warning" maxW="md">
          <AlertIcon />
          Please sign in
        </Alert>
      </Box>
    );

  return (
    <Box minH="100%" bg="transparent">
      <Container maxW="container.xl" py={{ base: 6, md: 8 }} px={{ base: 4, sm: 6, md: 8 }}>
        <VStack spacing={8} align="stretch">
          {/* Narrative Header - tells the story of what was created */}
          <StrategyNarrative
            projectName={strategyData?.projectName || 'Your Project'}
            industry={strategyData?.industry || 'General'}
            totalContent={contentStats?.total ?? 0}
            contentByCategory={{
              'Core Pages':
                contentStats?.byType?.homepage ??
                0 + (contentStats?.byType?.about ?? 0) + (contentStats?.byType?.service ?? 0),
              'Blog Content': contentStats?.byType?.blog ?? 0,
              Conversion:
                contentStats?.byType?.leadMagnet ?? 0 + (contentStats?.byType?.landing ?? 0),
              'Local/Geo': contentStats?.byType?.areasWeServe ?? 0,
              Specialty: 0,
            }}
            websiteUrl={strategyData?.websiteUrl}
          />

          {/* 6-Month Train Roadmap - PRIMARY VISUAL (5-second rule) */}
          {(() => {
            const phaseData = calculatePhaseData(contentStats?.byTypeStatus || {});
            const completedPhases = countCompletedPhases(phaseData);

            return <TrainRoadmap completedPhases={completedPhases} contentByPhase={phaseData} />;
          })()}

          {/* Content Journey - awareness levels (detail section) */}
          <ContentJourney
            contentByStage={{
              ready_to_buy:
                (contentStats?.byType?.landing ?? 0) + (contentStats?.byType?.paidProduct ?? 0),
              comparing_options:
                (contentStats?.byType?.blogVersus ?? 0) + (contentStats?.byType?.service ?? 0),
              learning_solutions: contentStats?.byType?.blog ?? 0,
              discovering_needs:
                (contentStats?.byType?.about ?? 0) + (contentStats?.byType?.homepage ?? 0),
              building_awareness: contentStats?.byType?.areasWeServe ?? 0,
            }}
            totalContent={contentStats?.total ?? 0}
          />

          {/* Content Journey - awareness levels progress */}

          {/* Keywords Modal - still useful for adding keywords */}
          <KeywordSourceModal
            isOpen={isKeywordModalOpen}
            onClose={() => setIsKeywordModalOpen(false)}
            hasGSC={!!gscConnection}
            gscSiteUrl={gscConnection?.siteUrl}
            onImportFromGSC={handleImportFromGSC}
            onAddManually={handleAddKeywordsManually}
            onGenerateFromUrl={handleGenerateFromUrl}
            isLoading={generating}
            existingKeywordCount={keywordCount}
          />
        </VStack>
      </Container>
    </Box>
  );
}

export default function StudioStrategyPage() {
  return (
    <StudioLayout>
      <Suspense fallback={<StrategySkeleton />}>
        <StrategyContent />
      </Suspense>
    </StudioLayout>
  );
}
