'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, VStack, Heading, Text, Box, Input, Button, FormControl, FormLabel, Alert, AlertIcon, Link } from '@chakra-ui/react';
import { authStorage } from '@/lib/storage';
import { useAuth } from '@/lib/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Redirect if already authenticated (but only if user manually navigated here, not after login)
  useEffect(() => {
    if (authLoading) return; // Wait for auth to finish loading
    
    if (isAuthenticated && !loading && !justLoggedIn) {
      // Check if user has projects, if so go to dashboard, otherwise onboarding
      const projectId = localStorage.getItem('currentProjectId');
      if (projectId) {
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, loading, justLoggedIn, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Use centralized login function from useAuth
      await login(formData.email, formData.password);
      setJustLoggedIn(true); // Prevent auto-redirect useEffect from firing

      // Check if user has a project, if not redirect to onboarding
      const token = authStorage.getToken();
      if (token) {
        try {
          const projectsResponse = await fetch('/api/projects', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (projectsResponse.ok) {
            const projectsData = await projectsResponse.json();
            const projects = projectsData.projects || [];

            if (projects.length > 0) {
              // Persist the first project so dashboard/strategy know which one to load
              const firstProject = projects[0];
              const projectIdStr =
                typeof firstProject._id === 'string'
                  ? firstProject._id
                  : firstProject._id.toString();
              localStorage.setItem('currentProjectId', projectIdStr);
            } else {
              localStorage.removeItem('currentProjectId');
            }
          } else {
            console.warn('Failed to load projects after login:', await projectsResponse.text());
          }
        } catch (err) {
          console.warn('Project fetch error after login:', err);
        }
      } else {
        console.warn('No auth token found after login. Falling back to dashboard.');
      }

      // Always send the user to the dashboard after login; dashboard handles empty-state/onboarding CTA
      router.replace('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
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

            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter your username (we use your email)"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })}
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

