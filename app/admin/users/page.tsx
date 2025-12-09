'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Card,
  CardBody,
  Avatar,
  HStack,
  VStack,
  Button,
  Progress,
  Tooltip,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
} from '@chakra-ui/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { format, formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { CheckCircleIcon, TimeIcon, ViewIcon } from '@chakra-ui/icons';

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

type User = {
  _id: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
  createdAt?: number;
  onboardingStatus?: string;
  onboardingSteps?: OnboardingSteps;
  lastActiveAt?: number;
  subscription?: {
    status: string;
    planTier: string;
  } | null;
};

const STEP_CONFIG = [
  { key: 'signupCompleted', label: 'Signup', icon: '●' },
  { key: 'planSelected', label: 'Plan', icon: '◆' },
  { key: 'paymentCompleted', label: 'Payment', icon: '■' },
  { key: 'ga4Connected', label: 'GA4', icon: '○' },
  { key: 'gscConnected', label: 'GSC', icon: '◇' },
  { key: 'projectCreated', label: 'Project', icon: '▲' },
] as const;

function calculateProgress(steps?: OnboardingSteps): number {
  if (!steps) return 0;
  const allSteps = STEP_CONFIG.map((s) => s.key);
  const completed = allSteps.filter((key) => {
    const value = steps[key as keyof OnboardingSteps];
    return value === true || (key === 'planSelected' && typeof value === 'string');
  }).length;
  return Math.round((completed / allSteps.length) * 100);
}

function StepIndicators({ steps }: { steps?: OnboardingSteps }) {
  return (
    <HStack spacing={1}>
      {STEP_CONFIG.map((config) => {
        const value = steps?.[config.key as keyof OnboardingSteps];
        const isComplete =
          value === true || (config.key === 'planSelected' && typeof value === 'string');
        const timestamp = steps?.[`${config.key}At` as keyof OnboardingSteps] as number | undefined;

        return (
          <Tooltip
            key={config.key}
            label={`${config.label}: ${isComplete ? 'Complete' : 'Pending'}${timestamp ? ` (${format(timestamp, 'MMM d, h:mm a')})` : ''}`}
            hasArrow
          >
            <Box
              w="24px"
              h="24px"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={isComplete ? 'green.100' : 'gray.100'}
              opacity={isComplete ? 1 : 0.5}
              fontSize="xs"
            >
              {config.icon}
            </Box>
          </Tooltip>
        );
      })}
    </HStack>
  );
}

