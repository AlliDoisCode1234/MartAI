'use client';

import { Box, VStack, Text, Link, Icon, Flex, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiUsers, FiActivity, FiSettings, FiBarChart2, FiCpu } from 'react-icons/fi';
import { useAuth } from '@/lib/useAuth';

const NAV_ITEMS = [
  { name: 'Overview', icon: FiHome, path: '/admin', roles: ['admin', 'super_admin', 'viewer'] },
  {
    name: 'Prospects',
    icon: FiUsers,
    path: '/admin/prospects',
    roles: ['admin', 'super_admin', 'viewer'],
  },
  { name: 'Users', icon: FiUsers, path: '/admin/users', roles: ['admin', 'super_admin', 'viewer'] },
  {
    name: 'Keywords',
    icon: FiActivity,
    path: '/admin/keywords',
    roles: ['admin', 'super_admin', 'viewer'],
  },
  { name: 'AI Providers', icon: FiCpu, path: '/admin/ai-providers', roles: ['super_admin'] },
  {
    name: 'Analysis',
    icon: FiActivity,
    path: '/admin/analysis',
    roles: ['admin', 'super_admin', 'viewer'],
  },
  { name: 'Analytics', icon: FiBarChart2, path: '/admin/analytics', roles: ['super_admin'] },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { user } = useAuth();

  // Filter nav items based on user role
  const visibleNavItems = NAV_ITEMS.filter((item) => item.roles.includes(user?.role || ''));

  return (
    <Box
      w="250px"
      h="calc(100vh - 56px)"
      pos="fixed"
      left="0"
      top="56px"
      bg={bg}
      borderRight="1px"
      borderColor={borderColor}
      py={6}
      overflowY="auto"
      display={{ base: 'none', md: 'block' }}
    >
      <VStack align="stretch" spacing={8}>
        <Box px={4}>
          <Text fontSize="xl" fontWeight="bold" color="purple.600">
            Phoo Admin
          </Text>
          <Text fontSize="xs" color="gray.500">
            CRM & Intelligence
          </Text>
        </Box>

        <VStack align="stretch" spacing={2}>
          {visibleNavItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                as={NextLink}
                href={item.path}
                _hover={{ textDecoration: 'none' }}
              >
                <Flex
                  align="center"
                  p={3}
                  borderRadius="md"
                  bg={isActive ? 'purple.50' : 'transparent'}
                  color={isActive ? 'purple.600' : 'gray.600'}
                  _hover={{ bg: 'purple.50', color: 'purple.600' }}
                  transition="all 0.2s"
                >
                  <Icon as={item.icon} mr={3} boxSize={5} />
                  <Text fontWeight={isActive ? 'semibold' : 'medium'}>{item.name}</Text>
                </Flex>
              </Link>
            );
          })}
        </VStack>
      </VStack>
    </Box>
  );
}
