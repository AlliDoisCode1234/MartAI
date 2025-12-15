'use client';

/**
 * Admin User Detail Page
 *
 * Component Hierarchy:
 * App → Admin → Users → [id] (this file)
 *
 * Single component per file - uses extracted sub-components.
 */

import { use, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  VStack,
  HStack,
  Badge,
  Avatar,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  IconButton,
  Select,
} from '@chakra-ui/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { format, formatDistanceToNow } from 'date-fns';
import { ChevronRightIcon, CheckCircleIcon, TimeIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import type { Id } from '@/convex/_generated/dataModel';

// Extracted components
import { SubscriptionCard } from '@/components/admin/SubscriptionCard';
import { HealthScoreCard } from '@/components/admin/HealthScoreCard';
import {
  UserHeaderSkeleton,
  StatsSkeleton,
  CardSkeleton,
  TableSkeleton,
} from '@/components/skeletons';

// Shared constants and utils
import { ONBOARDING_STEP_CONFIG, ROLE_COLORS, ACCOUNT_STATUS_COLORS } from '@/lib/constants/admin';
import { calculateOnboardingProgress } from '@/lib/utils/onboarding';
import type { OnboardingSteps, EngagementMilestones, HealthData } from '@/types/admin';

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const userId = resolvedParams.id as Id<'users'>;

  // Queries
  const userDetails = useQuery(api.admin.users.getUserDetails, { userId });
  const projects = useQuery(api.projects.projects.getProjectsByUser, { userId });
  const health = useQuery(api.subscriptions.userHealth.computeUserHealth, { userId });

  // Mutations
  const resetOnboarding = useMutation(api.users.resetOnboarding);
  const resetPassword = useMutation(api.admin.users.resetUserPassword);
  const updateAccountStatus = useMutation(api.admin.users.updateAccountStatus);

  // Modal states
  const { isOpen: isResetOpen, onOpen: onResetOpen, onClose: onResetClose } = useDisclosure();
  const {
    isOpen: isPasswordOpen,
    onOpen: onPasswordOpen,
    onClose: onPasswordClose,
  } = useDisclosure();
  const { isOpen: isStatusOpen, onOpen: onStatusOpen, onClose: onStatusClose } = useDisclosure();

  const [isLoading, setIsLoading] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('active');
  const toast = useToast();

  // Handlers
  const handleResetOnboarding = async () => {
    setIsLoading(true);
    try {
      await resetOnboarding({ userId });
      toast({ title: 'Onboarding Reset', status: 'success', duration: 3000 });
      onResetClose();
    } catch {
      toast({ title: 'Failed to reset onboarding', status: 'error', duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      await resetPassword({ userId });
      toast({
        title: 'Password Reset',
        description: 'User must reset via email',
        status: 'success',
        duration: 3000,
      });
      onPasswordClose();
    } catch {
      toast({ title: 'Failed to reset password', status: 'error', duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async () => {
    setIsLoading(true);
    try {
      await updateAccountStatus({
        userId,
        accountStatus: newStatus as 'active' | 'inactive' | 'churned' | 'suspended',
        reason: newStatus === 'suspended' ? 'Admin action' : undefined,
      });
      toast({ title: `Status changed to ${newStatus}`, status: 'success', duration: 3000 });
      onStatusClose();
    } catch {
      toast({ title: 'Failed to change status', status: 'error', duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  if (!userDetails) {
    return (
      <Container maxW="container.xl" py={4}>
        <VStack spacing={6} align="stretch">
          <UserHeaderSkeleton />
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
            <CardSkeleton hasHeader bodyHeight="120px" lines={4} />
            <CardSkeleton hasHeader bodyHeight="120px" lines={4} />
          </SimpleGrid>
          <StatsSkeleton count={4} />
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
            <CardSkeleton hasHeader bodyHeight="200px" lines={6} />
            <TableSkeleton columns={4} rows={3} />
          </SimpleGrid>
        </VStack>
      </Container>
    );
  }

  const user = userDetails;
  const progress = calculateOnboardingProgress(user.onboardingSteps as OnboardingSteps);
  const milestones = user.engagementMilestones as EngagementMilestones | undefined;

  return (
    <Container maxW="container.xl" py={4}>
      {/* Breadcrumb */}
      <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />} mb={6}>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href="/admin">
            Admin
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href="/admin/users">
            Users
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{user.name || user.email || 'User'}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <Card mb={6}>
        <CardBody>
          <HStack spacing={6} align="start">
            <Avatar size="xl" name={user.name} src={user.image} />
            <Box flex={1}>
              <HStack mb={2} flexWrap="wrap" gap={2}>
                <Heading size="lg">{user.name || 'Unnamed User'}</Heading>
                <Badge colorScheme={ROLE_COLORS[user.role || 'user']}>{user.role || 'user'}</Badge>
                <Badge colorScheme={ACCOUNT_STATUS_COLORS[user.accountStatus || 'active']}>
                  {user.accountStatus || 'active'}
                </Badge>
              </HStack>
              <Text color="gray.600" fontSize="lg">
                {user.email}
              </Text>
              <HStack mt={2} spacing={4}>
                <Text fontSize="sm" color="gray.500">
                  Joined: {user.createdAt ? format(user.createdAt, 'MMMM d, yyyy') : 'N/A'}
                </Text>
                {user.lastActiveAt && (
                  <Text fontSize="sm" color="gray.500">
                    Last active: {formatDistanceToNow(user.lastActiveAt, { addSuffix: true })}
                  </Text>
                )}
              </HStack>
            </Box>
          </HStack>
        </CardBody>
      </Card>

      {/* Subscription & Health Row */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6} mb={6}>
        <SubscriptionCard subscription={user.subscription} />
        <HealthScoreCard health={health as HealthData | null} />
      </SimpleGrid>

      {/* Stats Row */}
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={4} mb={6}>
        <Card>
          <CardBody py={3}>
            <Stat size="sm">
              <StatLabel>Onboarding</StatLabel>
              <StatNumber>{progress}%</StatNumber>
              <StatHelpText>
                {user.onboardingStatus === 'completed' ? 'Complete' : 'In Progress'}
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody py={3}>
            <Stat size="sm">
              <StatLabel>Projects</StatLabel>
              <StatNumber>{user.projectCount || 0}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody py={3}>
            <Stat size="sm">
              <StatLabel>Health Score</StatLabel>
              <StatNumber>{health?.overall || '—'}</StatNumber>
              <StatHelpText>{health?.tier || 'N/A'}</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody py={3}>
            <Stat size="sm">
              <StatLabel>ID</StatLabel>
              <StatNumber fontSize="xs" fontFamily="mono">
                {userId.slice(0, 12)}...
              </StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6} mb={6}>
        {/* Onboarding Journey */}
        <Card>
          <CardHeader pb={0}>
            <Heading size="md">Onboarding Journey</Heading>
          </CardHeader>
          <CardBody>
            <Box mb={4}>
              <Progress
                value={progress}
                size="lg"
                colorScheme={progress === 100 ? 'green' : 'blue'}
                borderRadius="full"
              />
            </Box>
            <VStack spacing={3} align="stretch">
              {ONBOARDING_STEP_CONFIG.map((config) => {
                const steps = user.onboardingSteps as OnboardingSteps | undefined;
                const value = steps?.[config.key as keyof OnboardingSteps];
                const isComplete =
                  value === true || (config.key === 'planSelected' && typeof value === 'string');
                const timestamp = steps?.[`${config.key}At` as keyof OnboardingSteps] as
                  | number
                  | undefined;
                return (
                  <HStack
                    key={config.key}
                    justify="space-between"
                    p={3}
                    bg={isComplete ? 'green.50' : 'gray.50'}
                    borderRadius="md"
                    border="1px solid"
                    borderColor={isComplete ? 'green.200' : 'gray.200'}
                  >
                    <HStack>
                      <Text fontSize="lg">{config.icon}</Text>
                      <Text fontWeight="medium">{config.label}</Text>
                      {config.key === 'planSelected' && typeof value === 'string' && (
                        <Badge colorScheme="blue">{value}</Badge>
                      )}
                    </HStack>
                    <HStack>
                      {timestamp && (
                        <Text fontSize="xs" color="gray.500">
                          {format(timestamp, 'MMM d, h:mm a')}
                        </Text>
                      )}
                      {isComplete ? (
                        <CheckCircleIcon color="green.500" />
                      ) : (
                        <TimeIcon color="gray.400" />
                      )}
                    </HStack>
                  </HStack>
                );
              })}
            </VStack>
          </CardBody>
        </Card>

        {/* Projects */}
        <Card>
          <CardHeader pb={0}>
            <Heading size="md">Projects</Heading>
          </CardHeader>
          <CardBody>
            {!projects ? (
              <Text color="gray.500">Loading...</Text>
            ) : projects.length === 0 ? (
              <Text color="gray.500">No projects yet.</Text>
            ) : (
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Website</Th>
                    <Th>Created</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {projects.map(
                    (p: {
                      _id: string;
                      name?: string;
                      websiteUrl?: string;
                      createdAt?: number;
                    }) => (
                      <Tr key={p._id}>
                        <Td fontWeight="medium">{p.name}</Td>
                        <Td fontSize="sm" color="gray.600">
                          {p.websiteUrl ? new URL(p.websiteUrl).hostname : '—'}
                        </Td>
                        <Td fontSize="sm" color="gray.500">
                          {p.createdAt ? format(p.createdAt, 'MMM d, yyyy') : '—'}
                        </Td>
                        <Td>
                          <IconButton
                            as={Link}
                            href={`/projects/${p._id}`}
                            aria-label="View"
                            icon={<ExternalLinkIcon />}
                            size="xs"
                            variant="ghost"
                          />
                        </Td>
                      </Tr>
                    )
                  )}
                </Tbody>
              </Table>
            )}
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Engagement Milestones */}
      {milestones && (
        <Card mb={6}>
          <CardHeader pb={0}>
            <Heading size="md">Engagement Milestones</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 2, md: 5 }} gap={4}>
              <Stat size="sm">
                <StatLabel>Keywords</StatLabel>
                <StatNumber>{milestones.totalKeywords || 0}</StatNumber>
                {milestones.firstKeywordCreatedAt && (
                  <StatHelpText>
                    First: {format(milestones.firstKeywordCreatedAt, 'MMM d')}
                  </StatHelpText>
                )}
              </Stat>
              <Stat size="sm">
                <StatLabel>Clusters</StatLabel>
                <StatNumber>{milestones.totalClusters || 0}</StatNumber>
                {milestones.firstClusterCreatedAt && (
                  <StatHelpText>
                    First: {format(milestones.firstClusterCreatedAt, 'MMM d')}
                  </StatHelpText>
                )}
              </Stat>
              <Stat size="sm">
                <StatLabel>Briefs</StatLabel>
                <StatNumber>{milestones.totalBriefs || 0}</StatNumber>
                {milestones.firstBriefCreatedAt && (
                  <StatHelpText>
                    First: {format(milestones.firstBriefCreatedAt, 'MMM d')}
                  </StatHelpText>
                )}
              </Stat>
              <Stat size="sm">
                <StatLabel>Drafts</StatLabel>
                <StatNumber>{milestones.totalDrafts || 0}</StatNumber>
                {milestones.firstDraftCreatedAt && (
                  <StatHelpText>
                    First: {format(milestones.firstDraftCreatedAt, 'MMM d')}
                  </StatHelpText>
                )}
              </Stat>
              <Stat size="sm">
                <StatLabel>Published</StatLabel>
                <StatNumber>{milestones.totalPublished || 0}</StatNumber>
                {milestones.firstContentPublishedAt && (
                  <StatHelpText>
                    First: {format(milestones.firstContentPublishedAt, 'MMM d')}
                  </StatHelpText>
                )}
              </Stat>
            </SimpleGrid>
          </CardBody>
        </Card>
      )}

      {/* Danger Zone */}
      <Card borderColor="red.200" borderWidth={1}>
        <CardHeader pb={0}>
          <Heading size="md" color="red.600">
            Danger Zone
          </Heading>
        </CardHeader>
        <CardBody>
          <Alert status="warning" variant="left-accent" mb={4}>
            <AlertIcon />
            <Box>
              <AlertTitle>Destructive Actions</AlertTitle>
              <AlertDescription>These actions cannot be easily undone.</AlertDescription>
            </Box>
          </Alert>
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between" p={4} bg="red.50" borderRadius="md">
              <Box>
                <Text fontWeight="semibold">Reset Onboarding</Text>
                <Text fontSize="sm" color="gray.600">
                  Clear all onboarding progress.
                </Text>
              </Box>
              <Button colorScheme="red" variant="outline" onClick={onResetOpen}>
                Reset
              </Button>
            </HStack>
            <HStack justify="space-between" p={4} bg="red.50" borderRadius="md">
              <Box>
                <Text fontWeight="semibold">Reset Password</Text>
                <Text fontSize="sm" color="gray.600">
                  User must reset via email.
                </Text>
              </Box>
              <Button colorScheme="red" variant="outline" onClick={onPasswordOpen}>
                Reset
              </Button>
            </HStack>
            <HStack justify="space-between" p={4} bg="red.50" borderRadius="md">
              <Box>
                <Text fontWeight="semibold">Change Account Status</Text>
                <Text fontSize="sm" color="gray.600">
                  Suspend, reactivate, or mark churned.
                </Text>
              </Box>
              <Button
                colorScheme="red"
                variant="outline"
                onClick={() => {
                  setNewStatus(user.accountStatus || 'active');
                  onStatusOpen();
                }}
              >
                Change
              </Button>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Modals */}
      <Modal isOpen={isResetOpen} onClose={onResetClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reset Onboarding?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Reset onboarding for <strong>{user.name || user.email}</strong>?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onResetClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleResetOnboarding} isLoading={isLoading}>
              Reset
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isPasswordOpen} onClose={onPasswordClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reset Password?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Reset password for <strong>{user.name || user.email}</strong>?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onPasswordClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleResetPassword} isLoading={isLoading}>
              Reset
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isStatusOpen} onClose={onStatusClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Status for <strong>{user.name || user.email}</strong>
            </Text>
            <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="churned">Churned</option>
              <option value="suspended">Suspended</option>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onStatusClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleStatusChange} isLoading={isLoading}>
              Change
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
