/**
 * Analytics Event Tracking
 *
 * Mutations and queries for BI event tracking.
 * Used by admin dashboard for funnel analysis.
 */

import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';
import { auth } from '../auth';
import { requireSuperAdmin } from '../lib/rbac';

/**
 * Track an analytics event
 * Public: Can be called without auth for landing page tracking
 */
export const trackEvent = mutation({
  args: {
    event: v.string(),
    properties: v.optional(v.any()),
    sessionId: v.optional(v.string()),
    url: v.optional(v.string()),
    referrer: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    trackId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Try to get userId from auth (optional - tracks work without auth)
    const userId = await auth.getUserId(ctx);

    return await ctx.db.insert('analyticsEvents', {
      userId: userId ?? undefined,
      sessionId: args.sessionId,
      event: args.event,
      properties: args.properties,
      url: args.url,
      referrer: args.referrer,
      userAgent: args.userAgent,
      trackId: args.trackId,
      timestamp: Date.now(),
    });
  },
});

/**
 * Get funnel metrics for admin dashboard
 * Security: super_admin only
 */
export const getFunnelMetrics = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Use consistent RBAC pattern
    await requireSuperAdmin(ctx);

    const now = Date.now();
    const startDate = args.startDate || now - 30 * 24 * 60 * 60 * 1000; // 30 days
    const endDate = args.endDate || now;

    // Get all events in range
    const events = await ctx.db
      .query('analyticsEvents')
      .withIndex('by_timestamp')
      .filter((q) =>
        q.and(q.gte(q.field('timestamp'), startDate), q.lte(q.field('timestamp'), endDate))
      )
      .collect();

    // Count by event type
    const eventCounts: Record<string, number> = {};
    const uniqueUsers: Record<string, Set<string>> = {};

    for (const event of events) {
      eventCounts[event.event] = (eventCounts[event.event] || 0) + 1;
      if (event.userId) {
        if (!uniqueUsers[event.event]) uniqueUsers[event.event] = new Set();
        uniqueUsers[event.event].add(event.userId);
      }
    }

    // Funnel steps in order
    const funnelSteps = [
      'signup_started',
      'signup_completed',
      'project_created',
      'gsc_connected',
      'keywords_imported',
      'clusters_generated',
      'brief_created',
      'content_published',
    ];

    const funnel = funnelSteps.map((step, index) => {
      const count = eventCounts[step] || 0;
      const uniqueCount = uniqueUsers[step]?.size || 0;
      const previousCount = index > 0 ? eventCounts[funnelSteps[index - 1]] || 1 : count;
      const conversionRate = previousCount > 0 ? (count / previousCount) * 100 : 0;

      return {
        step,
        label: step.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        count,
        uniqueUsers: uniqueCount,
        conversionRate: Math.round(conversionRate * 10) / 10,
      };
    });

    return {
      funnel,
      totalEvents: events.length,
      dateRange: { startDate, endDate },
    };
  },
});

/**
 * Get event trends over time
 * Security: super_admin only
 */
export const getEventTrends = query({
  args: {
    event: v.optional(v.string()),
    groupBy: v.optional(v.union(v.literal('day'), v.literal('week'), v.literal('hour'))),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireSuperAdmin(ctx);

    const days = args.days || 30;
    const startDate = Date.now() - days * 24 * 60 * 60 * 1000;

    let eventsQuery = ctx.db
      .query('analyticsEvents')
      .withIndex('by_timestamp')
      .filter((q) => q.gte(q.field('timestamp'), startDate));

    if (args.event) {
      eventsQuery = eventsQuery.filter((q) => q.eq(q.field('event'), args.event));
    }

    const events = await eventsQuery.collect();

    // Group by date
    const grouped: Record<string, number> = {};
    const groupBy = args.groupBy || 'day';

    for (const event of events) {
      const date = new Date(event.timestamp);
      let key: string;

      if (groupBy === 'hour') {
        key = `${date.toISOString().slice(0, 13)}:00`;
      } else if (groupBy === 'week') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().slice(0, 10);
      } else {
        key = date.toISOString().slice(0, 10);
      }

      grouped[key] = (grouped[key] || 0) + 1;
    }

    // Sort by date
    const trend = Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));

    return { trend, totalEvents: events.length };
  },
});

/**
 * Get top events
 * Security: super_admin only
 */
export const getTopEvents = query({
  args: {
    limit: v.optional(v.number()),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireSuperAdmin(ctx);

    const days = args.days || 7;
    const startDate = Date.now() - days * 24 * 60 * 60 * 1000;

    const events = await ctx.db
      .query('analyticsEvents')
      .withIndex('by_timestamp')
      .filter((q) => q.gte(q.field('timestamp'), startDate))
      .collect();

    // Count by event
    const counts: Record<string, number> = {};
    for (const event of events) {
      counts[event.event] = (counts[event.event] || 0) + 1;
    }

    // Sort and limit
    const topEvents = Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, args.limit || 10)
      .map(([event, count]) => ({ event, count }));

    return { topEvents, totalEvents: events.length };
  },
});

/**
 * Get recent events (for live feed)
 * Security: super_admin only
 */
export const getRecentEvents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireSuperAdmin(ctx);

    const events = await ctx.db
      .query('analyticsEvents')
      .withIndex('by_timestamp')
      .order('desc')
      .take(args.limit || 50);

    return events;
  },
});
