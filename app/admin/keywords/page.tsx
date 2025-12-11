'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Card,
  CardBody,
  Input,
  Button,
  InputGroup,
  InputLeftElement,
  Flex,
  Spacer,
  IconButton,
  Tooltip,
  HStack,
  VStack,
  Progress,
  Icon,
} from '@chakra-ui/react';
import { SearchIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { FiZap, FiTrendingUp, FiTarget } from 'react-icons/fi';
import { usePaginatedQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { getDifficultyLabel, getVolumeLabel, getIntentLabel } from '@/src/lib/copyStrings';

export default function AdminKeywordsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Default List (Paginated)
  const {
    results: defaultKeywords,
    status,
    loadMore,
    isLoading,
  } = usePaginatedQuery(api.seo.library.listKeywords, {}, { initialNumItems: 20 });

  // Search Action
  const performSearch = useAction(api.seo.library.searchLibrary);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    setIsSearching(true);
    try {
      const results = await performSearch({ query: searchQuery });
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const displayKeywords = searchResults || defaultKeywords || [];

  return (
    <Container maxW="container.xl" py={8}>
      <Flex mb={8} align="center">
        <Box>
          <Heading size="lg">Global Keyword Library</Heading>
          <Text color="gray.600">Master database with AI-powered semantic search.</Text>
        </Box>
        <Spacer />
        <Badge colorScheme="purple" fontSize="md" px={3} py={1}>
          {defaultKeywords?.length || 0}+ keywords
        </Badge>
      </Flex>

      <Card mb={8}>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Flex gap={4}>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search by topic (e.g., 'content marketing strategy')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </InputGroup>
              <Button size="lg" colorScheme="purple" onClick={handleSearch} isLoading={isSearching}>
                Semantic Search
              </Button>
            </Flex>
            {searchResults && (
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.500">
                  Found {searchResults.length} semantically related keywords for "{searchQuery}"
                </Text>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults(null);
                  }}
                >
                  Clear Search
                </Button>
              </HStack>
            )}
          </VStack>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          {isLoading && !displayKeywords.length ? (
            <Text color="gray.500">Loading library...</Text>
          ) : displayKeywords.length === 0 ? (
            <Text color="gray.500">No keywords found in the library.</Text>
          ) : (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Keyword</Th>
                  <Th>Opportunity</Th>
                  <Th>Traffic</Th>
                  <Th>Intent</Th>
                  {searchResults && <Th isNumeric>Match</Th>}
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {displayKeywords.map((kw: any) => {
                  const difficulty = getDifficultyLabel(kw.difficulty || 50);
                  const volume = getVolumeLabel(kw.searchVolume || 0);
                  const intent = getIntentLabel(kw.intent || 'informational');

                  return (
                    <Tr key={kw._id} _hover={{ bg: 'gray.50' }}>
                      <Td>
                        <Link
                          as={NextLink}
                          href={`/admin/keywords/${kw._id}`}
                          fontWeight="bold"
                          color="blue.600"
                        >
                          {kw.keyword}
                        </Link>
                      </Td>
                      <Td>
                        <Tooltip label={difficulty.advice}>
                          <Badge
                            colorScheme={difficulty.color}
                            variant="subtle"
                            display="flex"
                            alignItems="center"
                            gap={1}
                            w="fit-content"
                          >
                            <Icon as={FiZap} boxSize={3} />
                            {difficulty.label}
                          </Badge>
                        </Tooltip>
                      </Td>
                      <Td>
                        <Tooltip label={volume.description}>
                          <Badge
                            colorScheme="gray"
                            variant="outline"
                            display="flex"
                            alignItems="center"
                            gap={1}
                            w="fit-content"
                          >
                            <Icon as={FiTrendingUp} boxSize={3} />
                            {volume.label}
                          </Badge>
                        </Tooltip>
                      </Td>
                      <Td>
                        <Tooltip label={intent.advice}>
                          <Badge colorScheme={intent.color}>{intent.label}</Badge>
                        </Tooltip>
                      </Td>
                      {searchResults && (
                        <Td isNumeric>
                          <HStack justify="flex-end" spacing={2}>
                            <Progress
                              value={(kw._score || 0) * 100}
                              size="xs"
                              colorScheme="purple"
                              w="50px"
                              borderRadius="full"
                            />
                            <Text fontSize="xs" color="gray.500">
                              {Math.round((kw._score || 0) * 100)}%
                            </Text>
                          </HStack>
                        </Td>
                      )}
                      <Td>
                        <Link as={NextLink} href={`/admin/keywords/${kw._id}`}>
                          <IconButton
                            aria-label="View details"
                            icon={<ArrowForwardIcon />}
                            size="sm"
                            variant="ghost"
                          />
                        </Link>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          )}

          {/* Pagination for Default List */}
          {!searchResults && status !== 'Exhausted' && (
            <Button
              mt={4}
              w="full"
              variant="outline"
              onClick={() => loadMore(20)}
              isLoading={status === 'LoadingMore'}
              disabled={status === 'LoadingMore'}
            >
              Load More Keywords
            </Button>
          )}
        </CardBody>
      </Card>
    </Container>
  );
}
