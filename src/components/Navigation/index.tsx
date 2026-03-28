'use client';

/**
 * Navigation Component
 *
 * Component Hierarchy:
 * App → Layout → Navigation (this file)
 *   ├── UserDropdown
 *   ├── MobileNav (hamburger drawer for mobile)
 *   └── BottomTabBar (tab bar for member portal mobile)
 *
 * Features:
 * - Context-aware rendering (minimal in Studio, full elsewhere)
 * - Admin route access
 * - Mobile responsive: hamburger drawer + bottom tab bar
 */

import { type FC } from 'react';
import { Box, HStack, Text, Button, IconButton, useDisclosure } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { UserDropdown } from './UserDropdown';
import { OrganizationSwitcher } from './OrganizationSwitcher';
import { MobileNav } from './MobileNav';
import { FiArrowLeft, FiMessageCircle, FiMenu } from 'react-icons/fi';
import { Icon } from '@chakra-ui/react';

interface NavItem {
  label: string;
  path: string;
  icon?: React.ElementType;
}

// Public navigation removed per BOD - public routes now use MegaMenuHeader inside STANDALONE_ROUTES
const publicNavItems: NavItem[] = [];

// User navigation (logged in)
const userNavItems: NavItem[] = [
  { label: 'Library', path: '/studio/library' },
  { label: 'Calendar', path: '/studio/calendar' },
  { label: 'Keywords', path: '/studio/keywords' },
  { label: 'Create', path: '/studio/create' },
  { label: 'Insights', path: '/studio/insights' },
];

// Admin navigation (same as user - Admin portal accessible only via UserDropdown)
const adminNavItems: NavItem[] = [];

