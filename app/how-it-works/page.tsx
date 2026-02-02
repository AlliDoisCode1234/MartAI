'use client';

/**
 * How It Works Page
 *
 * Component Hierarchy:
 * App → HowItWorksPage (this file)
 *
 * GEO-optimized explainer page for the public marketing site.
 * Shows the 3-step process: URL → Connect → Automate
 * Includes HowTo JSON-LD schema for Google AI Overviews
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
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { FiGlobe, FiLink, FiZap, FiArrowRight, FiCheck, FiCpu } from 'react-icons/fi';
import { getHowToSchema, HOW_IT_WORKS_STEPS, schemaToJsonLd } from '@/src/lib/schemas';
import { LandingHeader } from '@/src/components/landing';

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
      bg="gray.50"
      p={8}
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.200"
      position="relative"
      _hover={{ transform: 'translateY(-5px)', borderColor: 'brand.orange' }}
    >
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
  const router = useRouter();
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

      <LandingHeader />

      <Box bg="white" minH="100vh">
        <Container maxW="container.xl" py={{ base: 16, md: 24 }}>
          <VStack spacing={16}>
            {/* Header */}
            <VStack spacing={4} textAlign="center" maxW="3xl">
              <MotionBox
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <HStack justify="center" mb={4}>
                  <Badge
                    bg="rgba(255, 157, 0, 0.1)"
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
                <Text
                  color="brand.orange"
                  fontWeight="bold"
                  fontSize="sm"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  How It Works
                </Text>
                <Heading
                  as="h1"
                  fontSize={{ base: '3xl', md: '5xl' }}
                  fontWeight="bold"
                  color="gray.800"
                  mt={2}
                >
                  3 Simple Steps to{' '}
                  <Text as="span" color="brand.orange">
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

            {/* GEO Differentiator */}
            <Box
              bg="orange.50"
              border="1px solid"
              borderColor="brand.orange"
              borderRadius="xl"
              p={8}
              textAlign="center"
              w="full"
              maxW="3xl"
            >
              <VStack spacing={4}>
                <Heading size="md" color="gray.800">
                  Why &ldquo;AI-Ready&rdquo; Matters
                </Heading>
                <Text color="gray.600">
                  Google&apos;s AI now answers 40% of searches directly—without users clicking any
                  links. Traditional SEO gets you ranked. Phoo&apos;s GEO gets you{' '}
                  <strong style={{ color: '#FF9D00' }}>cited</strong>.
                </Text>
              </VStack>
            </Box>

            {/* CTA Section */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              p={{ base: 8, md: 12 }}
              borderRadius="2xl"
              textAlign="center"
              w="full"
              maxW="3xl"
            >
              <VStack spacing={6}>
                <Heading size="lg" color="gray.800">
                  Ready to dominate both search AND AI?
                </Heading>
                <Text color="gray.600" fontSize="lg">
                  Join hundreds of businesses growing their organic traffic—and getting cited by
                  Google&apos;s AI.
                </Text>
                <HStack spacing={4}>
                  <Button
                    size="lg"
                    bg="brand.orange"
                    color="white"
                    rightIcon={<Icon as={FiArrowRight} />}
                    _hover={{ bg: 'orange.500', transform: 'translateY(-2px)' }}
                    onClick={() => router.push('/onboarding')}
                  >
                    Start Your Trial
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    borderColor="gray.300"
                    color="gray.700"
                    _hover={{ bg: 'gray.100' }}
                    onClick={() => router.push('/pricing')}
                  >
                    View Pricing
                  </Button>
                </HStack>
              </VStack>
            </MotionBox>
          </VStack>
        </Container>
      </Box>
    </>
  );
}
