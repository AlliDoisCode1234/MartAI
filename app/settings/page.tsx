'use client';

/**
 * Settings Page
 *
 * Component Hierarchy:
 * App → Settings (this file)
 * └── WordPressConnect
 */

import { Container, VStack, Heading, Text, Box, Divider, Badge } from '@chakra-ui/react';
import { WordPressConnect } from '@/src/components/settings/WordPressConnect';
import { useProject } from '@/lib/hooks';

export default function SettingsPage() {
  // Get user's active project using useProject hook
  const { project: activeProject, isLoading } = useProject(null, { autoSelect: true });

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container
        maxW="container.xl"
        py={{ base: 8, md: 12 }}
        px={{ base: 4, sm: 6, md: 8, lg: 12 }}
      >
        <VStack spacing={8} align="stretch">
          <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">
            Settings
          </Heading>

          {/* Integrations Section */}
          <Box bg="white" p={6} borderRadius="lg" shadow="md">
            <VStack align="stretch" spacing={4}>
              <Box>
                <Heading size="md" mb={1}>
                  Integrations
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  Connect your CMS platforms to publish content directly from MartAI
                </Text>
              </Box>

              <Divider />

              {activeProject ? (
                <WordPressConnect projectId={activeProject._id} />
              ) : (
                <Box p={4} bg="gray.50" borderRadius="md">
                  <Text color="gray.500">Create a project first to connect integrations</Text>
                </Box>
              )}

              {/* Future integrations placeholder */}
              <Box p={4} borderWidth="1px" borderRadius="lg" borderColor="gray.200" opacity={0.5}>
                <VStack align="start" spacing={1}>
                  <Badge colorScheme="gray">Coming Soon</Badge>
                  <Text fontWeight="medium">Shopify</Text>
                  <Text fontSize="sm" color="gray.500">
                    Publish blog posts to your Shopify store
                  </Text>
                </VStack>
              </Box>

              <Box p={4} borderWidth="1px" borderRadius="lg" borderColor="gray.200" opacity={0.5}>
                <VStack align="start" spacing={1}>
                  <Badge colorScheme="gray">Coming Soon</Badge>
                  <Text fontWeight="medium">Webflow</Text>
                  <Text fontSize="sm" color="gray.500">
                    Publish CMS items to Webflow
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </Box>

          {/* Account Section Placeholder */}
          <Box bg="white" p={6} borderRadius="lg" shadow="md">
            <VStack align="stretch" spacing={4}>
              <Box>
                <Heading size="md" mb={1}>
                  Account
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  Manage your account settings
                </Text>
              </Box>
              <Divider />
              <Text color="gray.500">Account settings coming soon...</Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
