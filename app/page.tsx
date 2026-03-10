'use client';

/**
 * Phoo.ai Home Page - Beta Launch
 *
 * Component Hierarchy:
 * └── app/page.tsx (this file)
 *     ├── (Authenticated) → Redirect to /studio
 *     └── (Unauthenticated) → Marketing page
 *         ├── MegaMenuHeader
 *         ├── HeroSection (split layout + product mockup)
 *         ├── HowItWorksSection
 *         ├── AboutPhooSection
 *         ├── WaitlistForm
 *         └── PremiumFooter
 *
 * Routing Logic:
 * - Authenticated users → /dashboard (member portal)
 * - Unauthenticated users → Marketing landing page
 *
 * Google OAuth compliance: Proper public homepage at phoo.ai/
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Box, Text, Spinner, VStack } from '@chakra-ui/react';
import {
  HeroSection,
  HowItWorksSection,
  AboutPhooSection,
  WaitlistForm,
} from '@/src/components/home';
import {
  MegaMenuHeader,
  PremiumFooter,
  FeatureShowcase,
  ProductScreenshot,
  SocialProofBar,
  DarkGradientAISection,
} from '@/src/components/marketing';
import { FiEdit3, FiSearch, FiBarChart2, FiGlobe } from 'react-icons/fi';
import { STUDIO_COLORS } from '@/lib/constants/studioTokens';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  // Query user to check onboarding status — avoids 3-hop redirect (/ → /dashboard → /onboarding)
  const user = useQuery(api.users.me);

  // Redirect authenticated users based on onboarding status
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) return;
    // Wait for user record to load from Convex
    if (user === undefined) return;

    if (user && user.onboardingStatus === 'completed') {
      router.replace('/studio');
    } else {
      // Incomplete or no user record → onboarding directly (no dashboard bounce)
      router.replace('/onboarding');
    }
  }, [isAuthenticated, isLoading, user, router]);

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
      <MegaMenuHeader />
      <HeroSection />
      <SocialProofBar />

      {/* Product Feature Showcases */}
      <FeatureShowcase
        badge="Content Studio"
        badgeIcon={FiEdit3}
        heading="Create SEO-Optimized Content"
        headingHighlight="in Minutes"
        description="Our AI Content Studio writes high-quality, SEO-optimized articles tailored to your business. Each piece is scored in real-time so you know exactly how it'll perform."
        features={[
          'AI-generated articles with real-time SEO scoring',
          'One-click publish to WordPress, Shopify, Webflow',
          'Built-in keyword optimization and density tracking',
          'Content calendar with scheduling automation',
        ]}
        bg={STUDIO_COLORS.pageBg}
      >
        <ProductScreenshot
          src="/images/feature-content-studio.png"
          alt="Phoo AI Content Studio"
          width={1200}
          height={750}
        />
      </FeatureShowcase>

      <FeatureShowcase
        badge="Keyword Intelligence"
        badgeIcon={FiSearch}
        heading="Find Keywords That"
        headingHighlight="Actually Convert"
        description="Stop guessing which keywords to target. Phoo identifies high-value opportunities based on your real Google Search Console data."
        features={[
          'Quick-win keyword discovery from real GSC data',
          'Difficulty scoring with volume analysis',
          'Competitor gap analysis',
          'Keyword-to-content automation pipeline',
        ]}
        reverse
      >
        <ProductScreenshot
          src="/images/feature-keyword-research.png"
          alt="Phoo keyword research dashboard"
          width={1200}
          height={750}
        />
      </FeatureShowcase>

      <FeatureShowcase
        badge="Analytics Dashboard"
        badgeIcon={FiBarChart2}
        heading="Track What Matters,"
        headingHighlight="Not Vanity Metrics"
        description="Your Executive Briefing dashboard shows the 5 metrics that actually drive revenue. No noise, just signal."
        features={[
          'Real-time GA4 and GSC data integration',
          'Phoo Rating (PR Score) for search visibility',
          'Cumulative growth tracking since day one',
          'AI Intelligence Brief with plain-English insights',
        ]}
        bg={STUDIO_COLORS.pageBg}
      >
        <ProductScreenshot
          src="/images/feature-analytics.png"
          alt="Phoo analytics dashboard"
          width={1200}
          height={750}
        />
      </FeatureShowcase>

      <FeatureShowcase
        badge="CMS Publishing"
        badgeIcon={FiGlobe}
        heading="Publish Everywhere"
        headingHighlight="in One Click"
        description="Connect your WordPress, Shopify, or Webflow site and publish optimized content without leaving Phoo. No copy-pasting, no formatting headaches."
        features={[
          'One-click publish to WordPress, Shopify, Webflow',
          'Automatic SEO meta tags and schema markup',
          'Image optimization and responsive formatting',
          'Scheduled publishing via content calendar',
        ]}
        reverse
      >
        <ProductScreenshot
          src="/images/feature-publishing.png"
          alt="Phoo CMS publishing dashboard"
          width={1200}
          height={750}
        />
      </FeatureShowcase>

      <DarkGradientAISection />

      <HowItWorksSection />
      <AboutPhooSection />
      <WaitlistForm />
      <PremiumFooter />
    </Box>
  );
}
