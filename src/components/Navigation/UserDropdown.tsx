'use client';

/**
 * UserDropdown
 *
 * Component Hierarchy:
 * App → StudioLayout → StudioSidebar → UserDropdown
 * App → Navigation → UserDropdown
 *
 * Dropdown menu for user actions: profile, settings, billing, logout.
 * Accepts an optional triggerElement to customize the menu button.
 */

import { type FC, type ReactElement } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Icon,
  Box,
} from '@chakra-ui/react';
import { FiUser, FiSettings, FiCreditCard, FiShield, FiLogOut, FiMessageSquare } from 'react-icons/fi';
import Link from 'next/link';
import { useAuth } from '@/lib/useAuth';
import { getUserDisplayName } from '@/lib/funNames';

interface Props {
  /** Optional custom trigger element. Defaults to the user avatar. */
  triggerElement?: ReactElement;
}

export const UserDropdown: FC<Props> = ({ triggerElement }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const isAdmin = user.role === 'admin' || user.role === 'super_admin';
  const displayName = getUserDisplayName(user);

  // Beta users don't see billing until their beta period expires
  const isActiveBetaUser = user.isBetaUser && user.betaExpiresAt && user.betaExpiresAt > Date.now();

  return (
    <Menu>
      {triggerElement ? (
        <MenuButton
          as={Box}
          cursor="pointer"
          display="inline-flex"
          role="button"
          tabIndex={0}
          aria-label="User menu"
        >
          {triggerElement}
        </MenuButton>
      ) : (
        <MenuButton>
          <Avatar
            size="sm"
            name={displayName}
            src={user.image ?? undefined}
            bg="brand.orange"
            color="white"
            fontWeight="bold"
            cursor="pointer"
            _hover={{ transform: 'scale(1.05)', boxShadow: 'md' }}
            transition="all 0.2s"
          />
        </MenuButton>
      )}
      <MenuList>
        <MenuItem as={Link} href="/profile" icon={<Icon as={FiUser} />}>
          Profile
        </MenuItem>
        <MenuItem as={Link} href="/settings" icon={<Icon as={FiSettings} />}>
          Settings
        </MenuItem>
        {!isActiveBetaUser && (
          <MenuItem as={Link} href="/subscription" icon={<Icon as={FiCreditCard} />}>
            Billing
          </MenuItem>
        )}
        {isActiveBetaUser && (
          <>
            <MenuDivider />
            <MenuItem as={Link} href="/studio/feedback" icon={<Icon as={FiMessageSquare} />} color="brand.orange">
              Give Feedback
            </MenuItem>
          </>
        )}
        {isAdmin && (
          <>
            <MenuDivider />
            <MenuItem as={Link} href="/admin" icon={<Icon as={FiShield} />} color="blue.600">
              Admin Portal
            </MenuItem>
          </>
        )}
        <MenuDivider />
        <MenuItem icon={<Icon as={FiLogOut} />} onClick={() => logout()} color="red.500">
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
