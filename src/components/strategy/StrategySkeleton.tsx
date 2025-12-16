'use client';

/**
 * StrategySkeleton Component
 *
 * Component Hierarchy:
 * App → Strategy → StrategySkeleton (this file)
 *
 * Loading skeleton for strategy page (replaces spinner).
 */

import {
  Container,
  VStack,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Box,
  HStack,
} from '@chakra-ui/react';

export function StrategySkeleton() {
  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, sm: 6, md: 8 }}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between">
            <VStack align="start" spacing={2}>
              <Skeleton height="40px" width="200px" />
              <Skeleton height="20px" width="300px" />
            </VStack>
            <Skeleton height="40px" width="150px" borderRadius="full" />
          </HStack>

          {/* Stepper */}
          <Skeleton height="60px" width="100%" borderRadius="lg" />

          {/* Next Step Card */}
          <Skeleton height="120px" width="100%" borderRadius="xl" />

          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height="80px" borderRadius="xl" />
            ))}
          </SimpleGrid>

          {/* Insights Grid */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <Skeleton height="200px" borderRadius="lg" />
            <Skeleton height="200px" borderRadius="lg" />
          </SimpleGrid>

          {/* Plan Summary */}
          <Skeleton height="150px" borderRadius="lg" />

          {/* Clusters Grid */}
          <Skeleton height="30px" width="250px" />
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} height="120px" borderRadius="lg" />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
