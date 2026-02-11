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
import { MobileNav } from './MobileNav';
import { FiArrowLeft, FiMessageCircle, FiMenu, FiHome, FiSearch, FiEdit3 } from 'react-icons/fi';
import { Icon } from '@chakra-ui/react';

interface NavItem {
  label: string;
  path: string;
  icon?: React.ElementType;
}

// Public navigation (not logged in) - Logo links to home, so no "Home" item needed
const publicNavItems: NavItem[] = [
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Pricing', path: '/pricing' },
];

// User navigation (logged in)
const userNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: FiHome },
  { label: 'Keywords', path: '/keywords', icon: FiSearch },
  { label: 'Content Studio', path: '/studio', icon: FiEdit3 },
];

// Admin navigation (same as user - Admin portal accessible only via UserDropdown)
const adminNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: FiHome },
  { label: 'Keywords', path: '/keywords', icon: FiSearch },
  { label: 'Content Studio', path: '/studio', icon: FiEdit3 },
];

export const Navigation: FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const {
    isOpen: isMobileNavOpen,
    onOpen: onOpenMobileNav,
    onClose: onCloseMobileNav,
  } = useDisclosure();

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
    navItems = isAdmin ? adminNavItems : userNavItems;
  }

  // Navigation items are never locked for authenticated users
  // Phase gating removed - users can navigate freely

  // STUDIO CONTEXT: Minimal dark top bar
  if (isStudioContext && isAuthenticated) {
    const studioNavItems = [
      { label: 'Library', path: '/studio/library' },
      { label: 'Strategy', path: '/studio/strategy' },
      { label: 'Calendar', path: '/studio/calendar' },
      { label: 'Create', path: '/studio/create' },
      { label: 'Insights', path: '/studio/insights' },
      { label: 'Settings', path: '/studio/settings' },
    ];
    return (
      <>
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
              {/* Mobile: Hamburger + Brand */}
              <HStack spacing={3}>
                <IconButton
                  aria-label="Open studio navigation"
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
                <Link href="/dashboard" style={{ textDecoration: 'none' }}>
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
                <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" color="brand.orange">
                  Content Studio
                </Text>
              </HStack>

              {/* Ask Phoo + User menu */}
              <HStack spacing={{ base: 2, md: 4 }}>
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
          navItems={studioNavItems}
          brandLabel="Content Studio"
          brandColor="brand.orange"
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
          bg="rgba(13, 13, 13, 0.98)"
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
                <Link href="/dashboard" style={{ textDecoration: 'none' }}>
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
            <Link href={isAuthenticated ? '/dashboard' : '/'} style={{ textDecoration: 'none' }}>
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
                      cursor="pointer"
                      transition="all 0.2s"
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
                  </Link>
                );
              })}
              {isAuthenticated ? (
                <HStack spacing={{ base: 2, md: 4 }}>
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
