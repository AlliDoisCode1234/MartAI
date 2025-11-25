"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Link,
} from "@chakra-ui/react";
import { useAuth } from "@/lib/useAuth";
import { authStorage } from "@/lib/storage";

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, user, login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated && user?.role === "admin") {
      router.replace("/admin");
    }
  }, [authLoading, isAuthenticated, user?.role, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await login(formData.email, formData.password, {
        endpoint: "/api/admin/login",
      });

      if (data?.user?.role !== "admin") {
        authStorage.clear();
        setError("Admin access is required.");
        return;
      }

      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="calc(100vh - 64px)" bg="gray.50" display="flex" alignItems="center">
      <Container maxW="container.sm" py={12}>
        <Box bg="white" p={8} borderRadius="lg" shadow="md">
          <VStack spacing={6} align="stretch">
            <Heading size="lg" textAlign="center">
              MartAI Admin Portal
            </Heading>
            <Text textAlign="center" color="gray.600">
              Restricted access. Admin credentials required.
            </Text>

            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Admin Username</FormLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value.toLowerCase(),
                      })
                    }
                    placeholder="admin@martai.com"
                    disabled={loading}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="purple"
                  size="lg"
                  isLoading={loading}
                  loadingText="Authenticating..."
                >
                  Sign in as Admin
                </Button>
              </VStack>
            </form>

            <Text textAlign="center" color="gray.600" fontSize="sm">
              Need the member experience instead?{" "}
              <Link href="/auth/login" color="brand.orange" fontWeight="semibold">
                Go to member login
              </Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}

