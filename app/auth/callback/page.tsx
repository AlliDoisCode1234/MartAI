'use client';

/**
 * OAuth Callback Page
 *
 * Component Hierarchy:
 * App → Auth → Callback (this file)
 *
 * This page is the target of OAuth redirects. It checks if the user
 * has completed onboarding and routes them accordingly:
 * - New users → /onboarding
 * - Returning users → /dashboard
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, VStack, Spinner, Text } from '@chakra-ui/react';
import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const user = useQuery(api.users.me);

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) return;

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }

    // Wait for user data to load
    if (user === undefined) return;

    // User authenticated but no user record found - treat as new user needing onboarding
    // This can happen when Convex Auth creates the auth account but user table entry
    // doesn't exist or has schema issues
    if (user === null) {
      router.replace('/onboarding');
      return;
    }

    // Route based on onboarding status
    if (user.onboardingStatus === 'completed') {
      router.replace('/dashboard');
    } else {
      router.replace('/onboarding');
    }
  }, [authLoading, isAuthenticated, user, router]);

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="brand.light">
      <VStack spacing={4}>
        <Spinner size="xl" color="brand.orange" thickness="4px" speed="0.8s" />
        <Text color="gray.600">Setting up your account...</Text>
      </VStack>
    </Box>
  );
}
