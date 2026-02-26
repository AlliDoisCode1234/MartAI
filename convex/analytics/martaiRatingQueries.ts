/**
 * Phoo Rating — Queries and Mutations
 *
 * Component Hierarchy:
 * convex/analytics/martaiRatingQueries.ts (this file)
 * └── Used by: martaiRating.ts (calculator), canonical/rating.ts (SSOT reader)
 *
 * Database operations for Phoo Rating scoring.
 * Queries/mutations can't use 'use node', so they're in this separate file.
 */

import { internalQuery, internalMutation, query, mutation } from '../_generated/server';
import { v } from 'convex/values';
import { requireProjectAccess } from '../lib/rbac';

/**
 * Store a unified Phoo Rating score
 */
export const storeScore = internalMutation({
  args: {
    projectId: v.id('projects'),
    date: v.number(),
    overall: v.number(),
    tier: v.string(),
    // External signals
    visibility: v.number(),
    trafficHealth: v.number(),
    ctrPerformance: v.number(),
    engagementQuality: v.number(),
    // Platform signals
    seoAudit: v.optional(v.number()),
    keywordStrategy: v.optional(v.number()),
    contentExecution: v.optional(v.number()),
    geoReadiness: v.optional(v.number()),
    // Raw metrics
    rawMetrics: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('projectScores', args);
  },
});

/**
 * Get the latest score for a project (public query for dashboard)
 */
export const getLatestScore = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    // RBAC: verify user has at least viewer access
    await requireProjectAccess(ctx, args.projectId, 'viewer');

    return await ctx.db
      .query('projectScores')
      .withIndex('by_project_date', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .first();
  },
});

/**
 * Get score history for a project (for trend chart)
 */
export const getScoreHistory = query({
  args: {
    projectId: v.id('projects'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // RBAC: verify user has at least viewer access
    await requireProjectAccess(ctx, args.projectId, 'viewer');

    return await ctx.db
      .query('projectScores')
      .withIndex('by_project_date', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .take(args.limit || 30);
  },
});

/**
 * Count content pieces created since a given date for content velocity scoring
 */
export const countBriefsThisMonth = internalQuery({
  args: {
    projectId: v.id('projects'),
    since: v.number(),
  },
  handler: async (ctx, args) => {
    const pieces = await ctx.db
      .query('contentPieces')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .filter((q) => q.gte(q.field('createdAt'), args.since))
      .collect();
    return pieces.length;
  },
});

// ─── Helper queries for unified Phoo Rating ──────────────────────────────────

/**
 * Get latest SEO audit for a project
 */
export const getLatestSEOAudit = internalQuery({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('seoAudits')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .first();
  },
});

/**
 * Get keyword statistics for scoring
 */
export const getKeywordStats = internalQuery({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const keywords = await ctx.db
      .query('keywords')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    return {
      total: keywords.length,
      withVolume: keywords.filter((k) => k.searchVolume && k.searchVolume > 0).length,
      highPriority: keywords.filter((k) => k.priority === 'high').length,
      approved: keywords.filter((k) => k.status === 'approved' || k.status === 'implemented')
        .length,
    };
  },
});

/**
 * Get content execution statistics for scoring
 */
export const getContentStats = internalQuery({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const contentPieces = await ctx.db
      .query('contentPieces')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    const clusters = await ctx.db
      .query('keywordClusters')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    const calendar = await ctx.db
      .query('contentCalendars')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .first();

    return {
      totalPieces: contentPieces.length,
      published: contentPieces.filter((p) => p.status === 'published').length,
      clusters: clusters.length,
      hasCalendar: !!calendar,
    };
  },
});

/**
 * Generate preliminary score for early-stage projects (no GA4/GSC yet)
 * Gives users immediate feedback after onboarding
 */
export const generatePreliminaryScore = mutation({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    // RBAC: mutating a rating calculation requires editor access
    await requireProjectAccess(ctx, args.projectId, 'editor');

    // Don't overwrite existing scores
    const existingScore = await ctx.db
      .query('projectScores')
      .withIndex('by_project_date', (q) => q.eq('projectId', args.projectId))
      .first();

    if (existingScore) return existingScore;

    // Simple keyword/cluster-based preliminary score
    const keywords = await ctx.db
      .query('keywords')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    const clusters = await ctx.db
      .query('keywordClusters')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    let keywordScore = 5;
    if (keywords.length >= 10) keywordScore = 40;
    else if (keywords.length >= 5) keywordScore = 25;
    else if (keywords.length >= 1) keywordScore = 15;

    let clusterScore = 5;
    if (clusters.length >= 3) clusterScore = 30;
    else if (clusters.length >= 1) clusterScore = 15;

    const overall = Math.min(keywordScore + clusterScore + 10, 80);

    let tier = 'needs_work';
    if (overall >= 60) tier = 'good';
    else if (overall >= 40) tier = 'fair';

    const scoreId = await ctx.db.insert('projectScores', {
      projectId: args.projectId,
      date: Date.now(),
      overall,
      tier,
      visibility: 0,
      trafficHealth: 0,
      ctrPerformance: 0,
      engagementQuality: 0,
      seoAudit: 0,
      keywordStrategy: keywordScore,
      contentExecution: clusterScore,
      geoReadiness: 0,
    });

    console.log(`[PhooRating] Preliminary score for ${args.projectId}: ${overall} (${tier})`);
    return { _id: scoreId, overall, tier };
  },
});
