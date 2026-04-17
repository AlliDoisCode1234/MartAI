'use client';

/**
 * SolutionPageTemplate
 *
 * Component Hierarchy:
 * App -> SolutionPageTemplate
 *   ├── MegaMenuHeader
 *   ├── Persona Hero (headline + pain point subheadline)
 *   ├── Pain Points Section (3 cards)
 *   ├── Solution Features Grid (4-6 features)
 *   ├── ROI Section (stats/numbers)
 *   ├── Orange Gradient CTA
 *   └── PremiumFooter
 *
 * Reusable template for all solution/persona marketing pages.
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
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheck, FiX } from 'react-icons/fi';
import { type IconType } from 'react-icons';
import { MegaMenuHeader, PremiumFooter } from '@/src/components/marketing';
import { IS_LAUNCHED, BETA_JOIN_HREF, LAUNCHED_PRICING_HREF } from '@/lib/constants/featureFlags';
import { usePathname } from 'next/navigation';

const MotionBox = motion(Box);

interface PainPoint {
  icon: IconType;
  problem: string;
  solution: string;
}

interface SolutionFeature {
  icon: IconType;
  title: string;
  description: string;
}

interface RoiStat {
  value: string;
  label: string;
}

interface Props {
  persona: string;
  headline: string;
  headlineHighlight: string;
  description: string;
  painPoints: PainPoint[];
  features: SolutionFeature[];
  roiStats: RoiStat[];
  ctaHeadline?: string;
  ctaDescription?: string;
  painPointsSectionTitle?: string;
  painPointsSectionHighlight?: string;
  painPointsSectionSubtitle?: string;
  featuresSectionTitle?: string;
  featuresSectionHighlight?: string;
  roiSectionTitle?: string;
  roiSectionHighlight?: string;
  customCtaHref?: string;
}

export function SolutionPageTemplate({
  persona,
  headline,
  headlineHighlight,
  description,
  painPoints,
  features,
  roiStats,
  ctaHeadline = 'Ready to get started?',
  ctaDescription = 'Join hundreds of businesses growing their organic traffic with AI-powered SEO.',
  painPointsSectionTitle = 'Stop struggling with',
  painPointsSectionHighlight = 'outdated methods',
  painPointsSectionSubtitle = 'We built Phoo to solve the exact problems you face every day.',
  featuresSectionTitle = 'Built for the way',
  featuresSectionHighlight = 'you work',
  roiSectionTitle = 'The numbers',
  roiSectionHighlight = 'speak for themselves',
  customCtaHref,
}: Props) {
  const pathname = usePathname();
  const ctaLink = customCtaHref || (IS_LAUNCHED ? LAUNCHED_PRICING_HREF : BETA_JOIN_HREF);

  // Build page-specific breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.phoo.ai',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Solutions',
        item: 'https://www.phoo.ai/solutions',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: persona,
        item: `https://www.phoo.ai${pathname}`,
      },
    ],
  };

  return (
    <>
      {/* Page-specific breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <MegaMenuHeader />

      {/* ── Persona Hero ────────────────────────────────── */}
      <Box
        bg="linear-gradient(180deg, #FFF8F0 0%, white 60%)"
        pt={{ base: 24, md: 32 }}
        pb={{ base: 12, md: 20 }}
      >
        <Container maxW="5xl">
          <VStack spacing={6} textAlign="center" maxW="3xl" mx="auto">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <HStack
                spacing={2}
                bg="orange.50"
                borderRadius="full"
                px={4}
                py={1.5}
                border="1px solid"
                borderColor="orange.200"
                justify="center"
              >
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color="brand.orange"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Built for {persona}
                </Text>
              </HStack>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Heading size="2xl" color="gray.800" lineHeight="1.1" fontWeight="extrabold">
                {headline}{' '}
                <Text as="span" bgGradient="linear(to-r, brand.orange, brand.red)" bgClip="text">
                  {headlineHighlight}
                </Text>
              </Heading>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Text fontSize="xl" color="gray.600" maxW="2xl" lineHeight="tall">
                {description}
              </Text>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                as="a"
                href={ctaLink}
                size="lg"
                bgGradient="linear(to-r, brand.orange, brand.red)"
                color="white"
                borderRadius="full"
                px={8}
                rightIcon={<Icon as={FiArrowRight} />}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 40px rgba(237, 137, 54, 0.3)',
                }}
                transition="all 0.3s ease"
              >
                {IS_LAUNCHED ? 'See Pricing' : 'Join Beta'}
              </Button>
            </MotionBox>
          </VStack>
        </Container>
      </Box>

      {/* ── Pain Points ─────────────────────────────────── */}
      <Box py={{ base: 12, md: 20 }} bg="white">
        <Container maxW="5xl">
          <VStack spacing={10}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              textAlign="center"
            >
              <Heading size="lg" color="gray.800" mb={3}>
                {painPointsSectionTitle}{' '}
                <Text as="span" color="brand.orange">
                  {painPointsSectionHighlight}
                </Text>
              </Heading>
              <Text color="gray.600" fontSize="lg" maxW="2xl" mx="auto">
                {painPointsSectionSubtitle}
              </Text>
            </MotionBox>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="100%">
              {painPoints.map((point, i) => (
                <MotionBox
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  bg="white"
                  p={7}
                  borderRadius="2xl"
                  border="1px solid"
                  borderColor="gray.200"
                  boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)"
                  position="relative"
                  overflow="hidden"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.10)',
                    borderColor: 'orange.200',
                  }}
                  style={{ transition: 'all 0.25s ease' }}
                >
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    h="3px"
                    bgGradient="linear(to-r, brand.orange, brand.red)"
                  />
                  <VStack align="start" spacing={4} mt={2}>
                    <Box
                      w={12}
                      h={12}
                      borderRadius="xl"
                      bg="red.50"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={point.icon} boxSize={6} color="red.400" />
                    </Box>
                    <HStack spacing={2}>
                      <Icon as={FiX} color="red.400" boxSize={4} />
                      <Text color="gray.500" textDecoration="line-through" fontSize="sm">
                        {point.problem}
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Icon as={FiCheck} color="green.500" boxSize={4} />
                      <Text color="gray.800" fontWeight="medium" fontSize="sm">
                        {point.solution}
                      </Text>
                    </HStack>
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* ── Solution Features Grid ──────────────────────── */}
      <Box py={{ base: 12, md: 20 }} bg="#F8FAFC">
        <Container maxW="5xl">
          <VStack spacing={10}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              textAlign="center"
            >
              <Heading size="lg" color="gray.800" mb={3}>
                {featuresSectionTitle}{' '}
                <Text as="span" color="brand.orange">
                  {featuresSectionHighlight}
                </Text>
              </Heading>
            </MotionBox>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="100%">
              {features.map((feature, i) => (
                <MotionBox
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  bg="white"
                  p={6}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.200"
                  boxShadow="0 2px 8px rgba(0, 0, 0, 0.06)"
                  _hover={{
                    borderColor: 'orange.200',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                    transform: 'translateY(-2px)',
                  }}
                  style={{ transition: 'all 0.2s' }}
                >
                  <VStack align="start" spacing={3}>
                    <Box
                      w={10}
                      h={10}
                      borderRadius="lg"
                      bg="orange.50"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={feature.icon} boxSize={5} color="brand.orange" />
                    </Box>
                    <Heading size="sm" color="gray.800">
                      {feature.title}
                    </Heading>
                    <Text color="gray.600" fontSize="sm" lineHeight="tall">
                      {feature.description}
                    </Text>
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* ── ROI Section ─────────────────────────────────── */}
      <Box py={{ base: 12, md: 20 }} bg="white">
        <Container maxW="5xl">
          <VStack spacing={10}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              textAlign="center"
            >
              <Heading size="lg" color="gray.800" mb={3}>
                {roiSectionTitle}{' '}
                <Text as="span" color="brand.orange">
                  {roiSectionHighlight}
                </Text>
              </Heading>
            </MotionBox>

            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} w="100%">
              {roiStats.map((stat, i) => (
                <MotionBox
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  bg="white"
                  p={6}
                  borderRadius="2xl"
                  border="1px solid"
                  borderColor="gray.200"
                  boxShadow="0 2px 8px rgba(0, 0, 0, 0.06)"
                  textAlign="center"
                >
                  <Stat>
                    <StatNumber
                      fontSize="3xl"
                      fontWeight="extrabold"
                      bgGradient="linear(to-r, brand.orange, brand.red)"
                      bgClip="text"
                    >
                      {stat.value}
                    </StatNumber>
                    <StatLabel color="gray.600" fontSize="sm" mt={1}>
                      {stat.label}
                    </StatLabel>
                  </Stat>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* ── Orange Gradient CTA ─────────────────────────── */}
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
                {ctaHeadline}
              </Heading>
              <Text color="whiteAlpha.900" fontSize="lg">
                {ctaDescription}
              </Text>
              <Button
                as="a"
                href={ctaLink}
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
                {IS_LAUNCHED ? 'See Pricing' : 'Join Beta'}
              </Button>
            </VStack>
          </MotionBox>
        </Container>
      </Box>

      <PremiumFooter />
    </>
  );
}
