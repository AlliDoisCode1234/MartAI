'use client';

/**
 * UserHeaderSkeleton Component
 *
 * Component Hierarchy:
 * App → Admin → Users → [id] → UserHeaderSkeleton (this file)
 *
 * Matches dimensions of user header card for seamless loading.
 */

import { Card, CardBody, HStack, VStack, Skeleton, SkeletonCircle, Box } from '@chakra-ui/react';

type Props = {
  avatarSize?: string;
};

export function UserHeaderSkeleton({ avatarSize = '96px' }: Props) {
  return (
    <Card>
      <CardBody>
        <HStack spacing={6} align="start">
          <SkeletonCircle size={avatarSize} />
          <Box flex={1}>
            <HStack mb={2} gap={2}>
              <Skeleton height="32px" width="200px" />
              <Skeleton height="20px" width="60px" borderRadius="full" />
              <Skeleton height="20px" width="60px" borderRadius="full" />
            </HStack>
            <Skeleton height="20px" width="180px" mb={2} />
            <HStack spacing={4}>
              <Skeleton height="14px" width="120px" />
              <Skeleton height="14px" width="100px" />
            </HStack>
          </Box>
        </HStack>
      </CardBody>
    </Card>
  );
}
