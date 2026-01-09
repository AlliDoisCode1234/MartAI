'use client';

/**
 * OAuth Callback Page
 *
 * Component Hierarchy:
 * App → Auth → Callback (this file)
 *
 * Premium "Authenticating..." screen inspired by Vercel's OAuth flow.
 * This page handles OAuth redirects and routes users based on their status:
 * - New users → /onboarding
 * - Returning users → /dashboard
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, VStack, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

// Subtle pulse animation for the loader
const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(0.95); }
`;

// Gradient animation for the background
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Spinner dots animation
const dotPulse = keyframes`
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
`;

export default function AuthCallbackPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const user = useQuery(api.users.me);

  useEffect(() => {
    // Debug logging
    console.log('[AuthCallback] State:', {
      authLoading,
      isAuthenticated,
      user: user === undefined ? 'loading' : user === null ? 'null' : 'exists',
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'ssr',
    });

    // Wait for auth to load
    if (authLoading) return;

    // Check if we're on phoo.ai domain (requires /v1 prefix for app routes)
    const isPhooAi =
      typeof window !== 'undefined' &&
      (window.location.hostname.includes('phoo.ai') ||
        window.location.hostname.includes('phoo-ai'));

    // Route prefix for phoo.ai domain
    const routePrefix = isPhooAi ? '/v1' : '';

    console.log('[AuthCallback] Routing decision:', { isPhooAi, routePrefix, isAuthenticated });

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      console.log('[AuthCallback] Not authenticated, redirecting to login');
      router.replace(`${routePrefix}/auth/login`);
      return;
    }

    // Wait for user data to load
    if (user === undefined) {
      console.log('[AuthCallback] Waiting for user data...');
      return;
    }

    // User authenticated but no user record found - treat as new user needing onboarding
    if (user === null) {
      console.log('[AuthCallback] No user record, redirecting to onboarding');
      router.replace(`${routePrefix}/onboarding`);
      return;
    }

    // Route based on onboarding status
    const destination =
      user.onboardingStatus === 'completed'
        ? `${routePrefix}/dashboard`
        : `${routePrefix}/onboarding`;

    console.log('[AuthCallback] User found, redirecting to:', destination);
    router.replace(destination);
  }, [authLoading, isAuthenticated, user, router]);

  // Timeout fallback - if stuck for more than 10 seconds, force redirect
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('[AuthCallback] Timeout reached, forcing redirect');
      const isPhooAi =
        typeof window !== 'undefined' &&
        (window.location.hostname.includes('phoo.ai') ||
          window.location.hostname.includes('phoo-ai'));
      const routePrefix = isPhooAi ? '/v1' : '';
      router.replace(`${routePrefix}/onboarding`);
    }, 7000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="linear-gradient(-45deg, #0a0a0a, #1a1a2e, #16213e, #0f0f23)"
      backgroundSize="400% 400%"
      animation={`${gradientShift} 15s ease infinite`}
      position="relative"
      overflow="hidden"
    >
      {/* Subtle radial glow */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        width="600px"
        height="600px"
        borderRadius="50%"
        background="radial-gradient(circle, rgba(249, 159, 42, 0.08) 0%, transparent 70%)"
        pointerEvents="none"
      />

      {/* Main content card */}
      <VStack
        spacing={8}
        p={12}
        borderRadius="24px"
        bg="rgba(255, 255, 255, 0.03)"
        backdropFilter="blur(20px)"
        border="1px solid rgba(255, 255, 255, 0.08)"
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.4)"
        animation={`${pulse} 3s ease-in-out infinite`}
        zIndex={1}
      >
        {/* Custom dot loader */}
        <Box display="flex" gap={3}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              w="12px"
              h="12px"
              borderRadius="50%"
              bg="#F99F2A"
              animation={`${dotPulse} 1.4s ease-in-out infinite`}
              style={{ animationDelay: `${i * 0.16}s` }}
            />
          ))}
        </Box>

        {/* Text */}
        <VStack spacing={2}>
          <Text fontSize="xl" fontWeight="600" color="white" letterSpacing="-0.02em">
            Authenticating...
          </Text>
          <Text fontSize="sm" color="rgba(255, 255, 255, 0.5)" fontWeight="400">
            Securing your session
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
}
