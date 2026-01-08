'use client';

/**
 * BetaSection
 *
 * Component Hierarchy:
 * App → LandingPage → BetaSection
 *
 * Why Beta section for landing page.
 * Uses Chakra UI for styling (project standard).
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
  List,
  ListItem,
} from '@chakra-ui/react';
import { Check } from 'lucide-react';

const OUR_GOALS = [
  'Shape Phoo around real-world needs',
  'Gather feedback from business owners we trust',
  'Build something genuinely helpful — not bloated',
];

const BETA_BENEFITS = [
  'Early access to Phoo',
  'Founding beta pricing',
  'Direct input into product features',
  'Priority onboarding and support',
];

export function BetaSection() {
  return (
    <Box as="section" py={20} borderTop="1px solid" borderColor="whiteAlpha.100" bg="gray.900">
      <Container maxW="4xl">
        <Heading
          as="h2"
          fontSize={{ base: '3xl', md: '4xl' }}
          fontWeight="bold"
          textAlign="center"
          mb={6}
          color="white"
        >
          Why Beta?
        </Heading>
        <Text fontSize="xl" color="gray.400" textAlign="center" mb={12} maxW="2xl" mx="auto">
          We&apos;re opening early beta access to a small group of businesses so we can:
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {/* What We Get */}
          <Box
            p={8}
            borderRadius="2xl"
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="whiteAlpha.100"
          >
            <Heading as="h3" fontSize="xl" fontWeight="semibold" mb={6} color="gray.300">
              We want to:
            </Heading>
            <VStack align="start" spacing={4}>
              {OUR_GOALS.map((goal) => (
                <HStack key={goal} gap={3}>
                  <Box w={1.5} h={1.5} borderRadius="full" bg="brand.orange" flexShrink={0} />
                  <Text color="gray.400">{goal}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>

          {/* What You Get */}
          <Box
            p={8}
            borderRadius="2xl"
            bgGradient="linear(to-br, orange.900, red.900)"
            border="1px solid"
            borderColor="brand.orange"
          >
            <Heading as="h3" fontSize="xl" fontWeight="semibold" mb={6} color="white">
              Beta users get:
            </Heading>
            <VStack align="start" spacing={4}>
              {BETA_BENEFITS.map((benefit) => (
                <HStack key={benefit} gap={3}>
                  <Icon as={Check} boxSize={5} color="green.400" flexShrink={0} />
                  <Text color="white">{benefit}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
