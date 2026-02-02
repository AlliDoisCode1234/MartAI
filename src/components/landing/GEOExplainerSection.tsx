'use client';

/**
 * GEOExplainerSection
 *
 * Component Hierarchy:
 * App → LandingPage → GEOExplainerSection
 *
 * Explains GEO (Generative Engine Optimization) in simple terms.
 * Uses Duolingo-inspired storytelling for middle-school readability.
 */

import { Box, Container, Heading, Text, VStack, Icon, HStack } from '@chakra-ui/react';
import { MessageCircle, Search, Bot } from 'lucide-react';

export function GEOExplainerSection() {
  return (
    <Box as="section" py={16} bgGradient="linear(to-br, purple.600, purple.800)">
      <Container maxW="4xl">
        <VStack spacing={8}>
          {/* Section Header */}
          <VStack spacing={4} textAlign="center">
            <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="bold" color="white">
              Wait, what&apos;s{' '}
              <Text as="span" color="brand.orange">
                GEO
              </Text>
              ?
            </Heading>
            <Text fontSize="lg" color="whiteAlpha.700" maxW="2xl">
              (And why should you care?)
            </Text>
          </VStack>

          {/* Brief intro */}
          <Text fontSize="lg" color="whiteAlpha.800" maxW="2xl" textAlign="center">
            People are changing how they search. Instead of Googling, they&apos;re asking{' '}
            <Text as="span" fontWeight="bold" color="orange.300">
              AI assistants
            </Text>{' '}
            like ChatGPT and Perplexity for answers.
          </Text>

          {/* SEO vs GEO */}
          <VStack spacing={6} w="100%" maxW="3xl">
            <HStack
              spacing={4}
              p={6}
              borderRadius="xl"
              bg="blue.50"
              border="1px solid"
              borderColor="blue.200"
              w="100%"
            >
              <Icon as={Search} boxSize={8} color="blue.500" flexShrink={0} />
              <Box>
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                  SEO
                </Text>
                <Text color="gray.600">Getting found by Google (search engines)</Text>
              </Box>
            </HStack>

            <HStack
              spacing={4}
              p={6}
              borderRadius="xl"
              bg="orange.50"
              border="1px solid"
              borderColor="brand.orange"
              w="100%"
            >
              <Icon as={Bot} boxSize={8} color="brand.orange" flexShrink={0} />
              <Box>
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                  GEO
                </Text>
                <Text color="gray.600">Getting found by AI assistants (ChatGPT, Perplexity)</Text>
              </Box>
            </HStack>
          </VStack>

          {/* Punchline */}
          <Box
            p={8}
            borderRadius="2xl"
            bg="orange.50"
            border="2px solid"
            borderColor="brand.orange"
            textAlign="center"
            maxW="3xl"
          >
            <HStack justify="center" mb={4}>
              <Icon as={MessageCircle} boxSize={6} color="brand.orange" />
            </HStack>
            <Text fontSize="xl" color="gray.800" fontWeight="bold">
              Phoo creates content that works for{' '}
              <Text as="span" color="brand.orange">
                both
              </Text>
              . Automatically.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
