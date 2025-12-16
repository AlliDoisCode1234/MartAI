'use client';

/**
 * Strategy Page
 *
 * Component Hierarchy:
 * App → Strategy (this file)
 *
 * AI-powered SEO strategy planning with guided wizard and DIY modes.
 * Uses extracted components for modularity.
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
  Tooltip,
  Icon,
  Divider,
  Grid,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiLayers, FiCalendar } from 'react-icons/fi';
import { useAuth } from '@/lib/useAuth';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { InsightList } from '@/src/components/insights';
import { useProject } from '@/lib/hooks';

// Strategy components
import {
  StrategyStepper,
  NextStepCard,
  StrategyModeToggle,
  SkipWizardLink,
  KeywordSourceModal,
  KeywordsPreview,
  StrategyDashboard,
  getSavedStrategyMode,
  StrategyStatCards,
  PlanSummaryCard,
  ContentCalendarCard,
  ClusterGrid,
  GeneratePlanModal,
  GenerateClustersModal,
  StrategySkeleton,
  type StrategyMode,
} from '@/src/components/strategy';

// Constants
import { calculateStrategyStage, DEFAULT_PLAN_FORM } from '@/lib/constants/strategy';

const MotionBox = motion(Box);

function StrategyContent() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const router = useRouter();

  // State
  const [generating, setGenerating] = useState(false);
  const [strategyMode, setStrategyMode] = useState<StrategyMode>('guided');
  const [isClusterModalOpen, setIsClusterModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isKeywordModalOpen, setIsKeywordModalOpen] = useState(false);
  const hasAttemptedAutoDiscovery = useRef(false);

  // Load saved mode preference
  useEffect(() => {
    setStrategyMode(getSavedStrategyMode());
  }, []);

  // Use enhanced useProject hook with autoSelect
  const {
    projectId,
    strategyData,
    gscConnection,
    isLoading: projectLoading,
  } = useProject(null, { autoSelect: true });
  const typedProjectId = projectId as Id<'projects'> | null;

  // Mutations & Actions
  const createKeywordsMutation = useMutation(api.seo.keywords.createKeywords);
  const generateClustersAction = useAction(api.seo.keywordActions.generateClusters);
  const generateKeywordsFromUrlAction = useAction(api.seo.keywordActions.generateKeywordsFromUrl);
  const generatePlanAction = useAction((api as any).content.quarterlyPlanActions.generatePlan);

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
      const goalPayload: { traffic?: number; leads?: number } = {};
      if (formData.trafficGoal) goalPayload.traffic = parseInt(formData.trafficGoal, 10);
      if (formData.leadsGoal) goalPayload.leads = parseInt(formData.leadsGoal, 10);
      await generatePlanAction({
        projectId: typedProjectId,
        contentVelocity: formData.contentVelocity,
        startDate: new Date(formData.startDate).getTime(),
        goals: Object.keys(goalPayload).length ? goalPayload : undefined,
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
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleAddKeyword = async (keyword: string) => {
    if (!typedProjectId) return;
    try {
      await createKeywordsMutation({ projectId: typedProjectId, keywords: [{ keyword }] });
    } catch (e) {
      console.error(e);
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
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container
        maxW="container.xl"
        py={{ base: 8, md: 12 }}
        px={{ base: 4, sm: 6, md: 8, lg: 12 }}
      >
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HStack justify="space-between" flexWrap="wrap" gap={4}>
              <VStack align="start" spacing={1}>
                <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">
                  SEO Strategy
                </Heading>
                <Text color="gray.600">AI-powered content planning and keyword insights</Text>
              </VStack>
              <StrategyModeToggle mode={strategyMode} onModeChange={setStrategyMode} />
            </HStack>
          </MotionBox>

          {/* DIY Mode Dashboard */}
          {strategyMode === 'diy' && (
            <StrategyDashboard
              projectId={projectId}
              keywordCount={keywordCount}
              clusterCount={clusterCount}
              planExists={!!plan}
              briefCount={briefCount}
              draftCount={draftCount}
              onImportKeywords={() => setIsKeywordModalOpen(true)}
              onAddKeyword={handleAddKeyword}
              existingKeywords={existingKeywords}
              onGenerateClusters={handleGenerateClusters}
              onGeneratePlan={() => setIsPlanModalOpen(true)}
              onStartWizard={() => setStrategyMode('guided')}
              clusters={clusters.map((c: any) => ({
                _id: c._id,
                clusterName: c.clusterName,
                keywords: c.keywords || [],
                intent: c.intent || 'informational',
                status: c.status || 'active',
              }))}
              briefs={(plan?.briefs || []).map((b: any) => ({
                _id: b._id,
                title: b.title,
                status: b.status,
                scheduledDate: b.scheduledDate,
              }))}
              isGenerating={generating}
            />
          )}

          {/* Guided Mode Stepper */}
          {strategyMode === 'guided' && (
            <>
              <StrategyStepper currentStage={currentStage} />
              <NextStepCard
                stage={currentStage}
                keywordCount={keywordCount}
                clusterCount={clusterCount}
                briefCount={briefCount}
                draftCount={draftCount}
                isLoading={generating}
                onAction={() => {
                  if (currentStage === 1) setIsKeywordModalOpen(true);
                  else if (currentStage === 2) setIsClusterModalOpen(true);
                  else if (currentStage === 3) setIsPlanModalOpen(true);
                  else if (currentStage === 4 && plan?.briefs?.[0]?._id)
                    window.location.href = `/content?briefId=${plan.briefs[0]._id}`;
                }}
              />
              <SkipWizardLink onClick={() => setStrategyMode('diy')} />
            </>
          )}

          {/* Quick Actions */}
          {(strategyMode === 'diy' || currentStage >= 2) && (
            <HStack spacing={3} justify={strategyMode === 'diy' ? 'flex-start' : 'flex-end'}>
              <Tooltip
                label={keywordCount < 10 ? 'Add at least 10 keywords first' : ''}
                isDisabled={keywordCount >= 10}
                hasArrow
              >
                <Button
                  onClick={() => setIsClusterModalOpen(true)}
                  variant={strategyMode === 'diy' ? 'solid' : 'outline'}
                  bg={strategyMode === 'diy' ? 'brand.orange' : undefined}
                  color={strategyMode === 'diy' ? 'white' : undefined}
                  leftIcon={<Icon as={FiLayers} />}
                  isDisabled={keywordCount < 10}
                >
                  Generate Topic Clusters
                </Button>
              </Tooltip>
              <Tooltip
                label={clusterCount === 0 ? 'Generate topic clusters first' : ''}
                isDisabled={clusterCount > 0}
                hasArrow
              >
                <Button
                  bg="brand.orange"
                  color="white"
                  onClick={() => setIsPlanModalOpen(true)}
                  isDisabled={clusters.length === 0}
                  leftIcon={<Icon as={FiCalendar} />}
                >
                  Generate Quarterly Plan
                </Button>
              </Tooltip>
            </HStack>
          )}

          {/* Keywords Preview */}
          {typedProjectId && keywordCount > 0 && (
            <KeywordsPreview projectId={typedProjectId} maxPreview={15} />
          )}

          {/* Stats */}
          <StrategyStatCards
            clusterCount={clusterCount}
            briefCount={briefCount}
            contentVelocity={plan?.contentVelocity || 0}
            keywordCount={keywordCount}
          />

          {/* Insights */}
          {typedProjectId && (
            <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
              <InsightList
                projectId={typedProjectId}
                type="cluster_suggestion"
                title="Cluster Suggestions"
                maxItems={4}
                columns={1}
              />
              <InsightList
                projectId={typedProjectId}
                type="brief_suggestion"
                title="Brief Ideas"
                maxItems={4}
                columns={1}
              />
            </Grid>
          )}

          <Divider />

          {/* Plan Summary */}
          {plan && <PlanSummaryCard plan={plan} />}

          {/* Calendar */}
          {plan?.briefs && (
            <ContentCalendarCard briefs={plan.briefs} contentVelocity={plan.contentVelocity} />
          )}

          {/* Clusters Grid */}
          <ClusterGrid clusters={clusters} maxDisplay={6} />

          {/* Modals */}
          <GeneratePlanModal
            isOpen={isPlanModalOpen}
            onClose={() => setIsPlanModalOpen(false)}
            onGenerate={handleGeneratePlan}
            isLoading={generating}
          />
          <GenerateClustersModal
            isOpen={isClusterModalOpen}
            onClose={() => setIsClusterModalOpen(false)}
            onGenerate={handleGenerateClusters}
            isLoading={generating}
          />
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

export default function StrategyPage() {
  return (
    <Suspense fallback={<StrategySkeleton />}>
      <StrategyContent />
    </Suspense>
  );
}
