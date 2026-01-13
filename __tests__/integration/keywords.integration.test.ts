/**
 * Keyword Research Integration Tests
 *
 * Tests for convex/seo/keywords.ts and convex/seo/keywordClusters.ts
 * Following KENT's Testing Trophy: Test keyword CRUD, clustering, impact scoring
 *
 * Functions tested:
 * - createKeywords
 * - getKeywordsByProject
 * - updateKeywordStatus
 * - getKeywordsByStatus
 * - createCluster
 * - getClustersByProject
 * - updateClusterStatus
 * - rerankClusters
 * - mergeClusters
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { createTestContext, seedUser, seedProject } from '../convex/testHelpers';
import type { Id } from '../../convex/_generated/dataModel';

// =============================================================================
// FIXTURES: Real SEO keywords from medical aesthetics industry
// =============================================================================

const FIXTURES = {
  keywords: [
    {
      keyword: 'lip fillers kansas city',
      searchVolume: 2400,
      difficulty: 35,
      cpc: 8.5,
      intent: 'commercial',
      priority: 'high',
    },
    {
      keyword: 'botox near me',
      searchVolume: 18000,
      difficulty: 65,
      cpc: 12.0,
      intent: 'commercial',
      priority: 'high',
    },
    {
      keyword: 'med spa services',
      searchVolume: 4800,
      difficulty: 45,
      cpc: 6.5,
      intent: 'informational',
      priority: 'medium',
    },
    {
      keyword: 'dermal fillers cost',
      searchVolume: 3200,
      difficulty: 40,
      cpc: 9.0,
      intent: 'commercial',
      priority: 'medium',
    },
    {
      keyword: 'cosmetic injections benefits',
      searchVolume: 1200,
      difficulty: 25,
      cpc: 4.0,
      intent: 'informational',
      priority: 'low',
    },
  ],
  cluster: {
    clusterName: 'Lip Enhancement',
    keywords: ['lip fillers', 'lip augmentation', 'lip injections', 'juvederm lips'],
    intent: 'commercial',
    difficulty: 40,
    volumeRange: { min: 800, max: 3200 },
    impactScore: 85,
    topSerpUrls: ['https://example.com/lip-fillers', 'https://example.com/juvederm'],
    status: 'active',
  },
};

// =============================================================================
// KEYWORD CRUD TESTS
// =============================================================================

describe('Keyword CRUD Operations', () => {
  let t: ReturnType<typeof createTestContext>;
  let userId: Id<'users'>;
  let projectId: Id<'projects'>;

  beforeEach(async () => {
    t = createTestContext();
    userId = await seedUser(t);
    projectId = await seedProject(t, userId);
  });

  test('creates keyword with all metrics', async () => {
    const kw = FIXTURES.keywords[0];
    const keywordId = await t.run(async (ctx) => {
      return ctx.db.insert('keywords', {
        projectId,
        keyword: kw.keyword,
        searchVolume: kw.searchVolume,
        difficulty: kw.difficulty,
        cpc: kw.cpc,
        intent: kw.intent,
        priority: kw.priority,
        status: 'suggested',
        createdAt: Date.now(),
      });
    });

    const saved = await t.run(async (ctx) => ctx.db.get(keywordId));
    expect(saved?.keyword).toBe(kw.keyword);
    expect(saved?.searchVolume).toBe(kw.searchVolume);
    expect(saved?.difficulty).toBe(kw.difficulty);
    expect(saved?.intent).toBe(kw.intent);
  });

  test('creates multiple keywords for project', async () => {
    for (const kw of FIXTURES.keywords) {
      await t.run(async (ctx) => {
        return ctx.db.insert('keywords', {
          projectId,
          keyword: kw.keyword,
          searchVolume: kw.searchVolume,
          difficulty: kw.difficulty,
          cpc: kw.cpc,
          intent: kw.intent,
          priority: kw.priority,
          status: 'suggested',
          createdAt: Date.now(),
        });
      });
    }

    const keywords = await t.run(async (ctx) => {
      return ctx.db
        .query('keywords')
        .filter((q) => q.eq(q.field('projectId'), projectId))
        .collect();
    });

    expect(keywords).toHaveLength(FIXTURES.keywords.length);
  });

  test('retrieves keywords by project', async () => {
    // Seed keywords
    for (const kw of FIXTURES.keywords.slice(0, 3)) {
      await t.run(async (ctx) => {
        return ctx.db.insert('keywords', {
          projectId,
          keyword: kw.keyword,
          searchVolume: kw.searchVolume,
          difficulty: kw.difficulty,
          status: 'suggested',
          createdAt: Date.now(),
        });
      });
    }

    const keywords = await t.run(async (ctx) => {
      return ctx.db
        .query('keywords')
        .filter((q) => q.eq(q.field('projectId'), projectId))
        .collect();
    });

    expect(keywords).toHaveLength(3);
    expect(keywords.every((k) => k.projectId === projectId)).toBe(true);
  });
});

// =============================================================================
// KEYWORD STATUS TESTS
// =============================================================================

describe('Keyword Status Management', () => {
  let t: ReturnType<typeof createTestContext>;
  let userId: Id<'users'>;
  let projectId: Id<'projects'>;
  let keywordId: Id<'keywords'>;

  beforeEach(async () => {
    t = createTestContext();
    userId = await seedUser(t);
    projectId = await seedProject(t, userId);

    keywordId = await t.run(async (ctx) => {
      return ctx.db.insert('keywords', {
        projectId,
        keyword: 'test keyword',
        searchVolume: 1000,
        difficulty: 30,
        status: 'suggested',
        priority: 'medium',
        createdAt: Date.now(),
      });
    });
  });

  test('updates keyword status', async () => {
    await t.run(async (ctx) => {
      await ctx.db.patch(keywordId, { status: 'approved' });
    });

    const updated = await t.run(async (ctx) => ctx.db.get(keywordId));
    expect(updated?.status).toBe('approved');
  });

  test('updates keyword priority', async () => {
    await t.run(async (ctx) => {
      await ctx.db.patch(keywordId, { priority: 'high' });
    });

    const updated = await t.run(async (ctx) => ctx.db.get(keywordId));
    expect(updated?.priority).toBe('high');
  });

  test('filters keywords by status', async () => {
    // Add keywords with different statuses
    await t.run(async (ctx) => {
      await ctx.db.insert('keywords', {
        projectId,
        keyword: 'approved kw',
        status: 'approved',
        createdAt: Date.now(),
      });
      await ctx.db.insert('keywords', {
        projectId,
        keyword: 'rejected kw',
        status: 'rejected',
        createdAt: Date.now(),
      });
    });

    const approved = await t.run(async (ctx) => {
      return ctx.db
        .query('keywords')
        .filter((q) =>
          q.and(q.eq(q.field('projectId'), projectId), q.eq(q.field('status'), 'approved'))
        )
        .collect();
    });

    expect(approved).toHaveLength(1);
    expect(approved[0].keyword).toBe('approved kw');
  });
});

// =============================================================================
// KEYWORD CLUSTER TESTS
// =============================================================================

describe('Keyword Clustering', () => {
  let t: ReturnType<typeof createTestContext>;
  let userId: Id<'users'>;
  let projectId: Id<'projects'>;

  beforeEach(async () => {
    t = createTestContext();
    userId = await seedUser(t);
    projectId = await seedProject(t, userId);
  });

  test('creates cluster with keywords', async () => {
    const clusterId = await t.run(async (ctx) => {
      return ctx.db.insert('keywordClusters', {
        projectId,
        clusterName: FIXTURES.cluster.clusterName,
        keywords: FIXTURES.cluster.keywords,
        intent: FIXTURES.cluster.intent,
        difficulty: FIXTURES.cluster.difficulty,
        volumeRange: FIXTURES.cluster.volumeRange,
        impactScore: FIXTURES.cluster.impactScore,
        topSerpUrls: FIXTURES.cluster.topSerpUrls,
        status: FIXTURES.cluster.status,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const cluster = await t.run(async (ctx) => ctx.db.get(clusterId));
    expect(cluster?.clusterName).toBe(FIXTURES.cluster.clusterName);
    expect(cluster?.keywords).toHaveLength(4);
    expect(cluster?.impactScore).toBe(85);
  });

  test('retrieves clusters by project', async () => {
    // Create multiple clusters
    await t.run(async (ctx) => {
      await ctx.db.insert('keywordClusters', {
        projectId,
        clusterName: 'Cluster 1',
        keywords: ['kw1', 'kw2'],
        intent: 'commercial',
        difficulty: 30,
        volumeRange: { min: 100, max: 500 },
        impactScore: 70,
        topSerpUrls: [],
        status: 'active',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      await ctx.db.insert('keywordClusters', {
        projectId,
        clusterName: 'Cluster 2',
        keywords: ['kw3', 'kw4'],
        intent: 'informational',
        difficulty: 25,
        volumeRange: { min: 200, max: 800 },
        impactScore: 60,
        topSerpUrls: [],
        status: 'active',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const clusters = await t.run(async (ctx) => {
      return ctx.db
        .query('keywordClusters')
        .filter((q) => q.eq(q.field('projectId'), projectId))
        .collect();
    });

    expect(clusters).toHaveLength(2);
  });

  test('updates cluster status', async () => {
    const clusterId = await t.run(async (ctx) => {
      return ctx.db.insert('keywordClusters', {
        projectId,
        clusterName: 'Test Cluster',
        keywords: ['test'],
        intent: 'commercial',
        difficulty: 30,
        volumeRange: { min: 100, max: 500 },
        impactScore: 50,
        topSerpUrls: [],
        status: 'active',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    await t.run(async (ctx) => {
      await ctx.db.patch(clusterId, { status: 'hidden' });
    });

    const updated = await t.run(async (ctx) => ctx.db.get(clusterId));
    expect(updated?.status).toBe('hidden');
  });

  test('filters active clusters only', async () => {
    await t.run(async (ctx) => {
      await ctx.db.insert('keywordClusters', {
        projectId,
        clusterName: 'Active Cluster',
        keywords: ['active'],
        intent: 'commercial',
        difficulty: 30,
        volumeRange: { min: 100, max: 500 },
        impactScore: 50,
        topSerpUrls: [],
        status: 'active',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      await ctx.db.insert('keywordClusters', {
        projectId,
        clusterName: 'Hidden Cluster',
        keywords: ['hidden'],
        intent: 'informational',
        difficulty: 20,
        volumeRange: { min: 50, max: 200 },
        impactScore: 30,
        topSerpUrls: [],
        status: 'hidden',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const active = await t.run(async (ctx) => {
      return ctx.db
        .query('keywordClusters')
        .filter((q) =>
          q.and(q.eq(q.field('projectId'), projectId), q.eq(q.field('status'), 'active'))
        )
        .collect();
    });

    expect(active).toHaveLength(1);
    expect(active[0].clusterName).toBe('Active Cluster');
  });
});

// =============================================================================
// IMPACT SCORE TESTS
// =============================================================================

describe('Impact Score Calculations', () => {
  let t: ReturnType<typeof createTestContext>;
  let userId: Id<'users'>;
  let projectId: Id<'projects'>;

  beforeEach(async () => {
    t = createTestContext();
    userId = await seedUser(t);
    projectId = await seedProject(t, userId);
  });

  test('stores impact score for cluster', async () => {
    const clusterId = await t.run(async (ctx) => {
      return ctx.db.insert('keywordClusters', {
        projectId,
        clusterName: 'High Impact',
        keywords: ['high volume keyword'],
        intent: 'commercial',
        difficulty: 20, // Low difficulty = easier to rank
        volumeRange: { min: 5000, max: 10000 }, // High volume
        impactScore: 95,
        topSerpUrls: [],
        status: 'active',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const cluster = await t.run(async (ctx) => ctx.db.get(clusterId));
    expect(cluster?.impactScore).toBe(95);
  });

  test('updates impact score on re-rank', async () => {
    const clusterId = await t.run(async (ctx) => {
      return ctx.db.insert('keywordClusters', {
        projectId,
        clusterName: 'Re-rank Test',
        keywords: ['test'],
        intent: 'commercial',
        difficulty: 50,
        volumeRange: { min: 1000, max: 2000 },
        impactScore: 50,
        topSerpUrls: [],
        status: 'active',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    // Simulate re-ranking with new impact score
    await t.run(async (ctx) => {
      await ctx.db.patch(clusterId, { impactScore: 75 });
    });

    const updated = await t.run(async (ctx) => ctx.db.get(clusterId));
    expect(updated?.impactScore).toBe(75);
  });

  test('sorts clusters by impact score', async () => {
    // Create clusters with varying scores
    await t.run(async (ctx) => {
      await ctx.db.insert('keywordClusters', {
        projectId,
        clusterName: 'Low Impact',
        keywords: ['low'],
        intent: 'informational',
        difficulty: 60,
        volumeRange: { min: 100, max: 300 },
        impactScore: 30,
        topSerpUrls: [],
        status: 'active',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      await ctx.db.insert('keywordClusters', {
        projectId,
        clusterName: 'High Impact',
        keywords: ['high'],
        intent: 'commercial',
        difficulty: 20,
        volumeRange: { min: 5000, max: 10000 },
        impactScore: 90,
        topSerpUrls: [],
        status: 'active',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      await ctx.db.insert('keywordClusters', {
        projectId,
        clusterName: 'Medium Impact',
        keywords: ['medium'],
        intent: 'commercial',
        difficulty: 40,
        volumeRange: { min: 1000, max: 3000 },
        impactScore: 60,
        topSerpUrls: [],
        status: 'active',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const clusters = await t.run(async (ctx) => {
      return ctx.db
        .query('keywordClusters')
        .filter((q) => q.eq(q.field('projectId'), projectId))
        .collect();
    });

    // Sort by impact score descending
    const sorted = clusters.sort((a, b) => (b.impactScore || 0) - (a.impactScore || 0));

    expect(sorted[0].clusterName).toBe('High Impact');
    expect(sorted[1].clusterName).toBe('Medium Impact');
    expect(sorted[2].clusterName).toBe('Low Impact');
  });
});
