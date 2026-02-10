'use client';

/**
 * BetaSection
 *
 * Component Hierarchy:
 * App → LandingPage → BetaSection
 *
 * Founding member beta benefits - streamlined single column.
 */

import { Box, Container, Heading, Text, VStack, HStack, Icon } from '@chakra-ui/react';
import { Check, Sparkles } from 'lucide-react';

const BETA_BENEFITS = [
  '6 months free access',
  'Direct input on features',
  'Priority support',
  'Lock in founding member pricing',
];

export function BetaSection() {
  return (
    <Box as="section" py={16} bgGradient="linear(to-br, blue.500, blue.700)">
      <Container maxW="xl">
        <VStack spacing={8} textAlign="center">
          <HStack>
            <Icon as={Sparkles} color="yellow.300" boxSize={6} />
            <Heading as="h2" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color="white">
              Join 101 Founding Beta Members
            </Heading>
          </HStack>

          <Box p={8} borderRadius="2xl" bg="white" w="100%" boxShadow="xl">
            <VStack spacing={4} align="start">
              {BETA_BENEFITS.map((benefit) => (
                <HStack key={benefit} gap={3}>
                  <Icon as={Check} boxSize={5} color="green.500" flexShrink={0} />
                  <Text color="gray.800" fontWeight="medium">
                    {benefit}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
