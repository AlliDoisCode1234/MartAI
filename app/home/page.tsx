'use client';

/**
 * Home Page - Redirect
 *
 * Redirects to /dashboard (unified experience).
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <Box
      minH="calc(100vh - 64px)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="brand.light"
    >
      <VStack spacing={3}>
        <Spinner size="lg" color="orange.500" />
        <Text color="gray.600">Redirecting to dashboard...</Text>
      </VStack>
    </Box>
  );
}
