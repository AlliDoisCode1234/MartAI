'use client';

/**
 * JoinProblemSection
 *
 * Component Hierarchy:
 * App → JoinPage → JoinProblemSection
 *
 * Pain point section for /join page.
 */

import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';

export function JoinProblemSection() {
  return (
    <Box as="section" py={16} bg="gray.800" borderTop="1px solid" borderColor="gray.700">
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
              bg="gray.700"
              border="1px solid"
              borderColor="gray.600"
              w="100%"
            >
              <Box w={2} h={2} borderRadius="full" bg="red.400" mt={2} flexShrink={0} />
              <Text fontSize="lg" color="gray.200">
                {problem}
              </Text>
            </Box>
          ))}
        </VStack>

        <Box
          mt={12}
          p={8}
          borderRadius="2xl"
          bg="gray.700"
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
