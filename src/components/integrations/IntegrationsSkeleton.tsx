'use client';

/**
 * IntegrationsSkeleton Component
 *
 * Component Hierarchy:
 * App → Integrations → IntegrationsSkeleton (this file)
 *
 * Loading skeleton for integrations page.
 */

import { Container, VStack, Grid, GridItem, Skeleton } from '@chakra-ui/react';

export function IntegrationsSkeleton() {
  return (
    <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, sm: 6, md: 8, lg: 12 }}>
      <VStack spacing={8} align="stretch">
        <Skeleton height="40px" width="250px" />
        <Skeleton height="20px" width="400px" />
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
          {[1, 2, 3, 4, 5].map((i) => (
            <GridItem key={i}>
              <Skeleton height="180px" borderRadius="lg" />
            </GridItem>
          ))}
        </Grid>
        <Skeleton height="120px" borderRadius="md" />
      </VStack>
    </Container>
  );
}
