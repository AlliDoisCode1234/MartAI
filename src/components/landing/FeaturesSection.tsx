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
import { Target, Zap, TrendingUp, Users, LucideIcon, Search } from 'lucide-react';

const FEATURES: Array<{
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  title: string;
  description: string;
}> = [
  {
    icon: Search,
    color: 'brand.orange',
    bgColor: 'orange.50',
    borderColor: 'orange.200',
    title: 'Finds keywords your customers search',
    description: 'Not just vanity terms — real, revenue-driving keywords.',
  },
  {
    icon: Zap,
    color: 'brand.red',
    bgColor: 'red.50',
    borderColor: 'red.200',
    title: 'Builds a clear SEO content plan',
    description: 'A roadmap tailored to your business, not generic advice.',
  },
  {
    icon: TrendingUp,
    color: 'blue.500',
    bgColor: 'blue.50',
    borderColor: 'blue.200',
    title: 'Creates and improves content over time',
    description: 'AI-powered content that gets better, not stale.',
  },
  {
    icon: Users,
    color: 'green.500',
    bgColor: 'green.50',
    borderColor: 'green.200',
    title: 'Turns visits into real leads',
    description: 'Traffic that matters, not just vanity metrics.',
  },
];

export function FeaturesSection() {
  return (
    <Box as="section" py={16} bg="gray.900">
      <Container maxW="4xl">
        <VStack textAlign="center" mb={12}>
          <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="bold" color="white">
            What Phoo Does
          </Heading>
          <Text fontSize="xl" color="gray.300">
            Phoo is your automated SEO growth system.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {FEATURES.map((feature) => (
            <Box
              key={feature.title}
              p={6}
              borderRadius="xl"
              bg={feature.bgColor}
              border="1px solid"
              borderColor={feature.borderColor}
              display="flex"
              alignItems="flex-start"
              gap={4}
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
              transition="all 0.2s"
            >
              <Icon as={feature.icon} boxSize={6} color={feature.color} flexShrink={0} mt={1} />
              <Box>
                <Heading as="h3" fontSize="lg" fontWeight="semibold" mb={2} color="gray.800">
                  {feature.title}
                </Heading>
                <Text color="gray.600">{feature.description}</Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>

        <Text textAlign="center" fontSize="lg" color="gray.600" mt={10}>
          All without you needing to become a marketing expert.
        </Text>
      </Container>
    </Box>
  );
}
