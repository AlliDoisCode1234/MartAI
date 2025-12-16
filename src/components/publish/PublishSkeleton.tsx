'use client';

/**
 * PublishSkeleton Component
 *
 * Component Hierarchy:
 * App → Publish → PublishSkeleton (this file)
 *
 * Loading skeleton for publish page.
 */

import { Container, VStack, Skeleton, HStack, Box } from '@chakra-ui/react';

export function PublishSkeleton() {
  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light" py={8}>
      <Container maxW="7xl">
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between">
            <VStack align="start" spacing={2}>
              <Skeleton height="40px" width="300px" />
              <Skeleton height="20px" width="250px" />
            </VStack>
            <HStack>
              <Skeleton height="40px" width="140px" />
              <Skeleton height="40px" width="120px" />
            </HStack>
          </HStack>
          <Skeleton height="300px" borderRadius="lg" />
        </VStack>
      </Container>
    </Box>
  );
}
