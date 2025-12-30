'use client';

/**
 * StudioSidebar
 *
 * Component Hierarchy:
 * App → StudioLayout → StudioSidebar
 *
 * Futuristic dark sidebar with glowing icons for Content Studio navigation.
 * Inspired by Twitch Creator Dashboard.
 */

import { Box, VStack, Icon, Text, Tooltip, Spacer, Divider } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  FiHome,
  FiFolder,
  FiPlusCircle,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiCalendar,
  FiTarget,
} from 'react-icons/fi';

interface Props {
  collapsed?: boolean;
}

interface NavItem {
  href: string;
  label: string;
  icon: typeof FiHome;
}

const navItems: NavItem[] = [
  { href: '/studio', label: 'Home', icon: FiHome },
  { href: '/strategy', label: 'Strategy', icon: FiTarget }, // Planning tab
  { href: '/studio/calendar', label: 'Calendar', icon: FiCalendar },
  { href: '/studio/library', label: 'Library', icon: FiFolder },
  { href: '/studio/create', label: 'Create', icon: FiPlusCircle },
  { href: '/studio/insights', label: 'Insights', icon: FiBarChart2 },
  { href: '/studio/settings', label: 'Settings', icon: FiSettings },
];

export function StudioSidebar({ collapsed = false }: Props) {
  const pathname = usePathname();

  return (
    <Box
      as="nav"
      w={collapsed ? '64px' : '200px'}
      minH="100vh"
      bg="rgba(13, 13, 13, 0.95)"
      borderRight="1px solid rgba(255, 255, 255, 0.08)"
      backdropFilter="blur(20px)"
      py={6}
      transition="width 0.2s ease"
      display="flex"
      flexDirection="column"
    >
      {/* Logo/Brand */}
      <Box px={4} mb={8}>
        <Text
          fontSize={collapsed ? 'sm' : 'lg'}
          fontWeight="bold"
          bgGradient="linear(to-r, #FF9D00, #FF6B00)"
          bgClip="text"
          textAlign={collapsed ? 'center' : 'left'}
        >
          {collapsed ? 'CS' : 'Content Studio'}
        </Text>
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
                <Box
                  display="flex"
                  alignItems="center"
                  gap={3}
                  px={3}
                  py={3}
                  borderRadius="12px"
                  cursor="pointer"
                  bg={isActive ? 'rgba(255, 157, 0, 0.15)' : 'transparent'}
                  color={isActive ? '#FF9D00' : 'gray.400'}
                  boxShadow={isActive ? '0 0 20px rgba(255, 157, 0, 0.2)' : 'none'}
                  _hover={{
                    bg: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                  }}
                  transition="all 0.2s ease"
                >
                  <Icon
                    as={item.icon}
                    boxSize={5}
                    filter={isActive ? 'drop-shadow(0 0 8px rgba(255, 157, 0, 0.5))' : 'none'}
                  />
                  {!collapsed && (
                    <Text fontSize="sm" fontWeight={isActive ? 'semibold' : 'medium'}>
                      {item.label}
                    </Text>
                  )}
                </Box>
              </Link>
            </Tooltip>
          );
        })}
      </VStack>

      {/* Exit Link */}
      <Box px={2} pt={4}>
        <Divider borderColor="rgba(255, 255, 255, 0.08)" mb={4} />
        <Tooltip label="Exit to Dashboard" placement="right" isDisabled={!collapsed} hasArrow>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <Box
              display="flex"
              alignItems="center"
              gap={3}
              px={3}
              py={3}
              borderRadius="12px"
              cursor="pointer"
              color="gray.500"
              _hover={{
                bg: 'rgba(255, 255, 255, 0.05)',
                color: 'gray.300',
              }}
              transition="all 0.2s ease"
            >
              <Icon as={FiLogOut} boxSize={5} />
              {!collapsed && (
                <Text fontSize="sm" fontWeight="medium">
                  Exit Studio
                </Text>
              )}
            </Box>
          </Link>
        </Tooltip>
      </Box>
    </Box>
  );
}
