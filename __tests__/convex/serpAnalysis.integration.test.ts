import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser, seedProject } from './testHelpers';
import { api } from '../../convex/_generated/api';

describe('SERP Analysis', () => {
  it('should store and retrieve SERP results', async () => {
    const t = createTestContext();
    const userId = await seedUser(t, { role: 'admin' });
    const projectId = await seedProject(t, userId);
    const authT = t.withIdentity({ subject: userId });

    const resultsPayload = [
      {
        position: 1,
        url: 'https://example.com',
        domain: 'example.com',
        title: 'Example',
        snippet: 'Example snippet',
        isAd: false,
      },
    ];

    // 1. Store Results
    const analysisId = await authT.mutation(api.seo.serpAnalysis.storeSerpResults, {
      projectId,
      keyword: 'seo tools',
      location: 'US',
      results: resultsPayload,
      searchVolume: 1000,
      difficulty: 60,
    });

    expect(analysisId).toBeDefined();

    // 2. Store again with same keyword should update
    const updatedAnalysisId = await authT.mutation(api.seo.serpAnalysis.storeSerpResults, {
      projectId,
      keyword: 'seo tools',
      results: resultsPayload,
      searchVolume: 2000, // Changed
    });

    expect(updatedAnalysisId).toBe(analysisId);

    // 3. Get By Project
    const byProject = await authT.query(api.seo.serpAnalysis.getByProject, { projectId });
    expect(byProject).toHaveLength(1);
    expect(byProject[0].searchVolume).toBe(2000);

    // 4. Get By Keyword
    const byKeyword = await authT.query(api.seo.serpAnalysis.getByKeyword, {
      projectId,
      keyword: 'seo tools',
    });
    expect(byKeyword?.keyword).toBe('seo tools');

    // 5. Get Count and Limits
    const count = await authT.query(api.seo.serpAnalysis.getAnalysisCount, { projectId });
    expect(count).toBe(1);

    const limits = await authT.query(api.seo.serpAnalysis.canAnalyze, { projectId });
    expect(limits.used).toBe(1);
    expect(limits.limit).toBe(1);
    expect(limits.canAnalyze).toBe(false); // Hit the free limit
  });

  it('should enforce access controls', async () => {
    const t = createTestContext();

    // Seed Owner
    const ownerId = await seedUser(t);
    const projectId = await seedProject(t, ownerId);

    // Seed Stranger
    const strangerId = await seedUser(t);
    const strangerT = t.withIdentity({ subject: strangerId });

    await expect(
      strangerT.query(api.seo.serpAnalysis.getByProject, { projectId })
    ).rejects.toThrow();

    await expect(
      strangerT.query(api.seo.serpAnalysis.verifyEditorAccess, { projectId })
    ).rejects.toThrow();
  });
});
