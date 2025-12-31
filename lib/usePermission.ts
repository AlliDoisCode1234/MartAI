'use client';

/**
 * usePermission Hook
 *
 * Component Hierarchy:
 * lib/usePermission.ts (this file)
 *
 * Usage:
 * ```tsx
 * const canDelete = usePermission('projects.delete');
 * const canAdmin = usePermission('admin.access');
 * const canDoAny = usePermissions(['users.edit', 'users.delete'], 'any');
 * ```
 *
 * Security Note: This is for UI visibility only.
 * Server-side RBAC in Convex functions is the actual security layer.
 */

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  Permission,
  AdminRole,
} from './permissions';

/**
 * Check if the current user has a specific permission
 */
export function usePermission(permission: Permission): boolean {
  const user = useQuery(api.users.me);
  const role = user?.role as AdminRole | undefined;
  return hasPermission(role, permission);
}

/**
 * Check if the current user has multiple permissions
 * @param permissions - Array of permissions to check
 * @param mode - 'all' requires all permissions, 'any' requires at least one
 */
export function usePermissions(permissions: Permission[], mode: 'all' | 'any' = 'all'): boolean {
  const user = useQuery(api.users.me);
  const role = user?.role as AdminRole | undefined;

  if (mode === 'all') {
    return hasAllPermissions(role, permissions);
  }
  return hasAnyPermission(role, permissions);
}

/**
 * Get the current user's role
 */
export function useRole(): AdminRole | null {
  const user = useQuery(api.users.me);
  return (user?.role as AdminRole) ?? null;
}

/**
 * Check if user is at least admin level
 */
export function useIsAdmin(): boolean {
  return usePermission('admin.access');
}

/**
 * Check if user is super admin
 */
export function useIsSuperAdmin(): boolean {
  return usePermission('admin.system');
}
