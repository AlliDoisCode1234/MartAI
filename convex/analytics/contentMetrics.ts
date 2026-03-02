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
import { THRESHOLDS } from '../config/thresholds';

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
    bounceRate: v.optional(v.number()), // stored as 0-100 percentage
    syncDate: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('contentMetrics')
      .withIndex('by_project_page_sync', (q) =>
        q
          .eq('projectId', args.projectId)
          .eq('pagePath', args.pagePath)
          .eq('syncDate', args.syncDate)
      )
      .first();

    if (existing) {
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
 * Bulk upsert content metrics — processes a batch of rows in a single mutation.
 * Called from sync pipeline with chunks of ~200 rows to avoid action timeouts.
 */
export const bulkUpsertContentMetrics = internalMutation({
  args: {
    projectId: v.id('projects'),
    syncDate: v.number(),
    rows: v.array(
      v.object({
        contentPieceId: v.optional(v.id('contentPieces')),
        pagePath: v.string(),
        publishedUrl: v.optional(v.string()),
        leadCount: v.number(),
        pageViews: v.optional(v.number()),
        avgTimeOnPage: v.optional(v.number()),
        bounceRate: v.optional(v.number()), // stored as 0-100 percentage
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const row of args.rows) {
      const existing = await ctx.db
        .query('contentMetrics')
        .withIndex('by_project_page_sync', (q) =>
          q
            .eq('projectId', args.projectId)
            .eq('pagePath', row.pagePath)
            .eq('syncDate', args.syncDate)
        )
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          contentPieceId: row.contentPieceId,
          publishedUrl: row.publishedUrl,
          leadCount: row.leadCount,
          pageViews: row.pageViews,
          avgTimeOnPage: row.avgTimeOnPage,
          bounceRate: row.bounceRate,
          updatedAt: Date.now(),
        });
      } else {
        await ctx.db.insert('contentMetrics', {
          projectId: args.projectId,
          contentPieceId: row.contentPieceId,
          pagePath: row.pagePath,
          publishedUrl: row.publishedUrl,
          leadCount: row.leadCount,
          pageViews: row.pageViews,
          avgTimeOnPage: row.avgTimeOnPage,
          bounceRate: row.bounceRate,
          syncDate: args.syncDate,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    }
  },
});

/**
 * Get ALL content metrics for a project (across all sync dates).
 * WARNING: Returns all historical snapshots. For latest-only data,
 * use getContentPerformance or getProjectMetricsSummary instead.
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

    // Get the latest sync date to avoid double-counting across snapshots
    const latestMetric = await ctx.db
      .query('contentMetrics')
      .withIndex('by_project_date', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .first();
    const latestSyncDate = latestMetric?.syncDate ?? 0;

    const metrics = await ctx.db
      .query('contentMetrics')
      .withIndex('by_project_date', (q) =>
        q.eq('projectId', args.projectId).eq('syncDate', latestSyncDate)
      )
      .collect();

    // Build a lookup map: contentPieceId → aggregated metrics
    const metricsMap = new Map<
      string,
      {
        leads: number;
        pageViews: number;
        weightedTimeSum: number;
        weightedBounceSum: number;
        timeWeightTotal: number;
        bounceWeightTotal: number;
      }
    >();

    for (const m of metrics) {
      if (!m.contentPieceId) continue;
      const key = m.contentPieceId;
      const existing = metricsMap.get(key) || {
        leads: 0,
        pageViews: 0,
        weightedTimeSum: 0,
        weightedBounceSum: 0,
        timeWeightTotal: 0,
        bounceWeightTotal: 0,
      };
      existing.leads += m.leadCount;
      existing.pageViews += m.pageViews ?? 0;

      const weight = m.pageViews ?? 0;
      if (m.avgTimeOnPage !== undefined) {
        existing.weightedTimeSum += m.avgTimeOnPage * weight;
        existing.timeWeightTotal += weight;
      }
      if (m.bounceRate !== undefined) {
        existing.weightedBounceSum += m.bounceRate * weight;
        existing.bounceWeightTotal += weight;
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
          weightedTimeSum: 0,
          weightedBounceSum: 0,
          timeWeightTotal: 0,
          bounceWeightTotal: 0,
        };

        const avgTimeOnPage =
          pMetrics.timeWeightTotal > 0 ? pMetrics.weightedTimeSum / pMetrics.timeWeightTotal : 0;
        const bounceRate =
          pMetrics.bounceWeightTotal > 0
            ? pMetrics.weightedBounceSum / pMetrics.bounceWeightTotal
            : 0;

        const publishTimestamp = p.publishedAt ?? p.createdAt;
        const daysSincePublished = p.publishedUrl
          ? Math.floor((now - publishTimestamp) / MS_PER_DAY)
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
          avgTimeOnPage: Math.round(avgTimeOnPage * 10) / 10,
          bounceRate: Math.round(bounceRate * 1000) / 1000,
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

    // Source sessions from GA4 specifically (GSC rows have no sessions field)
    const ga4Data = await ctx.db
      .query('analyticsData')
      .withIndex('by_project_date_source', (q) => q.eq('projectId', args.projectId))
      .filter((q) => q.eq(q.field('source'), 'ga4'))
      .order('desc')
      .first();

    // Get content pieces
    const pieces = await ctx.db
      .query('contentPieces')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    // Get the latest sync date for accurate totals
    const latestMetric = await ctx.db
      .query('contentMetrics')
      .withIndex('by_project_date', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .first();
    const latestSyncDate = latestMetric?.syncDate ?? 0;

    // Get content metrics for latest sync only
    // Using .collect() is safe here — index narrows to one (projectId, syncDate) slice
    const metrics = await ctx.db
      .query('contentMetrics')
      .withIndex('by_project_date', (q) =>
        q.eq('projectId', args.projectId).eq('syncDate', latestSyncDate)
      )
      .collect();

    const published = pieces.filter((p) => p.status === 'published');
    const drafts = pieces.filter((p) => p.status === 'draft');

    // Aggregate metrics
    const totalLeads = metrics.reduce((sum, m) => sum + m.leadCount, 0);
    const totalPageViews = metrics.reduce((sum, m) => sum + (m.pageViews ?? 0), 0);

    // Lead conversion rate: leads / sessions (GA4-sourced only)
    const sessions = ga4Data?.sessions ?? 0;
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

/**
 * Prune stale contentMetrics snapshots older than snapshotRetentionDays.
 * Prevents unbounded DB growth. Deletes in batches to stay within Convex limits.
 * Called at the tail of each sync cycle.
 */
export const pruneStaleSnapshots = internalMutation({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const RETENTION_MS = THRESHOLDS.sync.snapshotRetentionDays * 24 * 60 * 60 * 1000;
    const cutoff = Date.now() - RETENTION_MS;

    // Use index range for efficient pruning (avoids scanning non-stale rows)
    const staleRows = await ctx.db
      .query('contentMetrics')
      .withIndex('by_project_date', (q) => q.eq('projectId', args.projectId).lt('syncDate', cutoff))
      .order('asc') // Oldest-first for predictable progress
      .take(500); // Batch limit per invocation

    for (const row of staleRows) {
      await ctx.db.delete(row._id);
    }

    if (staleRows.length > 0) {
      console.log(
        `[Snapshot Cleanup] Project ${args.projectId}: pruned ${staleRows.length} stale snapshots (cutoff: ${new Date(cutoff).toISOString().split('T')[0]})`
      );
    }

    return { pruned: staleRows.length };
  },
});
