/**
 * Onboarding Loading State
 *
 * Component Hierarchy:
 * App -> Onboarding Layout -> Loading (this file)
 *
 * Route-level loading state for the onboarding flow.
 * Shows a centered spinner with branded messaging.
 */

import { Container, VStack, Spinner, Text } from '@chakra-ui/react';

export default function OnboardingLoading() {
  return (
    <Container maxW="container.sm" h="80vh" display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={4} role="status" aria-live="polite">
        <Spinner
          size="xl"
          thickness="4px"
          speed="0.8s"
          color="orange.400"
          emptyColor="gray.100"
          aria-label="Loading your setup"
        />
        <Text color="gray.500" fontSize="sm">
          Loading your setup...
        </Text>
      </VStack>
    </Container>
  );
}
