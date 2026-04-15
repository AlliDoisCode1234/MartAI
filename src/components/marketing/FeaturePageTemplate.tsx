'use client';

/**
 * FeaturePageTemplate
 *
 * Component Hierarchy:
 * App -> FeaturePageTemplate
 *   ├── MegaMenuHeader
 *   ├── Hero Section (badge + headline + description)
 *   ├── Key Benefits Grid
 *   ├── Product Screenshot
 *   ├── Differentiators Cards
 *   ├── Orange Gradient CTA
 *   └── PremiumFooter
 *
 * Reusable template for all feature marketing pages.
 * Accepts content data as props — each page file is just data + template.
 */

import { type ReactNode } from 'react';
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
  Badge as ChakraBadge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiCheck, FiArrowRight } from 'react-icons/fi';
import { type IconType } from 'react-icons';
import { MegaMenuHeader, PremiumFooter, ProductScreenshot } from '@/src/components/marketing';
import { IS_LAUNCHED, BETA_JOIN_HREF, LAUNCHED_PRICING_HREF } from '@/lib/constants/featureFlags';
import { usePathname } from 'next/navigation';

const MotionBox = motion(Box);

interface Differentiator {
  icon: IconType;
  title: string;
  description: string;
}

interface Props {
  badge: string;
  badgeIcon: IconType;
  headline: string;
  headlineHighlight: string;
  description: string;
  benefits: string[];
  screenshotSrc: string;
  screenshotAlt: string;
  differentiators: Differentiator[];
  ctaHeadline?: string;
  ctaDescription?: string;
  benefitsSectionTitle?: string;
  benefitsSectionHighlight?: string;
  benefitsSectionSubtitle?: string;
  differentiatorsSectionTitle?: string;
  differentiatorsSectionHighlight?: string;
  children?: ReactNode;
}

export function FeaturePageTemplate({
  badge,
  badgeIcon,
  headline,
  headlineHighlight,
  description,
  benefits,
  screenshotSrc,
  screenshotAlt,
  differentiators,
  ctaHeadline = 'Ready to transform your content strategy?',
  ctaDescription = 'Join hundreds of businesses growing their organic traffic with AI-powered SEO.',
  benefitsSectionTitle = 'Everything you need,',
  benefitsSectionHighlight = "nothing you don't",
  benefitsSectionSubtitle = 'Powerful features designed to save you time and maximize your results.',
  differentiatorsSectionTitle = 'What makes this',
  differentiatorsSectionHighlight = 'different',
  children,
}: Props) {
  const pathname = usePathname();

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
        name: 'Features',
        item: 'https://www.phoo.ai/features',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: badge,
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

      {/* ── Hero Section ────────────────────────────────── */}
      <Box
        bg="linear-gradient(180deg, #FFF8F0 0%, white 50%)"
        pt={{ base: 24, md: 32 }}
        pb={{ base: 12, md: 20 }}
      >
        <Container maxW="6xl">
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
                <Icon as={badgeIcon} color="brand.orange" boxSize={4} />
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color="brand.orange"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  {badge}
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
                href={IS_LAUNCHED ? LAUNCHED_PRICING_HREF : BETA_JOIN_HREF}
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

      {/* ── Product Screenshot ──────────────────────────── */}
      <Box py={{ base: 8, md: 16 }} bg="white">
        <Container maxW="5xl">
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ProductScreenshot src={screenshotSrc} alt={screenshotAlt} />
          </MotionBox>
        </Container>
      </Box>

      {/* ── Key Benefits Grid ───────────────────────────── */}
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
                {benefitsSectionTitle}{' '}
                <Text as="span" color="brand.orange">
                  {benefitsSectionHighlight}
                </Text>
              </Heading>
              <Text color="gray.600" fontSize="lg" maxW="2xl" mx="auto">
                {benefitsSectionSubtitle}
              </Text>
            </MotionBox>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} w="100%">
              {benefits.map((benefit, i) => (
                <MotionBox
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <HStack
                    spacing={4}
                    bg="white"
                    p={5}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="gray.200"
                    boxShadow="0 2px 8px rgba(0, 0, 0, 0.06)"
                    _hover={{
                      borderColor: 'orange.200',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                      transform: 'translateY(-1px)',
                    }}
                    transition="all 0.2s"
                  >
                    <Box
                      flexShrink={0}
                      w={8}
                      h={8}
                      borderRadius="lg"
                      bg="orange.50"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={FiCheck} color="brand.orange" boxSize={4} />
                    </Box>
                    <Text color="gray.700" fontSize="md" fontWeight="medium">
                      {benefit}
                    </Text>
                  </HStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* ── Differentiators ─────────────────────────────── */}
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
                {differentiatorsSectionTitle}{' '}
                <Text as="span" color="brand.orange">
                  {differentiatorsSectionHighlight}
                </Text>
              </Heading>
            </MotionBox>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="100%">
              {differentiators.map((diff, i) => (
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
                      bg="orange.50"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={diff.icon} boxSize={6} color="brand.orange" />
                    </Box>
                    <Heading size="md" color="gray.800">
                      {diff.title}
                    </Heading>
                    <Text color="gray.600" lineHeight="tall">
                      {diff.description}
                    </Text>
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* ── Additional Content ──────────────────────────── */}
      {children}

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
                href="/pricing"
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
                See Pricing
              </Button>
            </VStack>
          </MotionBox>
        </Container>
      </Box>

      <PremiumFooter />
    </>
  );
}
