'use client';

/**
 * TeamManagementPanel
 *
 * Component Hierarchy:
 * App → Settings → TeamManagementPanel
 *   └── InviteModal
 *
 * Inline team management for the Settings Team tab.
 * Handles member list, role changes, invitations, and seat usage.
 */

import {
  VStack,
  HStack,
  Heading,
  Text,
  Box,
  Button,
  Badge,
  Avatar,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Alert,
  AlertIcon,
  Progress,
  Divider,
  Skeleton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useState } from 'react';
import { FiMoreVertical, FiUserPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { InviteModal } from '@/src/components/settings/InviteModal';

interface TeamMember {
  _id: Id<'teamMembers'>;
  role: string;
  user: { name?: string; email?: string; image?: string } | null;
}

interface PendingInvite {
  _id: Id<'organizationInvitations'>;
  email: string;
  role: string;
  isExpired: boolean;
}

export function TeamManagementPanel() {
  const toast = useToast();
  const { isOpen: isInviteOpen, onOpen: onInviteOpen, onClose: onInviteClose } = useDisclosure();

  // Queries
  const organization = useQuery(api.teams.teams.getMyOrganization);
  const teamMembers = useQuery(
    api.teams.teams.getTeamMembers,
    organization ? { organizationId: organization._id } : 'skip'
  );
  const seatUsage = useQuery(
    api.teams.teams.getSeatUsage,
    organization ? { organizationId: organization._id } : 'skip'
  );
  const pendingInvites = useQuery(
    api.teams.invitations.getPendingInvitations,
    organization ? { organizationId: organization._id } : 'skip'
  );

  // Mutations
  const updateRole = useMutation(api.teams.teams.updateMemberRole);
  const removeMember = useMutation(api.teams.teams.removeMember);
  const revokeInvite = useMutation(api.teams.invitations.revokeInvitation);
  const syncSeats = useMutation(api.teams.teams.syncSeatsWithTier);
  const [syncing, setSyncing] = useState(false);

  // Loading state
  if (organization === undefined) {
    return (
      <VStack spacing={4} align="stretch">
        <Skeleton height="40px" width="200px" />
        <Skeleton height="8px" width="100%" borderRadius="full" />
        <Skeleton height="200px" borderRadius="lg" />
      </VStack>
    );
  }

  // No organization yet
  if (!organization) {
    return (
      <Alert status="info" borderRadius="lg">
        <AlertIcon />
        <Text>No team yet. Complete onboarding to create your team.</Text>
      </Alert>
    );
  }

  const canInvite = seatUsage && seatUsage.remaining > 0;
  const isAtLimit = seatUsage && seatUsage.remaining <= 0;

  const handleRoleChange = async (
    memberId: Id<'teamMembers'>,
    newRole: 'admin' | 'editor' | 'viewer'
  ) => {
    try {
      await updateRole({
        organizationId: organization._id,
        targetMemberId: memberId,
        newRole,
      });
      toast({ title: 'Role updated', status: 'success', duration: 2000 });
    } catch {
      toast({ title: 'Failed to update role', status: 'error', duration: 3000 });
    }
  };

  const handleRemoveMember = async (memberId: Id<'teamMembers'>) => {
    try {
      await removeMember({
        organizationId: organization._id,
        targetMemberId: memberId,
      });
      toast({ title: 'Member removed', status: 'success', duration: 2000 });
    } catch {
      toast({ title: 'Failed to remove member', status: 'error', duration: 3000 });
    }
  };

  const handleRevokeInvite = async (inviteId: Id<'organizationInvitations'>) => {
    try {
      await revokeInvite({ invitationId: inviteId });
      toast({ title: 'Invitation cancelled', status: 'success', duration: 2000 });
    } catch {
      toast({ title: 'Failed to cancel invitation', status: 'error', duration: 3000 });
    }
  };

  const handleSyncSeats = async () => {
    setSyncing(true);
    try {
      const result = await syncSeats({});
      toast({
        title: 'Seats synced!',
        description: `Your plan now has ${result.maxMembers} seats.`,
        status: 'success',
        duration: 3000,
      });
    } catch {
      toast({ title: 'Failed to sync seats', status: 'error', duration: 3000 });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <Box>
            <Heading size="md" color="gray.800">
              Your Team
            </Heading>
            <Text color="gray.600" fontSize="sm" mt={1}>
              {organization.name}
            </Text>
          </Box>
          {seatUsage && (
            <Badge
              colorScheme={isAtLimit ? 'red' : 'green'}
              fontSize="md"
              px={3}
              py={1}
              borderRadius="full"
            >
              {seatUsage.used}/{seatUsage.max} seats
            </Badge>
          )}
        </HStack>

        {/* Seat Usage Progress */}
        {seatUsage && seatUsage.max > 1 && (
          <Box>
            <Progress
              value={(seatUsage.used / seatUsage.max) * 100}
              colorScheme={isAtLimit ? 'red' : 'green'}
              borderRadius="full"
              size="sm"
            />
            {seatUsage.pending > 0 && (
              <Text fontSize="sm" color="gray.500" mt={1}>
                {seatUsage.pending} pending invite{seatUsage.pending > 1 ? 's' : ''}
              </Text>
            )}
          </Box>
        )}

        {/* Team Members */}
        <Box bg="white" borderRadius="lg" shadow="sm" border="1px solid" borderColor="gray.100" overflow="hidden">
          <VStack spacing={0} align="stretch" divider={<Divider />}>
            {teamMembers?.map((member: TeamMember) => (
              <HStack key={member._id} p={4} justify="space-between">
                <HStack spacing={3}>
                  <Avatar
                    size="md"
                    name={member.user?.name || 'User'}
                    src={member.user?.image}
                  />
                  <Box>
                    <HStack>
                      <Text fontWeight="medium">{member.user?.name || 'Unknown'}</Text>
                      {member.role === 'owner' && (
                        <Badge colorScheme="purple" size="sm">Owner</Badge>
                      )}
                    </HStack>
                    <Text fontSize="sm" color="gray.500">{member.user?.email}</Text>
                  </Box>
                </HStack>

                {member.role !== 'owner' && (
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      aria-label="Member options"
                    />
                    <MenuList>
                      <MenuItem icon={<FiEdit2 />} onClick={() => handleRoleChange(member._id, 'admin')}>
                        Make Admin
                      </MenuItem>
                      <MenuItem icon={<FiEdit2 />} onClick={() => handleRoleChange(member._id, 'editor')}>
                        Make Editor
                      </MenuItem>
                      <MenuItem icon={<FiEdit2 />} onClick={() => handleRoleChange(member._id, 'viewer')}>
                        Make Viewer
                      </MenuItem>
                      <MenuItem icon={<FiTrash2 />} color="red.500" onClick={() => handleRemoveMember(member._id)}>
                        Remove from team
                      </MenuItem>
                    </MenuList>
                  </Menu>
                )}
              </HStack>
            ))}
          </VStack>

          {/* Invite Button */}
          <Box p={4} borderTopWidth="1px">
            <Button
              leftIcon={<FiUserPlus />}
              colorScheme="orange"
              onClick={onInviteOpen}
              isDisabled={!canInvite}
              width="full"
            >
              Invite Team Member
            </Button>
            {isAtLimit && (
              <Text fontSize="sm" color="gray.500" mt={2} textAlign="center">
                Seat limit reached.{' '}
                <Button variant="link" colorScheme="orange" size="sm" onClick={handleSyncSeats} isLoading={syncing}>
                  Sync with plan
                </Button>
                {' or '}
                <Button variant="link" colorScheme="orange" size="sm" onClick={() => (window.location.href = '/subscription')}>
                  Upgrade plan
                </Button>
              </Text>
            )}
          </Box>
        </Box>

        {/* Pending Invitations */}
        {pendingInvites && pendingInvites.length > 0 && (
          <Box bg="white" borderRadius="lg" shadow="sm" border="1px solid" borderColor="gray.100" p={4}>
            <Heading size="sm" mb={3}>Pending Invitations</Heading>
            <VStack spacing={2} align="stretch">
              {pendingInvites.map((invite: PendingInvite) => (
                <HStack key={invite._id} justify="space-between" p={2} bg="gray.50" borderRadius="md">
                  <Box>
                    <Text fontWeight="medium">{invite.email}</Text>
                    <HStack spacing={2}>
                      <Badge colorScheme="blue" size="sm">{invite.role}</Badge>
                      {invite.isExpired && <Badge colorScheme="red" size="sm">Expired</Badge>}
                    </HStack>
                  </Box>
                  <Button size="sm" variant="ghost" colorScheme="red" onClick={() => handleRevokeInvite(invite._id)}>
                    Cancel
                  </Button>
                </HStack>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>

      {organization && (
        <InviteModal
          isOpen={isInviteOpen}
          onClose={onInviteClose}
          organizationId={organization._id}
        />
      )}
    </>
  );
}
