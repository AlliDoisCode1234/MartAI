'use client';

/**
 * CardSkeleton Component
 *
 * Component Hierarchy:
 * App → Any Page → CardSkeleton (this file)
 *
 * Matches dimensions of Card component for seamless loading.
 */

import { Card, CardBody, CardHeader, Skeleton, SkeletonText, VStack } from '@chakra-ui/react';

type Props = {
  hasHeader?: boolean;
  headerHeight?: string;
  bodyHeight?: string;
  lines?: number;
};

export function CardSkeleton({
  hasHeader = true,
  headerHeight = '24px',
  bodyHeight = '80px',
  lines = 3,
}: Props) {
  return (
    <Card>
      {hasHeader && (
        <CardHeader pb={0}>
          <Skeleton height={headerHeight} width="40%" />
        </CardHeader>
      )}
      <CardBody>
        <VStack spacing={3} align="stretch">
          <SkeletonText
            noOfLines={lines}
            spacing={3}
            skeletonHeight={bodyHeight === '80px' ? '16px' : bodyHeight}
          />
        </VStack>
      </CardBody>
    </Card>
  );
}
