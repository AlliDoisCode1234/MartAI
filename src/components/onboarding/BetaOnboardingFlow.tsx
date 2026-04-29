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
  BetaWelcomeStep,
  PlanSelectionStep,
  PaymentStep,
  IntegrationStep,
} from '@/src/components/onboarding';

// Constants
import { getUserEmail, cacheUserEmail } from '@/lib/constants/onboarding';

export function BetaOnboardingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { isAuthenticated, user, loading: authLoading, logout } = useAuth();
  const convex = useConvex();

  // State (only 2 steps)
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
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

  // Mutations & Actions
  const createProject = useMutation(api.projects.projects.createProject);
  const completeOnboarding = useMutation(api.users.completeOnboarding);
  const updateOnboardingStep = useMutation(api.onboarding.updateOnboardingStep);
  const updateMultipleSteps = useMutation(api.onboarding.updateMultipleSteps);
  const createOnboardingProspect = useMutation(api.prospects.prospects.createOnboardingProspect);
  const generateAuthUrl = useAction(api.integrations.google.generateAuthUrl);
  const startOnboardingOrchestration = useMutation(api.workflowTriggers.startOnboardingOrchestration);

  const existingProjects = useQuery(api.projects.projects.list);

  useEffect(() => {
    if (existingProjects && existingProjects.length > 0 && !projectId) {
      const existingProject = existingProjects[0];
      setProjectId(existingProject._id);
      localStorage.setItem('currentProjectId', existingProject._id);

      if (existingProject.name) {
        setFormData((prev) => ({ ...prev, businessName: existingProject.name }));
      }
      if (existingProject.websiteUrl) {
        setFormData((prev) => ({ ...prev, website: existingProject.websiteUrl }));
      }
    }
  }, [existingProjects, projectId]);

  useEffect(() => {
    if (user?.email) cacheUserEmail(user.email);
  }, [user?.email]);

  useEffect(() => {
    if (isAuthenticated && user && step === 1) {
      updateOnboardingStep({ step: 'signupCompleted', value: true }).catch(console.error);

      const pendingIndustry = localStorage.getItem('martAI_pending_industry');
      if (pendingIndustry) {
        setFormData((prev) => ({ ...prev, industry: pendingIndustry }));
        localStorage.removeItem('martAI_pending_industry');
      }
    }
  }, [isAuthenticated, user, step, updateOnboardingStep]);

  const hasRestoredStep = useRef(false);
  const onboardingSteps = (user as Record<string, unknown>)?.onboardingSteps as
    | Record<string, boolean | string | number>
    | undefined;

  useEffect(() => {
    if (hasRestoredStep.current) return;

    const urlStep = searchParams?.get('step');
    if (urlStep) {
      const parsed = parseInt(urlStep, 10);
      if (parsed === 1 || parsed === 2) {
        setStep(parsed);
        hasRestoredStep.current = true;
        return;
      }
    }

    if (onboardingSteps && Object.keys(onboardingSteps).length > 0) {
      let computedStep = 1;
      if (onboardingSteps.signupCompleted) computedStep = 2; // skip straight to step 2

      if (computedStep > 1) {
        setStep(computedStep);
      }
      hasRestoredStep.current = true;
    }
  }, [onboardingSteps, searchParams]);

  useEffect(() => {
    const success = searchParams?.get('success');
    const ga4Property = searchParams?.get('ga4Property');
    const gscSite = searchParams?.get('gscSite');

    if (success === 'true') {
      setGa4Connected(true);

      try {
        const storedProjectId = sessionStorage.getItem('onboarding_projectId');
        if (storedProjectId) setProjectId(storedProjectId);
      } catch {}

      updateMultipleSteps({
        steps: [
          { step: 'ga4Connected', value: true },
          { step: 'gscConnected', value: !!gscSite },
        ],
      }).catch(console.error);

      toast({
        title: 'Connected!',
        description: `GA4${ga4Property ? ` (${ga4Property})` : ''} connected. Redirecting to dashboard...`,
        status: 'success',
        duration: 2000,
      });

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
      setConnectionError(error || 'Connection failed');
      setStep(2); 

      try {
        const storedProjectId = sessionStorage.getItem('onboarding_projectId');
        if (storedProjectId) setProjectId(storedProjectId);
      } catch {}

      window.history.replaceState({}, '', `/onboarding?step=2`);
    }
  }, [searchParams, toast, updateMultipleSteps, completeOnboarding, router]);

  useEffect(() => {
    const urlStep = searchParams?.get('step');
    const success = searchParams?.get('success');

    if (success) return;

    if (urlStep !== String(step)) {
      window.history.replaceState({}, '', `/onboarding?step=${step}`);
    }
  }, [step, searchParams]);

  const isOAuthReturn = !!(
    searchParams?.get('success') ||
    searchParams?.get('setup') ||
    searchParams?.get('ga4') ||
    searchParams?.get('gsc')
  );
  useEffect(() => {
    if (isOAuthReturn) return;
    if (!authLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [authLoading, isAuthenticated, router, isOAuthReturn]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (!authLoading && isAuthenticated && user === null) {
      timeoutId = setTimeout(() => {
        logout()
          .catch(() => {})
          .finally(() => {
            window.location.href = '/auth/login?error=session_invalid';
          });
      }, 3000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [authLoading, isAuthenticated, user, logout]);

  useEffect(() => {
    if (!authLoading && user?.onboardingStatus === 'completed') {
      router.replace('/studio');
    }
  }, [authLoading, user?.onboardingStatus, router]);

  if (authLoading) return <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="brand.light"><MartLoader message="Loading..." /></Box>;
  if (!isAuthenticated) return <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="brand.light"><MartLoader message="Redirecting to login..." /></Box>;
  if (user === undefined) return <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="brand.light"><MartLoader message="Loading your account..." /></Box>;
  if (user === null) return <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="brand.light"><MartLoader message="Setting up your account..." /></Box>;
  if (user.onboardingStatus === 'completed') return <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="brand.light"><MartLoader message="Welcome back! Redirecting..." /></Box>;

  const nextStep = () => {
    setStep((s) => Math.min(s + 1, 2));
  };
  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  const createAndAdvanceProject = async () => {
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
          } catch {}
          
          await updateMultipleSteps({
            steps: [
              { step: 'paymentCompleted', value: true },
              { step: 'projectCreated', value: true },
            ],
          }).catch(console.error);

          startOnboardingOrchestration({
            projectId: newProjectId as Id<'projects'>,
          }).catch((err) => {
            console.error('[ONBOARDING] Failed to trigger durable orchestration:', err);
          });
          
          return newProjectId;
        }
      }
    } catch (err) {
      console.error('Failed to create project:', err);
      throw err;
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
        source: 'onboarding_beta',
      });
      await updateOnboardingStep({ step: 'signupCompleted', value: true }).catch(console.error);

      await createAndAdvanceProject();
      nextStep();
    } catch (err) {
      console.error('Failed to create prospect:', err);
      try {
        await createAndAdvanceProject();
      } catch (err2) {
        console.error('Failed to fallback create project:', err2);
      }
      nextStep();
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!projectId) {
      alert('Project not created yet.');
      return;
    }

    setConnectionError(null);

    try {
      const authUrl = await generateAuthUrl({
        projectId: projectId as Id<'projects'>,
        returnTo: '/onboarding?step=2',
      });

      if (!authUrl) {
        alert('Failed to initiate GA4 connection');
        return;
      }

      try {
        sessionStorage.setItem('onboarding_projectId', projectId);
        sessionStorage.setItem('onboarding_step', '2');
        sessionStorage.setItem('onboarding_formData', JSON.stringify(formData));
      } catch {}

      window.location.href = authUrl;
    } catch (error) {
      console.error('GA4 connection error:', error);
      alert('Failed to connect GA4: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleStep2Next = async () => {
    setLoading(true);

    try {
      await completeOnboarding();

      try {
        sessionStorage.setItem('onboarding_just_completed', 'true');
      } catch {}

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

  return (
    <Box minH="100vh" bg="brand.light" py={12}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          <OnboardingProgress step={step} skipPricing={true} />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <BetaWelcomeStep
                formData={formData}
                onFormChange={setFormData}
                onNext={handleStep1Next}
                loading={loading}
              />
            )}
            {step === 2 && (
              <IntegrationStep
                projectId={projectId}
                ga4Connected={ga4Connected}
                connectionError={connectionError}
                onConnect={handleConnect}
                onNext={handleStep2Next}
                onSkip={handleStep2Next}
                onBack={prevStep}
              />
            )}
          </AnimatePresence>
        </VStack>
      </Container>
    </Box>
  );
}
