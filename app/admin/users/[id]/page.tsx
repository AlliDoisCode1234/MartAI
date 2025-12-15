'use client';

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
  Divider,
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
} from '@chakra-ui/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { format, formatDistanceToNow } from 'date-fns';
import { ChevronRightIcon, CheckCircleIcon, TimeIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import type { Id } from '@/convex/_generated/dataModel';

const STEP_CONFIG = [
  { key: 'signupCompleted', label: 'Signup', icon: '●' },
  { key: 'planSelected', label: 'Plan Selected', icon: '◆' },
  { key: 'paymentCompleted', label: 'Payment', icon: '■' },
  { key: 'ga4Connected', label: 'GA4 Connected', icon: '○' },
  { key: 'gscConnected', label: 'GSC Connected', icon: '◇' },
  { key: 'projectCreated', label: 'Project Created', icon: '▲' },
] as const;

type OnboardingSteps = {
  signupCompleted?: boolean;
  signupCompletedAt?: number;
  planSelected?: string;
  planSelectedAt?: number;
  paymentCompleted?: boolean;
  paymentCompletedAt?: number;
  projectCreated?: boolean;
  projectCreatedAt?: number;
  ga4Connected?: boolean;
  ga4ConnectedAt?: number;
  gscConnected?: boolean;
  gscConnectedAt?: number;
};

type EngagementMilestones = {
  firstKeywordCreatedAt?: number;
  firstClusterCreatedAt?: number;
  firstBriefCreatedAt?: number;
  firstDraftCreatedAt?: number;
  firstContentPublishedAt?: number;
  totalKeywords?: number;
  totalClusters?: number;
  totalBriefs?: number;
  totalDrafts?: number;
  totalPublished?: number;
};

function calculateProgress(steps?: OnboardingSteps): number {
  if (!steps) return 0;
  const allSteps = STEP_CONFIG.map((s) => s.key);
  const completed = allSteps.filter((key) => {
    const value = steps[key as keyof OnboardingSteps];
    return value === true || (key === 'planSelected' && typeof value === 'string');
  }).length;
  return Math.round((completed / allSteps.length) * 100);
}

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const userId = resolvedParams.id as Id<'users'>;

  const user = useQuery(api.admin.getUser, { userId });
  const projects = useQuery(api.projects.projects.getProjectsByUser, { userId });
  const resetOnboarding = useMutation(api.users.resetOnboarding);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isResetting, setIsResetting] = useState(false);
  const toast = useToast();

  const handleResetOnboarding = async () => {
    setIsResetting(true);
    try {
      await resetOnboarding({ userId });
      toast({
        title: 'Onboarding Reset',
        description: `Onboarding has been reset for ${user?.name || 'this user'}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset onboarding. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsResetting(false);
    }
  };

  if (!user) {
    return (
      <Container maxW="container.xl">
        <Text>Loading user...</Text>
      </Container>
    );
  }

  const progress = calculateProgress(user.onboardingSteps as OnboardingSteps);
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
              <HStack mb={2}>
                <Heading size="lg">{user.name || 'Unnamed User'}</Heading>
                <Badge
                  colorScheme={
                    user.role === 'super_admin' ? 'purple' : user.role === 'admin' ? 'blue' : 'gray'
                  }
                >
                  {user.role || 'user'}
                </Badge>
                <Badge colorScheme={user.onboardingStatus === 'completed' ? 'green' : 'yellow'}>
                  {user.onboardingStatus === 'completed' ? 'Active' : 'Onboarding'}
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
              <StatLabel>Plan</StatLabel>
              <StatNumber fontSize="md">{user.subscription?.planTier || 'Free'}</StatNumber>
              <StatHelpText>{user.subscription?.status || 'N/A'}</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody py={3}>
            <Stat size="sm">
              <StatLabel>Projects</StatLabel>
              <StatNumber>{projects?.length || 0}</StatNumber>
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
              {STEP_CONFIG.map((config) => {
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
              <Text color="gray.500">Loading projects...</Text>
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
                    (project: {
                      _id: string;
                      name?: string;
                      websiteUrl?: string;
                      createdAt?: number;
                    }) => (
                      <Tr key={project._id}>
                        <Td fontWeight="medium">{project.name}</Td>
                        <Td fontSize="sm" color="gray.600">
                          {project.websiteUrl ? new URL(project.websiteUrl).hostname : 'No URL'}
                        </Td>
                        <Td fontSize="sm" color="gray.500">
                          {project.createdAt ? format(project.createdAt, 'MMM d, yyyy') : 'N/A'}
                        </Td>
                        <Td>
                          <IconButton
                            as={Link}
                            href={`/projects/${project._id}`}
                            aria-label="View project"
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

      {/* Engagement Milestones (if available) */}
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
              <AlertDescription>
                These actions cannot be easily undone. Use with caution.
              </AlertDescription>
            </Box>
          </Alert>
          <HStack justify="space-between" p={4} bg="red.50" borderRadius="md">
            <Box>
              <Text fontWeight="semibold">Reset Onboarding</Text>
              <Text fontSize="sm" color="gray.600">
                Clear all onboarding progress and restart the user&apos;s journey.
              </Text>
            </Box>
            <Button colorScheme="red" variant="outline" onClick={onOpen}>
              Reset Onboarding
            </Button>
          </HStack>
        </CardBody>
      </Card>

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Reset Onboarding</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to reset onboarding for{' '}
              <strong>{user.name || user.email}</strong>?
            </Text>
            <Text mt={2} color="gray.600" fontSize="sm">
              This will clear all onboarding steps and force the user to restart their journey.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleResetOnboarding} isLoading={isResetting}>
              Reset Onboarding
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
