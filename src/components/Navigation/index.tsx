'use client';

import { type FC } from 'react';
import { Box, HStack, Text, Button } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { UserDropdown } from './UserDropdown';

// Public navigation (not logged in)
const publicNavItems = [
  { label: 'Home', path: '/' },
  { label: 'Pricing', path: '/pricing' },
];

// User navigation (logged in, non-admin)
const userNavItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Strategy', path: '/strategy' },
  { label: 'Calendar', path: '/calendar' },
  { label: 'Content', path: '/content' },
  { label: 'Integrations', path: '/integrations' },
];

// Admin navigation (logged in, admin)
const adminNavItems = [
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

  // Hide navigation completely on onboarding and auth pages
  const hiddenRoutes = ['/onboarding', '/auth/signup', '/auth/login'];
  if (hiddenRoutes.some((route) => pathname?.startsWith(route))) {
    return null;
  }

  // Determine which nav items to show
  let navItems = publicNavItems;
  if (isAuthenticated && user) {
    const isAdmin = user.role === 'admin' || user.role === 'super_admin';
    navItems = isAdmin ? adminNavItems : userNavItems;
  }

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
          <Link href={isAuthenticated ? '/home' : '/'} style={{ textDecoration: 'none' }}>
            <Text fontSize="xl" fontWeight="bold" color="brand.orange">
              MartAI
            </Text>
          </Link>
          <HStack spacing={8}>
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
                <Box
                  as="span"
                  color={pathname === item.path ? 'brand.orange' : 'gray.600'}
                  fontWeight={pathname === item.path ? 'semibold' : 'normal'}
                  _hover={{ color: 'brand.orange' }}
                  cursor="pointer"
                  transition="color 0.2s"
                  display={{
                    base: item.label === 'Home' || item.label === 'Dashboard' ? 'inline' : 'none',
                    md: 'inline',
                  }}
                >
                  {item.label}
                </Box>
              </Link>
            ))}
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
