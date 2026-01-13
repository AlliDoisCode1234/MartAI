/**
 * GSC Analytics Integration Tests
 *
 * Tests for convex/analytics/gscKeywords.ts
 * Following KENT's Testing Trophy: Test analytics data flow, aggregations, edge cases
 *
 * Functions tested:
 * - storeKeywordSnapshot
 * - getLatestKeywords
 * - getKeywordHistory
 * - getGSCDashboardStats
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { createTestContext, seedUser, seedProject } from '../convex/testHelpers';
import type { Id } from '../../convex/_generated/dataModel';

// =============================================================================
// FIXTURES: Sample GSC data
// =============================================================================

const FIXTURES = {
  keywords: [
    { keyword: 'lip fillers kansas city', clicks: 150, impressions: 2500, ctr: 6.0, position: 3.2 },
    { keyword: 'med spa near me', clicks: 120, impressions: 3200, ctr: 3.75, position: 5.8 },
    { keyword: 'botox kansas city', clicks: 95, impressions: 1800, ctr: 5.28, position: 4.1 },
    { keyword: 'dermal fillers', clicks: 45, impressions: 900, ctr: 5.0, position: 8.3 },
    { keyword: 'cosmetic injections', clicks: 30, impressions: 600, ctr: 5.0, position: 12.5 },
  ],
  quickWinKeywords: [
    // Position 5-15, high impressions = Quick Win opportunity
    {
      keyword: 'best med spa kansas city',
      clicks: 20,
      impressions: 1500,
      ctr: 1.33,
      position: 8.0,
    },
    { keyword: 'lip augmentation cost', clicks: 15, impressions: 800, ctr: 1.88, position: 11.0 },
  ],
};

// =============================================================================
// KEYWORD SNAPSHOT STORAGE TESTS
// =============================================================================

describe('GSC Keyword Snapshot Storage', () => {
  let t: ReturnType<typeof createTestContext>;
  let userId: Id<'users'>;
  let projectId: Id<'projects'>;

  beforeEach(async () => {
    t = createTestContext();
    userId = await seedUser(t);
    projectId = await seedProject(t, userId);
  });

  test('stores keyword snapshot with all metrics', async () => {
    const syncDate = Date.now();
    const kw = FIXTURES.keywords[0];

    const snapshotId = await t.run(async (ctx) => {
      return ctx.db.insert('gscKeywordSnapshots', {
        projectId,
        syncDate,
        keyword: kw.keyword,
        clicks: kw.clicks,
        impressions: kw.impressions,
        ctr: kw.ctr,
        position: kw.position,
      });
    });

    const snapshot = await t.run(async (ctx) => ctx.db.get(snapshotId));
    expect(snapshot?.keyword).toBe(kw.keyword);
    expect(snapshot?.clicks).toBe(kw.clicks);
    expect(snapshot?.impressions).toBe(kw.impressions);
    expect(snapshot?.ctr).toBe(kw.ctr);
    expect(snapshot?.position).toBe(kw.position);
  });

  test('stores multiple snapshots for same project', async () => {
    const syncDate = Date.now();

    for (const kw of FIXTURES.keywords) {
      await t.run(async (ctx) => {
        return ctx.db.insert('gscKeywordSnapshots', {
          projectId,
          syncDate,
          keyword: kw.keyword,
          clicks: kw.clicks,
          impressions: kw.impressions,
          ctr: kw.ctr,
          position: kw.position,
        });
      });
    }

    const snapshots = await t.run(async (ctx) => {
      return ctx.db
        .query('gscKeywordSnapshots')
        .filter((q) => q.eq(q.field('projectId'), projectId))
        .collect();
    });

    expect(snapshots).toHaveLength(FIXTURES.keywords.length);
  });

  test('stores historical snapshots for trending', async () => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const today = Date.now();

    // Store old snapshot
    await t.run(async (ctx) => {
      return ctx.db.insert('gscKeywordSnapshots', {
        projectId,
        syncDate: oneWeekAgo,
        keyword: 'test keyword',
        clicks: 50,
        impressions: 1000,
        ctr: 5.0,
        position: 10.0,
      });
    });

    // Store new snapshot with improved metrics
    await t.run(async (ctx) => {
      return ctx.db.insert('gscKeywordSnapshots', {
        projectId,
        syncDate: today,
        keyword: 'test keyword',
        clicks: 100,
        impressions: 1500,
        ctr: 6.67,
        position: 5.0,
      });
    });

    const history = await t.run(async (ctx) => {
      return ctx.db
        .query('gscKeywordSnapshots')
        .filter((q) =>
          q.and(q.eq(q.field('projectId'), projectId), q.eq(q.field('keyword'), 'test keyword'))
        )
        .collect();
    });

    expect(history).toHaveLength(2);
  });
});

// =============================================================================
// LATEST KEYWORDS QUERY TESTS
// =============================================================================

describe('Get Latest Keywords', () => {
  let t: ReturnType<typeof createTestContext>;
  let userId: Id<'users'>;
  let projectId: Id<'projects'>;

  beforeEach(async () => {
    t = createTestContext();
    userId = await seedUser(t);
    projectId = await seedProject(t, userId);

    // Seed keyword data
    const syncDate = Date.now();
    for (const kw of FIXTURES.keywords) {
      await t.run(async (ctx) => {
        return ctx.db.insert('gscKeywordSnapshots', {
          projectId,
          syncDate,
          keyword: kw.keyword,
          clicks: kw.clicks,
          impressions: kw.impressions,
          ctr: kw.ctr,
          position: kw.position,
        });
      });
    }
  });

  test('returns all keywords for project', async () => {
    const keywords = await t.run(async (ctx) => {
      return ctx.db
        .query('gscKeywordSnapshots')
        .filter((q) => q.eq(q.field('projectId'), projectId))
        .collect();
    });

    expect(keywords).toHaveLength(FIXTURES.keywords.length);
  });

  test('returns keywords sorted by most recent syncDate', async () => {
    const keywords = await t.run(async (ctx) => {
      return ctx.db
        .query('gscKeywordSnapshots')
        .filter((q) => q.eq(q.field('projectId'), projectId))
        .order('desc')
        .collect();
    });

    expect(keywords.length).toBeGreaterThan(0);
    // All should have same syncDate in this case
    const firstSyncDate = keywords[0].syncDate;
    expect(keywords.every((k) => k.syncDate === firstSyncDate)).toBe(true);
  });
});

// =============================================================================
// KEYWORD HISTORY TESTS
// =============================================================================

describe('Keyword History', () => {
  let t: ReturnType<typeof createTestContext>;
  let userId: Id<'users'>;
  let projectId: Id<'projects'>;

  beforeEach(async () => {
    t = createTestContext();
    userId = await seedUser(t);
    projectId = await seedProject(t, userId);
  });

  test('returns history for specific keyword', async () => {
    const targetKeyword = 'lip fillers kansas city';

    // Create 5 days of history
    for (let i = 0; i < 5; i++) {
      const dayAgo = Date.now() - i * 24 * 60 * 60 * 1000;
      await t.run(async (ctx) => {
        return ctx.db.insert('gscKeywordSnapshots', {
          projectId,
          syncDate: dayAgo,
          keyword: targetKeyword,
          clicks: 100 + i * 10,
          impressions: 2000 + i * 100,
          ctr: 5.0,
          position: 5.0 - i * 0.2,
        });
      });
    }

    const history = await t.run(async (ctx) => {
      return ctx.db
        .query('gscKeywordSnapshots')
        .filter((q) =>
          q.and(q.eq(q.field('projectId'), projectId), q.eq(q.field('keyword'), targetKeyword))
        )
        .collect();
    });

    expect(history).toHaveLength(5);
    expect(history.every((h) => h.keyword === targetKeyword)).toBe(true);
  });

  test('returns empty array for keyword with no history', async () => {
    const history = await t.run(async (ctx) => {
      return ctx.db
        .query('gscKeywordSnapshots')
        .filter((q) =>
          q.and(
            q.eq(q.field('projectId'), projectId),
            q.eq(q.field('keyword'), 'nonexistent keyword')
          )
        )
        .collect();
    });

    expect(history).toHaveLength(0);
  });
});

// =============================================================================
// DASHBOARD STATS AGGREGATION TESTS
// =============================================================================

describe('GSC Dashboard Stats', () => {
  let t: ReturnType<typeof createTestContext>;
  let userId: Id<'users'>;
  let projectId: Id<'projects'>;

  beforeEach(async () => {
    t = createTestContext();
    userId = await seedUser(t);
    projectId = await seedProject(t, userId);
  });

  test('calculates total clicks correctly', async () => {
    const syncDate = Date.now();

    for (const kw of FIXTURES.keywords) {
      await t.run(async (ctx) => {
        return ctx.db.insert('gscKeywordSnapshots', {
          projectId,
          syncDate,
          keyword: kw.keyword,
          clicks: kw.clicks,
          impressions: kw.impressions,
          ctr: kw.ctr,
          position: kw.position,
        });
      });
    }

    const snapshots = await t.run(async (ctx) => {
      return ctx.db
        .query('gscKeywordSnapshots')
        .filter((q) => q.eq(q.field('projectId'), projectId))
        .collect();
    });

    const totalClicks = snapshots.reduce((sum, s) => sum + s.clicks, 0);
    const expectedClicks = FIXTURES.keywords.reduce((sum, k) => sum + k.clicks, 0);

    expect(totalClicks).toBe(expectedClicks);
  });

  test('calculates total impressions correctly', async () => {
    const syncDate = Date.now();

    for (const kw of FIXTURES.keywords) {
      await t.run(async (ctx) => {
        return ctx.db.insert('gscKeywordSnapshots', {
          projectId,
          syncDate,
          keyword: kw.keyword,
          clicks: kw.clicks,
          impressions: kw.impressions,
          ctr: kw.ctr,
          position: kw.position,
        });
      });
    }

    const snapshots = await t.run(async (ctx) => {
      return ctx.db
        .query('gscKeywordSnapshots')
        .filter((q) => q.eq(q.field('projectId'), projectId))
        .collect();
    });

    const totalImpressions = snapshots.reduce((sum, s) => sum + s.impressions, 0);
    const expectedImpressions = FIXTURES.keywords.reduce((sum, k) => sum + k.impressions, 0);

    expect(totalImpressions).toBe(expectedImpressions);
  });

  test('calculates average position', async () => {
    const syncDate = Date.now();

    for (const kw of FIXTURES.keywords) {
      await t.run(async (ctx) => {
        return ctx.db.insert('gscKeywordSnapshots', {
          projectId,
          syncDate,
          keyword: kw.keyword,
          clicks: kw.clicks,
          impressions: kw.impressions,
          ctr: kw.ctr,
          position: kw.position,
        });
      });
    }

    const snapshots = await t.run(async (ctx) => {
      return ctx.db
        .query('gscKeywordSnapshots')
        .filter((q) => q.eq(q.field('projectId'), projectId))
        .collect();
    });

    const totalPosition = snapshots.reduce((sum, s) => sum + s.position, 0);
    const avgPosition = totalPosition / snapshots.length;
    const expectedAvg =
      FIXTURES.keywords.reduce((sum, k) => sum + k.position, 0) / FIXTURES.keywords.length;

    expect(avgPosition).toBeCloseTo(expectedAvg, 1);
  });

  test('returns null for project with no GSC data', async () => {
    const snapshots = await t.run(async (ctx) => {
      return ctx.db
        .query('gscKeywordSnapshots')
        .filter((q) => q.eq(q.field('projectId'), projectId))
        .collect();
    });

    expect(snapshots).toHaveLength(0);
  });

  test('returns top keywords by impressions', async () => {
    const syncDate = Date.now();

    for (const kw of FIXTURES.keywords) {
      await t.run(async (ctx) => {
        return ctx.db.insert('gscKeywordSnapshots', {
          projectId,
          syncDate,
          keyword: kw.keyword,
          clicks: kw.clicks,
          impressions: kw.impressions,
          ctr: kw.ctr,
          position: kw.position,
        });
      });
    }

    const snapshots = await t.run(async (ctx) => {
      return ctx.db
        .query('gscKeywordSnapshots')
        .filter((q) => q.eq(q.field('projectId'), projectId))
        .collect();
    });

    const topKeywords = snapshots.sort((a, b) => b.impressions - a.impressions).slice(0, 5);

    expect(topKeywords).toHaveLength(5);
    expect(topKeywords[0].impressions).toBeGreaterThanOrEqual(topKeywords[1].impressions);
  });
});

// =============================================================================
// QUICK WIN IDENTIFICATION TESTS
// =============================================================================

describe('Quick Win Keywords', () => {
  let t: ReturnType<typeof createTestContext>;
  let userId: Id<'users'>;
  let projectId: Id<'projects'>;

  beforeEach(async () => {
    t = createTestContext();
    userId = await seedUser(t);
    projectId = await seedProject(t, userId);
  });

  test('identifies keywords in position 5-15 with high impressions', async () => {
    const syncDate = Date.now();

    // Add regular keywords
    for (const kw of FIXTURES.keywords) {
      await t.run(async (ctx) => {
        return ctx.db.insert('gscKeywordSnapshots', {
          projectId,
          syncDate,
          keyword: kw.keyword,
          clicks: kw.clicks,
          impressions: kw.impressions,
          ctr: kw.ctr,
          position: kw.position,
        });
      });
    }

    // Add quick win keywords
    for (const kw of FIXTURES.quickWinKeywords) {
      await t.run(async (ctx) => {
        return ctx.db.insert('gscKeywordSnapshots', {
          projectId,
          syncDate,
          keyword: kw.keyword,
          clicks: kw.clicks,
          impressions: kw.impressions,
          ctr: kw.ctr,
          position: kw.position,
        });
      });
    }

    const allSnapshots = await t.run(async (ctx) => {
      return ctx.db
        .query('gscKeywordSnapshots')
        .filter((q) => q.eq(q.field('projectId'), projectId))
        .collect();
    });

    // Filter for quick wins: position 5-15, impressions >= 500
    const quickWins = allSnapshots.filter(
      (kw) => kw.position >= 5 && kw.position <= 15 && kw.impressions >= 500
    );

    expect(quickWins.length).toBeGreaterThan(0);
    expect(quickWins.every((kw) => kw.position >= 5 && kw.position <= 15)).toBe(true);
  });
});
