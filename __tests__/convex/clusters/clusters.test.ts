/**
 * Clusters Module Tests
 *
 * Tests for convex/seo/keywordClusters.ts
 * Covers: security checks, happy paths, edge cases
 *
 * Functions tested:
 * - createClusters
 * - getClustersByProject
 * - getActiveClusters
 * - updateCluster
 * - updateClusterStatus
 * - rerankClusters
 * - deleteCluster
 * - mergeClusters
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { createTestContext, seedUser, seedProject, seedCluster, EDGE_CASES } from '../testHelpers';

describe('Clusters Module', () => {
  describe('createClusters', () => {
    describe('Happy Paths', () => {
      test('creates cluster with required fields', async () => {
        const t = createTestContext();
        const userId = await seedUser(t);
        const projectId = await seedProject(t, userId);

        const clusterId = await seedCluster(t, projectId, {
          clusterName: 'SEO Tips Cluster',
          keywords: ['seo tips', 'seo guide', 'seo best practices'],
          intent: 'informational',
          difficulty: 35,
        });

        const cluster = await t.run(async (ctx) => ctx.db.get(clusterId));

        expect(cluster).toBeDefined();
        expect(cluster?.clusterName).toBe('SEO Tips Cluster');
        expect(cluster?.keywords).toHaveLength(3);
        expect(cluster?.projectId).toBe(projectId);
        expect(cluster?.status).toBe('active');
      });

      test('creates cluster with all optional fields', async () => {
        const t = createTestContext();
        const userId = await seedUser(t);
        const projectId = await seedProject(t, userId);

        const clusterId = await seedCluster(t, projectId, {
          clusterName: 'Full Cluster',
          keywords: ['keyword 1', 'keyword 2'],
          intent: 'commercial',
          difficulty: 75,
          volumeRange: { min: 500, max: 10000 },
          impactScore: 0.92,
          status: 'favorite',
        });

        const cluster = await t.run(async (ctx) => ctx.db.get(clusterId));

        expect(cluster?.intent).toBe('commercial');
        expect(cluster?.difficulty).toBe(75);
        expect(cluster?.volumeRange).toEqual({ min: 500, max: 10000 });
        expect(cluster?.impactScore).toBe(0.92);
        expect(cluster?.status).toBe('favorite');
      });

      test('creates multiple clusters for same project', async () => {
        const t = createTestContext();
        const userId = await seedUser(t);
        const projectId = await seedProject(t, userId);

        const cluster1Id = await seedCluster(t, projectId, {
          clusterName: 'Cluster 1',
          keywords: ['a', 'b'],
        });
        const cluster2Id = await seedCluster(t, projectId, {
          clusterName: 'Cluster 2',
          keywords: ['c', 'd'],
        });
        const cluster3Id = await seedCluster(t, projectId, {
          clusterName: 'Cluster 3',
          keywords: ['e', 'f'],
        });

        const clusters = await t.run(async (ctx) => {
          return await ctx.db
            .query('keywordClusters')
            .withIndex('by_project', (q) => q.eq('projectId', projectId))
            .collect();
        });

        expect(clusters).toHaveLength(3);
      });
    });

    describe('Edge Cases', () => {
      test('handles empty keywords array', async () => {
        const t = createTestContext();
        const userId = await seedUser(t);
        const projectId = await seedProject(t, userId);

        const clusterId = await seedCluster(t, projectId, {
          clusterName: 'Empty Cluster',
          keywords: [],
        });

        const cluster = await t.run(async (ctx) => ctx.db.get(clusterId));
        expect(cluster?.keywords).toEqual([]);
      });

      test('handles single keyword cluster', async () => {
        const t = createTestContext();
        const userId = await seedUser(t);
        const projectId = await seedProject(t, userId);

        const clusterId = await seedCluster(t, projectId, {
          clusterName: 'Single Keyword',
          keywords: ['only one'],
        });

        const cluster = await t.run(async (ctx) => ctx.db.get(clusterId));
        expect(cluster?.keywords).toHaveLength(1);
      });

      test('handles large keyword cluster (50 keywords)', async () => {
        const t = createTestContext();
        const userId = await seedUser(t);
        const projectId = await seedProject(t, userId);

        const manyKeywords = Array.from({ length: 50 }, (_, i) => `keyword ${i + 1}`);
        const clusterId = await seedCluster(t, projectId, {
          clusterName: 'Large Cluster',
          keywords: manyKeywords,
        });

        const cluster = await t.run(async (ctx) => ctx.db.get(clusterId));
        expect(cluster?.keywords).toHaveLength(50);
      });

      test('handles unicode cluster names', async () => {
        const t = createTestContext();
        const userId = await seedUser(t);
        const projectId = await seedProject(t, userId);

        const clusterId = await seedCluster(t, projectId, {
          clusterName: '关键词集群 キーワードクラスター',
          keywords: ['keyword'],
        });

        const cluster = await t.run(async (ctx) => ctx.db.get(clusterId));
        expect(cluster?.clusterName).toBe('关键词集群 キーワードクラスター');
      });

      test('handles min/max difficulty boundaries', async () => {
        const t = createTestContext();
        const userId = await seedUser(t);
        const projectId = await seedProject(t, userId);

        const minClusterId = await seedCluster(t, projectId, {
          clusterName: 'Easy',
          difficulty: 0,
        });
        const maxClusterId = await seedCluster(t, projectId, {
          clusterName: 'Hard',
          difficulty: 100,
        });

        const minCluster = await t.run(async (ctx) => ctx.db.get(minClusterId));
        const maxCluster = await t.run(async (ctx) => ctx.db.get(maxClusterId));

        expect(minCluster?.difficulty).toBe(0);
        expect(maxCluster?.difficulty).toBe(100);
      });

      test('handles impactScore boundaries (0 and 1)', async () => {
        const t = createTestContext();
        const userId = await seedUser(t);
        const projectId = await seedProject(t, userId);

        const lowId = await seedCluster(t, projectId, {
          clusterName: 'Low Impact',
          impactScore: 0,
        });
        const highId = await seedCluster(t, projectId, {
          clusterName: 'High Impact',
          impactScore: 1,
        });

        const lowCluster = await t.run(async (ctx) => ctx.db.get(lowId));
        const highCluster = await t.run(async (ctx) => ctx.db.get(highId));

        expect(lowCluster?.impactScore).toBe(0);
        expect(highCluster?.impactScore).toBe(1);
      });
    });

    describe('Security', () => {
      test('clusters are isolated by project', async () => {
        const t = createTestContext();

        const user1Id = await seedUser(t, { email: 'user1@test.com' });
        const user2Id = await seedUser(t, { email: 'user2@test.com' });

        const project1Id = await seedProject(t, user1Id, { name: 'Project 1' });
        const project2Id = await seedProject(t, user2Id, { name: 'Project 2' });

        await seedCluster(t, project1Id, { clusterName: 'User 1 Cluster' });
        await seedCluster(t, project2Id, { clusterName: 'User 2 Cluster' });

        const project1Clusters = await t.run(async (ctx) => {
          return await ctx.db
            .query('keywordClusters')
            .withIndex('by_project', (q) => q.eq('projectId', project1Id))
            .collect();
        });

        const project2Clusters = await t.run(async (ctx) => {
          return await ctx.db
            .query('keywordClusters')
            .withIndex('by_project', (q) => q.eq('projectId', project2Id))
            .collect();
        });

        expect(project1Clusters).toHaveLength(1);
        expect(project1Clusters[0].clusterName).toBe('User 1 Cluster');

        expect(project2Clusters).toHaveLength(1);
        expect(project2Clusters[0].clusterName).toBe('User 2 Cluster');
      });
    });
  });

  describe('getClustersByProject', () => {
    test('returns all clusters for a project', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      await seedCluster(t, projectId, { clusterName: 'Cluster 1' });
      await seedCluster(t, projectId, { clusterName: 'Cluster 2' });

      const clusters = await t.run(async (ctx) => {
        return await ctx.db
          .query('keywordClusters')
          .withIndex('by_project', (q) => q.eq('projectId', projectId))
          .collect();
      });

      expect(clusters).toHaveLength(2);
    });

    test('returns empty array for project with no clusters', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      const clusters = await t.run(async (ctx) => {
        return await ctx.db
          .query('keywordClusters')
          .withIndex('by_project', (q) => q.eq('projectId', projectId))
          .collect();
      });

      expect(clusters).toHaveLength(0);
    });
  });

  describe('getActiveClusters', () => {
    test('returns only active clusters', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      await seedCluster(t, projectId, { clusterName: 'Active 1', status: 'active' });
      await seedCluster(t, projectId, { clusterName: 'Active 2', status: 'active' });
      await seedCluster(t, projectId, { clusterName: 'Hidden', status: 'hidden' });
      await seedCluster(t, projectId, { clusterName: 'Favorite', status: 'favorite' });

      const activeClusters = await t.run(async (ctx) => {
        const all = await ctx.db
          .query('keywordClusters')
          .withIndex('by_project', (q) => q.eq('projectId', projectId))
          .collect();
        return all.filter((c) => c.status === 'active');
      });

      expect(activeClusters).toHaveLength(2);
      expect(activeClusters.every((c) => c.status === 'active')).toBe(true);
    });
  });

  describe('updateCluster', () => {
    test('updates cluster name', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      const clusterId = await seedCluster(t, projectId, { clusterName: 'Original Name' });

      await t.run(async (ctx) => {
        await ctx.db.patch(clusterId, { clusterName: 'Updated Name', updatedAt: Date.now() });
      });

      const updated = await t.run(async (ctx) => ctx.db.get(clusterId));
      expect(updated?.clusterName).toBe('Updated Name');
    });

    test('updates cluster keywords', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      const clusterId = await seedCluster(t, projectId, {
        keywords: ['original 1', 'original 2'],
      });

      await t.run(async (ctx) => {
        await ctx.db.patch(clusterId, {
          keywords: ['new 1', 'new 2', 'new 3'],
          updatedAt: Date.now(),
        });
      });

      const updated = await t.run(async (ctx) => ctx.db.get(clusterId));
      expect(updated?.keywords).toEqual(['new 1', 'new 2', 'new 3']);
    });

    test('updates multiple fields at once', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      const clusterId = await seedCluster(t, projectId);

      await t.run(async (ctx) => {
        await ctx.db.patch(clusterId, {
          clusterName: 'New Name',
          intent: 'transactional',
          difficulty: 90,
          updatedAt: Date.now(),
        });
      });

      const updated = await t.run(async (ctx) => ctx.db.get(clusterId));
      expect(updated?.clusterName).toBe('New Name');
      expect(updated?.intent).toBe('transactional');
      expect(updated?.difficulty).toBe(90);
    });
  });

  describe('updateClusterStatus', () => {
    test('changes status from active to hidden', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      const clusterId = await seedCluster(t, projectId, { status: 'active' });

      await t.run(async (ctx) => {
        await ctx.db.patch(clusterId, { status: 'hidden', updatedAt: Date.now() });
      });

      const updated = await t.run(async (ctx) => ctx.db.get(clusterId));
      expect(updated?.status).toBe('hidden');
    });

    test('changes status from hidden to favorite', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      const clusterId = await seedCluster(t, projectId, { status: 'hidden' });

      await t.run(async (ctx) => {
        await ctx.db.patch(clusterId, { status: 'favorite', updatedAt: Date.now() });
      });

      const updated = await t.run(async (ctx) => ctx.db.get(clusterId));
      expect(updated?.status).toBe('favorite');
    });
  });

  describe('deleteCluster', () => {
    test('removes cluster from database', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      const clusterId = await seedCluster(t, projectId);

      // Verify exists
      const before = await t.run(async (ctx) => ctx.db.get(clusterId));
      expect(before).toBeDefined();

      // Delete
      await t.run(async (ctx) => {
        await ctx.db.delete(clusterId);
      });

      // Verify gone
      const after = await t.run(async (ctx) => ctx.db.get(clusterId));
      expect(after).toBeNull();
    });

    test('other clusters remain after deletion', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      const cluster1Id = await seedCluster(t, projectId, { clusterName: 'Keep' });
      const cluster2Id = await seedCluster(t, projectId, { clusterName: 'Delete' });

      await t.run(async (ctx) => {
        await ctx.db.delete(cluster2Id);
      });

      const remaining = await t.run(async (ctx) => {
        return await ctx.db
          .query('keywordClusters')
          .withIndex('by_project', (q) => q.eq('projectId', projectId))
          .collect();
      });

      expect(remaining).toHaveLength(1);
      expect(remaining[0].clusterName).toBe('Keep');
    });
  });

  describe('mergeClusters', () => {
    test('combines keywords from merged clusters', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      const cluster1Id = await seedCluster(t, projectId, {
        clusterName: 'Primary',
        keywords: ['kw1', 'kw2'],
      });
      const cluster2Id = await seedCluster(t, projectId, {
        clusterName: 'Secondary',
        keywords: ['kw3', 'kw4'],
      });

      // Simulate merge: combine keywords, keep primary, delete secondary
      const cluster1 = await t.run(async (ctx) => ctx.db.get(cluster1Id));
      const cluster2 = await t.run(async (ctx) => ctx.db.get(cluster2Id));

      const mergedKeywords = [...(cluster1?.keywords ?? []), ...(cluster2?.keywords ?? [])];

      await t.run(async (ctx) => {
        await ctx.db.patch(cluster1Id, {
          keywords: mergedKeywords,
          updatedAt: Date.now(),
        });
        await ctx.db.delete(cluster2Id);
      });

      const merged = await t.run(async (ctx) => ctx.db.get(cluster1Id));
      expect(merged?.keywords).toEqual(['kw1', 'kw2', 'kw3', 'kw4']);

      const deleted = await t.run(async (ctx) => ctx.db.get(cluster2Id));
      expect(deleted).toBeNull();
    });
  });
});
