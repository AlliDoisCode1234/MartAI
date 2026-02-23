import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser, seedProject } from './testHelpers';
import { api } from '../../convex/_generated/api';

describe('Keywords Data', () => {
  it('should return aggregated and sorted keywords by project', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);

    // Insert multiple keywords to test sorting
    await t.run(async (ctx) => {
      await ctx.db.insert('keywords', {
        projectId,
        keyword: 'low priority',
        priority: 'low',
        searchVolume: 100,
        status: 'suggested',
        createdAt: Date.now(),
      });
      await ctx.db.insert('keywords', {
        projectId,
        keyword: 'high priority low vol',
        priority: 'high',
        searchVolume: 50,
        status: 'approved',
        createdAt: Date.now(),
      });
      await ctx.db.insert('keywords', {
        projectId,
        keyword: 'high priority high vol',
        priority: 'high',
        searchVolume: 5000,
        status: 'suggested',
        createdAt: Date.now(),
      });
    });

    const result = await t.query(api.seo.keywordsData.getKeywordsByProject, { projectId });

    expect(result.keywords).toHaveLength(3);
    expect(result.stats.total).toBe(3);

    // Sort logic: High priority first, then by search volume
    expect(result.keywords[0].keyword).toBe('high priority high vol');
    expect(result.keywords[1].keyword).toBe('high priority low vol');
    expect(result.keywords[2].keyword).toBe('low priority');

    expect(result.stats.highPriority).toBe(2);
    expect(result.stats.lowPriority).toBe(1);
    expect(result.stats.byStatus.suggested).toBe(2);
    expect(result.stats.byStatus.approved).toBe(1);
  });

  it('should return enriched keywords with cluster maps and GSC fallbacks', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);
    const authT = t.withIdentity({ subject: userId });

    const clusterId = await t.run(async (ctx) => {
      return await ctx.db.insert('keywordClusters', {
        projectId,
        clusterName: 'SEO Tools Cluster',
        keywords: ['seo tools', 'best seo software'],
        intent: 'informational',
        difficulty: 45,
        volumeRange: { min: 100, max: 1000 },
        impactScore: 0.8,
        topSerpUrls: [],
        status: 'active',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    await t.run(async (ctx) => {
      await ctx.db.insert('keywords', {
        projectId,
        keyword: 'seo tools', // Mapped by keyword string
        searchVolume: 1000,
        difficulty: 30, // Heuristic quick win
        status: 'suggested',
        createdAt: Date.now(),
      });
      await ctx.db.insert('keywords', {
        projectId,
        keyword: 'best seo software',
        clusterId, // Mapped by clusterId directly
        searchVolume: 500,
        status: 'suggested',
        createdAt: Date.now(),
      });

      // Seed GSC Snapshot for 'seo tools'
      await ctx.db.insert('gscKeywordSnapshots', {
        projectId,
        keyword: 'seo tools',
        position: 15,
        clicks: 100,
        impressions: 1000,
        ctr: 0.1,
        syncDate: Date.now(),
      });
    });

    const result = await authT.query(api.seo.keywordsData.getKeywordsEnriched, { projectId });

    expect(result.keywords).toHaveLength(2);

    const seoTools = result.keywords.find((k) => k.keyword === 'seo tools');
    expect(seoTools?.clusterName).toBe('SEO Tools Cluster');
    expect(seoTools?.gscPosition).toBe(15);
    expect(seoTools?.isQuickWin).toBe(true); // Pos 15 + vol 1000 = true

    const bestSeo = result.keywords.find((k) => k.keyword === 'best seo software');
    expect(bestSeo?.clusterName).toBe('SEO Tools Cluster');
  });

  it('should enforce read access on enriched keywords', async () => {
    const t = createTestContext();

    // Seed Owner
    const ownerId = await seedUser(t);
    const projectId = await seedProject(t, ownerId);

    // Seed Stranger
    const strangerId = await seedUser(t);

    // Switch auth context to stranger
    const strangerT = t.withIdentity({ subject: strangerId });

    await expect(
      strangerT.query(api.seo.keywordsData.getKeywordsEnriched, { projectId })
    ).rejects.toThrow();
  });
});
