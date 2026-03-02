/**
 * Component Hierarchy:
 * convex/analytics/contentMetrics.ts (CRUD for contentMetrics table)
 *
 * Provides mutations and queries for the contentMetrics table, which stores
 * per-page performance data (leads, traffic, engagement) from GA4.
 */

import { internalMutation, internalQuery, query } from '../_generated/server';
import { v } from 'convex/values';
import { requireProjectAccess } from '../lib/rbac';

/**
 * Upsert a content metric record — idempotent by project + pagePath + syncDate.
 */
export const upsertContentMetric = internalMutation({
  args: {
    projectId: v.id('projects'),
    contentPieceId: v.optional(v.id('contentPieces')),
    pagePath: v.string(),
    publishedUrl: v.optional(v.string()),
    leadCount: v.number(),
    pageViews: v.optional(v.number()),
    avgTimeOnPage: v.optional(v.number()),
    bounceRate: v.optional(v.number()),
    syncDate: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('contentMetrics')
      .withIndex('by_project_page', (q) =>
        q.eq('projectId', args.projectId).eq('pagePath', args.pagePath)
      )
      .first();

    if (existing && existing.syncDate === args.syncDate) {
      await ctx.db.patch(existing._id, {
        contentPieceId: args.contentPieceId,
        publishedUrl: args.publishedUrl,
        leadCount: args.leadCount,
        pageViews: args.pageViews,
        avgTimeOnPage: args.avgTimeOnPage,
        bounceRate: args.bounceRate,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert('contentMetrics', {
        projectId: args.projectId,
        contentPieceId: args.contentPieceId,
        pagePath: args.pagePath,
        publishedUrl: args.publishedUrl,
        leadCount: args.leadCount,
        pageViews: args.pageViews,
        avgTimeOnPage: args.avgTimeOnPage,
        bounceRate: args.bounceRate,
        syncDate: args.syncDate,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

/**
 * Get all content metrics for a project (latest sync).
 */
export const getContentMetricsForProject = internalQuery({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('contentMetrics')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
  },
});

/**
 * Get metrics for a specific content piece.
 */
export const getMetricsForContentPiece = internalQuery({
  args: { contentPieceId: v.id('contentPieces') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('contentMetrics')
      .withIndex('by_content_piece', (q) => q.eq('contentPieceId', args.contentPieceId))
      .collect();
  },
});

/**
 * Content Performance — the hero query for the Content Studio.
 * Joins contentPieces with contentMetrics to produce a ranked performance table.
 * Computed at query time (Zero-Generate principle).
 */
export const getContentPerformance = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    await requireProjectAccess(ctx, args.projectId, 'viewer');

    const pieces = await ctx.db
      .query('contentPieces')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    const metrics = await ctx.db
      .query('contentMetrics')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    // Build a lookup map: contentPieceId → aggregated metrics
    const metricsMap = new Map<
      string,
      { leads: number; pageViews: number; avgTimeOnPage: number; bounceRate: number }
    >();

    for (const m of metrics) {
      if (!m.contentPieceId) continue;
      const key = m.contentPieceId;
      const existing = metricsMap.get(key) || {
        leads: 0,
        pageViews: 0,
        avgTimeOnPage: 0,
        bounceRate: 0,
      };
      existing.leads += m.leadCount;
      existing.pageViews += m.pageViews ?? 0;
      // Weighted average for time and bounce rate
      if (m.avgTimeOnPage) {
        existing.avgTimeOnPage =
          (existing.avgTimeOnPage * (existing.pageViews - (m.pageViews ?? 0)) +
            m.avgTimeOnPage * (m.pageViews ?? 1)) /
          Math.max(existing.pageViews, 1);
      }
      if (m.bounceRate) {
        existing.bounceRate =
          (existing.bounceRate * (existing.pageViews - (m.pageViews ?? 0)) +
            m.bounceRate * (m.pageViews ?? 1)) /
          Math.max(existing.pageViews, 1);
      }
      metricsMap.set(key, existing);
    }

    const now = Date.now();
    const MS_PER_DAY = 86400000;

    const performanceData = pieces
      .filter((p) => p.status === 'published')
      .map((p) => {
        const pMetrics = metricsMap.get(p._id) || {
          leads: 0,
          pageViews: 0,
          avgTimeOnPage: 0,
          bounceRate: 0,
        };
        const daysSincePublished = p.publishedUrl
          ? Math.floor((now - p.updatedAt) / MS_PER_DAY)
          : null;

        let maturityStage: 'maturing' | 'growing' | 'established' = 'maturing';
        if (daysSincePublished !== null) {
          if (daysSincePublished > 180) maturityStage = 'established';
          else if (daysSincePublished > 90) maturityStage = 'growing';
        }

        return {
          _id: p._id,
          title: p.title,
          contentType: p.contentType,
          seoScore: p.seoScore ?? null,
          geoScore: p.geoScore ?? null,
          publishedUrl: p.publishedUrl ?? null,
          leads: pMetrics.leads,
          pageViews: pMetrics.pageViews,
          avgTimeOnPage: Math.round(pMetrics.avgTimeOnPage * 10) / 10,
          bounceRate: Math.round(pMetrics.bounceRate * 1000) / 1000,
          daysSincePublished,
          maturityStage,
        };
      })
      // Sort by leads DESC, then pageViews DESC
      .sort((a, b) => b.leads - a.leads || b.pageViews - a.pageViews);

    return performanceData;
  },
});

/**
 * Project Metrics Summary — aggregate metrics at the project level.
 * Computed at query time (Zero-Generate principle).
 */
export const getProjectMetricsSummary = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    await requireProjectAccess(ctx, args.projectId, 'viewer');

    // Get latest analytics data
    const analyticsData = await ctx.db
      .query('analyticsData')
      .withIndex('by_project_date', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .first();

    // Get content pieces
    const pieces = await ctx.db
      .query('contentPieces')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    // Get content metrics
    const metrics = await ctx.db
      .query('contentMetrics')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    const published = pieces.filter((p) => p.status === 'published');
    const drafts = pieces.filter((p) => p.status === 'draft');

    // Aggregate metrics
    const totalLeads = metrics.reduce((sum, m) => sum + m.leadCount, 0);
    const totalPageViews = metrics.reduce((sum, m) => sum + (m.pageViews ?? 0), 0);

    // Lead conversion rate: leads / sessions
    const sessions = analyticsData?.sessions ?? 0;
    const leadConversionRate = sessions > 0 ? (totalLeads / sessions) * 100 : 0;

    // Content velocity: published pieces / months active
    const firstPiece = pieces.length > 0 ? Math.min(...pieces.map((p) => p.createdAt)) : Date.now();
    const monthsActive = Math.max(1, Math.ceil((Date.now() - firstPiece) / (30 * 86400000)));
    const contentVelocity = published.length / monthsActive;

    // Draft-to-publish ratio
    const draftToPublishRatio =
      published.length + drafts.length > 0
        ? published.length / (published.length + drafts.length)
        : 0;

    // Top performing content piece
    const topContent =
      metrics.length > 0
        ? metrics.reduce((best, m) => (m.leadCount > best.leadCount ? m : best))
        : null;

    let topContentTitle: string | null = null;
    if (topContent?.contentPieceId) {
      const piece = await ctx.db.get(topContent.contentPieceId);
      topContentTitle = piece?.title ?? null;
    }

    return {
      totalLeads,
      totalPageViews,
      leadConversionRate: Math.round(leadConversionRate * 100) / 100,
      contentVelocity: Math.round(contentVelocity * 10) / 10,
      draftToPublishRatio: Math.round(draftToPublishRatio * 100),
      publishedCount: published.length,
      draftCount: drafts.length,
      totalPieces: pieces.length,
      topPerformingContent: topContentTitle,
      sessions,
      monthsActive,
    };
  },
});
