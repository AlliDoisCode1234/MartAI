'use client';

/**
 * StudioSidebar
 *
 * Component Hierarchy:
 * App → StudioLayout → StudioSidebar
 *
 * Primary navigation for the Content Studio.
 * Dark navy sidebar matching the product mockup shown on the marketing page.
 * Features: warm navy background, flame brand icon, rounded pill active state,
 * bottom settings section with user profile.
 */

import {
  Box,
  Flex,
  VStack,
  Text,
  Icon,
  Tooltip,
  Divider,
  IconButton,
  Avatar,
} from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  FiGrid,
  FiFileText,
  FiCalendar,
  FiPlusCircle,
  FiSearch,
  FiBarChart2,
  FiChevronLeft,
  FiChevronRight,
  FiSettings,
  FiUser,
  FiTarget,
} from 'react-icons/fi';
import { IoFlame } from 'react-icons/io5';
import { useAuth } from '@/lib/useAuth';
import { getUserDisplayName } from '@/lib/funNames';
import { UserDropdown } from '../Navigation/UserDropdown';
import { STUDIO_COLORS } from '@/lib/constants/studioTokens';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType;
  children?: { href: string; label: string; status?: string }[];
}

const navItems: NavItem[] = [
  { href: '/studio', label: 'Dashboard', icon: FiGrid },
  { href: '/studio/insights', label: 'Analytics', icon: FiBarChart2 },
  {
    href: '/studio/library',
    label: 'Library',
    icon: FiFileText,
    children: [
      { href: '/studio/library', label: 'All Articles', status: 'all' },
      { href: '/studio/library?status=draft', label: 'Drafts', status: 'draft' },
      { href: '/studio/library?status=scheduled', label: 'Scheduled', status: 'scheduled' },
      { href: '/studio/library?status=published', label: 'Published', status: 'published' },
    ],
  },
  { href: '/studio/keywords', label: 'Keywords', icon: FiSearch },
  { href: '/studio/calendar', label: 'Calendar', icon: FiCalendar },
  { href: '/studio/create', label: 'Create', icon: FiPlusCircle },
  { href: '/studio/brand-profile', label: 'Brand Profile', icon: FiTarget },
];

const bottomNavItems: NavItem[] = [
  { href: '/studio/brand-profile', label: 'Settings', icon: FiSettings },
  { href: '/settings/profile', label: 'User Profile', icon: FiUser },
];

