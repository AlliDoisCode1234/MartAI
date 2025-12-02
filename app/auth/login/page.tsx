'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, VStack, Heading, Text, Box, Input, Button, FormControl, FormLabel, Alert, AlertIcon, Link, Divider, HStack } from '@chakra-ui/react';
import { useAuthActions } from "@convex-dev/auth/react";
import { FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn("password", { email: formData.email, password: formData.password, flow: "signIn" });
      // Redirect is handled by the auth flow or we can redirect manually if needed
      // But typically for password auth we might want to wait or check success
      // signIn returns a promise that resolves when the action is complete
      router.replace('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn("google");
    } catch (err) {
      setError('Failed to sign in with Google');
      setLoading(false);
    }
  };

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light" display="flex" alignItems="center">
      <Container maxW="container.sm" py={12}>
        <Box bg="white" p={8} borderRadius="lg" shadow="md">
          <VStack spacing={6} align="stretch">
            <Heading size="xl" fontWeight="bold" fontFamily="heading" color="gray.800" textAlign="center">
              Welcome to MartAI
            </Heading>
            <Text color="gray.600" textAlign="center">
              Sign in to your account to continue
            </Text>

            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <Button
              leftIcon={<FaGoogle />}
              onClick={handleGoogleLogin}
              size="lg"
              variant="outline"
              width="full"
              isLoading={loading}
              isDisabled={loading}
            >
              Sign in with Google
            </Button>

            <HStack>
              <Divider />
              <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
                OR CONTINUE WITH EMAIL
              </Text>
              <Divider />
            </HStack>

            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={loading}
                  />
                </FormControl>

                <Button
                  type="submit"
                  bg="brand.orange"
                  color="white"
                  size="lg"
                  _hover={{ bg: '#E8851A' }}
                  disabled={loading}
                  isLoading={loading}
                  loadingText="Signing in..."
                >
                  Sign In
                </Button>
              </VStack>
            </form>

            <Text textAlign="center" color="gray.600" fontSize="sm">
              Don't have an account?{' '}
              <Link href="/auth/signup" color="brand.orange" fontWeight="semibold">
                Sign up
              </Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}

