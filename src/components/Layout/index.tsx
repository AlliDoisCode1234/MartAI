'use client';

/**
 * Layout Component
 *
 * Component Hierarchy:
 * App → Layout (this file)
 *   ├── Navigation
 *   ├── SkipLink (Accessibility)
 *   ├── MainContent
 *   ├── PhooFab (bottom-left chat FAB)
 *   └── PhooChatDrawer (guest marketing)
 */

import { type FC, type ReactNode, useEffect } from 'react';
import { Box, useDisclosure, Spinner, VStack, Text } from '@chakra-ui/react';
import { usePathname, useRouter } from 'next/navigation';
import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Navigation } from '../Navigation';
import { PhooFab, PhooChatDrawer } from '@/src/components/phoo';
import { SkipLink, MainContent } from '@/src/lib/accessibility';

type Props = {
  children: ReactNode;
};

// Routes that don't require onboarding completion
const PUBLIC_ROUTES = [
  '/',
  '/auth',
  '/onboarding',
  '/admin',
  '/apply',
  '/thank-you',
  '/pricing',
  '/about',
  '/invite',
  '/join', // phoo.ai waitlist page
  '/privacy', // Google OAuth verification
  '/terms', // Google OAuth verification
];

// Routes that bypass the entire app shell (no Navigation, no Phoo)
// These render raw children for full control over styling
const STANDALONE_ROUTES = ['/', '/join', '/auth/callback', '/auth/login', '/privacy', '/terms'];

export const Layout: FC<Props> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const user = useQuery(api.users.me);

  // PhooFab drawer state for guest users
  const { isOpen: isDrawerOpen, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure();

  // Check if current route is public (doesn't require onboarding)
  const isPublicRoute = PUBLIC_ROUTES.some((p) => pathname === p || pathname?.startsWith(p + '/'));

  // Check if current route is standalone (bypasses app shell entirely)
  const isStandaloneRoute = STANDALONE_ROUTES.some(
    (p) => pathname === p || pathname?.startsWith(p + '/')
  );

  // Redirect logic for unauthenticated users
  // NOTE: Only redirects when NOT authenticated. Does NOT re-trigger on navigation.
  useEffect(() => {
    if (authLoading) return;
    if (isPublicRoute) return;
    if (isStandaloneRoute) return;

    // CRITICAL: If authenticated, do nothing - let user navigate freely
    if (isAuthenticated) return;

    // Not authenticated - redirect to appropriate page
    const isPhooAi =
      typeof window !== 'undefined' &&
      (window.location.hostname.includes('phoo.ai') ||
        window.location.hostname.includes('phoo-ai'));

    if (isPhooAi) {
      router.replace('/join');
    } else {
      router.replace('/auth/login');
    }
  }, [authLoading, isAuthenticated, isPublicRoute, isStandaloneRoute, router]);

  // Separate effect for onboarding redirect (only for authenticated users)
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) return;
    if (isPublicRoute) return;
    if (user === undefined) return;
    if (user === null) return;

    if (user.onboardingStatus !== 'completed') {
      router.replace('/onboarding');
    }
  }, [authLoading, isAuthenticated, isPublicRoute, user, router]);

  // Standalone routes render raw children (e.g., /landing)
  // These pages have full control over their own styling
  if (isStandaloneRoute) {
    return <>{children}</>;
  }

  // Pages where we hide PhooFab (onboarding, auth, admin)
  // Note: / (marketing) now shows Phoo for guest engagement
  const hidePhooPages = ['/onboarding', '/auth', '/admin', '/apply', '/thank-you'];
  const showPhoo = !hidePhooPages.some((p) => pathname === p || pathname?.startsWith(p + '/'));

  // Show loading while checking onboarding status on protected routes
  if (!isPublicRoute && isAuthenticated && user === undefined) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="brand.light">
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.orange" thickness="4px" />
          <Text color="gray.600">Loading...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box minH="100vh" w="100%" bg="brand.light">
      <SkipLink />
      <Navigation />
      <MainContent>{children}</MainContent>

      {/* PhooFab - floating chat button (bottom-left) */}
      {showPhoo && <PhooFab onOpenDrawer={onOpenDrawer} />}

      {/* PhooChatDrawer - for guest users only */}
      <PhooChatDrawer isOpen={isDrawerOpen} onClose={onCloseDrawer} />
    </Box>
  );
};
