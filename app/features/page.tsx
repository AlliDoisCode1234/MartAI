'use client';

/**
 * Features Overview Page
 *
 * Component Hierarchy:
 * App -> Features -> page.tsx (this file)
 *   - MegaMenuHeader
 *   - Feature category cards linking to sub-pages
 *   - PremiumFooter
 *
 * Landing page for /features route. Provides an overview of all
 * product capabilities with links to detailed feature pages.
 */

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  Badge,
} from '@chakra-ui/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiEdit3,
  FiSearch,
  FiBarChart2,
  FiGlobe,
  FiCalendar,
  FiTarget,
  FiArrowRight,
} from 'react-icons/fi';
import { MegaMenuHeader, PremiumFooter } from '@/src/components/marketing';
import { STUDIO_COLORS } from '@/lib/constants/studioTokens';

const MotionBox = motion(Box);

interface FeatureCardData {
  icon: typeof FiEdit3;
  title: string;
  description: string;
  href: string;
  accent: string;
}

const FEATURES: FeatureCardData[] = [
  {
    icon: FiEdit3,
    title: 'Content Studio',
    description:
      'AI-generated articles with real-time SEO scoring. 17 content types, brand voice customization, and one-click publishing.',
    href: '/features/content-studio',
    accent: '#FF6B35',
  },
  {
    icon: FiSearch,
    title: 'Keyword Intelligence',
    description:
      'Quick-win keyword discovery from real GSC data. Difficulty scoring, volume analysis, and competitor gap detection.',
    href: '/features/keyword-intelligence',
    accent: '#F7931E',
  },
  {
    icon: FiBarChart2,
    title: 'Analytics Dashboard',
    description:
      'Real-time GA4 and GSC integration. Phoo Rating for search visibility, cumulative growth tracking, and AI-powered insights.',
    href: '/features/analytics',
    accent: '#22C55E',
  },
  {
    icon: FiGlobe,
    title: 'CMS Publishing',
    description:
      'One-click publish to WordPress, Shopify, and Webflow. Automatic SEO meta tags, schema markup, and image optimization.',
    href: '/features/publishing',
    accent: '#3B82F6',
  },
  {
    icon: FiCalendar,
    title: 'Content Calendar',
    description:
      'Zero-click content planning. AI auto-generates your editorial calendar based on industry templates and keyword strategy.',
    href: '/features/content-calendar',
    accent: '#8B5CF6',
  },
  {
    icon: FiTarget,
    title: 'GEO Optimization',
    description:
      'Built for the new AI search era. Optimize content for Google AI Overviews and generative search engines.',
    href: '/features/geo-optimization',
    accent: '#EC4899',
  },
];

export default function FeaturesPage() {
  return (
    <Box minH="100vh" bg="white" color="gray.800">
      <MegaMenuHeader />

      {/* Hero */}
      <Box
        pt={{ base: 24, md: 32 }}
        pb={{ base: 16, md: 20 }}
        bg={STUDIO_COLORS.pageBg}
        position="relative"
        overflow="hidden"
      >
        {/* Background orbs */}
        <Box
          position="absolute"
          top="-20%"
          right="10%"
          w="30rem"
          h="30rem"
          bg="brand.orange"
          opacity={0.08}
          borderRadius="full"
          filter="blur(120px)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          bottom="-10%"
          left="5%"
          w="25rem"
          h="25rem"
          bg="brand.red"
          opacity={0.06}
          borderRadius="full"
          filter="blur(100px)"
          pointerEvents="none"
        />

        <Container maxW="5xl" position="relative" zIndex={1} textAlign="center">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            // @ts-ignore - framer-motion transition type
            transition={{ duration: 0.6 }}
          >
            <Badge
              px={4}
              py={1.5}
              borderRadius="full"
              bg="orange.50"
              border="1px solid"
              borderColor="orange.200"
              color="orange.600"
              fontSize="xs"
              fontWeight="semibold"
              textTransform="uppercase"
              letterSpacing="wider"
              mb={6}
            >
              Everything You Need
            </Badge>

            <Heading
              as="h1"
              fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
              fontWeight="bold"
              lineHeight="1.1"
              letterSpacing="-0.02em"
              mb={6}
            >
              Six Powerful Tools.{' '}
              <Text
                as="span"
                bgGradient="linear(to-r, brand.orange, brand.red)"
                bgClip="text"
              >
                One Platform.
              </Text>
            </Heading>

            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color="gray.600"
              maxW="2xl"
              mx="auto"
              lineHeight="1.7"
            >
              Everything a marketing agency does for $2,500/mo — content strategy,
              SEO optimization, publishing, and analytics — automated by AI.
            </Text>
          </MotionBox>
        </Container>
      </Box>

      {/* Feature Cards Grid */}
      <Container maxW="6xl" py={{ base: 12, md: 20 }}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {FEATURES.map((feature, index) => (
            <MotionBox
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              // @ts-ignore
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={feature.href} style={{ textDecoration: 'none' }}>
                <Box
                  p={8}
                  bg="white"
                  borderRadius="2xl"
                  border="1px solid"
                  borderColor="gray.100"
                  boxShadow="sm"
                  cursor="pointer"
                  transition="all 0.3s ease"
                  _hover={{
                    borderColor: 'orange.200',
                    boxShadow: 'lg',
                    transform: 'translateY(-4px)',
                  }}
                  h="full"
                  display="flex"
                  flexDirection="column"
                >
                  {/* Icon */}
                  <Box
                    w={14}
                    h={14}
                    borderRadius="xl"
                    bg={`${feature.accent}15`}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mb={5}
                  >
                    <Icon
                      as={feature.icon}
                      boxSize={7}
                      color={feature.accent}
                    />
                  </Box>

                  <VStack align="start" spacing={3} flex={1}>
                    <Heading size="md" color="gray.800">
                      {feature.title}
                    </Heading>
                    <Text color="gray.600" fontSize="sm" lineHeight="1.7" flex={1}>
                      {feature.description}
                    </Text>
                    <HStack color="brand.orange" fontSize="sm" fontWeight="semibold">
                      <Text>Learn more</Text>
                      <Icon as={FiArrowRight} />
                    </HStack>
                  </VStack>
                </Box>
              </Link>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>

      <PremiumFooter />
    </Box>
  );
}
