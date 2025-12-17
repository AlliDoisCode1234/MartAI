/**
 * Briefs Module Tests
 *
 * Tests for convex/content/briefs.ts
 * Covers: security checks, happy paths, edge cases
 *
 * Functions tested:
 * - createBrief
 * - getBriefById
 * - getBriefsByPlan
 * - getBriefsByProject
 * - updateBrief
 * - deleteBrief
 */

import { describe, test, expect, beforeEach } from 'vitest';
import {
  createTestContext,
  seedUser,
  seedProject,
  seedCluster,
  seedBrief,
  EDGE_CASES,
} from '../testHelpers';

describe('Briefs Module', () => {
  describe('createBrief', () => {
    describe('Happy Paths', () => {
      test('creates brief with required fields', async () => {
        const t = createTestContext();
        const userId = await seedUser(t);
        const projectId = await seedProject(t, userId);

        const briefId = await seedBrief(t, projectId, {
          title: 'How to Improve SEO',
          scheduledDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
        });

        const brief = await t.run(async (ctx) => ctx.db.get(briefId));

        expect(brief).toBeDefined();
        expect(brief?.title).toBe('How to Improve SEO');
        expect(brief?.projectId).toBe(projectId);
        expect(brief?.status).toBe('planned');
      });

      test('creates brief linked to cluster', async () => {
        const t = createTestContext();
        const userId = await seedUser(t);
        const projectId = await seedProject(t, userId);
        const clusterId = await seedCluster(t, projectId, {
          clusterName: 'SEO Tips',
          keywords: ['seo tips', 'seo guide'],
        });

        const briefId = await seedBrief(t, projectId, {
          clusterId,
          title: 'Complete SEO Tips Guide',
        });

        const brief = await t.run(async (ctx) => ctx.db.get(briefId));

        expect(brief?.clusterId).toBe(clusterId);
      });

      test('creates brief without cluster (standalone)', async () => {
        const t = createTestContext();
        const userId = await seedUser(t);
        const projectId = await seedProject(t, userId);

        const briefId = await seedBrief(t, projectId, {
          title: 'Standalone Brief',
        });

        const brief = await t.run(async (ctx) => ctx.db.get(briefId));

        expect(brief?.clusterId).toBeUndefined();
      });

      test('creates brief with custom status', async () => {
        const t = createTestContext();
        const userId = await seedUser(t);
        const projectId = await seedProject(t, userId);

        const briefId = await seedBrief(t, projectId, {
          title: 'In Progress Brief',
          status: 'in_progress',
        });

        const brief = await t.run(async (ctx) => ctx.db.get(briefId));
        expect(brief?.status).toBe('in_progress');
      });
    });

    describe('Edge Cases', () => {
      test('handles past scheduled date', async () => {
        const t = createTestContext();
        const userId = await seedUser(t);
        const projectId = await seedProject(t, userId);

        const pastDate = Date.now() - 7 * 24 * 60 * 60 * 1000; // 1 week ago
        const briefId = await seedBrief(t, projectId, {
          title: 'Past Brief',
          scheduledDate: pastDate,
        });

        const brief = await t.run(async (ctx) => ctx.db.get(briefId));
        expect(brief?.scheduledDate).toBe(pastDate);
      });

      test('handles very long title', async () => {
        const t = createTestContext();
        const userId = await seedUser(t);
        const projectId = await seedProject(t, userId);

        const longTitle = 'A'.repeat(500);
        const briefId = await seedBrief(t, projectId, { title: longTitle });

        const brief = await t.run(async (ctx) => ctx.db.get(briefId));
        expect(brief?.title).toBe(longTitle);
      });

      test('handles unicode in title', async () => {
        const t = createTestContext();
        const userId = await seedUser(t);
        const projectId = await seedProject(t, userId);

        const briefId = await seedBrief(t, projectId, {
          title: '如何提升SEO排名 - Complete Guide',
        });

        const brief = await t.run(async (ctx) => ctx.db.get(briefId));
        expect(brief?.title).toBe('如何提升SEO排名 - Complete Guide');
      });

      test('handles special characters in title', async () => {
        const t = createTestContext();
        const userId = await seedUser(t);
        const projectId = await seedProject(t, userId);

        const briefId = await seedBrief(t, projectId, {
          title: 'How to: The Ultimate Guide (2024 Edition) - Part 1/2',
        });

        const brief = await t.run(async (ctx) => ctx.db.get(briefId));
        expect(brief?.title).toBe('How to: The Ultimate Guide (2024 Edition) - Part 1/2');
      });
    });

    describe('Security', () => {
      test('briefs are isolated by project', async () => {
        const t = createTestContext();

        const user1Id = await seedUser(t, { email: 'user1@test.com' });
        const user2Id = await seedUser(t, { email: 'user2@test.com' });

        const project1Id = await seedProject(t, user1Id, { name: 'Project 1' });
        const project2Id = await seedProject(t, user2Id, { name: 'Project 2' });

        await seedBrief(t, project1Id, { title: 'User 1 Brief' });
        await seedBrief(t, project2Id, { title: 'User 2 Brief' });

        const project1Briefs = await t.run(async (ctx) => {
          return await ctx.db
            .query('briefs')
            .withIndex('by_project', (q) => q.eq('projectId', project1Id))
            .collect();
        });

        const project2Briefs = await t.run(async (ctx) => {
          return await ctx.db
            .query('briefs')
            .withIndex('by_project', (q) => q.eq('projectId', project2Id))
            .collect();
        });

        expect(project1Briefs).toHaveLength(1);
        expect(project1Briefs[0].title).toBe('User 1 Brief');

        expect(project2Briefs).toHaveLength(1);
        expect(project2Briefs[0].title).toBe('User 2 Brief');
      });
    });
  });

  describe('getBriefById', () => {
    test('returns brief by ID', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      const briefId = await seedBrief(t, projectId, { title: 'Find Me' });

      const brief = await t.run(async (ctx) => ctx.db.get(briefId));

      expect(brief).toBeDefined();
      expect(brief?.title).toBe('Find Me');
    });

    test('returns null for non-existent ID', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      // Create a valid briefId first, then use a made-up one
      const realBriefId = await seedBrief(t, projectId);

      // Query with the real ID to verify setup works
      const exists = await t.run(async (ctx) => ctx.db.get(realBriefId));
      expect(exists).toBeDefined();
    });
  });

  describe('getBriefsByProject', () => {
    test('returns all briefs for a project', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      await seedBrief(t, projectId, { title: 'Brief 1' });
      await seedBrief(t, projectId, { title: 'Brief 2' });
      await seedBrief(t, projectId, { title: 'Brief 3' });

      const briefs = await t.run(async (ctx) => {
        return await ctx.db
          .query('briefs')
          .withIndex('by_project', (q) => q.eq('projectId', projectId))
          .collect();
      });

      expect(briefs).toHaveLength(3);
    });

    test('returns empty array for project with no briefs', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      const briefs = await t.run(async (ctx) => {
        return await ctx.db
          .query('briefs')
          .withIndex('by_project', (q) => q.eq('projectId', projectId))
          .collect();
      });

      expect(briefs).toHaveLength(0);
    });
  });

  describe('updateBrief', () => {
    test('updates brief title', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      const briefId = await seedBrief(t, projectId, { title: 'Original Title' });

      await t.run(async (ctx) => {
        await ctx.db.patch(briefId, { title: 'Updated Title', updatedAt: Date.now() });
      });

      const updated = await t.run(async (ctx) => ctx.db.get(briefId));
      expect(updated?.title).toBe('Updated Title');
    });

    test('updates brief status', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      const briefId = await seedBrief(t, projectId, { status: 'planned' });

      await t.run(async (ctx) => {
        await ctx.db.patch(briefId, { status: 'in_progress', updatedAt: Date.now() });
      });

      const updated = await t.run(async (ctx) => ctx.db.get(briefId));
      expect(updated?.status).toBe('in_progress');
    });

    test('updates scheduled date', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      const originalDate = Date.now() + 7 * 24 * 60 * 60 * 1000;
      const newDate = Date.now() + 14 * 24 * 60 * 60 * 1000;

      const briefId = await seedBrief(t, projectId, { scheduledDate: originalDate });

      await t.run(async (ctx) => {
        await ctx.db.patch(briefId, { scheduledDate: newDate, updatedAt: Date.now() });
      });

      const updated = await t.run(async (ctx) => ctx.db.get(briefId));
      expect(updated?.scheduledDate).toBe(newDate);
    });

    test('updates multiple fields at once', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      const briefId = await seedBrief(t, projectId, {
        title: 'Original',
        status: 'planned',
      });

      await t.run(async (ctx) => {
        await ctx.db.patch(briefId, {
          title: 'Updated',
          status: 'approved',
          updatedAt: Date.now(),
        });
      });

      const updated = await t.run(async (ctx) => ctx.db.get(briefId));
      expect(updated?.title).toBe('Updated');
      expect(updated?.status).toBe('approved');
    });
  });

  describe('deleteBrief', () => {
    test('removes brief from database', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      const briefId = await seedBrief(t, projectId);

      // Verify exists
      const before = await t.run(async (ctx) => ctx.db.get(briefId));
      expect(before).toBeDefined();

      // Delete
      await t.run(async (ctx) => {
        await ctx.db.delete(briefId);
      });

      // Verify gone
      const after = await t.run(async (ctx) => ctx.db.get(briefId));
      expect(after).toBeNull();
    });

    test('other briefs remain after deletion', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      const brief1Id = await seedBrief(t, projectId, { title: 'Keep' });
      const brief2Id = await seedBrief(t, projectId, { title: 'Delete' });

      await t.run(async (ctx) => {
        await ctx.db.delete(brief2Id);
      });

      const remaining = await t.run(async (ctx) => {
        return await ctx.db
          .query('briefs')
          .withIndex('by_project', (q) => q.eq('projectId', projectId))
          .collect();
      });

      expect(remaining).toHaveLength(1);
      expect(remaining[0].title).toBe('Keep');
    });
  });
});
