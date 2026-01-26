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
import { StudioSidebar } from './StudioSidebar';
import { AuthProvider } from '@/src/providers/AuthProvider';
import { ProjectProvider } from '@/src/providers/ProjectProvider';
import { AppBreadcrumb } from '@/src/components/Navigation/AppBreadcrumb';

interface Props {
  children: React.ReactNode;
}

export function StudioLayout({ children }: Props) {
  return (
    <AuthProvider darkMode allowOnboarding={false} loadingMessage="Loading Content Studio...">
      <ProjectProvider darkMode requiredForRender>
        <Flex minH="100vh" bg="#0D0D0D">
          <StudioSidebar />
          <Box
            flex={1}
            bg="linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 100%)"
            p={8}
            overflowY="auto"
          >
            <VStack align="stretch" spacing={4}>
              {/* Breadcrumb with dark mode styling */}
              <Box
                sx={{
                  '& nav': { color: 'gray.400' },
                  '& a': { color: 'gray.400', _hover: { color: 'orange.400' } },
                  '& span[aria-current]': { color: 'gray.200' },
                }}
              >
                <AppBreadcrumb />
              </Box>
              {children}
            </VStack>
          </Box>
        </Flex>
      </ProjectProvider>
    </AuthProvider>
  );
}
