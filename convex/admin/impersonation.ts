/**
 * Impersonation Mutations & Queries
 *
 * Allows super_admins to impersonate users for debugging.
 *
 * Security:
 * - super_admin role required
 * - 1 hour max session duration
 * - Full audit logging
 * - Cannot impersonate other super_admins
 */

import { v } from 'convex/values';
import { mutation, query, internalMutation } from '../_generated/server';
import { Id } from '../_generated/dataModel';
import { rateLimits } from '../rateLimits';

// Session duration: 1 hour
const SESSION_DURATION_MS = 60 * 60 * 1000;

/**
 * Start impersonating a user.
 * Creates an active impersonation session.
 */
export const startImpersonation = mutation({
  args: {
    targetUserId: v.id('users'),
    reason: v.optional(v.string()),
    permissions: v.optional(v.union(v.literal('read_only'), v.literal('full_access'))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Get the admin user
    const adminUser = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), identity.email))
      .first();

    if (!adminUser) {
      throw new Error('Admin user not found');
    }

    // Verify super_admin role
    if (adminUser.role !== 'super_admin') {
      throw new Error('Unauthorized');
    }

    // Rate limit check - 5 impersonations per hour per admin
    // Skip in tests to avoid scheduler/component registration issues
    if (process.env.NODE_ENV !== 'test') {
      const { ok, retryAfter } = await (
        rateLimits as unknown as {
          limit: (
            ctx: unknown,
            key: string,
            opts: { key: string }
          ) => Promise<{ ok: boolean; retryAfter?: number }>;
        }
      ).limit(ctx, 'admin_impersonation', {
        key: adminUser._id,
      });
      if (!ok) {
        throw new Error(
          `Rate limit exceeded. Try again in ${Math.ceil((retryAfter ?? 60) / 60)} minutes.`
        );
      }
    }

    // Get target user
    const targetUser = await ctx.db.get(args.targetUserId);
    if (!targetUser) {
      throw new Error('Target user not found');
    }

    // Prevent impersonating other super_admins (safety measure)
    if (targetUser.role === 'super_admin' && targetUser._id !== adminUser._id) {
      throw new Error('Unauthorized');
    }

    // End any existing active sessions for this admin
    const existingSessions = await ctx.db
      .query('impersonationSessions')
      .withIndex('by_admin_active', (q) =>
        q.eq('adminUserId', adminUser._id).eq('status', 'active')
      )
      .collect();

    for (const session of existingSessions) {
      await ctx.db.patch(session._id, {
        status: 'ended',
        endedAt: Date.now(),
        endReason: 'admin_logout',
      });
    }

    // Create new impersonation session
    const now = Date.now();
    const sessionId = await ctx.db.insert('impersonationSessions', {
      adminUserId: adminUser._id,
      adminEmail: adminUser.email ?? 'unknown',
      targetUserId: args.targetUserId,
      targetEmail: targetUser.email ?? 'unknown',
      status: 'active',
      permissions: args.permissions ?? 'full_access',
      startedAt: now,
      expiresAt: now + SESSION_DURATION_MS,
      reason: args.reason,
      actionsCount: 0,
    });

    return {
      sessionId,
      targetUser: {
        id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
      },
      expiresAt: now + SESSION_DURATION_MS,
    };
  },
});

/**
 * End an impersonation session.
 */
export const endImpersonation = mutation({
  args: {
    sessionId: v.optional(v.id('impersonationSessions')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Get admin user
    const adminUser = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), identity.email))
      .first();

    if (!adminUser) {
      throw new Error('User not found');
    }

    // Find active session - either by ID or for current admin
    let session;
    if (args.sessionId) {
      session = await ctx.db.get(args.sessionId);
    } else {
      session = await ctx.db
        .query('impersonationSessions')
        .withIndex('by_admin_active', (q) =>
          q.eq('adminUserId', adminUser._id).eq('status', 'active')
        )
        .first();
    }

    if (!session) {
      return { ended: false, message: 'No active session found' };
    }

    // Verify ownership
    if (session.adminUserId !== adminUser._id) {
      throw new Error("Cannot end another admin's session");
    }

    // End the session
    await ctx.db.patch(session._id, {
      status: 'ended',
      endedAt: Date.now(),
      endReason: 'manual',
    });

    return { ended: true, message: 'Impersonation session ended' };
  },
});

/**
 * Get current active impersonation session for the logged-in admin.
 */
export const getActiveSession = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // Get admin user
    const adminUser = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), identity.email))
      .first();

    if (!adminUser) {
      return null;
    }

    // Find active session
    const session = await ctx.db
      .query('impersonationSessions')
      .withIndex('by_admin_active', (q) =>
        q.eq('adminUserId', adminUser._id).eq('status', 'active')
      )
      .first();

    if (!session) {
      return null;
    }

    // Check if expired
    if (session.expiresAt < Date.now()) {
      // Mark as expired (mutation would be needed to update, but we return expired status)
      return {
        ...session,
        isExpired: true,
      };
    }

    // Get target user details
    const targetUser = await ctx.db.get(session.targetUserId);

    return {
      sessionId: session._id,
      targetUserId: session.targetUserId,
      targetEmail: session.targetEmail,
      targetName: targetUser?.name ?? 'Unknown',
      permissions: session.permissions,
      startedAt: session.startedAt,
      expiresAt: session.expiresAt,
      reason: session.reason,
      isExpired: false,
    };
  },
});

/**
 * Get impersonation history for audit purposes.
 * Only accessible by super_admins.
 */
export const getImpersonationHistory = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const adminUser = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), identity.email))
      .first();

    if (!adminUser || adminUser.role !== 'super_admin') {
      return [];
    }

    const limit = args.limit ?? 50;
    const sessions = await ctx.db.query('impersonationSessions').order('desc').take(limit);

    return sessions.map((s) => ({
      id: s._id,
      adminEmail: s.adminEmail,
      targetEmail: s.targetEmail,
      status: s.status,
      permissions: s.permissions,
      startedAt: s.startedAt,
      endedAt: s.endedAt,
      reason: s.reason,
      actionsCount: s.actionsCount,
    }));
  },
});

/**
 * Increment action count for active session.
 * Call this from mutations that should be tracked during impersonation.
 * SECURITY: Verifies caller owns the session.
 */
export const trackImpersonationAction = mutation({
  args: {
    sessionId: v.id('impersonationSessions'),
  },
  handler: async (ctx, args) => {
    // Auth check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Get caller's user ID
    const caller = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), identity.email))
      .first();

    if (!caller) {
      throw new Error('User not found');
    }

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.status !== 'active') {
      return;
    }

    // Ownership check - only the admin who started the session can track actions
    if (session.adminUserId !== caller._id) {
      throw new Error('Unauthorized');
    }

    await ctx.db.patch(args.sessionId, {
      actionsCount: (session.actionsCount ?? 0) + 1,
    });
  },
});

/**
 * Cleanup expired impersonation sessions.
 * Called by cron job every hour.
 * INTERNAL: Not callable from client.
 */
export const cleanupExpiredSessions = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Find all active sessions that have expired
    const expiredSessions = await ctx.db
      .query('impersonationSessions')
      .withIndex('by_status', (q) => q.eq('status', 'active'))
      .collect();

    let cleanedCount = 0;
    for (const session of expiredSessions) {
      if (session.expiresAt < now) {
        await ctx.db.patch(session._id, {
          status: 'expired',
          endedAt: now,
          endReason: 'expired',
        });
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`[ImpersonationCleanup] Marked ${cleanedCount} expired sessions`);
    }

    return { cleanedCount };
  },
});
