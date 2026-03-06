'use client';

/**
 * DarkGradientAISection
 *
 * Component Hierarchy:
 * App -> LandingPage -> DarkGradientAISection
 *
 * High-impact dark section highlighting GEO urgency.
 * Per LDD: deep navy background with glowing gradient orbs,
 * "40% of searches answered by AI" stat, glassmorphic card.
 */

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  HStack,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiAlertTriangle, FiTarget, FiTrendingUp } from 'react-icons/fi';
import { IS_LAUNCHED, BETA_JOIN_HREF, LAUNCHED_SIGNUP_HREF } from '@/lib/constants/featureFlags';

const MotionBox = motion(Box);

interface StatCard {
  icon: typeof FiAlertTriangle;
  stat: string;
  label: string;
}

const STATS: StatCard[] = [
  { icon: FiAlertTriangle, stat: '40%', label: 'of searches now answered by AI' },
  { icon: FiTarget, stat: '0%', label: 'of small businesses optimized for it' },
  { icon: FiTrendingUp, stat: '3x', label: 'more citations with GEO optimization' },
];

export function DarkGradientAISection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-100px' });

  return (
    <Box
      as="section"
      position="relative"
      overflow="hidden"
      bg="#0f172a"
      py={{ base: 16, md: 24 }}
      ref={ref}
      aria-label="GEO optimization urgency"
    >
      {/* Gradient Glow Orbs */}
      <Box
        position="absolute"
        top="-20%"
        left="-10%"
        w="50%"
        h="60%"
        borderRadius="full"
        bg="brand.orange"
        opacity={0.08}
        filter="blur(120px)"
        pointerEvents="none"
        aria-hidden="true"
      />
      <Box
        position="absolute"
        bottom="-20%"
        right="-10%"
        w="40%"
        h="50%"
        borderRadius="full"
        bg="brand.red"
        opacity={0.06}
        filter="blur(100px)"
        pointerEvents="none"
        aria-hidden="true"
      />

      <Container maxW="5xl" position="relative" zIndex={1}>
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <VStack spacing={{ base: 8, md: 12 }} textAlign="center">
            {/* Headline */}
            <VStack spacing={4}>
              <Heading
                as="h2"
                fontSize={{ base: '3xl', md: '5xl' }}
                fontWeight="extrabold"
                color="white"
                lineHeight="1.1"
              >
                The Future of Search is
                <br />
                <Text as="span" bgGradient="linear(to-r, brand.orange, brand.red)" bgClip="text">
                  Already Here
                </Text>
              </Heading>
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                color="rgba(255, 255, 255, 0.8)"
                maxW="600px"
              >
                Google&apos;s AI now answers nearly half of all searches directly. If your content
                isn&apos;t optimized for AI citations, you&apos;re invisible.
              </Text>
            </VStack>

            {/* Stat Cards — Glassmorphic */}
            <Flex
              gap={{ base: 4, md: 6 }}
              justify="center"
              direction={{ base: 'column', md: 'row' }}
              w="100%"
            >
              {STATS.map((card) => (
                <Box
                  key={card.label}
                  bg="rgba(255, 255, 255, 0.05)"
                  backdropFilter="blur(20px)"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  borderRadius="xl"
                  p={{ base: 5, md: 6 }}
                  flex="1"
                  textAlign="center"
                >
                  <Icon as={card.icon} boxSize={6} color="brand.orange" mb={3} />
                  <Text
                    fontSize={{ base: '3xl', md: '4xl' }}
                    fontWeight="extrabold"
                    bgGradient="linear(to-r, brand.orange, brand.red)"
                    bgClip="text"
                    lineHeight="1"
                  >
                    {card.stat}
                  </Text>
                  <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)" mt={2}>
                    {card.label}
                  </Text>
                </Box>
              ))}
            </Flex>

            {/* CTA */}
            <HStack spacing={4}>
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
            </HStack>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
}
