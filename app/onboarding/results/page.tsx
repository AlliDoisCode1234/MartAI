'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, VStack, Heading, Text, Box, Button, HStack, Grid, GridItem, Badge, Divider, Alert, AlertIcon, Spinner } from '@chakra-ui/react';
import { sessionStorageUtil } from '@/lib/storage';

type SEOAnalysis = {
  businessInfo: {
    companyName: string;
    website: string;
    industry: string;
    targetAudience: string;
    monthlyRevenueGoal: string;
  };
  toolResults?: Array<{
    toolName: string;
    result: any;
  }>;
  finalAnswer?: string;
};

export default function ResultsPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorageUtil.getSeoAnalysis<SEOAnalysis>();
    if (stored) {
      setAnalysis(stored);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Box minH="calc(100vh - 64px)" bg="brand.light" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="brand.orange" />
      </Box>
    );
  }

  if (!analysis) {
    return (
      <Box minH="calc(100vh - 64px)" bg="brand.light">
        <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, sm: 6, md: 8, lg: 12 }}>
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            No analysis found. Please start from the beginning.
          </Alert>
          <Button mt={4} bg="brand.orange" color="white" onClick={() => router.push('/onboarding')}>
            Go to Onboarding
          </Button>
        </Container>
      </Box>
    );
  }

  const seoAudit = analysis.toolResults?.find((r) => r.toolName === 'seoAudit')?.result;
  const content = analysis.toolResults?.find((r) => r.toolName === 'generateContent')?.result;
  const socialMedia = analysis.toolResults?.find((r) => r.toolName === 'generateSocialMediaPosts')?.result;

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, sm: 6, md: 8, lg: 12 }}>
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between">
            <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">
              SEO Growth Plan for {analysis.businessInfo.companyName}
            </Heading>
            <Button variant="outline" onClick={() => router.push('/onboarding')}>
              Start Over
            </Button>
          </HStack>

          {analysis.finalAnswer && (
            <Box bg="white" p={6} borderRadius="lg" shadow="md">
              <Heading size="md" mb={4} fontFamily="heading" color="brand.orange">Executive Summary</Heading>
              <Text color="gray.700" lineHeight="tall">{analysis.finalAnswer}</Text>
            </Box>
          )}

          {seoAudit && (
            <Box bg="white" p={6} borderRadius="lg" shadow="md">
              <Heading size="xl" mb={6} fontFamily="heading" color="gray.800">SEO Audit Results</Heading>
              
              <Box mb={6} p={4} bg="brand.light" borderRadius="md">
                <HStack justify="space-between">
                  <Text fontWeight="semibold" fontSize="lg">Overall SEO Score</Text>
                  <Badge bg="brand.orange" color="white" px={4} py={2} borderRadius="md" fontSize="lg">
                    {seoAudit.overallScore}/100
                  </Badge>
                </HStack>
              </Box>

              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6} mb={6}>
                <GridItem>
                  <Box p={4} borderLeft="4px" borderColor="brand.orange" bg="brand.light" borderRadius="md">
                    <Text fontSize="sm" color="gray.600" mb={2}>Technical SEO</Text>
                    <Heading size="lg" color="brand.orange" mb={3}>{seoAudit.technicalSeo.score}/100</Heading>
                    <VStack align="stretch" spacing={2}>
                      {seoAudit.technicalSeo.issues.map((issue: string, i: number) => (
                        <Text key={i} fontSize="xs" color="gray.600">• {issue}</Text>
                      ))}
                    </VStack>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box p={4} borderLeft="4px" borderColor="brand.teal" bg="brand.light" borderRadius="md">
                    <Text fontSize="sm" color="gray.600" mb={2}>On-Page SEO</Text>
                    <Heading size="lg" color="brand.teal" mb={3}>{seoAudit.onPageSeo.score}/100</Heading>
                    <VStack align="stretch" spacing={2}>
                      {seoAudit.onPageSeo.issues.map((issue: string, i: number) => (
                        <Text key={i} fontSize="xs" color="gray.600">• {issue}</Text>
                      ))}
                    </VStack>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box p={4} borderLeft="4px" borderColor="brand.orange" bg="brand.light" borderRadius="md">
                    <Text fontSize="sm" color="gray.600" mb={2}>Content Quality</Text>
                    <Heading size="lg" color="brand.orange" mb={3}>{seoAudit.contentQuality.score}/100</Heading>
                    <VStack align="stretch" spacing={2}>
                      {seoAudit.contentQuality.issues.map((issue: string, i: number) => (
                        <Text key={i} fontSize="xs" color="gray.600">• {issue}</Text>
                      ))}
                    </VStack>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box p={4} borderLeft="4px" borderColor="brand.teal" bg="brand.light" borderRadius="md">
                    <Text fontSize="sm" color="gray.600" mb={2}>Backlinks</Text>
                    <Heading size="lg" color="brand.teal" mb={3}>{seoAudit.backlinks.score}/100</Heading>
                    <VStack align="stretch" spacing={2}>
                      {seoAudit.backlinks.issues.map((issue: string, i: number) => (
                        <Text key={i} fontSize="xs" color="gray.600">• {issue}</Text>
                      ))}
                    </VStack>
                  </Box>
                </GridItem>
              </Grid>

              <Box mt={6}>
                <Heading size="md" mb={4} fontFamily="heading">Priority Actions</Heading>
                <VStack align="stretch" spacing={3}>
                  {seoAudit.priorityActions.map((action: string, i: number) => (
                    <HStack key={i} p={3} bg="brand.light" borderRadius="md">
                      <Text fontWeight="bold" color="brand.orange">{i + 1}.</Text>
                      <Text>{action}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </Box>
          )}

          {content && (
            <Box bg="white" p={6} borderRadius="lg" shadow="md">
              <Heading size="xl" mb={6} fontFamily="heading" color="gray.800">Content Suggestions</Heading>
              
              <Box mb={6}>
                <Heading size="md" mb={4} fontFamily="heading" color="brand.orange">Taglines</Heading>
                <VStack align="stretch" spacing={3}>
                  {content.taglines.map((tagline: string, i: number) => (
                    <Box key={i} p={4} bg="brand.light" borderRadius="md">
                      <Text fontWeight="medium">{tagline}</Text>
                    </Box>
                  ))}
                </VStack>
              </Box>

              <Divider my={6} />

              <Box mb={6}>
                <Heading size="md" mb={4} fontFamily="heading" color="brand.teal">SEO-Optimized Content Ideas</Heading>
                <VStack align="stretch" spacing={4}>
                  {content.seoSuggestions.map((suggestion: any, i: number) => (
                    <Box key={i} p={4} borderLeft="4px" borderColor="brand.teal" bg="brand.light" borderRadius="md">
                      <Text fontWeight="bold" mb={2} color="brand.teal">{suggestion.keyword}</Text>
                      <Text fontWeight="semibold" mb={2}>{suggestion.headline}</Text>
                      <Text fontSize="sm" color="gray.600" mb={2}>{suggestion.metaDescription}</Text>
                      <Badge bg="brand.teal" color="white" fontSize="xs">{suggestion.contentAngle}</Badge>
                    </Box>
                  ))}
                </VStack>
              </Box>

              <Divider my={6} />

              <Box>
                <Heading size="md" mb={4} fontFamily="heading" color="brand.orange">Content Ideas</Heading>
                <VStack align="stretch" spacing={2}>
                  {content.contentIdeas.map((idea: string, i: number) => (
                    <HStack key={i} p={3} bg="brand.light" borderRadius="md">
                      <Text>•</Text>
                      <Text>{idea}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </Box>
          )}

          {socialMedia && (
            <Box bg="white" p={6} borderRadius="lg" shadow="md">
              <Heading size="xl" mb={6} fontFamily="heading" color="gray.800">Social Media Post Suggestions</Heading>
              
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                {socialMedia.linkedin && (
                  <GridItem>
                    <Box p={4} borderLeft="4px" borderColor="brand.teal" bg="brand.light" borderRadius="md">
                      <Heading size="sm" mb={3} fontFamily="heading" color="brand.teal">LinkedIn</Heading>
                      {socialMedia.linkedin.map((post: any, i: number) => (
                        <Box key={i} mb={4} p={3} bg="white" borderRadius="md">
                          <Text fontSize="sm" mb={2}>{post.post}</Text>
                          <HStack spacing={2} flexWrap="wrap">
                            {post.hashtags.map((tag: string, j: number) => (
                              <Badge key={j} bg="brand.teal" color="white" fontSize="xs">{tag}</Badge>
                            ))}
                          </HStack>
                          <Text fontSize="xs" color="gray.500" mt={2}>Best time: {post.bestTime}</Text>
                        </Box>
                      ))}
                    </Box>
                  </GridItem>
                )}

                {socialMedia.twitter && (
                  <GridItem>
                    <Box p={4} borderLeft="4px" borderColor="brand.orange" bg="brand.light" borderRadius="md">
                      <Heading size="sm" mb={3} fontFamily="heading" color="brand.orange">Twitter/X</Heading>
                      {socialMedia.twitter.map((post: any, i: number) => (
                        <Box key={i} mb={4} p={3} bg="white" borderRadius="md">
                          <Text fontSize="sm" mb={2} whiteSpace="pre-line">{post.post}</Text>
                          <HStack spacing={2} flexWrap="wrap">
                            {post.hashtags.map((tag: string, j: number) => (
                              <Badge key={j} bg="brand.orange" color="white" fontSize="xs">{tag}</Badge>
                            ))}
                          </HStack>
                          <Text fontSize="xs" color="gray.500" mt={2}>Best time: {post.bestTime}</Text>
                        </Box>
                      ))}
                    </Box>
                  </GridItem>
                )}

                {socialMedia.instagram && (
                  <GridItem>
                    <Box p={4} borderLeft="4px" borderColor="brand.lavender" bg="brand.light" borderRadius="md">
                      <Heading size="sm" mb={3} fontFamily="heading" color="brand.lavender">Instagram</Heading>
                      {socialMedia.instagram.map((post: any, i: number) => (
                        <Box key={i} mb={4} p={3} bg="white" borderRadius="md">
                          <Text fontSize="sm" mb={2}>{post.caption}</Text>
                          <HStack spacing={2} flexWrap="wrap">
                            {post.hashtags.map((tag: string, j: number) => (
                              <Badge key={j} bg="brand.lavender" color="white" fontSize="xs">{tag}</Badge>
                            ))}
                          </HStack>
                          <Text fontSize="xs" color="gray.500" mt={2}>Best time: {post.bestTime}</Text>
                        </Box>
                      ))}
                    </Box>
                  </GridItem>
                )}

                {socialMedia.facebook && (
                  <GridItem>
                    <Box p={4} borderLeft="4px" borderColor="brand.teal" bg="brand.light" borderRadius="md">
                      <Heading size="sm" mb={3} fontFamily="heading" color="brand.teal">Facebook</Heading>
                      {socialMedia.facebook.map((post: any, i: number) => (
                        <Box key={i} mb={4} p={3} bg="white" borderRadius="md">
                          <Text fontSize="sm" mb={2} whiteSpace="pre-line">{post.post}</Text>
                          <HStack spacing={2} flexWrap="wrap">
                            {post.hashtags.map((tag: string, j: number) => (
                              <Badge key={j} bg="brand.teal" color="white" fontSize="xs">{tag}</Badge>
                            ))}
                          </HStack>
                          <Text fontSize="xs" color="gray.500" mt={2}>Best time: {post.bestTime}</Text>
                        </Box>
                      ))}
                    </Box>
                  </GridItem>
                )}
              </Grid>
            </Box>
          )}

          <HStack justify="center" pt={4}>
            <Button bg="brand.orange" color="white" onClick={() => router.push('/strategy')}>
              View Strategy Dashboard
            </Button>
            <Button variant="outline" onClick={() => router.push('/onboarding')}>
              Generate New Analysis
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}

