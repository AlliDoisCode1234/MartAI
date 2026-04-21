'use client';

/**
 * Admin Portal Error Boundary
 *
 * Component Hierarchy:
 * App -> Admin Layout -> Error Boundary (this file)
 *
 * Catches runtime errors within the Admin Portal route group.
 * Provides admin-appropriate error context with Error ID for debugging.
 */

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Box, Container, Heading, Text, Button, VStack, Icon, Code } from '@chakra-ui/react';
import { FiAlertTriangle, FiRefreshCw, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const MotionBox = motion(Box);

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: Props) {
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
          <Box bg="red.50" p={5} borderRadius="full">
            <Icon as={FiAlertTriangle} boxSize={10} color="red.400" />
          </Box>

          <VStack spacing={2}>
            <Heading size="lg" color="gray.800">
              Admin Portal Error
            </Heading>
            <Text color="gray.500" maxW="md">
              An unexpected error occurred in the admin portal.
              Please verify any pending changes.
            </Text>
          </VStack>

          {error.digest && (
            <Code fontSize="xs" colorScheme="red" px={3} py={1} borderRadius="md">
              Error ID: {error.digest}
            </Code>
          )}

          <Text fontSize="sm" color="gray.400" maxW="sm">
            {process.env.NODE_ENV === 'development' ? error.message : 'Detailed error logs have been captured.'}
          </Text>

          <VStack spacing={3} w="full" maxW="xs">
            <Button
              w="full"
              size="lg"
              colorScheme="red"
              leftIcon={<FiRefreshCw />}
              onClick={reset}
            >
              Retry
            </Button>
            <Button
              w="full"
              size="md"
              variant="ghost"
              color="gray.600"
              leftIcon={<FiArrowLeft />}
              onClick={() => router.push('/admin')}
            >
              Back to Admin Dashboard
            </Button>
          </VStack>
        </VStack>
      </MotionBox>
    </Container>
  );
}
