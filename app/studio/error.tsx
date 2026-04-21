'use client';

/**
 * Studio Error Boundary
 *
 * Component Hierarchy:
 * App -> Studio Layout -> Error Boundary (this file)
 *
 * Catches runtime errors within the Content Studio route group.
 * Provides a branded recovery experience instead of bubbling up to the root error boundary.
 */

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Box, Container, Heading, Text, Button, VStack, Icon } from '@chakra-ui/react';
import { FiAlertTriangle, FiRefreshCw, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const MotionBox = motion(Box);

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function StudioError({ error, reset }: Props) {
  const router = useRouter();

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <Container maxW="container.md" h="80vh" display="flex" alignItems="center" justifyContent="center">
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={6} textAlign="center">
          <Box
            bg="red.50"
            p={5}
            borderRadius="full"
          >
            <Icon as={FiAlertTriangle} boxSize={10} color="red.400" />
          </Box>

          <VStack spacing={2}>
            <Heading size="lg" color="gray.800">
              Something went wrong in the Studio
            </Heading>
            <Text color="gray.500" maxW="md">
              An unexpected error occurred while loading this page.
              Please try again or return to the dashboard.
            </Text>
          </VStack>

          {error.digest && (
            <Text fontSize="xs" color="gray.400" fontFamily="mono">
              Error ID: {error.digest}
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
              leftIcon={<FiArrowLeft />}
              onClick={() => router.push('/studio')}
            >
              Back to Dashboard
            </Button>
          </VStack>
        </VStack>
      </MotionBox>
    </Container>
  );
}
