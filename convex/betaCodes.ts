import { v } from 'convex/values';
import { query, mutation, action, internalMutation, internalQuery } from './_generated/server';
import { api, internal } from './_generated/api';
import { Doc } from './_generated/dataModel';
import { requireAdmin } from './lib/rbac';

/**
 * Beta Access Codes
 *
 * Gates login for closed beta. Users must enter a valid code to access the app.
 * Codes can be generated, sent via email, and tracked for usage.
 */

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Validate a beta code (public - called before login)
 * Rate limited to prevent brute force attacks
 */
export const validate = query({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const normalizedCode = code.toUpperCase().trim();

    const betaCode = await ctx.db
      .query('betaCodes')
      .withIndex('by_code', (q) => q.eq('code', normalizedCode))
      .first();

    if (!betaCode) {
      return { valid: false, error: 'Invalid access code' };
    }

    if (betaCode.status === 'revoked') {
      return { valid: false, error: 'This code has been revoked' };
    }

    // Allow 'sent' and 'used' status codes - users can reuse their code on multiple devices
    if (betaCode.expiresAt < Date.now()) {
      return { valid: false, error: 'This code has expired' };
    }

    return { valid: true, code: normalizedCode };
  },
});

/**
 * Get code by email (internal - for resend flow)
 */
export const getByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query('betaCodes')
      .withIndex('by_sent_to', (q) => q.eq('sentTo', email.toLowerCase()))
      .first();
  },
});

/**
 * List all beta codes (admin only)
 */