interface Props {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function StudioSidebar({ collapsed = false, onToggle }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const isActive = (href: string) =>
    pathname === href || (href !== '/studio' && pathname.startsWith(href));

  return (
    <Box
      as="nav"
      w={collapsed ? '68px' : '220px'}
      h="100vh"
      bg={STUDIO_COLORS.sidebarBg}
      py={5}
      transition="width 0.2s ease"
      display={{ base: 'none', md: 'flex' }}
      flexDirection="column"
      borderRight="1px solid"
      borderColor="rgba(255,255,255,0.06)"
    >
      {/* Brand & Toggle */}
      <Flex px={collapsed ? 2 : 5} mb={6} justify="space-between" align="center" h="36px">
        {!collapsed && (
          <Link href="/studio" style={{ textDecoration: 'none' }}>
            <Flex align="center" gap={2}>
              <Icon as={IoFlame} boxSize={5} color="brand.orange" />
              <Text fontSize="xl" fontWeight="bold" color="white" letterSpacing="-0.02em">
                Phoo
              </Text>
            </Flex>
          </Link>
        )}
        {collapsed && (
          <Flex justify="center" w="full">
            <Icon as={IoFlame} boxSize={5} color="brand.orange" />
          </Flex>
        )}
        {onToggle && !collapsed && (
          <IconButton
            aria-label="Toggle Sidebar"
            icon={<Icon as={FiChevronLeft} boxSize={4} />}
            size="xs"
            variant="ghost"
            onClick={onToggle}
            color="whiteAlpha.500"
            _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
          />
        )}
        {onToggle && collapsed && (
          <IconButton
            aria-label="Toggle Sidebar"
            icon={<Icon as={FiChevronRight} boxSize={4} />}
            size="xs"
            variant="ghost"
            onClick={onToggle}
            color="whiteAlpha.500"
            _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
            position="absolute"
            right="-12px"
            top="18px"
            bg={STUDIO_COLORS.sidebarBg}
            borderRadius="full"
            border="1px solid"
            borderColor="whiteAlpha.100"
            zIndex={10}
          />
        )}
      </Flex>

      {/* Main Navigation */}
      <VStack spacing={0.5} align="stretch" px={3} flex={1}>
        {navItems.map((item) => {
          const active = isActive(item.href);

          return (
            <Box key={item.href}>
              <Tooltip
                label={item.label}
                placement="right"
                isDisabled={!collapsed}
                hasArrow
                bg="gray.900"
                color="white"
                fontSize="xs"
              >
                <Link href={item.href} style={{ textDecoration: 'none' }}>
                  <Flex
                    align="center"
                    gap={3}
                    px={3}
                    py={2.5}
                    borderRadius="10px"
                    cursor="pointer"
                    bg={active ? 'brand.orange' : 'transparent'}
                    color={active ? 'white' : 'whiteAlpha.600'}
                    fontWeight={active ? '600' : '400'}
                    _hover={{
                      bg: active ? 'brand.orange' : 'whiteAlpha.100',
                      color: 'white',
                    }}
                    _focusVisible={{
                      outline: '2px solid',
                      outlineColor: 'brand.orange',
                      outlineOffset: '2px',
                    }}
                    transition="all 0.15s ease"
                    aria-current={active ? 'page' : undefined}
                    justifyContent={collapsed ? 'center' : 'flex-start'}
                  >
                    <Icon as={item.icon} boxSize={collapsed ? 5 : '18px'} flexShrink={0} />
                    {!collapsed && (
                      <Text fontSize="sm" lineHeight="1">
                        {item.label}
                      </Text>
                    )}
                  </Flex>
                </Link>
              </Tooltip>

              {/* Sub-items: visible when parent is active and sidebar is expanded */}
              {item.children && active && !collapsed && (
                <VStack spacing={0} align="stretch" pl={7} mt={0.5}>
                  {item.children.map((child) => {
                    const currentStatus = searchParams.get('status') || 'all';
                    const childActive =
                      pathname === '/studio/library' && currentStatus === (child.status || 'all');

                    return (
                      <Link key={child.label} href={child.href} style={{ textDecoration: 'none' }}>
                        <Flex
                          align="center"
                          px={3}
                          py={1.5}
                          borderRadius="8px"
                          cursor="pointer"
                          color={childActive ? 'white' : 'whiteAlpha.500'}
                          fontWeight={childActive ? '600' : '400'}
                          bg={childActive ? 'whiteAlpha.100' : 'transparent'}
                          _hover={{
                            bg: 'whiteAlpha.100',
                            color: 'whiteAlpha.800',
                          }}
                          transition="all 0.15s ease"
                          fontSize="13px"
                        >
                          <Box
                            w="4px"
                            h="4px"
                            borderRadius="full"
                            bg={childActive ? 'brand.orange' : 'whiteAlpha.300'}
                            mr={2.5}
                            flexShrink={0}
                          />
                          <Text lineHeight="1">{child.label}</Text>
                        </Flex>
                      </Link>
                    );
                  })}
                </VStack>
              )}
            </Box>
          );
        })}
      </VStack>

      {/* Bottom Section */}
      <Box px={3}>
        <Divider borderColor="whiteAlpha.100" mb={3} />

        {/* Bottom Nav Items */}
        <VStack spacing={0.5} align="stretch" mb={3}>
          {bottomNavItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Tooltip
                key={item.label}
                label={item.label}
                placement="right"
                isDisabled={!collapsed}
                hasArrow
                bg="gray.900"
                color="white"
                fontSize="xs"
              >
                <Link href={item.href} style={{ textDecoration: 'none' }}>
                  <Flex
                    align="center"
                    gap={3}
                    px={3}
                    py={2}
                    borderRadius="10px"
                    cursor="pointer"
                    color="whiteAlpha.500"
                    _hover={{
                      bg: 'whiteAlpha.100',
                      color: 'whiteAlpha.800',
                    }}
                    transition="all 0.15s ease"
                    justifyContent={collapsed ? 'center' : 'flex-start'}
                  >
                    <Icon as={item.icon} boxSize={collapsed ? 5 : '18px'} flexShrink={0} />
                    {!collapsed && (
                      <Text fontSize="sm" lineHeight="1">
                        {item.label}
                      </Text>
                    )}
                  </Flex>
                </Link>
              </Tooltip>
            );
          })}
        </VStack>

        {/* User Profile */}
        <UserDropdown
          triggerElement={
            <Flex
              align="center"
              gap={3}
              px={2}
              py={2}
              borderRadius="10px"
              cursor="pointer"
              _hover={{ bg: 'whiteAlpha.100' }}
              transition="all 0.15s ease"
              justifyContent={collapsed ? 'center' : 'flex-start'}
              w="full"
            >
              <Avatar
                size="sm"
                name={user ? getUserDisplayName(user) : ''}
                src={user?.image ?? undefined}
                bg="brand.orange"
                color="white"
                fontWeight="bold"
              />
              {!collapsed && user && (
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color="whiteAlpha.700"
                  noOfLines={1}
                  flex={1}
                  minW={0}
                >
                  {getUserDisplayName(user)}
                </Text>
              )}
            </Flex>
          }
        />
      </Box>
    </Box>
  );
}
