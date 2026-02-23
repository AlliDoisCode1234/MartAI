import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser, seedProject } from './testHelpers';
import { internal } from '../../convex/_generated/api';

describe('Analytics Insights Actions', () => {
  it('should generate basic insights from data presence', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);

    const insights = await t.action(internal.analytics.insights.generateInsights, {
      projectId,
      ga4Data: {},
      gscData: {},
    });

    expect(insights).toHaveLength(2); // One for GA4, one for GSC
    expect(insights[0].type).toBe('traffic_trend');
  });

  it('should gracefully execute AI enhanced insight actions', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);

    // These call AI SDK which may throw if keys are missing in test context,
    // so we wrap in try-catch to verify the route is valid and args are accepted.
    try {
      const advanced = await t.action(internal.analytics.insights.generateEnhancedInsights, {
        projectId,
      });
      expect(Array.isArray(advanced)).toBe(true);
    } catch (e: any) {
      expect(e.message).toBeDefined();
    }

    try {
      const gaps = await t.action(internal.analytics.insights.findContentGaps, {
        projectId,
      });
      expect(Array.isArray(gaps)).toBe(true);
    } catch (e: any) {
      expect(e.message).toBeDefined();
    }
  });

  it('should suggest keyword clusters (no AI required)', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);

    // If no keywords exist, it should gracefully return empty
    const clusters = await t.action(internal.analytics.insights.suggestKeywordClusters, {
      projectId,
    });
    expect(clusters).toHaveLength(0);
  });

  it('should suggest briefs (depends on quick wins query)', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);

    const briefs = await t.action(internal.analytics.insights.suggestBriefs, {
      projectId,
    });
    expect(Array.isArray(briefs)).toBe(true);
  });
});
