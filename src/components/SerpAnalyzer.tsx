/**
 * SerpAnalyzer Component
 *
 * Component Hierarchy:
 * App → CompetitorsPage → SerpAnalyzer
 *
 * Input field + button to analyze SERP for any keyword.
 * Shows top 10 competitor rankings.
 */

'use client';

import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Heading,
  Text,
  Card,
  CardBody,
  Badge,
  Icon,
  Alert,
  AlertIcon,
  Spinner,
  useToast,
  Link,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiSearch, FiExternalLink, FiLock } from 'react-icons/fi';
import { useAction, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

interface Props {
  projectId: Id<'projects'>;
}

interface SerpResult {
  position: number;
  url: string;
  domain: string;
  title: string;
  snippet?: string;
  isAd?: boolean;
}

export function SerpAnalyzer({ projectId }: Props) {
  const [keyword, setKeyword] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<SerpResult[] | null>(null);
  const toast = useToast();

  const analyzeSERP = useAction(api.seo.serpAnalysis.analyzeSERP);
  const limitCheck = useQuery(api.seo.serpAnalysis.canAnalyze, { projectId });
  const existingAnalyses = useQuery(api.seo.serpAnalysis.getByProject, { projectId });

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleAnalyze = async () => {
    if (!keyword.trim()) {
      toast({
        title: 'Enter a keyword',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    if (limitCheck && !limitCheck.canAnalyze) {
      toast({
        title: 'Limit reached',
        description: 'Upgrade to analyze more keywords.',
        status: 'info',
        duration: 3000,
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await analyzeSERP({
        projectId,
        keyword: keyword.trim(),
        location: 'US',
      });

      if (response.success && response.results) {
        setResults(response.results);
        toast({
          title: 'Analysis complete',
          description: `Found ${response.results.length} competitors`,
          status: 'success',
          duration: 2000,
        });
      } else if (response.limitReached) {
        toast({
          title: 'Limit reached',
          description: response.error,
          status: 'warning',
          duration: 4000,
        });
      } else {
        throw new Error(response.error || 'Analysis failed');
      }
    } catch (error: any) {
      toast({
        title: 'Analysis failed',
        description: error?.message || 'Please try again',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Show existing analysis if available
  const displayResults = results || (existingAnalyses?.[0]?.results as SerpResult[] | undefined);
  const displayKeyword = results ? keyword : existingAnalyses?.[0]?.keyword;

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Box>
        <Heading size="lg" fontFamily="heading" color="gray.800">
          SERP Analyzer
        </Heading>
        <Text color="gray.600" mt={1}>
          See who's ranking for any keyword — your competition
        </Text>
      </Box>

      {/* Limit indicator */}
      {limitCheck && (
        <HStack>
          <Badge colorScheme={limitCheck.canAnalyze ? 'green' : 'orange'}>
            {limitCheck.used}/{limitCheck.limit} analyses used
          </Badge>
          {!limitCheck.canAnalyze && (
            <Badge colorScheme="purple" cursor="pointer">
              <HStack spacing={1}>
                <Icon as={FiLock} boxSize={3} />
                <Text>Upgrade for more</Text>
              </HStack>
            </Badge>
          )}
        </HStack>
      )}

      {/* Input */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="xl">
        <CardBody>
          <VStack spacing={4}>
            <HStack w="full" spacing={3}>
              <Input
                placeholder="Enter a keyword to analyze..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                size="lg"
                borderRadius="lg"
                isDisabled={limitCheck && !limitCheck.canAnalyze}
              />
              <Button
                colorScheme="orange"
                size="lg"
                leftIcon={isAnalyzing ? <Spinner size="sm" /> : <Icon as={FiSearch} />}
                onClick={handleAnalyze}
                isLoading={isAnalyzing}
                isDisabled={!keyword.trim() || (limitCheck && !limitCheck.canAnalyze)}
                px={8}
              >
                Analyze
              </Button>
            </HStack>
            <Text fontSize="sm" color="gray.500">
              Discover who ranks for this keyword and what content they're using
            </Text>
          </VStack>
        </CardBody>
      </Card>

      {/* Results */}
      {displayResults && displayResults.length > 0 && (
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="xl">
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Heading size="md">Top 10 Results for "{displayKeyword}"</Heading>
                <Badge colorScheme="blue">{displayResults.length} competitors</Badge>
              </HStack>

              <Box overflowX="auto">
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th w="60px">#</Th>
                      <Th>Page</Th>
                      <Th>Domain</Th>
                      <Th w="80px">Link</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {displayResults.map((result) => (
                      <Tr key={result.position}>
                        <Td>
                          <Badge
                            colorScheme={result.position <= 3 ? 'green' : 'gray'}
                            variant={result.position <= 3 ? 'solid' : 'subtle'}
                          >
                            {result.position}
                          </Badge>
                        </Td>
                        <Td>
                          <Text fontWeight="medium" noOfLines={1}>
                            {result.title}
                          </Text>
                          {result.snippet && (
                            <Text fontSize="xs" color="gray.500" noOfLines={1}>
                              {result.snippet}
                            </Text>
                          )}
                        </Td>
                        <Td>
                          <Badge variant="outline">{result.domain}</Badge>
                        </Td>
                        <Td>
                          <Link href={result.url} isExternal>
                            <Icon as={FiExternalLink} color="blue.500" />
                          </Link>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Empty state */}
      {!displayResults && !isAnalyzing && (
        <Alert status="info" borderRadius="lg">
          <AlertIcon />
          Enter a keyword above to see who's ranking for it
        </Alert>
      )}
    </VStack>
  );
}
