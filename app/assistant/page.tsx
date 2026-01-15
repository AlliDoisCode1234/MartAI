'use client';

/**
 * Assistant Page
 *
 * Component Hierarchy:
 * app/assistant/page.tsx (this file)
 * └── PhooChatWidget
 * └── PhooRatingCard
 *
 * AI-powered SEO assistant with Phoo chat interface.
 */

import { Container, VStack, Heading, Box, Text, Grid, Skeleton } from '@chakra-ui/react';
import { useAuth } from '@/lib/useAuth';
import { useProject } from '@/lib/hooks';
import { PhooChatWidget, PhooRatingCard } from '@/src/components/phoo';
import { Id } from '@/convex/_generated/dataModel';

export default function AssistantPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { projectId, isLoading: projectLoading } = useProject(null, { autoSelect: true });
  const typedProjectId = projectId as Id<'projects'> | null;

  if (authLoading || projectLoading) {
    return (
      <Box minH="calc(100vh - 64px)" bg="brand.light">
        <Container
          maxW="container.xl"
          py={{ base: 8, md: 12 }}
          px={{ base: 4, sm: 6, md: 8, lg: 12 }}
        >
          <VStack spacing={8} align="stretch">
            <Skeleton height="40px" width="300px" />
            <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
              <Skeleton height="500px" borderRadius="xl" />
              <Skeleton height="400px" borderRadius="xl" />
            </Grid>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container
        maxW="container.xl"
        py={{ base: 8, md: 12 }}
        px={{ base: 4, sm: 6, md: 8, lg: 12 }}
      >
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack align="start" spacing={1}>
            <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">
              Ask Phoo
            </Heading>
            <Text color="gray.600">
              {isAuthenticated
                ? 'Your AI SEO assistant - ask about keywords, content strategy, or get recommendations.'
                : 'Learn about how Phoo can help your SEO strategy.'}
            </Text>
          </VStack>

          {/* Main Content */}
          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
            {/* Chat Widget */}
            <PhooChatWidget
              projectId={typedProjectId ?? undefined}
              isAuthenticated={isAuthenticated}
            />

            {/* Sidebar */}
            <VStack spacing={6} align="stretch">
              {/* Phoo Rating - only for authenticated users with project */}
              {typedProjectId && <PhooRatingCard projectId={typedProjectId} />}

              {/* Quick Tips */}
              <Box bg="whiteAlpha.50" p={6} borderRadius="xl" boxShadow="lg">
                <Heading size="sm" mb={4} color="white">
                  What to Ask Phoo
                </Heading>
                <VStack spacing={3} align="stretch">
                  <Box p={3} bg="whiteAlpha.100" borderRadius="md">
                    <Text fontSize="sm" color="whiteAlpha.800">
                      "What keywords should I target?"
                    </Text>
                  </Box>
                  <Box p={3} bg="whiteAlpha.100" borderRadius="md">
                    <Text fontSize="sm" color="whiteAlpha.800">
                      "How can I improve my Phoo Rating?"
                    </Text>
                  </Box>
                  <Box p={3} bg="whiteAlpha.100" borderRadius="md">
                    <Text fontSize="sm" color="whiteAlpha.800">
                      "Generate a content brief for my topic"
                    </Text>
                  </Box>
                  <Box p={3} bg="whiteAlpha.100" borderRadius="md">
                    <Text fontSize="sm" color="whiteAlpha.800">
                      "What's my SEO strategy looking like?"
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}
