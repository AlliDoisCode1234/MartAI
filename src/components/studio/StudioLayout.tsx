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

import { Box, Flex, VStack, IconButton, Icon, Tooltip } from '@chakra-ui/react';
import { useState } from 'react';
import Link from 'next/link';
import { FiMessageCircle } from 'react-icons/fi';
import { StudioSidebar } from './StudioSidebar';
import { AuthProvider } from '@/src/providers/AuthProvider';
import { ProjectProvider } from '@/src/providers/ProjectProvider';
import { AppBreadcrumb } from '@/src/components/Navigation/AppBreadcrumb';
import { STUDIO_COLORS, STUDIO_GRADIENTS, STUDIO_LAYOUT } from '@/lib/constants/studioTokens';

interface Props {
  children: React.ReactNode;
}

export function StudioLayout({ children }: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <AuthProvider darkMode allowOnboarding={false} loadingMessage="Loading Content Studio...">
      <ProjectProvider darkMode requiredForRender>
        <Flex
          h="100vh"
          bg="linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)"
          position="relative"
          overflow="hidden"
        >
          {/* Ambient Orbs */}
          <Box
            position="absolute"
            top="-20%"
            right="-10%"
            w="600px"
            h="600px"
            bg="radial-gradient(circle, rgba(249, 159, 42, 0.15) 0%, transparent 70%)"
            pointerEvents="none"
            display={{ base: 'none', md: 'block' }}
            zIndex={0}
          />
          <Box
            position="absolute"
            bottom="-20%"
            left="-10%"
            w="500px"
            h="500px"
            bg="radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)"
            pointerEvents="none"
            display={{ base: 'none', md: 'block' }}
            zIndex={0}
          />

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
