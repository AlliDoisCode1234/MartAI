'use client';

/**
 * StatsSkeleton Component
 *
 * Component Hierarchy:
 * App → Any Page → StatsSkeleton (this file)
 *
 * Matches dimensions of stat cards for seamless loading.
 */

import { Card, CardBody, Skeleton, VStack, SimpleGrid } from '@chakra-ui/react';

type Props = {
  count?: number;
  columns?: { base: number; md: number };
};

export function StatsSkeleton({ count = 4, columns = { base: 2, md: 4 } }: Props) {
  return (
    <SimpleGrid columns={columns} gap={4}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardBody py={3}>
            <VStack spacing={2} align="start">
              <Skeleton height="12px" width="60%" />
              <Skeleton height="28px" width="40%" />
              <Skeleton height="12px" width="50%" />
            </VStack>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );
}
