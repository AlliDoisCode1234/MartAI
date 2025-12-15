'use client';

/**
 * useAuth Hook
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

  const logout = useCallback(async () => {
    await signOut();
    router.push('/auth/login');
  }, [signOut, router]);

  return {
    // Auth state
    isAuthenticated,
    loading: isLoading,
    logout,

    // DEPRECATED: Use useMe().me instead
    user,
  };
}
