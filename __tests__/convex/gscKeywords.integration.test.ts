import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser, seedProject } from './testHelpers';
import { api, internal } from '../../convex/_generated/api';

describe('GSC Keywords', () => {
  it('should store snapshots and fetch dashboard stats', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);

    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const twoDays = 2 * oneDay;

    // 1. Store Snapshots (internal)
    await t.mutation(internal.analytics.gscKeywords.storeKeywordSnapshot, {
      projectId,
      syncDate: now - twoDays,
      keyword: 'seo tools',
      clicks: 10,
      impressions: 100,
      ctr: 10,
      position: 12,
    });

    await t.mutation(internal.analytics.gscKeywords.storeKeywordSnapshot, {
      projectId,
      syncDate: now,
      keyword: 'seo tools', // newer snapshot of same keyword
      clicks: 15,
      impressions: 150,
      ctr: 10,
      position: 8, // Quick win!
    });

    await t.mutation(internal.analytics.gscKeywords.storeKeywordSnapshot, {
      projectId,
      syncDate: now,
      keyword: 'marketing software',
      clicks: 5,
      impressions: 50,
      ctr: 10,
      position: 20,
    });

    const authT = t.withIdentity({ subject: userId });

    // 2. Get Latest Keywords
    const latest = await authT.query(api.analytics.gscKeywords.getLatestKeywords, {
      projectId,
    });
    expect(latest).toHaveLength(2); // unique keywords

    // 3. Get History
    const history = await authT.query(api.analytics.gscKeywords.getKeywordHistory, {
      projectId,
      keyword: 'seo tools',
    });
    expect(history).toHaveLength(2);

    // 4. Get Quick Wins (internal)
    const quickWins = await t.query(internal.analytics.gscKeywords.getQuickWinKeywords, {
      projectId,
      minImpressions: 100,
    });
    expect(quickWins).toHaveLength(1);
    expect(quickWins[0].keyword).toBe('seo tools'); // pos 8 is between 5 and 15

    // 5. Get Changes (internal)
    const changes = await t.query(internal.analytics.gscKeywords.getKeywordChanges, {
      projectId,
      currentDate: now,
      previousDate: now - twoDays,
    });

    const toolChange = changes.find((c) => c.keyword === 'seo tools');
    expect(toolChange?.positionChange).toBe(4); // 12 -> 8

    // 6. Dashboard Stats
    const dashboard = await authT.query(api.analytics.gscKeywords.getGSCDashboardStats, {
      projectId,
    });
    expect(dashboard?.totalClicks).toBe(20); // 15 + 5
    expect(dashboard?.keywordCount).toBe(2);
  });
});
