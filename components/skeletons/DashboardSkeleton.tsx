'use client';

/**
 * DashboardSkeleton Component
 *
 * Component Hierarchy:
 * App → Dashboard/Home → DashboardSkeleton (this file)
 *
 * Dashboard-specific loading state with stat cards and content areas.
 */

import { Box, VStack, HStack, Skeleton, Grid, GridItem } from '@chakra-ui/react';

type Props = {
  statCount?: number;
  showMainContent?: boolean;
};

export function DashboardSkeleton({ statCount = 4, showMainContent = true }: Props) {
  return (
    <VStack spacing={6} align="stretch" w="full">
      {/* Stats Row */}
      <Grid templateColumns={{ base: '1fr', md: `repeat(${Math.min(statCount, 4)}, 1fr)` }} gap={4}>
        {Array.from({ length: statCount }).map((_, i) => (
          <GridItem key={i}>
            <Box bg="white" p={6} borderRadius="xl" shadow="sm">
              <VStack align="start" spacing={3}>
                <Skeleton height="16px" width="80px" borderRadius="md" />
                <Skeleton height="36px" width="120px" borderRadius="md" />
                <Skeleton height="12px" width="60px" borderRadius="sm" />
              </VStack>
            </Box>
          </GridItem>
        ))}
      </Grid>

      {/* Main Content Area */}
      {showMainContent && (
        <HStack spacing={6} align="start">
          <Box flex={2} bg="white" p={6} borderRadius="xl" shadow="sm">
            <VStack spacing={4} align="stretch">
              <Skeleton height="24px" width="200px" borderRadius="md" />
              <Skeleton height="300px" width="100%" borderRadius="lg" />
            </VStack>
          </Box>
          <Box flex={1} bg="white" p={6} borderRadius="xl" shadow="sm">
            <VStack spacing={4} align="stretch">
              <Skeleton height="24px" width="150px" borderRadius="md" />
              <VStack spacing={3}>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} height="48px" width="100%" borderRadius="md" />
                ))}
              </VStack>
            </VStack>
          </Box>
        </HStack>
      )}
    </VStack>
  );
}
