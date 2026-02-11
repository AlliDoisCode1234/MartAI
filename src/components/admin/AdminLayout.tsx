'use client';

import { ReactNode } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { AdminGuard } from './AdminGuard';
import { AdminSidebar } from './AdminSidebar';

export function AdminLayout({ children }: { children: ReactNode }) {
  const bg = useColorModeValue('gray.50', 'gray.900');

  return (
    <AdminGuard>
      <Box minH="100vh" bg={bg}>
        <AdminSidebar />
        <Box ml={{ base: 0, md: '250px' }} p={{ base: 4, md: 8 }}>
          {children}
        </Box>
      </Box>
    </AdminGuard>
  );
}
