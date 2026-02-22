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
  FiSettings,
  FiLogOut,
  FiBarChart2,
} from 'react-icons/fi';
import { STUDIO_COLORS, STUDIO_GRADIENTS } from '@/lib/constants/studioTokens';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType;
}

const navItems: NavItem[] = [
  { href: '/studio/library', label: 'Library', icon: FiFileText },
  { href: '/studio/insights', label: 'Insights', icon: FiBarChart2 },
  { href: '/studio/keywords', label: 'Keywords', icon: FiBook },
  { href: '/studio/calendar', label: 'Calendar', icon: FiCalendar },
  { href: '/studio/create', label: 'Create', icon: FiPlusCircle },
  { href: '/studio/settings', label: 'Settings', icon: FiSettings },
];

interface Props {
  collapsed?: boolean;
}

export function StudioSidebar({ collapsed = false }: Props) {
  const pathname = usePathname();

  return (
    <Box
      as="nav"
      w={collapsed ? '64px' : '200px'}
      minH="100vh"
      bg={STUDIO_COLORS.sidebarBg}
      borderRight="1px solid"
      borderColor={STUDIO_COLORS.subtleBorder}
      backdropFilter="blur(20px)"
      py={6}
      transition="width 0.2s ease"
      display={{ base: 'none', md: 'flex' }}
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
                <Flex
                  align="center"
                  gap={3}
                  px={3}
                  py={3}
                  borderRadius="12px"
                  cursor="pointer"
                  position="relative"
                  bg={isActive ? STUDIO_GRADIENTS.sidebarActive : 'transparent'}
                  color={isActive ? STUDIO_COLORS.amber : 'gray.400'}
                  borderLeft={
                    isActive ? `2px solid ${STUDIO_COLORS.amber}` : '2px solid transparent'
                  }
                  boxShadow={isActive ? `0 0 20px rgba(255, 157, 0, 0.15)` : 'none'}
                  _hover={{
                    bg: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                  }}
                  _focusVisible={{
                    outline: '2px solid',
                    outlineColor: STUDIO_COLORS.amber,
                    outlineOffset: '2px',
                  }}
                  transition="all 0.2s ease"
                  aria-current={isActive ? 'page' : undefined}
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
                </Flex>
              </Link>
            </Tooltip>
          );
        })}
      </VStack>

      {/* Exit Link */}
      <Box px={2} pt={4}>
        <Divider borderColor={STUDIO_COLORS.subtleBorder} mb={4} />
        <Tooltip label="Exit to Dashboard" placement="right" isDisabled={!collapsed} hasArrow>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <Flex
              align="center"
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
            </Flex>
          </Link>
        </Tooltip>
      </Box>
    </Box>
  );
}
