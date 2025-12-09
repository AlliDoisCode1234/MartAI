'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Progress,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  Badge,
  Spinner,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/lib/useAuth';
import {
  FiArrowRight,
  FiArrowLeft,
  FiCheck,
  FiZap,
  FiTrendingUp,
  FiStar,
  FiGlobe,
  FiCreditCard,
} from 'react-icons/fi';
import { MartCharacter, MartLoader } from '@/src/components/assistant';

const MotionBox = motion(Box);

// Plan options for step 2
const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$49/mo',
    description: '1 website, basic analytics',
    features: ['1 Website', 'Basic SEO Audit', 'Weekly Reports'],
    color: 'blue',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$99/mo',
    description: '3 websites, full features',
    features: ['3 Websites', 'Full SEO Suite', 'Daily Sync', 'AI Briefs'],
    color: 'purple',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$199/mo',
    description: 'Unlimited, priority support',
    features: ['Unlimited Websites', 'Priority Support', 'Custom Reports', 'API Access'],
    color: 'orange',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('growth');
  const [formData, setFormData] = useState({
    businessName: '',
    website: '',
    ga4PropertyId: '',
    gscSiteUrl: '',
  });

  const createProject = useMutation(api.projects.projects.createProject);
  const completeOnboarding = useMutation(api.users.completeOnboarding);
  const updateOnboardingStep = useMutation(api.onboarding.updateOnboardingStep);
  const createOnboardingProspect = useMutation(api.prospects.prospects.createOnboardingProspect);
  const updateOnboardingProspect = useMutation(api.prospects.prospects.updateOnboardingProspect);
  const convertProspectToUser = useMutation(api.prospects.prospects.convertProspectToUser);

  // Track prospect ID for auto-save and conversion
  const [prospectId, setProspectId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Track project ID for OAuth (project created early in step 3)
  const [projectId, setProjectId] = useState<string | null>(null);
  const [ga4Connected, setGa4Connected] = useState(false);

  // Track signup completed on mount (user landed on onboarding)
  useEffect(() => {
    if (isAuthenticated && user && step === 1) {
      updateOnboardingStep({ step: 'signupCompleted', value: true }).catch(console.error);
    }
  }, [isAuthenticated, user]);

  // Redirect if not authenticated or already onboarded
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }

    if (user && user.onboardingStatus === 'completed') {
      router.replace('/home');
    }
  }, [isAuthenticated, authLoading, router, user]);

  const nextStep = async () => {
    // Track step transitions
    if (step === 2 && selectedPlan) {
      await updateOnboardingStep({ step: 'planSelected', value: selectedPlan }).catch(
        console.error
      );
    }
    if (step === 3) {
      // Track payment step completion (even if skipped for now)
      await updateOnboardingStep({ step: 'paymentCompleted', value: true }).catch(console.error);
    }
    setStep((s) => Math.min(s + 1, 5));
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      if (!user || !formData.website) {
        throw new Error('Please fill in all required fields');
      }

      // Normalize website URL
      let websiteUrl = formData.website.trim();
      if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
        websiteUrl = 'https://' + websiteUrl;
      }

      // Create project
      const projectId = await createProject({
        name: formData.businessName || 'My Business',
        websiteUrl: websiteUrl,
      });

      if (projectId) {
        // Track project created
        await updateOnboardingStep({ step: 'projectCreated', value: true }).catch(console.error);
        await completeOnboarding();
        localStorage.setItem('currentProjectId', projectId);
        router.push('/onboarding/reveal');
      } else {
        throw new Error('Failed to create project');
      }
    } catch (err: any) {
      let msg = err instanceof Error ? err.message : 'Something went wrong.';
      if (msg.includes('LIMIT_REACHED')) {
        msg = msg.replace('LIMIT_REACHED:', '').trim();
      }
      setError(msg);
      setLoading(false);
    }
  };

  if (!isAuthenticated || authLoading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="brand.light">
        <MartLoader message="Loading..." />
      </Box>
    );
  }

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  return (
    <Box minH="100vh" bg="brand.light" py={12}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          {/* Progress Bar */}
          <Box>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" color="gray.500">
                Step {step} of {totalSteps}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {Math.round(progress)}% complete
              </Text>
            </HStack>
            <Progress
              value={progress}
              size="sm"
              colorScheme="orange"
              borderRadius="full"
              bg="gray.200"
            />
          </Box>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {/* Step 1: Welcome + Website URL (Combined) */}
            {step === 1 && (
              <MotionBox
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Box bg="white" p={8} borderRadius="2xl" shadow="lg">
                  <VStack spacing={6} align="stretch">
                    <HStack spacing={4} align="start">
                      <Box flexShrink={0}>
                        <MartCharacter size="md" />
                      </Box>
                      <Box>
                        <Heading size="lg" mb={2}>
                          Welcome to MartAI
                        </Heading>
                        <Text color="gray.600">
                          I'm Mart, your AI marketing manager. Enter your website below and I'll
                          analyze it to find keyword opportunities and create your SEO strategy.
                        </Text>
                      </Box>
                    </HStack>

                    <VStack spacing={4} align="stretch" pt={4}>
                      <FormControl>
                        <FormLabel>Business Name (optional)</FormLabel>
                        <Input
                          placeholder="e.g., Acme Corp"
                          value={formData.businessName}
                          onChange={(e) => {
                            setFormData({ ...formData, businessName: e.target.value });
                            setIsDirty(true);
                          }}
                          size="lg"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Website URL</FormLabel>
                        <Input
                          placeholder="https://yourwebsite.com"
                          value={formData.website}
                          onChange={(e) => {
                            setFormData({ ...formData, website: e.target.value });
                            setIsDirty(true);
                          }}
                          size="lg"
                        />
                      </FormControl>
                    </VStack>

                    <Button
                      colorScheme="orange"
                      size="lg"
                      rightIcon={<FiArrowRight />}
                      onClick={async () => {
                        if (!formData.website || !user?.email) return;

                        setLoading(true);
                        try {
                          // Create prospect (captures lead before paywall)
                          const newProspectId = await createOnboardingProspect({
                            email: user.email,
                            companyName: formData.businessName || undefined,
                            websiteUrl: formData.website,
                            source: 'onboarding',
                          });
                          setProspectId(newProspectId);
                          setIsDirty(false);

                          // Track step and advance
                          await updateOnboardingStep({
                            step: 'signupCompleted',
                            value: true,
                          }).catch(console.error);
                          nextStep();
                        } catch (err) {
                          console.error('Failed to create prospect:', err);
                          // Still allow advancing even if prospect creation fails
                          nextStep();
                        } finally {
                          setLoading(false);
                        }
                      }}
                      isDisabled={!formData.website}
                      isLoading={loading}
                      px={8}
                    >
                      Analyze My Site
                    </Button>
                  </VStack>
                </Box>
              </MotionBox>
            )}

            {/* Step 2: Plan Selection */}
            {step === 2 && (
              <MotionBox
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Box bg="white" p={8} borderRadius="2xl" shadow="lg">
                  <VStack spacing={6} align="stretch">
                    <Box textAlign="center">
                      <Icon as={FiStar} boxSize={8} color="brand.orange" mb={2} />
                      <Heading size="lg" mb={2}>
                        Choose Your Plan
                      </Heading>
                      <Text color="gray.600">
                        Select the plan that fits your needs. You can upgrade anytime.
                      </Text>
                    </Box>

                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                      {PLANS.map((plan) => (
                        <Card
                          key={plan.id}
                          cursor="pointer"
                          onClick={() => setSelectedPlan(plan.id)}
                          borderWidth="2px"
                          borderColor={selectedPlan === plan.id ? `${plan.color}.500` : 'gray.200'}
                          bg={selectedPlan === plan.id ? `${plan.color}.50` : 'white'}
                          _hover={{ borderColor: `${plan.color}.300` }}
                          transition="all 0.2s"
                          position="relative"
                        >
                          {plan.popular && (
                            <Badge
                              position="absolute"
                              top={-2}
                              right={-2}
                              colorScheme="purple"
                              px={2}
                              py={1}
                              borderRadius="full"
                              fontSize="xs"
                            >
                              Popular
                            </Badge>
                          )}
                          <CardBody>
                            <VStack spacing={3} align="stretch">
                              <Heading size="md" color={`${plan.color}.600`}>
                                {plan.name}
                              </Heading>
                              <Text fontSize="2xl" fontWeight="bold">
                                {plan.price}
                              </Text>
                              <Text fontSize="sm" color="gray.500">
                                {plan.description}
                              </Text>
                              <VStack align="start" spacing={1} pt={2}>
                                {plan.features.map((f) => (
                                  <HStack key={f} spacing={2}>
                                    <Icon as={FiCheck} color="green.500" boxSize={4} />
                                    <Text fontSize="sm">{f}</Text>
                                  </HStack>
                                ))}
                              </VStack>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>

                    <HStack justify="space-between" pt={4}>
                      <Button variant="ghost" leftIcon={<FiArrowLeft />} onClick={prevStep}>
                        Back
                      </Button>
                      <Button
                        colorScheme="orange"
                        rightIcon={<FiArrowRight />}
                        onClick={nextStep}
                        size="lg"
                      >
                        Continue
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              </MotionBox>
            )}

            {/* Step 3: Paywall Placeholder */}
            {step === 3 && (
              <MotionBox
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Box bg="white" p={8} borderRadius="2xl" shadow="lg" textAlign="center">
                  <VStack spacing={6}>
                    <Icon as={FiCreditCard} boxSize={12} color="brand.orange" />
                    <Heading size="lg">Complete Your Subscription</Heading>
                    <Text color="gray.600" maxW="400px">
                      You selected the{' '}
                      <strong>{PLANS.find((p) => p.id === selectedPlan)?.name}</strong> plan. Enter
                      your payment details to continue.
                    </Text>

                    {/* Placeholder payment form */}
                    <Box
                      w="full"
                      p={6}
                      bg="gray.50"
                      borderRadius="lg"
                      borderWidth="2px"
                      borderStyle="dashed"
                      borderColor="gray.300"
                    >
                      <VStack spacing={3}>
                        <Icon as={FiCreditCard} boxSize={8} color="gray.400" />
                        <Text color="gray.500" fontWeight="medium">
                          Payment Integration
                        </Text>
                        <Text color="gray.400" fontSize="sm">
                          Stripe checkout will be integrated here
                        </Text>
                      </VStack>
                    </Box>

                    <HStack justify="space-between" w="full" pt={4}>
                      <Button variant="ghost" leftIcon={<FiArrowLeft />} onClick={prevStep}>
                        Back
                      </Button>
                      <Button
                        colorScheme="orange"
                        rightIcon={<FiArrowRight />}
                        onClick={async () => {
                          setLoading(true);
                          try {
                            // Create project now so we have projectId for OAuth in step 4
                            if (!projectId && formData.website) {
                              let websiteUrl = formData.website.trim();
                              if (
                                !websiteUrl.startsWith('http://') &&
                                !websiteUrl.startsWith('https://')
                              ) {
                                websiteUrl = 'https://' + websiteUrl;
                              }

                              const newProjectId = await createProject({
                                name: formData.businessName || 'My Business',
                                websiteUrl: websiteUrl,
                              });

                              if (newProjectId) {
                                setProjectId(newProjectId);
                                localStorage.setItem('currentProjectId', newProjectId);
                                await updateOnboardingStep({
                                  step: 'paymentCompleted',
                                  value: true,
                                }).catch(console.error);
                                await updateOnboardingStep({
                                  step: 'projectCreated',
                                  value: true,
                                }).catch(console.error);
                              }
                            }
                            nextStep();
                          } catch (err) {
                            console.error('Failed to create project:', err);
                            // Continue anyway, project can be created later
                            nextStep();
                          } finally {
                            setLoading(false);
                          }
                        }}
                        size="lg"
                        isLoading={loading}
                      >
                        Continue (Skip for now)
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              </MotionBox>
            )}

            {/* Step 4: GA4/GSC Connection Wizard */}
            {step === 4 && (
              <MotionBox
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Box bg="white" p={8} borderRadius="2xl" shadow="lg">
                  <VStack spacing={6} align="stretch">
                    <Box textAlign="center">
                      <Badge colorScheme="orange" mb={2}>
                        Preliminary Score Ready!
                      </Badge>
                      <Heading size="lg" mb={2}>
                        Boost Your MR Score
                      </Heading>
                      <Text color="gray.600">
                        Connect Google Analytics to unlock accurate traffic data and improve your
                        MartAI Rating by up to 30%.
                      </Text>
                    </Box>

                    {/* Value Prop Card */}
                    <Card bg="orange.50" borderWidth="1px" borderColor="orange.200">
                      <CardBody>
                        <HStack spacing={4}>
                          <Icon as={FiTrendingUp} boxSize={8} color="orange.500" />
                          <Box>
                            <Text fontWeight="semibold">Why Connect GA4?</Text>
                            <Text fontSize="sm" color="gray.600">
                              Real traffic data lets Mart understand your actual audience, find
                              better keywords, and create more targeted content strategies.
                            </Text>
                          </Box>
                        </HStack>
                      </CardBody>
                    </Card>

                    {/* GA4 Connection Button */}
                    <VStack spacing={4} align="stretch">
                      {ga4Connected ? (
                        <Box
                          p={4}
                          bg="green.50"
                          borderRadius="lg"
                          borderWidth="1px"
                          borderColor="green.200"
                        >
                          <HStack spacing={3}>
                            <Icon as={FiCheck} boxSize={6} color="green.500" />
                            <Box>
                              <Text fontWeight="semibold" color="green.700">
                                Google Analytics Connected
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                Your GA4 data will be used to enhance your MR Score
                              </Text>
                            </Box>
                          </HStack>
                        </Box>
                      ) : (
                        <Button
                          size="lg"
                          variant="outline"
                          colorScheme="blue"
                          leftIcon={
                            <Box as="svg" viewBox="0 0 24 24" w={5} h={5} fill="currentColor">
                              <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                              />
                              <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                              />
                              <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                              />
                              <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                              />
                            </Box>
                          }
                          onClick={async () => {
                            if (!projectId) {
                              alert('Project not created yet. Please go back and try again.');
                              return;
                            }

                            // Open OAuth popup - request both GA4+GSC scopes at once
                            const popup = window.open(
                              `/api/oauth/google?type=both&projectId=${projectId}`,
                              'google-oauth',
                              'width=500,height=600,scrollbars=yes'
                            );

                            // Listen for popup close to check if connection succeeded
                            const checkPopup = setInterval(() => {
                              if (popup?.closed) {
                                clearInterval(checkPopup);
                                // Mark both GA4 and GSC as connected
                                setGa4Connected(true);
                                updateOnboardingStep({ step: 'ga4Connected', value: true }).catch(
                                  console.error
                                );
                                updateOnboardingStep({ step: 'gscConnected', value: true }).catch(
                                  console.error
                                );
                              }
                            }, 1000);
                          }}
                          isDisabled={!projectId}
                        >
                          Connect with Google
                        </Button>
                      )}

                      <Text fontSize="xs" color="gray.500" textAlign="center">
                        {ga4Connected
                          ? 'Connected! You can manage this in the Integrations page later.'
                          : projectId
                            ? 'Sign in with the Google account linked to your Analytics & Search Console.'
                            : 'Creating your project... Please wait.'}
                      </Text>
                    </VStack>

                    {/* Visual Info */}
                    <Box
                      p={4}
                      bg="blue.50"
                      borderRadius="lg"
                      borderWidth="1px"
                      borderColor="blue.200"
                    >
                      <VStack spacing={2}>
                        <Icon as={FiZap} boxSize={6} color="blue.500" />
                        <Text fontWeight="medium" color="blue.700">
                          What you'll get with GA4 connected:
                        </Text>
                        <VStack fontSize="sm" color="gray.600" spacing={1}>
                          <Text>→ Real traffic data instead of estimates</Text>
                          <Text>→ Accurate user behavior insights</Text>
                          <Text>→ Up to 30% more accurate MR Score</Text>
                        </VStack>
                      </VStack>
                    </Box>

                    <VStack spacing={3} pt={4}>
                      <HStack justify="space-between" w="full">
                        <Button variant="ghost" leftIcon={<FiArrowLeft />} onClick={prevStep}>
                          Back
                        </Button>
                        <Button
                          colorScheme="orange"
                          rightIcon={<FiArrowRight />}
                          onClick={async () => {
                            setStep(5);
                            // Project already created in step 3, just complete onboarding
                            await completeOnboarding();
                            router.push('/onboarding/reveal');
                          }}
                          size="lg"
                        >
                          {ga4Connected ? 'Continue' : 'Continue without GA4'}
                        </Button>
                      </HStack>

                      {/* Discouraged skip option */}
                      {!ga4Connected && (
                        <Text
                          fontSize="xs"
                          color="gray.400"
                          textAlign="center"
                          cursor="pointer"
                          _hover={{ color: 'gray.500' }}
                          onClick={async () => {
                            setStep(5);
                            await completeOnboarding();
                            router.push('/onboarding/reveal');
                          }}
                        >
                          Skip for now (you'll miss out on accurate analytics)
                        </Text>
                      )}
                    </VStack>
                  </VStack>
                </Box>
              </MotionBox>
            )}

            {/* Step 5: Processing */}
            {step === 5 && (
              <MotionBox
                key="step5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Box bg="white" p={12} borderRadius="2xl" shadow="lg" textAlign="center">
                  <VStack spacing={6}>
                    <MartCharacter state="loading" size="lg" showBubble={false} />
                    <Heading size="lg">Mart is analyzing your site...</Heading>
                    <Text color="gray.600">
                      Finding keywords, analyzing competitors, and building your strategy.
                    </Text>
                    <HStack spacing={4} pt={4}>
                      <Badge colorScheme="green" px={3} py={1}>
                        <HStack spacing={1}>
                          <FiZap />
                          <Text>Crawling pages</Text>
                        </HStack>
                      </Badge>
                      <Badge colorScheme="blue" px={3} py={1}>
                        <HStack spacing={1}>
                          <FiTrendingUp />
                          <Text>Finding keywords</Text>
                        </HStack>
                      </Badge>
                    </HStack>
                  </VStack>
                </Box>
              </MotionBox>
            )}
          </AnimatePresence>
        </VStack>
      </Container>
    </Box>
  );
}
