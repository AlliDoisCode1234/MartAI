'use client';

/**
 * ProjectProvider
 *
 * Provides project context to child components.
 * Handles project loading, auto-selection, and empty state.
 *
 * Usage:
 * ```tsx
 * import { ProjectProvider, useProjectContext } from '@/src/providers/ProjectProvider';
 *
 * // In layout:
 * <ProjectProvider requiredForRender={true}>
 *   {children}
 * </ProjectProvider>
 *
 * // In child component:
 * const { projectId, project, isLoading } = useProjectContext();
 * ```
 */

import { createContext, useContext, type FC, type ReactNode } from 'react';
import { Box, VStack, Spinner, Text, Button, Icon, Heading, Container } from '@chakra-ui/react';
import { useProject } from '@/lib/hooks';
import { FiFolder } from 'react-icons/fi';
import Link from 'next/link';
import type { Id } from '@/convex/_generated/dataModel';

type ProjectContextValue = {
  projectId: Id<'projects'> | null;
  project: ReturnType<typeof useProject>['project'];
  isLoading: boolean;
};

const ProjectContext = createContext<ProjectContextValue | null>(null);

type Props = {
  children: ReactNode;
  /** If true, shows empty state when no project exists. Default: true */
  requiredForRender?: boolean;
  /** Use dark theme. Default: false */
  darkMode?: boolean;
  /** Auto-select first project if none selected. Default: true */
  autoSelect?: boolean;
};

export const ProjectProvider: FC<Props> = ({
  children,
  requiredForRender = true,
  darkMode = false,
  autoSelect = true,
}) => {
  const { projectId, project, isLoading } = useProject(null, { autoSelect });

  const contextValue: ProjectContextValue = {
    projectId: projectId as Id<'projects'> | null,
    project,
    isLoading,
  };

  // Loading state
  if (isLoading) {
    return (
      <ProjectContext.Provider value={contextValue}>
        <Box
          minH="calc(100vh - 64px)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg={darkMode ? 'transparent' : 'brand.light'}
        >
          <VStack spacing={4}>
            <Spinner
              size="xl"
              color={darkMode ? 'orange.400' : 'brand.orange'}
              thickness="4px"
              speed="0.8s"
            />
            <Text color={darkMode ? 'gray.400' : 'gray.600'}>Loading project...</Text>
          </VStack>
        </Box>
      </ProjectContext.Provider>
    );
  }

  // No project - show empty state
  if (requiredForRender && !projectId) {
    return (
      <ProjectContext.Provider value={contextValue}>
        <Box
          minH="calc(100vh - 64px)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg={darkMode ? 'transparent' : 'brand.light'}
        >
          <Container maxW="container.sm">
            <VStack
              spacing={6}
              p={8}
              bg={darkMode ? 'rgba(30, 30, 30, 0.6)' : 'white'}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={darkMode ? 'rgba(255, 255, 255, 0.1)' : 'gray.200'}
              textAlign="center"
            >
              <Icon as={FiFolder} boxSize={12} color={darkMode ? 'gray.500' : 'gray.400'} />
              <Heading size="md" color={darkMode ? 'white' : 'gray.800'}>
                No Project Selected
              </Heading>
              <Text color={darkMode ? 'gray.400' : 'gray.600'}>
                Create or select a project to get started.
              </Text>
              <Link href="/onboarding">
                <Button
                  bg="linear-gradient(135deg, #FF9D00 0%, #FF6B00 100%)"
                  color="white"
                  _hover={{ opacity: 0.9 }}
                >
                  Create Project
                </Button>
              </Link>
            </VStack>
          </Container>
        </Box>
      </ProjectContext.Provider>
    );
  }

  // Has project - render children
  return <ProjectContext.Provider value={contextValue}>{children}</ProjectContext.Provider>;
};

export function useProjectContext(): ProjectContextValue {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
}
