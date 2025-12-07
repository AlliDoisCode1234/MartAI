'use client';

import { useState, useEffect } from 'react';

import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  Button,
  HStack,
  Badge,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Alert,
  AlertIcon,
  Spinner,
} from '@chakra-ui/react';
import { useQuery, usePaginatedQuery, useConvexAuth } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

export default function KeywordsPage() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const user = useQuery(api.users.current);

  // Project Logic
  const projects = useQuery(
    api.projects.projects.getProjectsByUser,
    user?._id ? { userId: user._id } : 'skip'
  );
  const projectList = (projects ?? []) as Array<{ _id: Id<'projects'>; name?: string }>;
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Initialize selected project
  useEffect(() => {
    if (projectList.length > 0 && !selectedProjectId) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('currentProjectId');
        const match = projectList.find((p) => p._id === stored);
        setSelectedProjectId(match ? match._id : projectList[0]._id);
      } else {
        setSelectedProjectId(projectList[0]._id);
      }
    }
  }, [projectList, selectedProjectId]);

  // Paginated Query
  const { results, status, loadMore } = usePaginatedQuery(
    api.seo.keywords.getKeywords,
    selectedProjectId ? { projectId: selectedProjectId as Id<'projects'> } : 'skip',
    { initialNumItems: 50 }
  );

  const [filter, setFilter] = useState({ status: 'all', priority: 'all' });
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  // Simple Client-side Filtering (on loaded items)
  // Ideally this happens server-side, but requires complex indexing
  const filteredKeywords = (results || []).filter((kw) => {
    if (filter.status !== 'all' && kw.status !== filter.status) return false;
    if (filter.priority !== 'all' && kw.priority !== filter.priority) return false;
    return true;
  });

  const getIntentColor = (intent?: string) => {
    switch (intent) {
      case 'transactional':
        return 'red';
      case 'commercial':
        return 'orange';
      case 'informational':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  const handleCreatePage = async (platform: 'wordpress' | 'shopify') => {
    // Logic for create page (kept as placeholder or needs update to fetch details from DB if needed)
    // Since specific keyword details might be sufficient from the row, we can keep using 'filteredKeywords'
    alert('Automation integration requires updated backend logic.');
  };

  if (authLoading || (user && !projects)) {
    return (
      <Box
        minH="calc(100vh - 64px)"
        bg="brand.light"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" color="brand.orange" />
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
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">
                Keyword Research
              </Heading>
              <Text color="gray.500">
                Project:{' '}
                {projectList.find((p) => p._id === selectedProjectId)?.name || 'Loading...'}
              </Text>
            </VStack>

            <HStack>
              <Button
                bg="brand.orange"
                color="white"
                onClick={() => handleCreatePage('wordpress')}
                isDisabled={selectedKeywords.length === 0}
              >
                Create WordPress Page
              </Button>
              <Button
                bg="brand.teal"
                color="white"
                onClick={() => handleCreatePage('shopify')}
                isDisabled={selectedKeywords.length === 0}
              >
                Create Shopify Page
              </Button>
            </HStack>
          </HStack>

          {!results || results.length === 0 ? (
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              No keywords found for this project. Run an analysis in the Dashboard to generate
              ideas.
            </Alert>
          ) : (
            <>
              <HStack spacing={4}>
                <Select
                  value={filter.status}
                  onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                  maxW="200px"
                  bg="white"
                >
                  <option value="all">All Status</option>
                  <option value="suggested">Suggested</option>
                  <option value="approved">Approved</option>
                  <option value="implemented">Implemented</option>
                </Select>
                <Select
                  value={filter.priority}
                  onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
                  maxW="200px"
                  bg="white"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Select>
                <Text color="gray.600">
                  Showing {filteredKeywords.length} of {results.length} loaded
                </Text>
              </HStack>

              <Box bg="white" p={6} borderRadius="lg" shadow="md" overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Select</Th>
                      <Th>Keyword</Th>
                      <Th>Intent</Th>
                      <Th>Priority</Th>
                      <Th>Volume</Th>
                      <Th>Difficulty</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredKeywords.map((keyword) => (
                      <Tr key={keyword._id} _hover={{ bg: 'gray.50' }}>
                        <Td>
                          <input
                            type="checkbox"
                            checked={selectedKeywords.includes(keyword._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedKeywords([...selectedKeywords, keyword._id]);
                              } else {
                                setSelectedKeywords(
                                  selectedKeywords.filter((id) => id !== keyword._id)
                                );
                              }
                            }}
                          />
                        </Td>
                        <Td>
                          <Link
                            as={NextLink}
                            href={`/keywords/${keyword._id}`}
                            _hover={{ textDecor: 'underline', color: 'brand.orange' }}
                          >
                            <Text fontWeight="medium">{keyword.keyword}</Text>
                          </Link>
                        </Td>
                        <Td>
                          <Badge colorScheme={getIntentColor(keyword.intent)}>
                            {keyword.intent || 'N/A'}
                          </Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme={getPriorityColor(keyword.priority)}>
                            {keyword.priority || 'medium'}
                          </Badge>
                        </Td>
                        <Td>
                          {keyword.searchVolume ? keyword.searchVolume.toLocaleString() : 'N/A'}
                        </Td>
                        <Td>{keyword.difficulty ? `${keyword.difficulty}/100` : 'N/A'}</Td>
                        <Td>
                          <Badge>{keyword.status}</Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>

                {status !== 'Exhausted' && (
                  <Button
                    mt={4}
                    w="full"
                    onClick={() => loadMore(50)}
                    isLoading={status === 'LoadingMore'}
                    disabled={status === 'LoadingMore'}
                  >
                    Load More Keywords
                  </Button>
                )}
              </Box>
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
