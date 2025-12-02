"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { useAuth } from "@/lib/useAuth";
import { LoadingState } from "@/src/components/shared";

interface AdminGuardProps {
  children: ReactNode;
  requiredRole?: "admin" | "super_admin";
}

export function AdminGuard({ children, requiredRole = "admin" }: AdminGuardProps) {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !user?.role) {
      setAuthorized(false);
      router.replace("/auth/admin/login");
      return;
    }

    // RBAC Logic
    const userRole = user.role;
    const isSuperAdmin = userRole === "super_admin";
    const isAdmin = userRole === "admin";

    // Super admin can access everything
    if (isSuperAdmin) {
      setAuthorized(true);
      return;
    }

    // Admin can access admin routes, but not super_admin routes
    if (isAdmin && requiredRole === "admin") {
      setAuthorized(true);
      return;
    }

    // Otherwise unauthorized
    setAuthorized(false);
    // If logged in but wrong role, maybe show forbidden or redirect home
    if (isAuthenticated) {
      // For now, just redirect to login/home to be safe
      router.replace("/"); 
    }
  }, [loading, isAuthenticated, user?.role, router, requiredRole]);

  if (loading) {
    return <LoadingState message="Validating admin session..." fullPage />;
  }

  if (!authorized) {
    return (
      <Box minH="60vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Text color="gray.600">Access Denied. Verifying permissions...</Text>
          <Button onClick={() => router.replace("/auth/admin/login")} colorScheme="purple">
            Go to Admin Login
          </Button>
          {isAuthenticated && (
            <Button variant="ghost" size="sm" onClick={logout}>
              Sign out
            </Button>
          )}
        </VStack>
      </Box>
    );
  }

  return <>{children}</>;
}

