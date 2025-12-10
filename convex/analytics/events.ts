import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';
import { auth } from '../auth';

/**
 * Track an analytics event
 * Called from frontend via useTracking hook
 */
export const trackEvent = mutation({
  args: {
    sessionId: v.optional(v.string()),
    event: v.string(),
    trackId: v.optional(v.string()),
    properties: v.optional(v.any()),
    url: v.optional(v.string()),
    referrer: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    await ctx.db.insert('analyticsEvents', {
      userId: userId ?? undefined,
      sessionId: args.sessionId,
      event: args.event,
      trackId: args.trackId,
      properties: args.properties,
      url: args.url,
      referrer: args.referrer,
      userAgent: args.userAgent,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Get events for a user (admin use)
 */
export const getEventsByUser = query({
  args: {
    userId: v.id('users'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const viewerId = await auth.getUserId(ctx);
    if (!viewerId) return [];

    // Check if viewer is admin
    const viewer = await ctx.db.get(viewerId);
    if (!viewer || (viewer.role !== 'admin' && viewer.role !== 'super_admin')) {
      return [];
    }

    const events = await ctx.db
      .query('analyticsEvents')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc')
      .take(args.limit ?? 100);

    return events;
  },
});

/**
 * Get funnel metrics (admin use)
 */
export const getFunnelMetrics = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return null;
    }

    const now = Date.now();
    const startDate = args.startDate ?? now - 30 * 24 * 60 * 60 * 1000; // 30 days ago
    const endDate = args.endDate ?? now;

    // Count events by type
    const allEvents = await ctx.db
      .query('analyticsEvents')
      .withIndex('by_timestamp')
      .filter((q) =>
        q.and(q.gte(q.field('timestamp'), startDate), q.lte(q.field('timestamp'), endDate))
      )
      .collect();

    const eventCounts: Record<string, number> = {};
    for (const event of allEvents) {
      eventCounts[event.event] = (eventCounts[event.event] || 0) + 1;
    }

    // Get unique sessions and users
    const uniqueSessions = new Set(allEvents.map((e) => e.sessionId).filter(Boolean));
    const uniqueUsers = new Set(
      allEvents
        .map((e) => e.userId)
        .filter(Boolean)
        .map(String)
    );

    return {
      totalEvents: allEvents.length,
      uniqueSessions: uniqueSessions.size,
      uniqueUsers: uniqueUsers.size,
      eventCounts,
      dateRange: { startDate, endDate },
    };
  },
});
