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
 * Accessible at phoo.ai/join (and phoo.ai/ redirects here).
 * Uses Chakra UI with brand.orange/white palette.
 */

import { Box, Container, Text } from '@chakra-ui/react';
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
          <Text color="gray.500" fontSize="sm">
            © {new Date().getFullYear()} Phoo AI. All rights reserved.
          </Text>
        </Container>
      </Box>
    </Box>
  );
}
