'use client';

/**
 * Studio Keywords Page
 *
 * Component Hierarchy:
 * App → StudioLayout → StudioKeywordsPage
 *   → KeywordStatCards
 *   → KeywordFilters
 *   → KeywordTable
 *   → KeywordPagination
 *   → KeywordClusters
 *   → KeywordImport
 *   → KeywordSettings
 *
 * Keywords library integrated into Content Studio (GTM-044).
 * Reuses all keyword components but renders inside StudioLayout
 * instead of the separate KeywordsLayout.
 */

import { useState, useMemo } from 'react';
import {
  VStack,
  Skeleton,
  Box,
  useToast,
  HStack,
  Heading,
  Button,
  Icon,
  Tab,
  TabList,
  Tabs,
} from '@chakra-ui/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useProject } from '@/lib/hooks';
import { EmptyState } from '@/src/components/feedback';
import { StudioLayout } from '@/src/components/studio';
import {
  KeywordStatCards,
  KeywordFilters,
  KeywordTable,
  KeywordPagination,
  KeywordClusters,
  KeywordImport,
  KeywordSettings,
} from '@/src/components/keywords';
import type { CardFilter } from '@/src/components/keywords/KeywordStatCards';
import { FiPlus, FiKey, FiLayers } from 'react-icons/fi';
import { STUDIO_COLORS, STUDIO_CARD } from '@/lib/constants/studioTokens';
import { useRouter } from 'next/navigation';

type EnrichedKeyword = {
  _id: string;
  keyword: string;
  intent: string | null;
  phase: string | null;
  status: string;
  priority: string | null;
  source: string | null;
  searchVolume: number | null;
  difficulty: number | null;
  cpc: number | null;
  gscPosition: number | null;
  previousGscPosition: number | null;
  rankChange: number | null;
  isQuickWin: boolean;
  clusterName: string | null;
  gscClicks: number | null;
  gscImpressions: number | null;
  gscCtr: number | null;
  createdAt: number;
};

const ITEMS_PER_PAGE = 50;
const TAB_KEYS = ['library', 'clusters', 'import', 'settings'] as const;
const TAB_LABELS = ['All Keywords', 'Clusters', 'Import', 'Settings'];

