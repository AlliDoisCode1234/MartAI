/**
 * User Phase Hook
 *
 * Calculates the current phase for a project based on the LDD phase model.
 * Phases: 1-Setup, 2-Connect, 3-Discover, 4-Plan, 5-Create, 6-Full Access
 *
 * Reference: docs/project/USER_FLOW_LDD.md
 */

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

// Phase definitions matching LDD
export type UserPhase = 1 | 2 | 3 | 4 | 5 | 6;

export interface PhaseInfo {
  phase: UserPhase;
  name: string;
  goal: string;
  nextAction: string;
  availableRoutes: string[];
}

// Phase configuration from LDD
export const PHASES: Record<UserPhase, Omit<PhaseInfo, 'phase'>> = {
  1: {
    name: 'Setup',
    goal: 'Get started quickly',
    nextAction: 'Complete your profile',
    availableRoutes: ['/onboarding', '/profile', '/settings'],
  },
  2: {
    name: 'Connect',
    goal: 'See your real data',
    nextAction: 'Connect GSC or GA4',
    availableRoutes: ['/onboarding', '/profile', '/settings', '/integrations'],
  },
  3: {
    name: 'Discover',
    goal: 'Find keywords that rank',
    nextAction: 'Add more keywords',
    availableRoutes: ['/dashboard', '/strategy', '/keywords', '/settings', '/integrations'],
  },
  4: {
    name: 'Plan',
    goal: 'Organize your content strategy',
    nextAction: 'Create your calendar',
    availableRoutes: [
      '/dashboard',
      '/strategy',
      '/keywords',
      '/calendar',
      '/settings',
      '/integrations',
    ],
  },
  5: {
    name: 'Create',
    goal: 'Write content that converts',
    nextAction: 'Complete your first brief',
    availableRoutes: [
      '/dashboard',
      '/strategy',
      '/keywords',
      '/calendar',
      '/content',
      '/settings',
      '/integrations',
    ],
  },
  6: {
    name: 'Full Access',
    goal: 'Go live and track results',
    nextAction: 'Keep publishing!',
    availableRoutes: ['*'], // All routes
  },
};

// Main phase routes for navigation (in order)
export const PHASE_ROUTES = [
  { path: '/dashboard', label: 'Dashboard', minPhase: 3 as UserPhase },
  { path: '/strategy', label: 'Strategy', minPhase: 3 as UserPhase },
  { path: '/calendar', label: 'Calendar', minPhase: 4 as UserPhase },
  { path: '/content', label: 'Content', minPhase: 5 as UserPhase },
  { path: '/integrations', label: 'Integrations', minPhase: 2 as UserPhase },
];

export interface UseUserPhaseResult {
  phase: UserPhase;
  phaseInfo: PhaseInfo;
  isLoading: boolean;
  hasCompletedFirstProject: boolean;
  isRouteAvailable: (path: string) => boolean;
}

interface UseUserPhaseOptions {
  projectId?: Id<'projects'> | null;
}

export function useUserPhase(options: UseUserPhaseOptions = {}): UseUserPhaseResult {
  const { projectId } = options;

  // Fetch user data
  const user = useQuery(api.users.current);

  // Fetch project data if projectId provided
  const project = useQuery(
    api.projects.projects.getProjectById,
    projectId ? { projectId } : 'skip'
  );

  // Fetch project keywords count
  const keywordsData = useQuery(
    api.seo.keywordsData.getKeywordsByProject,
    projectId ? { projectId } : 'skip'
  );

  // Fetch clusters count
  const clusters = useQuery(
    api.seo.keywordClusters.getClustersByProject,
    projectId ? { projectId } : 'skip'
  );

  // Fetch briefs on calendar
  const calendarItems = useQuery(
    api.content.calendars.listCalendarItems,
    projectId ? { projectId } : 'skip'
  );

  // Fetch GSC connection (optional - doesn't block flow)
  const gscConnection = useQuery(
    api.integrations.gscConnections.getGSCConnection,
    projectId ? { projectId } : 'skip'
  );

  // GA4 uses same OAuth flow - check project for GA4 property ID as indicator
  // GA4 connection is optional and doesn't block flow
  const ga4Connection = project?.gaPropertyId ? { connected: true } : null;

  // Check if loading
  const isLoading: boolean =
    user === undefined ||
    (projectId !== null && projectId !== undefined && project === undefined) ||
    (projectId !== null && projectId !== undefined && keywordsData === undefined);

  // Calculate phase based on project state
  const calculatePhase = (): UserPhase => {
    // No project = Setup phase
    if (!projectId || !project) return 1;

    // Check for published articles (Phase 6)
    const hasPublished = calendarItems?.some(
      (item: { status?: string }) => item.status === 'published'
    );
    if (hasPublished) return 6;

    // Check for briefs on calendar (Phase 5)
    const hasBriefsOnCalendar = calendarItems && calendarItems.length > 0;
    if (hasBriefsOnCalendar) return 5;

    // Check for clusters and 10+ keywords (Phase 4)
    const hasEnoughKeywords = (keywordsData?.keywords?.length ?? 0) >= 10;
    const hasClusters = clusters && clusters.length > 0;
    if (hasEnoughKeywords && hasClusters) return 4;

    // Check for any keywords or connections (Phase 3)
    const hasKeywords = (keywordsData?.keywords?.length ?? 0) > 0;
    const hasConnection = gscConnection || ga4Connection;
    if (hasKeywords || hasConnection) return 3;

    // Check if onboarding complete (Phase 2)
    const onboardingComplete = user?.onboardingStatus === 'completed';
    if (onboardingComplete && project) return 2;

    // Default to Setup (Phase 1)
    return 1;
  };

  const phase = calculatePhase();

  // Check if user has completed first project (for Guided vs DIY mode)
  const hasCompletedFirstProject = Boolean(user?.engagementMilestones?.firstArticlePublishedAt);

  // Check if a route is available for current phase
  const isRouteAvailable = (path: string): boolean => {
    // Full access = all routes
    if (phase === 6) return true;

    // If user has completed first project, all routes unlocked (DIY mode)
    if (hasCompletedFirstProject) return true;

    const routes = PHASES[phase].availableRoutes;
    return routes.includes('*') || routes.some((route) => path.startsWith(route));
  };

  const phaseInfo: PhaseInfo = {
    phase,
    ...PHASES[phase],
  };

  return {
    phase,
    phaseInfo,
    isLoading,
    hasCompletedFirstProject,
    isRouteAvailable,
  };
}

/**
 * Get the next step CTA for a given page
 */
export function getNextStepCTA(
  phase: UserPhase,
  currentPath: string
): {
  label: string;
  path: string;
  description: string;
} | null {
  const nextSteps: Record<string, { label: string; path: string; description: string }> = {
    '/dashboard': {
      label: 'Add Keywords',
      path: '/strategy',
      description: 'Start building your content strategy',
    },
    '/strategy': {
      label: 'Create Calendar',
      path: '/calendar',
      description: 'Schedule your content',
    },
    '/calendar': {
      label: 'Write First Brief',
      path: '/content',
      description: 'Start creating content',
    },
    '/content': {
      label: 'Publish',
      path: '/content',
      description: 'Go live with your article',
    },
  };

  // Only show next step if not at full access
  if (phase >= 6) return null;

  return nextSteps[currentPath] || null;
}
