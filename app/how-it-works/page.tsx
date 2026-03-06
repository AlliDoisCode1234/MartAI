'use client';

/**
 * How It Works Page
 *
 * Component Hierarchy:
 * App -> HowItWorksPage
 *   ├── MegaMenuHeader
 *   ├── Hero Banner
 *   ├── 3-Step Process Cards
 *   ├── FeatureShowcase x3 (Content Studio, Keywords, Analytics)
 *   ├── GEO Differentiator
 *   ├── CTA Section
 *   └── PremiumFooter
 *
 * GEO-optimized explainer page with product screenshots.
 * Includes HowTo JSON-LD schema for Google AI Overviews.
 */

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Button,
  Icon,
  Circle,
  Badge,
} from '@chakra-ui/react';
import { motion, useReducedMotion } from 'framer-motion';
import Script from 'next/script';
import {
  FiGlobe,
  FiLink,
  FiZap,
  FiArrowRight,
  FiCheck,
  FiCpu,
  FiEdit3,
  FiSearch,
  FiBarChart2,
} from 'react-icons/fi';
import { getHowToSchema, HOW_IT_WORKS_STEPS, schemaToJsonLd } from '@/src/lib/schemas';
import {
  MegaMenuHeader,
  PremiumFooter,
  FeatureShowcase,
  ProductScreenshot,
} from '@/src/components/marketing';
import { IS_LAUNCHED, BETA_JOIN_HREF, LAUNCHED_SIGNUP_HREF } from '@/lib/constants/featureFlags';

const MotionBox = motion(Box);

interface StepCardProps {
  number: number;
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  delay: number;
  prefersReducedMotion: boolean;
}

