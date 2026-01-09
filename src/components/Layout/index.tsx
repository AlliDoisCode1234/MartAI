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
];

// Routes that bypass the entire app shell (no Navigation, no Phoo)
// These render raw children for full control over styling
const STANDALONE_ROUTES = ['/', '/join', '/auth/callback', '/auth/login'];

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

  // Redirect logic for authenticated/unauthenticated users
  useEffect(() => {
    if (authLoading) return;
    if (isPublicRoute) return; // Don't redirect on public routes
    if (isStandaloneRoute) return; // Don't redirect on standalone routes

    // Check if we're on phoo.ai domain
    const isPhooAi =
      typeof window !== 'undefined' &&
      (window.location.hostname.includes('phoo.ai') ||
        window.location.hostname.includes('phoo-ai'));

    // Not authenticated - redirect to appropriate page
    if (!isAuthenticated) {
      if (isPhooAi) {
        // On phoo.ai, unauthenticated users go to waitlist
        router.replace('/join');
      } else {
        // On other domains, go to login
        router.replace('/auth/login');
      }
      return;
    }

    // Wait for user data to load
    if (user === undefined) return;
    if (user === null) return; // No user found, let page handle it

    // User is authenticated but hasn't completed onboarding
    if (user.onboardingStatus !== 'completed') {
      router.replace('/onboarding');
    }
  }, [authLoading, isAuthenticated, isPublicRoute, isStandaloneRoute, user, router, pathname]);

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
