'use client';

/**
 * ApplyHeader Component
 *
 * Component Hierarchy:
 * App → Apply → ApplyHeader (this file)
 *
 * Page header for apply flow.
 */

import { Box, Heading, Text } from '@chakra-ui/react';

type Props = {
  title: string;
  subtitle: string;
};

export function ApplyHeader({ title, subtitle }: Props) {
  return (
    <Box>
      <Heading size="xl" color="gray.800">
        {title}
      </Heading>
      <Text color="gray.600" mt={2}>
        {subtitle}
      </Text>
    </Box>
  );
}
