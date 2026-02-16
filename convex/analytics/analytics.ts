import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';
import { api } from '../_generated/api';

// Store analytics data point
export const storeAnalyticsData = mutation({
  args: {
    projectId: v.id('projects'),
    date: v.number(), // timestamp
    source: v.string(), // ga4, gsc
    sessions: v.optional(v.number()),
    clicks: v.optional(v.number()),
    impressions: v.optional(v.number()),
    ctr: v.optional(v.number()),
    avgPosition: v.optional(v.number()),
    leads: v.optional(v.number()),
    revenue: v.optional(v.number()),
    // Expanded GA4 metrics
    pageViews: v.optional(v.number()),
    bounceRate: v.optional(v.number()),
    avgSessionDuration: v.optional(v.number()),
    newUsers: v.optional(v.number()),
    engagedSessions: v.optional(v.number()),
    eventCount: v.optional(v.number()),
    conversions: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { projectId, date, source, ...metrics } = args;

    // Check if data point exists
    const existing = await ctx.db
      .query('analyticsData')
      .withIndex('by_project_date_source', (q) =>
        q.eq('projectId', projectId).eq('date', date).eq('source', source)
      )
      .first();

    const data = {
      projectId,
      date,
      source,
      ...metrics,
      updatedAt: Date.now(),
    };

    if (existing) {
      return await ctx.db.patch(existing._id, data);
    }

    return await ctx.db.insert('analyticsData', {
      ...data,
      createdAt: Date.now(),
    });
  },
});

// Get analytics data for date range
export const getAnalyticsData = query({
  args: {
    projectId: v.id('projects'),
    startDate: v.number(),
    endDate: v.number(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query('analyticsData')
      .withIndex('by_project_date', (q) => q.eq('projectId', args.projectId));

    const allData = await query.collect();

    return allData
      .filter(
        (d) =>
          d.date >= args.startDate &&
          d.date <= args.endDate &&
          (!args.source || d.source === args.source)
      )
      .sort((a, b) => a.date - b.date);
  },
});

// Get aggregated KPIs
export const getKPIs = query({
  args: {
    projectId: v.id('projects'),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const allData = await ctx.db
      .query('analyticsData')
      .withIndex('by_project_date', (q) => q.eq('projectId', args.projectId))
      .collect();

    const data = allData.filter((d) => d.date >= args.startDate && d.date <= args.endDate);

    const ga4Data = data.filter((d: any) => d.source === 'ga4');
    const gscData = data.filter((d: any) => d.source === 'gsc');

    // Calculate totals
    const sessions = ga4Data.reduce((sum: number, d: any) => sum + (d.sessions || 0), 0);
    const clicks = gscData.reduce((sum: number, d: any) => sum + (d.clicks || 0), 0);
    const impressions = gscData.reduce((sum: number, d: any) => sum + (d.impressions || 0), 0);
    const leads = ga4Data.reduce((sum: number, d: any) => sum + (d.leads || 0), 0);
    const revenue = ga4Data.reduce((sum: number, d: any) => sum + (d.revenue || 0), 0);

    // Calculate averages
    const avgCTR = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const avgPosition =
      gscData.length > 0
        ? gscData.reduce((sum: number, d: any) => sum + (d.avgPosition || 0), 0) / gscData.length
        : 0;
    const conversionRate = sessions > 0 ? (leads / sessions) * 100 : 0;

    return {
      sessions,
      clicks,
      impressions,
      ctr: avgCTR,
      avgPosition,
      leads,
      revenue,
      conversionRate,
    };
  },
});

// Get Dashboard KPIs with comparison (GA4 + GSC combined)
// ARCHITECTURE: Each sync stores a ROLLING 30-day aggregate from Google.
// Therefore we take the LATEST snapshot per source, NOT sum across snapshots.
export const getDashboardKPIs = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    // Fetch all data for this project
    const allData = await ctx.db
      .query('analyticsData')
      .withIndex('by_project_date', (q) => q.eq('projectId', args.projectId))
      .collect();

    // Sort by date descending to find latest snapshots
    const sorted = allData.sort((a, b) => b.date - a.date);

    // Get latest GA4 and GSC snapshots (these ARE the 30-day aggregates from Google)
    const ga4Rows = sorted.filter((d) => d.source === 'ga4');
    const gscRows = sorted.filter((d) => d.source === 'gsc');
    const latestGA4 = ga4Rows[0] ?? null;
    const latestGSC = gscRows[0] ?? null;

    // Get previous snapshots for period-over-period comparison
    const prevGA4 = ga4Rows[1] ?? null;
    const prevGSC = gscRows[1] ?? null;

    const calculateChange = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return ((curr - prev) / prev) * 100;
    };

    // Extract metrics from latest snapshots (or 0 if no data)
    const sessions = latestGA4?.sessions ?? 0;
    const pageViews = latestGA4?.pageViews ?? 0;
    const bounceRate = latestGA4?.bounceRate ?? 0;
    const avgSessionDuration = latestGA4?.avgSessionDuration ?? 0;
    const newUsers = latestGA4?.newUsers ?? 0;
    const engagedSessions = latestGA4?.engagedSessions ?? 0;
    const eventCount = latestGA4?.eventCount ?? 0;
    const conversions = latestGA4?.conversions ?? 0;
    const leads = latestGA4?.leads ?? 0;
    const revenue = latestGA4?.revenue ?? 0;

    const clicks = latestGSC?.clicks ?? 0;
    const impressions = latestGSC?.impressions ?? 0;
    const ctr = latestGSC?.ctr ?? 0;
    const avgPosition = latestGSC?.avgPosition ?? 0;

    const conversionRate = sessions > 0 ? (leads / sessions) * 100 : 0;

    return {
      sessions: {
        value: sessions,
        change: calculateChange(sessions, prevGA4?.sessions ?? 0),
      },
      clicks: { value: clicks, change: calculateChange(clicks, prevGSC?.clicks ?? 0) },
      ctr: { value: ctr, change: calculateChange(ctr, prevGSC?.ctr ?? 0) },
      avgPosition: {
        value: avgPosition,
        change: calculateChange(avgPosition, prevGSC?.avgPosition ?? 0),
      },
      leads: { value: leads, change: calculateChange(leads, prevGA4?.leads ?? 0) },
      revenue: {
        value: revenue,
        change: calculateChange(revenue, prevGA4?.revenue ?? 0),
      },
      conversionRate: {
        value: conversionRate,
        change: 0,
      },
      // GA4 expanded
      pageViews: {
        value: pageViews,
        change: calculateChange(pageViews, prevGA4?.pageViews ?? 0),
      },
      newUsers: {
        value: newUsers,
        change: calculateChange(newUsers, prevGA4?.newUsers ?? 0),
      },
      bounceRate: {
        value: bounceRate,
        change: calculateChange(bounceRate, prevGA4?.bounceRate ?? 0),
      },
      avgSessionDuration: {
        value: avgSessionDuration,
        change: calculateChange(avgSessionDuration, prevGA4?.avgSessionDuration ?? 0),
      },
      impressions: {
        value: impressions,
        change: calculateChange(impressions, prevGSC?.impressions ?? 0),
      },
      engagedSessions: {
        value: engagedSessions,
        change: calculateChange(engagedSessions, prevGA4?.engagedSessions ?? 0),
      },
      eventCount: {
        value: eventCount,
        change: calculateChange(eventCount, prevGA4?.eventCount ?? 0),
      },
      conversions: {
        value: conversions,
        change: calculateChange(conversions, prevGA4?.conversions ?? 0),
      },
      lastSyncDate: latestGA4?.date ?? latestGSC?.date ?? null,
    };
  },
});

