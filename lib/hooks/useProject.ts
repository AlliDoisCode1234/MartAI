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

interface UseProjectOptions {
  /** Skip fetching if true */
  skip?: boolean;
  /** Auto-select project from localStorage or user's first project */
  autoSelect?: boolean;
}

interface UseProjectResult {
  /** The resolved project ID (from param or auto-selected) */
  projectId: string | null;
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
    const matchedProject = storedId ? userProjects.find((p: any) => p._id === storedId) : null;

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

  // Fetch MR score
  const mrScore = useQuery(
    api.analytics.martaiRatingQueries.getLatestScore,
    shouldFetch && typedProjectId ? { projectId: typedProjectId } : 'skip'
  );

  // Fetch strategy data
  // TODO: Implement api.seo.strategy.getStrategyByProject when strategy feature is built
  const strategyData = null; // Placeholder - function doesn't exist yet

  // Compute derived state
  const result = useMemo<UseProjectResult>(() => {
    const dataLoading =
      shouldFetch &&
      (project === undefined ||
        ga4Connection === undefined ||
        gscConnection === undefined ||
        mrScore === undefined ||
        strategyData === undefined);

    return {
      projectId: resolvedProjectId ?? null,
      project,
      ga4Connection,
      gscConnection,
      mrScore,
      strategyData,
      isLoading: dataLoading || isSelectingProject,
      isSelectingProject,
      hasGA4: !!ga4Connection,
      hasGSC: !!gscConnection,
      hasClusters: (strategyData?.clusters?.length ?? 0) > 0,
      hasPlan: !!strategyData?.plan,
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
    mrScore,
    strategyData,
    resolvedProjectId,
    isSelectingProject,
    shouldFetch,
    setCurrentProject,
  ]);

  return result;
}
