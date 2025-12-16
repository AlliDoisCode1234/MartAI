'use client';

/**
 * CompetitorsSkeleton Component
 *
 * Component Hierarchy:
 * App → Competitors → CompetitorsSkeleton (this file)
 *
 * Loading skeleton for competitors page.
 */

import { Container, VStack, Skeleton, SimpleGrid, Box } from '@chakra-ui/react';

export function CompetitorsSkeleton() {
  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container
        maxW="container.xl"
        py={{ base: 8, md: 12 }}
        px={{ base: 4, sm: 6, md: 8, lg: 12 }}
      >
        <VStack spacing={8} align="stretch">
          <VStack align="start" spacing={2}>
            <Skeleton height="40px" width="350px" />
            <Skeleton height="20px" width="300px" />
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height="100px" borderRadius="xl" />
            ))}
          </SimpleGrid>
          <Skeleton height="400px" borderRadius="xl" />
        </VStack>
      </Container>
    </Box>
  );
}
