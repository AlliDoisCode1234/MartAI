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
    <Box as="section" py={20} borderTop="1px solid" borderColor="gray.200" bg="white">
      <Container maxW="4xl">
        <VStack spacing={12}>
          {/* Section Header */}
          <VStack spacing={4} textAlign="center">
            <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="bold" color="white">
              Wait, what&apos;s{' '}
              <Text as="span" color="brand.orange">
                GEO
              </Text>
              ?
            </Heading>
            <Text fontSize="lg" color="gray.400" maxW="2xl">
              (And why should you care?)
            </Text>
          </VStack>

          {/* The Story */}
          <VStack
            spacing={6}
            p={8}
            borderRadius="2xl"
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="whiteAlpha.100"
            maxW="3xl"
            textAlign="left"
          >
            <Text fontSize="lg" color="gray.300" lineHeight="1.8">
              <Text as="span" fontWeight="bold" color="white">
                Remember when you used to ask your parents everything?
              </Text>
            </Text>

            <Text fontSize="lg" color="gray.300" lineHeight="1.8">
              &quot;Mom, what&apos;s the capital of France?&quot; &quot;Dad, how do you make
              cookies?&quot;
            </Text>

            <Text fontSize="lg" color="gray.300" lineHeight="1.8">
              Then you discovered{' '}
              <Text as="span" fontWeight="bold" color="white">
                Google
              </Text>
              . Type a question, get a list of websites. Click around. Find your answer.
            </Text>

            <Text fontSize="lg" color="gray.300" lineHeight="1.8">
              But now there&apos;s something new:{' '}
              <Text as="span" fontWeight="bold" color="brand.orange">
                AI assistants
              </Text>{' '}
              like ChatGPT, Perplexity, and Claude.
            </Text>

            <Text fontSize="lg" color="gray.300" lineHeight="1.8">
              You ask them a question, and they just...{' '}
              <Text as="span" fontWeight="bold" color="white">
                answer you
              </Text>
              . No clicking. No searching. They already read all the websites and give you the good
              stuff.
            </Text>
          </VStack>

          {/* SEO vs GEO */}
          <VStack spacing={6} w="100%" maxW="3xl">
            <HStack
              spacing={4}
              p={6}
              borderRadius="xl"
              bg="whiteAlpha.50"
              border="1px solid"
              borderColor="whiteAlpha.100"
              w="100%"
            >
              <Icon as={Search} boxSize={8} color="blue.400" flexShrink={0} />
              <Box>
                <Text fontSize="lg" fontWeight="bold" color="white">
                  SEO
                </Text>
                <Text color="gray.400">Getting found by Google (search engines)</Text>
              </Box>
            </HStack>

            <HStack
              spacing={4}
              p={6}
              borderRadius="xl"
              bg="whiteAlpha.50"
              border="1px solid"
              borderColor="brand.orange"
              w="100%"
            >
              <Icon as={Bot} boxSize={8} color="brand.orange" flexShrink={0} />
              <Box>
                <Text fontSize="lg" fontWeight="bold" color="white">
                  GEO
                </Text>
                <Text color="gray.400">Getting found by AI assistants (ChatGPT, Perplexity)</Text>
              </Box>
            </HStack>
          </VStack>

          {/* Punchline */}
          <Box
            p={8}
            borderRadius="2xl"
            bgGradient="linear(to-r, whiteAlpha.100, whiteAlpha.50)"
            border="1px solid"
            borderColor="brand.orange"
            textAlign="center"
            maxW="3xl"
          >
            <HStack justify="center" mb={4}>
              <Icon as={MessageCircle} boxSize={6} color="brand.orange" />
            </HStack>
            <Text fontSize="xl" color="white" fontWeight="bold">
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
