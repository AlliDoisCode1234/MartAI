'use client';

/**
 * HeroSection
 *
 * Component Hierarchy:
 * App → LandingPage → HeroSection
 *
 * Hero section for phoo.ai landing page with headline and primary CTA.
 * Antigravity-inspired design: soft blurred color blobs, glassmorphism,
 * bold centered typography, minimalist layout.
 */

import { Box, Container, Heading, Text, Button, HStack, Icon, VStack } from '@chakra-ui/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { MartCharacter } from '@/src/components/assistant/MartCharacter';

interface Props {
  onCtaClick?: () => void;
}

const MotionBox = motion(Box);

export function HeroSection({ onCtaClick }: Props) {
  return (
    <Box
      as="header"
      position="relative"
      overflow="hidden"
      bg="white"
      minH={{ base: '90vh', lg: '100vh' }}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {/* Antigravity-style blurred gradient orbs */}
      <Box
        position="absolute"
        top="-10%"
        left="10%"
        w={{ base: '20rem', lg: '40rem' }}
        h={{ base: '20rem', lg: '40rem' }}
        bg="brand.orange"
        opacity={0.15}
        borderRadius="full"
        filter={{ base: 'blur(80px)', lg: 'blur(120px)' }}
      />
      <Box
        position="absolute"
        bottom="-20%"
        right="5%"
        w={{ base: '25rem', lg: '50rem' }}
        h={{ base: '25rem', lg: '50rem' }}
        bg="brand.red"
        opacity={0.15}
        borderRadius="full"
        filter={{ base: 'blur(100px)', lg: 'blur(150px)' }}
      />
      <Box
        position="absolute"
        top="40%"
        right="30%"
        w={{ base: '15rem', lg: '30rem' }}
        h={{ base: '15rem', lg: '30rem' }}
        bg="orange.300"
        opacity={0.08}
        borderRadius="full"
        filter={{ base: 'blur(60px)', lg: 'blur(100px)' }}
      />

      <Container maxW="5xl" textAlign="center" position="relative" zIndex={1}>
        <VStack spacing={{ base: 8, lg: 10 }}>
          {/* Badge with glassmorphism */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            // @ts-ignore - framer-motion transition type
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <HStack
              gap={2}
              px={5}
              py={2.5}
              borderRadius="full"
              bg="whiteAlpha.50"
              border="1px solid"
              borderColor="whiteAlpha.100"
              backdropFilter="blur(12px)"
              boxShadow="0 0 30px rgba(237, 137, 54, 0.1)"
            >
              <Icon as={Sparkles} boxSize={4} color="brand.orange" />
              <Text fontSize="sm" color="gray.300" fontWeight="medium">
                Built by the team behind Helps2
              </Text>
            </HStack>
          </MotionBox>

          {/* Headline - New GEO+SEO messaging */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            // @ts-ignore
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Heading
              as="h1"
              fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
              fontWeight="bold"
              lineHeight="1.1"
              letterSpacing="-0.02em"
              color="white"
            >
              Get Found by Google
              <br />
              <Text
                as="span"
                bgGradient="linear(to-r, brand.orange, brand.red, orange.300)"
                bgClip="text"
              >
                AND ChatGPT
              </Text>
            </Heading>
          </MotionBox>

          {/* Subheadline */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            // @ts-ignore
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Text
              fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
              color="gray.400"
              maxW="3xl"
              mx="auto"
              lineHeight="1.7"
            >
              Phoo is like having a marketing team that never sleeps. We create content that ranks
              on search engines AND gets cited by AI assistants. All you do is approve.
            </Text>
          </MotionBox>

          {/* Primary CTA with glow effect */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            // @ts-ignore
            transition={{ duration: 0.6, delay: 0.7 }}
            pt={4}
          >
            <Button
              as="a"
              href="#join-beta"
              onClick={onCtaClick}
              size="lg"
              px={10}
              py={8}
              fontSize="xl"
              fontWeight="semibold"
              bgGradient="linear(to-r, brand.orange, brand.red)"
              color="white"
              _hover={{
                bgGradient: 'linear(to-r, orange.500, red.500)',
                transform: 'translateY(-2px)',
                boxShadow: '0 20px 60px rgba(237, 137, 54, 0.35)',
              }}
              borderRadius="2xl"
              boxShadow="0 10px 40px rgba(237, 137, 54, 0.25)"
              rightIcon={<Icon as={ArrowRight} boxSize={6} />}
              transition="all 0.3s ease"
            >
              Join the Phoo Beta
            </Button>
          </MotionBox>
        </VStack>
      </Container>

      {/* Bottom gradient fade */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        h="30vh"
        bgGradient="linear(to-t, gray.900, transparent)"
        pointerEvents="none"
      />
    </Box>
  );
}
