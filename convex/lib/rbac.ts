/**
 * RBAC (Role-Based Access Control) Utility
 *
 * Shared RBAC logic for both:
 * - Admin Portal (super_admin, admin, user, viewer)
 * - Organization level (owner, admin, editor, viewer)
 */

import { QueryCtx, MutationCtx, ActionCtx } from '../_generated/server';
import { Id } from '../_generated/dataModel';
import { auth } from '../auth';

// Admin portal roles (global)
export type AdminRole = 'super_admin' | 'admin' | 'user' | 'viewer';

// Organization roles
export type OrgRole = 'owner' | 'admin' | 'editor' | 'viewer';

// Permission levels (higher = more access)
const ADMIN_ROLE_LEVEL: Record<AdminRole, number> = {
  super_admin: 100,
  admin: 80,
  user: 50,
  viewer: 10,
};

const ORG_ROLE_LEVEL: Record<OrgRole, number> = {
  owner: 100,
  admin: 80,
  editor: 50,
  viewer: 10,
};

/**
 * Check if user has required admin role
 */
export async function requireAdminRole(
  ctx: QueryCtx | MutationCtx | ActionCtx,
  requiredRole: AdminRole
): Promise<{ userId: Id<'users'>; role: AdminRole }> {
  const userId = await auth.getUserId(ctx as any);
  if (!userId) {
    throw new Error('Unauthorized: Not logged in');
  }

  const user = await (ctx as QueryCtx).db.get(userId);
  if (!user) {
    throw new Error('Unauthorized: User not found');
  }

  const userRole = (user.role as AdminRole) || 'viewer';
  const userLevel = ADMIN_ROLE_LEVEL[userRole] || 0;
  const requiredLevel = ADMIN_ROLE_LEVEL[requiredRole];

  if (userLevel < requiredLevel) {
    throw new Error(`Forbidden: Requires ${requiredRole} role or higher`);
  }

  return { userId, role: userRole };
}

/**
 * Check if user has required organization role
 */
export async function requireOrgRole(
  ctx: QueryCtx | MutationCtx | ActionCtx,
  organizationId: Id<'organizations'>,
  requiredRole: OrgRole
): Promise<{ userId: Id<'users'>; role: OrgRole; membership: any }> {
  const userId = await auth.getUserId(ctx as any);
  if (!userId) {
    throw new Error('Unauthorized: Not logged in');
  }

  const membership = await (ctx as QueryCtx).db
    .query('teamMembers')
    .withIndex('by_user_org', (q) => q.eq('userId', userId).eq('organizationId', organizationId))
    .first();

  if (!membership || membership.status !== 'active') {
    throw new Error('Forbidden: Not a member of this organization');
  }

  const memberRole = membership.role as OrgRole;
  const userLevel = ORG_ROLE_LEVEL[memberRole] || 0;
  const requiredLevel = ORG_ROLE_LEVEL[requiredRole];

  if (userLevel < requiredLevel) {
    throw new Error(`Forbidden: Requires ${requiredRole} role or higher in this organization`);
  }

  return { userId, role: memberRole, membership };
}

/**
 * Check if user can access a project (either owner or org member)
 */
export async function requireProjectAccess(
  ctx: QueryCtx | MutationCtx | ActionCtx,
  projectId: Id<'projects'>,
  requiredOrgRole: OrgRole = 'viewer'
): Promise<{ userId: Id<'users'>; project: any; role: OrgRole | 'owner' }> {
  const userId = await auth.getUserId(ctx as any);
  if (!userId) {
    throw new Error('Unauthorized: Not logged in');
  }

  const project = await (ctx as QueryCtx).db.get(projectId);
  if (!project) {
    throw new Error('Not found: Project does not exist');
  }

  // Direct owner access
  if (project.userId === userId) {
    return { userId, project, role: 'owner' };
  }

  // Organization-based access
  if (project.organizationId) {
    const { role } = await requireOrgRole(ctx, project.organizationId, requiredOrgRole);
    return { userId, project, role };
  }

  throw new Error('Forbidden: No access to this project');
}

/**
 * Check if user is super_admin (for dangerous operations)
 */
export async function requireSuperAdmin(
  ctx: QueryCtx | MutationCtx | ActionCtx
): Promise<Id<'users'>> {
  const { userId } = await requireAdminRole(ctx, 'super_admin');
  return userId;
}

/**
 * Check if user is at least admin level (for admin portal)
 */
export async function requireAdmin(ctx: QueryCtx | MutationCtx | ActionCtx): Promise<Id<'users'>> {
  const { userId } = await requireAdminRole(ctx, 'admin');
  return userId;
}

/**
 * Soft check - returns null if unauthorized instead of throwing
 */
export async function checkAdminRole(
  ctx: QueryCtx | MutationCtx | ActionCtx,
  requiredRole: AdminRole
): Promise<{ userId: Id<'users'>; role: AdminRole } | null> {
  try {
    return await requireAdminRole(ctx, requiredRole);
  } catch {
    return null;
  }
}

/**
 * Soft check for org role
 */
export async function checkOrgRole(
  ctx: QueryCtx | MutationCtx | ActionCtx,
  organizationId: Id<'organizations'>,
  requiredRole: OrgRole
): Promise<{ userId: Id<'users'>; role: OrgRole; membership: any } | null> {
  try {
    return await requireOrgRole(ctx, organizationId, requiredRole);
  } catch {
    return null;
  }
}
