'use client';

/**
 * Phoo.ai Join/Waitlist Page
 *
 * Component Hierarchy:
 * └── app/join/page.tsx (this file)
 *     ├── MegaMenuHeader
 *     ├── HeroSection
 *     ├── ProblemSection
 *     ├── FeaturesSection
 *     ├── AudienceSection
 *     ├── WaitlistForm
 *     └── PremiumFooter
 *
 * Public waitlist page for phoo.ai domain.
 * Accessible at phoo.ai/join.
 *
 * NOTE (Product Audit 04/17/2026): Added MegaMenuHeader so users
 * have navigation and aren't trapped on a dark page with no escape.
 * The landing components were unified to a light theme for brand cohesion.
 */

import { Box } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import {
  HeroSection,
  ProblemSection,
  FeaturesSection,
  AudienceSection,
  WaitlistForm,
} from '@/src/components/landing';
import { MegaMenuHeader, PremiumFooter } from '@/src/components/marketing';

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
    <Box minH="100vh" bg="white" color="gray.800">
      {/* MegaMenuHeader added per Product Audit so users can navigate away */}
      <MegaMenuHeader />
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
    <Suspense fallback={<Box minH="100vh" bg="white" />}>
      <JoinPageContent />
    </Suspense>
  );
}
