'use client';

/**
 * Onboarding Error Boundary
 *
 * Component Hierarchy:
 * App -> Onboarding Layout -> Error Boundary (this file)
 *
 * Catches runtime errors during the onboarding flow.
 * Critical: onboarding errors cause user abandonment. Provides clear recovery path.
 */

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Box, Container, Heading, Text, Button, VStack, Icon } from '@chakra-ui/react';
import { FiAlertTriangle, FiRefreshCw, FiLogIn } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const MotionBox = motion(Box);

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function OnboardingError({ error, reset }: Props) {
  const router = useRouter();

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <Container maxW="container.sm" h="80vh" display="flex" alignItems="center" justifyContent="center">
      <MotionBox
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <VStack spacing={6} textAlign="center">
          <Box
            bg="orange.50"
            p={5}
            borderRadius="full"
          >
            <Icon as={FiAlertTriangle} boxSize={10} color="orange.400" />
          </Box>

          <VStack spacing={2}>
            <Heading size="lg" color="gray.800">
              Onboarding Hit a Snag
            </Heading>
            <Text color="gray.500" maxW="md">
              We ran into an issue setting up your account.
              Your progress has been saved — let&apos;s try again.
            </Text>
          </VStack>

          {error.digest && (
            <Text fontSize="xs" color="gray.400" fontFamily="mono">
              Ref: {error.digest}
            </Text>
          )}

          <VStack spacing={3} w="full" maxW="xs">
            <Button
              w="full"
              size="lg"
              bgGradient="linear(to-r, brand.orange, brand.red)"
              color="white"
              leftIcon={<FiRefreshCw />}
              onClick={reset}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              transition="all 0.3s ease"
            >
              Continue Setup
            </Button>
            <Button
              w="full"
              size="md"
              variant="ghost"
              color="gray.600"
              leftIcon={<FiLogIn />}
              onClick={() => router.push('/auth/login')}
            >
              Back to Login
            </Button>
          </VStack>
        </VStack>
      </MotionBox>
    </Container>
  );
}
