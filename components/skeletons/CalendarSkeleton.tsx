'use client';

/**
 * CalendarSkeleton Component
 *
 * Loading skeleton for calendar views.
 */

import { Box, Grid, GridItem, Skeleton, VStack, HStack } from '@chakra-ui/react';

export function CalendarSkeleton() {
  return (
    <VStack align="stretch" spacing={4}>
      {/* Header skeleton */}
      <HStack justify="space-between">
        <Skeleton height="40px" width="40px" borderRadius="md" />
        <Skeleton height="24px" width="150px" />
        <Skeleton height="40px" width="40px" borderRadius="md" />
      </HStack>

      {/* Day headers */}
      <Grid templateColumns="repeat(7, 1fr)" gap={1}>
        {Array.from({ length: 7 }).map((_, i) => (
          <GridItem key={i}>
            <Skeleton height="20px" />
          </GridItem>
        ))}
      </Grid>

      {/* Calendar grid */}
      <Grid templateColumns="repeat(7, 1fr)" gap={1}>
        {Array.from({ length: 35 }).map((_, i) => (
          <GridItem key={i} minH="100px">
            <Skeleton height="100%" borderRadius="md" />
          </GridItem>
        ))}
      </Grid>
    </VStack>
  );
}
