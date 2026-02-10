'use client';

/**
 * Phoo.ai Join/Waitlist Page
 *
 * Component Hierarchy:
 * └── app/join/page.tsx (this file)
 *     ├── HeroSection
 *     ├── ProblemSection
 *     ├── FeaturesSection
 *     ├── AudienceSection
 *     ├── BetaSection
 *     ├── WaitlistForm
 *     └── Footer
 *
 * Public waitlist page for phoo.ai domain.
 * Accessible at phoo.ai/join.
 * Imports from src/components/landing (production copy from main branch).
 */

import { Box, Container, Text, HStack, Link as ChakraLink } from '@chakra-ui/react';
import Link from 'next/link';
import {
  HeroSection,
  ProblemSection,
  FeaturesSection,
  AudienceSection,
  BetaSection,
  WaitlistForm,
} from '@/src/components/landing';

export default function JoinPage() {
  return (
    <Box minH="100vh" bg="gray.900" color="white">
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <AudienceSection />
      <BetaSection />
      <WaitlistForm />
      {/* Footer */}
      <Box as="footer" py={12} borderTop="1px solid" borderColor="whiteAlpha.100">
        <Container maxW="6xl" textAlign="center">
          <HStack justify="center" spacing={6} mb={4}>
            <ChakraLink
              as={Link}
              href="/privacy"
              color="gray.400"
              fontSize="sm"
              _hover={{ color: 'white' }}
            >
              Privacy Policy
            </ChakraLink>
            <ChakraLink
              as={Link}
              href="/terms"
              color="gray.400"
              fontSize="sm"
              _hover={{ color: 'white' }}
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
