/**
 * Data Cleanup Utilities
 *
 * Internal mutations to clean up test data and reduce Convex usage.
 * Run these manually via Convex dashboard or CLI when needed.
 */

import { internalMutation, internalQuery } from '../_generated/server';
import { v } from 'convex/values';

/**
 * Get counts of all tables to see what's using storage
 */
export const getTableCounts = internalQuery({
  args: {},
  handler: async (ctx) => {
    const tables = [
      'aiGenerations',
      'analyticsEvents',
      'aiRoutingLogs',
      'gscKeywordSnapshots',
      'analyticsData',
      'passwordResetTokens',
      'rankings',
      'keywords',
      'keywordClusters',
      'briefs',
      'drafts',
      'contentChecks',
      'insights',
      'projectScores',
    ];

    const counts: Record<string, number> = {};

    for (const table of tables) {
      try {
        const docs = await ctx.db.query(table as any).collect();
        counts[table] = docs.length;
      } catch {
        counts[table] = -1; // Table doesn't exist or error
      }
    }

    // Sort by count descending
    const sorted = Object.entries(counts)
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => b - a);

    console.log('[Cleanup] Table counts:', sorted);
    return { counts, sorted };
  },
});

/**
 * Clean up old AI generations (cache entries)
 */
export const cleanupAiGenerations = internalMutation({
  args: {
    olderThanDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.olderThanDays ?? 7;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

    const oldDocs = await ctx.db
      .query('aiGenerations')
      .filter((q) => q.lt(q.field('createdAt'), cutoff))
      .collect();

    let deleted = 0;
    for (const doc of oldDocs) {
      await ctx.db.delete(doc._id);
      deleted++;
    }

    console.log(`[Cleanup] Deleted ${deleted} AI generations older than ${days} days`);
    return { deleted };
  },
});

/**
 * Clean up old analytics events
 */
export const cleanupAnalyticsEvents = internalMutation({
  args: {
    olderThanDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.olderThanDays ?? 30;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

    const oldDocs = await ctx.db
      .query('analyticsEvents')
      .filter((q) => q.lt(q.field('timestamp'), cutoff))
      .collect();

    let deleted = 0;
    for (const doc of oldDocs) {
      await ctx.db.delete(doc._id);
      deleted++;
    }

    console.log(`[Cleanup] Deleted ${deleted} analytics events older than ${days} days`);
    return { deleted };
  },
});

/**
 * Clean up old GSC keyword snapshots (keep only last 30 days)
 */
export const cleanupGscSnapshots = internalMutation({
  args: {
    olderThanDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.olderThanDays ?? 30;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

    const oldDocs = await ctx.db
      .query('gscKeywordSnapshots')
      .filter((q) => q.lt(q.field('syncDate'), cutoff))
      .collect();

    let deleted = 0;
    for (const doc of oldDocs) {
      await ctx.db.delete(doc._id);
      deleted++;
    }

    console.log(`[Cleanup] Deleted ${deleted} GSC snapshots older than ${days} days`);
    return { deleted };
  },
});

/**
 * Clean up expired password reset tokens
 */
export const cleanupPasswordTokens = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    const expired = await ctx.db
      .query('passwordResetTokens')
      .filter((q) => q.lt(q.field('expiresAt'), now))
      .collect();

    let deleted = 0;
    for (const doc of expired) {
      await ctx.db.delete(doc._id);
      deleted++;
    }

    console.log(`[Cleanup] Deleted ${deleted} expired password reset tokens`);
    return { deleted };
  },
});

/**
 * Run all cleanup tasks at once
 */
