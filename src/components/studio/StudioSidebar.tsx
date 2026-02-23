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

import { Box, Flex, VStack, Text, Icon, Tooltip, Divider } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiFileText,
  FiBook,
  FiCalendar,
  FiPlusCircle,
  FiTarget,
  FiLogOut,
  FiBarChart2,
  FiHome,
  FiMessageCircle,
} from 'react-icons/fi';
import { STUDIO_COLORS, STUDIO_GRADIENTS } from '@/lib/constants/studioTokens';

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
}

import { UserDropdown } from '../Navigation/UserDropdown';

export function StudioSidebar({ collapsed = false }: Props) {
  const pathname = usePathname();

  return (
    <Box
      as="nav"
      w={collapsed ? '64px' : '200px'}
      minH="100vh"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      py={6}
      transition="width 0.2s ease"
      display={{ base: 'none', md: 'flex' }}
      flexDirection="column"
    >
      {/* Logo/Brand */}
      <Box px={4} mb={8}>
        <Link href="/studio" style={{ textDecoration: 'none', display: 'block' }}>
          <Text
            fontSize={collapsed ? 'sm' : 'lg'}
            fontWeight="bold"
            bgGradient="linear(to-r, #FF9D00, #FF6B00)"
            bgClip="text"
            textAlign={collapsed ? 'center' : 'left'}
          >
            {collapsed ? 'CS' : 'Content Studio'}
          </Text>
        </Link>
      </Box>

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

      {/* Ask Phoo & Profile */}
      <Box px={2} pt={4} pb={4}>
        <Divider borderColor="gray.200" mb={4} />

        {/* Ask Phoo Link */}
        <Tooltip label="Ask Phoo" placement="right" isDisabled={!collapsed} hasArrow>
          <Link
            href="/assistant"
            style={{ textDecoration: 'none', display: 'block', marginBottom: '8px' }}
          >
            <Flex
              align="center"
              gap={3}
              px={3}
              py={3}
              borderRadius="12px"
              cursor="pointer"
              color="gray.600"
              _hover={{
                bg: 'orange.50',
                color: 'brand.orange',
              }}
              transition="all 0.2s ease"
            >
              <Icon as={FiMessageCircle} boxSize={5} />
              {!collapsed && (
                <Text fontSize="sm" fontWeight="medium">
                  Ask Phoo
                </Text>
              )}
            </Flex>
          </Link>
        </Tooltip>

        {/* User Profile Hook */}
        <Box px={collapsed ? 0 : 2} mt={2}>
          <Flex align="center" gap={3} justifyContent={collapsed ? 'center' : 'flex-start'} py={1}>
            <UserDropdown />
            {!collapsed && (
              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Account
                </Text>
              </Box>
            )}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
