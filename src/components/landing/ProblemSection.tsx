'use client';

/**
 * ProblemSection
 *
 * Component Hierarchy:
 * App → LandingPage → ProblemSection
 *
 * Pain point section for phoo.ai landing page.
 * Uses Chakra UI for styling (project standard).
 */

import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';

export function ProblemSection() {
  return (
    <Box as="section" py={20} borderTop="1px solid" borderColor="gray.200" bg="white">
      <Container maxW="4xl">
        <Heading
          as="h2"
          fontSize={{ base: '3xl', md: '4xl' }}
          fontWeight="bold"
          textAlign="center"
          mb={12}
          color="white"
        >
          Does this sound familiar?
        </Heading>

        <VStack spacing={6} maxW="2xl" mx="auto">
          {[
            "Your website looks fine… but doesn't bring in consistent leads",
            "You're \"doing marketing,\" but you're not sure what's actually working",
            'SEO feels confusing, slow, or like something only big companies can afford',
          ].map((problem, i) => (
            <Box
              key={i}
              display="flex"
              gap={4}
              alignItems="flex-start"
              p={6}
              borderRadius="xl"
              bg="whiteAlpha.50"
              border="1px solid"
              borderColor="whiteAlpha.100"
              w="100%"
            >
              <Box w={2} h={2} borderRadius="full" bg="red.400" mt={2} flexShrink={0} />
              <Text fontSize="lg" color="gray.300">
                {problem}
              </Text>
            </Box>
          ))}
        </VStack>

        <Box
          mt={12}
          p={8}
          borderRadius="2xl"
          bgGradient="linear(to-r, brand.orange, pink.500)"
          opacity={0.1}
          position="absolute"
        />
        <Box
          mt={12}
          p={8}
          borderRadius="2xl"
          bg="whiteAlpha.50"
          border="1px solid"
          borderColor="brand.orange"
          textAlign="center"
          position="relative"
        >
          <Text fontSize="xl" color="gray.300" lineHeight="relaxed">
            <Text as="span" fontWeight="semibold" color="white">
              You didn&apos;t start your business just to chase algorithms.
            </Text>
            <br />
            You started it to serve people and build something meaningful.
          </Text>
        </Box>
      </Container>
    </Box>
  );
}
