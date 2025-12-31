'use client';

/**
 * AuthProvider
 *
 * Wraps protected routes to enforce authentication.
 * Shows loading state while checking auth, redirects to login if not authenticated.
 *
 * Usage in layout.tsx:
 * ```tsx
 * import { AuthProvider } from '@/src/providers/AuthProvider';
 *
 * export default function ProtectedLayout({ children }) {
 *   return <AuthProvider>{children}</AuthProvider>;
 * }
 * ```
 */

import { type FC, type ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, VStack, Spinner, Text } from '@chakra-ui/react';
import { useAuth } from '@/lib/useAuth';

type Props = {
  children: ReactNode;
  /** Custom redirect path when not authenticated. Default: '/auth/login' */
  loginRedirect?: string;
  /** Allow users still in onboarding. Default: false (will redirect to /onboarding) */
  allowOnboarding?: boolean;
  /** Custom loading message */
  loadingMessage?: string;
  /** Use dark theme for loading state */
  darkMode?: boolean;
};

export const AuthProvider: FC<Props> = ({
  children,
  loginRedirect = '/auth/login',
  allowOnboarding = false,
  loadingMessage = 'Loading...',
  darkMode = false,
}) => {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();

  // Handle redirects
  useEffect(() => {
    if (loading) return;

    // Not authenticated - redirect to login
    if (!isAuthenticated || !user) {
      router.replace(loginRedirect);
      return;
    }

    // User hasn't completed onboarding and we don't allow it
    if (!allowOnboarding && user.onboardingStatus !== 'completed') {
      router.replace('/onboarding');
      return;
    }
  }, [loading, isAuthenticated, user, allowOnboarding, loginRedirect, router]);

  // Loading state
  if (loading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={darkMode ? '#0D0D0D' : 'brand.light'}
      >
        <VStack spacing={4}>
          <Spinner
            size="xl"
            color={darkMode ? 'orange.400' : 'brand.orange'}
            thickness="4px"
            speed="0.8s"
          />
          <Text color={darkMode ? 'gray.400' : 'gray.600'}>{loadingMessage}</Text>
        </VStack>
      </Box>
    );
  }

  // Not authenticated - show loading while redirecting
  if (!isAuthenticated || !user) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={darkMode ? '#0D0D0D' : 'brand.light'}
      >
        <VStack spacing={4}>
          <Spinner size="xl" color={darkMode ? 'orange.400' : 'brand.orange'} thickness="4px" />
          <Text color={darkMode ? 'gray.400' : 'gray.600'}>Redirecting to login...</Text>
        </VStack>
      </Box>
    );
  }

  // User needs onboarding
  if (!allowOnboarding && user.onboardingStatus !== 'completed') {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={darkMode ? '#0D0D0D' : 'brand.light'}
      >
        <VStack spacing={4}>
          <Spinner size="xl" color={darkMode ? 'orange.400' : 'brand.orange'} thickness="4px" />
          <Text color={darkMode ? 'gray.400' : 'gray.600'}>Completing setup...</Text>
        </VStack>
      </Box>
    );
  }

  // Authenticated - render children
  return <>{children}</>;
};
