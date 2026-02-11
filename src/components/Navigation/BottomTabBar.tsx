'use client';

/**
 * BottomTabBar
 *
 * Component Hierarchy:
 * App -> Layout -> BottomTabBar (this file)
 *
 * Native app-style bottom tab navigation for mobile member portal.
 * Visible only on base/sm breakpoints (<768px).
 * Follows iOS/Android tab bar patterns for thumb-friendly navigation.
 *
 * Design Decisions:
 * - Fixed to bottom viewport for persistent access
 * - 4-5 primary nav items (industry standard)
 * - Active state with brand color + subtle glow
 * - Safe area padding for notched devices
 * - Hidden on desktop (md+) where sidebar/top nav handles navigation
 */

import { type FC } from 'react';
import { Box, HStack, VStack, Text, Icon } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiSearch, FiEdit3, FiBarChart2, FiMessageCircle } from 'react-icons/fi';

interface TabItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const TAB_ITEMS: TabItem[] = [
  { label: 'Home', path: '/dashboard', icon: FiHome },
  { label: 'Keywords', path: '/keywords', icon: FiSearch },
  { label: 'Studio', path: '/studio', icon: FiEdit3 },
  { label: 'Insights', path: '/studio/insights', icon: FiBarChart2 },
  { label: 'Ask Phoo', path: '/assistant', icon: FiMessageCircle },
];

export const BottomTabBar: FC = () => {
  const pathname = usePathname();

  return (
    <Box
      display={{ base: 'block', md: 'none' }}
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      zIndex={1100}
      bg="rgba(13, 13, 13, 0.95)"
      backdropFilter="blur(20px)"
      borderTop="1px solid rgba(255, 255, 255, 0.08)"
      pb="env(safe-area-inset-bottom)"
    >
      <HStack
        justify="space-around"
        align="center"
        h="56px"
        px={2}
        maxW="container.sm"
        mx="auto"
        role="tablist"
        aria-label="Primary navigation"
      >
        {TAB_ITEMS.map((tab) => {
          const isActive =
            pathname === tab.path ||
            (tab.path !== '/dashboard' && pathname?.startsWith(tab.path + '/'));

          return (
            <Link key={tab.path} href={tab.path} style={{ textDecoration: 'none', flex: 1 }}>
              <VStack
                spacing={0.5}
                align="center"
                py={1}
                minH="44px"
                justify="center"
                color={isActive ? '#FF9D00' : 'gray.500'}
                transition="all 0.15s ease"
                _hover={{ color: isActive ? '#FF9D00' : 'gray.300' }}
                role="tab"
                aria-selected={isActive}
              >
                <Icon
                  as={tab.icon}
                  boxSize={5}
                  filter={isActive ? 'drop-shadow(0 0 6px rgba(255, 157, 0, 0.5))' : 'none'}
                />
                <Text
                  fontSize="10px"
                  fontWeight={isActive ? 'bold' : 'medium'}
                  lineHeight="1"
                  letterSpacing="0.02em"
                >
                  {tab.label}
                </Text>
              </VStack>
            </Link>
          );
        })}
      </HStack>
    </Box>
  );
};
