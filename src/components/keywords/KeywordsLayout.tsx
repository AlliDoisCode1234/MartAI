'use client';

/**
 * KeywordsLayout
 *
 * Component Hierarchy:
 * App -> KeywordsLayout
 *   |-> AuthProvider (guards auth)
 *   |-> ProjectProvider (guards project selection)
 *   |-> Tab Navigation (All Keywords | Clusters | Import | Settings)
 *   |-> Main Content (children)
 *
 * Layout wrapper for Keywords pages with tab navigation.
 * "All Keywords" and "Clusters" use client-side display:none toggle.
 * "Import" and "Settings" remain route-based.
 */

import { Box, Container, HStack, Heading, Button, Tab, TabList, Tabs } from '@chakra-ui/react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider } from '@/src/providers/AuthProvider';
import { ProjectProvider } from '@/src/providers/ProjectProvider';
import { FiPlus, FiKey, FiLayers } from 'react-icons/fi';
import { Icon } from '@chakra-ui/react';

interface Props {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const TAB_KEYS = ['library', 'clusters', 'import', 'settings'] as const;
const TAB_LABELS = ['All Keywords', 'Clusters', 'Import', 'Settings'];

export function KeywordsLayout({ children, activeTab = 'library', onTabChange }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  // Determine active tab index
  const getTabIndex = () => {
    return TAB_KEYS.indexOf(activeTab as (typeof TAB_KEYS)[number]);
  };

  const handleTabChange = (index: number) => {
    const key = TAB_KEYS[index];
    if (onTabChange) onTabChange(key);
  };

  return (
    <AuthProvider darkMode allowOnboarding={false} loadingMessage="Loading Keywords...">
      <ProjectProvider darkMode requiredForRender>
        <Box minH="100vh" bg="#110d1b">
          {/* Header */}
          <Box
            bg="linear-gradient(180deg, #1a1230 0%, #110d1b 100%)"
            borderBottom="1px solid rgba(255, 255, 255, 0.08)"
            py={6}
            px={8}
          >
            <Container maxW="container.xl">
              <HStack justify="space-between">
                <HStack spacing={3}>
                  <Icon as={FiKey} boxSize={6} color="#FF9D00" />
                  <Heading size="lg" color="white">
                    Keywords Library
                  </Heading>
                </HStack>
                <Button
                  leftIcon={activeTab === 'clusters' ? <FiLayers /> : <FiPlus />}
                  bg="#FF9D00"
                  color="black"
                  _hover={{ bg: '#E68A00' }}
                  size="md"
                  onClick={() => {
                    if (activeTab === 'clusters') {
                      // TODO: Open cluster creation modal
                    } else {
                      router.push('/keywords/import');
                    }
                  }}
                >
                  {activeTab === 'clusters' ? 'Add New Cluster' : 'Add Keywords'}
                </Button>
              </HStack>

              {/* Tab Navigation */}
              <Tabs index={getTabIndex()} onChange={handleTabChange} mt={6} variant="unstyled">
                <TabList gap={2}>
                  {TAB_LABELS.map((label) => (
                    <Tab
                      key={label}
                      color="gray.500"
                      fontWeight="medium"
                      px={4}
                      py={2}
                      borderRadius="8px"
                      _selected={{
                        color: 'white',
                        bg: 'rgba(255, 157, 0, 0.15)',
                        borderBottom: '2px solid #FF9D00',
                      }}
                      _hover={{
                        color: 'white',
                        bg: 'rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      {label}
                    </Tab>
                  ))}
                </TabList>
              </Tabs>
            </Container>
          </Box>

          {/* Main Content */}
          <Box py={8} px={8}>
            <Container maxW="container.xl">{children}</Container>
          </Box>
        </Box>
      </ProjectProvider>
    </AuthProvider>
  );
}
