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
 * - Admin route access
 * - Mobile responsive
 */

import { type FC } from 'react';
import { Box, HStack, Text, Button } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { UserDropdown } from './UserDropdown';
import { FiArrowLeft, FiMessageCircle } from 'react-icons/fi';
import { Icon } from '@chakra-ui/react';

interface NavItem {
  label: string;
  path: string;
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
];

// Admin navigation (same as user - Admin portal accessible only via UserDropdown)
const adminNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Keywords', path: '/keywords' },
  { label: 'Content Studio', path: '/studio' },
];

export const Navigation: FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

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

            {/* Ask Phoo + User menu */}
            <HStack spacing={4}>
              <Link href="/assistant" style={{ textDecoration: 'none' }}>
                <Button
                  size="sm"
                  variant="ghost"
                  color="gray.400"
                  _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
                  leftIcon={<Icon as={FiMessageCircle} />}
                >
                  Ask Phoo
                </Button>
              </Link>
              <UserDropdown />
            </HStack>
          </HStack>
        </Box>
      </Box>
    );
  }

  // ADMIN CONTEXT: Minimal dark top bar matching Studio pattern
  if (isAdminContext && isAuthenticated) {
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
            {/* Exit + Context indicator */}
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
              <Text fontSize="lg" fontWeight="bold" color="purple.400">
                Admin Portal
              </Text>
            </HStack>

            {/* Ask Phoo + User menu */}
            <HStack spacing={4}>
              <Link href="/assistant" style={{ textDecoration: 'none' }}>
                <Button
                  size="sm"
                  variant="ghost"
                  color="gray.400"
                  _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
                  leftIcon={<Icon as={FiMessageCircle} />}
                >
                  Ask Phoo
                </Button>
              </Link>
              <UserDropdown />
            </HStack>
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
              const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');

              return (
                <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
                  <Box
                    as="span"
                    // Wave 3: Improved contrast - use explicit colors, not opacity
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
              <HStack spacing={4}>
                <Link href="/assistant" style={{ textDecoration: 'none' }}>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="brand.orange"
                    _hover={{ bg: 'orange.50' }}
                    leftIcon={<Icon as={FiMessageCircle} />}
                  >
                    Ask Phoo
                  </Button>
                </Link>
                <UserDropdown />
              </HStack>
            ) : /*
             * BETA LAUNCH: Sign In/Sign Up hidden until public launch
             * Users can still access /auth/login directly if they know the URL
             * TODO: Uncomment when ready for public launch
             */
            null
            /*
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
              */
            }
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
};
