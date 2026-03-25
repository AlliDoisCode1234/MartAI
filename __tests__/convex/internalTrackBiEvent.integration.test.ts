/**
 * Internal BI Event Emitter — Integration Tests
 *
 * Verifies internalTrackBiEvent writes typed events correctly
 * and that wired BI events appear in analyticsEvents table.
 */

import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser } from './testHelpers';
import { internal } from '../../convex/_generated/api';
import { BI_EVENTS } from '../../convex/lib/eventTypes';

describe('internalTrackBiEvent', () => {
  it('should write a typed event to analyticsEvents', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);

    // Emit a typed BI event using the internal mutation
    await t.mutation(internal.analytics.eventTracking.internalTrackBiEvent, {
      event: BI_EVENTS.CONTENT_GENERATED,
      userId,
      properties: { projectId: 'test_project', contentType: 'blog_post', score: 97 },
    });

    // Verify it was written to the DB
    const events = await t.run(async (ctx) => {
      return await ctx.db
        .query('analyticsEvents')
        .filter((q) => q.eq(q.field('event'), 'content_generated'))
        .collect();
    });

    expect(events).toHaveLength(1);
    expect(events[0].event).toBe('content_generated');
    expect(events[0].userId).toBe(userId);
    expect(events[0].timestamp).toBeGreaterThan(0);
    expect(events[0].properties).toEqual({
      projectId: 'test_project',
      contentType: 'blog_post',
      score: 97,
    });
  });

  it('should allow events without a userId (system events)', async () => {
    const t = createTestContext();

    await t.mutation(internal.analytics.eventTracking.internalTrackBiEvent, {
      event: BI_EVENTS.ERROR_OCCURRED,
      properties: { source: 'cron', message: 'Sync timeout' },
    });

    const events = await t.run(async (ctx) => {
      return await ctx.db
        .query('analyticsEvents')
        .filter((q) => q.eq(q.field('event'), 'error_occurred'))
        .collect();
    });

    expect(events).toHaveLength(1);
    expect(events[0].userId).toBeUndefined();
    expect(events[0].properties).toEqual({
      source: 'cron',
      message: 'Sync timeout',
    });
  });

  it('should allow events without properties', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);

    await t.mutation(internal.analytics.eventTracking.internalTrackBiEvent, {
      event: BI_EVENTS.SIGNUP_COMPLETED,
      userId,
    });

    const events = await t.run(async (ctx) => {
      return await ctx.db
        .query('analyticsEvents')
        .filter((q) => q.eq(q.field('event'), 'signup_completed'))
        .collect();
    });

    expect(events).toHaveLength(1);
    expect(events[0].event).toBe('signup_completed');
  });

  it('should write timestamp as current epoch milliseconds', async () => {
    const t = createTestContext();
    const beforeMs = Date.now();

    await t.mutation(internal.analytics.eventTracking.internalTrackBiEvent, {
      event: BI_EVENTS.PAGE_VIEW,
    });

    const events = await t.run(async (ctx) => {
      return await ctx.db
        .query('analyticsEvents')
        .filter((q) => q.eq(q.field('event'), 'page_view'))
        .collect();
    });

    expect(events).toHaveLength(1);
    // Timestamp should be between beforeMs and now
    expect(events[0].timestamp).toBeGreaterThanOrEqual(beforeMs);
    expect(events[0].timestamp).toBeLessThanOrEqual(Date.now() + 1000);
  });

  it('should support multiple events being written independently', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);

    await t.mutation(internal.analytics.eventTracking.internalTrackBiEvent, {
      event: BI_EVENTS.PROJECT_CREATED,
      userId,
    });

    await t.mutation(internal.analytics.eventTracking.internalTrackBiEvent, {
      event: BI_EVENTS.KEYWORD_RESEARCH_RUN,
      userId,
    });

    await t.mutation(internal.analytics.eventTracking.internalTrackBiEvent, {
      event: BI_EVENTS.CONTENT_GENERATED,
      userId,
    });

    const events = await t.run(async (ctx) => {
      return await ctx.db
        .query('analyticsEvents')
        .filter((q) => q.eq(q.field('userId'), userId))
        .collect();
    });

    expect(events).toHaveLength(3);
    const eventNames = events.map((e) => e.event).sort();
    expect(eventNames).toEqual(['content_generated', 'keyword_research_run', 'project_created']);
  });
});
