'use client';

/**
 * Product Page — /product
 *
 * Component Hierarchy:
 * App -> /product/page.tsx
 *   ├── MegaMenuHeader
 *   ├── ProductHero (headline + full-width screenshot)
 *   ├── FeatureShowcase x6 (alternating deep dives)
 *   ├── ComparisonTable (Agency vs DIY vs Phoo)
 *   ├── CTASection (final conversion)
 *   └── PremiumFooter
 *
 * Per LDD section 5: The deep-dive product page.
 */

import { Box, Container, Heading, Text, VStack, Button, HStack } from '@chakra-ui/react';
import Link from 'next/link';
import {
  MegaMenuHeader,
  PremiumFooter,
  FeatureShowcase,
  ProductScreenshot,
  CTASection,
} from '@/src/components/marketing';
import { ComparisonTable } from '@/src/components/marketing/ComparisonTable';
import {
  FiEdit3,
  FiSearch,
  FiBarChart2,
  FiGlobe,
  FiTarget,
  FiCalendar,
  FiArrowRight,
} from 'react-icons/fi';
import { STUDIO_COLORS } from '@/lib/constants/studioTokens';
import { IS_LAUNCHED, BETA_JOIN_HREF, LAUNCHED_SIGNUP_HREF } from '@/lib/constants/featureFlags';

