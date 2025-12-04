'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  HStack,
} from '@chakra-ui/react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/lib/useAuth';
import { authStorage } from '@/lib/storage';

export default function OnboardingPage() {
  const router = useRouter();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    website: '',
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    console.log('🏁 OnboardingPage mounted. Auth:', { isAuthenticated, authLoading, user });
    if (authLoading) return;

    if (!isAuthenticated) {
      console.log('🚫 Not authenticated, redirecting to login');
      router.replace('/auth/login');
      return;
    }
  }, [isAuthenticated, authLoading, router, user]);

  const createProject = useMutation(api.projects.projects.createProject);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    console.log('🚀 Starting onboarding submission', formData);

    try {
      if (!user || !formData.website) {
        throw new Error('Please fill in all required fields');
      }

      // Normalize website URL
      let websiteUrl = formData.website.trim();
      if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
        websiteUrl = 'https://' + websiteUrl;
      }

      // Create project directly via Convex mutation
      const projectId = await createProject({
        name: formData.businessName || 'My Business',
        websiteUrl: websiteUrl,
      });

      console.log('✅ Project created with ID:', projectId);

      if (projectId) {
        localStorage.setItem('currentProjectId', projectId);
        // Redirect to reveal page for cool onboarding journey
        router.push('/onboarding/reveal');
      } else {
        throw new Error('Failed to create project');
      }
    } catch (err) {
      console.error('Onboarding error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light" display="flex" alignItems="center">
      <Container maxW="container.sm" py={12}>
        <Box bg="white" p={8} borderRadius="lg" shadow="md">
          <VStack spacing={6} align="stretch">
            <VStack spacing={2} align="stretch" textAlign="center">
              <Heading size="xl" fontWeight="bold" fontFamily="heading" color="gray.800">
                Welcome to MartAI! 🎉
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Let's get your website ready to grow. We'll help you get found on Google - no SEO
                knowledge needed!
              </Text>
            </VStack>

            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <VStack spacing={5} align="stretch">
                <FormControl>
                  <FormLabel fontWeight="semibold">What's your business name?</FormLabel>
                  <Input
                    placeholder="e.g., Acme Bakery"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    disabled={loading}
                    size="lg"
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Optional - we can update this later
                  </Text>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">What's your website address?</FormLabel>
                  <Input
                    placeholder="yourwebsite.com"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    disabled={loading}
                    size="lg"
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Don't worry about adding "https://" - we'll add that for you
                  </Text>
                </FormControl>

                <Button
                  type="submit"
                  bg="brand.orange"
                  color="white"
                  size="lg"
                  _hover={{ bg: '#E8851A' }}
                  disabled={loading || !formData.website}
                  isLoading={loading}
                  loadingText="Getting everything ready..."
                >
                  {loading ? 'Setting things up...' : 'Get Started →'}
                </Button>
              </VStack>
            </form>

            <Box bg="gray.50" p={4} borderRadius="md" mt={4}>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                <strong>What happens next?</strong> We'll analyze your website and create a
                personalized plan to help you rank higher on Google. You can always add more details
                later!
              </Text>
            </Box>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
