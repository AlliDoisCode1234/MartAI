'use client';

/**
 * Content Library Page
 *
 * Component Hierarchy:
 * App → StudioLayout → ContentLibrary
 *
 * Grid/list view of all content pieces with filtering, search, and infinite scroll.
 */

import {
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  IconButton,
  Tabs,
  TabList,
  Tab,
  Skeleton,
  Badge,
  Icon,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { usePaginatedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { StudioLayout } from '@/src/components/studio';
import { ContentCard } from '@/src/components/studio/ContentCard';
import { FiSearch, FiGrid, FiList, FiPlus } from 'react-icons/fi';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useProject } from '@/lib/hooks';
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';
import { useLoadingAnnounce } from '@/src/lib/accessibility';
import type { Id } from '@/convex/_generated/dataModel';

type ViewMode = 'grid' | 'list';
type StatusFilter = 'all' | 'draft' | 'published' | 'scheduled';

export default function LibraryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get current project
  const { projectId, isLoading: projectLoading } = useProject(null, { autoSelect: true });

  // Paginated query for content pieces - fetch ALL, filter client-side
  // This ensures counts stay accurate across all tabs
  const { results, status, loadMore } = usePaginatedQuery(
    api.contentPieces.listByProjectPaginated,
    projectId
      ? {
          projectId: projectId as Id<'projects'>,
          // No status filter - fetch all, filter client-side for accurate counts
        }
      : 'skip',
    { initialNumItems: 50 } // Higher initial load since we're filtering client-side
  );

  const isLoadingFirst = status === 'LoadingFirstPage' || projectLoading;
  const isLoadingMore = status === 'LoadingMore';
  const hasMore = status === 'CanLoadMore';

  // Infinite scroll hook
  const { sentinelRef } = useInfiniteScroll({
    loadMore,
    hasMore,
    isLoading: isLoadingMore,
    threshold: 300,
  });

  // Accessibility: Announce loading states to screen readers
  const { Announcer } = useLoadingAnnounce(
    isLoadingFirst || isLoadingMore,
    'Loading content...',
    'Content loaded'
  );

  // Filter by search (client-side for now)
  const filteredContent = useMemo(() => {
    // Apply status filter
    let content = results;
    if (statusFilter !== 'all') {
      content = results.filter((piece) => piece.status === statusFilter);
    }
    // Apply search filter
    if (!searchQuery) return content;
    return content.filter((piece) => piece.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [results, searchQuery, statusFilter]);

  // Count by status
  const counts = useMemo(
    () => ({
      all: results.length,
      draft: results.filter((p) => p.status === 'draft').length,
      published: results.filter((p) => p.status === 'published').length,
      scheduled: results.filter((p) => p.status === 'scheduled').length,
    }),
    [results]
  );

  return (
    <StudioLayout>
      {/* Accessibility: Screen reader announcements */}
      <Announcer />
      <VStack align="stretch" spacing={6}>
        {/* Header */}
        <HStack justify="space-between">
          <Box>
            <Heading size="lg" color="white">
              Content Library
            </Heading>
            <Text color="gray.500" mt={1}>
              {filteredContent.length} {statusFilter === 'all' ? 'total' : statusFilter} pieces
            </Text>
          </Box>
          <Link href="/studio/create">
            <Button
              bg="linear-gradient(135deg, #FF9D00, #FF6B00)"
              color="white"
              _hover={{ opacity: 0.9 }}
              leftIcon={<Icon as={FiPlus} />}
            >
              New Content
            </Button>
          </Link>
        </HStack>

        {/* Search and View Toggle */}
        <HStack spacing={4}>
          <InputGroup flex={1} maxW="400px">
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.500" />
            </InputLeftElement>
            <Input
              placeholder="Search content..."
              bg="rgba(255, 255, 255, 0.05)"
              border="1px solid rgba(255, 255, 255, 0.1)"
              _placeholder={{ color: 'gray.500' }}
              _focus={{
                borderColor: '#FF9D00',
                boxShadow: '0 0 0 1px #FF9D00',
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          <HStack bg="rgba(255, 255, 255, 0.05)" borderRadius="8px" p={1}>
            <IconButton
              aria-label="Grid view"
              icon={<Icon as={FiGrid} />}
              size="sm"
              variant={viewMode === 'grid' ? 'solid' : 'ghost'}
              bg={viewMode === 'grid' ? 'rgba(255, 157, 0, 0.2)' : 'transparent'}
              color={viewMode === 'grid' ? '#FF9D00' : 'gray.400'}
              onClick={() => setViewMode('grid')}
            />
            <IconButton
              aria-label="List view"
              icon={<Icon as={FiList} />}
              size="sm"
              variant={viewMode === 'list' ? 'solid' : 'ghost'}
              bg={viewMode === 'list' ? 'rgba(255, 157, 0, 0.2)' : 'transparent'}
              color={viewMode === 'list' ? '#FF9D00' : 'gray.400'}
              onClick={() => setViewMode('list')}
            />
          </HStack>
        </HStack>

        {/* Status Filter Tabs */}
        <Tabs
          variant="unstyled"
          index={['all', 'draft', 'published', 'scheduled'].indexOf(statusFilter)}
          onChange={(i) =>
            setStatusFilter((['all', 'draft', 'published', 'scheduled'] as const)[i])
          }
        >
          <TabList gap={2}>
            {(['all', 'draft', 'published', 'scheduled'] as const).map((status) => (
              <Tab
                key={status}
                px={4}
                py={2}
                borderRadius="8px"
                color="gray.400"
                _selected={{
                  color: 'white',
                  bg: 'rgba(255, 255, 255, 0.1)',
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <Badge ml={2} bg="rgba(255, 255, 255, 0.1)" color="gray.400">
                  {counts[status]}
                </Badge>
              </Tab>
            ))}
          </TabList>
        </Tabs>

        {/* Content Grid/List */}
        {isLoadingFirst ? (
          <SimpleGrid columns={viewMode === 'grid' ? { base: 1, md: 2, lg: 3 } : 1} spacing={4}>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} height="200px" borderRadius="16px" />
            ))}
          </SimpleGrid>
        ) : filteredContent.length === 0 ? (
          <Box
            bg="rgba(255, 255, 255, 0.03)"
            border="1px dashed rgba(255, 255, 255, 0.1)"
            borderRadius="16px"
            p={12}
            textAlign="center"
          >
            <Text color="gray.500" mb={4}>
              {searchQuery ? 'No content matches your search' : 'Your content library is empty'}
            </Text>
            <Link href="/studio/create">
              <Button
                bg="linear-gradient(135deg, #FF9D00, #FF6B00)"
                color="white"
                _hover={{ opacity: 0.9 }}
              >
                Create Your First Piece
              </Button>
            </Link>
          </Box>
        ) : (
          <>
            <SimpleGrid columns={viewMode === 'grid' ? { base: 1, md: 2, lg: 3 } : 1} spacing={4}>
              {filteredContent.map((piece) => (
                <ContentCard key={piece._id} contentPiece={piece} />
              ))}
            </SimpleGrid>

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} style={{ height: 1 }} />

            {/* Loading more indicator */}
            {isLoadingMore && (
              <Center py={4}>
                <Spinner color="#FF9D00" />
              </Center>
            )}
          </>
        )}
      </VStack>
    </StudioLayout>
  );
}
