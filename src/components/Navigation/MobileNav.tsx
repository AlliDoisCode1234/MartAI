'use client';

/**
 * MobileNav
 *
 * Component Hierarchy:
 * App -> Layout -> Navigation -> MobileNav (this file)
 *
 * Slide-out drawer for mobile navigation. Used in both member and admin portals.
 * Contains nav items, user info, and close trigger.
 * Renders only on mobile (base/sm breakpoints).
 */

import { type FC } from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  HStack,
  Text,
  Icon,
  Box,
  Divider,
  Avatar,
} from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';

interface NavItem {
  label: string;
  path: string;
  icon?: React.ElementType;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  brandLabel?: string;
  brandColor?: string;
  placement?: 'left' | 'right';
  variant?: 'dark' | 'light';
  user?: {
    name?: string;
    email?: string;
    image?: string;
  } | null;
}

export const MobileNav: FC<Props> = ({
  isOpen,
  onClose,
  navItems,
  brandLabel = 'Phoo',
  brandColor = 'brand.orange',
  placement = 'left',
  variant = 'dark',
  user,
}) => {
  const pathname = usePathname();

  // Derive active state colors from brand
  const isPurple = brandColor === 'purple.400';
  const activeColor = isPurple ? '#a78bfa' : '#FF9D00';
  const activeBg = isPurple
    ? 'rgba(167, 139, 250, 0.12)'
    : variant === 'light'
      ? 'rgba(255, 157, 0, 0.08)'
      : 'rgba(255, 157, 0, 0.12)';

  // Theme tokens
  const isLight = variant === 'light';
  const drawerBg = isLight ? 'white' : 'rgba(13, 13, 13, 0.98)';
  const borderColor = isLight ? 'gray.200' : 'rgba(255, 255, 255, 0.08)';
  const closeBtnColor = isLight ? 'gray.500' : 'gray.400';
  const closeBtnHover = isLight ? 'gray.800' : 'white';
  const itemColor = isLight ? 'gray.600' : 'gray.400';
  const itemHoverBg = isLight ? 'orange.50' : 'rgba(255, 255, 255, 0.05)';
  const itemHoverColor = isLight ? 'gray.800' : 'white';
  const borderSide = placement === 'right' ? 'borderLeft' : 'borderRight';
  const activeBorderSide = placement === 'right' ? 'borderRight' : 'borderLeft';
  const activeBorderNone = placement === 'right' ? 'borderLeft' : 'borderRight';

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement={placement} size="xs">
      <DrawerOverlay bg="blackAlpha.500" backdropFilter="blur(4px)" />
      <DrawerContent
        bg={drawerBg}
        {...{ [borderSide]: `1px solid` }}
        borderColor={borderColor}
        maxW="280px"
      >
        <DrawerCloseButton color={closeBtnColor} _hover={{ color: closeBtnHover }} />

        <DrawerHeader borderBottomWidth="1px" borderColor={borderColor} pb={4}>
          <Text
            fontSize="xl"
            fontWeight="bold"
            bgGradient={
              brandColor === 'purple.400'
                ? 'linear(to-r, #a78bfa, #8b5cf6)'
                : 'linear(to-r, #FF9D00, #FF6B00)'
            }
            bgClip="text"
          >
            {brandLabel}
          </Text>
        </DrawerHeader>

        <DrawerBody px={0} py={4}>
          <VStack align="stretch" spacing={1}>
            {navItems.map((item) => {
              const isActive =
                pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  style={{ textDecoration: 'none' }}
                  onClick={onClose}
                >
                  <HStack
                    px={6}
                    py={3}
                    spacing={3}
                    bg={isActive ? activeBg : 'transparent'}
                    color={isActive ? activeColor : itemColor}
                    {...{
                      [activeBorderSide]: isActive
                        ? `3px solid ${activeColor}`
                        : '3px solid transparent',
                      [activeBorderNone]: '3px solid transparent',
                    }}
                    _hover={{
                      bg: itemHoverBg,
                      color: itemHoverColor,
                    }}
                    transition="all 0.15s ease"
                    minH="48px"
                  >
                    {item.icon && <Icon as={item.icon} boxSize={5} />}
                    <Text fontSize="sm" fontWeight={isActive ? 'semibold' : 'medium'}>
                      {item.label}
                    </Text>
                  </HStack>
                </Link>
              );
            })}
          </VStack>

          {user && (
            <>
              <Divider borderColor={borderColor} my={4} />
              <HStack px={6} py={2} spacing={3}>
                <Avatar
                  size="sm"
                  name={user.name || user.email || ''}
                  src={user.image || undefined}
                />
                <Box>
                  <Text
                    fontSize="sm"
                    color={isLight ? 'gray.700' : 'gray.300'}
                    fontWeight="medium"
                    noOfLines={1}
                  >
                    {user.name || 'User'}
                  </Text>
                  <Text fontSize="xs" color="gray.500" noOfLines={1}>
                    {user.email}
                  </Text>
                </Box>
              </HStack>
            </>
          )}

          {user && (
            <>
              <Divider borderColor={borderColor} my={4} />

              <Link href="/dashboard" style={{ textDecoration: 'none' }} onClick={onClose}>
                <HStack
                  px={6}
                  py={3}
                  spacing={3}
                  color="gray.500"
                  _hover={{ bg: itemHoverBg, color: isLight ? 'gray.700' : 'gray.300' }}
                  transition="all 0.15s ease"
                  minH="48px"
                >
                  <Icon as={FiArrowLeft} boxSize={5} />
                  <Text fontSize="sm" fontWeight="medium">
                    Back to Dashboard
                  </Text>
                </HStack>
              </Link>
            </>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
