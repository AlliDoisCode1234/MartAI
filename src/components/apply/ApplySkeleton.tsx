'use client';

/**
 * ApplySkeleton Component
 *
 * Component Hierarchy:
 * App → Apply → ApplySkeleton (this file)
 *
 * Loading skeleton for apply pages.
 */

import { Flex, Text } from '@chakra-ui/react';

type Props = {
  message?: string;
};

export function ApplySkeleton({ message = 'Preparing your application...' }: Props) {
  return (
    <Flex minH="80vh" align="center" justify="center">
      <Text color="gray.500">{message}</Text>
    </Flex>
  );
}
