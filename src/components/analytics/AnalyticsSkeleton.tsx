'use client';

/**
 * AnalyticsSkeleton Component
 *
 * Component Hierarchy:
 * App → Analytics → AnalyticsSkeleton (this file)
 *
 * Loading skeleton for analytics page.
 */

import { Container, VStack, Grid, Skeleton, HStack, Box } from '@chakra-ui/react';

export function AnalyticsSkeleton() {
  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light" py={8}>
      <Container maxW="7xl">
        <VStack spacing={6} align="stretch">
          <Skeleton height="120px" borderRadius="lg" />
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
            gap={6}
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height="180px" borderRadius="lg" />
            ))}
          </Grid>
          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
            <Skeleton height="400px" borderRadius="lg" />
            <Skeleton height="400px" borderRadius="lg" />
          </Grid>
          <Skeleton height="300px" borderRadius="lg" />
        </VStack>
      </Container>
    </Box>
  );
}
