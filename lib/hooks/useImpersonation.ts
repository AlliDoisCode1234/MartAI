'use client';

/**
 * useImpersonation Hook
 *
 * Provides impersonation state and actions for super_admins.
 *
 * Usage:
 * const { isImpersonating, targetUser, startImpersonation, endImpersonation } = useImpersonation();
 */

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useCallback } from 'react';

export function useImpersonation() {
  // Get active impersonation session
  const activeSession = useQuery(api.admin.impersonation.getActiveSession);

  // Mutations
  const startMutation = useMutation(api.admin.impersonation.startImpersonation);
  const endMutation = useMutation(api.admin.impersonation.endImpersonation);

  const startImpersonation = useCallback(
    async (targetUserId: Id<'users'>, reason?: string) => {
      return await startMutation({
        targetUserId,
        reason,
        permissions: 'full_access',
      });
    },
    [startMutation]
  );

  const endImpersonation = useCallback(async () => {
    return await endMutation({});
  }, [endMutation]);

  return {
    // State
    isImpersonating: !!activeSession && !activeSession.isExpired,
    activeSession,
    targetUser: activeSession
      ? {
          id: activeSession.targetUserId,
          name: activeSession.targetName,
          email: activeSession.targetEmail,
        }
      : null,

    // Actions
    startImpersonation,
    endImpersonation,

    // Session info
    expiresAt: activeSession?.expiresAt,
    permissions: activeSession?.permissions,
  };
}
