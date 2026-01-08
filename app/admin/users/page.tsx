'use client';

/**
 * Admin Users Page
 *
 * Component Hierarchy:
 * App → Admin → Users (this file)
 *
 * Shows user table with:
 * - Streamlined columns for scan-ability
 * - MoreVert action menu (not inline buttons)
 * - Subscription and account status
 */

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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Button,
  Select,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
} from '@chakra-ui/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { ViewIcon, SettingsIcon } from '@chakra-ui/icons';
import {
  FiMoreVertical,
  FiUser,
  FiShield,
  FiAlertCircle,
  FiUsers,
  FiUserPlus,
  FiActivity,
  FiUserX,
} from 'react-icons/fi';
import Link from 'next/link';
import type { Id } from '@/convex/_generated/dataModel';

type User = {
  _id: Id<'users'>;
  name?: string;
  email?: string;
  role?: string;
  accountStatus?: string;
  subscriptionStatus?: string | null;
  subscriptionPlan?: string | null;
  billingCycle?: string | null;
  createdAt?: number;
  lastActiveAt?: number;
};

const STATUS_COLORS: Record<string, string> = {
  // Account status
  active: 'green',
  inactive: 'yellow',
  churned: 'red',
  suspended: 'purple',
  // Subscription status
  trialing: 'blue',
  grace_period: 'yellow',
  maintenance_mode: 'orange',
  past_due: 'red',
  cancelled: 'gray',
  expired: 'gray',
};

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'purple',
  admin: 'blue',
  user: 'gray',
  viewer: 'gray',
};

function StatusBadge({
  status,
  type,
}: {
  status: string | null | undefined;
  type: 'account' | 'subscription';
}) {
  if (!status)
    return (
      <Text fontSize="xs" color="gray.400">
        —
      </Text>
    );

  const color = STATUS_COLORS[status] || 'gray';
  const label = status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <Badge colorScheme={color} fontSize="xs" textTransform="capitalize">
      {label}
    </Badge>
  );
}

