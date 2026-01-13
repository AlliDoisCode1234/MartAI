/**
 * GSC Keyword Snapshots
 *
 * Mutations and queries for keyword-level GSC data with historical tracking
 */

import { v } from 'convex/values';
import { mutation, query, internalMutation, internalQuery } from '../_generated/server';

/**
 * Store a keyword snapshot (internal - called during sync)
 */
export const storeKeywordSnapshot = internalMutation({
  args: {
    projectId: v.id('projects'),
    syncDate: v.number(),
    keyword: v.string(),
    clicks: v.number(),
    impressions: v.number(),
    ctr: v.number(),
    position: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('gscKeywordSnapshots', {
      projectId: args.projectId,
      syncDate: args.syncDate,
      keyword: args.keyword,
      clicks: args.clicks,
      impressions: args.impressions,
      ctr: args.ctr,
      position: args.position,
    });
  },
});

/**
 * Get latest keyword snapshots for a project
 */
export const getLatestKeywords = query({
  args: {
    projectId: v.id('projects'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const keywords = await ctx.db
      .query('gscKeywordSnapshots')
      .withIndex('by_project_date', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .take(args.limit || 100);

    // Group by keyword and return the most recent entry for each
    const keywordMap = new Map<string, (typeof keywords)[0]>();
    for (const kw of keywords) {
      if (!keywordMap.has(kw.keyword)) {
        keywordMap.set(kw.keyword, kw);
      }
    }

    return Array.from(keywordMap.values());
  },
});

/**
 * Get keyword history for trending analysis
 */
export const getKeywordHistory = query({
  args: {
    projectId: v.id('projects'),
    keyword: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('gscKeywordSnapshots')
      .withIndex('by_project_keyword', (q) =>
        q.eq('projectId', args.projectId).eq('keyword', args.keyword)
      )
      .order('desc')
      .take(args.limit || 30);
  },
});

/**
 * Get Quick Win keywords (position 5-15, high impressions)
 */
export const getQuickWinKeywords = internalQuery({
  args: {
    projectId: v.id('projects'),
    minImpressions: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const latestSyncs = await ctx.db
      .query('gscKeywordSnapshots')
      .withIndex('by_project_date', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .take(500);

    // Get unique keywords (most recent only)
    const keywordMap = new Map<string, (typeof latestSyncs)[0]>();
    for (const kw of latestSyncs) {
      if (!keywordMap.has(kw.keyword)) {
        keywordMap.set(kw.keyword, kw);
      }
    }

    const minImpressions = args.minImpressions || 500;

    // Filter for Quick Wins: position 5-15, high impressions
    return Array.from(keywordMap.values()).filter(
      (kw) => kw.position >= 5 && kw.position <= 15 && kw.impressions >= minImpressions
    );
  },
});

/**
 * Compare keyword snapshots between two periods
 */
export const getKeywordChanges = internalQuery({
  args: {
    projectId: v.id('projects'),
    currentDate: v.number(),
    previousDate: v.number(),
  },
  handler: async (ctx, args) => {
    // Get snapshots around current date
    const currentSnapshots = await ctx.db
      .query('gscKeywordSnapshots')
      .withIndex('by_project_date', (q) => q.eq('projectId', args.projectId))
      .filter((q) => q.gte(q.field('syncDate'), args.currentDate - 24 * 60 * 60 * 1000))
      .collect();

    // Get snapshots around previous date
    const previousSnapshots = await ctx.db
      .query('gscKeywordSnapshots')
      .withIndex('by_project_date', (q) => q.eq('projectId', args.projectId))
      .filter((q) =>
        q.and(
          q.gte(q.field('syncDate'), args.previousDate - 24 * 60 * 60 * 1000),
          q.lt(q.field('syncDate'), args.currentDate - 24 * 60 * 60 * 1000)
        )
      )
      .collect();

    // Build maps for comparison
    const currentMap = new Map(currentSnapshots.map((k) => [k.keyword, k]));
    const previousMap = new Map(previousSnapshots.map((k) => [k.keyword, k]));

    const changes: Array<{
      keyword: string;
      currentPosition: number;
      previousPosition: number | null;
      positionChange: number;
      impressionsChange: number;
      isNew: boolean;
    }> = [];

    for (const [keyword, current] of currentMap) {
      const previous = previousMap.get(keyword);
      if (!previous) {
        changes.push({
          keyword,
          currentPosition: current.position,
          previousPosition: null,
          positionChange: 0,
          impressionsChange: current.impressions,
          isNew: true,
        });
      } else {
        const positionChange = previous.position - current.position; // Positive = improved
        const impressionsChange = current.impressions - previous.impressions;
        if (Math.abs(positionChange) >= 3 || Math.abs(impressionsChange) > 100) {
          changes.push({
            keyword,
            currentPosition: current.position,
            previousPosition: previous.position,
            positionChange,
            impressionsChange,
            isNew: false,
          });
        }
      }
    }

    return changes;
  },
});

/**
 * Get aggregated GSC stats for dashboard display
 * Returns: total clicks, impressions, avg CTR, avg position, top 5 keywords
 */
export const getGSCDashboardStats = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    // Get most recent snapshots (last 7 days worth)
    const snapshots = await ctx.db
      .query('gscKeywordSnapshots')
      .withIndex('by_project_date', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .take(500);

    if (snapshots.length === 0) {
      return null;
    }

    // Get unique keywords (most recent entry per keyword)
    const keywordMap = new Map<string, (typeof snapshots)[0]>();
    for (const kw of snapshots) {
      if (!keywordMap.has(kw.keyword)) {
        keywordMap.set(kw.keyword, kw);
      }
    }

    const uniqueKeywords = Array.from(keywordMap.values());

    // Calculate aggregates
    let totalClicks = 0;
    let totalImpressions = 0;
    let totalPosition = 0;

    for (const kw of uniqueKeywords) {
      totalClicks += kw.clicks;
      totalImpressions += kw.impressions;
      totalPosition += kw.position;
    }

    const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const avgPosition = uniqueKeywords.length > 0 ? totalPosition / uniqueKeywords.length : 0;

    // Get top 5 keywords by impressions
    const topKeywords = uniqueKeywords
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 5)
      .map((kw) => ({
        keyword: kw.keyword,
        clicks: kw.clicks,
        impressions: kw.impressions,
        ctr: kw.ctr,
        position: kw.position,
      }));

    return {
      totalClicks,
      totalImpressions,
      avgCtr: Math.round(avgCtr * 100) / 100,
      avgPosition: Math.round(avgPosition * 10) / 10,
      topKeywords,
      keywordCount: uniqueKeywords.length,
      lastSyncDate: snapshots[0]?.syncDate || null,
    };
  },
});
