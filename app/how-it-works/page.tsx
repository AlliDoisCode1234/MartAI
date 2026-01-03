'use client';

/**
 * How It Works Page
 *
 * Component Hierarchy:
 * App → HowItWorksPage (this file)
 *
 * Simple explainer page for the public marketing site.
 * Shows the 3-step process: URL → Connect → Automate
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
} from '@chakra-ui/react';
import { motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiGlobe, FiLink, FiZap, FiArrowRight, FiCheck } from 'react-icons/fi';

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
      shadow="lg"
      borderWidth="1px"
      borderColor="gray.100"
      position="relative"
      _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}
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
    <Box bg="gray.50" minH="100vh">
      <Container maxW="container.xl" py={{ base: 16, md: 24 }}>
        <VStack spacing={16}>
          {/* Header */}
          <VStack spacing={4} textAlign="center" maxW="3xl">
            <MotionBox
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
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
                  Automated SEO
                </Text>
              </Heading>
              <Text fontSize="lg" color="gray.600" mt={4}>
                No complex setup. No technical knowledge required. Just connect your tools and let
                Phoo handle the rest.
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

          {/* CTA Section */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            bg="white"
            p={{ base: 8, md: 12 }}
            borderRadius="2xl"
            shadow="lg"
            textAlign="center"
            w="full"
            maxW="3xl"
          >
            <VStack spacing={6}>
              <Heading size="lg" color="gray.800">
                Ready to automate your SEO?
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Join hundreds of businesses growing their organic traffic on autopilot.
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
                  borderColor="brand.orange"
                  color="brand.orange"
                  _hover={{ bg: 'orange.50' }}
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
  );
}