export default function StudioKeywordsPage() {
  const { projectId, isLoading: projectLoading } = useProject(null, { autoSelect: true });
  const router = useRouter();
  const toast = useToast();

  const enrichedKeywordsData = useQuery(
    api.seo.keywordsData.getKeywordsEnriched,
    projectId ? { projectId: projectId as Id<'projects'> } : 'skip'
  );

  const [sortBy, setSortBy] = useState('revenue');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clusterFilter, setClusterFilter] = useState('all');
  const [quickWinFilter, setQuickWinFilter] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('library');
  const [activeCard, setActiveCard] = useState<CardFilter>('all');

  const handleCardFilter = (filter: CardFilter) => {
    setActiveCard(filter);
    setCurrentPage(1);
    switch (filter) {
      case 'all':
        setStatusFilter('all');
        setClusterFilter('all');
        setQuickWinFilter(false);
        break;
      case 'ranking':
        setStatusFilter('all');
        setClusterFilter('all');
        setQuickWinFilter(false);
        break;
      case 'quickwins':
        setStatusFilter('all');
        setClusterFilter('all');
        setQuickWinFilter(true);
        break;
      case 'unclustered':
        setStatusFilter('all');
        setClusterFilter('all');
        setQuickWinFilter(false);
        break;
    }
  };

  const deleteKeywordMut = useMutation(api.seo.keywords.deleteKeyword);
  const deleteKeywordsMut = useMutation(api.seo.keywords.deleteKeywords);

  const handleDelete = async (ids: string[]) => {
    try {
      if (ids.length === 1) {
        await deleteKeywordMut({ keywordId: ids[0] as Id<'keywords'> });
      } else {
        await deleteKeywordsMut({ keywordIds: ids as Id<'keywords'>[] });
      }
      setSelectedIds([]);
      toast({
        title: `Deleted ${ids.length} keyword${ids.length > 1 ? 's' : ''}`,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const processedKeywords = useMemo(() => {
    if (!enrichedKeywordsData) return [];

    let filtered: EnrichedKeyword[] = enrichedKeywordsData.keywords as EnrichedKeyword[];

    // Card-level filter applied first
    if (activeCard === 'ranking') {
      filtered = filtered.filter((kw) => kw.gscPosition !== null);
    } else if (activeCard === 'unclustered') {
      filtered = filtered.filter((kw) => kw.clusterName === null);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((kw) => kw.status === statusFilter);
    }
    if (clusterFilter !== 'all') {
      filtered = filtered.filter((kw) => kw.clusterName === clusterFilter);
    }
    if (quickWinFilter) {
      filtered = filtered.filter((kw) => kw.isQuickWin);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (kw) =>
          kw.keyword.toLowerCase().includes(q) ||
          (kw.clusterName && kw.clusterName.toLowerCase().includes(q))
      );
    }

    const sorted = [...filtered];
    switch (sortBy) {
      case 'revenue':
        sorted.sort((a, b) => {
          const aScore = (a.searchVolume ?? 0) * (a.isQuickWin ? 2 : 1);
          const bScore = (b.searchVolume ?? 0) * (b.isQuickWin ? 2 : 1);
          return bScore - aScore;
        });
        break;
      case 'volume':
        sorted.sort((a, b) => (b.searchVolume ?? 0) - (a.searchVolume ?? 0));
        break;
      case 'difficulty':
        sorted.sort((a, b) => (a.difficulty ?? 999) - (b.difficulty ?? 999));
        break;
      case 'rank':
        sorted.sort((a, b) => (a.gscPosition ?? 999) - (b.gscPosition ?? 999));
        break;
      case 'recent':
        sorted.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'quickwins':
        sorted.sort((a, b) => {
          if (a.isQuickWin && !b.isQuickWin) return -1;
          if (!a.isQuickWin && b.isQuickWin) return 1;
          return (b.searchVolume ?? 0) - (a.searchVolume ?? 0);
        });
        break;
    }

    return sorted;
  }, [enrichedKeywordsData, activeCard, statusFilter, clusterFilter, quickWinFilter, search, sortBy]);

  const totalPages = Math.ceil(processedKeywords.length / ITEMS_PER_PAGE);
  const safePage = Math.min(currentPage, Math.max(1, totalPages));
  const pageKeywords = processedKeywords.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  function handleFilterChange<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setCurrentPage(1);
    };
  }

  const getTabIndex = () => TAB_KEYS.indexOf(activeTab as (typeof TAB_KEYS)[number]);
  const handleTabChange = (index: number) => setActiveTab(TAB_KEYS[index]);

  if (projectLoading || enrichedKeywordsData === undefined) {
    return (
      <StudioLayout>
        <VStack spacing={4} align="stretch">
          <Skeleton height="80px" startColor="gray.200" endColor="gray.100" borderRadius="xl" />
          <Skeleton height="300px" startColor="gray.200" endColor="gray.100" borderRadius="xl" />
        </VStack>
      </StudioLayout>
    );
  }

  const isEmpty = !enrichedKeywordsData || enrichedKeywordsData.keywords.length === 0;

  // ── DEBUG: Log all Google-sourced keyword data ───────────────────
  console.group('[KEYWORDS DEBUG] Google Data Snapshot');

  console.groupEnd();

  return (
    <StudioLayout>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Icon as={FiKey} boxSize={6} color={STUDIO_COLORS.amber} />
            <Heading size="lg" color="gray.800">
              Keywords Library
            </Heading>
          </HStack>
          <Button
            leftIcon={activeTab === 'clusters' ? <FiLayers /> : <FiPlus />}
            bg={STUDIO_COLORS.amber}
            color="black"
            _hover={{ bg: '#E68A00' }}
            size="md"
            onClick={() => {
              if (activeTab !== 'clusters') {
                setActiveTab('import');
              }
            }}
          >
            {activeTab === 'clusters' ? 'Add New Cluster' : 'Add Keywords'}
          </Button>
        </HStack>

        {/* Tab Navigation */}
        <Tabs index={getTabIndex()} onChange={handleTabChange} variant="unstyled">
          <TabList gap={2}>
            {TAB_LABELS.map((label) => (
              <Tab
                key={label}
                color="gray.500"
                fontWeight="medium"
                px={4}
                py={2}
                borderRadius="8px"
                _selected={{
                  color: 'gray.800',
                  bg: 'orange.50',
                  borderBottom: `2px solid ${STUDIO_COLORS.amber}`,
                  fontWeight: 'semibold',
                }}
                _hover={{
                  color: 'gray.700',
                  bg: 'gray.50',
                }}
              >
                {label}
              </Tab>
            ))}
          </TabList>
        </Tabs>

        {/* All Keywords panel */}
        <Box display={activeTab === 'library' ? 'block' : 'none'}>
          {isEmpty ? (
            <EmptyState type="keywords" />
          ) : (
            <VStack spacing={6} align="stretch">
              <KeywordStatCards
                total={enrichedKeywordsData.stats.total}
                rankingOnGoogle={enrichedKeywordsData.stats.rankingOnGoogle}
                quickWins={enrichedKeywordsData.stats.quickWins}
                unclustered={enrichedKeywordsData.stats.unclustered}
                activeFilter={activeCard}
                onFilterChange={handleCardFilter}
              />

              <KeywordFilters
                sortBy={sortBy}
                onSortChange={handleFilterChange(setSortBy)}
                statusFilter={statusFilter}
                onStatusChange={handleFilterChange(setStatusFilter)}
                clusterFilter={clusterFilter}
                onClusterChange={handleFilterChange(setClusterFilter)}
                quickWinFilter={quickWinFilter}
                onQuickWinChange={handleFilterChange(setQuickWinFilter)}
                search={search}
                onSearchChange={handleFilterChange(setSearch)}
                clusterNames={enrichedKeywordsData.clusterNames}
                quickWinCount={enrichedKeywordsData.stats.quickWins}
              />

              <KeywordTable
                keywords={pageKeywords}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onDelete={handleDelete}
                projectId={projectId as string}
              />

              <KeywordPagination
                currentPage={safePage}
                totalPages={totalPages}
                totalItems={processedKeywords.length}
                itemsShown={pageKeywords.length}
                onPageChange={setCurrentPage}
              />
            </VStack>
          )}
        </Box>

        {/* Clusters panel */}
        <Box display={activeTab === 'clusters' ? 'block' : 'none'}>
          <KeywordClusters />
        </Box>

        {/* Import panel */}
        <Box display={activeTab === 'import' ? 'block' : 'none'}>
          <KeywordImport />
        </Box>

        {/* Settings panel */}
        <Box display={activeTab === 'settings' ? 'block' : 'none'}>
          <KeywordSettings />
        </Box>
      </VStack>
    </StudioLayout>
  );
}
