'use client';

/**
 * KeywordsLayout
 *
 * Component Hierarchy:
 * App → KeywordsLayout
 *   ├→ AuthProvider (guards auth)
 *   ├→ ProjectProvider (guards project selection)
 *   ├→ Tab Navigation (All Keywords | Import | Settings)
 *   └→ Main Content (children)
 *
 * Layout wrapper for Keywords pages with tab navigation.
 * Different from Content Studio which uses sidebar navigation.
 */

import { Box, Container, HStack, Heading, Button, Tab, TabList, Tabs } from '@chakra-ui/react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider } from '@/src/providers/AuthProvider';
import { ProjectProvider } from '@/src/providers/ProjectProvider';
import { FiPlus, FiKey } from 'react-icons/fi';
import { Icon } from '@chakra-ui/react';

interface Props {
  children: React.ReactNode;
}

const TABS = [
  { label: 'All Keywords', path: '/keywords' },
  { label: 'Import', path: '/keywords/import' },
  { label: 'Settings', path: '/keywords/settings' },
];

export function KeywordsLayout({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  // Determine active tab index
  const getTabIndex = () => {
    // Exact match for /keywords (not /keywords/something)
    if (pathname === '/keywords') return 0;
    // Match import and settings
    const tabIndex = TABS.findIndex((tab, i) => i > 0 && pathname.startsWith(tab.path));
    // If on a keyword detail page (/keywords/[id]), keep "All Keywords" active
    return tabIndex >= 0 ? tabIndex : 0;
  };

  const handleTabChange = (index: number) => {
    router.push(TABS[index].path);
  };

  return (
    <AuthProvider darkMode allowOnboarding={false} loadingMessage="Loading Keywords...">
      <ProjectProvider darkMode requiredForRender>
        <Box minH="100vh" bg="#0D0D0D">
          {/* Header */}
          <Box
            bg="linear-gradient(180deg, #1A1A1A 0%, #0D0D0D 100%)"
            borderBottom="1px solid rgba(255, 255, 255, 0.1)"
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
                  leftIcon={<FiPlus />}
                  bg="#FF9D00"
                  color="black"
                  _hover={{ bg: '#E68A00' }}
                  size="md"
                  onClick={() => router.push('/keywords/import')}
                >
                  Add Keywords
                </Button>
              </HStack>

              {/* Tab Navigation */}
              <Tabs index={getTabIndex()} onChange={handleTabChange} mt={6} variant="unstyled">
                <TabList gap={2}>
                  {TABS.map((tab, index) => (
                    <Tab
                      key={tab.path}
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
                      {tab.label}
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
