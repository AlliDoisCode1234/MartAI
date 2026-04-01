'use client';

/**
 * OrganizationSwitcher
 *
 * Component Hierarchy:
 * App -> Navigation -> OrganizationSwitcher
 *
 * Workspace switcher for multi-org users (Engine+).
 * Only renders if user belongs to 2+ organizations.
 * Uses canonical convex/teams/teams.ts module.
 *
 * Tier gating:
 * - Starter: shows "Upgrade to add workspaces"
 * - Engine/Agency/Enterprise: shows "Create Workspace" (disabled at limit)
 */

import { type FC } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  Icon,
  Text,
  HStack,
  Box,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { FiBriefcase, FiCheck, FiChevronDown, FiPlus, FiArrowUpRight } from 'react-icons/fi';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/lib/useAuth';
import { Id } from '@/convex/_generated/dataModel';
import Link from 'next/link';

// Workspace limits per tier — mirrors SSOT in convex/lib/tierLimits.ts
const WORKSPACE_LIMITS: Record<string, number> = {
  starter: 1,
  engine: 3,
  agency: 10,
  enterprise: 999,
};

interface OrgItem {
  _id: Id<'organizations'>;
  name: string;
  role: string;
}

export const OrganizationSwitcher: FC = () => {
  const { user } = useAuth();
  const organizations = useQuery(api.teams.teams.getMyOrganizations) as OrgItem[] | undefined;
  const switchOrg = useMutation(api.users.switchOrganization);
  const toast = useToast();

  // Don't render if loading, single org, or not logged in
  if (organizations === undefined || organizations.length <= 1 || !user) {
    return null;
  }

  const currentOrg = organizations.find((org) => org._id === user.organizationId);
  const tier = user.membershipTier || 'starter';
  const isStarter = tier === 'starter';
  const canCreateWorkspace = !isStarter;
  const maxWorkspaces = WORKSPACE_LIMITS[tier] ?? 1;
  const atWorkspaceLimit = organizations.length >= maxWorkspaces;

  const handleSwitch = async (organizationId: Id<'organizations'>, orgName: string) => {
    try {
      await switchOrg({ organizationId });
      toast({
        title: 'Workspace Switched',
        description: `You are now working in ${orgName}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: 'Failed to switch workspace',
        description: message,
        status: 'error',
        duration: 4000,
      });
    }
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        size="sm"
        variant="ghost"
        color="gray.600"
        rightIcon={<Icon as={FiChevronDown} />}
        leftIcon={<Icon as={FiBriefcase} />}
        _hover={{ color: 'brand.orange', bg: 'orange.50' }}
        maxWidth="200px"
      >
        <Text noOfLines={1}>
          {currentOrg?.name || 'Select Workspace'}
        </Text>
      </MenuButton>
      <MenuList minW="240px">
        {organizations.map((org) => (
          <MenuItem
            key={org._id}
            onClick={() => handleSwitch(org._id, org.name)}
            justifyContent="space-between"
            _hover={{ bg: 'orange.50' }}
          >
            <HStack spacing={3}>
              <Icon
                as={FiBriefcase}
                color={org._id === user.organizationId ? 'brand.orange' : 'gray.400'}
              />
              <Box>
                <Text fontWeight={org._id === user.organizationId ? 'bold' : 'normal'}>
                  {org.name}
                </Text>
                <Text fontSize="xs" color="gray.500" textTransform="capitalize">
                  {org.role}
                </Text>
              </Box>
            </HStack>
            {org._id === user.organizationId && <Icon as={FiCheck} color="brand.orange" />}
          </MenuItem>
        ))}

        <MenuDivider />

        {canCreateWorkspace ? (
          <Tooltip
            label={atWorkspaceLimit
              ? `Workspace limit reached (${organizations.length}/${maxWorkspaces}). Upgrade for more.`
              : undefined}
            isDisabled={!atWorkspaceLimit}
            hasArrow
            placement="bottom"
          >
            <Box>
              {atWorkspaceLimit ? (
                <Link href="/subscription" passHref>
                  <MenuItem
                    icon={<Icon as={FiPlus} />}
                    fontSize="sm"
                    color="gray.400"
                    _hover={{ bg: 'orange.50', color: 'brand.orange' }}
                  >
                    <HStack spacing={2} justify="space-between" w="100%">
                      <Text>Create Workspace</Text>
                      <Text fontSize="2xs" color="gray.400">
                        {organizations.length}/{maxWorkspaces}
                      </Text>
                    </HStack>
                  </MenuItem>
                </Link>
              ) : (
                <Link href="/settings/workspace/new" passHref>
                  <MenuItem
                    icon={<Icon as={FiPlus} />}
                    fontSize="sm"
                    color="gray.600"
                    _hover={{ bg: 'orange.50', color: 'brand.orange' }}
                  >
                    <HStack spacing={2} justify="space-between" w="100%">
                      <Text>Create Workspace</Text>
                      <Text fontSize="2xs" color="gray.400">
                        {organizations.length}/{maxWorkspaces}
                      </Text>
                    </HStack>
                  </MenuItem>
                </Link>
              )}
            </Box>
          </Tooltip>
        ) : (
          <Link href="/subscription" passHref>
            <MenuItem
              icon={<Icon as={FiArrowUpRight} />}
              fontSize="xs"
              color="gray.400"
              _hover={{ bg: 'orange.50', color: 'brand.orange' }}
            >
              Upgrade to add workspaces
            </MenuItem>
          </Link>
        )}
      </MenuList>
    </Menu>
  );
};
