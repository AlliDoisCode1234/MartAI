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
  Stack,
  Flex,
  Spacer,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { SearchIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { useQuery, usePaginatedQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';

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
          <Text color="gray.600">Master database with AI-powered Deep Search.</Text>
        </Box>
        <Spacer />
        {/* Placeholder for Seed Button */}
      </Flex>

      <Card mb={8}>
        <CardBody>
          <Flex gap={4}>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search by concept (e.g. 'high intent marketing software')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </InputGroup>
            <Button size="lg" colorScheme="blue" onClick={handleSearch} isLoading={isSearching}>
              Deep Search
            </Button>
          </Flex>
          {searchResults && (
            <Text mt={2} fontSize="sm" color="gray.500">
              Showing vector search results for "{searchQuery}"
              <Button
                size="xs"
                variant="ghost"
                ml={2}
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults(null);
                }}
              >
                Clear
              </Button>
            </Text>
          )}
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
                  <Th isNumeric>Volume</Th>
                  <Th isNumeric>Difficulty</Th>
                  <Th>Intent</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {displayKeywords.map((kw: any) => (
                  <Tr key={kw._id} _hover={{ bg: 'gray.50' }}>
                    <Td fontWeight="medium">
                      <Link
                        as={NextLink}
                        href={`/admin/keywords/${kw._id}`}
                        fontWeight="bold"
                        color="blue.600"
                      >
                        {kw.keyword}
                      </Link>
                    </Td>
                    <Td isNumeric>{kw.searchVolume?.toLocaleString() || '—'}</Td>
                    <Td isNumeric>
                      {kw.difficulty !== undefined ? (
                        <Badge
                          colorScheme={
                            kw.difficulty > 70 ? 'red' : kw.difficulty > 40 ? 'orange' : 'green'
                          }
                        >
                          {kw.difficulty}
                        </Badge>
                      ) : (
                        '—'
                      )}
                    </Td>
                    <Td>
                      {kw.intent && (
                        <Badge variant="subtle" colorScheme="purple">
                          {kw.intent}
                        </Badge>
                      )}
                    </Td>
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
                ))}
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
