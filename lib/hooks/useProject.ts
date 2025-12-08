/**
 * useProject Hook
 *
 * Consolidated hook for project-related data fetching.
 * Reduces duplicate queries across pages.
 */
'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useMemo } from 'react';

interface UseProjectOptions {
  /** Skip fetching if true */
  skip?: boolean;
}

interface UseProjectResult {
  /** The project document */
  project: any | null | undefined;
  /** GA4 connection status */
  ga4Connection: any | null | undefined;
  /** GSC connection status */
  gscConnection: any | null | undefined;
  /** Latest MR score */
  mrScore: any | null | undefined;
  /** Strategy data (clusters + plan) */
  strategyData: any | null | undefined;
  /** Whether any data is still loading */
  isLoading: boolean;
  /** Whether GA4 is connected */
  hasGA4: boolean;
  /** Whether GSC is connected */
  hasGSC: boolean;
  /** Whether the project has clusters */
  hasClusters: boolean;
  /** Whether the project has a plan */
  hasPlan: boolean;
}

export function useProject(
  projectId?: string | null,
  options: UseProjectOptions = {}
): UseProjectResult {
  const { skip = false } = options;

  // Cast to Id type
  const typedProjectId = projectId as Id<'projects'> | undefined;
  const shouldFetch = !skip && !!typedProjectId;

  // Fetch project details
  const project = useQuery(
    api.projects.projects.getProjectById,
    shouldFetch && typedProjectId ? { projectId: typedProjectId } : 'skip'
  );

  // Fetch connections
  const ga4Connection = useQuery(
    api.integrations.ga4Connections.getGA4Connection,
    shouldFetch && typedProjectId ? { projectId: typedProjectId } : 'skip'
  );

  const gscConnection = useQuery(
    api.integrations.gscConnections.getGSCConnection,
    shouldFetch && typedProjectId ? { projectId: typedProjectId } : 'skip'
  );

  // Fetch MR score
  const mrScore = useQuery(
    api.analytics.martaiRatingQueries.getLatestScore,
    shouldFetch && typedProjectId ? { projectId: typedProjectId } : 'skip'
  );

  // Fetch strategy data
  const strategyData = useQuery(
    api.seo.strategy.getStrategyByProject,
    shouldFetch && typedProjectId ? { projectId: typedProjectId } : 'skip'
  );

  // Compute derived state
  const result = useMemo<UseProjectResult>(() => {
    const isLoading =
      project === undefined ||
      ga4Connection === undefined ||
      gscConnection === undefined ||
      mrScore === undefined ||
      strategyData === undefined;

    return {
      project,
      ga4Connection,
      gscConnection,
      mrScore,
      strategyData,
      isLoading,
      hasGA4: !!ga4Connection,
      hasGSC: !!gscConnection,
      hasClusters: (strategyData?.clusters?.length ?? 0) > 0,
      hasPlan: !!strategyData?.plan,
    };
  }, [project, ga4Connection, gscConnection, mrScore, strategyData]);

  return result;
}
