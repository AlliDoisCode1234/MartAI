import { internalMutation } from './_generated/server';
import { v } from 'convex/values';

/**
 * Cleanup orphaned auth accounts.
 * Run this from the Convex Dashboard when a user record has been manually deleted
 * but their auth identity (Google OAuth) is still cached in internal auth tables.
 */
export const cleanOrphanedAuth = internalMutation({
  args: { orphanedUserId: v.id('users') },
  handler: async (ctx, args) => {
    // 1. Find and delete their authAccounts
    const accounts = await ctx.db
      .query('authAccounts')
      .withIndex('userIdAndProvider', (q) => q.eq('userId', args.orphanedUserId))
      .collect();

    for (const account of accounts) {
      await ctx.db.delete(account._id);
    }

    // 2. Find and delete their authSessions
    const sessions = await ctx.db
      .query('authSessions')
      .withIndex('userId', (q) => q.eq('userId', args.orphanedUserId))
      .collect();

    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    // Audit log entry
    await ctx.db.insert('auditLogs', {
      action: 'auth.cleanOrphanedAuth',
      actorType: 'system',
      actorId: 'dashboard-manual',
      targetId: args.orphanedUserId,
      outcome: 'success',
      metadata: {
        deletedAccounts: accounts.length,
        deletedSessions: sessions.length,
      },
      createdAt: Date.now(),
    });

    return {
      deletedAccounts: accounts.length,
      deletedSessions: sessions.length,
      message: `Cleaned up ${accounts.length} accounts and ${sessions.length} sessions for deleted user ${args.orphanedUserId}. They can now sign in cleanly.`,
    };
  },
});
