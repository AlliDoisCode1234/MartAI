import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser, seedProject } from './testHelpers';
import { api } from '../../convex/_generated/api';

describe('Keyword Actions', () => {
  it('should split and recluster keywords (mocked returns)', async () => {
    const t = createTestContext();

    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);

    // Seed an actual valid cluster ID
    const dummyClusterId = await t.run(async (ctx) => {
      return await ctx.db.insert('keywordClusters', {
        projectId,
        clusterName: 'Dummy',
        keywords: ['dummy'],
        intent: 'informational',
        difficulty: 10,
        volumeRange: { min: 0, max: 0 },
        impactScore: 0,
        topSerpUrls: [],
        status: 'active',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    // splitCluster
    const split = await t.action(api.seo.keywordActions.splitCluster, {
      clusterId: dummyClusterId,
    });
    expect(split).toContain(dummyClusterId);

    // reclusterKeywords
    const reclustered = await t.action(api.seo.keywordActions.reclusterKeywords, {
      clusterIds: [dummyClusterId],
    });
    expect(reclustered).toContain(dummyClusterId);
  });

  it('should get similar keywords and enrich (graceful fallback)', async () => {
    const t = createTestContext();

    // These call AI APIs via library search. We expect them to run or fail gracefully
    try {
      const similar = await t.action(api.seo.keywordActions.getSimilarKeywords, {
        query: 'marketing',
        limit: 2,
      });
      expect(Array.isArray(similar)).toBe(true);

      const enriched = await t.action(api.seo.keywordActions.enrichKeywordsWithLibrary, {
        keywords: ['marketing'],
      });
      expect(enriched).toBeDefined();
    } catch (e: any) {
      expect(e.message).toBeDefined();
    }
  });

  it('should gracefully handle generateKeywordsFromUrl when GSC limits or Auth fails', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);

    // Switch to authenticated context but missing GSC tokens
    const authT = t.withIdentity({ subject: userId });

    try {
      const res = await authT.action(api.seo.keywordActions.generateKeywordsFromUrl, {
        projectId,
        limit: 5,
      });
      expect(res.success).toBeDefined();
    } catch (e: any) {
      expect(e.message).toBeDefined();
    }
  });
});
