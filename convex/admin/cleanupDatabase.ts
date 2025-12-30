/**
 * Database Cleanup Scripts
 *
 * Admin-only mutations for cleaning up legacy data and enforcing TTLs.
 * Run via Convex dashboard or scheduled cron.
 */

import { internalMutation, mutation } from '../_generated/server';
import { v } from 'convex/values';
import { auth } from '../auth';

// ============================================================================
// Dry Run - Check what would be deleted without actually deleting
// ============================================================================

export const previewCleanup = internalMutation({
  args: {
    olderThanDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const olderThanDays = args.olderThanDays ?? 7;
    const cutoffMs = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;

    const stats = {
      legacyUsers: 0,
      legacySessions: 0,
      aiRoutingLogs: 0,
      webhookDeliveries: 0,
      aiProviderHealth: 0,
      analyticsEvents: 0,
    };

    // Count legacy auth tables
    try {
      const legacyUsers = await ctx.db.query('legacyUsers').collect();
      stats.legacyUsers = legacyUsers.length;
    } catch {
      // Table may not exist
    }

    try {
      const legacySessions = await ctx.db.query('legacySessions').collect();
      stats.legacySessions = legacySessions.length;
    } catch {
      // Table may not exist
    }

    // Count old logs (older than cutoff)
    try {
      const oldRoutingLogs = await ctx.db
        .query('aiRoutingLogs')
        .filter((q) => q.lt(q.field('createdAt'), cutoffMs))
        .collect();
      stats.aiRoutingLogs = oldRoutingLogs.length;
    } catch {
      // Table may not exist
    }

    try {
      const oldDeliveries = await ctx.db
        .query('webhookDeliveries')
        .filter((q) => q.lt(q.field('createdAt'), cutoffMs))
        .collect();
      stats.webhookDeliveries = oldDeliveries.length;
    } catch {
      // Table may not exist
    }

    try {
      const oldHealth = await ctx.db
        .query('aiProviderHealth')
        .filter((q) => q.lt(q.field('lastHealthCheckAt'), cutoffMs))
        .collect();
      stats.aiProviderHealth = oldHealth.length;
    } catch {
      // Table may not exist
    }

    return {
      dryRun: true,
      cutoffDate: new Date(cutoffMs).toISOString(),
      toDelete: stats,
      totalRecords: Object.values(stats).reduce((a, b) => a + b, 0),
    };
  },
});

// ============================================================================
// Delete Legacy Auth Tables
// ============================================================================

export const clearLegacyAuth = internalMutation({
  args: {},
  handler: async (ctx) => {
    let deletedUsers = 0;
    let deletedSessions = 0;

    // Delete legacy users
    try {
      const legacyUsers = await ctx.db.query('legacyUsers').collect();
      for (const user of legacyUsers) {
        await ctx.db.delete(user._id);
        deletedUsers++;
      }
    } catch (e) {
      console.log('[Cleanup] legacyUsers table not found or empty');
    }

    // Delete legacy sessions
    try {
      const legacySessions = await ctx.db.query('legacySessions').collect();
      for (const session of legacySessions) {
        await ctx.db.delete(session._id);
        deletedSessions++;
      }
    } catch (e) {
      console.log('[Cleanup] legacySessions table not found or empty');
    }

    return {
      deletedUsers,
      deletedSessions,
      message: `Deleted ${deletedUsers} legacy users and ${deletedSessions} legacy sessions`,
    };
  },
});

// ============================================================================
// TTL Cleanup - Delete old log records
// ============================================================================

export const cleanupOldLogs = internalMutation({
  args: {
    olderThanDays: v.optional(v.number()),
    batchSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const olderThanDays = args.olderThanDays ?? 7;
    const batchSize = args.batchSize ?? 100;
    const cutoffMs = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;

    const stats = {
      aiRoutingLogs: 0,
      webhookDeliveries: 0,
      aiProviderHealth: 0,
    };

    // Clean aiRoutingLogs (7 day TTL)
    try {
      const oldLogs = await ctx.db
        .query('aiRoutingLogs')
        .filter((q) => q.lt(q.field('createdAt'), cutoffMs))
        .take(batchSize);

      for (const log of oldLogs) {
        await ctx.db.delete(log._id);
        stats.aiRoutingLogs++;
      }
    } catch {
      // Ignore if table doesn't exist
    }

    // Clean webhookDeliveries (30 day TTL, but use same cutoff for now)
    try {
      const oldDeliveries = await ctx.db
        .query('webhookDeliveries')
        .filter((q) => q.lt(q.field('createdAt'), cutoffMs))
        .take(batchSize);

      for (const delivery of oldDeliveries) {
        await ctx.db.delete(delivery._id);
        stats.webhookDeliveries++;
      }
    } catch {
      // Ignore if table doesn't exist
    }

    // Clean aiProviderHealth (24 hour TTL - check lastHealthCheckAt)
    const healthCutoff = Date.now() - 24 * 60 * 60 * 1000;
    try {
      const oldHealth = await ctx.db
        .query('aiProviderHealth')
        .filter((q) => q.lt(q.field('lastHealthCheckAt'), healthCutoff))
        .take(batchSize);

      for (const health of oldHealth) {
        await ctx.db.delete(health._id);
        stats.aiProviderHealth++;
      }
    } catch {
      // Ignore if table doesn't exist
    }

    const totalDeleted = Object.values(stats).reduce((a, b) => a + b, 0);
    const hasMore = totalDeleted === batchSize * 3; // Rough check if more to delete

    return {
      deleted: stats,
      totalDeleted,
      hasMore,
      cutoffDate: new Date(cutoffMs).toISOString(),
    };
  },
});

// ============================================================================
// Full Cleanup - Combines all cleanup operations
// ============================================================================

export const runFullCleanup = internalMutation({
  args: {
    olderThanDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const olderThanDays = args.olderThanDays ?? 7;

    // 1. Clear legacy auth
    const legacyResult = await ctx.runMutation(
      // @ts-expect-error - internal reference
      { table: 'admin/cleanupDatabase', name: 'clearLegacyAuth' },
      {}
    );

    // 2. Clean old logs
    const logsResult = await ctx.runMutation(
      // @ts-expect-error - internal reference
      { table: 'admin/cleanupDatabase', name: 'cleanupOldLogs' },
      { olderThanDays }
    );

    return {
      legacy: legacyResult,
      logs: logsResult,
      completedAt: new Date().toISOString(),
    };
  },
});
