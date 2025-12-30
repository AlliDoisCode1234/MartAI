'use client';

/**
 * Navigation Component
 *
 * Component Hierarchy:
 * App → Layout → Navigation (this file)
 *   └── UserDropdown
 *
 * Features:
 * - Context-aware rendering (minimal in Studio, full elsewhere)
 * - Phase-based route gating (UX-001)
 * - Admin route access
 * - Mobile responsive
 */

import { type FC } from 'react';
import { Box, HStack, Text, Button, Tooltip, Badge } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { useProject } from '@/lib/hooks/useProject';
import { useUserPhase, type UserPhase } from '@/lib/useUserPhase';
import type { Id } from '@/convex/_generated/dataModel';
import { UserDropdown } from './UserDropdown';
import { FiArrowLeft } from 'react-icons/fi';
import { Icon } from '@chakra-ui/react';

// Nav item with phase gating
interface NavItem {
  label: string;
  path: string;
  minPhase?: UserPhase;
}

// Public navigation (not logged in)
const publicNavItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Pricing', path: '/pricing' },
];

// User navigation (logged in, non-admin) - simplified for dashboard context
const dashboardNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Studio', path: '/studio' },
  { label: 'Settings', path: '/settings' },
];

// Admin navigation
const adminNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Studio', path: '/studio' },
  { label: 'Settings', path: '/settings' },
  { label: 'Admin', path: '/admin' },
];

export const Navigation: FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { projectId } = useProject(null, { autoSelect: true });
  const { hasCompletedFirstProject, phaseInfo, isRouteAvailable } = useUserPhase({
    projectId: projectId as Id<'projects'> | null,
  });

  // Hide navigation completely on onboarding and auth pages
  const hiddenRoutes = ['/onboarding', '/auth/signup', '/auth/login'];
  if (hiddenRoutes.some((route) => pathname?.startsWith(route))) {
    return null;
  }

  // Detect if we're in Studio context
  const isStudioContext = pathname?.startsWith('/studio');

  // Determine which nav items to show
  let navItems: NavItem[] = publicNavItems;
  if (isAuthenticated && user) {
    const isAdmin = user.role === 'admin' || user.role === 'super_admin';
    navItems = isAdmin ? adminNavItems : dashboardNavItems;
  }

  // Check if a nav item is locked (phase gating)
  const isItemLocked = (item: NavItem): boolean => {
    if (user?.role === 'admin' || user?.role === 'super_admin') return false;
    if (hasCompletedFirstProject) return false;
    return !isRouteAvailable(item.path);
  };

  // Get tooltip for locked items
  const getLockedTooltip = (item: NavItem): string => {
    if (!item.minPhase) return '';
    const phaseName = phaseInfo.name;
    return `Complete ${phaseName} phase to unlock`;
  };

  // STUDIO CONTEXT: Minimal dark top bar
  if (isStudioContext && isAuthenticated) {
    return (
      <Box
        bg="rgba(13, 13, 13, 0.98)"
        borderBottom="1px solid rgba(255, 255, 255, 0.08)"
        position="sticky"
        top={0}
        zIndex={1000}
        backdropFilter="blur(10px)"
      >
        <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }}>
          <HStack justify="space-between" h={14}>
            {/* Logo + Context indicator */}
            <HStack spacing={4}>
              <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                <HStack
                  spacing={2}
                  color="gray.400"
                  _hover={{ color: 'white' }}
                  transition="color 0.2s"
                >
                  <Icon as={FiArrowLeft} boxSize={4} />
                  <Text fontSize="sm" fontWeight="medium">
                    Exit
                  </Text>
                </HStack>
              </Link>
              <Box h={4} w="1px" bg="rgba(255, 255, 255, 0.1)" />
              <Text
                fontSize="lg"
                fontWeight="bold"
                bgGradient="linear(to-r, #FF9D00, #FF6B00)"
                bgClip="text"
              >
                Content Studio
              </Text>
            </HStack>

            {/* User menu */}
            <UserDropdown />
          </HStack>
        </Box>
      </Box>
    );
  }

  // DEFAULT CONTEXT: Full navigation
  return (
    <Box
      bg="white"
      shadow="sm"
      borderBottom="1px"
      borderColor="gray.200"
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }}>
        <HStack justify="space-between" h={16}>
          <Link href={isAuthenticated ? '/dashboard' : '/'} style={{ textDecoration: 'none' }}>
            <Text fontSize="xl" fontWeight="bold" color="brand.orange">
              Phoo
            </Text>
          </Link>
          <HStack spacing={8}>
            {navItems.map((item) => {
              const locked = isItemLocked(item);
              const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');

              const NavElement = (
                <Box
                  as="span"
                  color={locked ? 'gray.300' : isActive ? 'brand.orange' : 'gray.600'}
                  fontWeight={isActive ? 'semibold' : 'normal'}
                  _hover={locked ? {} : { color: 'brand.orange' }}
                  cursor={locked ? 'not-allowed' : 'pointer'}
                  transition="color 0.2s"
                  opacity={locked ? 0.5 : 1}
                  display={{
                    base: item.label === 'Home' || item.label === 'Dashboard' ? 'inline' : 'none',
                    md: 'inline',
                  }}
                >
                  {item.label}
                  {item.path === '/studio' && (
                    <Badge ml={2} colorScheme="orange" fontSize="xs" variant="subtle">
                      NEW
                    </Badge>
                  )}
                </Box>
              );

              if (locked) {
                return (
                  <Tooltip key={item.path} label={getLockedTooltip(item)} hasArrow>
                    {NavElement}
                  </Tooltip>
                );
              }

              return (
                <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
                  {NavElement}
                </Link>
              );
            })}
            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <HStack spacing={4}>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button bg="brand.orange" color="white" size="sm" _hover={{ bg: '#E8851A' }}>
                    Sign Up
                  </Button>
                </Link>
              </HStack>
            )}
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
};
