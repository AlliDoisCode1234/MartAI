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

  // Redirect to login if not authenticated or dashboard if already onboarded
  useEffect(() => {
    console.log('🏁 OnboardingPage mounted. Auth:', { isAuthenticated, authLoading, user });
    if (authLoading) return;

    if (!isAuthenticated) {
      console.log('🚫 Not authenticated, redirecting to login');
      router.replace('/auth/login');
      return;
    }

    if (user && user.onboardingStatus === 'completed') {
      console.log('✅ User already onboarded, redirecting to dashboard');
      router.replace('/dashboard');
    }
  }, [isAuthenticated, authLoading, router, user]);

  const createProject = useMutation(api.projects.projects.createProject);
  const completeOnboarding = useMutation(api.users.completeOnboarding);

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
        // Mark onboarding as complete for the user
        await completeOnboarding();

        localStorage.setItem('currentProjectId', projectId);
        // Redirect to reveal page for cool onboarding journey
        router.push('/onboarding/reveal');
      } else {
        throw new Error('Failed to create project');
      }
    } catch (err: any) {
      console.error('Onboarding error:', err);
      let msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';

      // Better error message for limits
      if (msg.includes('LIMIT_REACHED')) {
        msg = msg.replace('LIMIT_REACHED:', '').trim();
      }

      setError(msg);
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
                Hi, I'm Mart! 👋
              </Heading>
              <Text color="gray.600" fontSize="lg">
                I'm your new AI Marketing Manager. Give me your website, and I'll build your entire
                SEO strategy in seconds.
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
                  <FormLabel fontWeight="semibold">What website should I analyze?</FormLabel>
                  <Input
                    placeholder="yourwebsite.com"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    disabled={loading}
                    size="lg"
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Paste your homepage URL here.
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
                  loadingText="Mart is analyzing..."
                >
                  {loading ? 'Analyzing...' : 'Analyze My Site →'}
                </Button>
              </VStack>
            </form>

            <Box bg="gray.50" p={4} borderRadius="md" mt={4}>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                <strong>What happens next?</strong> I'll crawl your site, find your best keywords,
                and create a quarterly content plan to hit your revenue goals.
              </Text>
            </Box>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
