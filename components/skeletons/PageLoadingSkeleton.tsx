'use client';

/**
 * PageLoadingSkeleton Component
 *
 * Component Hierarchy:
 * App → Any Page → PageLoadingSkeleton (this file)
 *
 * Full page loading state skeleton for initial page loads.
 */

import { Box, Container, VStack, Skeleton, HStack, SkeletonCircle } from '@chakra-ui/react';

type Props = {
  showHeader?: boolean;
  showSidebar?: boolean;
};

export function PageLoadingSkeleton({ showHeader = true, showSidebar = false }: Props) {
  return (
    <Box minH="100vh" bg="brand.light">
      {showHeader && (
        <Box bg="white" borderBottomWidth="1px" borderColor="gray.200" py={4} px={8}>
          <HStack justify="space-between">
            <Skeleton height="32px" width="120px" borderRadius="md" />
            <HStack spacing={4}>
              <Skeleton height="40px" width="100px" borderRadius="md" />
              <SkeletonCircle size="40px" />
            </HStack>
          </HStack>
        </Box>
      )}
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Skeleton height="48px" width="300px" borderRadius="lg" />
          <Skeleton height="20px" width="200px" borderRadius="md" />
          <VStack spacing={4} pt={4}>
            <Skeleton height="200px" width="100%" borderRadius="xl" />
            <HStack spacing={4} w="full">
              <Skeleton height="150px" flex={1} borderRadius="xl" />
              <Skeleton height="150px" flex={1} borderRadius="xl" />
              <Skeleton height="150px" flex={1} borderRadius="xl" />
            </HStack>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
