"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { useAuth } from "@/lib/useAuth";
import { LoadingState } from "@/src/components/shared";

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || user?.role !== "admin") {
      setAuthorized(false);
      router.replace("/auth/admin/login");
      return;
    }

    setAuthorized(true);
  }, [loading, isAuthenticated, user?.role, router]);

  if (loading) {
    return <LoadingState message="Validating admin session..." fullPage />;
  }

  if (!authorized) {
    return (
      <Box minH="60vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Text color="gray.600">Redirecting to admin login…</Text>
          <Button onClick={() => router.replace("/auth/admin/login")} colorScheme="purple">
            Go to Admin Login
          </Button>
          {isAuthenticated && user && user.role !== "admin" && (
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

