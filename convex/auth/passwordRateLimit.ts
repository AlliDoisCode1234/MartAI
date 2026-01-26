/**
 * Password Rate Limiting
 *
 * Provides rate limiting for password verification attempts
 * to prevent brute force attacks on authenticated sessions.
 *
 * Security:
 * - 5 attempts per 15 minutes per user (OWASP recommended)
 * - Token bucket algorithm for smooth limiting
 * - Reset on successful verification
 */

import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';
import { rateLimits } from '../rateLimits';
import { ConvexError } from 'convex/values';

/**
 * Check if user can attempt password verification
 * Call this BEFORE attempting password verification
 *
 * Returns: { allowed: true } or throws RATE_LIMITED error
 */
export const checkPasswordRateLimit = mutation({
  args: {},
  returns: v.object({
    allowed: v.boolean(),
    remaining: v.optional(v.number()),
  }),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError('Not authenticated');
    }

    const userId = identity.subject;

    // Check rate limit
    const result = await rateLimits.limit(ctx, 'passwordVerification', {
      key: userId,
      throws: false, // Don't throw, we want to return custom error
    });

    if (!result.ok) {
      // retryAfter is in milliseconds
      const retryAfterMs = result.retryAfter || 900000; // 15 min default
      const retryAfterMinutes = Math.ceil(retryAfterMs / 60000);

      throw new ConvexError({
        code: 'RATE_LIMITED',
        message: `Too many password attempts. Try again in ${retryAfterMinutes} minute${retryAfterMinutes === 1 ? '' : 's'}.`,
        retryAfterMs,
        retryAfterMinutes,
      });
    }

    return {
      allowed: true,
      remaining: undefined,
    };
  },
});

/**
 * Record successful password verification
 * Call this after a successful password check to reset rate limit
 */
export const recordPasswordSuccess = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const userId = identity.subject;

    // Reset the rate limit on success
    await rateLimits.reset(ctx, 'passwordVerification', {
      key: userId,
    });

    return null;
  },
});

/**
 * Get current rate limit status (for UI display)
 */
export const getPasswordRateLimitStatus = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const userId = identity.subject;

    const status = await rateLimits.check(ctx, 'passwordVerification', {
      key: userId,
    });

    if (!status.ok) {
      const retryAfterMs = status.retryAfter || 0;
      return {
        isLimited: true,
        retryAfterMs,
        retryAfterMinutes: Math.ceil(retryAfterMs / 60000),
      };
    }

    return {
      isLimited: false,
      retryAfterMs: null,
      retryAfterMinutes: null,
    };
  },
});