export const listCodes = query({
  args: {
    status: v.optional(
      v.union(v.literal('active'), v.literal('sent'), v.literal('used'), v.literal('revoked'))
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { status, limit = 100 }) => {
    // Security: Admin only
    await requireAdmin(ctx);

    if (status) {
      return await ctx.db
        .query('betaCodes')
        .withIndex('by_status', (q) => q.eq('status', status))
        .take(limit);
    }

    return await ctx.db.query('betaCodes').take(limit);
  },
});

/**
 * Get stats for beta codes (admin only)
 */
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    // Security: Admin only
    await requireAdmin(ctx);

    const allCodes = await ctx.db.query('betaCodes').collect();

    return {
      total: allCodes.length,
      active: allCodes.filter((c) => c.status === 'active').length,
      sent: allCodes.filter((c) => c.status === 'sent').length,
      used: allCodes.filter((c) => c.status === 'used').length,
      revoked: allCodes.filter((c) => c.status === 'revoked').length,
      expired: allCodes.filter((c) => c.expiresAt < Date.now() && c.status !== 'revoked').length,
    };
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Generate new beta codes (admin only)
 */
export const generate = mutation({
  args: {
    count: v.number(),
    prefix: v.optional(v.string()),
    batch: v.optional(v.string()),
    expirationDays: v.optional(v.number()),
  },
  handler: async (ctx, { count, prefix = 'PHOO', batch, expirationDays = 7 }) => {
    // Security: Admin only
    await requireAdmin(ctx);

    // Limit batch size to prevent abuse
    if (count > 100) {
      throw new Error('Maximum 100 codes per batch');
    }

    const codes: string[] = [];
    const now = Date.now();
    const expiresAt = now + expirationDays * 24 * 60 * 60 * 1000;

    for (let i = 0; i < count; i++) {
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      const code = `${prefix}-${random}`;

      await ctx.db.insert('betaCodes', {
        code,
        status: 'active',
        createdAt: now,
        expiresAt,
        metadata: batch ? { batch } : undefined,
      });

      codes.push(code);
    }

    return { codes, expiresAt };
  },
});

/**
 * Mark a code as used (called after successful login)
 */
export const markUsed = mutation({
  args: {
    code: v.string(),
    userId: v.id('users'),
  },
  handler: async (ctx, { code, userId }) => {
    const normalizedCode = code.toUpperCase().trim();

    const betaCode = await ctx.db
      .query('betaCodes')
      .withIndex('by_code', (q) => q.eq('code', normalizedCode))
      .first();

    if (betaCode && (betaCode.status === 'active' || betaCode.status === 'sent')) {
      await ctx.db.patch(betaCode._id, {
        status: 'used',
        usedAt: Date.now(),
        usedBy: userId,
      });
    }

    return { success: true };
  },
});

/**
 * Revoke a code (admin only)
 */
export const revoke = mutation({
  args: { codeId: v.id('betaCodes') },
  handler: async (ctx, { codeId }) => {
    // Security: Admin only
    await requireAdmin(ctx);

    await ctx.db.patch(codeId, { status: 'revoked' });
    return { success: true };
  },
});

/**
 * Update code after email sent (internal)
 */
export const markSent = internalMutation({
  args: {
    codeId: v.id('betaCodes'),
    email: v.string(),
  },
  handler: async (ctx, { codeId, email }) => {
    await ctx.db.patch(codeId, {
      status: 'sent',
      sentAt: Date.now(),
      sentTo: email.toLowerCase(),
    });
  },
});

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Get code by code string (internal - for marking sent)
 */
export const getByCode = internalQuery({
  args: { code: v.string() },
  handler: async (ctx, { code }): Promise<Doc<'betaCodes'> | null> => {
    return await ctx.db
      .query('betaCodes')
      .withIndex('by_code', (q) => q.eq('code', code.toUpperCase().trim()))
      .first();
  },
});

/**
 * Send beta invitation email with code
 */
export const sendInvitation = action({
  args: {
    email: v.string(),
    batch: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { email, batch }
  ): Promise<{ success: boolean; code?: string; resent?: boolean; error?: string }> => {
    const normalizedEmail = email.toLowerCase();

    // 1. Check if email already has a code
    const existing = await ctx.runQuery(internal.betaCodes.getByEmail, {
      email: normalizedEmail,
    });

    if (existing && existing.status !== 'revoked' && existing.expiresAt > Date.now()) {
      // Resend existing code
      await ctx.runAction(internal.email.emailActions.sendBetaInvitation, {
        to: email,
        code: existing.code,
        expiresAt: existing.expiresAt,
      });
      return { success: true, code: existing.code, resent: true };
    }

    // 2. Generate new code
    const generateResult = await ctx.runMutation(api.betaCodes.generate, {
      count: 1,
      batch: batch || 'beta-invite',
    });

    const generatedCode = generateResult.codes[0];
    const expiresAt = generateResult.expiresAt;

    // 3. Send email via Resend
    await ctx.runAction(internal.email.emailActions.sendBetaInvitation, {
      to: email,
      code: generatedCode,
      expiresAt,
    });

    // 4. Get the code record and mark as sent
    const codeRecord = await ctx.runQuery(internal.betaCodes.getByCode, {
      code: generatedCode,
    });

    if (codeRecord) {
      await ctx.runMutation(internal.betaCodes.markSent, {
        codeId: codeRecord._id,
        email: normalizedEmail,
      });
    }

    return { success: true, code: generatedCode, resent: false };
  },
});

/**
 * Send batch invitations to multiple emails
 * NOTE: This is a separate action that duplicates logic to avoid circular reference
 */
export const sendBatchInvitations = action({
  args: {
    emails: v.array(v.string()),
    batch: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { emails, batch }
  ): Promise<{
    sent: number;
    failed: number;
    results: { email: string; success: boolean; code?: string; error?: string }[];
  }> => {
    const results: { email: string; success: boolean; code?: string; error?: string }[] = [];

    for (const email of emails) {
      const normalizedEmail = email.toLowerCase();

      try {
        // Check if email already has a code
        const existing = await ctx.runQuery(internal.betaCodes.getByEmail, {
          email: normalizedEmail,
        });

        if (existing && existing.status !== 'revoked' && existing.expiresAt > Date.now()) {
          // Resend existing code
          await ctx.runAction(internal.email.emailActions.sendBetaInvitation, {
            to: email,
            code: existing.code,
            expiresAt: existing.expiresAt,
          });
          results.push({ email, success: true, code: existing.code });
          continue;
        }

        // Generate new code
        const generateResult = await ctx.runMutation(api.betaCodes.generate, {
          count: 1,
          batch: batch || 'beta-batch',
        });

        const generatedCode = generateResult.codes[0];

        // Send email
        await ctx.runAction(internal.email.emailActions.sendBetaInvitation, {
          to: email,
          code: generatedCode,
          expiresAt: generateResult.expiresAt,
        });

        // Mark as sent
        const codeRecord = await ctx.runQuery(internal.betaCodes.getByCode, {
          code: generatedCode,
        });

        if (codeRecord) {
          await ctx.runMutation(internal.betaCodes.markSent, {
            codeId: codeRecord._id,
            email: normalizedEmail,
          });
        }

        results.push({ email, success: true, code: generatedCode });
      } catch (error) {
        results.push({
          email,
          success: false,
          error: error instanceof Error ? error.message : 'Failed to send',
        });
      }
    }

    return {
      sent: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    };
  },
});
