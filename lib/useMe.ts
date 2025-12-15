'use client';

/**
 * useMe Hook
 *
 * Returns the currently logged-in user's data.
 * Use this for accessing YOUR OWN profile, settings, preferences.
 *
 * Naming Convention:
 * - `me` = logged-in user (this hook)
 * - `identity` = auth session (backend: auth.getUserId)
 * - `user` = other users (api.users.getById for admins)
 */

import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function useMe() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  // Only query if authenticated to avoid unnecessary calls
  const me = useQuery(api.users.me, isAuthenticated ? {} : 'skip');

  return {
    me,
    isAuthenticated,
    loading: isLoading || (isAuthenticated && me === undefined),
  };
}
