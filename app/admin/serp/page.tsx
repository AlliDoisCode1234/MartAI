'use client';

/**
 * Admin SERP Analyzer Page
 *
 * Component Hierarchy:
 * App → AdminLayout → AdminSerpPage → AdminSerpAnalyzer
 *
 * Admin version of SERP analyzer with NO limits.
 * Allows admins to research any keyword without restrictions.
 */

import { useState } from 'react';
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  Card,
  CardBody,
  HStack,
  Input,
  Button,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Link,
  Alert,
  AlertIcon,
  Spinner,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiSearch, FiExternalLink, FiTrendingUp } from 'react-icons/fi';

interface SerpResult {
  position: number;
  url: string;
  domain: string;
  title: string;
  snippet?: string;
}

// Mock SERP function for admin (no limits)
function generateMockSerpResults(keyword: string): SerpResult[] {
  const domains = [
    'wikipedia.org',
    'forbes.com',
    'hubspot.com',
    'neilpatel.com',
    'moz.com',
    'semrush.com',
    'ahrefs.com',
    'searchenginejournal.com',
    'backlinko.com',
    'contentmarketinginstitute.com',
  ];

  const titlePrefixes = [
    'The Complete Guide to',
    'How to Master',
    '10 Best',
    'What is',
    "Beginner's Guide to",
    '7 Tips for',
    'The Ultimate',
    'Everything You Need to Know About',
    'Why',
    'How',
  ];

  return domains.map((domain, index) => ({
    position: index + 1,
    url: `https://www.${domain}/${keyword.toLowerCase().replace(/\s+/g, '-')}`,
    domain,
    title: `${titlePrefixes[index]} ${keyword} | ${domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)}`,
    snippet: `Learn everything about ${keyword}. This comprehensive guide covers the most important aspects...`,
  }));
}

export default function AdminSerpPage() {
  const [keyword, setKeyword] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<SerpResult[] | null>(null);
  const [analyzedKeyword, setAnalyzedKeyword] = useState('');
  const toast = useToast();

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

    setIsAnalyzing(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate mock results (admins have no limits)
    const mockResults = generateMockSerpResults(keyword.trim());
    setResults(mockResults);
    setAnalyzedKeyword(keyword.trim());

    toast({
      title: 'Analysis complete',
      description: `Found ${mockResults.length} competitors for "${keyword}"`,
      status: 'success',
      duration: 2000,
    });

    setIsAnalyzing(false);
  };

  return (
    <Container maxW="container.xl">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <HStack>
            <Icon as={FiTrendingUp} boxSize={6} color="brand.orange" />
            <Heading size="lg">SERP Analyzer (Admin)</Heading>
          </HStack>
          <Text color="gray.600" mt={1}>
            Research any keyword — no limits for admins
          </Text>
        </Box>

        {/* Admin badge */}
        <Badge colorScheme="purple" alignSelf="flex-start" px={3} py={1}>
          Admin Mode — Unlimited Analyses
        </Badge>

        {/* Input */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="xl">
          <CardBody>
            <VStack spacing={4}>
              <HStack w="full" spacing={3}>
                <Input
                  placeholder="Enter any keyword to analyze..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                  size="lg"
                  borderRadius="lg"
                />
                <Button
                  colorScheme="orange"
                  size="lg"
                  leftIcon={isAnalyzing ? <Spinner size="sm" /> : <Icon as={FiSearch} />}
                  onClick={handleAnalyze}
                  isLoading={isAnalyzing}
                  isDisabled={!keyword.trim()}
                  px={8}
                >
                  Analyze
                </Button>
              </HStack>
              <Text fontSize="sm" color="gray.500">
                See who's ranking for any keyword. Use this for research and building the keyword
                library.
              </Text>
            </VStack>
          </CardBody>
        </Card>

        {/* Results */}
        {results && results.length > 0 && (
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="xl">
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Heading size="md">Top 10 Results for "{analyzedKeyword}"</Heading>
                  <Badge colorScheme="blue">{results.length} competitors</Badge>
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
                      {results.map((result) => (
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
        {!results && !isAnalyzing && (
          <Alert status="info" borderRadius="lg">
            <AlertIcon />
            Enter any keyword to see who's currently ranking for it
          </Alert>
        )}
      </VStack>
    </Container>
  );
}
