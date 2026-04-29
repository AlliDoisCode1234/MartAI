'use client';

/**
 * PaymentStep Component
 *
 * Component Hierarchy:
 * App → Onboarding → PaymentStep (this file)
 *
 * Step 3: Stripe checkout for selected plan.
 * Redirects to Stripe Checkout, then returns to onboarding on success.
 */

import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Icon,
  Button,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiArrowLeft, FiCreditCard, FiCheck, FiShield } from 'react-icons/fi';
import { useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { PLANS } from '@/lib/constants/onboarding';
import { BRAND } from '@/lib/constants/brand';

const MotionBox = motion(Box);

// Stripe Price IDs for onboarding (monthly only — annual upsell can happen post-onboarding)
// Feb 2026: Lead Generation System pricing pivot
const STRIPE_PRICE_IDS: Record<string, string> = {
  starter: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY || '',
  engine: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENGINE_MONTHLY || '',
  agency: process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY_MONTHLY || '',
};

type Props = {
  selectedPlan: string;
  onNext: () => void;
  onBack: () => void;
  loading: boolean;
};

export function PaymentStep({ selectedPlan, onNext, onBack, loading }: Props) {
  const plan = PLANS.find((p) => p.id === selectedPlan);
  const toast = useToast();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const createCheckout = useAction(api.stripe.checkout.createSubscriptionCheckout);
  const skipBillingForTesting = useMutation(api.onboarding.skipBillingForTesting);

  const handleSkipBilling = async () => {
    const qaBypassCode = window.prompt('Enter QA Bypass Code to skip billing in production:');
    
    if (!qaBypassCode) {
      return; // User cancelled or entered empty string
    }

    setCheckoutLoading(true);
    try {
      await skipBillingForTesting({ planTier: selectedPlan, qaBypassCode });
      onNext();
    } catch (error) {
      toast({
        title: 'Skip Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      });
      setCheckoutLoading(false);
    }
  };

  const handleCheckout = async () => {
    // Enterprise plan — contact sales
    if (selectedPlan === 'enterprise') {
      window.location.href = `mailto:${BRAND.supportEmail}?subject=Enterprise Plan Inquiry`;
      return;
    }

    const priceId = STRIPE_PRICE_IDS[selectedPlan];
    if (!priceId) {
      toast({
        title: 'Coming soon',
        description: 'Stripe checkout is being configured. Please check back shortly.',
        status: 'info',
        duration: 4000,
      });
      return;
    }

    setCheckoutLoading(true);
    try {
      const result = await createCheckout({
        priceId,
        successUrl: `${window.location.origin}/onboarding?step=3&payment=success`,
        cancelUrl: `${window.location.origin}/onboarding?step=3&payment=canceled`,
      });
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      toast({
        title: 'Checkout unavailable',
        description: error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Extract price number for display
  const priceNum = plan?.price?.replace('/mo', '') || '';

  return (
    <MotionBox
      key="step3"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <Box bg="white" p={8} borderRadius="2xl" shadow="lg">
        <VStack spacing={6}>
          {/* Header */}
          <VStack spacing={2} textAlign="center">
            <Icon as={FiCreditCard} boxSize={10} color="brand.orange" />
            <Heading size="lg">Complete Your Subscription</Heading>
            <Text color="gray.500" fontSize="sm">
              Review your plan and proceed to secure checkout
            </Text>
          </VStack>

          {/* Compact plan card */}
          <Box
            w="full"
            maxW="380px"
            mx="auto"
            p={5}
            borderRadius="xl"
            bg="linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%)"
            borderWidth="1px"
            borderColor="gray.200"
          >
            {/* Plan name + price */}
            <HStack justify="space-between" mb={3}>
              <VStack align="start" spacing={0}>
                <Text
                  fontSize="xs"
                  fontWeight="600"
                  color="gray.400"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Selected Plan
                </Text>
                <Heading size="md" color="gray.800">
                  {plan?.name}
                </Heading>
              </VStack>
              <VStack align="end" spacing={0}>
                <Text fontSize="2xl" fontWeight="800" color="gray.800" lineHeight="1">
                  {priceNum}
                </Text>
                <Text fontSize="xs" color="gray.400">
                  /month
                </Text>
              </VStack>
            </HStack>

            <Divider borderColor="gray.200" mb={3} />

            {/* Features — compact two-column on wider views */}
            <VStack align="start" spacing={1.5}>
              {plan?.features?.map((f) => (
                <HStack key={f} spacing={2}>
                  <Icon as={FiCheck} color="green.500" boxSize={3.5} flexShrink={0} />
                  <Text fontSize="sm" color="gray.600">
                    {f}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </Box>

          {/* CTA */}
          <VStack spacing={3} w="full" maxW="380px" mx="auto">
            <Button
              colorScheme="orange"
              size="lg"
              w="full"
              rightIcon={<FiArrowRight />}
              onClick={handleCheckout}
              isLoading={checkoutLoading || loading}
              loadingText="Redirecting to checkout..."
              borderRadius="xl"
              py={7}
              fontSize="md"
              fontWeight="700"
              _hover={{ transform: 'translateY(-1px)', shadow: 'lg' }}
              transition="all 0.2s"
            >
              {selectedPlan === 'enterprise' ? 'Contact Sales' : 'Subscribe & Continue'}
            </Button>

            <Button
              variant="outline"
              colorScheme="gray"
              size="sm"
              w="full"
              onClick={handleSkipBilling}
              isLoading={checkoutLoading}
            >
              Skip Billing (QA / Testing Only)
            </Button>

            {/* Trust signal */}
            <HStack spacing={1.5} color="gray.400">
              <Icon as={FiShield} boxSize={3.5} />
              <Text fontSize="xs">Secured by Stripe. Cancel anytime.</Text>
            </HStack>
          </VStack>

          {/* Navigation */}
          <HStack justify="flex-start" w="full" pt={2}>
            <Button variant="ghost" leftIcon={<FiArrowLeft />} onClick={onBack} size="sm">
              Back
            </Button>
          </HStack>
        </VStack>
      </Box>
    </MotionBox>
  );
}
