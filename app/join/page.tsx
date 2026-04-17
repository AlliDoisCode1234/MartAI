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
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import {
  HeroSection,
  ProblemSection,
  FeaturesSection,
  AudienceSection,
  WaitlistForm,
} from '@/src/components/landing';
import { PremiumFooter } from '@/src/components/marketing/PremiumFooter';

function JoinPageContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const industryParam = searchParams.get('industry');
    if (industryParam) {
      // Stash industry intent securely before external auth strip
      try {
        localStorage.setItem('martAI_pending_industry', industryParam);
      } catch (err) {
        console.warn('Unable to persist industry intent due to strict environment constraints:', err);
      }
    }
  }, [searchParams]);

  const scrollToForm = () => {
    document.getElementById('join-beta')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box minH="100vh" bg="gray.900" color="white">
      <HeroSection onCtaClick={scrollToForm} />
      <ProblemSection />
      <FeaturesSection />
      <AudienceSection />
      <WaitlistForm />
      <PremiumFooter />
    </Box>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<Box minH="100vh" bg="gray.900" />}>
      <JoinPageContent />
    </Suspense>
  );
}
