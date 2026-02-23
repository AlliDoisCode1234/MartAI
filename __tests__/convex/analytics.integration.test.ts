import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser, seedProject } from './testHelpers';
import { api } from '../../convex/_generated/api';

describe('Analytics Core module', () => {
  it('should store analytics data and retrieve aggregated KPIs', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);

    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    // 1. Store GA4 Data
    await t.mutation(api.analytics.analytics.storeAnalyticsData, {
      projectId,
      date: now,
      source: 'ga4',
      sessions: 500,
      users: 400,
      engagementDuration: 15000,
      pageViews: 1000,
      bounceRate: 40,
    });

    // 2. Store GSC Data
    await t.mutation(api.analytics.analytics.storeAnalyticsData, {
      projectId,
      date: now,
      source: 'gsc',
      clicks: 100,
      impressions: 2000,
      avgPosition: 12.5,
    });

    // 3. Update existing data
    await t.mutation(api.analytics.analytics.storeAnalyticsData, {
      projectId,
      date: now,
      source: 'gsc',
      clicks: 150, // Updated
      impressions: 2100,
      avgPosition: 11.5,
      ctr: 7.14,
    });

    // 4. Get Data range
    const range = await t.query(api.analytics.analytics.getAnalyticsData, {
      projectId,
      startDate: now - oneDay,
      endDate: now + oneDay,
    });
    expect(range).toHaveLength(2);

    // 5. Get aggregated KPIs
    const kpis = await t.query(api.analytics.analytics.getKPIs, {
      projectId,
      startDate: now - oneDay,
      endDate: now + oneDay,
    });
    expect(kpis.sessions).toBe(500);
    expect(kpis.clicks).toBe(150);
    expect(kpis.avgPosition).toBe(11.5);

    // 6. Get Dashboard KPIs (rolling comparison logic)
    const dashboard = await t.query(api.analytics.analytics.getDashboardKPIs, {
      projectId,
    });
    expect(dashboard.hasGA4Data).toBe(true);
    expect(dashboard.hasGSCData).toBe(true);
    expect(dashboard.sessions.value).toBe(500);
    expect(dashboard.clicks.value).toBe(150);
    expect(dashboard.pageViews.value).toBe(1000);

    // 7. Get Growth History
    const history = await t.query(api.analytics.analytics.getGrowthHistory, {
      projectId,
    });
    expect(history).toHaveLength(1);
    expect(history[0].sessions).toBe(500);
    expect(history[0].clicks).toBe(150);
  });

  it('should store and apply insights', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);

    const insightId = await t.mutation(api.analytics.analytics.storeInsight, {
      projectId,
      type: 'underperformer',
      title: 'Fix H1s',
      description: 'Multiple missing H1 tags',
    });

    let insights = await t.query(api.analytics.analytics.getInsights, {
      projectId,
    });
    expect(insights).toHaveLength(1);
    expect(insights[0].status).toBe('active');

    // Apply it
    await t.mutation(api.analytics.analytics.applyInsight, { insightId });

    insights = await t.query(api.analytics.analytics.getInsights, {
      projectId,
    });
    expect(insights).toHaveLength(0); // Only gets active
  });
});
