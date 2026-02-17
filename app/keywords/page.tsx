'use client';

/**
 * Keywords Page
 *
 * Component Hierarchy:
 * App -> KeywordsLayout -> KeywordsPage (this file)
 *   -> KeywordStatCards
 *   -> KeywordFilters
 *   -> KeywordTable
 *   -> KeywordPagination
 *
 * Keyword library with server-side enriched data,
 * filtering, sorting, and client-side pagination.
 */

import { useState, useMemo } from 'react';
import { VStack, Skeleton, Box, useToast } from '@chakra-ui/react';
import { useQuery, useConvexAuth, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useProject } from '@/lib/hooks';
import { EmptyState } from '@/src/components/feedback';
import {
  KeywordsLayout,
  KeywordStatCards,
  KeywordFilters,
  KeywordTable,
  KeywordPagination,
  KeywordClusters,
  KeywordImport,
  KeywordSettings,
} from '@/src/components/keywords';

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

export default function KeywordsPage() {
  const { isLoading: authLoading } = useConvexAuth();
  const { projectId, isLoading: projectLoading } = useProject(null, { autoSelect: true });

  // Server-side enriched query (cluster join, stats, quick win)
  const data = useQuery(
    api.seo.keywordsData.getKeywordsEnriched,
    projectId ? { projectId: projectId as Id<'projects'> } : 'skip'
  );

  // Filter + sort state
  const [sortBy, setSortBy] = useState('revenue');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clusterFilter, setClusterFilter] = useState('all');
  const [quickWinFilter, setQuickWinFilter] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('library');
  const toast = useToast();

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

  // Filter, search, and sort keywords
  const processedKeywords = useMemo(() => {
    if (!data) return [];

    let filtered: EnrichedKeyword[] = data.keywords as EnrichedKeyword[];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((kw) => kw.status === statusFilter);
    }

    // Cluster filter
    if (clusterFilter !== 'all') {
      filtered = filtered.filter((kw) => kw.clusterName === clusterFilter);
    }

    // Quick Win filter
    if (quickWinFilter) {
      filtered = filtered.filter((kw) => kw.isQuickWin);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (kw) =>
          kw.keyword.toLowerCase().includes(q) ||
          (kw.clusterName && kw.clusterName.toLowerCase().includes(q))
      );
    }

    // Sort
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
  }, [data, statusFilter, clusterFilter, quickWinFilter, search, sortBy]);

  // Pagination
  const totalPages = Math.ceil(processedKeywords.length / ITEMS_PER_PAGE);
  const safePage = Math.min(currentPage, Math.max(1, totalPages));
  const pageKeywords = processedKeywords.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  // Reset page on filter change
  function handleFilterChange<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setCurrentPage(1);
    };
  }

  // Loading state
  if (authLoading || projectLoading || data === undefined) {
    return (
      <KeywordsLayout>
        <VStack spacing={4} align="stretch">
          <Skeleton height="80px" startColor="gray.700" endColor="gray.600" borderRadius="xl" />
          <Skeleton height="300px" startColor="gray.700" endColor="gray.600" borderRadius="xl" />
        </VStack>
      </KeywordsLayout>
    );
  }

  const isEmpty = !data || data.keywords.length === 0;

  return (
    <KeywordsLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {/* All Keywords panel */}
      <Box display={activeTab === 'library' ? 'block' : 'none'}>
        {isEmpty ? (
          <EmptyState type="keywords" />
        ) : (
          <VStack spacing={6} align="stretch">
            <KeywordStatCards
              foundation={data.stats.foundation}
              authority={data.stats.authority}
              revenueReady={data.stats.revenueReady}
              total={data.stats.total}
              quickWins={data.stats.quickWins}
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
              clusterNames={data.clusterNames}
              quickWinCount={data.stats.quickWins}
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
    </KeywordsLayout>
  );
}
