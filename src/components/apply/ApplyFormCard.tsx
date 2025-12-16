'use client';

/**
 * ApplyFormCard Component
 *
 * Component Hierarchy:
 * App → Apply → ApplyFormCard (this file)
 *
 * White card wrapper for apply forms.
 */

import { Box, type BoxProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type Props = BoxProps & {
  children: ReactNode;
};

export function ApplyFormCard({ children, ...props }: Props) {
  return (
    <Box bg="white" p={8} borderRadius="lg" shadow="md" {...props}>
      {children}
    </Box>
  );
}