export default function ProductPage() {
  return (
    <Box minH="100vh" bg="white" color="gray.800">
      <MegaMenuHeader />

      {/* ── ProductHero ────────────────────────────────────── */}
      <Box
        as="section"
        pt={{ base: 28, md: 36 }}
        pb={{ base: 16, md: 24 }}
        textAlign="center"
        bgGradient="linear(to-b, #fef7f0, white)"
      >
        <Container maxW="5xl">
          <VStack spacing={{ base: 6, md: 8 }}>
            <VStack spacing={4}>
              <Heading
                as="h1"
                fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
                fontWeight="extrabold"
                lineHeight="1.1"
                color="gray.900"
              >
                The All-In-One AI
                <br />
                <Text as="span" bgGradient="linear(to-r, brand.orange, brand.red)" bgClip="text">
                  Marketing Platform
                </Text>
              </Heading>
              <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.600" maxW="640px">
                Six powerful tools working together to get your business found on Google and in AI
                answers. Everything you need, nothing you don&apos;t.
              </Text>
            </VStack>

            <HStack spacing={4} flexWrap="wrap" justify="center">
              <Button
                as={Link}
                href={IS_LAUNCHED ? LAUNCHED_SIGNUP_HREF : BETA_JOIN_HREF}
                size="lg"
                bgGradient="linear(to-r, brand.orange, brand.red)"
                color="white"
                borderRadius="full"
                px={8}
                fontWeight="semibold"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(247, 148, 30, 0.4)',
                }}
                transition="all 0.3s ease"
                rightIcon={<FiArrowRight />}
              >
                {IS_LAUNCHED ? 'Start Free Trial' : 'Join Beta'}
              </Button>
              <Button
                as={Link}
                href="/how-it-works"
                size="lg"
                variant="outline"
                borderColor="gray.300"
                color="gray.700"
                borderRadius="full"
                px={8}
                _hover={{
                  borderColor: 'brand.orange',
                  color: 'brand.orange',
                }}
                transition="all 0.3s ease"
              >
                How It Works
              </Button>
            </HStack>

            {/* Full-width product screenshot */}
            <Box w="100%" maxW="960px" pt={4}>
              <ProductScreenshot
                src="/images/dashboard-mockup.png"
                alt="Phoo AI Marketing Platform — full dashboard overview"
                width={1920}
                height={1080}
              />
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* ── Feature Deep Dives (6 sections) ────────────────── */}
      <FeatureShowcase
        badge="AI Content Studio"
        badgeIcon={FiEdit3}
        heading="Create Content That"
        headingHighlight="Ranks and Converts"
        description="Generate high-quality, SEO-optimized articles in minutes. Our AI writer scores every piece in real-time so you publish with confidence."
        features={[
          'AI-generated articles with real-time SEO scoring',
          'Built-in Phoo Rating shows exactly how content will perform',
          'Multiple AI personas to match your brand voice',
          'Revision history and collaborative editing',
        ]}
        bg={STUDIO_COLORS.pageBg}
      >
        <ProductScreenshot
          src="/images/feature-content-studio.png"
          alt="AI Content Studio — article editor with SEO scoring"
          width={1200}
          height={750}
        />
      </FeatureShowcase>

      <FeatureShowcase
        badge="Keyword Intelligence"
        badgeIcon={FiSearch}
        heading="Find Keywords That"
        headingHighlight="Actually Convert"
        description="Stop guessing which keywords to target. Phoo pulls real data from your Google Search Console to surface quick-win opportunities competitors miss."
        features={[
          'Quick-win keyword discovery from real GSC data',
          'Difficulty scoring with search volume analysis',
          'Competitive gap analysis across your niche',
          'Direct keyword-to-content pipeline automation',
        ]}
        reverse
      >
        <ProductScreenshot
          src="/images/feature-keyword-research.png"
          alt="Keyword Intelligence — research dashboard with quick wins"
          width={1200}
          height={750}
        />
      </FeatureShowcase>

      <FeatureShowcase
        badge="Phoo Rating (PR Score)"
        badgeIcon={FiTarget}
        heading="Your Unified"
        headingHighlight="SEO + GEO Health Score"
        description="The Phoo Rating combines 12+ signals — from traditional SEO to AI citation readiness — into one score that tells you exactly where you stand."
        features={[
          'Combined SEO and GEO optimization score',
          'Real-time tracking with trend visualization',
          'Actionable recommendations to improve your score',
          'Benchmark against industry standards',
        ]}
        bg={STUDIO_COLORS.pageBg}
      >
        <ProductScreenshot
          src="/images/feature-phoo-rating.png"
          alt="Phoo Rating — unified SEO and GEO health score gauge"
          width={1200}
          height={750}
        />
      </FeatureShowcase>

      <FeatureShowcase
        badge="Analytics Dashboard"
        badgeIcon={FiBarChart2}
        heading="Track What Matters,"
        headingHighlight="Not Vanity Metrics"
        description="Your Executive Briefing shows the 5 KPIs that drive revenue. Real-time GA4 and GSC data, distilled into plain-English insights."
        features={[
          'Real-time Google Analytics 4 integration',
          'Google Search Console keyword performance',
          'Cumulative growth tracking since day one',
          'AI-powered intelligence briefs',
        ]}
        reverse
      >
        <ProductScreenshot
          src="/images/feature-analytics.png"
          alt="Analytics Dashboard — executive briefing KPIs"
          width={1200}
          height={750}
        />
      </FeatureShowcase>

      <FeatureShowcase
        badge="CMS Publishing"
        badgeIcon={FiGlobe}
        heading="Publish Everywhere"
        headingHighlight="in One Click"
        description="Connect your WordPress, Shopify, or Webflow site. Publish optimized content with SEO meta tags, structured data, and responsive formatting — no copy-pasting."
        features={[
          'One-click publish to WordPress, Shopify, Webflow',
          'Automatic SEO meta tags and schema markup',
          'Image optimization and responsive formatting',
          'Draft preview before publishing',
        ]}
        bg={STUDIO_COLORS.pageBg}
      >
        <ProductScreenshot
          src="/images/feature-publishing.png"
          alt="CMS Publishing — one-click WordPress publish"
          width={1200}
          height={750}
        />
      </FeatureShowcase>

      <FeatureShowcase
        badge="GEO Optimization"
        badgeIcon={FiCalendar}
        heading="Get Cited by"
        headingHighlight="AI Search Engines"
        description="Over 1 in 4 Google searches now show AI-generated answers. Phoo optimizes your content for both Google and AI citation engines so you're visible everywhere."
        features={[
          'AI citation readiness scoring',
          'Structured data and schema automation',
          'E-E-A-T signal optimization',
          'Content formatting for AI extraction',
        ]}
        reverse
      >
        <ProductScreenshot
          src="/images/feature-geo.png"
          alt="GEO Optimization — AI citation readiness analysis"
          width={1200}
          height={750}
        />
      </FeatureShowcase>

      {/* ── ComparisonTable ────────────────────────────────── */}
      <ComparisonTable />

      {/* ── Final CTA + Footer ─────────────────────────────── */}
      <CTASection />
      <PremiumFooter />
    </Box>
  );
}
