'use client';

/**
 * HeroSection
 *
 * Component Hierarchy:
 * App → LandingPage → HeroSection
 *
 * Hero section for phoo.ai landing page with headline and primary CTA.
 * Uses Chakra UI for styling (project standard).
 */

import { Box, Container, Heading, Text, Button, HStack, Icon, VStack } from '@chakra-ui/react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  onCtaClick?: () => void;
}

export function HeroSection({ onCtaClick }: Props) {
  return (
    <Box as="header" position="relative" overflow="hidden" bg="gray.900">
      {/* Gradient orbs for visual interest */}
      <Box
        position="absolute"
        top="0"
        left="25%"
        w="24rem"
        h="24rem"
        bg="brand.orange"
        opacity={0.2}
        borderRadius="full"
        filter="blur(60px)"
      />
      <Box
        position="absolute"
        bottom="0"
        right="25%"
        w="24rem"
        h="24rem"
        bg="brand.red"
        opacity={0.2}
        borderRadius="full"
        filter="blur(60px)"
      />

      <Container maxW="4xl" py={{ base: 24, lg: 32 }} textAlign="center" position="relative">
        {/* Badge */}
        <HStack justify="center" mb={8}>
          <HStack
            gap={2}
            px={4}
            py={2}
            borderRadius="full"
            bg="whiteAlpha.100"
            border="1px solid"
            borderColor="whiteAlpha.200"
            backdropFilter="blur(8px)"
          >
            <Icon as={Sparkles} boxSize={4} color="brand.orange" />
            <Text fontSize="sm" color="gray.300">
              Built by the team behind Helps2
            </Text>
          </HStack>
        </HStack>

        {/* Headline */}
        <Heading
          as="h1"
          fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
          fontWeight="bold"
          lineHeight="tight"
          mb={6}
          color="white"
        >
          Turn Your Website Into a
          <br />
          <Text
            as="span"
            bgGradient="linear(to-r, brand.orange, brand.red, orange.300)"
            bgClip="text"
          >
            Steady Source of Leads
          </Text>
          <br />— Automatically
        </Heading>

        {/* Subheadline */}
        <Text fontSize={{ base: 'xl', md: '2xl' }} color="gray.400" maxW="3xl" mx="auto" mb={10}>
          Phoo helps purpose-driven local businesses grow traffic, leads, and revenue with an
          automated SEO system that actually works.
        </Text>

        {/* Primary CTA */}
        <Button
          as="a"
          href="#join-beta"
          onClick={onCtaClick}
          size="lg"
          px={8}
          py={7}
          fontSize="lg"
          fontWeight="semibold"
          bgGradient="linear(to-r, brand.orange, brand.red)"
          color="white"
          _hover={{
            bgGradient: 'linear(to-r, orange.600, red.500)',
          }}
          borderRadius="xl"
          boxShadow="0 10px 40px rgba(237, 137, 54, 0.25)"
          rightIcon={<Icon as={ArrowRight} boxSize={5} />}
        >
          Join the Phoo Beta
        </Button>
      </Container>
    </Box>
  );
}
