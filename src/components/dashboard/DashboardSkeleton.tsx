'use client';

/**
 * DashboardSkeleton Component
 *
 * Component Hierarchy:
 * App → Dashboard → DashboardSkeleton (this file)
 *
 * Loading skeleton for dashboard (replaces spinner).
 */

import { Container, VStack, Grid, SimpleGrid, Skeleton, HStack, Box } from '@chakra-ui/react';

export function DashboardSkeleton() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Hero Skeleton */}
        <Skeleton height="120px" borderRadius="2xl" />

        {/* Integration Banner Skeleton */}
        <Skeleton height="60px" borderRadius="lg" />

        {/* MartAI Rating + Stats Grid */}
        <Grid templateColumns={{ base: '1fr', lg: '300px 1fr' }} gap={6}>
          <Skeleton height="200px" borderRadius="xl" />
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height="100px" borderRadius="xl" />
            ))}
          </SimpleGrid>
        </Grid>

        {/* Charts Grid */}
        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
          <Skeleton height="320px" borderRadius="xl" />
          <Skeleton height="320px" borderRadius="xl" />
        </Grid>

        {/* Top Keywords Table */}
        <Skeleton height="350px" borderRadius="xl" />

        {/* Insights Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height="200px" borderRadius="lg" />
          ))}
        </SimpleGrid>

        {/* Intelligence Card */}
        <Skeleton height="250px" borderRadius="xl" />
      </VStack>
    </Container>
  );
}
