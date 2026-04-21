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

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, VStack, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/lib/useAuth';

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
  const { logout } = useAuth();
  const user = useQuery(api.users.me);

  // Track how long we've waited for auth state to settle
  const [waitAttempts, setWaitAttempts] = useState(0);
  const [userNullRetries, setUserNullRetries] = useState(0);
  const MAX_WAIT_ATTEMPTS = 5; // 5 seconds max wait
  const MAX_USER_NULL_RETRIES = 2; // 2 extra seconds for DB sync

  const logDebug = (...args: any[]) => {
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true') {
      console.log('[AuthCallback]', ...args);
    }
  };

  useEffect(() => {
    logDebug('State:', {
      authLoading,
      isAuthenticated,
      waitAttempts,
      user: user === undefined ? 'loading' : user === null ? 'null' : 'exists',
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'ssr',
    });

    // Wait for auth to load
    if (authLoading) return;

    // If not authenticated yet, wait with timeout before redirecting
    if (!isAuthenticated) {
      if (waitAttempts < MAX_WAIT_ATTEMPTS) {
        const timer = setTimeout(() => {
          setWaitAttempts((prev) => prev + 1);
        }, 1000);
        return () => clearTimeout(timer);
      }

      console.warn('[AuthCallback] Auth timeout, redirecting to login');
      // After max attempts, redirect to login with error indicator
      logout('/auth/login?error=auth_timeout').catch(() => {
        window.location.href = '/auth/login?error=auth_timeout';
      });
      return;
    }

    logDebug(`Auth confirmed after ${waitAttempts} attempts`);

    // Wait for user data to load
    if (user === undefined) {
      logDebug('Waiting for user data...');
      return;
    }

    // User authenticated but no user record found
    if (user === null) {
      if (userNullRetries < MAX_USER_NULL_RETRIES) {
        logDebug(`No user record yet, waiting (retry ${userNullRetries + 1}/${MAX_USER_NULL_RETRIES})...`);
        const timer = setTimeout(() => {
          setUserNullRetries((prev) => prev + 1);
        }, 1000);
        return () => clearTimeout(timer);
      }

      // ── Login-intent gate ──────────────────────────────────
      let authFlow = 'signup';
      try {
        authFlow = sessionStorage.getItem('authFlow') || 'signup';
        sessionStorage.removeItem('authFlow');
      } catch {
        logDebug('sessionStorage unavailable');
      }

      if (authFlow === 'login') {
        console.warn('[AuthCallback] Login-intent gate: no existing account, redirecting to signup');
        logout('/auth/signup?error=no_account').catch(() => {
          window.location.href = '/auth/signup?error=no_account';
        });
        return;
      }

      logDebug('No user record after wait, passing to onboarding');
      router.replace('/onboarding');
      return;
    }

    // Route based on onboarding status
    if (user.onboardingStatus !== 'completed') {
      logDebug('Onboarding incomplete, redirecting to onboarding');
      router.replace('/onboarding');
      return;
    }

    try {
      const savedReturnTo = sessionStorage.getItem('authReturnTo');
      sessionStorage.removeItem('authFlow');
      if (savedReturnTo) {
        sessionStorage.removeItem('authReturnTo');
        if (savedReturnTo.startsWith('/') && !savedReturnTo.startsWith('//')) {
          logDebug('Redirecting to saved returnTo');
          router.replace(savedReturnTo);
          return;
        } else {
          console.warn('[AuthCallback] Blocked suspicious returnTo value');
        }
      }
    } catch {
      logDebug('sessionStorage unavailable');
    }

    logDebug('User found, redirecting to dashboard');
    router.replace('/studio');
  }, [authLoading, isAuthenticated, user, router, waitAttempts, userNullRetries, logout]);

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
