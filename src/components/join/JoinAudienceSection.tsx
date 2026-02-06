'use client';

/**
 * JoinAudienceSection
 *
 * Component Hierarchy:
 * App → JoinPage → JoinAudienceSection
 *
 * Who It's For section for /join page.
 */

import { Box, Container, Heading, Text, SimpleGrid, HStack, Icon } from '@chakra-ui/react';
import { Check } from 'lucide-react';

const AUDIENCE_TRAITS = [
  'Care about serving their community',
  'Want sustainable growth, not gimmicks',
  'Believe their work has purpose',
  'Tired of marketing that feels busy but not effective',
];

export function JoinAudienceSection() {
  return (
    <Box as="section" py={16} borderTop="1px solid" borderColor="gray.700" bg="gray.800">
      <Container maxW="4xl" textAlign="center">
        <Heading
          as="h2"
          fontSize={{ base: '3xl', md: '4xl' }}
          fontWeight="bold"
          mb={12}
          color="white"
        >
          Who It&apos;s For
        </Heading>

        <Text fontSize="xl" color="gray.300" mb={8}>
          Phoo is built for local businesses who:
        </Text>

        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} maxW="2xl" mx="auto" textAlign="left">
          {AUDIENCE_TRAITS.map((trait) => (
            <HStack
              key={trait}
              gap={3}
              p={4}
              borderRadius="lg"
              bg="gray.700"
              border="1px solid"
              borderColor="gray.600"
            >
              <Icon as={Check} boxSize={5} color="green.400" flexShrink={0} />
              <Text color="gray.200">{trait}</Text>
            </HStack>
          ))}
        </SimpleGrid>

        <Text color="gray.500" mt={8} fontStyle="italic">
          (And yes — others are welcome too.)
        </Text>
      </Container>
    </Box>
  );
}
