/**
 * MartAI Rating - Queries and Mutations
 *
 * These are the database operations for MR scoring.
 * Queries/mutations can't use 'use node', so they're in this separate file.
 */

import { internalQuery, internalMutation, query, mutation } from '../_generated/server';
import { v } from 'convex/values';

/**
 * Store a score in the database
 */
export const storeScore = internalMutation({
  args: {
    projectId: v.id('projects'),
    date: v.number(),
    overall: v.number(),
    tier: v.string(),
    visibility: v.number(),
    trafficHealth: v.number(),
    ctrPerformance: v.number(),
    engagementQuality: v.number(),
    quickWinPotential: v.number(),
    contentVelocity: v.number(),
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

/**
 * Generate preliminary MR score for early-stage projects (no GA4/GSC yet)
 * This gives users immediate feedback after onboarding based on their keywords/clusters
 */
export const generatePreliminaryScore = mutation({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    // Check if score already exists
    const existingScore = await ctx.db
      .query('projectScores')
      .withIndex('by_project_date', (q) => q.eq('projectId', args.projectId))
      .first();

    if (existingScore) {
      // Don't overwrite existing scores
      return existingScore;
    }

    // Get keyword count
    const keywords = await ctx.db
      .query('keywords')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
    const keywordCount = keywords.length;

    // Get cluster count
    const clusters = await ctx.db
      .query('keywordClusters')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
    const clusterCount = clusters.length;

    // Simple preliminary score based on what we have
    // Keywords: 10+ = 40pts, 5+ = 25pts, 1+ = 15pts, 0 = 5pts
    let keywordScore = 5;
    if (keywordCount >= 10) keywordScore = 40;
    else if (keywordCount >= 5) keywordScore = 25;
    else if (keywordCount >= 1) keywordScore = 15;

    // Clusters: 3+ = 30pts, 1+ = 15pts, 0 = 5pts
    let clusterScore = 5;
    if (clusterCount >= 3) clusterScore = 30;
    else if (clusterCount >= 1) clusterScore = 15;

    // Base score for having a project = 10pts
    const baseScore = 10;

    // Total preliminary score (max ~80 without GA4/GSC, encouraging integration)
    const overall = Math.min(keywordScore + clusterScore + baseScore, 80);

    // Determine tier
    let tier = 'needs_work';
    if (overall >= 60) tier = 'good';
    else if (overall >= 40) tier = 'fair';

    // Store preliminary score
    const scoreId = await ctx.db.insert('projectScores', {
      projectId: args.projectId,
      date: Date.now(),
      overall,
      tier,
      visibility: 0,
      trafficHealth: 0,
      ctrPerformance: 0,
      engagementQuality: 0,
      quickWinPotential: keywordScore,
      contentVelocity: clusterScore,
      rawMetrics: {
        quickWinCount: keywordCount,
        briefsThisMonth: clusterCount,
      },
    });

    console.log(`[MR] Preliminary score for ${args.projectId}: ${overall} (${tier})`);

    return { _id: scoreId, overall, tier };
  },
});
