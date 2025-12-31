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
import { Box, HStack, Text, Button, Tooltip } from '@chakra-ui/react';
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

// Public navigation (not logged in) - Logo links to home, so no "Home" item needed
const publicNavItems: NavItem[] = [
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Pricing', path: '/pricing' },
];

// User navigation (logged in)
const userNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Keywords', path: '/keywords' },
  { label: 'Content Studio', path: '/studio' },
  { label: 'Integrations', path: '/integrations' },
];

// Admin navigation (includes Admin portal link)
const adminNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Keywords', path: '/keywords' },
  { label: 'Content Studio', path: '/studio' },
  { label: 'Integrations', path: '/integrations' },
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
    navItems = isAdmin ? adminNavItems : userNavItems;
  }

  // Check if a nav item is locked (phase gating)
  // Public routes (/, /pricing) are never locked
  const isItemLocked = (item: NavItem): boolean => {
    // Public routes never locked
    const publicPaths = ['/', '/pricing', '/how-it-works', '/home', '/about'];
    if (publicPaths.includes(item.path)) return false;

    // Admins never locked
    if (user?.role === 'admin' || user?.role === 'super_admin') return false;

    // After completing first project, nothing locked
    if (hasCompletedFirstProject) return false;

    // Otherwise check phase gating
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
              <Text fontSize="lg" fontWeight="bold" color="brand.orange">
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
                  color={locked ? 'gray.300' : 'brand.orange'}
                  fontWeight={isActive ? 'bold' : 'medium'}
                  _hover={locked ? {} : { opacity: 0.8 }}
                  cursor={locked ? 'not-allowed' : 'pointer'}
                  transition="all 0.2s"
                  opacity={locked ? 0.5 : isActive ? 1 : 0.85}
                  display={{ base: 'none', md: 'inline' }}
                  position="relative"
                  _after={
                    isActive
                      ? {
                          content: '""',
                          position: 'absolute',
                          bottom: '-6px',
                          left: 0,
                          right: 0,
                          height: '2px',
                          bg: 'brand.orange',
                          borderRadius: 'full',
                        }
                      : {}
                  }
                >
                  {item.label}
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
