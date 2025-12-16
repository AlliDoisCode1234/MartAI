'use client';

/**
 * PaymentStep Component
 *
 * Component Hierarchy:
 * App → Onboarding → PaymentStep (this file)
 *
 * Step 3: Payment placeholder.
 */

import { Box, VStack, HStack, Heading, Text, Icon, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiArrowLeft, FiCreditCard } from 'react-icons/fi';
import { PLANS } from '@/lib/constants/onboarding';

const MotionBox = motion(Box);

type Props = {
  selectedPlan: string;
  onNext: () => void;
  onBack: () => void;
  loading: boolean;
};

export function PaymentStep({ selectedPlan, onNext, onBack, loading }: Props) {
  const plan = PLANS.find((p) => p.id === selectedPlan);

  return (
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
            You selected the <strong>{plan?.name}</strong> plan. Enter your payment details to
            continue.
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
            <Button variant="ghost" leftIcon={<FiArrowLeft />} onClick={onBack}>
              Back
            </Button>
            <Button
              colorScheme="orange"
              rightIcon={<FiArrowRight />}
              onClick={onNext}
              size="lg"
              isLoading={loading}
            >
              Continue (Skip for now)
            </Button>
          </HStack>
        </VStack>
      </Box>
    </MotionBox>
  );
}
