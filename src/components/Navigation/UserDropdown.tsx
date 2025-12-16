'use client';

import { type FC } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  HStack,
  VStack,
  Text,
  Icon,
} from '@chakra-ui/react';
import { FiUser, FiSettings, FiCreditCard, FiShield, FiLogOut } from 'react-icons/fi';
import Link from 'next/link';
import { useAuth } from '@/lib/useAuth';

export const UserDropdown: FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const isAdmin = user.role === 'admin' || user.role === 'super_admin';
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <Menu>
      <MenuButton>
        <HStack spacing={3} cursor="pointer" _hover={{ opacity: 0.8 }}>
          <Avatar size="sm" name={user.name} bg="brand.orange" color="white">
            {initials}
          </Avatar>
          <VStack align="start" spacing={0} display={{ base: 'none', md: 'flex' }}>
            <Text fontSize="sm" fontWeight="semibold" color="gray.700">
              {user.name}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {user.email}
            </Text>
          </VStack>
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuItem as={Link} href="/profile" icon={<Icon as={FiUser} />}>
          Profile
        </MenuItem>
        <MenuItem as={Link} href="/settings" icon={<Icon as={FiSettings} />}>
          Settings
        </MenuItem>
        <MenuItem as={Link} href="/settings/billing" icon={<Icon as={FiCreditCard} />}>
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
