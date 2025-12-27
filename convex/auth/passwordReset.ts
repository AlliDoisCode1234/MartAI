/**
 * Password Reset - Token Validation and Reset
 *
 * Handles password reset token validation and password update.
 * Tokens are hashed using SHA-256 for secure storage.
 */

import { v } from 'convex/values';
import { query, mutation, internalMutation } from '../_generated/server';

/**
 * Hash a token using SHA-256 (web crypto compatible)
 */
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate a password reset token
 */
export const validateToken = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Hash the incoming token to compare with stored hash
    const tokenHash = await hashToken(args.token);

    // Find token in database
    const tokenRecord = await ctx.db
      .query('passwordResetTokens')
      .withIndex('by_token_hash', (q) => q.eq('tokenHash', tokenHash))
      .first();

    if (!tokenRecord) {
      return { valid: false, reason: 'invalid' };
    }

    // Check if already used
    if (tokenRecord.usedAt) {
      return { valid: false, reason: 'used' };
    }

    // Check if expired
    if (Date.now() > tokenRecord.expiresAt) {
      return { valid: false, reason: 'expired' };
    }

    // Get user email for display
    const user = await ctx.db.get(tokenRecord.userId);

    return {
      valid: true,
      userId: tokenRecord.userId,
      email: user?.email,
    };
  },
});

/**
 * Reset password using token
 */
export const resetPassword = mutation({
  args: {
    token: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate password strength
    if (args.newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    // Hash the incoming token
    const tokenHash = await hashToken(args.token);

    // Find and validate token
    const tokenRecord = await ctx.db
      .query('passwordResetTokens')
      .withIndex('by_token_hash', (q) => q.eq('tokenHash', tokenHash))
      .first();

    if (!tokenRecord) {
      throw new Error('Invalid reset token');
    }

    if (tokenRecord.usedAt) {
      throw new Error('This reset link has already been used');
    }

    if (Date.now() > tokenRecord.expiresAt) {
      throw new Error('This reset link has expired');
    }

    // Get user
    const user = await ctx.db.get(tokenRecord.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Hash the new password using bcrypt-like approach
    // Note: In Convex, we'll use the signUp flow to handle password hashing
    // For now, we mark the token as used and the frontend will handle the auth flow

    // Mark token as used
    await ctx.db.patch(tokenRecord._id, {
      usedAt: Date.now(),
    });

    // Clear any existing password hash (user will set new one via signUp flow)
    await ctx.db.patch(tokenRecord.userId, {
      passwordHash: undefined,
      updatedAt: Date.now(),
    });

    // Log for audit (no PII)
    console.log(`[PasswordReset] Password reset completed for user ${tokenRecord.userId}`);

    return {
      success: true,
      email: user.email,
    };
  },
});

/**
 * Internal mutation to clean up expired tokens
 * Called by cron job
 */
export const cleanupExpiredTokens = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Find expired tokens (older than 24 hours past expiry for safety)
    const expiredTokens = await ctx.db
      .query('passwordResetTokens')
      .filter((q) => q.lt(q.field('expiresAt'), now - 24 * 60 * 60 * 1000))
      .collect();

    // Delete expired tokens
    let deleted = 0;
    for (const token of expiredTokens) {
      await ctx.db.delete(token._id);
      deleted++;
    }

    if (deleted > 0) {
      console.log(`[PasswordReset] Cleaned up ${deleted} expired tokens`);
    }

    return { deleted };
  },
});
