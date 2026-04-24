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

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, VStack, Box, useToast } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { useMutation, useAction, useConvex, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useAuth } from '@/lib/useAuth';
import { MartLoader } from '@/src/components/assistant';

// Onboarding components
import {
  OnboardingProgress,
  WelcomeStep,
  PlanSelectionStep,
  PaymentStep,
  IntegrationStep,
} from '@/src/components/onboarding';

// Constants
import { getUserEmail, cacheUserEmail } from '@/lib/constants/onboarding';

export function OnboardingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { isAuthenticated, user, loading: authLoading, logout } = useAuth();
  const convex = useConvex();

  // State
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('starter');
  const [formData, setFormData] = useState({
    businessName: '',
    website: '',
    industry: '',
    customIndustry: '',
    targetAudience: '',
    businessGoals: '',
  });
  const [projectId, setProjectId] = useState<string | null>(null);
  const [ga4Connected, setGa4Connected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // TEMPORARY OVERRIDE: Skip billing for ALL users to unblock testing
  // Original: Boolean(user?.isBetaUser || user?.isQATester || user?.membershipTier);
  const skipPricing = true;

  // Mutations & Actions
  const createProject = useMutation(api.projects.projects.createProject);
  const completeOnboarding = useMutation(api.users.completeOnboarding);
  const updateOnboardingStep = useMutation(api.onboarding.updateOnboardingStep);
  const updateMultipleSteps = useMutation(api.onboarding.updateMultipleSteps);
  const createOnboardingProspect = useMutation(api.prospects.prospects.createOnboardingProspect);
  const generateAuthUrl = useAction(api.integrations.google.generateAuthUrl);
  const startOnboardingOrchestration = useMutation(api.workflowTriggers.startOnboardingOrchestration);

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

      // Auto-populate industry from Gamification/PLG drop if exists
      const pendingIndustry = localStorage.getItem('martAI_pending_industry');
      if (pendingIndustry) {
        setFormData((prev) => ({ ...prev, industry: pendingIndustry }));
        // Clean it up so it only happens once
        localStorage.removeItem('martAI_pending_industry');
      }
    }
  }, [isAuthenticated, user, step, updateOnboardingStep]);

  // ONE-SHOT step restoration on initial load
  // Computes the correct step from onboardingSteps flags when the page first loads.
  // Uses a ref to prevent re-firing — after initial restore, step is driven by user interaction only.
  const hasRestoredStep = useRef(false);
  useEffect(() => {
    if (hasRestoredStep.current) return;

    // Check URL step first (e.g., returning from OAuth with ?step=4)
    const urlStep = searchParams?.get('step');
    if (urlStep) {
      const parsed = parseInt(urlStep, 10);
      if (parsed >= 1 && parsed <= 5) {
        setStep(parsed);
        hasRestoredStep.current = true;
        return;
      }
    }

    // Compute step from onboardingSteps boolean flags
    const steps = (user as Record<string, unknown>)?.onboardingSteps as
      | Record<string, boolean | string | number>
      | undefined;
    if (steps && Object.keys(steps).length > 0) {
      let computedStep = 1;
      if (steps.signupCompleted) computedStep = skipPricing ? 4 : 2;
      if (steps.planSelected) computedStep = skipPricing ? 4 : 3;
      if (steps.paymentCompleted || steps.projectCreated || steps.ga4Connected) computedStep = 4;

      if (computedStep > 1) {
        setStep(computedStep);
      }
      hasRestoredStep.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(user as Record<string, unknown>)?.onboardingSteps, searchParams]);

  // NOTE: Browser back button manual overrides were removed, but this component deliberately uses 
  // history.replaceState to sync ?step=N. This means browser back/forward navigation within the 
  // wizard is overwritten in history, intentionally maintaining a single linear progress state 
  // without back-button clutter.
  // Handle Stripe payment return during onboarding
  useEffect(() => {
    const payment = searchParams?.get('payment');
    if (payment === 'success') {
      toast({
        title: 'Payment successful!',
        description: 'Setting up your workspace...',
        status: 'success',
        duration: 3000,
      });
      // Clean URL and auto-advance (handleStep3Next creates the project)
      window.history.replaceState({}, '', '/onboarding?step=3');
      handleStep3Next();
    } else if (payment === 'canceled') {
      toast({
        title: 'Payment canceled',
        description: 'You can try again or skip for now.',
        status: 'info',
        duration: 4000,
      });
      window.history.replaceState({}, '', '/onboarding?step=3');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Handle OAuth callback when returning from Google
  useEffect(() => {
    const success = searchParams?.get('success');
    const ga4Property = searchParams?.get('ga4Property');
    const gscSite = searchParams?.get('gscSite');

    if (success === 'true') {
      // OAuth succeeded - update state
      setGa4Connected(true);

      // Restore projectId from session storage
      try {
        const storedProjectId = sessionStorage.getItem('onboarding_projectId');
        if (storedProjectId) setProjectId(storedProjectId);
      } catch {
        // Ignore in Safari private browsing
      }

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
          try {
            sessionStorage.setItem('onboarding_just_completed', 'true');
          } catch {}
          router.push('/studio');
        })
        .catch(console.error);
    } else if (success === 'false') {
      const error = searchParams?.get('error');
      // Set connection error state so IntegrationStep can show it
      setConnectionError(error || 'Connection failed');
      setStep(4); // Stay on step 4

      // Restore projectId from session storage
      try {
        const storedProjectId = sessionStorage.getItem('onboarding_projectId');
        if (storedProjectId) setProjectId(storedProjectId);
      } catch {
        // Ignore in Safari private browsing
      }

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
  // IMPORTANT: Only check auth state here, NOT user data.
  // user === undefined means the query is still loading, not that no user exists.
  // SKIP when returning from OAuth/payment flows — Convex auth needs time to reconnect.
  const isOAuthReturn = !!(
    searchParams?.get('success') ||
    searchParams?.get('setup') ||
    searchParams?.get('payment') ||
    searchParams?.get('ga4') ||
    searchParams?.get('gsc')
  );
  useEffect(() => {
    if (isOAuthReturn) return; // Don't redirect during OAuth callback processing
    if (!authLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [authLoading, isAuthenticated, router, isOAuthReturn]);

  // Edge case: authenticated but no user record in DB
  // Add a 3-second grace period to handle the race condition where Convex is still writing the user document
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (!authLoading && isAuthenticated && user === null) {
      console.log('[Onboarding] Authenticated but user is null. Waiting for Convex...');
      timeoutId = setTimeout(() => {
        console.warn('[Onboarding] User still null after timeout. Invalid session.');
        // Scrub the zombie session token before redirecting
        // Note: We call signOut directly instead of logout() to avoid
        // the double-navigation issue (logout() navigates to / first)
        logout()
          .catch(() => {
            /* sign-out may fail if session is already dead */
          })
          .finally(() => {
            // Use window.location to force a full reload and clear any cached states
            window.location.href = '/auth/login?error=session_invalid';
          });
      }, 3000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [authLoading, isAuthenticated, user, logout]);

  // Redirect completed users to dashboard
  useEffect(() => {
    if (!authLoading && user?.onboardingStatus === 'completed') {
      router.replace('/studio');
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
  if (!isAuthenticated) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="brand.light">
        <MartLoader message="Redirecting to login..." />
      </Box>
    );
  }

  // Guard 3: User data still loading from Convex query
  if (user === undefined) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="brand.light">
        <MartLoader message="Loading your account..." />
      </Box>
    );
  }

  // Guard 4: Authenticated but no user record (edge case - redirecting)
  if (user === null) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="brand.light">
        <MartLoader message="Setting up your account..." />
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

  // For beta: 1 -> 4
  // For regular users: 1 -> 2 -> 3 -> 4
  const nextStep = () => {
    setStep((s) => {
      if (skipPricing && s === 1) return 4; // Skip pricing/payment
      return Math.min(s + 1, 4);
    });
  };
  const prevStep = () => {
    setStep((s) => {
      if (skipPricing && s === 4) return 1; // Go back to step 1
      return Math.max(s - 1, 1);
    });
  };
  // Step 3: Create project and advance
  const createAndAdvanceProject = async () => {
    setLoading(true);
    try {
      if (!projectId && formData.website) {
        let websiteUrl = formData.website.trim();
        if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://'))
          websiteUrl = 'https://' + websiteUrl;
          
        let finalIndustry = formData.industry;
        if (finalIndustry === 'other' && formData.customIndustry) {
          finalIndustry = formData.customIndustry;
        }

        const newProjectId = await createProject({
          name: formData.businessName || 'My Business',
          websiteUrl,
          industry: finalIndustry || undefined,
          targetAudience: formData.targetAudience?.trim() || undefined,
          businessGoals: formData.businessGoals?.trim() || undefined,
          organizationId: user?.organizationId || undefined,
        });
        if (newProjectId) {
          setProjectId(newProjectId);
          try {
            localStorage.setItem('currentProjectId', newProjectId);
          } catch {
            // Ignore
          }
          // Batch both steps in ONE write to avoid write conflicts
          // Payment step is auto-completed for subsequent projects
          await updateMultipleSteps({
            steps: [
              { step: 'paymentCompleted', value: true },
              { step: 'projectCreated', value: true },
            ],
          }).catch(console.error);

          // FIRE-AND-FORGET: All generation happens in robust backend orchestrator
          // User proceeds immediately to GA4/GSC step
          startOnboardingOrchestration({
            projectId: newProjectId as Id<'projects'>,
          }).catch((err) => {
            console.error('[ONBOARDING] Failed to trigger durable orchestration:', err);
          });
        }
      }
    } catch (err) {
      console.error('Failed to create project:', err);
    } finally {
      setLoading(false);
    }
  };

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

      if (skipPricing) {
        // We skip straight to integrations, so we MUST create the project NOW
        await createAndAdvanceProject();
        nextStep(); // Advance to step 4!
      } else {
        nextStep();
      }
    } catch (err) {
      console.error('Failed to create prospect:', err);
      // Fallback
      if (skipPricing) {
         await createAndAdvanceProject();
         nextStep();
      } else {
         nextStep();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Next = async () => {
    if (!['starter', 'engine', 'agency', 'enterprise'].includes(selectedPlan)) {
      toast({
        title: 'Invalid Plan Selection',
        description: 'Please select a valid membership plan.',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    await updateOnboardingStep({ step: 'planSelected', value: selectedPlan }).catch(console.error);
    nextStep();
  };

  const handleStep3Next = async () => {
    await createAndAdvanceProject();
    nextStep();
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
        projectId: projectId as Id<'projects'>,
        returnTo: '/onboarding?step=4',
      });

      if (!authUrl) {
        alert('Failed to initiate GA4 connection');
        return;
      }

      // Save all state before redirect to prevent "Leave site?" warning
      try {
        sessionStorage.setItem('onboarding_projectId', projectId);
        sessionStorage.setItem('onboarding_step', '4');
        sessionStorage.setItem('onboarding_formData', JSON.stringify(formData));
      } catch {
        // Ignore in Safari private browsing
      }

      // Full page redirect - user will return to /onboarding?step=4&success=true after OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error('GA4 connection error:', error);
      alert('Failed to connect GA4: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleStep4Next = async () => {
    setLoading(true);

    try {
      // Fire-and-forget logic stripped here. 
      // Handled perfectly by backend orchestrator at Step 3 project creation.

      // Mark onboarding complete and redirect to dashboard
      await completeOnboarding();

      try {
        sessionStorage.setItem('onboarding_just_completed', 'true');
      } catch {}

      // Go directly to dashboard - content generation happens in background
      router.push('/studio');
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to finalize setup. Please try again.',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Main render (guards already handled above)
  return (
    <Box minH="100vh" bg="brand.light" py={12}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          <OnboardingProgress step={step} skipPricing={skipPricing} />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <WelcomeStep
                formData={formData}
                onFormChange={setFormData}
                onNext={handleStep1Next}
                loading={loading}
              />
            )}
            {step === 2 && !skipPricing && (
              <PlanSelectionStep
                selectedPlan={selectedPlan}
                onSelectPlan={setSelectedPlan}
                onNext={handleStep2Next}
                onBack={prevStep}
              />
            )}
            {step === 3 && !skipPricing && (
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
          </AnimatePresence>
        </VStack>
      </Container>
    </Box>
  );
}
