/**
 * useKeywords Hook
 *
 * Consolidated hook for keyword-related data.
 * Includes clusters, GSC keywords, and keyword library.
 */
'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useMemo } from 'react';

interface UseKeywordsOptions {
  /** Skip fetching if true */
  skip?: boolean;
  /** Max keywords to fetch */
  limit?: number;
}

interface UseKeywordsResult {
  /** Active keyword clusters */
  clusters: any[] | undefined;
  /** GSC keywords (latest snapshot) */
  gscKeywords: any[] | undefined;
  /** Project keywords */
  projectKeywords: any[] | undefined;
  /** Whether any data is still loading */
  isLoading: boolean;
  /** Total cluster count */
  clusterCount: number;
  /** Total keyword count */
  keywordCount: number;
}

export function useKeywords(
  projectId?: string | null,
  options: UseKeywordsOptions = {}
): UseKeywordsResult {
  const { skip = false, limit = 50 } = options;

  const typedProjectId = projectId as Id<'projects'> | undefined;
  const shouldFetch = !skip && !!typedProjectId;

  // Fetch clusters
  const clusters = useQuery(
    api.seo.keywordClusters.getActiveClusters,
    shouldFetch && typedProjectId ? { projectId: typedProjectId } : 'skip'
  );

  // Fetch latest GSC keywords
  const gscKeywords = useQuery(
    api.analytics.gscKeywords.getLatestKeywords,
    shouldFetch && typedProjectId ? { projectId: typedProjectId, limit } : 'skip'
  );

  // Fetch project keywords
  const projectKeywords = useQuery(
    api.seo.keywords.getKeywordsByProject,
    shouldFetch && typedProjectId ? { projectId: typedProjectId } : 'skip'
  );

  const result = useMemo<UseKeywordsResult>(() => {
    const isLoading =
      clusters === undefined || gscKeywords === undefined || projectKeywords === undefined;

    return {
      clusters: clusters ?? [],
      gscKeywords: gscKeywords ?? [],
      projectKeywords: projectKeywords ?? [],
      isLoading,
      clusterCount: clusters?.length ?? 0,
      keywordCount: projectKeywords?.length ?? 0,
    };
  }, [clusters, gscKeywords, projectKeywords]);

  return result;
}
