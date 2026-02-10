'use client';

/**
 * Phoo.ai Home Page - Beta Launch
 *
 * Component Hierarchy:
 * └── app/page.tsx (this file)
 *     ├── (Authenticated) → Redirect to /dashboard
 *     └── (Unauthenticated) → Marketing page
 *         ├── HeroSection
 *         ├── ProblemSection
 *         ├── FeaturesSection
 *         ├── AudienceSection
 *         ├── BetaSection
 *         ├── WaitlistForm
 *         └── Footer
 *
 * Routing Logic:
 * - Authenticated users → /dashboard (member portal)
 * - Unauthenticated users → Marketing landing page
 *
 * Google OAuth compliance: Proper public homepage at phoo.ai/
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useConvexAuth } from 'convex/react';
import {
  Box,
  Container,
  Text,
  HStack,
  Link as ChakraLink,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import {
  LandingHeader,
  HeroSection,
  HowItWorksSection,
  AboutPhooSection,
  WaitlistForm,
} from '@/src/components/home';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();

  // Redirect authenticated users to member portal
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <Box minH="100vh" bg="white" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.orange" thickness="4px" />
          <Text color="gray.600">Loading...</Text>
        </VStack>
      </Box>
    );
  }

  // Authenticated users will be redirected, show loading
  if (isAuthenticated) {
    return (
      <Box minH="100vh" bg="white" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.orange" thickness="4px" />
          <Text color="gray.600">Redirecting to dashboard...</Text>
        </VStack>
      </Box>
    );
  }

  // Unauthenticated users see marketing page
  // PhooFab is rendered by Layout for standalone routes
  return (
    <Box minH="100vh" bg="white" color="gray.800" position="relative">
      <LandingHeader />
      <HeroSection />
      <HowItWorksSection />
      <AboutPhooSection />
      <WaitlistForm />
      {/* Footer */}
      <Box as="footer" py={12} borderTop="1px solid" borderColor="gray.200">
        <Container maxW="6xl" textAlign="center">
          <HStack justify="center" spacing={6} mb={4}>
            <ChakraLink
              as={Link}
              href="/privacy"
              color="gray.600"
              fontSize="sm"
              _hover={{ color: 'brand.orange' }}
            >
              Privacy Policy
            </ChakraLink>
            <ChakraLink
              as={Link}
              href="/terms"
              color="gray.600"
              fontSize="sm"
              _hover={{ color: 'brand.orange' }}
            >
              Terms of Service
            </ChakraLink>
          </HStack>
          <Text color="gray.500" fontSize="sm">
            © {new Date().getFullYear()} Phoo AI. All rights reserved.
          </Text>
        </Container>
      </Box>
    </Box>
  );
}
