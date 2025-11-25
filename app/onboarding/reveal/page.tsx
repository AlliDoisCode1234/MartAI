'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useAuth } from '@/lib/useAuth';
import { KeywordReveal } from '@/src/components/KeywordReveal';
import type { KeywordCluster } from '@/types';
import { assertProjectId } from '@/lib/typeGuards';

export default function OnboardingRevealPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [clusters, setClusters] = useState<KeywordCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revealComplete, setRevealComplete] = useState(false);

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }

    loadClusters();
  }, [isAuthenticated, authLoading, router]);

  const loadClusters = async () => {
    try {
      const projectId = localStorage.getItem('currentProjectId');
      if (!projectId) {
        router.replace('/onboarding');
        return;
      }

      const projectIdTyped = assertProjectId(projectId);

      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.replace('/auth/login');
        return;
      }

      // Check if clusters already exist
      const response = await fetch(`/api/clusters?projectId=${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const existingClusters = data.clusters || [];

        if (existingClusters.length > 0) {
          // Sort by impact score and take top clusters for reveal
          const sortedClusters = existingClusters
            .sort((a: KeywordCluster, b: KeywordCluster) => (b.impactScore || 0) - (a.impactScore || 0))
            .slice(0, 8);
          setClusters(sortedClusters);
          setLoading(false);
          return;
        }
      }

      // If no clusters, try to generate demo clusters for the reveal experience
      // This gives users a preview even if they haven't generated clusters yet
      try {
        const projectResp = await fetch(`/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (projectResp.ok) {
          const projectData = await projectResp.json();
          const websiteUrl = projectData.websiteUrl || '';

          // Generate some demo clusters based on the website
          const demoResponse = await fetch('/api/demo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url: websiteUrl || window.location.hostname,
              companyName: projectData.name,
            }),
          });

          if (demoResponse.ok) {
            const demoData = await demoResponse.json();
            const demoClusters = demoData.demo?.keywordClusters || [];
            
            // Transform demo format to KeywordCluster format
            const transformedClusters: KeywordCluster[] = demoClusters
              .slice(0, 6)
              .map((demo: any) => ({
                _id: demo._id || (`demo-${Date.now()}-${Math.random()}` as any),
                projectId: projectIdTyped,
                clusterName: demo.topic || demo.clusterName || 'Keyword Opportunity',
                keywords: demo.keywords || (demo.primaryKeyword ? [demo.primaryKeyword, ...(demo.supportingKeywords || [])] : []),
                intent: (demo.searchIntent || demo.intent || 'commercial') as KeywordCluster['intent'],
                difficulty: demo.difficulty || 50,
                volumeRange: demo.volumeRange || { min: 100, max: 1000 },
                impactScore: demo.impactScore || 0.7,
                topSerpUrls: [],
                status: 'active' as const,
                reasoning: demo.reasoning,
              }));

            if (transformedClusters.length > 0) {
              setClusters(transformedClusters);
              setLoading(false);
              return;
            }
          }
        }
      } catch (demoError) {
        console.warn('Failed to generate demo clusters:', demoError);
      }

      // If we can't generate anything, show empty state
      setClusters([]);

      setLoading(false);
    } catch (err) {
      console.error('Error loading clusters:', err);
      setError(err instanceof Error ? err.message : 'Failed to load keywords');
      setLoading(false);
    }
  };

  const handleRevealComplete = () => {
    setRevealComplete(true);
  };

  const handleContinue = () => {
    // Go to dashboard after reveal
    router.replace('/dashboard');
  };

  // Show loading state while auth is loading or clusters are loading
  if (authLoading || loading) {
    return (
      <Box minH="100vh" bg="brand.light" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.orange" thickness="4px" speed="0.8s" />
          <Text color="gray.600">Discovering your keyword opportunities...</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg="brand.light" display="flex" alignItems="center" justifyContent="center">
        <Container maxW="container.sm">
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
          <Button mt={4} bg="brand.orange" color="white" onClick={() => router.push('/onboarding')}>
            Go Back
          </Button>
        </Container>
      </Box>
    );
  }

  if (clusters.length === 0) {
    return (
      <Box minH="100vh" bg="brand.light" display="flex" alignItems="center" justifyContent="center">
        <Container maxW="container.sm">
          <VStack spacing={6}>
            <Heading size="lg" textAlign="center">
              No keywords found yet
            </Heading>
            <Text color="gray.600" textAlign="center">
              Let's generate some keyword opportunities for you!
            </Text>
            <Button bg="brand.orange" color="white" onClick={() => router.push('/strategy')}>
              Go to Strategy Dashboard
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="brand.light" position="relative" overflow="hidden">
      {/* Background decoration */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="radial(circle at 20% 50%, brand.orange, transparent 50%), radial(circle at 80% 80%, brand.teal, transparent 50%)"
        opacity={0.1}
        pointerEvents="none"
      />

      <Container maxW="container.xl" py={12} position="relative" zIndex={1}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center" mb={8}>
            <Heading
              size="2xl"
              fontFamily="heading"
              color="gray.800"
              bgGradient="linear(to-r, brand.orange, brand.teal)"
              bgClip="text"
            >
              🎉 Amazing! We Found Your Opportunities
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="2xl" mx="auto">
              We've analyzed your website and discovered{' '}
              <strong>{clusters.length} keyword opportunities</strong> to help you rank higher on
              Google. Here's what we found:
            </Text>
          </VStack>

          {/* Reveal component */}
          <Box minH="600px" display="flex" alignItems="center" justifyContent="center">
            {!revealComplete ? (
              <KeywordReveal clusters={clusters} onComplete={handleRevealComplete} />
            ) : (
              <VStack spacing={6} textAlign="center" maxW="600px" mx="auto">
                <Box
                  w="120px"
                  h="120px"
                  borderRadius="full"
                  bg="brand.orange"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="4xl"
                  animation="pulse 2s ease-in-out infinite"
                >
                  ✨
                </Box>
                <Heading size="xl" fontFamily="heading" color="gray.800">
                  You're All Set!
                </Heading>
                <Text fontSize="lg" color="gray.600" lineHeight="tall">
                  You've discovered{' '}
                  <strong>{clusters.length} keyword opportunities</strong> that can drive traffic
                  to your website. Now let's create a content strategy to help you rank for these
                  keywords.
                </Text>
                <Button
                  size="lg"
                  bg="brand.orange"
                  color="white"
                  px={8}
                  py={6}
                  fontSize="lg"
                  _hover={{ bg: '#E8851A', transform: 'scale(1.05)' }}
                  onClick={handleContinue}
                >
                  Continue to Strategy Dashboard →
                </Button>
              </VStack>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

