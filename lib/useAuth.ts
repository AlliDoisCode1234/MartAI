'use client';

import { useConvexAuth, useQuery } from 'convex/react';
import { useAuthActions } from '@convex-dev/auth/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useAuth() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();

  // Fetch current user details
  const user = useQuery(api.users.current);

  const logout = useCallback(async () => {
    await signOut();
    router.push('/auth/login');
  }, [signOut, router]);

  return {
    user,
    loading: isLoading,
    isAuthenticated,
    logout,
    // Legacy support (optional, or remove if unused)
    token: 'dummy-token', // Some components might check for token existence
    login: async () => {
      throw new Error('Use useAuthActions instead');
    },
    signup: async () => {
      throw new Error('Use useAuthActions instead');
    },
    updateProfile: async () => {
      throw new Error('Use Convex mutations instead');
    },
    refreshAccessToken: async () => null,
  };
}
