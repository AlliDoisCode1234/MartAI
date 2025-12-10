'use client';

import { use } from 'react';
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
} from '@chakra-ui/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { format, formatDistanceToNow } from 'date-fns';
import { ChevronRightIcon, CheckCircleIcon, TimeIcon } from '@chakra-ui/icons';
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

  if (!user) {
    return (
      <Container maxW="container.xl">
        <Text>Loading user...</Text>
      </Container>
    );
  }

  const progress = calculateProgress(user.onboardingSteps as OnboardingSteps);

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
            <VStack align="end">
              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                onClick={async () => {
                  if (confirm(`Reset onboarding for ${user.name}?`)) {
                    await resetOnboarding({ userId });
                  }
                }}
              >
                Reset Onboarding
              </Button>
            </VStack>
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

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
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
                  </Tr>
                </Thead>
                <Tbody>
                  {projects.map((project) => (
                    <Tr key={project._id}>
                      <Td fontWeight="medium">{project.name}</Td>
                      <Td fontSize="sm" color="gray.600">
                        {project.websiteUrl ? new URL(project.websiteUrl).hostname : 'No URL'}
                      </Td>
                      <Td fontSize="sm" color="gray.500">
                        {project.createdAt ? format(project.createdAt, 'MMM d, yyyy') : 'N/A'}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </CardBody>
        </Card>
      </SimpleGrid>
    </Container>
  );
}
