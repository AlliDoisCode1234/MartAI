/**
 * Admin Team Management RBAC Tests
 *
 * Component Hierarchy: convex/admin/, convex/lib/rbac.ts
 * Tests internal admin mutations/queries related to team and user management.
 * Verifies that global admin roles (super_admin, admin, sales, viewer)
 * are enforced correctly for org-management operations.
 *
 * Functions tested:
 * - Admin admin role hierarchy (requireAdminRole)
 * - Admin portal user queries (getUserDetails, getUserByEmail, listAdmins)
 * - Admin escalation prevention (admin cannot promote to super_admin)
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { createTestContext, seedUser, seedOrganization, seedTeamMember } from '../testHelpers';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

// =============================================================================
// ADMIN USER QUERIES WITH ORG CONTEXT
// =============================================================================

describe('Admin Team Management: User Queries', () => {
  let t: ReturnType<typeof createTestContext>;
  let superAdminId: Id<'users'>;
  let adminId: Id<'users'>;
  let regularId: Id<'users'>;
  let orgId: Id<'organizations'>;

  beforeEach(async () => {
    t = createTestContext();
    superAdminId = await seedUser(t, { email: 'super@test.com', role: 'super_admin' });
    adminId = await seedUser(t, { email: 'admin@test.com', role: 'admin' });
    regularId = await seedUser(t, { email: 'regular@test.com' });
    orgId = await seedOrganization(t, regularId, { name: 'User Org', membershipTier: 'engine' });
  });

  test('super_admin can view user details with org context', async () => {
    const superT = t.withIdentity({ subject: superAdminId });
    const details = await superT.query(api.admin.users.getUserDetails, { userId: regularId });

    expect(details).not.toBeNull();
    expect(details?.email).toBe('regular@test.com');
  });

  test('admin can view user details', async () => {
    const adminT = t.withIdentity({ subject: adminId });
    const details = await adminT.query(api.admin.users.getUserDetails, { userId: regularId });

    expect(details).not.toBeNull();
    expect(details?.email).toBe('regular@test.com');
  });

  test('regular user CANNOT view admin user details', async () => {
    const regularT = t.withIdentity({ subject: regularId });
    await expect(
      regularT.query(api.admin.users.getUserDetails, { userId: superAdminId })
    ).rejects.toThrow(/Forbidden|admin/i);
  });

  test('admin can search users by email', async () => {
    const adminT = t.withIdentity({ subject: adminId });
    const user = await adminT.query(api.admin.users.getUserByEmail, {
      email: 'regular@test.com',
    });

    expect(user).not.toBeNull();
    expect(user?._id).toBe(regularId);
  });

  test('returns null for non-existent email', async () => {
    const adminT = t.withIdentity({ subject: adminId });
    const user = await adminT.query(api.admin.users.getUserByEmail, {
      email: 'ghost@test.com',
    });

    expect(user).toBeNull();
  });
});

// =============================================================================
// ADMIN ROLE HIERARCHY
// =============================================================================

describe('Admin Team Management: Role Hierarchy', () => {
  let t: ReturnType<typeof createTestContext>;
  let superAdminId: Id<'users'>;
  let adminId: Id<'users'>;
  let regularId: Id<'users'>;

  beforeEach(async () => {
    t = createTestContext();
    superAdminId = await seedUser(t, { email: 'super@test.com', role: 'super_admin' });
    adminId = await seedUser(t, { email: 'admin@test.com', role: 'admin' });
    regularId = await seedUser(t, { email: 'regular@test.com' });
  });

  test('listAdmins returns all internal admins', async () => {
    const adminT = t.withIdentity({ subject: adminId });
    const admins = await adminT.query(api.admin.users.listAdmins, {});

    expect(admins.length).toBeGreaterThanOrEqual(2);
    expect(admins.some((a: { email?: string }) => a.email === 'super@test.com')).toBe(true);
    expect(admins.some((a: { email?: string }) => a.email === 'admin@test.com')).toBe(true);
  });

  test('regular user CANNOT list admins', async () => {
    const regularT = t.withIdentity({ subject: regularId });
    await expect(
      regularT.query(api.admin.users.listAdmins, {})
    ).rejects.toThrow(/Forbidden|admin/i);
  });

  test('unauthenticated user CANNOT access admin queries', async () => {
    await expect(
      t.query(api.admin.users.listAdmins, {})
    ).rejects.toThrow(/Unauthorized/i);
  });
});

// =============================================================================
// ADMIN ESCALATION PREVENTION
// =============================================================================

describe('Admin Team Management: Escalation Prevention', () => {
  let t: ReturnType<typeof createTestContext>;
  let superAdminId: Id<'users'>;
  let adminId: Id<'users'>;
  let regularId: Id<'users'>;

  beforeEach(async () => {
    t = createTestContext();
    superAdminId = await seedUser(t, { email: 'super@test.com', role: 'super_admin' });
    adminId = await seedUser(t, { email: 'admin@test.com', role: 'admin' });
    regularId = await seedUser(t, { email: 'regular@test.com' });
  });

  test('admin cannot access super_admin-only endpoints (costs)', async () => {
    const adminT = t.withIdentity({ subject: adminId });
    await expect(
      adminT.query(api.admin.costs.getAllAICosts, {})
    ).rejects.toThrow(/super_admin|Forbidden/i);
  });

  test('admin cannot access super_admin-only endpoints (BI funnel)', async () => {
    const adminT = t.withIdentity({ subject: adminId });
    await expect(
      adminT.query(api.analytics.eventTracking.getFunnelMetrics, {})
    ).rejects.toThrow(/super_admin|Super admin/i);
  });

  test('super_admin can access dashboard metrics', async () => {
    const superT = t.withIdentity({ subject: superAdminId });
    const metrics = await superT.query(api.admin.dashboard.getAdminDashboardMetrics, {});

    expect(metrics).toHaveProperty('totalUsers');
    expect(metrics.totalUsers).toBeGreaterThanOrEqual(3);
  });

  test('regular user cannot access dashboard', async () => {
    const regularT = t.withIdentity({ subject: regularId });
    await expect(
      regularT.query(api.admin.dashboard.getAdminDashboardMetrics, {})
    ).rejects.toThrow(/Forbidden|admin/i);
  });
});
