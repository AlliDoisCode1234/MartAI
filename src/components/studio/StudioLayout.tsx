'use client';

/**
 * StudioLayout
 *
 * Component Hierarchy:
 * App → StudioLayout
 *   ├── AuthProvider (guards auth)
 *   ├── ProjectProvider (guards project selection)
 *   ├── StudioSidebar
 *   ├── AppBreadcrumb (navigation)
 *   └── Main Content
 *
 * Layout wrapper for Content Studio pages with sidebar navigation.
 * Handles authentication and project selection at the layout level.
 */

import { Box, Flex, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { StudioSidebar } from './StudioSidebar';
import { AuthProvider } from '@/src/providers/AuthProvider';
import { ProjectProvider } from '@/src/providers/ProjectProvider';
import { STUDIO_LAYOUT, STUDIO_COLORS } from '@/lib/constants/studioTokens';

interface Props {
  children: React.ReactNode;
}

export function StudioLayout({ children }: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <AuthProvider allowOnboarding={false} loadingMessage="Loading Content Studio...">
      <ProjectProvider requiredForRender>
        <Flex h="100vh" bg={STUDIO_COLORS.pageBg} position="relative" overflow="hidden">
          <StudioSidebar collapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
          <Box
            flex={1}
            h="100vh"
            p={STUDIO_LAYOUT.contentPadding}
            overflowY="auto"
            overflowX="hidden"
            position="relative"
            zIndex={1}
          >
            <VStack align="stretch" spacing={4}>
              {children}
            </VStack>
          </Box>
        </Flex>
      </ProjectProvider>
    </AuthProvider>
  );
}
