'use client';

/**
 * FeaturesSection
 *
 * Component Hierarchy:
 * App → LandingPage → FeaturesSection
 *
 * How Phoo Gets You More Customers - outcome-focused features.
 */

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  HStack,
  Icon,
  VStack,
  Image,
} from '@chakra-ui/react';
import { Search, Zap, Bot, Users, Check } from 'lucide-react';

const FEATURES = [
  {
    icon: Search,
    title: 'Found on Google AND AI search',
    description: 'Optimized for traditional search and the new era of AI-powered answers.',
  },
  {
    icon: Zap,
    title: 'Content created automatically',
    description: 'AI writes, optimizes, and publishes — you approve.',
  },
  {
    icon: Users,
    title: 'Designed to convert',
    description: 'Content engineered for leads, not vanity traffic.',
  },
  {
    icon: Bot,
    title: 'No agency needed',
    description: 'The system agencies use — at 1/5 the cost.',
  },
];

export function FeaturesSection() {
  return (
    <Box as="section" py={16} bgGradient="linear(to-br, brand.orange, orange.600)">
      <Container maxW="4xl">
        <VStack spacing={8}>
          {/* Headline */}
          <Heading
            as="h2"
            fontSize={{ base: '3xl', md: '4xl' }}
            fontWeight="bold"
            color="white"
            textAlign="center"
          >
            Your Lead Generation System
          </Heading>

          {/* Illustration */}
          <Image
            src="/images/features-illustration.png"
            alt="AI-powered content automation"
            maxW="320px"
            mx="auto"
            borderRadius="xl"
          />

          {/* Feature grid */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
            {FEATURES.map((feature) => (
              <HStack
                key={feature.title}
                p={5}
                borderRadius="xl"
                bg="white"
                align="flex-start"
                gap={4}
              >
                <Icon as={feature.icon} boxSize={6} color="brand.orange" flexShrink={0} mt={1} />
                <Box>
                  <Text fontWeight="bold" color="gray.800">
                    {feature.title}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {feature.description}
                  </Text>
                </Box>
              </HStack>
            ))}
          </SimpleGrid>

          {/* Tagline */}
          <Box p={4} borderRadius="xl" bg="white" boxShadow="lg">
            <HStack>
              <Icon as={Check} color="green.500" />
              <Text fontWeight="medium" color="gray.800">
                The $2,500/mo agency alternative — that works 24/7
              </Text>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
