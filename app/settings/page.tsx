'use client';

/**
 * Settings Page — Unified Settings Hub
 *
 * Component Hierarchy:
 * App → Settings (this file)
 * └── Tab: Account (accordion: Profile, Security, Billing Summary)
 * └── Tab: Brand (accordion: Brand Identity, Content Defaults, Publishing)
 * └── Tab: Integrations (analytics, CMS platforms)
 * └── Tab: Team (inline TeamManagementPanel)
 *
 * Support is a footer link, not a tab.
 * Billing lives at /subscription, linked from Account tab.
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
  Avatar,
  SimpleGrid,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  Input,
  Textarea,
  Switch,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToast,
  useDisclosure,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';
import { WordPressConnect } from '@/src/components/settings/WordPressConnect';
import { ShopifyConnect } from '@/src/components/settings/ShopifyConnect';
import { WixConnect } from '@/src/components/settings/WixConnect';
import { GoogleConnect } from '@/src/components/settings/GoogleConnect';
import { ChangePasswordForm } from '@/src/components/settings/ChangePasswordForm';
import { TeamManagementPanel } from '@/src/components/settings/TeamManagementPanel';
import { useProject } from '@/lib/hooks';
import { useMe } from '@/lib/useMe';
import Link from 'next/link';
import {
  FiUser,
  FiGrid,
  FiUsers,
  FiArrowRight,
  FiHelpCircle,
  FiTarget,
  FiMail,
  FiBriefcase,
  FiCalendar,
  FiShield,
  FiSave,
  FiCreditCard,
  FiGlobe,
  FiChevronDown,
} from 'react-icons/fi';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { BRAND } from '@/lib/constants/brand';
import { AccountShell } from '@/src/components/account/AccountShell';
import { CancellationRetentionModal } from '@/src/components/account/CancellationRetentionModal';
import { formatLongDate } from '@/lib/dateUtils';

// Map tab names to indices
const TAB_MAP: Record<string, number> = {
  account: 0,
  brand: 1,
  integrations: 2,
  team: 3,
  // Legacy aliases
  profile: 0,
};

const INDEX_TO_TAB = ['account', 'brand', 'integrations', 'team'];

// Tier badge colors
const tierColors: Record<string, string> = {
  starter: 'gray',
  engine: 'purple',
  agency: 'blue',
  enterprise: 'orange',
};

// Tier display names — convert internal IDs to user-facing names
// Source of truth: lib/constants/onboarding.ts PLANS array
const TIER_DISPLAY_NAMES: Record<string, string> = {
  starter: 'Lead Starter',
  engine: 'Growth Engine',
  agency: 'Agency',
  enterprise: 'Enterprise',
};

// Form input styles for Brand tab
const inputStyles = {
  bg: 'white',
  borderColor: 'gray.200',
  color: 'gray.800',
  borderRadius: 'lg',
  _placeholder: { color: 'gray.400' },
  _hover: { borderColor: 'gray.300' },
  _focus: {
    borderColor: 'orange.400',
    boxShadow: '0 0 0 1px var(--chakra-colors-orange-400), 0 0 8px rgba(255, 157, 0, 0.15)',
  },
};

function getInitials(name?: string, email?: string): string {
  if (name) {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return 'U';
}

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const { project: activeProject, setCurrentProject } = useProject(null, { autoSelect: true });
  const { me, loading: meLoading } = useMe();
  const cancelModal = useDisclosure();

  // Fetch all projects for the project switcher
  const allProjects = useQuery(
    api.projects.projects.list,
    me ? undefined : 'skip'
  );
  const hasMultipleProjects = (allProjects?.length ?? 0) > 1;

  const myOrganizations = useQuery(
    api.teams.teams.getMyOrganizations,
    me ? undefined : 'skip'
  );
  const organization = myOrganizations && myOrganizations.length > 0 ? myOrganizations[0] : null;
  const userRole = organization?.role || 'owner';

  const canManageTeam = me?.membershipTier && ['engine', 'agency', 'enterprise'].includes(me.membershipTier);

  // URL-synced tab state
  const tabParam = searchParams?.get('tab') || 'account';
  const initialIndex = TAB_MAP[tabParam] ?? 0;
  const [tabIndex, setTabIndex] = useState(initialIndex);

  // Brand settings state
  const [saving, setSaving] = useState(false);
  const [brandSettings, setBrandSettings] = useState({
    brandName: '',
    brandVoice: 'professional',
    targetAudience: '',
    toneKeywords: '',
    defaultWordCount: '1500',
    includeImages: true,
    includeFaq: true,
    includeSchema: true,
    contentFormat: 'blog',
    autoPublish: false,
    reviewRequired: true,
    defaultCta: '',
    emailOnPublish: true,
    emailOnDraft: false,
    weeklyDigest: true,
  });

  const handleTabChange = (index: number) => {
    setTabIndex(index);
    const tabName = INDEX_TO_TAB[index];
    window.history.replaceState(null, '', `/settings?tab=${tabName}`);
  };

  useEffect(() => {
    const newIndex = TAB_MAP[tabParam] ?? 0;
    if (newIndex !== tabIndex) {
      setTabIndex(newIndex);
    }
  }, [tabParam, tabIndex]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateBrand = (key: string, value: any) => {
    setBrandSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveBrand = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    toast({
      title: 'Brand settings saved',
      description: 'Your preferences have been updated.',
      status: 'success',
      duration: 3000,
    });
  };

  const tier = me?.membershipTier || 'starter';
  const isStarter = tier === 'starter';
  const initials = me ? getInitials(me.name, me.email) : 'U';
  const memberSince = me?.createdAt ? formatLongDate(me.createdAt) : 'Unknown';

  return (
    <>
    <AccountShell>
      <Container
        maxW="container.xl"
        py={{ base: 8, md: 12 }}
        px={{ base: 4, sm: 6, md: 8, lg: 12 }}
      >
        <VStack spacing={6} align="stretch">
          <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">
            Settings
          </Heading>

          {/* Project Context Indicator */}
          {(() => {
            // Still resolving project — show skeleton
            if (!me) return null;
            if (allProjects === undefined) {
              return (
                <HStack
                  p={3}
                  bg="orange.50"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="orange.200"
                  spacing={3}
                >
                  <Skeleton w="20px" h="20px" borderRadius="md" startColor="orange.100" endColor="orange.200" />
                  <SkeletonText noOfLines={2} spacing={1} flex={1} startColor="orange.100" endColor="orange.200" />
                </HStack>
              );
            }
            // No project at all
            if (!activeProject) {
              return (
                <HStack
                  p={3}
                  bg="red.50"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="red.200"
                  spacing={3}
                >
                  <Icon as={FiGlobe} color="red.400" boxSize={5} />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" fontWeight="semibold" color="red.600">
                      No project selected
                    </Text>
                    <Text fontSize="xs" color="red.500">
                      Integrations and brand settings require an active project.
                    </Text>
                  </VStack>
                </HStack>
              );
            }
            // Has project
            return (
              <HStack
                p={3}
                bg="orange.50"
                borderRadius="lg"
                borderWidth="1px"
                borderColor="orange.200"
                spacing={3}
              >
                <Icon as={FiGlobe} color="orange.500" boxSize={5} />
                <VStack align="start" spacing={0} flex={1}>
                  <Text fontSize="xs" color="orange.600" fontWeight="medium">
                    Project-specific settings for
                  </Text>
                  {hasMultipleProjects ? (
                    <Select
                      size="sm"
                      variant="unstyled"
                      fontWeight="bold"
                      color="gray.800"
                      cursor="pointer"
                      value={activeProject._id}
                      onChange={(e) => {
                        setCurrentProject(e.target.value);
                      }}
                      icon={<FiChevronDown />}
                      maxW="300px"
                    >
                      {allProjects?.map((p: { _id: string; name: string; websiteUrl?: string }) => (
                        <option key={p._id} value={p._id}>
                          {p.name}{p.websiteUrl ? ` (${p.websiteUrl})` : ''}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Text fontWeight="bold" color="gray.800" fontSize="sm">
                      {activeProject.name}
                      {activeProject.websiteUrl && (
                        <Text as="span" fontWeight="normal" color="gray.500" ml={2}>
                          {activeProject.websiteUrl}
                        </Text>
                      )}
                    </Text>
                  )}
                </VStack>
              </HStack>
            );
          })()}

          <Box bg="white" borderRadius="xl" shadow="md" overflow="hidden">
            <Tabs
              index={tabIndex}
              onChange={handleTabChange}
              colorScheme="orange"
              variant="enclosed"
              isLazy
              lazyBehavior="keepMounted"
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
                    <Icon as={FiTarget} />
                    <Text>Brand</Text>
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
              </TabList>

              <TabPanels>
                {/* ═══ Account Tab (Accordion: Profile, Security, Billing) ═══ */}
                <TabPanel p={0}>
                  {meLoading ? (
                    <Box py={12} textAlign="center">
                      <Spinner size="lg" color="brand.orange" />
                    </Box>
                  ) : me ? (
                    <Accordion defaultIndex={[0]} allowMultiple>
                      {/* ── Profile Section ── */}
                      <AccordionItem border="none">
                        <AccordionButton
                          px={6}
                          py={4}
                          _hover={{ bg: 'gray.50' }}
                          _expanded={{ bg: 'gray.50' }}
                        >
                          <HStack flex={1} spacing={3}>
                            <Icon as={FiUser} color="brand.orange" boxSize={4} />
                            <Text fontWeight="semibold" color="gray.700">Profile</Text>
                          </HStack>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel px={6} pb={6}>
                          <VStack align="stretch" spacing={5}>
                            <HStack spacing={5} align="start" flexWrap="wrap">
                              <Avatar
                                size="xl"
                                name={me.name || me.email}
                                bg="brand.orange"
                                color="white"
                                fontSize="xl"
                              >
                                {initials}
                              </Avatar>
                              <VStack align="start" spacing={1} flex={1} minW="200px">
                                <HStack spacing={3} flexWrap="wrap">
                                  <Heading size="lg">{me.name || 'User'}</Heading>
                                  <Badge
                                    colorScheme={tierColors[tier] || 'gray'}
                                    fontSize="xs"
                                    px={2}
                                    py={0.5}
                                    borderRadius="full"
                                  >
                                    {TIER_DISPLAY_NAMES[tier] || tier}
                                  </Badge>
                                </HStack>
                                <Text color="gray.500" fontSize="sm">{me.email}</Text>
                                {organization && (
                                  <HStack spacing={2} color="gray.500" fontSize="sm">
                                    <Icon as={FiBriefcase} boxSize={3.5} />
                                    <Text>{organization.name}</Text>
                                    {userRole && (
                                      <Badge colorScheme="blue" variant="subtle" fontSize="xs">{userRole}</Badge>
                                    )}
                                  </HStack>
                                )}
                              </VStack>
                            </HStack>

                            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
                              <Card bg="gray.50" shadow="none" border="1px solid" borderColor="gray.200">
                                <CardBody py={3} px={4}>
                                  <HStack spacing={3}>
                                    <Icon as={FiMail} boxSize={4} color="gray.500" />
                                    <Box>
                                      <Text fontSize="xs" color="gray.400">Email</Text>
                                      <Text fontSize="sm" fontWeight="medium">{me.email}</Text>
                                    </Box>
                                  </HStack>
                                </CardBody>
                              </Card>
                              <Card bg="gray.50" shadow="none" border="1px solid" borderColor="gray.200">
                                <CardBody py={3} px={4}>
                                  <HStack spacing={3}>
                                    <Icon as={FiShield} boxSize={4} color="gray.500" />
                                    <Box>
                                      <Text fontSize="xs" color="gray.400">Role</Text>
                                      <Text fontSize="sm" fontWeight="medium" textTransform="capitalize">{userRole}</Text>
                                    </Box>
                                  </HStack>
                                </CardBody>
                              </Card>
                              <Card bg="gray.50" shadow="none" border="1px solid" borderColor="gray.200">
                                <CardBody py={3} px={4}>
                                  <HStack spacing={3}>
                                    <Icon as={FiCalendar} boxSize={4} color="gray.500" />
                                    <Box>
                                      <Text fontSize="xs" color="gray.400">Member Since</Text>
                                      <Text fontSize="sm" fontWeight="medium">{memberSince}</Text>
                                    </Box>
                                  </HStack>
                                </CardBody>
                              </Card>
                            </SimpleGrid>
                          </VStack>
                        </AccordionPanel>
                      </AccordionItem>

                      <Divider borderColor="gray.100" />

                      {/* ── Security Section ── */}
                      <AccordionItem border="none">
                        <AccordionButton
                          px={6}
                          py={4}
                          _hover={{ bg: 'gray.50' }}
                          _expanded={{ bg: 'gray.50' }}
                        >
                          <HStack flex={1} spacing={3}>
                            <Icon as={FiShield} color="brand.orange" boxSize={4} />
                            <Text fontWeight="semibold" color="gray.700">Security</Text>
                          </HStack>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel px={6} pb={6}>
                          <VStack align="stretch" spacing={4}>
                            <Box>
                              <Text fontSize="sm" color="gray.500" mb={3}>Password</Text>
                              <ChangePasswordForm
                                userEmail={me.email || ''}
                                hasPassword={me.hasPassword}
                              />
                            </Box>
                          </VStack>
                        </AccordionPanel>
                      </AccordionItem>

                      <Divider borderColor="gray.100" />

                      {/* ── Billing Summary Section ── */}
                      <AccordionItem border="none">
                        <AccordionButton
                          px={6}
                          py={4}
                          _hover={{ bg: 'gray.50' }}
                          _expanded={{ bg: 'gray.50' }}
                        >
                          <HStack flex={1} spacing={3}>
                            <Icon as={FiCreditCard} color="brand.orange" boxSize={4} />
                            <Text fontWeight="semibold" color="gray.700">Billing & Subscription</Text>
                          </HStack>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel px={6} pb={6}>
                          <VStack align="stretch" spacing={4}>
                            <HStack
                              justify="space-between"
                              p={4}
                              bg="gray.50"
                              borderRadius="lg"
                              border="1px solid"
                              borderColor="gray.200"
                            >
                              <VStack align="start" spacing={1}>
                                <Text fontSize="xs" color="gray.400">Current Plan</Text>
                                <HStack spacing={2}>
                                  <Text fontWeight="bold" fontSize="lg">
                                    {TIER_DISPLAY_NAMES[tier] || tier}
                                  </Text>
                                  <Badge colorScheme="green" fontSize="xs">Active</Badge>
                                </HStack>
                              </VStack>
                              <Link href="/subscription" passHref>
                                <Button
                                  colorScheme="orange"
                                  size="sm"
                                  rightIcon={<FiArrowRight />}
                                >
                                  Manage Plan
                                </Button>
                              </Link>
                            </HStack>

                            {isStarter && (
                              <Box
                                bg="linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)"
                                p={5}
                                borderRadius="lg"
                                color="white"
                              >
                                <HStack justify="space-between" align="center" flexWrap="wrap" spacing={4}>
                                  <Box>
                                    <Heading size="sm" mb={1}>Upgrade to Growth Engine</Heading>
                                    <Text opacity={0.9} fontSize="sm">
                                      Get conversion optimization, lead tracking, and priority support.
                                    </Text>
                                  </Box>
                                  <Link href="/subscription" passHref>
                                    <Button
                                      bg="white"
                                      color="brand.orange"
                                      size="sm"
                                      rightIcon={<FiArrowRight />}
                                      _hover={{ bg: 'gray.100' }}
                                    >
                                      Upgrade
                                    </Button>
                                  </Link>
                                </HStack>
                              </Box>
                            )}

                            {/* ── Danger Zone: Cancel ── */}
                            <Divider borderColor="gray.100" my={2} />
                            <Box pt={2}>
                              <Text
                                fontSize="xs"
                                color="gray.400"
                                cursor="pointer"
                                _hover={{ color: 'red.400', textDecoration: 'underline' }}
                                transition="color 0.15s"
                                onClick={cancelModal.onOpen}
                              >
                                Cancel subscription
                              </Text>
                            </Box>
                          </VStack>
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <Box p={6}>
                      <Text color="gray.500">Unable to load account information</Text>
                    </Box>
                  )}
                </TabPanel>

                {/* ═══ Brand Tab (Accordion: Identity, Content Defaults, Publishing) ═══ */}
                <TabPanel p={0}>
                  <Box px={6} py={4} borderBottom="1px solid" borderColor="gray.100" bg="gray.50">
                    <HStack justify="space-between">
                      <Box>
                        <Text fontWeight="semibold" color="gray.700">Brand Profile</Text>
                        <Text color="gray.500" fontSize="xs">Configure your brand voice and AI content defaults</Text>
                      </Box>
                      <Button
                        bg="linear-gradient(135deg, #FF9D00 0%, #FF6B00 100%)"
                        color="white"
                        leftIcon={<FiSave />}
                        onClick={handleSaveBrand}
                        isLoading={saving}
                        size="sm"
                        _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
                      >
                        Save
                      </Button>
                    </HStack>
                  </Box>

                  <Accordion defaultIndex={[0]} allowMultiple>
                    {/* ── Brand Identity ── */}
                    <AccordionItem border="none">
                      <AccordionButton
                        px={6}
                        py={4}
                        _hover={{ bg: 'gray.50' }}
                        _expanded={{ bg: 'gray.50' }}
                      >
                        <HStack flex={1} spacing={3}>
                          <Icon as={FiTarget} color="brand.orange" boxSize={4} />
                          <Text fontWeight="semibold" color="gray.700">Brand Identity</Text>
                        </HStack>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel px={6} pb={6}>
                        <VStack spacing={4} align="stretch">
                          <FormControl>
                            <FormLabel color="gray.600" fontSize="sm">Brand Name</FormLabel>
                            <Input
                              {...inputStyles}
                              placeholder="Your company name"
                              value={brandSettings.brandName}
                              onChange={(e) => updateBrand('brandName', e.target.value)}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel color="gray.600" fontSize="sm">Brand Voice</FormLabel>
                            <Select
                              {...inputStyles}
                              value={brandSettings.brandVoice}
                              onChange={(e) => updateBrand('brandVoice', e.target.value)}
                            >
                              <option value="professional">Professional</option>
                              <option value="casual">Casual & Friendly</option>
                              <option value="authoritative">Authoritative</option>
                              <option value="conversational">Conversational</option>
                              <option value="technical">Technical</option>
                            </Select>
                            <FormHelperText color="gray.500" fontSize="xs">
                              Affects the tone of AI-generated content
                            </FormHelperText>
                          </FormControl>
                          <FormControl>
                            <FormLabel color="gray.600" fontSize="sm">Target Audience</FormLabel>
                            <Textarea
                              {...inputStyles}
                              placeholder="Describe your ideal reader..."
                              value={brandSettings.targetAudience}
                              onChange={(e) => updateBrand('targetAudience', e.target.value)}
                              rows={3}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel color="gray.600" fontSize="sm">Tone Keywords</FormLabel>
                            <Input
                              {...inputStyles}
                              placeholder="expert, helpful, data-driven..."
                              value={brandSettings.toneKeywords}
                              onChange={(e) => updateBrand('toneKeywords', e.target.value)}
                            />
                            <FormHelperText color="gray.500" fontSize="xs">
                              Comma-separated keywords that define your content style
                            </FormHelperText>
                          </FormControl>
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>

                    <Divider borderColor="gray.100" />

                    {/* ── Content Defaults ── */}
                    <AccordionItem border="none">
                      <AccordionButton
                        px={6}
                        py={4}
                        _hover={{ bg: 'gray.50' }}
                        _expanded={{ bg: 'gray.50' }}
                      >
                        <HStack flex={1} spacing={3}>
                          <Icon as={FiGrid} color="brand.orange" boxSize={4} />
                          <Text fontWeight="semibold" color="gray.700">Content Defaults</Text>
                        </HStack>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel px={6} pb={6}>
                        <VStack spacing={4} align="stretch">
                          <FormControl>
                            <FormLabel color="gray.600" fontSize="sm">Default Word Count</FormLabel>
                            <Select
                              {...inputStyles}
                              value={brandSettings.defaultWordCount}
                              onChange={(e) => updateBrand('defaultWordCount', e.target.value)}
                            >
                              <option value="800">Short (800 words)</option>
                              <option value="1500">Medium (1500 words)</option>
                              <option value="2500">Long (2500 words)</option>
                              <option value="4000">Comprehensive (4000+ words)</option>
                            </Select>
                          </FormControl>
                          <FormControl display="flex" alignItems="center" justifyContent="space-between">
                            <Box>
                              <FormLabel color="gray.600" fontSize="sm" mb={0}>Include Image Suggestions</FormLabel>
                              <FormHelperText color="gray.500" fontSize="xs" mt={1}>Add AI-suggested image placements</FormHelperText>
                            </Box>
                            <Switch colorScheme="orange" isChecked={brandSettings.includeImages} onChange={(e) => updateBrand('includeImages', e.target.checked)} />
                          </FormControl>
                          <FormControl display="flex" alignItems="center" justifyContent="space-between">
                            <Box>
                              <FormLabel color="gray.600" fontSize="sm" mb={0}>Include FAQ Section</FormLabel>
                              <FormHelperText color="gray.500" fontSize="xs" mt={1}>Auto-generate FAQ from topic</FormHelperText>
                            </Box>
                            <Switch colorScheme="orange" isChecked={brandSettings.includeFaq} onChange={(e) => updateBrand('includeFaq', e.target.checked)} />
                          </FormControl>
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>

                    <Divider borderColor="gray.100" />

                    {/* ── Publishing ── */}
                    <AccordionItem border="none">
                      <AccordionButton
                        px={6}
                        py={4}
                        _hover={{ bg: 'gray.50' }}
                        _expanded={{ bg: 'gray.50' }}
                      >
                        <HStack flex={1} spacing={3}>
                          <Icon as={FiCalendar} color="brand.orange" boxSize={4} />
                          <Text fontWeight="semibold" color="gray.700">Publishing</Text>
                        </HStack>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel px={6} pb={6}>
                        <VStack spacing={4} align="stretch">
                          <FormControl display="flex" alignItems="center" justifyContent="space-between">
                            <Box>
                              <FormLabel color="gray.600" fontSize="sm" mb={0}>Auto-Publish</FormLabel>
                              <FormHelperText color="gray.500" fontSize="xs" mt={1}>Automatically publish when approved</FormHelperText>
                            </Box>
                            <Switch colorScheme="orange" isChecked={brandSettings.autoPublish} onChange={(e) => updateBrand('autoPublish', e.target.checked)} />
                          </FormControl>
                          <FormControl display="flex" alignItems="center" justifyContent="space-between">
                            <Box>
                              <FormLabel color="gray.600" fontSize="sm" mb={0}>Require Review</FormLabel>
                              <FormHelperText color="gray.500" fontSize="xs" mt={1}>Content must be reviewed before publishing</FormHelperText>
                            </Box>
                            <Switch colorScheme="orange" isChecked={brandSettings.reviewRequired} onChange={(e) => updateBrand('reviewRequired', e.target.checked)} />
                          </FormControl>
                          <FormControl>
                            <FormLabel color="gray.600" fontSize="sm">Default CTA</FormLabel>
                            <Textarea
                              {...inputStyles}
                              placeholder="Your default call-to-action text..."
                              value={brandSettings.defaultCta}
                              onChange={(e) => updateBrand('defaultCta', e.target.value)}
                              rows={2}
                            />
                          </FormControl>
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </TabPanel>

                {/* ═══ Integrations Tab ═══ */}
                <TabPanel p={6}>
                  <VStack align="stretch" spacing={6}>
                    <Box>
                      <Heading size="md" mb={1}>Integrations</Heading>
                      <Text color="gray.600" fontSize="sm">
                        Connect analytics and CMS platforms to power your SEO strategy
                      </Text>
                    </Box>
                    <Divider />
                    {activeProject ? (
                      <VStack spacing={6} align="stretch">
                        <Box>
                          <Text fontWeight="semibold" color="gray.700" mb={3}>Analytics</Text>
                          <GoogleConnect projectId={activeProject._id} />
                        </Box>
                        <Divider />
                        <Box>
                          <Text fontWeight="semibold" color="gray.700" mb={3}>Publishing Platforms</Text>
                          <VStack spacing={4} align="stretch">
                            <WordPressConnect projectId={activeProject._id} />
                            <ShopifyConnect projectId={activeProject._id} />
                            <WixConnect projectId={activeProject._id} />
                          </VStack>
                        </Box>
                      </VStack>
                    ) : (
                      <Box p={4} bg="gray.50" borderRadius="md">
                        <Text color="gray.500">Create a project first to connect integrations</Text>
                      </Box>
                    )}
                  </VStack>
                </TabPanel>

                {/* ═══ Team Tab ═══ */}
                <TabPanel p={6}>
                  {canManageTeam ? (
                    <TeamManagementPanel />
                  ) : (
                    <VStack align="stretch" spacing={6}>
                      <Box>
                        <Heading size="md" mb={1}>Team</Heading>
                        <Text color="gray.600" fontSize="sm">
                          Upgrade to Growth Engine to invite team members
                        </Text>
                      </Box>
                      <Divider />
                      <Box p={6} bg="orange.50" borderRadius="lg" borderWidth="1px" borderColor="orange.200">
                        <VStack align="start" spacing={3}>
                          <HStack spacing={2}>
                            <Icon as={FiUsers} color="orange.500" boxSize={6} />
                            <Text fontWeight="semibold" color="orange.700" fontSize="lg">
                              Unlock Team Collaboration
                            </Text>
                          </HStack>
                          <Text color="gray.600">
                            Upgrade to Growth Engine to invite up to 5 team members. Agency plans support up to 25 seats.
                          </Text>
                          <Link href="/subscription" passHref>
                            <Button colorScheme="orange" size="md" mt={2}>Upgrade Plan</Button>
                          </Link>
                        </VStack>
                      </Box>
                    </VStack>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>

          {/* Support footer */}
          <HStack justify="center" spacing={2} py={2}>
            <Icon as={FiHelpCircle} color="gray.400" boxSize={4} />
            <Text color="gray.400" fontSize="sm">
              Need help?{' '}
              <Box
                as="a"
                href={`mailto:${BRAND.supportEmail}`}
                color="brand.orange"
                fontWeight="medium"
                _hover={{ textDecoration: 'underline' }}
              >
                {BRAND.supportEmail}
              </Box>
            </Text>
          </HStack>
        </VStack>
      </Container>
    </AccountShell>

    {/* Cancellation modal — rendered outside AccountShell to avoid z-index issues */}
    <CancellationRetentionModal
      isOpen={cancelModal.isOpen}
      onClose={cancelModal.onClose}
      currentPlan={tier}
    />
  </>
  );
}
