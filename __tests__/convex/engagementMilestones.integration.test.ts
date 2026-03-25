/**
 * Engagement Milestones — Integration Tests (DATA-2)
 *
 * Tests the trackEngagement internal mutation and verifies
 * milestone counters increment correctly and first-time timestamps
 * are set idempotently.
 */

import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser } from './testHelpers';
import { internal } from '../../convex/_generated/api';

describe('Engagement Milestones (DATA-2)', () => {
  it('should set first-time timestamp and increment counter on first call', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);

    await t.mutation(internal.lib.engagementMilestones.trackEngagement, {
      userId,
      milestone: 'keyword',
      incrementTotal: true,
    });

    const user = await t.run(async (ctx) => {
      return await ctx.db.get(userId);
    });

    expect(user?.engagementMilestones).toBeDefined();
    expect(user?.engagementMilestones?.totalKeywords).toBe(1);
    expect(user?.engagementMilestones?.firstKeywordCreatedAt).toBeGreaterThan(0);
  });

  it('should increment counter without overwriting first-time timestamp', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);

    // First call
    await t.mutation(internal.lib.engagementMilestones.trackEngagement, {
      userId,
      milestone: 'keyword',
      incrementTotal: true,
    });

    const afterFirst = await t.run(async (ctx) => {
      return await ctx.db.get(userId);
    });
    const firstTimestamp = afterFirst?.engagementMilestones?.firstKeywordCreatedAt;

    // Second call
    await t.mutation(internal.lib.engagementMilestones.trackEngagement, {
      userId,
      milestone: 'keyword',
      incrementTotal: true,
    });

    const afterSecond = await t.run(async (ctx) => {
      return await ctx.db.get(userId);
    });

    expect(afterSecond?.engagementMilestones?.totalKeywords).toBe(2);
    // First-time timestamp should NOT change
    expect(afterSecond?.engagementMilestones?.firstKeywordCreatedAt).toBe(firstTimestamp);
  });

  it('should track different milestone types independently', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);

    await t.mutation(internal.lib.engagementMilestones.trackEngagement, {
      userId,
      milestone: 'keyword',
      incrementTotal: true,
    });

    await t.mutation(internal.lib.engagementMilestones.trackEngagement, {
      userId,
      milestone: 'cluster',
      incrementTotal: true,
    });

    await t.mutation(internal.lib.engagementMilestones.trackEngagement, {
      userId,
      milestone: 'draft',
      incrementTotal: true,
    });

    const user = await t.run(async (ctx) => {
      return await ctx.db.get(userId);
    });

    expect(user?.engagementMilestones?.totalKeywords).toBe(1);
    expect(user?.engagementMilestones?.totalClusters).toBe(1);
    expect(user?.engagementMilestones?.totalDrafts).toBe(1);
    expect(user?.engagementMilestones?.firstKeywordCreatedAt).toBeGreaterThan(0);
    expect(user?.engagementMilestones?.firstClusterCreatedAt).toBeGreaterThan(0);
    expect(user?.engagementMilestones?.firstDraftCreatedAt).toBeGreaterThan(0);
  });

  it('should handle integration milestones (timestamp only, no counter)', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);

    await t.mutation(internal.lib.engagementMilestones.trackEngagement, {
      userId,
      milestone: 'wordpress',
      incrementTotal: false,
    });

    const user = await t.run(async (ctx) => {
      return await ctx.db.get(userId);
    });

    expect(user?.engagementMilestones?.firstWordPressConnectedAt).toBeGreaterThan(0);
  });

  it('should be idempotent for integration milestones', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);

    // First connection
    await t.mutation(internal.lib.engagementMilestones.trackEngagement, {
      userId,
      milestone: 'ga4',
      incrementTotal: false,
    });

    const afterFirst = await t.run(async (ctx) => {
      return await ctx.db.get(userId);
    });
    const firstTimestamp = afterFirst?.engagementMilestones?.firstGa4ConnectedAt;

    // Second connection (should not update timestamp)
    await t.mutation(internal.lib.engagementMilestones.trackEngagement, {
      userId,
      milestone: 'ga4',
      incrementTotal: false,
    });

    const afterSecond = await t.run(async (ctx) => {
      return await ctx.db.get(userId);
    });

    expect(afterSecond?.engagementMilestones?.firstGa4ConnectedAt).toBe(firstTimestamp);
  });

  // NOTE: updateMilestone handles non-existent users gracefully (if (!user) return),
  // but convex-test validates ID format before the handler runs, so we can't test
  // with a fake ID. The production code IS safe — verified by code inspection.
});
