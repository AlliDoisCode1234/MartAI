import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/rbac';
import { paginationOptsValidator } from 'convex/server';

/**
 * Admin: Project Analytics
 *
 * Secure endpoints for pulling full, un-abstracted analytics matrices
 * for internal staff consumption.
 * Part of the Data Dominance "Omniscient Client View" mandate.
 */

// ============================================
// PHASE 4: ADMIN INTELLIGENCE FIREHOSE
// ============================================

/**
 * Pull the raw GSC feed.
 * We use `paginate` to safely scale beyond Convex's standard array limits.
 */
export const getRawGSCFeed = query({
  args: {
    projectId: v.id('projects'),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx); // Strictly forbid standard users

    // Fetch the raw keyword impressions and metrics, sort by date descending
    return await ctx.db
      .query('gscKeywordSnapshots')
      .withIndex('by_project_date', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .paginate(args.paginationOpts);
  },
});

/**
 * Pull the raw GA4 feed.
 * Unabridged feed containing bounce rate, conversions, engaged sessions.
 */
export const getRawGA4Feed = query({
  args: {
    projectId: v.id('projects'),
    paginationOpts: paginationOptsValidator, // Limit payload sizes
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx); // Strictly forbid standard users

    return await ctx.db
      .query('analyticsData')
      .withIndex('by_project_date', (q) => q.eq('projectId', args.projectId))
      .filter((q) => q.eq(q.field('source'), 'ga4'))
      .order('desc')
      .paginate(args.paginationOpts);
  },
});
