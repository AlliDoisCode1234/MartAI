'use client';

/**
 * TeamManagementPanel
 *
 * Component Hierarchy:
 * App -> Settings -> TeamManagementPanel
 *   └── InviteModal
 *
 * Premium team management panel for the Settings Team tab.
 * Inspired by Linear/Vercel/Clerk team settings patterns.
 * Handles member list, role management, invitations, and seat usage.
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
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Alert,
  AlertIcon,
  Skeleton,
  Tooltip,
  Input,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useState } from 'react';
import {
  FiMoreHorizontal,
  FiUserPlus,
  FiTrash2,
  FiShield,
  FiEdit3,
  FiEye,
  FiMail,
  FiClock,
  FiX,
  FiRefreshCw,
  FiLogOut,
  FiCheck,
  FiRepeat,
} from 'react-icons/fi';
import { InviteModal } from '@/src/components/settings/InviteModal';

// ════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════

const ROLE_CONFIG: Record<string, {
  colorScheme: string;
  label: string;
  icon: React.ElementType;
  description: string;
}> = {
  owner:   { colorScheme: 'purple', label: 'Owner',  icon: FiShield, description: 'Full access, billing, and team management' },
  admin:   { colorScheme: 'blue',   label: 'Admin',  icon: FiShield, description: 'Can invite, remove members, and manage content' },
  editor:  { colorScheme: 'green',  label: 'Editor', icon: FiEdit3,  description: 'Can create and edit content' },
  viewer:  { colorScheme: 'gray',   label: 'Viewer', icon: FiEye,    description: 'Read-only access to projects' },
};

// ════════════════════════════════════════
// TYPES
// ════════════════════════════════════════

interface TeamMember {
  _id: Id<'teamMembers'>;
  role: string;
  joinedAt?: number;
  user: { name?: string; email?: string; image?: string } | null;
}

interface PendingInvite {
  _id: Id<'organizationInvitations'>;
  email: string;
  role: string;
  isExpired: boolean;
  expiresAt: number;
}

// ════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════

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
  const myRole = useQuery(api.teams.teams.getMyTeamRole);

  // Mutations
  const updateRole = useMutation(api.teams.teams.updateMemberRole);
  const removeMember = useMutation(api.teams.teams.removeMember);
  const revokeInvite = useMutation(api.teams.invitations.revokeInvitation);
  const resendInvite = useMutation(api.teams.invitations.resendInvitation);
  const syncSeats = useMutation(api.teams.teams.syncSeatsWithTier);
  const leaveOrg = useMutation(api.teams.teams.leaveOrganization);
  const updateOrgName = useMutation(api.teams.teams.updateOrganizationName);
  const [syncing, setSyncing] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [orgName, setOrgName] = useState('');

  // Loading state — Skeleton matching final layout
  if (organization === undefined) {
    return (
      <VStack spacing={5} align="stretch">
        <HStack justify="space-between">
          <Skeleton height="32px" width="180px" borderRadius="md" />
          <Skeleton height="36px" width="140px" borderRadius="md" />
        </HStack>
        <Skeleton height="72px" borderRadius="xl" />
        <Skeleton height="180px" borderRadius="xl" />
      </VStack>
    );
  }

  // No organization yet
  if (!organization) {
    return (
      <Alert status="info" borderRadius="xl" bg="blue.50">
        <AlertIcon />
        <Text>No team yet. Complete onboarding to create your team.</Text>
      </Alert>
    );
  }

  const canInvite = seatUsage && seatUsage.remaining > 0;
  const isAtLimit = seatUsage && seatUsage.remaining <= 0;
  const seatPct = seatUsage ? Math.min((seatUsage.used / seatUsage.max) * 100, 100) : 0;

  // ── Handlers ──

  const handleRoleChange = async (
    memberId: Id<'teamMembers'>,
    newRole: 'admin' | 'editor' | 'viewer'
  ) => {
    try {
      await updateRole({ organizationId: organization._id, targetMemberId: memberId, newRole });
      toast({ title: `Role updated to ${ROLE_CONFIG[newRole]?.label}`, status: 'success', duration: 2000 });
    } catch {
      toast({ title: 'Failed to update role', status: 'error', duration: 3000 });
    }
  };

  const handleRemoveMember = async (memberId: Id<'teamMembers'>) => {
    try {
      await removeMember({ organizationId: organization._id, targetMemberId: memberId });
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
      toast({ title: 'Seats synced!', description: `Your plan now has ${result.maxMembers} seats.`, status: 'success', duration: 3000 });
    } catch {
      toast({ title: 'Failed to sync seats', status: 'error', duration: 3000 });
    } finally {
      setSyncing(false);
    }
  };

  const handleResendInvite = async (inviteId: Id<'organizationInvitations'>) => {
    try {
      await resendInvite({ invitationId: inviteId });
      toast({ title: 'Invitation resent!', status: 'success', duration: 2000 });
    } catch {
      toast({ title: 'Failed to resend', status: 'error', duration: 3000 });
    }
  };

  const handleLeaveOrg = async () => {
    if (!confirm('Are you sure you want to leave this team? You will lose access to all projects.')) return;
    try {
      await leaveOrg({ organizationId: organization._id });
      toast({ title: 'You have left the team', status: 'info', duration: 3000 });
      window.location.href = '/studio';
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : 'Failed to leave', status: 'error', duration: 3000 });
    }
  };

  const handleSaveOrgName = async () => {
    if (!orgName.trim()) return;
    try {
      await updateOrgName({ organizationId: organization._id, name: orgName.trim() });
      toast({ title: 'Team name updated', status: 'success', duration: 2000 });
      setEditingName(false);
    } catch {
      toast({ title: 'Failed to update name', status: 'error', duration: 3000 });
    }
  };

  const getExpiryText = (expiresAt: number): string => {
    const daysLeft = Math.max(0, Math.ceil((expiresAt - Date.now()) / (1000 * 60 * 60 * 24)));
    if (daysLeft === 0) return 'Expires today';
    if (daysLeft === 1) return 'Expires tomorrow';
    return `Expires in ${daysLeft} days`;
  };

  const formatJoinedDate = (ts?: number): string => {
    if (!ts) return '';
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Role derived from backend query — reliable and never guessed
  const isOwner = myRole === 'owner';
  const isOwnerOrAdmin = myRole === 'owner' || myRole === 'admin';

  return (
    <>
      <VStack spacing={6} align="stretch">
        {/* ── Header ── */}
        <HStack justify="space-between" align="start">
          <Box>
            <Heading size="md" color="gray.800" letterSpacing="-0.02em">Team</Heading>
            {editingName ? (
              <HStack mt={1} spacing={2}>
                <Input
                  size="xs"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveOrgName()}
                  borderRadius="md"
                  w="200px"
                  autoFocus
                />
                <IconButton
                  icon={<FiCheck />}
                  aria-label="Save name"
                  size="xs"
                  colorScheme="green"
                  onClick={handleSaveOrgName}
                />
                <IconButton
                  icon={<FiX />}
                  aria-label="Cancel"
                  size="xs"
                  variant="ghost"
                  onClick={() => setEditingName(false)}
                />
              </HStack>
            ) : (
              <Text
                color="gray.500"
                fontSize="sm"
                mt={0.5}
                cursor={isOwner ? 'pointer' : 'default'}
                _hover={isOwner ? { color: 'gray.700', textDecoration: 'underline' } : {}}
                onClick={isOwner ? () => { setOrgName(organization.name); setEditingName(true); } : undefined}
                title={isOwner ? 'Click to edit team name' : undefined}
              >
                {organization.name}
              </Text>
            )}
          </Box>
          <Button
            leftIcon={<FiUserPlus />}
            bg="linear-gradient(135deg, #F99F2A 0%, #e8741e 100%)"
            color="white"
            _hover={{ bg: 'linear-gradient(135deg, #e8941f 0%, #d46818 100%)', transform: 'translateY(-1px)', shadow: 'md' }}
            _active={{ transform: 'translateY(0)' }}
            transition="all 150ms"
            onClick={onInviteOpen}
            isDisabled={!canInvite}
            size="sm"
            borderRadius="lg"
            fontWeight="600"
          >
            Invite Member
          </Button>
        </HStack>

        {/* ── Seat Gauge ── */}
        {seatUsage && (
          <Box
            bg="gray.50"
            borderRadius="xl"
            p={4}
            border="1px solid"
            borderColor="gray.100"
          >
            <HStack justify="space-between" mb={2.5}>
              <Text fontSize="sm" fontWeight="600" color="gray.700">Seat Usage</Text>
              <Text fontSize="sm" fontWeight="700" color={isAtLimit ? 'red.500' : 'gray.700'}>
                {seatUsage.used} / {seatUsage.max}
              </Text>
            </HStack>
            <Box
              h="8px"
              bg="gray.200"
              borderRadius="full"
              overflow="hidden"
            >
              <Box
                h="100%"
                w={`${seatPct}%`}
                bg={isAtLimit
                  ? 'linear-gradient(90deg, #e53e3e, #c53030)'
                  : 'linear-gradient(90deg, #F99F2A, #e8741e)'}
                borderRadius="full"
                transition="width 500ms ease"
              />
            </Box>
            <HStack mt={2} spacing={4}>
              <Text fontSize="xs" color="gray.500">
                {seatUsage.remaining > 0
                  ? `${seatUsage.remaining} seat${seatUsage.remaining > 1 ? 's' : ''} available`
                  : 'No seats available'}
              </Text>
              {seatUsage.pending > 0 && (
                <Text fontSize="xs" color="orange.500">
                  {seatUsage.pending} pending
                </Text>
              )}
              {isAtLimit && (
                <HStack spacing={1} ml="auto">
                  <Button
                    variant="link"
                    colorScheme="orange"
                    size="xs"
                    leftIcon={<FiRefreshCw />}
                    onClick={handleSyncSeats}
                    isLoading={syncing}
                  >
                    Sync
                  </Button>
                  <Text fontSize="xs" color="gray.400">or</Text>
                  <Button
                    variant="link"
                    colorScheme="orange"
                    size="xs"
                    onClick={() => { window.location.href = '/subscription'; }}
                  >
                    Upgrade
                  </Button>
                </HStack>
              )}
            </HStack>
          </Box>
        )}

        {/* ── Members ── */}
        <Box>
          <Text
            fontSize="xs"
            fontWeight="700"
            color="gray.400"
            textTransform="uppercase"
            letterSpacing="0.08em"
            mb={3}
          >
            Members ({teamMembers?.length ?? 0})
          </Text>
          <Box
            bg="white"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.100"
            overflow="hidden"
            shadow="sm"
          >
            {teamMembers?.map((member: TeamMember, idx: number) => {
              const roleConfig = ROLE_CONFIG[member.role] || ROLE_CONFIG.viewer;
              return (
                <HStack
                  key={member._id}
                  px={4}
                  py={3.5}
                  justify="space-between"
                  borderTopWidth={idx > 0 ? '1px' : '0'}
                  borderColor="gray.50"
                  _hover={{ bg: 'gray.50' }}
                  transition="background 150ms"
                  role="group"
                >
                  <HStack spacing={3.5}>
                    <Avatar
                      size="sm"
                      name={member.user?.name || 'User'}
                      src={member.user?.image}
                      bg="orange.100"
                      color="orange.700"
                    />
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.800" lineHeight="short">
                        {member.user?.name || 'Unknown'}
                      </Text>
                      <HStack spacing={2}>
                        <Text fontSize="xs" color="gray.500" lineHeight="short">
                          {member.user?.email}
                        </Text>
                        {member.joinedAt && (
                          <Text fontSize="2xs" color="gray.400">
                            Joined {formatJoinedDate(member.joinedAt)}
                          </Text>
                        )}
                      </HStack>
                    </Box>
                  </HStack>

                  <HStack spacing={2}>
                    <Tooltip label={roleConfig.description} placement="top" hasArrow>
                      <Badge
                        colorScheme={roleConfig.colorScheme}
                        variant="subtle"
                        borderRadius="full"
                        px={2.5}
                        py={0.5}
                        fontSize="xs"
                        fontWeight="600"
                        textTransform="capitalize"
                      >
                        <HStack spacing={1}>
                          <Icon as={roleConfig.icon} boxSize={3} />
                          <Text>{roleConfig.label}</Text>
                        </HStack>
                      </Badge>
                    </Tooltip>

                    {member.role !== 'owner' && (
                      <Menu placement="bottom-end">
                        <MenuButton
                          as={IconButton}
                          icon={<FiMoreHorizontal />}
                          variant="ghost"
                          size="xs"
                          borderRadius="md"
                          color="gray.400"
                          _hover={{ color: 'gray.600', bg: 'gray.100' }}
                          _groupHover={{ opacity: 1 }}
                          opacity={0.5}
                          transition="all 150ms"
                          aria-label="Member options"
                        />
                        <MenuList shadow="lg" borderRadius="xl" py={1} minW="180px">
                          <Text px={3} py={1.5} fontSize="xs" color="gray.400" fontWeight="600">
                            Change Role
                          </Text>
                          {(['admin', 'editor', 'viewer'] as const)
                            .filter((r) => r !== member.role)
                            .map((r) => (
                              <MenuItem
                                key={r}
                                icon={<Icon as={ROLE_CONFIG[r].icon} />}
                                fontSize="sm"
                                onClick={() => handleRoleChange(member._id, r)}
                                borderRadius="md"
                                mx={1}
                              >
                                {ROLE_CONFIG[r].label}
                                <Text as="span" fontSize="xs" color="gray.400" ml={2}>
                                  {ROLE_CONFIG[r].description.split(',')[0]}
                                </Text>
                              </MenuItem>
                            ))}
                          <MenuDivider />
                          <MenuItem
                            icon={<FiTrash2 />}
                            fontSize="sm"
                            color="red.500"
                            _hover={{ bg: 'red.50' }}
                            onClick={() => handleRemoveMember(member._id)}
                            borderRadius="md"
                            mx={1}
                          >
                            Remove from team
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    )}
                  </HStack>
                </HStack>
              );
            })}
          </Box>
        </Box>

        {/* ── Pending Invitations ── */}
        {pendingInvites && pendingInvites.length > 0 && (
          <Box>
            <Text
              fontSize="xs"
              fontWeight="700"
              color="gray.400"
              textTransform="uppercase"
              letterSpacing="0.08em"
              mb={3}
            >
              Pending Invitations ({pendingInvites.length})
            </Text>
            <VStack spacing={2} align="stretch">
              {pendingInvites.map((invite: PendingInvite) => {
                const roleConfig = ROLE_CONFIG[invite.role] || ROLE_CONFIG.viewer;
                return (
                  <HStack
                    key={invite._id}
                    px={4}
                    py={3}
                    bg="white"
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="gray.100"
                    justify="space-between"
                    shadow="sm"
                  >
                    <HStack spacing={3}>
                      <Box
                        w={8}
                        h={8}
                        borderRadius="full"
                        bg="orange.50"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FiMail} color="orange.400" boxSize={3.5} />
                      </Box>
                      <Box>
                        <Text fontSize="sm" fontWeight="500" color="gray.700">
                          {invite.email}
                        </Text>
                        <HStack spacing={2} mt={0.5}>
                          <Badge colorScheme={roleConfig.colorScheme} variant="subtle" fontSize="2xs" borderRadius="full">
                            {roleConfig.label}
                          </Badge>
                          <HStack spacing={1}>
                            <Icon as={FiClock} boxSize={3} color={invite.isExpired ? 'red.400' : 'gray.400'} />
                            <Text fontSize="2xs" color={invite.isExpired ? 'red.500' : 'gray.400'}>
                              {invite.isExpired ? 'Expired' : getExpiryText(invite.expiresAt)}
                            </Text>
                          </HStack>
                        </HStack>
                      </Box>
                    </HStack>
                    <IconButton
                      icon={<FiX />}
                      aria-label="Cancel invitation"
                      variant="ghost"
                      size="xs"
                      color="gray.400"
                      _hover={{ color: 'red.500', bg: 'red.50' }}
                      borderRadius="md"
                      onClick={() => handleRevokeInvite(invite._id)}
                    />
                    {invite.isExpired && (
                      <Tooltip label="Resend with new expiry" hasArrow>
                        <IconButton
                          icon={<FiRepeat />}
                          aria-label="Resend invitation"
                          variant="ghost"
                          size="xs"
                          color="orange.400"
                          _hover={{ color: 'orange.600', bg: 'orange.50' }}
                          borderRadius="md"
                          onClick={() => handleResendInvite(invite._id)}
                        />
                      </Tooltip>
                    )}
                  </HStack>
                );
              })}
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

      {/* ── Leave Team (non-owners only) ── */}
      {organization && !isOwner && teamMembers && teamMembers.length > 0 && (
        <Box mt={6} pt={4} borderTop="1px solid" borderColor="gray.100">
          <Button
            variant="ghost"
            size="sm"
            color="red.400"
            leftIcon={<FiLogOut />}
            _hover={{ color: 'red.600', bg: 'red.50' }}
            onClick={handleLeaveOrg}
          >
            Leave Team
          </Button>
        </Box>
      )}
    </>
  );
}
