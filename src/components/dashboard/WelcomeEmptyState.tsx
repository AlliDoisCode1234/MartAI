'use client';

/**
 * WelcomeEmptyState Component
 *
 * Component Hierarchy:
 * App → Dashboard → WelcomeEmptyState (this file)
 *
 * Shown when user has no projects.
 */

import { Container, VStack, Heading, Text, Button, useColorModeValue } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';

export function WelcomeEmptyState() {
  const router = useRouter();
  const heroGradient = useColorModeValue(
    'linear(to-r, brand.orange, brand.red)',
    'linear(to-r, brand.orange, brand.red)'
  );

  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={8} textAlign="center">
        <Heading size="2xl" bgGradient={heroGradient} bgClip="text">
          Welcome to MartAI
        </Heading>
        <Text fontSize="xl" color="gray.500" maxW="lg">
          Automate your SEO strategy with AI-powered insights. Create your first project to get
          started.
        </Text>
        <Button
          size="lg"
          variant="solid"
          colorScheme="brand"
          rightIcon={<ArrowForwardIcon />}
          onClick={() => router.push('/onboarding')}
        >
          Create Your First Project
        </Button>
      </VStack>
    </Container>
  );
}