function UserDetailModal({
  user,
  isOpen,
  onClose,
}: {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!user) return null;

  const progress = calculateProgress(user.onboardingSteps);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <Avatar size="md" name={user.name} src={user.image} />
            <Box>
              <Text>{user.name || 'Unnamed User'}</Text>
              <Text fontSize="sm" color="gray.500" fontWeight="normal">
                {user.email}
              </Text>
            </Box>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={6} align="stretch">
            {/* Overview Stats */}
            <SimpleGrid columns={3} gap={4}>
              <Stat>
                <StatLabel>Progress</StatLabel>
                <StatNumber>{progress}%</StatNumber>
                <StatHelpText>
                  {user.onboardingStatus === 'completed' ? 'Complete' : 'In Progress'}
                </StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Plan</StatLabel>
                <StatNumber fontSize="md">{user.subscription?.planTier || 'Free'}</StatNumber>
                <StatHelpText>{user.subscription?.status || 'N/A'}</StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Joined</StatLabel>
                <StatNumber fontSize="md">
                  {user.createdAt ? format(user.createdAt, 'MMM d') : 'N/A'}
                </StatNumber>
                <StatHelpText>
                  {user.createdAt ? formatDistanceToNow(user.createdAt, { addSuffix: true }) : ''}
                </StatHelpText>
              </Stat>
            </SimpleGrid>

            <Divider />

            {/* Onboarding Steps */}
            <Box>
              <Text fontWeight="semibold" mb={3}>
                Onboarding Steps
              </Text>
              <VStack spacing={2} align="stretch">
                {STEP_CONFIG.map((config) => {
                  const value = user.onboardingSteps?.[config.key as keyof OnboardingSteps];
                  const isComplete =
                    value === true || (config.key === 'planSelected' && typeof value === 'string');
                  const timestamp = user.onboardingSteps?.[
                    `${config.key}At` as keyof OnboardingSteps
                  ] as number | undefined;

                  return (
                    <HStack
                      key={config.key}
                      justify="space-between"
                      p={2}
                      bg={isComplete ? 'green.50' : 'gray.50'}
                      borderRadius="md"
                    >
                      <HStack>
                        <Text fontSize="lg">{config.icon}</Text>
                        <Text>{config.label}</Text>
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
            </Box>

            {/* Last Active */}
            {user.lastActiveAt && (
              <>
                <Divider />
                <HStack justify="space-between">
                  <Text color="gray.600">Last Active</Text>
                  <Text>{formatDistanceToNow(user.lastActiveAt, { addSuffix: true })}</Text>
                </HStack>
              </>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default function AdminUsersPage() {
  const users = useQuery(api.admin.getAllUsers);
  const resetOnboarding = useMutation(api.users.resetOnboarding);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    onOpen();
  };

  return (
    <Container maxW="container.xl">
      <Box mb={8}>
        <Heading size="lg">Users</Heading>
        <Text color="gray.600">Manage registered accounts and track onboarding progress.</Text>
      </Box>

      <Card>
        <CardBody>
          {!users ? (
            <Text color="gray.500">Loading users…</Text>
          ) : users.length === 0 ? (
            <Text color="gray.500">No users found.</Text>
          ) : (
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>User</Th>
                  <Th>Role</Th>
                  <Th>Plan</Th>
                  <Th>Progress</Th>
                  <Th>Steps</Th>
                  <Th>Joined</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user: User) => {
                  const progress = calculateProgress(user.onboardingSteps);

                  return (
                    <Tr key={user._id}>
                      <Td>
                        <HStack>
                          <Avatar size="sm" name={user.name} src={user.image} />
                          <Box>
                            <Text fontWeight="semibold" fontSize="sm">
                              {user.name || 'Unnamed'}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {user.email}
                            </Text>
                          </Box>
                        </HStack>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={
                            user.role === 'super_admin'
                              ? 'purple'
                              : user.role === 'admin'
                                ? 'blue'
                                : 'gray'
                          }
                          fontSize="xs"
                        >
                          {user.role || 'user'}
                        </Badge>
                      </Td>
                      <Td>
                        {user.subscription ? (
                          <Badge
                            colorScheme={user.subscription.status === 'active' ? 'green' : 'red'}
                            fontSize="xs"
                          >
                            {user.subscription.planTier}
                          </Badge>
                        ) : (
                          <Text fontSize="xs" color="gray.400">
                            Free
                          </Text>
                        )}
                      </Td>
                      <Td>
                        <VStack spacing={1} align="stretch" minW="80px">
                          <Progress
                            value={progress}
                            size="sm"
                            colorScheme={progress === 100 ? 'green' : 'blue'}
                            borderRadius="full"
                          />
                          <Text fontSize="xs" color="gray.500" textAlign="center">
                            {progress}%
                          </Text>
                        </VStack>
                      </Td>
                      <Td>
                        <StepIndicators steps={user.onboardingSteps} />
                      </Td>
                      <Td>
                        <Text fontSize="xs" color="gray.600">
                          {user.createdAt ? format(user.createdAt, 'MMM d, yyyy') : 'N/A'}
                        </Text>
                      </Td>
                      <Td>
                        <HStack spacing={1}>
                          <Tooltip label="View Details" hasArrow>
                            <IconButton
                              aria-label="View user"
                              icon={<ViewIcon />}
                              size="xs"
                              variant="ghost"
                              onClick={() => handleViewUser(user)}
                            />
                          </Tooltip>
                          <Button
                            size="xs"
                            variant="outline"
                            colorScheme="red"
                            onClick={async () => {
                              if (confirm(`Reset onboarding for ${user.name}?`)) {
                                await resetOnboarding({ userId: user._id as any });
                              }
                            }}
                          >
                            Reset
                          </Button>
                        </HStack>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          )}
        </CardBody>
      </Card>

      <UserDetailModal user={selectedUser} isOpen={isOpen} onClose={onClose} />
    </Container>
  );
}
