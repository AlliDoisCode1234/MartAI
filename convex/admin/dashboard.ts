import { query } from '../_generated/server';
import { requireAdmin } from '../lib/rbac';

/**
 * Admin Dashboard Metrics
 *
 * Provides overview KPIs for the admin dashboard.
 * Security: admin role required
 */

export const getAdminDashboardMetrics = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    // Get all users
    const allUsers = await ctx.db.query('users').collect();
    const totalUsers = allUsers.length;

    // New users this week
    const newUsersThisWeek = allUsers.filter(
      (u) => u._creationTime && u._creationTime > sevenDaysAgo
    ).length;

    // Active users (last 30 days)
    const activeUsers = allUsers.filter(
      (u) => u.lastActiveAt && u.lastActiveAt > thirtyDaysAgo
    ).length;

    // Get subscriptions
    const subscriptions = await ctx.db.query('subscriptions').collect();
    const activeSubscriptions = subscriptions.filter((s) => s.status === 'active');

    // Get recent analytics events for activity feed
    const recentEvents = await ctx.db
      .query('analyticsEvents')
      .withIndex('by_timestamp')
      .order('desc')
      .take(10);

    // Get recent user signups for activity
    const recentUsers = allUsers
      .filter((u) => u._creationTime)
      .sort((a, b) => (b._creationTime ?? 0) - (a._creationTime ?? 0))
      .slice(0, 5)
      .map((u) => ({
        _id: u._id,
        name: u.name || 'Unknown',
        email: u.email,
        createdAt: u._creationTime,
      }));

    // Calculate daily user counts for trend (last 7 days)
    const userTrend: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = now - i * 24 * 60 * 60 * 1000;
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      const count = allUsers.filter(
        (u) => u._creationTime && u._creationTime >= dayStart && u._creationTime < dayEnd
      ).length;
      const date = new Date(dayStart).toISOString().slice(0, 10);
      userTrend.push({ date, count });
    }

    // BI Events - Content Lifecycle Metrics (Jan 2026)
    const biEvents = await ctx.db.query('biEvents').collect();
    const publishedEvents = biEvents.filter((e) => e.event === 'content:published');
    const scheduledEvents = biEvents.filter((e) => e.event === 'content:scheduled');
    const recentBiEvents = biEvents.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

    // Content metrics by day (last 7 days)
    const contentTrend: { date: string; published: number; scheduled: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = now - i * 24 * 60 * 60 * 1000;
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      const published = publishedEvents.filter(
        (e) => e.timestamp >= dayStart && e.timestamp < dayEnd
      ).length;
      const scheduled = scheduledEvents.filter(
        (e) => e.timestamp >= dayStart && e.timestamp < dayEnd
      ).length;
      const date = new Date(dayStart).toISOString().slice(0, 10);
      contentTrend.push({ date, published, scheduled });
    }

    return {
      totalUsers,
      newUsersThisWeek,
      activeUsers,
      activeSubscriptions: activeSubscriptions.length,
      recentActivity: recentEvents.map((e) => ({
        _id: e._id,
        event: e.event,
        timestamp: e.timestamp,
        url: e.url,
      })),
      recentUsers,
      userTrend,
      // BI Content Lifecycle
      contentMetrics: {
        totalPublished: publishedEvents.length,
        totalScheduled: scheduledEvents.length,
        publishedThisWeek: publishedEvents.filter((e) => e.timestamp > sevenDaysAgo).length,
        scheduledThisWeek: scheduledEvents.filter((e) => e.timestamp > sevenDaysAgo).length,
        contentTrend,
        recentContentEvents: recentBiEvents.map((e) => ({
          _id: e._id,
          event: e.event,
          timestamp: e.timestamp,
          properties: e.properties,
        })),
      },
    };
  },
});
