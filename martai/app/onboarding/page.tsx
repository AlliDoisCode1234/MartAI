'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, VStack, Heading, Text, Box, Input, Button, HStack, FormControl, FormLabel, Spinner, Alert, AlertIcon } from '@chakra-ui/react';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    industry: '',
    targetAudience: '',
    monthlyRevenueGoal: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/seo-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate SEO analysis');
      }

      const data = await response.json();
      
      sessionStorage.setItem('seoAnalysis', JSON.stringify({
        ...data,
        businessInfo: formData,
      }));

      router.push('/onboarding/results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, sm: 6, md: 8, lg: 12 }}>
        <HStack spacing={8} align="start" flexDirection={{ base: 'column', lg: 'row' }}>
          <Box flex={1} bg="white" p={8} borderRadius="lg" shadow="md">
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                <Heading size="xl" fontWeight="bold" fontFamily="heading" color="gray.800">Business Setup</Heading>
                <Text color="gray.600">Tell us about your business to generate your personalized SEO growth plan.</Text>
                
                {error && (
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}

                <FormControl isRequired>
                  <FormLabel>Business Name</FormLabel>
                  <Input 
                    placeholder="Enter your business name" 
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    disabled={loading}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Website</FormLabel>
                  <Input 
                    placeholder="https://yourwebsite.com" 
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    disabled={loading}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Industry / Niche</FormLabel>
                  <Input 
                    placeholder="e.g., E-commerce, SaaS, Consulting" 
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    disabled={loading}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Target Audience</FormLabel>
                  <Input 
                    placeholder="Describe your ideal customer" 
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    disabled={loading}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Monthly Revenue Goal</FormLabel>
                  <Input 
                    placeholder="$10,000" 
                    type="text"
                    value={formData.monthlyRevenueGoal}
                    onChange={(e) => setFormData({ ...formData, monthlyRevenueGoal: e.target.value })}
                    disabled={loading}
                  />
                </FormControl>

                <Button 
                  type="submit"
                  bg="brand.orange" 
                  color="white" 
                  size="lg" 
                  mt={4} 
                  _hover={{ bg: '#E8851A' }}
                  disabled={loading}
                  isLoading={loading}
                  loadingText="Generating..."
                >
                  {loading ? 'Generating SEO Plan...' : 'Generate My SEO Growth Plan'}
                </Button>
              </VStack>
            </form>
          </Box>

          <Box w={{ base: 'full', lg: '400px' }} bg="white" p={6} borderRadius="lg" shadow="md" bgGradient="linear(to-br, brand.lavender, white)">
            <VStack spacing={4} align="stretch">
              <Heading size="md" fontFamily="heading">What You'll Get</Heading>
              <Box p={6} bg="white" borderRadius="md">
                <VStack spacing={4} align="stretch">
                  <HStack>
                    <Text color="gray.600">✓</Text>
                    <Text color="gray.600" fontSize="sm">Comprehensive SEO Audit</Text>
                  </HStack>
                  <HStack>
                    <Text color="gray.600">✓</Text>
                    <Text color="gray.600" fontSize="sm">Custom Taglines & Content Ideas</Text>
                  </HStack>
                  <HStack>
                    <Text color="gray.600">✓</Text>
                    <Text color="gray.600" fontSize="sm">Social Media Post Suggestions</Text>
                  </HStack>
                  <HStack>
                    <Text color="gray.600">✓</Text>
                    <Text color="gray.600" fontSize="sm">Actionable SEO Recommendations</Text>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </HStack>
      </Container>
    </Box>
  );
}