export const Navigation: FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, loading } = useAuth();
  const {
    isOpen: isMobileNavOpen,
    onOpen: onOpenMobileNav,
    onClose: onCloseMobileNav,
  } = useDisclosure();

  // Wait for auth to resolve to prevent flashes of incorrect navigation
  if (loading) {
    return null;
  }

  // Hide navigation completely on onboarding and auth pages
  const hiddenRoutes = ['/onboarding', '/auth/signup', '/auth/login'];
  if (hiddenRoutes.some((route) => pathname?.startsWith(route))) {
    return null;
  }

  // Detect if we're in Studio context
  const isStudioContext = pathname?.startsWith('/studio');

  // Detect if we're in Admin context
  const isAdminContext = pathname?.startsWith('/admin');

  // Determine which nav items to show
  let navItems: NavItem[] = publicNavItems;
  if (isAuthenticated && user) {
    const isAdmin = user.role === 'admin' || user.role === 'super_admin';
    // For non-studio pages (like settings, profile), just show a back link instead of the full studio menu
    navItems = isAdmin ? adminNavItems : [{ label: 'Back to Studio', path: '/studio' }];
  }

  // Navigation items are never locked for authenticated users
  // Phase gating removed - users can navigate freely

  // STUDIO CONTEXT: Minimal dark top bar
  if (isStudioContext && isAuthenticated) {
    return (
      <>
        <Box
          as="nav"
          aria-label="Content Studio (Mobile)"
          bg="white"
          borderBottom="1px solid"
          borderColor="gray.200"
          position="sticky"
          top={0}
          zIndex={1000}
          display={{ base: 'block', md: 'none' }}
        >
          <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }}>
            <HStack justify="space-between" h={14}>
              {/* Mobile: Hamburger + Brand */}
              <HStack spacing={3}>
                <IconButton
                  aria-label="Open studio navigation"
                  icon={<Icon as={FiMenu} />}
                  variant="ghost"
                  color="gray.600"
                  _hover={{ color: 'brand.orange', bg: 'orange.50' }}
                  size="sm"
                  display={{ base: 'flex', md: 'none' }}
                  onClick={onOpenMobileNav}
                  minW="44px"
                  minH="44px"
                />
                {/* Desktop: Removed redundant Exit link */}
                <Link href="/studio" style={{ textDecoration: 'none' }}>
                  <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" color="brand.orange">
                    Phoo
                  </Text>
                </Link>
              </HStack>

              {/* Ask Phoo + User menu */}
              <HStack spacing={{ base: 2, md: 4 }}>
                <OrganizationSwitcher />
                <Link href="/assistant" style={{ textDecoration: 'none' }}>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="gray.600"
                    _hover={{ color: 'brand.orange', bg: 'orange.50' }}
                    leftIcon={<Icon as={FiMessageCircle} />}
                    display={{ base: 'none', md: 'flex' }}
                  >
                    Ask Phoo
                  </Button>
                  <IconButton
                    aria-label="Ask Phoo"
                    icon={<Icon as={FiMessageCircle} />}
                    variant="ghost"
                    color="gray.600"
                    _hover={{ color: 'brand.orange', bg: 'orange.50' }}
                    size="sm"
                    display={{ base: 'flex', md: 'none' }}
                    minW="44px"
                    minH="44px"
                  />
                </Link>
                <UserDropdown />
              </HStack>
            </HStack>
          </Box>
        </Box>
        <MobileNav
          isOpen={isMobileNavOpen}
          onClose={onCloseMobileNav}
          navItems={userNavItems} // Mobile studio nav always gets the full studio menu
          brandLabel="Phoo"
          brandColor="brand.orange"
          variant="light"
          user={
            user
              ? {
                  name: user.name ?? undefined,
                  email: user.email ?? undefined,
                  image: user.image ?? undefined,
                }
              : null
          }
        />
      </>
    );
  }

  // ADMIN CONTEXT: Minimal dark top bar matching Studio pattern
  if (isAdminContext && isAuthenticated) {
    const adminDrawerNavItems = [
      { label: 'Overview', path: '/admin' },
      { label: 'Prospects', path: '/admin/prospects' },
      { label: 'Users', path: '/admin/users' },
      { label: 'Keywords', path: '/admin/keywords' },
      { label: 'AI Providers', path: '/admin/ai-providers' },
      { label: 'Analysis', path: '/admin/analysis' },
      { label: 'Analytics', path: '/admin/analytics' },
    ];
    return (
      <>
        <Box
          as="nav"
          aria-label="Admin Portal"
          bg="rgba(26, 12, 0, 0.98)"
          borderBottom="1px solid rgba(255, 255, 255, 0.08)"
          position="sticky"
          top={0}
          zIndex={1000}
          backdropFilter="blur(10px)"
        >
          <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }}>
            <HStack justify="space-between" h={14}>
              {/* Mobile: Hamburger + Brand */}
              <HStack spacing={3}>
                <IconButton
                  aria-label="Open admin navigation"
                  icon={<Icon as={FiMenu} />}
                  variant="ghost"
                  color="gray.400"
                  _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
                  size="sm"
                  display={{ base: 'flex', md: 'none' }}
                  onClick={onOpenMobileNav}
                  minW="44px"
                  minH="44px"
                />
                {/* Desktop: Exit link */}
                <Link href="/studio" style={{ textDecoration: 'none' }}>
                  <HStack
                    spacing={2}
                    color="gray.400"
                    _hover={{ color: 'white' }}
                    transition="color 0.2s"
                    display={{ base: 'none', md: 'flex' }}
                  >
                    <Icon as={FiArrowLeft} boxSize={4} />
                    <Text fontSize="sm" fontWeight="medium">
                      Exit
                    </Text>
                  </HStack>
                </Link>
                <Box
                  h={4}
                  w="1px"
                  bg="rgba(255, 255, 255, 0.1)"
                  display={{ base: 'none', md: 'block' }}
                />
                <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" color="purple.400">
                  Admin Portal
                </Text>
              </HStack>

              {/* Ask Phoo + User menu */}
              <HStack spacing={{ base: 2, md: 4 }}>
                <OrganizationSwitcher />
                <Link href="/assistant" style={{ textDecoration: 'none' }}>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="gray.400"
                    _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
                    leftIcon={<Icon as={FiMessageCircle} />}
                    display={{ base: 'none', md: 'flex' }}
                  >
                    Ask Phoo
                  </Button>
                  <IconButton
                    aria-label="Ask Phoo"
                    icon={<Icon as={FiMessageCircle} />}
                    variant="ghost"
                    color="gray.400"
                    _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
                    size="sm"
                    display={{ base: 'flex', md: 'none' }}
                    minW="44px"
                    minH="44px"
                  />
                </Link>
                <UserDropdown />
              </HStack>
            </HStack>
          </Box>
        </Box>
        <MobileNav
          isOpen={isMobileNavOpen}
          onClose={onCloseMobileNav}
          navItems={adminDrawerNavItems}
          brandLabel="Admin Portal"
          brandColor="purple.400"
          user={
            user
              ? {
                  name: user.name ?? undefined,
                  email: user.email ?? undefined,
                  image: user.image ?? undefined,
                }
              : null
          }
        />
      </>
    );
  }

  // DEFAULT CONTEXT: Full navigation
  return (
    <>
      <Box
        as="nav"
        aria-label="Main navigation"
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
            {/* Left: Logo */}
            <Link href={isAuthenticated ? '/studio' : '/'} style={{ textDecoration: 'none' }}>
              <Text fontSize="xl" fontWeight="bold" color="brand.orange">
                Phoo
              </Text>
            </Link>

            {/* Right: Nav items (desktop only) + auth actions */}
            <HStack spacing={8}>
              {navItems.map((item) => {
                const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');

                return (
                  <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
                    <Box
                      as="span"
                      color={isActive ? 'brand.orange' : 'gray.700'}
                      fontWeight={isActive ? 'bold' : 'medium'}
                      _hover={{ color: 'brand.orange' }}
                      _focusVisible={{
                        outline: '2px solid',
                        outlineColor: 'brand.orange',
                        outlineOffset: '2px',
                      }}
                      cursor="pointer"
                      transition="all 0.2s"
                      display={{ base: 'none', md: 'inline' }}
                      position="relative"
                      aria-current={isActive ? 'page' : undefined}
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
                  </Link>
                );
              })}
              {isAuthenticated ? (
                <HStack spacing={{ base: 2, md: 4 }}>
                  <OrganizationSwitcher />
                  <Link href="/assistant" style={{ textDecoration: 'none' }}>
                    <Button
                      size="sm"
                      variant="ghost"
                      color="brand.orange"
                      _hover={{ bg: 'orange.50' }}
                      leftIcon={<Icon as={FiMessageCircle} />}
                      display={{ base: 'none', md: 'flex' }}
                    >
                      Ask Phoo
                    </Button>
                  </Link>
                  <UserDropdown />
                  {/* Hamburger menu (mobile only) - right side */}
                  <IconButton
                    aria-label="Open navigation"
                    icon={<Icon as={FiMenu} />}
                    variant="ghost"
                    color="gray.600"
                    _hover={{ color: 'brand.orange', bg: 'orange.50' }}
                    size="sm"
                    display={{ base: 'flex', md: 'none' }}
                    onClick={onOpenMobileNav}
                    minW="44px"
                    minH="44px"
                  />
                </HStack>
              ) : (
                <IconButton
                  aria-label="Open navigation"
                  icon={<Icon as={FiMenu} />}
                  variant="ghost"
                  color="gray.600"
                  _hover={{ color: 'brand.orange', bg: 'orange.50' }}
                  size="sm"
                  display={{ base: 'flex', md: 'none' }}
                  onClick={onOpenMobileNav}
                  minW="44px"
                  minH="44px"
                />
              )}
            </HStack>
          </HStack>
        </Box>
      </Box>
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={onCloseMobileNav}
        navItems={navItems}
        brandLabel="Phoo"
        brandColor="brand.orange"
        placement="right"
        variant="light"
        user={
          user
            ? {
                name: user.name ?? undefined,
                email: user.email ?? undefined,
                image: user.image ?? undefined,
              }
            : null
        }
      />
    </>
  );
};
