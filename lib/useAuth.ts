'use client';

/**
 * useAuth Hook
 *
 * Component Hierarchy:
 * App → (any authenticated component) → useAuth
 *
 * Provides authentication actions (signIn, signOut) and auth state.
 *
 * Naming Convention:
 * - `useAuth()` = auth actions (this hook)
 * - `useMe()` = logged-in user data (use lib/useMe.ts)
 * - `user` = other users (admin queries)
 */

import { useConvexAuth, useQuery } from 'convex/react';
import { useAuthActions } from '@convex-dev/auth/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useAuth() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();

  // DEPRECATED: Use useMe() for user data instead
  // Keeping for backwards compatibility during migration
  const user = useQuery(api.users.me);

  /**
   * Sign out and navigate to a target route.
   *
   * Navigates FIRST to prevent authenticated queries from firing
   * during teardown (avoids "Unauthorized: Not logged in" errors).
   *
   * @param redirectTo - Where to navigate before signing out. Defaults to '/'.
   *                     Callers handling error states can pass e.g. '/auth/login?error=...'
   */
  const logout = useCallback(
    async (redirectTo = '/') => {
      // IMPORTANT: Navigate FIRST to prevent authenticated queries from firing
      router.push(redirectTo);

      // Give router time to start the navigation
      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        // Then sign out to clear the session
        await signOut();
      } catch {
        // Ignore signOut errors - session may already be invalid
      }
    },
    [signOut, router]
  );

  return {
    // Auth state
    isAuthenticated,
    loading: isLoading,
    logout,

    // DEPRECATED: Use useMe().me instead
    user,
  };
}
