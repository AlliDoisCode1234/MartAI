/**
 * MartAI Rating - Queries and Mutations
 *
 * These are the database operations for MR scoring.
 * Queries/mutations can't use 'use node', so they're in this separate file.
 */

import { internalQuery, internalMutation, query } from '../_generated/server';
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
 * Count briefs created since a given date for content velocity scoring
 */
export const countBriefsThisMonth = internalQuery({
  args: {
    projectId: v.id('projects'),
    since: v.number(),
  },
  handler: async (ctx, args) => {
    const briefs = await ctx.db
      .query('briefs')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .filter((q) => q.gte(q.field('createdAt'), args.since))
      .collect();
    return briefs.length;
  },
});
