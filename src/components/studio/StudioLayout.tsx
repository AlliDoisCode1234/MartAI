'use client';

/**
 * StudioLayout
 *
 * Component Hierarchy:
 * App → StudioLayout
 *
 * Layout wrapper for Content Studio pages with sidebar navigation.
 */

import { Box, Flex } from '@chakra-ui/react';
import { StudioSidebar } from './StudioSidebar';

interface Props {
  children: React.ReactNode;
}

export function StudioLayout({ children }: Props) {
  return (
    <Flex minH="100vh" bg="#0D0D0D">
      <StudioSidebar />
      <Box flex={1} bg="linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 100%)" p={8} overflowY="auto">
        {children}
      </Box>
    </Flex>
  );
}
