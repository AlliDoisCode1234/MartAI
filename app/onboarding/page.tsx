'use client';

/**
 * Onboarding Page
 *
 * Component Hierarchy:
 * App → Onboarding (this file)
 *
 * Multi-step wizard for new user onboarding.
 * Uses extracted step components for modularity.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, VStack, Box, useToast } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { useMutation, useAction, useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/lib/useAuth';
import { MartLoader } from '@/src/components/assistant';

// Onboarding components
import {
  OnboardingProgress,
  WelcomeStep,
  PlanSelectionStep,
  PaymentStep,
  IntegrationStep,
  ProcessingStep,
} from '@/src/components/onboarding';

// Constants
import { getUserEmail, cacheUserEmail } from '@/lib/constants/onboarding';

export default function OnboardingPage() {
  const router = useRouter();
  const toast = useToast();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const convex = useConvex();

  // State
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('growth');
  const [formData, setFormData] = useState({ businessName: '', website: '' });
  const [projectId, setProjectId] = useState<string | null>(null);
  const [ga4Connected, setGa4Connected] = useState(false);

  // Mutations & Actions
  const createProject = useMutation(api.projects.projects.createProject);
  const completeOnboarding = useMutation(api.users.completeOnboarding);
  const updateOnboardingStep = useMutation(api.onboarding.updateOnboardingStep);
  const createOnboardingProspect = useMutation(api.prospects.prospects.createOnboardingProspect);
  const generateKeywordsFromUrl = useAction(api.seo.keywordActions.generateKeywordsFromUrl);
  const generateClusters = useAction(api.seo.keywordActions.generateClusters);
  const generatePlan = useAction(api.content.quarterlyPlanActions.generatePlan);
  const generateBrief = useAction(api.content.briefActions.generateBrief);
  const generateDraft = useAction(api.content.draftActions.generateDraft);
  const generatePreliminaryScore = useMutation(
    api.analytics.martaiRatingQueries.generatePreliminaryScore
  );
  const generateContentCalendar = useAction(
    api.contentCalendar.generateCalendar.generateFullCalendar
  );

  // Cache email when user loads
  useEffect(() => {
    if (user?.email) cacheUserEmail(user.email);
  }, [user?.email]);

  // Track signup on mount
  useEffect(() => {
    if (isAuthenticated && user && step === 1) {
      updateOnboardingStep({ step: 'signupCompleted', value: true }).catch(console.error);
    }
  }, [isAuthenticated, user, step, updateOnboardingStep]);

  // Auth redirect
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }
    if (user?.onboardingStatus === 'completed') router.replace('/home');
  }, [isAuthenticated, authLoading, router, user]);

  // Prevent browser back button
  useEffect(() => {
    const preventBack = () => window.history.pushState(null, '', window.location.href);
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', preventBack);
    return () => window.removeEventListener('popstate', preventBack);
  }, []);

  // Persist/restore step
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('onboardingStep', step.toString());
  }, [step]);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('onboardingStep');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (parsed >= 1 && parsed <= 5) setStep(parsed);
      }
    }
  }, []);

  // Step handlers
  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // Step 1: Create prospect and advance
  const handleStep1Next = async () => {
    const email = getUserEmail(user);
    if (!formData.website || !email) return;
    setLoading(true);
    try {
      await createOnboardingProspect({
        email,
        companyName: formData.businessName || undefined,
        websiteUrl: formData.website,
        source: 'onboarding',
      });
      await updateOnboardingStep({ step: 'signupCompleted', value: true }).catch(console.error);
      nextStep();
    } catch (err) {
      console.error('Failed to create prospect:', err);
      nextStep();
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Track plan and advance
  const handleStep2Next = async () => {
    await updateOnboardingStep({ step: 'planSelected', value: selectedPlan }).catch(console.error);
    nextStep();
  };

  // Step 3: Create project and advance
  const handleStep3Next = async () => {
    setLoading(true);
    try {
      if (!projectId && formData.website) {
        let websiteUrl = formData.website.trim();
        if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://'))
          websiteUrl = 'https://' + websiteUrl;
        const newProjectId = await createProject({
          name: formData.businessName || 'My Business',
          websiteUrl,
        });
        if (newProjectId) {
          setProjectId(newProjectId);
          localStorage.setItem('currentProjectId', newProjectId);
          await updateOnboardingStep({ step: 'paymentCompleted', value: true }).catch(
            console.error
          );
          await updateOnboardingStep({ step: 'projectCreated', value: true }).catch(console.error);

          // FIRE-AND-FORGET: All generation happens in background
          // User proceeds immediately to GA4/GSC step
          (async () => {
            try {
              // Set status to generating
              await convex.mutation(api.projects.projects.updateProject, {
                projectId: newProjectId as any,
                generationStatus: 'generating',
              });

              console.log('[ONBOARDING DEBUG] Starting background generation...');
              console.log('[ONBOARDING DEBUG] Calling generateKeywordsFromUrl...');
              const kwResult = await generateKeywordsFromUrl({
                projectId: newProjectId as any,
                limit: 30,
              });
              console.log('[ONBOARDING DEBUG] generateKeywordsFromUrl SUCCESS:', kwResult);

              console.log('[ONBOARDING DEBUG] Calling generateClusters...');
              await generateClusters({ projectId: newProjectId as any });
              console.log('[ONBOARDING DEBUG] generateClusters completed');

              console.log('[ONBOARDING DEBUG] Calling generatePlan...');
              await generatePlan({
                projectId: newProjectId as any,
                contentVelocity: 2,
                startDate: Date.now(),
              });
              console.log('[ONBOARDING DEBUG] generatePlan completed - calendar ready!');

              // Auto-generate first brief content and draft
              console.log('[ONBOARDING DEBUG] Fetching first brief for auto-generation...');
              const briefs = await convex.query(api.content.briefs.getBriefsByProject, {
                projectId: newProjectId as any,
              });
              const firstBrief = briefs?.[0];
              if (firstBrief) {
                console.log('[ONBOARDING DEBUG] Generating brief content for:', firstBrief._id);
                await generateBrief({
                  briefId: firstBrief._id as any,
                  projectId: newProjectId as any,
                  clusterId: firstBrief.clusterId || undefined,
                });
                console.log('[ONBOARDING DEBUG] Brief content generated! Now generating draft...');
                await generateDraft({ briefId: firstBrief._id as any });
                console.log('[ONBOARDING DEBUG] Draft generated! Demo content ready.');
              }

              // Generate MR score
              console.log('[ONBOARDING DEBUG] Calling generatePreliminaryScore...');
              await generatePreliminaryScore({ projectId: newProjectId as any });
              console.log('[ONBOARDING DEBUG] All background generation complete!');

              // Set status to complete
              await convex.mutation(api.projects.projects.updateProject, {
                projectId: newProjectId as any,
                generationStatus: 'complete',
              });
            } catch (bgError) {
              console.warn('[ONBOARDING DEBUG] Background generation error:', bgError);
              // Set status to error
              await convex
                .mutation(api.projects.projects.updateProject, {
                  projectId: newProjectId as any,
                  generationStatus: 'error',
                })
                .catch(console.error);
            }
          })();
        }
      }
      nextStep();
    } catch (err) {
      console.error('Failed to create project:', err);
      nextStep();
    } finally {
      setLoading(false);
    }
  };

  // Step 4: GA4 connection
  const handleConnect = () => {
    if (!projectId) {
      alert('Project not created yet.');
      return;
    }
    const popup = window.open(
      `/api/oauth/google?type=both&projectId=${projectId}`,
      'google-oauth',
      'width=500,height=600,scrollbars=yes'
    );
    const checkPopup = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkPopup);
        setGa4Connected(true);
        updateOnboardingStep({ step: 'ga4Connected', value: true }).catch(console.error);
        updateOnboardingStep({ step: 'gscConnected', value: true }).catch(console.error);
      }
    }, 1000);
  };

  const handleStep4Next = async () => {
    setStep(5);

    // Fire-and-forget: Generate zero-click content calendar
    if (projectId) {
      (async () => {
        try {
          console.log('[ONBOARDING DEBUG] Generating zero-click content calendar...');
          const calendarResult = await generateContentCalendar({
            projectId: projectId as any,
            useGa4Gsc: ga4Connected,
          });
          console.log(
            `[ONBOARDING DEBUG] Calendar generated: ${calendarResult.itemsGenerated} items for ${calendarResult.industry} industry`
          );
        } catch (err) {
          console.warn('[ONBOARDING DEBUG] Calendar generation error:', err);
        }
      })();
    }

    await completeOnboarding();
    router.push('/onboarding/reveal');
  };

  // Loading state
  if (!isAuthenticated || authLoading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="brand.light">
        <MartLoader message="Loading..." />
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="brand.light" py={12}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          <OnboardingProgress step={step} />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <WelcomeStep
                formData={formData}
                onFormChange={setFormData}
                onNext={handleStep1Next}
                loading={loading}
              />
            )}
            {step === 2 && (
              <PlanSelectionStep
                selectedPlan={selectedPlan}
                onSelectPlan={setSelectedPlan}
                onNext={handleStep2Next}
                onBack={prevStep}
              />
            )}
            {step === 3 && (
              <PaymentStep
                selectedPlan={selectedPlan}
                onNext={handleStep3Next}
                onBack={prevStep}
                loading={loading}
              />
            )}
            {step === 4 && (
              <IntegrationStep
                projectId={projectId}
                ga4Connected={ga4Connected}
                onConnect={handleConnect}
                onNext={handleStep4Next}
                onSkip={handleStep4Next}
                onBack={prevStep}
              />
            )}
            {step === 5 && <ProcessingStep projectId={projectId} />}
          </AnimatePresence>
        </VStack>
      </Container>
    </Box>
  );
}
