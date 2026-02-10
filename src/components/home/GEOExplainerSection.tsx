'use client';

/**
 * GEOExplainerSection
 *
 * Component Hierarchy:
 * App → LandingPage → GEOExplainerSection
 *
 * Explains SEO + GEO in simple terms with keyword-rich copy.
 */

import { Box, Container, Heading, Text, VStack, Icon, HStack, SimpleGrid } from '@chakra-ui/react';
import { Search, Bot, Check } from 'lucide-react';

export function GEOExplainerSection() {
  return (
    <Box as="section" py={16} bgGradient="linear(to-br, brand.orange, orange.600)">
      <Container maxW="4xl">
        <VStack spacing={8}>
          {/* Headline with keywords */}
          <Heading
            as="h2"
            fontSize={{ base: '3xl', md: '4xl' }}
            fontWeight="bold"
            color="white"
            textAlign="center"
          >
            AI SEO That Gets You Found Everywhere
          </Heading>

          {/* Simple explanation */}
          <Text fontSize="xl" color="white" textAlign="center" maxW="2xl">
            People search on <strong>Google</strong> and <strong>ChatGPT</strong> now.
            <br />
            Phoo optimizes your content for both.
          </Text>

          {/* Two-column comparison */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="100%" maxW="3xl">
            <HStack
              spacing={4}
              p={6}
              borderRadius="xl"
              bg="white"
              border="2px solid"
              borderColor="blue.300"
              align="flex-start"
            >
              <Icon as={Search} boxSize={8} color="blue.500" flexShrink={0} mt={1} />
              <Box>
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                  SEO
                </Text>
                <Text color="gray.600" fontSize="sm">
                  Rank on Google search results
                </Text>
              </Box>
            </HStack>

            <HStack
              spacing={4}
              p={6}
              borderRadius="xl"
              bg="white"
              border="2px solid"
              borderColor="orange.400"
              align="flex-start"
            >
              <Icon as={Bot} boxSize={8} color="brand.orange" flexShrink={0} mt={1} />
              <Box>
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                  GEO
                </Text>
                <Text color="gray.600" fontSize="sm">
                  Get cited by ChatGPT & Perplexity
                </Text>
              </Box>
            </HStack>
          </SimpleGrid>

          {/* Value prop with keywords */}
          <Box p={6} borderRadius="xl" bg="white" textAlign="center" maxW="2xl" boxShadow="lg">
            <Text fontSize="lg" color="gray.800" fontWeight="medium">
              <Icon as={Check} color="green.500" mr={2} />
              <strong>Small business SEO automation</strong> that works 24/7
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
