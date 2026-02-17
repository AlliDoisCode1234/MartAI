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
    <Box as="section" py={16} bg="orange.50" borderTop="1px solid" borderColor="orange.100">
      <Container maxW="4xl">
        <Heading
          as="h2"
          fontSize={{ base: '3xl', md: '4xl' }}
          fontWeight="bold"
          textAlign="center"
          mb={12}
          color="gray.800"
        >
          Does this sound familiar?
        </Heading>

        <VStack spacing={6} maxW="2xl" mx="auto">
          {[
            "You're spending hours on marketing but can't point to a single lead it brought in",
            "Agencies want $2,500/mo and you're not even sure what they do",
            "Your competitors are showing up on Google and in AI answers — and you're not",
          ].map((problem, i) => (
            <Box
              key={i}
              display="flex"
              gap={4}
              alignItems="flex-start"
              p={6}
              borderRadius="xl"
              bg="white"
              border="1px solid"
              borderColor="orange.200"
              w="100%"
            >
              <Box w={2} h={2} borderRadius="full" bg="red.400" mt={2} flexShrink={0} />
              <Text fontSize="lg" color="gray.700">
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
          bg="orange.50"
          border="1px solid"
          borderColor="brand.orange"
          textAlign="center"
          position="relative"
        >
          <Text fontSize="xl" color="gray.600" lineHeight="relaxed">
            <Text as="span" fontWeight="semibold" color="gray.800">
              You shouldn&apos;t need a $30,000/year agency to get leads.
            </Text>
            <br />
            Phoo gives you the system agencies use — at a fraction of the cost.
          </Text>
        </Box>
      </Container>
    </Box>
  );
}