function StepCard({
  number,
  icon,
  title,
  description,
  features,
  delay,
  prefersReducedMotion,
}: StepCardProps) {
  return (
    <MotionBox
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, delay }}
      bg="white"
      p={8}
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)"
      position="relative"
      overflow="hidden"
      _hover={{
        transform: 'translateY(-5px)',
        borderColor: 'brand.orange',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.10)',
      }}
      style={{ transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s' }}
    >
      {/* Orange top accent stripe */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="3px"
        bgGradient="linear(to-r, brand.orange, brand.red)"
      />
      {/* Step number badge */}
      <Circle
        size="40px"
        bg="brand.orange"
        color="white"
        fontSize="lg"
        fontWeight="bold"
        position="absolute"
        top={-4}
        left={8}
      >
        {number}
      </Circle>

      <VStack align="start" spacing={4} mt={4}>
        <Box
          w={14}
          h={14}
          bg="orange.50"
          borderRadius="lg"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={icon} boxSize={7} color="brand.orange" />
        </Box>

        <Heading size="md" color="gray.800">
          {title}
        </Heading>

        <Text color="gray.600" lineHeight="tall">
          {description}
        </Text>

        <VStack align="start" spacing={2} pt={2}>
          {features.map((feature, i) => (
            <HStack key={i} spacing={2}>
              <Icon as={FiCheck} color="green.500" boxSize={4} />
              <Text fontSize="sm" color="gray.600">
                {feature}
              </Text>
            </HStack>
          ))}
        </VStack>
      </VStack>
    </MotionBox>
  );
}

export default function HowItWorksPage() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  // Generate HowTo schema for Google AI Overviews
  const howToSchema = getHowToSchema(
    'How to Automate Your SEO with Phoo',
    'Learn how to set up AI-powered SEO automation in 3 simple steps. Phoo optimizes your content for both traditional search and Google AI Overviews.',
    HOW_IT_WORKS_STEPS
  );

  const steps: Omit<StepCardProps, 'delay' | 'prefersReducedMotion'>[] = [
    {
      number: 1,
      icon: FiGlobe,
      title: 'Enter Your URL',
      description:
        'Simply provide your website URL. Phoo instantly analyzes your site structure, existing content, and identifies optimization opportunities.',
      features: ['Automatic site crawling', 'Content gap analysis', 'Technical SEO audit'],
    },
    {
      number: 2,
      icon: FiLink,
      title: 'Connect GSC & GA4',
      description:
        'One-click integration with Google Search Console and Google Analytics 4. We pull your real performance data to build a strategy that actually works.',
      features: ['No code required', 'Secure OAuth connection', 'Real-time data sync'],
    },
    {
      number: 3,
      icon: FiZap,
      title: 'Let Phoo Work',
      description:
        "That's it. Phoo builds your content strategy, writes SEO-optimized articles, and can even publish directly to your CMS. You approve, we execute.",
      features: [
        'AI-generated content calendar',
        'One-click article generation',
        'WordPress/Shopify publishing',
      ],
    },
  ];

  return (
    <>
      {/* HowTo Schema for Google AI Overviews */}
      <Script
        id="howto-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(howToSchema) }}
      />

      <MegaMenuHeader />

      <Box bg="white" minH="100vh">
        {/* ── Hero Section ──────────────────────────────────── */}
        <Container maxW="container.xl" py={{ base: 16, md: 24 }}>
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center" maxW="3xl">
              <MotionBox
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <HStack justify="center" mb={4}>
                  <Badge
                    bg="orange.50"
                    color="brand.orange"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                  >
                    <HStack spacing={1}>
                      <Icon as={FiCpu} boxSize={3} />
                      <Text>SEO + GEO Optimized</Text>
                    </HStack>
                  </Badge>
                </HStack>
                <Heading
                  as="h1"
                  fontSize={{ base: '3xl', md: '5xl' }}
                  fontWeight="bold"
                  color="gray.800"
                  mt={2}
                >
                  3 Simple Steps to{' '}
                  <Text as="span" bgGradient="linear(to-r, brand.orange, brand.red)" bgClip="text">
                    AI-Ready SEO
                  </Text>
                </Heading>
                <Text fontSize="lg" color="gray.600" mt={4}>
                  No complex setup. No technical knowledge required. Phoo optimizes your content for
                  both traditional search engines AND Google&apos;s AI—so you appear in search
                  results AND get cited in AI-generated answers.
                </Text>
              </MotionBox>
            </VStack>

            {/* Steps Grid */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              {steps.map((step, index) => (
                <StepCard
                  key={step.number}
                  {...step}
                  delay={0.2 + index * 0.15}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </SimpleGrid>
          </VStack>
        </Container>

        {/* ── Feature Showcases ──────────────────────────────── */}
        <FeatureShowcase
          badge="Content Studio"
          badgeIcon={FiEdit3}
          heading="Create SEO-Optimized Content"
          headingHighlight="in Minutes"
          description="Our AI Content Studio writes high-quality, SEO-optimized articles tailored to your business. Each piece is scored in real-time so you know exactly how it'll perform before you publish."
          features={[
            'AI-generated articles with real-time SEO scoring',
            'One-click publish to WordPress, Shopify, Webflow',
            'Built-in keyword optimization and density tracking',
            'Content calendar with scheduling automation',
          ]}
          bg="#F8FAFC"
        >
          <ProductScreenshot
            src="/images/feature-content-studio.png"
            alt="Phoo AI Content Studio showing real-time SEO scoring and article editing"
            width={1200}
            height={750}
          />
        </FeatureShowcase>

        <FeatureShowcase
          badge="Keyword Intelligence"
          badgeIcon={FiSearch}
          heading="Find Keywords That"
          headingHighlight="Actually Convert"
          description="Stop guessing which keywords to target. Phoo identifies high-value opportunities based on your real Google Search Console data, showing you exactly where quick wins are hiding."
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
            alt="Phoo keyword research dashboard with difficulty scores and quick wins"
            width={1200}
            height={750}
          />
        </FeatureShowcase>

        <FeatureShowcase
          badge="Analytics Dashboard"
          badgeIcon={FiBarChart2}
          heading="Track What Matters,"
          headingHighlight="Not Vanity Metrics"
          description="Your Executive Briefing dashboard shows the 5 metrics that actually drive revenue: leads, traffic, sessions, content pipeline, and your proprietary PR Score. No noise, just signal."
          features={[
            'Real-time GA4 and GSC data integration',
            'Phoo Rating (PR Score) for search visibility',
            'Cumulative growth tracking since day one',
            'AI Intelligence Brief with plain-English insights',
          ]}
          bg="#F8FAFC"
        >
          <ProductScreenshot
            src="/images/feature-analytics.png"
            alt="Phoo analytics dashboard with KPI cards and growth chart"
            width={1200}
            height={750}
          />
        </FeatureShowcase>

        {/* ── GEO Differentiator ──────────────────────────────── */}
        <Box py={{ base: 12, md: 20 }}>
          <Container maxW="3xl">
            <Box
              bg="orange.50"
              border="1px solid"
              borderColor="brand.orange"
              borderRadius="xl"
              p={8}
              textAlign="center"
            >
              <VStack spacing={4}>
                <Heading size="md" color="gray.800">
                  Why &ldquo;AI-Ready&rdquo; Matters
                </Heading>
                <Text color="gray.600">
                  Google&apos;s AI now answers 40% of searches directly—without users clicking any
                  links. Traditional SEO gets you ranked. Phoo&apos;s GEO gets you{' '}
                  <strong style={{ color: '#F7941E' }}>cited</strong>.
                </Text>
              </VStack>
            </Box>
          </Container>
        </Box>

        {/* ── CTA Section ──────────────────────────────────── */}
        <Box py={{ base: 12, md: 20 }} bgGradient="linear(to-br, brand.orange, orange.600)">
          <Container maxW="3xl">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              textAlign="center"
            >
              <VStack spacing={6}>
                <Heading size="lg" color="white">
                  Ready to dominate both search AND AI?
                </Heading>
                <Text color="whiteAlpha.900" fontSize="lg">
                  Join hundreds of businesses growing their organic traffic—and getting cited by
                  Google&apos;s AI.
                </Text>
                <Button
                  as="a"
                  href={IS_LAUNCHED ? LAUNCHED_SIGNUP_HREF : BETA_JOIN_HREF}
                  size="lg"
                  bg="white"
                  color="brand.orange"
                  borderRadius="full"
                  px={8}
                  fontWeight="bold"
                  rightIcon={<Icon as={FiArrowRight} />}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                  }}
                  transition="all 0.3s ease"
                >
                  {IS_LAUNCHED ? 'Start Getting Leads' : 'Join Beta'}
                </Button>
              </VStack>
            </MotionBox>
          </Container>
        </Box>
      </Box>

      <PremiumFooter />
    </>
  );
}
