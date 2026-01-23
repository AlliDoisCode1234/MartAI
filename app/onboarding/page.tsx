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
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, VStack, Box, useToast } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { useMutation, useAction, useConvex, useQuery } from 'convex/react';
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
  const searchParams = useSearchParams();
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
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Mutations & Actions
  const createProject = useMutation(api.projects.projects.createProject);
  const completeOnboarding = useMutation(api.users.completeOnboarding);
  const updateOnboardingStep = useMutation(api.onboarding.updateOnboardingStep);
  const updateMultipleSteps = useMutation(api.onboarding.updateMultipleSteps);
  const createOnboardingProspect = useMutation(api.prospects.prospects.createOnboardingProspect);
  const generateKeywordsFromUrl = useAction(api.seo.keywordActions.generateKeywordsFromUrl);
  const generateClusters = useAction(api.seo.keywordActions.generateClusters);
  // NOTE: Old briefActions and quarterlyPlanActions removed - use generateContentCalendar instead
  const generateAuthUrl = useAction(api.integrations.google.generateAuthUrl);
  const generatePreliminaryScore = useMutation(
    api.analytics.martaiRatingQueries.generatePreliminaryScore
  );
  const generateContentCalendar = useAction(
    api.contentCalendar.generateCalendar.generateFullCalendar
  );

  // Query for existing projects - if user has one, use it instead of creating new
  // Using projects.list which gets userId from auth context (no args needed)
  const existingProjects = useQuery(api.projects.projects.list);

  // Restore existing project if user has one (prevents LIMIT_REACHED on retry)
  useEffect(() => {
    if (existingProjects && existingProjects.length > 0 && !projectId) {
      const existingProject = existingProjects[0];
      console.log('[ONBOARDING] Restoring existing project:', existingProject._id);
      setProjectId(existingProject._id);
      localStorage.setItem('currentProjectId', existingProject._id);

      // Also restore form data from the existing project
      if (existingProject.name) {
        setFormData((prev) => ({ ...prev, businessName: existingProject.name }));
      }
      if (existingProject.websiteUrl) {
        setFormData((prev) => ({ ...prev, website: existingProject.websiteUrl }));
      }
    }
  }, [existingProjects, projectId]);

  // Cache email when user loads
  useEffect(() => {
    if (user?.email) cacheUserEmail(user.email);
  }, [user?.email]);

  // Track signup on mount (only when authenticated and on step 1)
  useEffect(() => {
    if (isAuthenticated && user && step === 1) {
      updateOnboardingStep({ step: 'signupCompleted', value: true }).catch(console.error);
    }
  }, [isAuthenticated, user, step, updateOnboardingStep]);

  // Restore step from user's onboardingStep in DB if available
  // BUT: URL step takes precedence (e.g., coming back from OAuth with ?step=4)
  useEffect(() => {
    // Check if URL has a step param - that takes priority
    const urlStep = searchParams?.get('step');
    if (urlStep) {
      const parsed = parseInt(urlStep, 10);
      if (parsed >= 1 && parsed <= 5) {
        setStep(parsed);
        return; // Don't override with DB value
      }
    }

    // Fall back to DB step if no URL step
    if (user?.onboardingStep && typeof user.onboardingStep === 'number') {
      const dbStep = user.onboardingStep;
      if (dbStep >= 1 && dbStep <= 5 && dbStep !== step) {
        setStep(dbStep);
      }
    }
  }, [user?.onboardingStep, searchParams]);

  // Prevent browser back button during onboarding
  useEffect(() => {
    const preventBack = () => window.history.pushState(null, '', window.location.href);
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', preventBack);
    return () => window.removeEventListener('popstate', preventBack);
  }, []);

  // Handle OAuth callback when returning from Google
  useEffect(() => {
    const success = searchParams?.get('success');
    const ga4Property = searchParams?.get('ga4Property');
    const gscSite = searchParams?.get('gscSite');

    if (success === 'true') {
      // OAuth succeeded - update state
      setGa4Connected(true);

      // Restore projectId from session storage
      const storedProjectId = sessionStorage.getItem('onboarding_projectId');
      if (storedProjectId) setProjectId(storedProjectId);

      // Update onboarding steps in DB
      updateMultipleSteps({
        steps: [
          { step: 'ga4Connected', value: true },
          { step: 'gscConnected', value: !!gscSite },
        ],
      }).catch(console.error);

      // Show success toast
      toast({
        title: 'Connected!',
        description: `GA4${ga4Property ? ` (${ga4Property})` : ''} connected. Redirecting to dashboard...`,
        status: 'success',
        duration: 2000,
      });

      // Complete onboarding and redirect to dashboard
      completeOnboarding()
        .then(() => {
          router.push('/dashboard');
        })
        .catch(console.error);
    } else if (success === 'false') {
      const error = searchParams?.get('error');
      // Set connection error state so IntegrationStep can show it
      setConnectionError(error || 'Connection failed');
      setStep(4); // Stay on step 4

      // Restore projectId from session storage
      const storedProjectId = sessionStorage.getItem('onboarding_projectId');
      if (storedProjectId) setProjectId(storedProjectId);

      // Clear URL params but keep step
      window.history.replaceState({}, '', `/onboarding?step=4`);
    }
  }, [searchParams, toast, updateMultipleSteps, completeOnboarding, router]);

  // Sync URL with current step
  useEffect(() => {
    const urlStep = searchParams?.get('step');
    const success = searchParams?.get('success');

    // Don't update URL if we're processing OAuth callback
    if (success) return;

    // Only update if URL step doesn't match current step
    if (urlStep !== String(step)) {
      window.history.replaceState({}, '', `/onboarding?step=${step}`);
    }
  }, [step, searchParams]);

  // NOTE: Step number (1-4) is a UI concept. Individual onboarding completions
  // (signupCompleted, planSelected, etc.) are tracked separately via mutations.
  // We don't need to persist the current step number to the database.

  // ==========================================================================
  // REDIRECT HANDLING (via useEffect, not during render)
  // ==========================================================================

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user)) {
      router.replace('/auth/login');
    }
  }, [authLoading, isAuthenticated, user, router]);

  // Redirect completed users to dashboard
  useEffect(() => {
    if (!authLoading && user?.onboardingStatus === 'completed') {
      router.replace('/dashboard');
    }
  }, [authLoading, user?.onboardingStatus, router]);

  // ==========================================================================
  // LOADING STATE GUARDS (render loading UI while redirecting)
  // ==========================================================================

  // Guard 1: Still loading auth
  if (authLoading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="brand.light">
        <MartLoader message="Loading..." />
      </Box>
    );
  }

  // Guard 2: Not authenticated - show loading while useEffect redirects
  if (!isAuthenticated || !user) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="brand.light">
        <MartLoader message="Redirecting to login..." />
      </Box>
    );
  }

  // Guard 3: Already completed onboarding - show loading while useEffect redirects
  if (user.onboardingStatus === 'completed') {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="brand.light">
        <MartLoader message="Welcome back! Redirecting..." />
      </Box>
    );
  }

  // ==========================================================================
  // Step handlers (only reached if guards pass)
  // ==========================================================================

  // Beta users skip pricing (step 2) and payment (step 3) - they get solo tier
  const isBetaUser = user?.isBetaUser ?? false;

  // For beta users: 1 -> 4 -> 5 (skip 2-3)
  // For regular users: 1 -> 2 -> 3 -> 4 -> 5
  const nextStep = () => {
    setStep((s) => {
      if (isBetaUser && s === 1) return 4; // Skip pricing/payment for beta
      return Math.min(s + 1, 5);
    });
  };
  const prevStep = () => {
    setStep((s) => {
      if (isBetaUser && s === 4) return 1; // Go back to step 1 for beta
      return Math.max(s - 1, 1);
    });
  };

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
          // Batch both steps in ONE write to avoid write conflicts
          await updateMultipleSteps({
            steps: [
              { step: 'paymentCompleted', value: true },
              { step: 'projectCreated', value: true },
            ],
          }).catch(console.error);

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

              // Generate content calendar using the working system
              console.log('[ONBOARDING DEBUG] Calling generateContentCalendar...');
              const calendarResult = await generateContentCalendar({
                projectId: newProjectId as any,
                useGa4Gsc: false, // GA4/GSC not connected yet at this step
              });
              console.log(
                `[ONBOARDING DEBUG] Calendar generated: ${calendarResult.itemsGenerated} items for ${calendarResult.industry} industry`
              );

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

  // Step 4: GA4 connection - full page redirect (more reliable than popup)
  const handleConnect = async () => {
    if (!projectId) {
      alert('Project not created yet.');
      return;
    }

    // Clear any previous error
    setConnectionError(null);

    try {
      // Generate auth URL with returnTo so callback redirects back to onboarding
      const authUrl = await generateAuthUrl({
        projectId: projectId as any,
        returnTo: '/onboarding?step=4',
      });

      if (!authUrl) {
        alert('Failed to initiate GA4 connection');
        return;
      }

      // Save all state before redirect to prevent "Leave site?" warning
      sessionStorage.setItem('onboarding_projectId', projectId);
      sessionStorage.setItem('onboarding_step', '4');
      sessionStorage.setItem('onboarding_formData', JSON.stringify(formData));

      // Full page redirect - user will return to /onboarding?step=4&success=true after OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error('GA4 connection error:', error);
      alert('Failed to connect GA4: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleStep4Next = async () => {
    setLoading(true);

    // Fire-and-forget: Generate zero-click content calendar in background
    if (projectId) {
      (async () => {
        try {
          console.log('[ONBOARDING] Generating zero-click content calendar...');
          const calendarResult = await generateContentCalendar({
            projectId: projectId as any,
            useGa4Gsc: ga4Connected,
          });
          console.log(
            `[ONBOARDING] Calendar generated: ${calendarResult.itemsGenerated} items for ${calendarResult.industry} industry`
          );
        } catch (err) {
          console.warn('[ONBOARDING] Calendar generation error:', err);
        }
      })();
    }

    // Mark onboarding complete and redirect to dashboard
    await completeOnboarding();

    // Go directly to dashboard - content generation happens in background
    router.push('/dashboard');
  };

  // Main render (guards already handled above)
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
            {step === 2 && !isBetaUser && (
              <PlanSelectionStep
                selectedPlan={selectedPlan}
                onSelectPlan={setSelectedPlan}
                onNext={handleStep2Next}
                onBack={prevStep}
              />
            )}
            {step === 3 && !isBetaUser && (
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
                connectionError={connectionError}
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
