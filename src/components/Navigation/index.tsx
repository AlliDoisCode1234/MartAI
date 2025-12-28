'use client';

/**
 * Navigation Component
 *
 * Component Hierarchy:
 * App → Layout → Navigation (this file)
 *   └── UserDropdown
 *
 * Features:
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

// Nav item with phase gating
interface NavItem {
  label: string;
  path: string;
  minPhase?: UserPhase; // Minimum phase required to access
}

// Public navigation (not logged in)
const publicNavItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Pricing', path: '/pricing' },
];

// User navigation (logged in, non-admin) - all pages accessible for exploration
const userNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Strategy', path: '/strategy' },
  { label: 'Calendar', path: '/calendar' },
  { label: 'Content', path: '/content' },
  { label: 'Integrations', path: '/integrations' },
];

// Admin navigation (logged in, admin)
const adminNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Strategy', path: '/strategy' },
  { label: 'Calendar', path: '/calendar' },
  { label: 'Content', path: '/content' },
  { label: 'Integrations', path: '/integrations' },
  { label: 'Admin', path: '/admin' },
];

export const Navigation: FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { projectId } = useProject(null, { autoSelect: true });
  const { phase, isRouteAvailable, hasCompletedFirstProject, phaseInfo } = useUserPhase({
    projectId: projectId as Id<'projects'> | null,
  });

  // Hide navigation completely on onboarding and auth pages
  const hiddenRoutes = ['/onboarding', '/auth/signup', '/auth/login'];
  if (hiddenRoutes.some((route) => pathname?.startsWith(route))) {
    return null;
  }

  // Determine which nav items to show
  let navItems: NavItem[] = publicNavItems;
  if (isAuthenticated && user) {
    const isAdmin = user.role === 'admin' || user.role === 'super_admin';
    // Admins get full access, users get phase-gated access
    navItems = isAdmin ? adminNavItems : userNavItems;
  }

  // Check if a nav item is locked (phase gating)
  const isItemLocked = (item: NavItem): boolean => {
    // Admins bypass phase gating
    if (user?.role === 'admin' || user?.role === 'super_admin') return false;
    // DIY mode (completed first project) = all unlocked
    if (hasCompletedFirstProject) return false;
    // Check phase requirement
    return !isRouteAvailable(item.path);
  };

  // Get tooltip for locked items
  const getLockedTooltip = (item: NavItem): string => {
    if (!item.minPhase) return '';
    const phaseName = phaseInfo.name;
    return `Complete ${phaseName} phase to unlock`;
  };

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
              const NavElement = (
                <Box
                  as="span"
                  color={locked ? 'gray.300' : pathname === item.path ? 'brand.orange' : 'gray.600'}
                  fontWeight={pathname === item.path ? 'semibold' : 'normal'}
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
