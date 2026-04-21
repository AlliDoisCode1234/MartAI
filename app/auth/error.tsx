'use client';

/**
 * Auth Error Boundary
 *
 * Component Hierarchy:
 * App -> Auth Layout -> Error Boundary (this file)
 *
 * Catches runtime errors during authentication flows.
 * Provides clear recovery without exposing auth internals.
 */

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Box, Container, Heading, Text, Button, VStack, Icon } from '@chakra-ui/react';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const MotionBox = motion(Box);

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AuthError({ error, reset }: Props) {
  const router = useRouter();

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <Container maxW="container.sm" h="100vh" display="flex" alignItems="center" justifyContent="center">
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={6} textAlign="center" role="alert" aria-live="assertive">
          <Box bg="orange.50" p={5} borderRadius="full">
            <Icon as={FiAlertTriangle} boxSize={10} color="orange.400" />
          </Box>

          <VStack spacing={2}>
            <Heading size="lg" color="gray.800">
              Authentication Error
            </Heading>
            <Text color="gray.500" maxW="md">
              We couldn&apos;t complete the authentication process.
              Please try again or return to the home page.
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
              Try Again
            </Button>
            <Button
              w="full"
              size="md"
              variant="ghost"
              color="gray.600"
              leftIcon={<FiHome />}
              onClick={() => router.push('/')}
            >
              Back to Home
            </Button>
          </VStack>
        </VStack>
      </MotionBox>
    </Container>
  );
}
