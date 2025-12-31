'use client';

/**
 * AdminGuard
 *
 * Component Hierarchy:
 * App → AdminLayout → AdminGuard (this file)
 *
 * Protects admin routes by checking user role.
 * Supports admin and super_admin roles with proper RBAC hierarchy.
 */

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { LoadingState } from '@/src/components/shared';

interface AdminGuardProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'super_admin';
}

export function AdminGuard({ children, requiredRole = 'admin' }: AdminGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const user = useQuery(api.users.me);
  const [authorized, setAuthorized] = useState(false);

  // Determine if still loading - both auth AND user query must be complete
  const isLoading = authLoading || user === undefined;

  useEffect(() => {
    // Don't run logic until both auth and user query are loaded
    if (isLoading) return;

    // Not authenticated or no user data
    if (!isAuthenticated || !user) {
      setAuthorized(false);
      router.replace('/auth/admin/login');
      return;
    }

    // No role field means not an admin user
    if (!user.role) {
      setAuthorized(false);
      router.replace('/');
      return;
    }

    // RBAC Logic
    const userRole = user.role;
    const isSuperAdmin = userRole === 'super_admin';
    const isAdmin = userRole === 'admin';

    // Super admin can access everything
    if (isSuperAdmin) {
      setAuthorized(true);
      return;
    }

    // Admin can access admin routes, but not super_admin routes
    if (isAdmin && requiredRole === 'admin') {
      setAuthorized(true);
      return;
    }

    // Otherwise unauthorized - user is logged in but wrong role
    setAuthorized(false);
    // Redirect regular users to home
    router.replace('/');
  }, [isLoading, isAuthenticated, user, router, requiredRole]);

  if (isLoading) {
    return <LoadingState message="Validating admin session..." fullPage />;
  }

  if (!authorized) {
    return (
      <Box minH="60vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Text color="gray.600">Access Denied. Verifying permissions...</Text>
          <Button onClick={() => router.replace('/auth/admin/login')} colorScheme="purple">
            Go to Admin Login
          </Button>
          {isAuthenticated && (
            <Button variant="ghost" size="sm" onClick={() => router.replace('/')}>
              Go to Home
            </Button>
          )}
        </VStack>
      </Box>
    );
  }

  return <>{children}</>;
}
