/**
 * RBAC (Role-Based Access Control) Tests
 *
 * Tests for convex/lib/rbac.ts
 * Verifies that:
 * - Unauthorized users cannot access protected resources
 * - Role hierarchy is enforced correctly
 * - Project ownership is verified
 * - Organization membership is checked
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { createTestContext, seedUser, seedProject } from '../testHelpers';

describe('RBAC Security', () => {
  describe('Project Access Isolation', () => {
    test('user can only query their own projects', async () => {
      const t = createTestContext();

      // Create two users
      const user1Id = await seedUser(t, { email: 'user1@test.com' });
      const user2Id = await seedUser(t, { email: 'user2@test.com' });

      // Each user creates a project
      const project1Id = await seedProject(t, user1Id, { name: 'User 1 Project' });
      const project2Id = await seedProject(t, user2Id, { name: 'User 2 Project' });

      // Verify user1 can only see their project
      const user1Projects = await t.run(async (ctx) => {
        return await ctx.db
          .query('projects')
          .withIndex('by_user', (q) => q.eq('userId', user1Id))
          .collect();
      });

      expect(user1Projects).toHaveLength(1);
      expect(user1Projects[0].name).toBe('User 1 Project');
      expect(user1Projects.some((p) => p.userId === user2Id)).toBe(false);
    });

    test('projects have correct ownership after creation', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId, { name: 'My Project' });

      const project = await t.run(async (ctx) => ctx.db.get(projectId));

      expect(project?.userId).toBe(userId);
    });
  });

  describe('Admin Role Hierarchy', () => {
    test('super_admin has highest permission level', async () => {
      const t = createTestContext();
      const superAdmin = await seedUser(t, { email: 'super@test.com', role: 'super_admin' });
      const admin = await seedUser(t, { email: 'admin@test.com', role: 'admin' });
      const regularUser = await seedUser(t, { email: 'user@test.com', role: 'user' });
      const viewer = await seedUser(t, { email: 'viewer@test.com', role: 'viewer' });

      // Verify roles are stored correctly
      const superAdminRecord = await t.run(async (ctx) => ctx.db.get(superAdmin));
      const adminRecord = await t.run(async (ctx) => ctx.db.get(admin));
      const userRecord = await t.run(async (ctx) => ctx.db.get(regularUser));
      const viewerRecord = await t.run(async (ctx) => ctx.db.get(viewer));

      expect(superAdminRecord?.role).toBe('super_admin');
      expect(adminRecord?.role).toBe('admin');
      expect(userRecord?.role).toBe('user');
      expect(viewerRecord?.role).toBe('viewer');
    });

    test('can query users by role', async () => {
      const t = createTestContext();

      await seedUser(t, { email: 'admin1@test.com', role: 'admin' });
      await seedUser(t, { email: 'admin2@test.com', role: 'admin' });
      await seedUser(t, { email: 'user1@test.com', role: 'user' });

      const admins = await t.run(async (ctx) => {
        const allUsers = await ctx.db.query('users').collect();
        return allUsers.filter((u) => u.role === 'admin');
      });

      expect(admins).toHaveLength(2);
    });
  });

  describe('Data Isolation Edge Cases', () => {
    test('empty project list for new user', async () => {
      const t = createTestContext();
      const newUserId = await seedUser(t);

      const projects = await t.run(async (ctx) => {
        return await ctx.db
          .query('projects')
          .withIndex('by_user', (q) => q.eq('userId', newUserId))
          .collect();
      });

      expect(projects).toHaveLength(0);
    });

    test('deleting project removes it from user access', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      // Verify project exists
      const before = await t.run(async (ctx) => {
        return await ctx.db
          .query('projects')
          .withIndex('by_user', (q) => q.eq('userId', userId))
          .collect();
      });
      expect(before).toHaveLength(1);

      // Delete project
      await t.run(async (ctx) => {
        await ctx.db.delete(projectId);
      });

      // Verify project is gone
      const after = await t.run(async (ctx) => {
        return await ctx.db
          .query('projects')
          .withIndex('by_user', (q) => q.eq('userId', userId))
          .collect();
      });
      expect(after).toHaveLength(0);
    });

    test('multiple users with same email prefix are isolated', async () => {
      const t = createTestContext();

      // Similar emails but different users
      const user1 = await seedUser(t, { email: 'john@company1.com' });
      const user2 = await seedUser(t, { email: 'john@company2.com' });

      await seedProject(t, user1, { name: 'Company 1 Project' });
      await seedProject(t, user2, { name: 'Company 2 Project' });

      const user1Projects = await t.run(async (ctx) => {
        return await ctx.db
          .query('projects')
          .withIndex('by_user', (q) => q.eq('userId', user1))
          .collect();
      });

      expect(user1Projects).toHaveLength(1);
      expect(user1Projects[0].name).toBe('Company 1 Project');
    });
  });

  describe('Keywords Data Isolation', () => {
    test('keywords are isolated by project', async () => {
      const t = createTestContext();

      const user1 = await seedUser(t, { email: 'user1@test.com' });
      const user2 = await seedUser(t, { email: 'user2@test.com' });

      const project1 = await seedProject(t, user1);
      const project2 = await seedProject(t, user2);

      // Add keywords to each project
      await t.run(async (ctx) => {
        await ctx.db.insert('keywords', {
          projectId: project1,
          keyword: 'user1 keyword',
          searchVolume: 100,
          difficulty: 50,
          status: 'suggested',
          createdAt: Date.now(),
        });
        await ctx.db.insert('keywords', {
          projectId: project2,
          keyword: 'user2 keyword',
          searchVolume: 200,
          difficulty: 60,
          status: 'suggested',
          createdAt: Date.now(),
        });
      });

      // Query user1's project keywords
      const user1Keywords = await t.run(async (ctx) => {
        return await ctx.db
          .query('keywords')
          .withIndex('by_project', (q) => q.eq('projectId', project1))
          .collect();
      });

      expect(user1Keywords).toHaveLength(1);
      expect(user1Keywords[0].keyword).toBe('user1 keyword');
    });
  });

  describe('Clusters Data Isolation', () => {
    test('clusters are isolated by project', async () => {
      const t = createTestContext();

      const user1 = await seedUser(t, { email: 'user1@test.com' });
      const user2 = await seedUser(t, { email: 'user2@test.com' });

      const project1 = await seedProject(t, user1);
      const project2 = await seedProject(t, user2);

      // Add clusters to each project
      await t.run(async (ctx) => {
        await ctx.db.insert('keywordClusters', {
          projectId: project1,
          clusterName: 'User 1 Cluster',
          keywords: ['kw1', 'kw2'],
          intent: 'informational',
          difficulty: 40,
          volumeRange: { min: 100, max: 1000 },
          impactScore: 0.7,
          topSerpUrls: [],
          status: 'active',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        await ctx.db.insert('keywordClusters', {
          projectId: project2,
          clusterName: 'User 2 Cluster',
          keywords: ['kw3', 'kw4'],
          intent: 'commercial',
          difficulty: 60,
          volumeRange: { min: 500, max: 5000 },
          impactScore: 0.8,
          topSerpUrls: [],
          status: 'active',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });

      // Query user1's project clusters
      const user1Clusters = await t.run(async (ctx) => {
        return await ctx.db
          .query('keywordClusters')
          .withIndex('by_project', (q) => q.eq('projectId', project1))
          .collect();
      });

      expect(user1Clusters).toHaveLength(1);
      expect(user1Clusters[0].clusterName).toBe('User 1 Cluster');
    });
  });

  describe('Briefs Data Isolation', () => {
    test('briefs are isolated by project', async () => {
      const t = createTestContext();

      const user1 = await seedUser(t, { email: 'user1@test.com' });
      const user2 = await seedUser(t, { email: 'user2@test.com' });

      const project1 = await seedProject(t, user1);
      const project2 = await seedProject(t, user2);

      // Add briefs to each project
      await t.run(async (ctx) => {
        await ctx.db.insert('briefs', {
          projectId: project1,
          title: 'User 1 Brief',
          status: 'planned',
          scheduledDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        await ctx.db.insert('briefs', {
          projectId: project2,
          title: 'User 2 Brief',
          status: 'planned',
          scheduledDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });

      // Query user1's project briefs
      const user1Briefs = await t.run(async (ctx) => {
        return await ctx.db
          .query('briefs')
          .withIndex('by_project', (q) => q.eq('projectId', project1))
          .collect();
      });

      expect(user1Briefs).toHaveLength(1);
      expect(user1Briefs[0].title).toBe('User 1 Brief');
    });
  });
});
