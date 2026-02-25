'use client';

/**
 * StudioSidebar
 *
 * Component Hierarchy:
 * App → StudioLayout → StudioSidebar
 *
 * Primary navigation for the Content Studio.
 * Dark, futuristic sidebar with glowing amber accents,
 * purple-tinted glass, and animated hover effects.
 */

import { Box, Flex, VStack, Text, Icon, Tooltip, Divider, IconButton } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiFileText,
  FiBook,
  FiCalendar,
  FiPlusCircle,
  FiTarget,
  FiBarChart2,
  FiHome,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { STUDIO_COLORS } from '@/lib/constants/studioTokens';
import { useAuth } from '@/lib/useAuth';
import { getUserDisplayName } from '@/lib/funNames';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType;
}

const navItems: NavItem[] = [
  { href: '/studio', label: 'Dashboard', icon: FiHome },
  { href: '/studio/library', label: 'Library', icon: FiFileText },
  { href: '/studio/insights', label: 'Insights', icon: FiBarChart2 },
  { href: '/studio/keywords', label: 'Keywords', icon: FiBook },
  { href: '/studio/calendar', label: 'Calendar', icon: FiCalendar },
  { href: '/studio/create', label: 'Create', icon: FiPlusCircle },
  { href: '/studio/brand-profile', label: 'Brand Profile', icon: FiTarget },
];

interface Props {
  collapsed?: boolean;
  onToggle?: () => void;
}

import { UserDropdown } from '../Navigation/UserDropdown';

export function StudioSidebar({ collapsed = false, onToggle }: Props) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <Box
      as="nav"
      w={collapsed ? '64px' : '200px'}
      h="100vh"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      py={6}
      transition="width 0.2s ease"
      display={{ base: 'none', md: 'flex' }}
      flexDirection="column"
    >
      {/* Brand & Toggle */}
      <Flex px={collapsed ? 2 : 4} mb={8} justify="space-between" align="center" h="32px">
        {!collapsed && (
          <Link href="/studio" style={{ textDecoration: 'none' }}>
            <Text fontSize="xl" fontWeight="bold" color="brand.orange" pl={2}>
              Phoo
            </Text>
          </Link>
        )}
        {onToggle && (
          <IconButton
            aria-label="Toggle Sidebar"
            icon={<Icon as={collapsed ? FiChevronRight : FiChevronLeft} boxSize={5} />}
            size="sm"
            variant="ghost"
            onClick={onToggle}
            color="gray.500"
            _hover={{ bg: 'orange.50', color: 'brand.orange' }}
            ml={collapsed ? 0 : 'auto'}
            mx={collapsed ? 'auto' : 0}
          />
        )}
      </Flex>

      {/* Navigation */}
      <VStack spacing={1} align="stretch" px={2} flex={1}>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/studio' && pathname.startsWith(item.href));

          return (
            <Tooltip
              key={item.href}
              label={item.label}
              placement="right"
              isDisabled={!collapsed}
              hasArrow
            >
              <Link href={item.href} style={{ textDecoration: 'none' }}>
                <Flex
                  align="center"
                  gap={3}
                  px={3}
                  py={3}
                  borderRadius="12px"
                  cursor="pointer"
                  position="relative"
                  bg={isActive ? 'orange.50' : 'transparent'}
                  color={isActive ? 'brand.orange' : 'gray.600'}
                  borderLeft={
                    isActive
                      ? `3px solid var(--chakra-colors-brand-orange)`
                      : '3px solid transparent'
                  }
                  _hover={{
                    bg: 'orange.50',
                    color: 'gray.900',
                  }}
                  _focusVisible={{
                    outline: '2px solid',
                    outlineColor: 'brand.orange',
                    outlineOffset: '2px',
                  }}
                  transition="all 0.2s ease"
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon as={item.icon} boxSize={5} />
                  {!collapsed && (
                    <Text fontSize="sm" fontWeight={isActive ? 'semibold' : 'medium'}>
                      {item.label}
                    </Text>
                  )}
                </Flex>
              </Link>
            </Tooltip>
          );
        })}
      </VStack>

      {/* Profile */}
      <Box px={2} pt={4} pb={2}>
        <Divider borderColor="gray.200" mb={4} />

        {/* User Profile Hook */}
        <Box px={collapsed ? 0 : 2} mt={2}>
          <Flex align="center" gap={3} justifyContent={collapsed ? 'center' : 'flex-start'} py={1}>
            <UserDropdown />
            {!collapsed && user && (
              <Box>
                <Text fontSize="sm" fontWeight="semibold" color="gray.700" noOfLines={1}>
                  {getUserDisplayName(user)}
                </Text>
              </Box>
            )}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
