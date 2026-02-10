'use client';

/**
 * UrgencySection
 *
 * Component Hierarchy:
 * App → LandingPage → UrgencySection
 *
 * Creates urgency about AI search changes (Google AI Overviews).
 * Uses "healthy fear" messaging to motivate action.
 */

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Icon,
  HStack,
  List,
  ListItem,
} from '@chakra-ui/react';
import { AlertTriangle, X, Check } from 'lucide-react';

export function UrgencySection() {
  return (
    <Box as="section" py={16} borderTop="1px solid" borderColor="gray.200" bg="white">
      <Container maxW="4xl">
        <VStack spacing={12}>
          {/* Warning Header */}
          <VStack spacing={4} textAlign="center">
            <HStack
              px={4}
              py={2}
              borderRadius="full"
              bg="red.50"
              border="1px solid"
              borderColor="red.300"
            >
              <Icon as={AlertTriangle} boxSize={4} color="red.500" />
              <Text fontSize="sm" color="red.600" fontWeight="medium">
                Search is changing fast
              </Text>
            </HStack>
            <Heading
              as="h2"
              fontSize={{ base: '3xl', md: '4xl' }}
              fontWeight="bold"
              color="gray.800"
            >
              The Urgent Truth
            </Heading>
          </VStack>

          {/* What's Happening */}
          <VStack
            spacing={6}
            p={8}
            borderRadius="2xl"
            bg="red.50"
            border="1px solid"
            borderColor="red.300"
            maxW="3xl"
          >
            <Text fontSize="lg" color="gray.600" lineHeight="1.8">
              <Text as="span" fontWeight="bold" color="gray.800">
                Here&apos;s what&apos;s happening RIGHT NOW:
              </Text>
            </Text>

            <Text fontSize="lg" color="gray.600" lineHeight="1.8">
              Go to Google. Type any question. Before you even see search results, there&apos;s now
              a big box at the top called{' '}
              <Text as="span" fontWeight="bold" color="brand.orange">
                &quot;AI Overview.&quot;
              </Text>
            </Text>

            <Text fontSize="lg" color="gray.600" lineHeight="1.8">
              Google&apos;s AI reads websites and answers your question{' '}
              <Text as="span" fontWeight="bold" color="gray.800">
                before you click anything
              </Text>
              .
            </Text>

            <VStack align="start" spacing={3} w="100%">
              <Text fontSize="lg" color="gray.700">
                This means:
              </Text>
              <List spacing={2}>
                <ListItem display="flex" alignItems="center" gap={2}>
                  <Icon as={X} boxSize={4} color="red.500" />
                  <Text color="gray.700">Your optimized website? Users might never see it.</Text>
                </ListItem>
                <ListItem display="flex" alignItems="center" gap={2}>
                  <Icon as={X} boxSize={4} color="red.500" />
                  <Text color="gray.700">Your blog posts? AI summarizes them instead.</Text>
                </ListItem>
                <ListItem display="flex" alignItems="center" gap={2}>
                  <Icon as={X} boxSize={4} color="red.500" />
                  <Text color="gray.700">Your ad spend? AI answers appear ABOVE the ads.</Text>
                </ListItem>
              </List>
            </VStack>
          </VStack>

          {/* Old vs New */}
          <VStack spacing={6} w="100%" maxW="3xl">
            <Heading as="h3" fontSize="xl" color="gray.800" textAlign="center">
              The old playbook is dying
            </Heading>

            <HStack spacing={6} w="100%" flexWrap={{ base: 'wrap', md: 'nowrap' }}>
              {/* Old Way */}
              <VStack
                flex={1}
                p={6}
                borderRadius="xl"
                bg="red.50"
                border="1px solid"
                borderColor="red.300"
                opacity={0.9}
                minW={{ base: '100%', md: 'auto' }}
              >
                <Text fontWeight="bold" color="red.500" mb={2}>
                  Old SEO
                </Text>
                <Text color="gray.500" textDecoration="line-through">
                  Write blog post
                </Text>
                <Text color="gray.500" textDecoration="line-through">
                  Optimize for keywords
                </Text>
                <Text color="gray.500" textDecoration="line-through">
                  Wait for Google to rank you
                </Text>
                <Text color="gray.500" textDecoration="line-through">
                  Hope people click
                </Text>
              </VStack>

              {/* New Way */}
              <VStack
                flex={1}
                p={6}
                borderRadius="xl"
                bg="green.50"
                border="1px solid"
                borderColor="green.400"
                minW={{ base: '100%', md: 'auto' }}
              >
                <Text fontWeight="bold" color="green.600" mb={2}>
                  GEO + SEO
                </Text>
                <HStack>
                  <Icon as={Check} boxSize={4} color="green.500" />
                  <Text color="gray.700">AI cites your content</Text>
                </HStack>
                <HStack>
                  <Icon as={Check} boxSize={4} color="green.500" />
                  <Text color="gray.700">Google ranks you</Text>
                </HStack>
                <HStack>
                  <Icon as={Check} boxSize={4} color="green.500" />
                  <Text color="gray.700">Traffic from both</Text>
                </HStack>
                <HStack>
                  <Icon as={Check} boxSize={4} color="green.500" />
                  <Text color="gray.700">Future-proof</Text>
                </HStack>
              </VStack>
            </HStack>
          </VStack>

          {/* Final Warning */}
          <Box
            p={8}
            borderRadius="2xl"
            bg="orange.50"
            border="2px solid"
            borderColor="brand.orange"
            textAlign="center"
            maxW="3xl"
          >
            <Text fontSize="xl" color="gray.800" fontWeight="bold" lineHeight="1.6">
              The businesses that adapt now will dominate.
              <br />
              <Text as="span" color="gray.500">
                The ones that wait will wonder what happened.
              </Text>
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
