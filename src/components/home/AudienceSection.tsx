'use client';

/**
 * AudienceSection
 *
 * Component Hierarchy:
 * App → LandingPage → AudienceSection
 *
 * Who It's For section for landing page.
 * Uses Chakra UI for styling (project standard).
 */

import { Box, Container, Heading, Text, SimpleGrid, HStack, Icon } from '@chakra-ui/react';
import { Check } from 'lucide-react';

const AUDIENCE_TRAITS = [
  'Spending $0–$500/mo on marketing and want more from it',
  "Know they need leads but can't justify a $2,500/mo agency",
  'Want a system that generates pipeline, not just content',
  'Ready to invest in predictable growth, not guesswork',
];

export function AudienceSection() {
  return (
    <Box as="section" py={16} borderTop="1px solid" borderColor="gray.200" bg="white">
      <Container maxW="4xl" textAlign="center">
        <Heading
          as="h2"
          fontSize={{ base: '3xl', md: '4xl' }}
          fontWeight="bold"
          mb={12}
          color="gray.800"
        >
          Who It&apos;s For
        </Heading>

        <Text fontSize="xl" color="gray.600" mb={8}>
          Phoo is built for SMBs who:
        </Text>

        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} maxW="2xl" mx="auto" textAlign="left">
          {AUDIENCE_TRAITS.map((trait) => (
            <HStack
              key={trait}
              gap={3}
              p={4}
              borderRadius="lg"
              bg="green.50"
              border="1px solid"
              borderColor="green.200"
            >
              <Icon as={Check} boxSize={5} color="green.500" flexShrink={0} />
              <Text color="gray.700">{trait}</Text>
            </HStack>
          ))}
        </SimpleGrid>

        <Text color="gray.500" mt={8} fontStyle="italic">
          Currently in beta — built from a real client&apos;s workflow, not a whiteboard.
        </Text>
      </Container>
    </Box>
  );
}
