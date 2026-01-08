'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Heading,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  Badge,
  Alert,
  AlertIcon,
  Collapse,
} from '@chakra-ui/react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface AnalysisResult {
  url: string;
  metrics: {
    traffic: number;
    keywords: number;
    domainAuthority: number;
  };
  metadata: {
    title: string;
    h1Count: number;
    server: string;
  };
}

export default function AdhocAnalyzer() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toast = useToast();
  const analyze = useMutation(api.analytics.adhoc.analyzeCompetitor);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await analyze({ url });
      setResult(response.data);
      toast({
        title: 'Analysis Complete',
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze URL';
      setError(message);

      // Check for Rate Limit to show upgrade CTA
      if (message.includes('Limit reached')) {
        toast({
          title: 'Limit Reached',
          description: 'Upgrade to Pro for more daily analyses.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: message,
          status: 'error',
          duration: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card variant="outline" mb={8} borderColor="gray.200">
      <CardBody>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="md" mb={2}>
              Competitor / Ad-hoc Analysis
            </Heading>
            <Text color="gray.600" fontSize="sm">
              Enter any URL to analyze its SEO metadata, estimated traffic, and keywords without
              adding it as a project.
            </Text>
          </Box>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl id="url">
                <FormLabel>Target URL</FormLabel>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  isDisabled={isLoading}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isLoading}
                loadingText="Analyzing..."
                width="full"
              >
                Analyze URL
              </Button>
            </VStack>
          </form>

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Collapse in={!!result} animateOpacity>
            {result && (
              <VStack spacing={4} align="stretch" mt={4} p={4} bg="gray.50" borderRadius="md">
                <Heading size="sm">Analysis Results: {result.url}</Heading>
                <StatGroup>
                  <Stat>
                    <StatLabel>Est. Traffic</StatLabel>
                    <StatNumber>{result.metrics.traffic?.toLocaleString()}</StatNumber>
                    <StatHelpText>Monthly Visits</StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel>Keywords</StatLabel>
                    <StatNumber>{result.metrics.keywords}</StatNumber>
                    <StatHelpText>Ranked Terms</StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel>Domain Auth</StatLabel>
                    <StatNumber>{result.metrics.domainAuthority}</StatNumber>
                    <StatHelpText>/ 100</StatHelpText>
                  </Stat>
                </StatGroup>

                <Box>
                  <Text fontWeight="bold" fontSize="sm">
                    Page Title
                  </Text>
                  <Text fontSize="sm" color="gray.700" mb={2}>
                    {result.metadata.title}
                  </Text>

                  <Text fontWeight="bold" fontSize="sm">
                    H1 Headers ({result.metadata.h1Count})
                  </Text>
                  <Text fontSize="sm" color="gray.700" mb={2}>
                    {result.metadata.h1Count > 0 ? 'Present' : 'Missing (Critical Issue)'}
                  </Text>

                  <Text fontWeight="bold" fontSize="sm">
                    Server / Tech
                  </Text>
                  <Badge>{result.metadata.server}</Badge>
                </Box>
              </VStack>
            )}
          </Collapse>
        </VStack>
      </CardBody>
    </Card>
  );
}
