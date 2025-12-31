/**
 * usePageGuard Hook
 *
 * Provides standardized loading, auth, and project guards for pages.
 * Returns a discriminated union for type-safe conditional rendering.
 *
 * Usage:
 * ```tsx
 * const guard = usePageGuard({ requireAuth: true, requireProject: true });
 *
 * if (guard.status === 'loading') return <LoadingState />;
 * if (guard.status === 'redirect') {
 *   router.replace(guard.to);
 *   return <LoadingState message="Redirecting..." />;
 * }
 * if (guard.status === 'no-project') return <EmptyState title="No project" />;
 *
 * // guard.status === 'ready' - safe to render content
 * const { user, projectId } = guard;
 * ```
 *
 * IMPORTANT: This hook must be called unconditionally at the top of the component.
 * Do not call it inside conditionals or loops.
 */

import { useAuth } from '@/lib/useAuth';
import { useProject } from '@/lib/hooks';
import type { Id } from '@/convex/_generated/dataModel';

type GuardOptions = {
  /** Require user to be authenticated. Default: true */
  requireAuth?: boolean;
  /** Require a project to be selected. Default: false */
  requireProject?: boolean;
  /** Auto-select project if none selected. Default: true */
  autoSelectProject?: boolean;
  /** Custom redirect path for unauthenticated users. Default: '/auth/login' */
  loginRedirect?: string;
};

type GuardResultLoading = {
  status: 'loading';
};

type GuardResultRedirect = {
  status: 'redirect';
  to: string;
};

type GuardResultNoProject = {
  status: 'no-project';
  user: NonNullable<ReturnType<typeof useAuth>['user']>;
};

type GuardResultReady = {
  status: 'ready';
  user: NonNullable<ReturnType<typeof useAuth>['user']>;
  projectId: Id<'projects'> | null;
  project: ReturnType<typeof useProject>['project'];
};

export type GuardResult =
  | GuardResultLoading
  | GuardResultRedirect
  | GuardResultNoProject
  | GuardResultReady;

export function usePageGuard(options: GuardOptions = {}): GuardResult {
  const {
    requireAuth = true,
    requireProject = false,
    autoSelectProject = true,
    loginRedirect = '/auth/login',
  } = options;

  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const {
    projectId,
    project,
    isLoading: projectLoading,
  } = useProject(null, {
    autoSelect: autoSelectProject,
  });

  // Guard 1: Auth is still loading
  if (authLoading) {
    return { status: 'loading' };
  }

  // Guard 2: Auth required but not authenticated
  if (requireAuth && (!isAuthenticated || !user)) {
    return { status: 'redirect', to: loginRedirect };
  }

  // Guard 3: Project loading (only if project required)
  if (requireProject && projectLoading) {
    return { status: 'loading' };
  }

  // Guard 4: Project required but none selected
  if (requireProject && !projectId) {
    return {
      status: 'no-project',
      user: user!,
    };
  }

  // All guards passed - ready to render
  return {
    status: 'ready',
    user: user!,
    projectId: projectId as Id<'projects'> | null,
    project,
  };
}
