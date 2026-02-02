'use client';

/**
 * FeaturesSection
 *
 * Component Hierarchy:
 * App → LandingPage → FeaturesSection
 *
 * What Phoo Does section for landing page.
 * Uses Chakra UI for styling (project standard).
 */

import { Box, Container, Heading, Text, SimpleGrid, HStack, Icon, VStack } from '@chakra-ui/react';
import { Target, Zap, TrendingUp, Users, LucideIcon } from 'lucide-react';

const FEATURES: Array<{ icon: LucideIcon; color: string; title: string; description: string }> = [
  {
    icon: Target,
    color: 'brand.orange',
    title: 'Analyzes your website and competitors',
    description: 'Understand where you stand and where opportunity lives.',
  },
  {
    icon: Zap,
    color: 'brand.red',
    title: 'Builds a clear SEO content plan',
    description: 'A roadmap tailored to your business, not generic advice.',
  },
  {
    icon: TrendingUp,
    color: 'blue.400',
    title: 'Creates and improves content over time',
    description: 'AI-powered content that gets better, not stale.',
  },
  {
    icon: Users,
    color: 'green.400',
    title: 'Turns visits into real leads',
    description: 'Traffic that matters, not just vanity metrics.',
  },
];

export function FeaturesSection() {
  return (
    <Box as="section" py={20} borderTop="1px solid" borderColor="gray.200" bg="white">
      <Container maxW="4xl">
        <VStack textAlign="center" mb={12}>
          <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="bold" color="white">
            What Phoo Does
          </Heading>
          <Text fontSize="xl" color="gray.400">
            Phoo is your automated SEO growth system.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {FEATURES.map((feature) => (
            <Box
              key={feature.title}
              p={6}
              borderRadius="xl"
              bg="whiteAlpha.50"
              border="1px solid"
              borderColor="whiteAlpha.100"
              display="flex"
              alignItems="flex-start"
              gap={4}
            >
              <Icon as={feature.icon} boxSize={6} color={feature.color} flexShrink={0} mt={1} />
              <Box>
                <Heading as="h3" fontSize="lg" fontWeight="semibold" mb={2} color="white">
                  {feature.title}
                </Heading>
                <Text color="gray.400">{feature.description}</Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>

        <Text textAlign="center" fontSize="lg" color="gray.400" mt={10}>
          All without you needing to become a marketing expert.
        </Text>
      </Container>
    </Box>
  );
}