export default function AdminUsersPage() {
  const users = useQuery(api.admin.users.listUsers, { limit: 100 });
  const updateAccountStatus = useMutation(api.admin.users.updateAccountStatus);
  const updateUserRole = useMutation(api.admin.users.updateUserRole);

  const { isOpen: isRoleOpen, onOpen: onRoleOpen, onClose: onRoleClose } = useDisclosure();
  const { isOpen: isSuspendOpen, onOpen: onSuspendOpen, onClose: onSuspendClose } = useDisclosure();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>('user');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleRoleChange = async () => {
    if (!selectedUser) return;
    setIsLoading(true);
    try {
      await updateUserRole({
        userId: selectedUser._id,
        role: newRole as 'user' | 'admin' | 'super_admin' | 'viewer',
      });
      toast({
        title: 'Role Updated',
        description: `${selectedUser.name || selectedUser.email} is now ${newRole}`,
        status: 'success',
        duration: 3000,
      });
      onRoleClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update role',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!selectedUser) return;
    setIsLoading(true);
    try {
      const newStatus = selectedUser.accountStatus === 'suspended' ? 'active' : 'suspended';
      await updateAccountStatus({
        userId: selectedUser._id,
        accountStatus: newStatus,
        reason: newStatus === 'suspended' ? 'Admin action' : undefined,
      });
      toast({
        title: newStatus === 'suspended' ? 'User Suspended' : 'User Reactivated',
        description: `${selectedUser.name || selectedUser.email} has been ${newStatus}`,
        status: 'success',
        duration: 3000,
      });
      onSuspendClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.xl">
      <Box mb={8}>
        <Heading size="lg">Users</Heading>
        <Text color="gray.600">Manage registered accounts and subscriptions.</Text>
      </Box>

      {/* Stats Row */}
      {users && (
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={4} mb={6}>
          <Card>
            <CardBody py={3}>
              <Stat size="sm">
                <StatLabel>
                  <HStack>
                    <Icon as={FiUsers} color="purple.500" />
                    <Text>Total</Text>
                  </HStack>
                </StatLabel>
                <StatNumber>{users.length}</StatNumber>
                <StatHelpText>All users</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody py={3}>
              <Stat size="sm">
                <StatLabel>
                  <HStack>
                    <Icon as={FiUserPlus} color="orange.500" />
                    <Text>New (7d)</Text>
                  </HStack>
                </StatLabel>
                <StatNumber color="orange.500">
                  +
                  {
                    users.filter((u: User) => {
                      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
                      return u.createdAt && u.createdAt > sevenDaysAgo;
                    }).length
                  }
                </StatNumber>
                <StatHelpText>This week</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody py={3}>
              <Stat size="sm">
                <StatLabel>
                  <HStack>
                    <Icon as={FiActivity} color="green.500" />
                    <Text>Active</Text>
                  </HStack>
                </StatLabel>
                <StatNumber>
                  {
                    users.filter((u: User) => u.accountStatus === 'active' || !u.accountStatus)
                      .length
                  }
                </StatNumber>
                <StatHelpText>Active accounts</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody py={3}>
              <Stat size="sm">
                <StatLabel>
                  <HStack>
                    <Icon as={FiUserX} color="red.500" />
                    <Text>Churned</Text>
                  </HStack>
                </StatLabel>
                <StatNumber color="red.500">
                  {
                    users.filter(
                      (u: User) => u.accountStatus === 'churned' || u.accountStatus === 'suspended'
                    ).length
                  }
                </StatNumber>
                <StatHelpText>Inactive/Suspended</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>
      )}

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
                  <Th>Account</Th>
                  <Th>Subscription</Th>
                  <Th>Last Active</Th>
                  <Th w="50px"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user: User) => (
                  <Tr key={user._id}>
                    <Td>
                      <HStack>
                        <Avatar size="sm" name={user.name} />
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
                      <Badge colorScheme={ROLE_COLORS[user.role || 'user']} fontSize="xs">
                        {user.role || 'user'}
                      </Badge>
                    </Td>
                    <Td>
                      <StatusBadge status={user.accountStatus} type="account" />
                    </Td>
                    <Td>
                      <VStack spacing={0} align="start">
                        {user.subscriptionPlan && (
                          <Text fontSize="xs" fontWeight="medium">
                            {user.subscriptionPlan}
                          </Text>
                        )}
                        <StatusBadge status={user.subscriptionStatus} type="subscription" />
                      </VStack>
                    </Td>
                    <Td>
                      <Text fontSize="xs" color="gray.600">
                        {user.lastActiveAt
                          ? formatDistanceToNow(user.lastActiveAt, { addSuffix: true })
                          : 'Never'}
                      </Text>
                    </Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          aria-label="User actions"
                          icon={<FiMoreVertical />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          <MenuItem as={Link} href={`/admin/users/${user._id}`} icon={<ViewIcon />}>
                            View Details
                          </MenuItem>
                          <MenuItem
                            icon={<FiShield />}
                            onClick={() => {
                              setSelectedUser(user);
                              setNewRole(user.role || 'user');
                              onRoleOpen();
                            }}
                          >
                            Change Role
                          </MenuItem>
                          <MenuDivider />
                          <MenuItem
                            icon={<FiAlertCircle />}
                            color={user.accountStatus === 'suspended' ? 'green.500' : 'red.500'}
                            onClick={() => {
                              setSelectedUser(user);
                              onSuspendOpen();
                            }}
                          >
                            {user.accountStatus === 'suspended'
                              ? 'Reactivate User'
                              : 'Suspend User'}
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Change Role Modal */}
      <Modal isOpen={isRoleOpen} onClose={onRoleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change User Role</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Change role for <strong>{selectedUser?.name || selectedUser?.email}</strong>
            </Text>
            <Select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
              <option value="user">User</option>
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onRoleClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleRoleChange} isLoading={isLoading}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Suspend User Modal */}
      <Modal isOpen={isSuspendOpen} onClose={onSuspendClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedUser?.accountStatus === 'suspended' ? 'Reactivate User' : 'Suspend User'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to{' '}
              {selectedUser?.accountStatus === 'suspended' ? 'reactivate' : 'suspend'}{' '}
              <strong>{selectedUser?.name || selectedUser?.email}</strong>?
            </Text>
            {selectedUser?.accountStatus !== 'suspended' && (
              <Text mt={2} color="gray.600" fontSize="sm">
                Suspended users cannot access their account until reactivated.
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onSuspendClose}>
              Cancel
            </Button>
            <Button
              colorScheme={selectedUser?.accountStatus === 'suspended' ? 'green' : 'red'}
              onClick={handleSuspend}
              isLoading={isLoading}
            >
              {selectedUser?.accountStatus === 'suspended' ? 'Reactivate' : 'Suspend'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
