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
  });

  const createProject = useMutation(api.projects.projects.createProject);
  const completeOnboarding = useMutation(api.users.completeOnboarding);
  const updateOnboardingStep = useMutation(api.onboarding.updateOnboardingStep);

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
            {/* Step 1: Welcome */}
            {step === 1 && (
              <MotionBox
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Box bg="white" p={8} borderRadius="2xl" shadow="lg" textAlign="center">
                  <VStack spacing={6}>
                    <MartCharacter
                      message="Hey there! 👋 I'm Mart, your AI marketing manager. Let's set up your SEO strategy in just a few minutes."
                      size="lg"
                    />
                    <Box pt={4}>
                      <Heading size="lg" mb={2}>
                        Welcome to MartAI
                      </Heading>
                      <Text color="gray.600">
                        I'll analyze your website, find keyword opportunities, and create a content
                        plan to grow your organic traffic.
                      </Text>
                    </Box>
                    <Button
                      colorScheme="orange"
                      size="lg"
                      rightIcon={<FiArrowRight />}
                      onClick={nextStep}
                      px={8}
                    >
                      Let's Get Started
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
                        onClick={nextStep}
                        size="lg"
                      >
                        Continue (Skip for now)
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              </MotionBox>
            )}

            {/* Step 4: Business + URL */}
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
                      <Icon as={FiGlobe} boxSize={8} color="brand.orange" mb={2} />
                      <Heading size="lg" mb={2}>
                        Add Your Website
                      </Heading>
                      <Text color="gray.600">
                        Give me your website URL and I'll start analyzing it.
                      </Text>
                    </Box>

                    {error && (
                      <Alert status="error" borderRadius="md">
                        <AlertIcon />
                        {error}
                      </Alert>
                    )}

                    <FormControl>
                      <FormLabel fontWeight="semibold">Business Name (optional)</FormLabel>
                      <Input
                        placeholder="e.g., Acme Bakery"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        size="lg"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel fontWeight="semibold">Website URL</FormLabel>
                      <Input
                        placeholder="yourwebsite.com"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        size="lg"
                      />
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        This is where Mart will focus the SEO analysis.
                      </Text>
                    </FormControl>

                    <HStack justify="space-between" pt={4}>
                      <Button variant="ghost" leftIcon={<FiArrowLeft />} onClick={prevStep}>
                        Back
                      </Button>
                      <Button
                        colorScheme="orange"
                        rightIcon={<FiArrowRight />}
                        onClick={() => {
                          if (formData.website) {
                            nextStep();
                            handleSubmit();
                          }
                        }}
                        size="lg"
                        isDisabled={!formData.website}
                      >
                        Analyze My Site
                      </Button>
                    </HStack>
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