// Store insight
export const storeInsight = mutation({
  args: {
    projectId: v.id('projects'),
    type: v.string(), // top_gainer, underperformer, quick_win
    title: v.string(),
    description: v.string(),
    action: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('insights', {
      projectId: args.projectId,
      type: args.type,
      title: args.title,
      description: args.description,
      action: args.action,
      metadata: args.metadata,
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Get insights
export const getInsights = query({
  args: {
    projectId: v.id('projects'),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query('insights')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId));

    const insights = await query.collect();

    return insights
      .filter((i) => !args.type || i.type === args.type)
      .filter((i) => i.status === 'active')
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Apply insight (mark as applied)
export const applyInsight = mutation({
  args: {
    insightId: v.id('insights'),
  },
  handler: async (ctx, args) => {
    const insight = await ctx.db.get(args.insightId);
    if (!insight) throw new Error('Insight not found');

    // If it's a content opportunity, create an unplanned brief
    if (['keyword_opportunity', 'quick_win', 'top_gainer'].includes(insight.type)) {
      await ctx.runMutation(api['content/briefs'].createBrief, {
        projectId: insight.projectId,
        title: `Insight: ${insight.title}`,
        scheduledDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // Tentative date +1 week
        status: 'planned',
        metaTitle: insight.title,
        metaDescription: insight.description,
        // planId is optional, creating an "Unplanned Brief"
      });
    }

    await ctx.db.patch(args.insightId, {
      status: 'applied',
      updatedAt: Date.now(),
    });
  },
});

/**
 * Get historical analytics snapshots for the growth chart.
 * Returns data points sorted by date, with sessions (GA4) and clicks (GSC) per snapshot.
 */
export const getGrowthHistory = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const snapshots = await ctx.db
      .query('analyticsData')
      .withIndex('by_project_date', (q) => q.eq('projectId', args.projectId))
      .order('asc')
      .collect();

    // Group by date, merge ga4+gsc into single data points
    const dateMap = new Map<number, { sessions: number; clicks: number }>();
    for (const snap of snapshots) {
      const existing = dateMap.get(snap.date) || { sessions: 0, clicks: 0 };
      if (snap.source === 'ga4') {
        existing.sessions = snap.sessions || 0;
      }
      if (snap.source === 'gsc') {
        existing.clicks = snap.clicks || 0;
      }
      dateMap.set(snap.date, existing);
    }

    // Convert to array with formatted labels
    return Array.from(dateMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([date, data]) => {
        const d = new Date(date);
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return {
          label,
          sessions: data.sessions,
          clicks: data.clicks,
        };
      });
  },
});
