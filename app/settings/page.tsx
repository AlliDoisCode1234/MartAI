'use client';

/**
 * Settings Page with Tabs
 *
 * Component Hierarchy:
 * App → Settings (this file)
 * └── Tab: Account
 * └── Tab: Integrations
 * └── Tab: Team (links to /settings/team for full management)
 *
 * Research-backed design: Tabs for related but distinct sections
 * - Reduces scrolling cognitive load
 * - Chakra UI Tabs are accessible out-of-box
 */

import {
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Box,
  Divider,
  Badge,
  Spinner,
  Button,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { WordPressConnect } from '@/src/components/settings/WordPressConnect';
import { ChangePasswordForm } from '@/src/components/settings/ChangePasswordForm';
import { useProject } from '@/lib/hooks';
import { useMe } from '@/lib/useMe';
import Link from 'next/link';
import { FiUser, FiGrid, FiUsers, FiArrowRight, FiHelpCircle } from 'react-icons/fi';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BRAND } from '@/lib/constants/brand';

// Map tab names to indices
const TAB_MAP: Record<string, number> = {
  account: 0,
  integrations: 1,
  team: 2,
  support: 3,
};

const INDEX_TO_TAB = ['account', 'integrations', 'team', 'support'];

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get user's active project using useProject hook
  const { project: activeProject, isLoading } = useProject(null, { autoSelect: true });
  const { me, loading: meLoading } = useMe();

  // Check if user can manage team (Growth+ tiers)
  const canManageTeam =
    me?.subscriptionTier && ['growth', 'enterprise'].includes(me.subscriptionTier);

  // URL-synced tab state
  const tabParam = searchParams?.get('tab') || 'account';
  const initialIndex = TAB_MAP[tabParam] ?? 0;
  const [tabIndex, setTabIndex] = useState(initialIndex);

  // Sync URL when tab changes
  const handleTabChange = (index: number) => {
    setTabIndex(index);
    const tabName = INDEX_TO_TAB[index];
    router.replace(`/settings?tab=${tabName}`, { scroll: false });
  };

  // Sync tab with URL on param change
  useEffect(() => {
    const newIndex = TAB_MAP[tabParam] ?? 0;
    if (newIndex !== tabIndex) {
      setTabIndex(newIndex);
    }
  }, [tabParam]);

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container
        maxW="container.xl"
        py={{ base: 8, md: 12 }}
        px={{ base: 4, sm: 6, md: 8, lg: 12 }}
      >
        <VStack spacing={6} align="stretch">
          <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">
            Settings
          </Heading>

          <Box bg="white" borderRadius="xl" shadow="md" overflow="hidden">
            <Tabs
              index={tabIndex}
              onChange={handleTabChange}
              colorScheme="orange"
              variant="enclosed"
              isLazy
            >
              <TabList borderBottomWidth="1px" px={4}>
                <Tab py={4} fontWeight="medium">
                  <HStack spacing={2}>
                    <Icon as={FiUser} />
                    <Text>Account</Text>
                  </HStack>
                </Tab>
                <Tab py={4} fontWeight="medium">
                  <HStack spacing={2}>
                    <Icon as={FiGrid} />
                    <Text>Integrations</Text>
                  </HStack>
                </Tab>
                <Tab py={4} fontWeight="medium">
                  <HStack spacing={2}>
                    <Icon as={FiUsers} />
                    <Text>Team</Text>
                  </HStack>
                </Tab>
                <Tab py={4} fontWeight="medium">
                  <HStack spacing={2}>
                    <Icon as={FiHelpCircle} />
                    <Text>Support</Text>
                  </HStack>
                </Tab>
              </TabList>

              <TabPanels>
                {/* Account Tab */}
                <TabPanel p={6}>
                  <VStack align="stretch" spacing={6}>
                    <Box>
                      <Heading size="md" mb={1}>
                        Account Settings
                      </Heading>
                      <Text color="gray.600" fontSize="sm">
                        Manage your account details and password
                      </Text>
                    </Box>
                    <Divider />

                    {meLoading ? (
                      <Box py={8} textAlign="center">
                        <Spinner size="lg" color="brand.orange" />
                      </Box>
                    ) : me ? (
                      <VStack align="stretch" spacing={6}>
                        <Box>
                          <Text fontSize="sm" color="gray.500" mb={1}>
                            Email
                          </Text>
                          <Text fontWeight="medium" fontSize="lg">
                            {me.email}
                          </Text>
                        </Box>
                        <Divider />
                        <Box>
                          <Text fontSize="sm" color="gray.500" mb={3}>
                            Password
                          </Text>
                          <ChangePasswordForm
                            userEmail={me.email || ''}
                            hasPassword={me.hasPassword}
                          />
                        </Box>
                      </VStack>
                    ) : (
                      <Text color="gray.500">Unable to load account information</Text>
                    )}
                  </VStack>
                </TabPanel>

                {/* Integrations Tab */}
                <TabPanel p={6}>
                  <VStack align="stretch" spacing={6}>
                    <Box>
                      <Heading size="md" mb={1}>
                        Integrations
                      </Heading>
                      <Text color="gray.600" fontSize="sm">
                        Connect your CMS platforms to publish content directly
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

                    {/* Future integrations */}
                    <VStack spacing={3} align="stretch">
                      <Box
                        p={4}
                        borderWidth="1px"
                        borderRadius="lg"
                        borderColor="gray.200"
                        opacity={0.6}
                      >
                        <HStack justify="space-between">
                          <VStack align="start" spacing={0}>
                            <HStack>
                              <Text fontWeight="medium">Shopify</Text>
                              <Badge colorScheme="gray" size="sm">
                                Coming Soon
                              </Badge>
                            </HStack>
                            <Text fontSize="sm" color="gray.500">
                              Publish blog posts to your Shopify store
                            </Text>
                          </VStack>
                        </HStack>
                      </Box>

                      <Box
                        p={4}
                        borderWidth="1px"
                        borderRadius="lg"
                        borderColor="gray.200"
                        opacity={0.6}
                      >
                        <HStack justify="space-between">
                          <VStack align="start" spacing={0}>
                            <HStack>
                              <Text fontWeight="medium">Webflow</Text>
                              <Badge colorScheme="gray" size="sm">
                                Coming Soon
                              </Badge>
                            </HStack>
                            <Text fontSize="sm" color="gray.500">
                              Publish CMS items to Webflow
                            </Text>
                          </VStack>
                        </HStack>
                      </Box>
                    </VStack>
                  </VStack>
                </TabPanel>

                {/* Team Tab */}
                <TabPanel p={6}>
                  <VStack align="stretch" spacing={6}>
                    <HStack justify="space-between" align="start">
                      <Box>
                        <Heading size="md" mb={1}>
                          Team
                        </Heading>
                        <Text color="gray.600" fontSize="sm">
                          {canManageTeam
                            ? 'Invite team members to collaborate on your projects'
                            : 'Upgrade to Growth to invite team members'}
                        </Text>
                      </Box>
                      {canManageTeam && (
                        <Badge colorScheme="purple" textTransform="capitalize">
                          {me?.subscriptionTier}
                        </Badge>
                      )}
                    </HStack>
                    <Divider />

                    {canManageTeam ? (
                      <VStack align="stretch" spacing={4}>
                        <Text color="gray.600">
                          Manage your team members, invite new collaborators, and control access
                          permissions.
                        </Text>
                        <Link href="/settings/team" passHref>
                          <Button colorScheme="orange" rightIcon={<FiArrowRight />} size="lg">
                            Manage Team Members
                          </Button>
                        </Link>
                      </VStack>
                    ) : (
                      <Box
                        p={6}
                        bg="orange.50"
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="orange.200"
                      >
                        <VStack align="start" spacing={3}>
                          <HStack spacing={2}>
                            <Icon as={FiUsers} color="orange.500" boxSize={6} />
                            <Text fontWeight="semibold" color="orange.700" fontSize="lg">
                              Unlock Team Collaboration
                            </Text>
                          </HStack>
                          <Text color="gray.600">
                            Upgrade to Growth to invite up to 3 team members. Enterprise plans
                            support unlimited seats with advanced permissions.
                          </Text>
                          <Button colorScheme="orange" size="md" mt={2}>
                            Upgrade Plan
                          </Button>
                        </VStack>
                      </Box>
                    )}
                  </VStack>
                </TabPanel>

                {/* Support Tab */}
                <TabPanel p={6}>
                  <VStack align="stretch" spacing={6}>
                    <Box>
                      <Heading size="md" mb={1}>
                        Support
                      </Heading>
                      <Text color="gray.600" fontSize="sm">
                        Get help from the Phoo team
                      </Text>
                    </Box>
                    <Divider />

                    <Box
                      p={6}
                      bg="orange.50"
                      borderRadius="lg"
                      borderWidth="1px"
                      borderColor="orange.200"
                    >
                      <VStack align="start" spacing={3}>
                        <HStack spacing={2}>
                          <Icon as={FiHelpCircle} color="orange.500" boxSize={6} />
                          <Text fontWeight="semibold" color="gray.800" fontSize="lg">
                            Need Help?
                          </Text>
                        </HStack>
                        <Text color="gray.600">
                          Have a question or need assistance? Our support team is here to help.
                        </Text>
                        <Button
                          as="a"
                          href={`mailto:${BRAND.supportEmail}`}
                          colorScheme="orange"
                          size="lg"
                          leftIcon={<FiHelpCircle />}
                        >
                          {BRAND.supportEmail}
                        </Button>
                        <Text color="gray.500" fontSize="sm">
                          We typically respond within 24 hours during business days.
                        </Text>
                      </VStack>
                    </Box>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
