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
    ctr: v.optional(v.number()), // 0-100 percentage
    avgPosition: v.optional(v.number()),
    leads: v.optional(v.number()),
    revenue: v.optional(v.number()),
    // Expanded GA4 metrics
    users: v.optional(v.number()),
    engagementDuration: v.optional(v.number()),
    pageViews: v.optional(v.number()),
    bounceRate: v.optional(v.number()), // 0-100 percentage
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

    const ga4Data = data.filter((d) => d.source === 'ga4');
    const gscData = data.filter((d) => d.source === 'gsc');

    // Calculate totals
    const sessions = ga4Data.reduce((sum, d) => sum + (d.sessions || 0), 0);
    const users = ga4Data.reduce((sum, d) => sum + (d.users || 0), 0);
    const engagementDuration = ga4Data.reduce((sum, d) => sum + (d.engagementDuration || 0), 0);
    const clicks = gscData.reduce((sum, d) => sum + (d.clicks || 0), 0);
    const impressions = gscData.reduce((sum, d) => sum + (d.impressions || 0), 0);

    // Calculate averages
    const avgCTR = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const avgPosition =
      gscData.length > 0
        ? gscData.reduce((sum, d) => sum + (d.avgPosition || 0), 0) / gscData.length
        : 0;

    return {
      sessions,
      users,
      engagementDuration,
      clicks,
      impressions,
      ctr: avgCTR,
      avgPosition,
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

    // Extract metrics from latest snapshots (or null if no data)
    const hasGA4Data = latestGA4 !== null;
    const hasGSCData = latestGSC !== null;

    const sessions = hasGA4Data ? (latestGA4.sessions ?? 0) : null;
    const users = hasGA4Data ? (latestGA4.users ?? 0) : null;
    const engagementDuration = hasGA4Data ? (latestGA4.engagementDuration ?? 0) : null;
    const pageViews = hasGA4Data ? (latestGA4.pageViews ?? 0) : null;
    const bounceRate = hasGA4Data ? (latestGA4.bounceRate ?? 0) : null;
    const avgSessionDuration = hasGA4Data ? (latestGA4.avgSessionDuration ?? 0) : null;
    const newUsers = hasGA4Data ? (latestGA4.newUsers ?? 0) : null;
    const engagedSessions = hasGA4Data ? (latestGA4.engagedSessions ?? 0) : null;
    const eventCount = hasGA4Data ? (latestGA4.eventCount ?? 0) : null;
    const conversions = hasGA4Data ? (latestGA4.conversions ?? 0) : null;

    const clicks = hasGSCData ? (latestGSC.clicks ?? 0) : null;
    const impressions = hasGSCData ? (latestGSC.impressions ?? 0) : null;
    const ctr = hasGSCData ? (latestGSC.ctr ?? 0) : null;
    const avgPosition = hasGSCData ? (latestGSC.avgPosition ?? 0) : null;

    return {
      sessions: {
        value: sessions,
        change:
          sessions !== null && prevGA4 ? calculateChange(sessions, prevGA4.sessions ?? 0) : null,
      },
      users: {
        value: users,
        change: users !== null && prevGA4 ? calculateChange(users, prevGA4.users ?? 0) : null,
      },
      engagementDuration: {
        value: engagementDuration,
        change:
          engagementDuration !== null && prevGA4
            ? calculateChange(engagementDuration, prevGA4.engagementDuration ?? 0)
            : null,
      },
      clicks: {
        value: clicks,
        change: clicks !== null && prevGSC ? calculateChange(clicks, prevGSC.clicks ?? 0) : null,
      },
      ctr: {
        value: ctr,
        change: ctr !== null && prevGSC ? calculateChange(ctr, prevGSC.ctr ?? 0) : null,
      },
      avgPosition: {
        value: avgPosition,
        change:
          avgPosition !== null && prevGSC
            ? calculateChange(avgPosition, prevGSC.avgPosition ?? 0)
            : null,
      },
      // GA4 expanded
      pageViews: {
        value: pageViews,
        change:
          pageViews !== null && prevGA4 ? calculateChange(pageViews, prevGA4.pageViews ?? 0) : null,
      },
      newUsers: {
        value: newUsers,
        change:
          newUsers !== null && prevGA4 ? calculateChange(newUsers, prevGA4.newUsers ?? 0) : null,
      },
      bounceRate: {
        value: bounceRate,
        change:
          bounceRate !== null && prevGA4
            ? calculateChange(bounceRate, prevGA4.bounceRate ?? 0)
            : null,
      },
      avgSessionDuration: {
        value: avgSessionDuration,
        change:
          avgSessionDuration !== null && prevGA4
            ? calculateChange(avgSessionDuration, prevGA4.avgSessionDuration ?? 0)
            : null,
      },
      impressions: {
        value: impressions,
        change:
          impressions !== null && prevGSC
            ? calculateChange(impressions, prevGSC.impressions ?? 0)
            : null,
      },
      engagedSessions: {
        value: engagedSessions,
        change:
          engagedSessions !== null && prevGA4
            ? calculateChange(engagedSessions, prevGA4.engagedSessions ?? 0)
            : null,
      },
      eventCount: {
        value: eventCount,
        change:
          eventCount !== null && prevGA4
            ? calculateChange(eventCount, prevGA4.eventCount ?? 0)
            : null,
      },
      conversions: {
        value: conversions,
        change:
          conversions !== null && prevGA4
            ? calculateChange(conversions, prevGA4.conversions ?? 0)
            : null,
      },
      hasGA4Data,
      hasGSCData,
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
