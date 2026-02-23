import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser, seedProject } from './testHelpers';
import { api, internal } from '../../convex/_generated/api';

describe('MartAI Rating Queries', () => {
  it('should store a score and fetch its history', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);

    // Store a mock score
    await t.mutation(internal.analytics.martaiRatingQueries.storeScore, {
      projectId,
      date: Date.now(),
      overall: 85,
      tier: 'really_good',
      visibility: 80,
      trafficHealth: 90,
      ctrPerformance: 70,
      engagementQuality: 60,
      quickWinPotential: 90,
      contentVelocity: 100,
    });

    const authT = t.withIdentity({ subject: userId });

    // Fetch Latest
    const latest = await authT.query(api.analytics.martaiRatingQueries.getLatestScore, {
      projectId,
    });
    expect(latest?.overall).toBe(85);

    // Fetch History
    const history = await authT.query(api.analytics.martaiRatingQueries.getScoreHistory, {
      projectId,
    });
    expect(history).toHaveLength(1);
    expect(history[0].tier).toBe('really_good');
  });

  it('should calculate a preliminary score from keywords and clusters', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);

    // With 0 keywords/clusters, the preliminary score should just be the base 10 + 5 + 5
    const prelim = await t.mutation(api.analytics.martaiRatingQueries.generatePreliminaryScore, {
      projectId,
    });

    expect(prelim.overall).toBe(20); // 10 base + 5 keyword (for 0) + 5 cluster (for 0)
    expect(prelim.tier).toBe('needs_work');

    // Generating again should return the existing non-overwritten score
    const prelim2 = await t.mutation(api.analytics.martaiRatingQueries.generatePreliminaryScore, {
      projectId,
    });
    expect(prelim2.overall).toBe(20);
  });
});
