/**
 * Pagination and Admin RBAC Integration Tests
 *
 * Tests for:
 * - Content pagination with status filter
 * - Admin portal RBAC enforcement
 * - Security per /security-rules workflow
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { convexTest } from 'convex-test';
import schema from './schema';
import { api } from './_generated/api';
import { Id } from './_generated/dataModel';

describe('Content Pieces: Pagination & Filtering', () => {
  let t: ReturnType<typeof convexTest>;
  let testProjectId: Id<'projects'>;

  beforeEach(async () => {
    t = convexTest(schema);

    // Create authenticated user and project
    const result = await t.run(async (ctx) => {
      const userId = await ctx.db.insert('users', {
        email: 'pagination-test@example.com',
        role: 'user',
        onboardingStatus: 'completed',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      const projectId = await ctx.db.insert('projects', {
        userId,
        name: 'Pagination Test Project',
        websiteUrl: 'https://pagination-test.com',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Create content pieces with different statuses
      const statuses = ['draft', 'draft', 'approved', 'published', 'scheduled'] as const;
      for (let i = 0; i < statuses.length; i++) {
        const now = Date.now() + i * 1000;
        await ctx.db.insert('contentPieces', {
          projectId,
          title: `Content ${i + 1}`,
          contentType: 'blog',
          status: statuses[i],
          keywords: ['test'],
          createdAt: now,
          updatedAt: now,
        });
      }

      return { userId, projectId };
    });

    testProjectId = result.projectId;
  });

  test('should paginate content pieces', async () => {
    // Set up authenticated context for this test
    const authT = t.withIdentity({
      name: 'Pagination Test User',
      email: 'pagination-test@example.com',
      subject: 'test-pagination-user',
    });

    const result = await authT.query(api.contentPieces.listByProjectPaginated, {
      projectId: testProjectId,
      paginationOpts: { numItems: 2, cursor: null },
    });

    expect(result.page.length).toBe(2);
    expect(result.isDone).toBe(false);
    expect(result.continueCursor).toBeDefined();
  });

  test('should filter by status', async () => {
    const authT = t.withIdentity({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'test-user',
    });
    const draftResult = await authT.query(api.contentPieces.listByProjectPaginated, {
      projectId: testProjectId,
      status: 'draft',
      paginationOpts: { numItems: 10, cursor: null },
    });

    expect(draftResult.page.length).toBe(2);
    expect(draftResult.page.every((p: { status: string }) => p.status === 'draft')).toBe(true);
  });

  test('should return empty for status with no matches', async () => {
    const authT = t.withIdentity({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'test-user',
    });
    const generatingResult = await authT.query(api.contentPieces.listByProjectPaginated, {
      projectId: testProjectId,
      status: 'generating',
      paginationOpts: { numItems: 10, cursor: null },
    });

    expect(generatingResult.page.length).toBe(0);
  });

  test('should order by creation date descending', async () => {
    const authT = t.withIdentity({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'test-user',
    });
    const result = await authT.query(api.contentPieces.listByProjectPaginated, {
      projectId: testProjectId,
      paginationOpts: { numItems: 5, cursor: null },
    });

    // Most recent should be first
    expect(result.page[0]?.title).toBe('Content 5');
  });
});

describe('Admin RBAC: Security Enforcement', () => {
  let t: ReturnType<typeof convexTest>;
  let regularUserId: Id<'users'>;
  let adminUserId: Id<'users'>;
  let superAdminUserId: Id<'users'>;

  beforeEach(async () => {
    t = convexTest(schema);

    // Create users with different roles
    const result = await t.run(async (ctx) => {
      const regular = await ctx.db.insert('users', {
        email: 'regular@example.com',
        role: 'user',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      const admin = await ctx.db.insert('users', {
        email: 'admin@example.com',
        role: 'admin',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      const superAdmin = await ctx.db.insert('users', {
        email: 'super@example.com',
        role: 'super_admin',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return { regular, admin, superAdmin };
    });

    regularUserId = result.regular;
    adminUserId = result.admin;
    superAdminUserId = result.superAdmin;
  });

  test('should reject unauthenticated listUsers request', async () => {
    // No identity set
    await expect(t.query(api.admin.users.listUsers, {})).rejects.toThrow('Unauthorized');
  });

  test('should reject regular user from listUsers', async () => {
    const regularT = t.withIdentity({
      subject: regularUserId,
    });

    await expect(regularT.query(api.admin.users.listUsers, {})).rejects.toThrow(/Forbidden|admin/i);
  });

  test('should allow admin to listUsers', async () => {
    const adminT = t.withIdentity({
      subject: adminUserId,
    });

    const users = await adminT.query(api.admin.users.listUsers, {});

    expect(users.length).toBeGreaterThanOrEqual(3); // At least our 3 test users
  });

  test('should reject admin from updateUserRole (requires super_admin)', async () => {
    const adminT = t.withIdentity({
      subject: adminUserId,
    });

    await expect(
      adminT.mutation(api.admin.users.updateUserRole, {
        userId: regularUserId,
        role: 'admin',
      })
    ).rejects.toThrow(/Forbidden|super_admin/i);
  });

  test('should allow super_admin to updateUserRole', async () => {
    const superT = t.withIdentity({
      subject: superAdminUserId,
    });

    const result = await superT.mutation(api.admin.users.updateUserRole, {
      userId: regularUserId,
      role: 'admin',
    });

    expect(result.success).toBe(true);
    expect(result.newRole).toBe('admin');
  });

  test('should filter by account status in listUsers', async () => {
    // First set a user to suspended
    const superT = t.withIdentity({
      subject: superAdminUserId,
    });

    await superT.mutation(api.admin.users.updateAccountStatus, {
      userId: regularUserId,
      accountStatus: 'suspended',
      reason: 'Test suspension',
    });

    // Now filter
    const suspended = await superT.query(api.admin.users.listUsers, {
      accountStatus: 'suspended',
    });

    expect(suspended.some((u: { _id: Id<'users'> }) => u._id === regularUserId)).toBe(true);
    expect(suspended.every((u: { accountStatus: string }) => u.accountStatus === 'suspended')).toBe(
      true
    );
  });

  test('should not expose sensitive fields in user list', async () => {
    const adminT = t.withIdentity({
      subject: adminUserId,
    });

    const users = await adminT.query(api.admin.users.listUsers, {});
    const user = users[0];

    // Should be present
    expect(user).toHaveProperty('_id');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('role');

    // Should NOT be present (per field filtering)
    expect(user).not.toHaveProperty('passwordHash');
    expect(user).not.toHaveProperty('tokenHash');
    expect(user).not.toHaveProperty('authSession');
  });
});

describe('Project Access: RLS Enforcement', () => {
  let t: ReturnType<typeof convexTest>;
  let user1ProjectId: Id<'projects'>;
  let user2ProjectId: Id<'projects'>;

  beforeEach(async () => {
    t = convexTest(schema);

    const result = await t.run(async (ctx) => {
      const user1 = await ctx.db.insert('users', {
        email: 'user1@example.com',
        role: 'user',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      const user2 = await ctx.db.insert('users', {
        email: 'user2@example.com',
        role: 'user',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      const project1 = await ctx.db.insert('projects', {
        userId: user1,
        name: 'User 1 Project',
        websiteUrl: 'https://user1.com',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      const project2 = await ctx.db.insert('projects', {
        userId: user2,
        name: 'User 2 Project',
        websiteUrl: 'https://user2.com',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Add content to both projects
      await ctx.db.insert('contentPieces', {
        projectId: project1,
        title: 'User 1 Content',
        contentType: 'blog',
        status: 'draft',
        keywords: ['test'],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      await ctx.db.insert('contentPieces', {
        projectId: project2,
        title: 'User 2 Content',
        contentType: 'blog',
        status: 'draft',
        keywords: ['test'],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return { project1, project2 };
    });

    user1ProjectId = result.project1;
    user2ProjectId = result.project2;
  });

  test('should return empty for unauthenticated user', async () => {
    const result = await t.query(api.contentPieces.listByProjectPaginated, {
      projectId: user1ProjectId,
      paginationOpts: { numItems: 10, cursor: null },
    });

    // Returns empty, not error (graceful handling)
    expect(result.page).toEqual([]);
    expect(result.isDone).toBe(true);
  });
});
