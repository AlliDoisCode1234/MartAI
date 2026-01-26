/**
 * useProject Hook
 *
 * Consolidated hook for project-related data fetching.
 * Supports auto-selecting current project from localStorage/user projects.
 * Reduces duplicate queries and project selection logic across pages.
 */
'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useMemo, useState, useEffect, useCallback } from 'react';
import type { ConnectionData, StrategyData } from '@/types';
import type { CanonicalMetrics } from '@/convex/canonical/metrics';
import type { CanonicalRating } from '@/convex/canonical/rating';

interface UseProjectOptions {
  /** Skip fetching if true */
  skip?: boolean;
  /** Auto-select project from localStorage or user's first project */
  autoSelect?: boolean;
}

/** Project document shape from hook */
interface ProjectData {
  _id: Id<'projects'>;
  name: string;
  websiteUrl?: string;
  industry?: string;
  projectType?: 'own' | 'competitor';
  serpAnalysisUsed?: boolean;
}

interface UseProjectResult {
  /** The resolved project ID (from param or auto-selected) */
  projectId: string | null;
  /** The project document */
  project: ProjectData | null | undefined;
  /** GA4 connection status */
  ga4Connection: ConnectionData | null | undefined;
  /** GSC connection status */
  gscConnection: ConnectionData | null | undefined;
  /** Canonical rating (unified Phoo Rating) */
  rating: CanonicalRating | null | undefined;
  /** Canonical metrics (keywords, clusters, content counts) */
  metrics: CanonicalMetrics | null | undefined;
  /**
   * @deprecated Use `metrics` for counts or query getFullStrategy directly.
   * Strategy data with full clusters and plan (kept for backward compatibility)
   */
  strategyData: StrategyData | null | undefined;
  /** Whether any data is still loading */
  isLoading: boolean;
  /** Whether project selection is still loading (for autoSelect mode) */
  isSelectingProject: boolean;
  /** Whether GA4 is connected */
  hasGA4: boolean;
  /** Whether GSC is connected */
  hasGSC: boolean;
  /** Whether the project has clusters */
  hasClusters: boolean;
  /** Whether the project has a plan */
  hasPlan: boolean;
  /** Set the current project (updates localStorage) */
  setCurrentProject: (projectId: string) => void;
  /** PROJ-001: Project type ('own' or 'competitor') */
  projectType: 'own' | 'competitor' | null;
  /** PROJ-001: Whether this is a competitor analysis project (limited features) */
  isCompetitor: boolean;
  /** PROJ-001: Whether SERP analysis has been used for this project */
  serpAnalysisUsed: boolean;
}

export function useProject(
  projectId?: string | null,
  options: UseProjectOptions = {}
): UseProjectResult {
  const { skip = false, autoSelect = false } = options;

  // State for auto-selected project
  const [autoSelectedId, setAutoSelectedId] = useState<string | null>(null);
  const [isSelectingProject, setIsSelectingProject] = useState(autoSelect);

  // Fetch user's projects if autoSelect is enabled
  const user = useQuery(api.users.current, autoSelect ? undefined : 'skip');
  const userProjects = useQuery(
    api.projects.projects.getProjectsByUser,
    autoSelect && user?._id ? { userId: user._id as unknown as Id<'users'> } : 'skip'
  );

  // Auto-select logic
  useEffect(() => {
    if (!autoSelect) return;
    if (userProjects === undefined) return; // Still loading

    setIsSelectingProject(false);

    if (!userProjects || userProjects.length === 0) {
      setAutoSelectedId(null);
      return;
    }

    // Check localStorage for stored project
    const storedId =
      typeof window !== 'undefined' ? localStorage.getItem('currentProjectId') : null;

    // Validate stored ID exists in user's projects
    const matchedProject = storedId
      ? userProjects.find((p: { _id: string }) => p._id === storedId)
      : null;

    const selectedProject = matchedProject ?? userProjects[0];
    const selectedId = selectedProject._id as string;

    if (selectedId !== autoSelectedId) {
      setAutoSelectedId(selectedId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentProjectId', selectedId);
      }
    }
  }, [autoSelect, userProjects, autoSelectedId]);

  // Determine final project ID to use
  const resolvedProjectId = autoSelect ? autoSelectedId : projectId;

  // Set current project callback
  const setCurrentProject = useCallback(
    (newProjectId: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentProjectId', newProjectId);
      }
      if (autoSelect) {
        setAutoSelectedId(newProjectId);
      }
    },
    [autoSelect]
  );

  // Cast to Id type
  const typedProjectId = resolvedProjectId as Id<'projects'> | undefined;
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

  // Fetch canonical rating (unified Phoo Rating - replaces mrScore)
  const rating = useQuery(
    api.canonical.rating.getCanonicalRating,
    shouldFetch && typedProjectId ? { projectId: typedProjectId } : 'skip'
  );

  // Fetch canonical metrics (keywords, clusters, content counts)
  const metrics = useQuery(
    api.canonical.metrics.getCanonicalMetrics,
    shouldFetch && typedProjectId ? { projectId: typedProjectId } : 'skip'
  );

  // Fetch full strategy data (clusters, plan) for pages that need it
  // @deprecated Prefer metrics for counts, query getFullStrategy directly for full data
  const strategyData = useQuery(
    api.strategy.getFullStrategy,
    shouldFetch && typedProjectId ? { projectId: typedProjectId } : 'skip'
  );

  // Compute derived state
  const result = useMemo<UseProjectResult>(() => {
    const dataLoading =
      shouldFetch &&
      (project === undefined ||
        ga4Connection === undefined ||
        gscConnection === undefined ||
        rating === undefined ||
        metrics === undefined);

    return {
      projectId: resolvedProjectId ?? null,
      project,
      ga4Connection,
      gscConnection,
      rating,
      metrics,
      strategyData,
      isLoading: dataLoading || isSelectingProject,
      isSelectingProject,
      hasGA4: !!ga4Connection,
      hasGSC: !!gscConnection,
      hasClusters: (metrics?.clusterCount ?? 0) > 0,
      hasPlan: (metrics?.contentCount ?? 0) > 0,
      setCurrentProject,
      // PROJ-001 fields
      projectType: (project?.projectType as 'own' | 'competitor') ?? null,
      isCompetitor: project?.projectType === 'competitor',
      serpAnalysisUsed: project?.serpAnalysisUsed ?? false,
    };
  }, [
    project,
    ga4Connection,
    gscConnection,
    rating,
    metrics,
    strategyData,
    resolvedProjectId,
    isSelectingProject,
    shouldFetch,
    setCurrentProject,
  ]);

  return result;
}
