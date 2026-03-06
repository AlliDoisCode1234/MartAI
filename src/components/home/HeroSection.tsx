'use client';

/**
 * HeroSection
 *
 * Component Hierarchy:
 * App -> LandingPage -> HeroSection
 *   ├── Left: Badge + Headline + Sub-headline + Dual CTAs
 *   └── Right: ProductScreenshot + floating StatBadges
 *
 * Split-layout hero section for phoo.ai sales landing page.
 * Left side: bold copy + CTAs. Right side: product mockup with floating stats.
 * Responsive: stacks to single column on mobile.
 */

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  HStack,
  Icon,
  VStack,
  Flex,
} from '@chakra-ui/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { FiTrendingUp, FiTarget } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa';
import { IS_LAUNCHED, BETA_JOIN_HREF, LAUNCHED_SIGNUP_HREF } from '@/lib/constants/featureFlags';
import { motion } from 'framer-motion';
import { ProductScreenshot } from '@/src/components/marketing/ProductScreenshot';
import { StatBadge } from '@/src/components/marketing/StatBadge';

interface Props {
  onCtaClick?: () => void;
}

const MotionBox = motion(Box);

export function HeroSection({ onCtaClick }: Props) {
  return (
    <Box
      as="section"
      position="relative"
      overflow="hidden"
      bg="white"
      minH={{ base: 'auto', lg: '85vh' }}
      display="flex"
      alignItems="center"
      py={{ base: 16, md: 20, lg: 0 }}
    >
      {/* ── Background gradient orbs ────────────────────────── */}
      <Box
        position="absolute"
        top="-10%"
        left="5%"
        w={{ base: '20rem', lg: '40rem' }}
        h={{ base: '20rem', lg: '40rem' }}
        bg="brand.orange"
        opacity={0.12}
        borderRadius="full"
        filter={{ base: 'blur(80px)', lg: 'blur(120px)' }}
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-15%"
        right="0%"
        w={{ base: '25rem', lg: '45rem' }}
        h={{ base: '25rem', lg: '45rem' }}
        bg="brand.red"
        opacity={0.1}
        borderRadius="full"
        filter={{ base: 'blur(100px)', lg: 'blur(150px)' }}
        pointerEvents="none"
      />
      <Box
        position="absolute"
        top="50%"
        left="40%"
        w="25rem"
        h="25rem"
        bg="orange.300"
        opacity={0.06}
        borderRadius="full"
        filter="blur(100px)"
        pointerEvents="none"
      />

      <Container maxW="7xl" position="relative" zIndex={1}>
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          align="center"
          justify="space-between"
          gap={{ base: 12, lg: 16 }}
        >
          {/* ── Left: Copy + CTAs ──────────────────────────── */}
          <VStack
            align={{ base: 'center', lg: 'flex-start' }}
            spacing={{ base: 6, lg: 8 }}
            maxW={{ lg: '520px' }}
            textAlign={{ base: 'center', lg: 'left' }}
            flex={1}
          >
            {/* Badge */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              // @ts-ignore - framer-motion transition type
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <HStack
                spacing={2}
                px={5}
                py={2.5}
                borderRadius="full"
                bg="orange.50"
                border="1px solid"
                borderColor="brand.orange"
              >
                <Icon as={Sparkles} boxSize={4} color="brand.orange" />
                <Text fontSize="sm" color="gray.700" fontWeight="medium">
                  AI-Powered SEO + GEO
                </Text>
              </HStack>
            </MotionBox>

            {/* Headline */}
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              // @ts-ignore
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Heading
                as="h1"
                fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
                fontWeight="bold"
                lineHeight="1.1"
                letterSpacing="-0.02em"
                color="gray.800"
              >
                Predictable Leads.
                <br />
                <Text
                  as="span"
                  bgGradient="linear(to-r, brand.orange, brand.red, orange.300)"
                  bgClip="text"
                >
                  No Agency Required.
                </Text>
              </Heading>
            </MotionBox>

            {/* Sub-headline */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              // @ts-ignore
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.600" lineHeight="1.7">
                Phoo replaces your $2,500/mo marketing agency with an AI-powered lead generation
                system.{' '}
                <Text as="span" fontWeight="semibold" color="gray.800">
                  Built for Google and the new AI search era.
                </Text>
              </Text>
            </MotionBox>

            {/* Dual CTAs */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              // @ts-ignore
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <HStack spacing={4} flexWrap="wrap" justify={{ base: 'center', lg: 'flex-start' }}>
                <Button
                  as="a"
                  href={IS_LAUNCHED ? LAUNCHED_SIGNUP_HREF : BETA_JOIN_HREF}
                  onClick={onCtaClick}
                  size="lg"
                  px={8}
                  py={7}
                  fontSize="lg"
                  fontWeight="semibold"
                  bgGradient="linear(to-r, brand.orange, brand.red)"
                  color="white"
                  _hover={{
                    bgGradient: 'linear(to-r, orange.500, red.500)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 20px 60px rgba(237, 137, 54, 0.35)',
                  }}
                  borderRadius="full"
                  boxShadow="0 10px 40px rgba(237, 137, 54, 0.25)"
                  rightIcon={<Icon as={ArrowRight} boxSize={5} />}
                  transition="all 0.3s ease"
                >
                  {IS_LAUNCHED ? 'Start Getting Leads' : 'Join Beta'}
                </Button>
                <Button
                  as="a"
                  href="/how-it-works"
                  size="lg"
                  px={8}
                  py={7}
                  fontSize="lg"
                  fontWeight="semibold"
                  variant="outline"
                  borderWidth="2px"
                  borderColor="brand.orange"
                  color="brand.orange"
                  borderRadius="full"
                  _hover={{
                    bg: 'orange.50',
                    transform: 'translateY(-2px)',
                  }}
                  transition="all 0.3s ease"
                >
                  Watch Demo
                </Button>
              </HStack>
            </MotionBox>

            {/* Trust signals */}
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              // @ts-ignore
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <HStack spacing={6} color="gray.500" fontSize="sm">
                <HStack spacing={1.5}>
                  <Text color="orange.500" fontWeight="bold">
                    &#9888;
                  </Text>
                  <Text>40% of searches now answered by AI</Text>
                </HStack>
                <HStack spacing={1.5}>
                  <Text color="orange.500" fontWeight="bold">
                    &#10003;
                  </Text>
                  <Text>Your competitors are already adapting</Text>
                </HStack>
              </HStack>
            </MotionBox>
          </VStack>

          {/* ── Right: Product Mockup ─────────────────────── */}
          <MotionBox
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            // @ts-ignore
            transition={{ duration: 0.8, delay: 0.4 }}
            flex={1}
            maxW={{ lg: '580px' }}
            position="relative"
          >
            <ProductScreenshot
              src="/images/dashboard-mockup.png"
              alt="Phoo AI analytics dashboard showing leads, traffic, and PR score metrics"
              width={1200}
              height={750}
            >
              {/* Floating stat badges */}
              <Box
                position="absolute"
                top={{ base: '-10px', lg: '-16px' }}
                right={{ base: '-5px', lg: '-30px' }}
              >
                <StatBadge label="PR Score" value="87" icon={FiTarget} color="#22C55E" />
              </Box>
              <Box
                position="absolute"
                bottom={{ base: '20px', lg: '30px' }}
                left={{ base: '-5px', lg: '-35px' }}
              >
                <StatBadge label="Traffic" value="+23%" icon={FiTrendingUp} color="brand.orange" />
              </Box>
            </ProductScreenshot>
          </MotionBox>
        </Flex>
      </Container>

      {/* Bottom gradient fade */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        h="15vh"
        bgGradient="linear(to-t, white, transparent)"
        pointerEvents="none"
      />
    </Box>
  );
}
