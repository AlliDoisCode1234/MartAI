'use client';

import { type FC } from 'react';
import { Box, HStack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Onboarding', path: '/onboarding' },
  { label: 'Keywords', path: '/keywords' },
  { label: 'Integrations', path: '/integrations' },
  { label: 'Strategy', path: '/strategy' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Settings', path: '/settings' },
];

export const Navigation: FC = () => {
  const pathname = usePathname();

  return (
    <Box bg="white" shadow="sm" borderBottom="1px" borderColor="gray.200" position="sticky" top={0} zIndex={1000}>
      <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }}>
        <HStack justify="space-between" h={16}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Text fontSize="xl" fontWeight="bold" color="brand.orange">
              Phoo
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
                >
                  {item.label}
                </Box>
              </Link>
            ))}
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
};

