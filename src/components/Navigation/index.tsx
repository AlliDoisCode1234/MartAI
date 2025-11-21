'use client';

import { type FC } from 'react';
import { Box, HStack, Text, Button } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Onboarding', path: '/onboarding' },
  { label: 'Keywords', path: '/keywords' },
  { label: 'Integrations', path: '/integrations' },
  { label: 'Strategy', path: '/strategy' },
  { label: 'Content', path: '/content' },
  { label: 'Publish', path: '/publish' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Settings', path: '/settings' },
];

export const Navigation: FC = () => {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <Box bg="white" shadow="sm" borderBottom="1px" borderColor="gray.200" position="sticky" top={0} zIndex={1000}>
      <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }}>
        <HStack justify="space-between" h={16}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Text fontSize="xl" fontWeight="bold" color="brand.orange">
              MartAI
            </Text>
          </Link>
          <HStack spacing={8}>
            {isAuthenticated ? (
              <>
                {navItems.map((item) => (
                  <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
                    <Box
                      as="span"
                      color={pathname === item.path ? 'brand.orange' : 'gray.600'}
                      fontWeight={pathname === item.path ? 'semibold' : 'normal'}
                      _hover={{ color: 'brand.orange' }}
                      cursor="pointer"
                      transition="color 0.2s"
                    >
                      {item.label}
                    </Box>
                  </Link>
                ))}
                <HStack spacing={2}>
                  <Text fontSize="sm" color="gray.600">{user?.email}</Text>
                  <Button size="sm" variant="outline" onClick={logout}>
                    Logout
                  </Button>
                </HStack>
              </>
            ) : (
              <HStack spacing={4}>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
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