export const runFullCleanup = internalMutation({
  args: {
    dryRun: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (args.dryRun) {
      // Just get counts
      const tables = [
        'aiGenerations',
        'analyticsEvents',
        'gscKeywordSnapshots',
        'passwordResetTokens',
      ];

      const preview: Record<string, number> = {};
      const cutoff7 = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const cutoff30 = Date.now() - 30 * 24 * 60 * 60 * 1000;

      // AI Generations older than 7 days
      const aiGen = await ctx.db
        .query('aiGenerations')
        .filter((q) => q.lt(q.field('createdAt'), cutoff7))
        .collect();
      preview['aiGenerations (>7d)'] = aiGen.length;

      // Analytics events older than 30 days
      const events = await ctx.db
        .query('analyticsEvents')
        .filter((q) => q.lt(q.field('timestamp'), cutoff30))
        .collect();
      preview['analyticsEvents (>30d)'] = events.length;

      // GSC snapshots older than 30 days
      const gsc = await ctx.db
        .query('gscKeywordSnapshots')
        .filter((q) => q.lt(q.field('syncDate'), cutoff30))
        .collect();
      preview['gscKeywordSnapshots (>30d)'] = gsc.length;

      // Expired password tokens
      const tokens = await ctx.db
        .query('passwordResetTokens')
        .filter((q) => q.lt(q.field('expiresAt'), Date.now()))
        .collect();
      preview['passwordResetTokens (expired)'] = tokens.length;

      console.log('[Cleanup] Dry run preview:', preview);
      return { dryRun: true, preview };
    }

    // Actually run cleanup
    const results = {
      aiGenerations: 0,
      analyticsEvents: 0,
      gscSnapshots: 0,
      passwordTokens: 0,
    };

    // Clean AI generations (7 days)
    const cutoff7 = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const aiGen = await ctx.db
      .query('aiGenerations')
      .filter((q) => q.lt(q.field('createdAt'), cutoff7))
      .collect();
    for (const doc of aiGen) {
      await ctx.db.delete(doc._id);
      results.aiGenerations++;
    }

    // Clean analytics events (30 days)
    const cutoff30 = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const events = await ctx.db
      .query('analyticsEvents')
      .filter((q) => q.lt(q.field('timestamp'), cutoff30))
      .collect();
    for (const doc of events) {
      await ctx.db.delete(doc._id);
      results.analyticsEvents++;
    }

    // Clean GSC snapshots (30 days)
    const gsc = await ctx.db
      .query('gscKeywordSnapshots')
      .filter((q) => q.lt(q.field('syncDate'), cutoff30))
      .collect();
    for (const doc of gsc) {
      await ctx.db.delete(doc._id);
      results.gscSnapshots++;
    }

    // Clean expired password tokens
    const tokens = await ctx.db
      .query('passwordResetTokens')
      .filter((q) => q.lt(q.field('expiresAt'), Date.now()))
      .collect();
    for (const doc of tokens) {
      await ctx.db.delete(doc._id);
      results.passwordTokens++;
    }

    const total =
      results.aiGenerations +
      results.analyticsEvents +
      results.gscSnapshots +
      results.passwordTokens;

    console.log(`[Cleanup] Full cleanup complete. Deleted ${total} documents.`, results);
    return { dryRun: false, results, total };
  },
});

/**
 * Aggressive cleanup for dev environments
 * Clears most test data to free up space
 */
export const devCleanup = internalMutation({
  args: {
    confirmDelete: v.boolean(),
  },
  handler: async (ctx, args) => {
    if (!args.confirmDelete) {
      // Preview mode - just count
      const preview: Record<string, number> = {};

      const tables = [
        'aiGenerations',
        'analyticsEvents',
        'insights',
        'gscKeywordSnapshots',
        'passwordResetTokens',
        'rankings',
        'contentChecks',
      ];

      for (const table of tables) {
        try {
          const docs = await ctx.db.query(table as any).collect();
          preview[table] = docs.length;
        } catch {
          preview[table] = 0;
        }
      }

      console.log('[DevCleanup] Preview - would delete:', preview);
      return { deleted: false, preview };
    }

    // Actually delete
    const results: Record<string, number> = {};

    // Delete ALL from these tables (safe for dev)
    const tablesToClear = [
      'aiGenerations',
      'analyticsEvents',
      'insights',
      'gscKeywordSnapshots',
      'passwordResetTokens',
      'rankings',
      'contentChecks',
    ];

    for (const table of tablesToClear) {
      try {
        const docs = await ctx.db.query(table as any).collect();
        for (const doc of docs) {
          await ctx.db.delete(doc._id);
        }
        results[table] = docs.length;
      } catch {
        results[table] = 0;
      }
    }

    const total = Object.values(results).reduce((a, b) => a + b, 0);
    console.log(`[DevCleanup] Deleted ${total} documents:`, results);
    return { deleted: true, results, total };
  },
});
