/**
 * Permission System
 *
 * Component Hierarchy:
 * lib/permissions.ts (this file)
 *
 * Defines typed permissions and role-permission mappings.
 * Used by usePermission hook and PermissionGate component.
 *
 * Security: All permissions are checked server-side via RBAC.
 * This is for UI visibility only - never trust client-side checks.
 */

// Admin portal roles (must match schema.ts)
export type AdminRole = 'super_admin' | 'admin' | 'user' | 'viewer';

// Typed permission strings - dot notation for hierarchy
export type Permission =
  // Users
  | 'users.view'
  | 'users.view_all'
  | 'users.edit'
  | 'users.edit_all'
  | 'users.delete'
  | 'users.change_role'
  | 'users.reset_onboarding'
  // Projects
  | 'projects.view'
  | 'projects.view_all'
  | 'projects.create'
  | 'projects.edit'
  | 'projects.delete'
  | 'projects.transfer'
  // Keywords
  | 'keywords.view'
  | 'keywords.generate'
  | 'keywords.edit'
  | 'keywords.delete'
  | 'keywords.seed' // Admin keyword library seeding
  // Clusters
  | 'clusters.view'
  | 'clusters.generate'
  | 'clusters.edit'
  | 'clusters.delete'
  // Content
  | 'content.view'
  | 'content.generate'
  | 'content.edit'
  | 'content.delete'
  | 'content.publish'
  | 'content.schedule'
  // Integrations
  | 'integrations.connect'
  | 'integrations.disconnect'
  | 'integrations.view_tokens' // Sensitive
  // Billing
  | 'billing.view'
  | 'billing.view_all'
  | 'billing.manage'
  | 'billing.grant_credits'
  | 'billing.override_limits'
  | 'billing.refund'
  // AI Costs (super_admin only)
  | 'ai_costs.view'
  | 'ai_costs.view_by_user'
  | 'ai_costs.export'
  // Admin Portal
  | 'admin.access'
  | 'admin.bi'
  | 'admin.system'
  | 'admin.audit_logs';

// Wildcard permission for super_admin
type WildcardPermission = '*';

// Role to permissions mapping
const ROLE_PERMISSIONS: Record<AdminRole, (Permission | WildcardPermission)[]> = {
  super_admin: ['*'], // All permissions

  admin: [
    'users.view',
    'users.view_all',
    'users.edit',
    'users.edit_all',
    'users.reset_onboarding',
    'projects.view',
    'projects.view_all',
    'projects.edit',
    'keywords.view',
    'keywords.edit',
    'keywords.delete',
    'clusters.view',
    'clusters.edit',
    'clusters.delete',
    'content.view',
    'content.edit',
    'content.publish',
    'admin.access',
    'admin.audit_logs',
  ],

  user: [
    'users.view',
    'users.edit',
    'projects.view',
    'projects.create',
    'projects.edit',
    'projects.delete',
    'keywords.view',
    'keywords.generate',
    'keywords.edit',
    'keywords.delete',
    'clusters.view',
    'clusters.generate',
    'clusters.edit',
    'clusters.delete',
    'content.view',
    'content.generate',
    'content.edit',
    'content.delete',
    'content.publish',
    'content.schedule',
    'integrations.connect',
    'integrations.disconnect',
    'billing.view',
    'billing.manage',
  ],

  viewer: [
    'users.view',
    'projects.view',
    'keywords.view',
    'clusters.view',
    'content.view',
    'billing.view',
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: AdminRole | undefined | null, permission: Permission): boolean {
  if (!role) return false;

  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;

  // Wildcard permission grants everything
  if (permissions.includes('*')) return true;

  return permissions.includes(permission);
}

/**
 * Check if a role has ALL of the specified permissions
 */
export function hasAllPermissions(
  role: AdminRole | undefined | null,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Check if a role has ANY of the specified permissions
 */
export function hasAnyPermission(
  role: AdminRole | undefined | null,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 */
export function getPermissions(role: AdminRole | undefined | null): Permission[] {
  if (!role) return [];

  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return [];

  // Super admin gets all permissions (expand wildcard)
  if (permissions.includes('*')) {
    return Object.values(ROLE_PERMISSIONS)
      .flat()
      .filter((p): p is Permission => p !== '*');
  }

  return permissions as Permission[];
}
