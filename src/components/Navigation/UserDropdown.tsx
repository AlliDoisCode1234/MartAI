'use client';

import { type FC } from 'react';
import { Menu, MenuButton, MenuList, MenuItem, MenuDivider, Avatar, Icon } from '@chakra-ui/react';
import { FiUser, FiSettings, FiCreditCard, FiShield, FiLogOut } from 'react-icons/fi';
import Link from 'next/link';
import { useAuth } from '@/lib/useAuth';
import { getUserDisplayName, getInitials } from '@/lib/funNames';

export const UserDropdown: FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const isAdmin = user.role === 'admin' || user.role === 'super_admin';
  const displayName = getUserDisplayName(user);
  const initials = getInitials(displayName);

  return (
    <Menu>
      <MenuButton>
        <Avatar
          size="sm"
          bg="brand.orange"
          color="white"
          fontWeight="bold"
          cursor="pointer"
          _hover={{ transform: 'scale(1.05)', boxShadow: 'md' }}
          transition="all 0.2s"
        >
          {initials}
        </Avatar>
      </MenuButton>
      <MenuList>
        <MenuItem as={Link} href="/profile" icon={<Icon as={FiUser} />}>
          Profile
        </MenuItem>
        <MenuItem as={Link} href="/settings" icon={<Icon as={FiSettings} />}>
          Settings
        </MenuItem>
        <MenuItem as={Link} href="/subscription" icon={<Icon as={FiCreditCard} />}>
          Billing
        </MenuItem>
        {isAdmin && (
          <>
            <MenuDivider />
            <MenuItem as={Link} href="/admin" icon={<Icon as={FiShield} />} color="blue.600">
              Admin Portal
            </MenuItem>
          </>
        )}
        <MenuDivider />
        <MenuItem icon={<Icon as={FiLogOut} />} onClick={logout} color="red.500">
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
