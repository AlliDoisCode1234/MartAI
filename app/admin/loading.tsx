/**
 * Admin Portal Loading State
 *
 * Component Hierarchy:
 * App -> Admin Layout -> Loading (this file)
 *
 * Route-level loading state for the Admin Portal.
 */

import { Box, Container, VStack, Skeleton, HStack } from '@chakra-ui/react';

export default function AdminLoading() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Skeleton height="36px" width="200px" borderRadius="md" />
          <Skeleton height="36px" width="120px" borderRadius="md" />
        </HStack>
        <Skeleton height="120px" borderRadius="xl" />
        <HStack spacing={4}>
          <Skeleton height="180px" flex={1} borderRadius="xl" />
          <Skeleton height="180px" flex={1} borderRadius="xl" />
          <Skeleton height="180px" flex={1} borderRadius="xl" />
        </HStack>
        <Skeleton height="300px" borderRadius="xl" />
      </VStack>
    </Container>
  );
}
