'use client';

/**
 * ContentSkeleton Component
 *
 * Component Hierarchy:
 * App → Content → ContentSkeleton (this file)
 *
 * Loading skeleton for content page.
 */

import { Container, VStack, Grid, Skeleton, HStack, Box } from '@chakra-ui/react';

export function ContentSkeleton() {
  return (
    <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, sm: 6, md: 8, lg: 12 }}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <VStack align="start" spacing={2}>
            <Skeleton height="40px" width="250px" />
            <Skeleton height="20px" width="350px" />
          </VStack>
          <HStack>
            <Skeleton height="32px" width="100px" />
            <Skeleton height="32px" width="100px" />
            <Skeleton height="32px" width="80px" />
          </HStack>
        </HStack>
        <Skeleton height="60px" borderRadius="md" />
        <Skeleton height="40px" width="200px" />
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
          <VStack spacing={6}>
            <Skeleton height="150px" borderRadius="lg" />
            <Skeleton height="180px" borderRadius="lg" />
            <Skeleton height="200px" borderRadius="lg" />
          </VStack>
          <VStack spacing={6}>
            <Skeleton height="180px" borderRadius="lg" />
            <Skeleton height="150px" borderRadius="lg" />
            <Skeleton height="120px" borderRadius="lg" />
          </VStack>
        </Grid>
      </VStack>
    </Container>
  );
}
