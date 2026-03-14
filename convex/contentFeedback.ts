/**
 * Content Feedback — Mutations & Queries
 *
 * Component Hierarchy:
 * convex/contentFeedback.ts (backend mutations)
 *
 * Phase 3: Persona learning from explicit and implicit feedback signals.
 * Stores per-project signals that feed into the AI persona context.
 *
 * RULES:
 * 1. All mutations are auth-gated
 * 2. Feedback capped at 50 most recent per project (BILL: storage cost control)
 * 3. No PII in feedback — only signal types and numeric deltas
 */

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { getAuthUserId } from '@convex-dev/auth/server';

// Shared feedback type validator
const feedbackTypeValidator = v.union(
  v.literal('tone_too_formal'),
  v.literal('tone_too_casual'),
  v.literal('too_verbose'),
  v.literal('too_concise'),
  v.literal('wrong_keywords'),
  v.literal('good_content'),
  v.literal('suggestion_accepted'),
  v.literal('suggestion_dismissed'),
  v.literal('custom'),
);

/** Max feedback signals stored per project (BILL: cost cap) */
const MAX_SIGNALS_PER_PROJECT = 50;

// ============================================================================
// Mutations
// ============================================================================

/**
 * Submit explicit feedback on a coaching suggestion.
 * Called when user clicks thumbs-up, thumbs-down, or "doesn't apply."
 */
export const submitFeedback = mutation({
  args: {
    projectId: v.id('projects'),
    contentPieceId: v.optional(v.id('contentPieces')),
    feedbackType: feedbackTypeValidator,
    suggestionId: v.optional(v.string()),
    customNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const user = await ctx.db.get(userId);
    if (!user) throw new Error('User not found');

    // Enforce per-project cap: delete oldest if at limit
    const existing = await ctx.db
      .query('contentFeedback')
      .withIndex('by_user_project', (q) =>
        q.eq('userId', user._id).eq('projectId', args.projectId)
      )
      .order('asc')
      .collect();

    if (existing.length >= MAX_SIGNALS_PER_PROJECT) {
      const toDelete = existing.slice(0, existing.length - MAX_SIGNALS_PER_PROJECT + 1);
      await Promise.all(toDelete.map((doc) => ctx.db.delete(doc._id)));
    }

    return await ctx.db.insert('contentFeedback', {
      userId: user._id,
      projectId: args.projectId,
      contentPieceId: args.contentPieceId,
      feedbackType: args.feedbackType,
      suggestionId: args.suggestionId,
      customNote: args.customNote,
      timestamp: Date.now(),
    });
  },
});

/**
 * Record implicit edit delta after coaching was shown.
 * Called when user makes edits after seeing suggestions (snapshot before/after).
 */
export const recordImplicitSignal = mutation({
  args: {
    projectId: v.id('projects'),
    contentPieceId: v.optional(v.id('contentPieces')),
    feedbackType: feedbackTypeValidator,
    suggestionId: v.optional(v.string()),
    editDelta: v.object({
      readabilityBefore: v.number(),
      readabilityAfter: v.number(),
      wordCountBefore: v.number(),
      wordCountAfter: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const user = await ctx.db.get(userId);
    if (!user) throw new Error('User not found');

    // Enforce per-project cap
    const existing = await ctx.db
      .query('contentFeedback')
      .withIndex('by_user_project', (q) =>
        q.eq('userId', user._id).eq('projectId', args.projectId)
      )
      .order('asc')
      .collect();

    if (existing.length >= MAX_SIGNALS_PER_PROJECT) {
      const toDelete = existing.slice(0, existing.length - MAX_SIGNALS_PER_PROJECT + 1);
      await Promise.all(toDelete.map((doc) => ctx.db.delete(doc._id)));
    }

    return await ctx.db.insert('contentFeedback', {
      userId: user._id,
      projectId: args.projectId,
      contentPieceId: args.contentPieceId,
      feedbackType: args.feedbackType,
      suggestionId: args.suggestionId,
      editDelta: args.editDelta,
      timestamp: Date.now(),
    });
  },
});

// ============================================================================
// Queries
// ============================================================================

/**
 * Get aggregated persona signals for a project.
 * Returns the 50 most recent feedback entries, newest first.
 * Used to build persona context for AI-driven content suggestions.
 */
export const getPersonaSignals = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const user = await ctx.db.get(userId);
    if (!user) return [];

    const signals = await ctx.db
      .query('contentFeedback')
      .withIndex('by_user_project', (q) =>
        q.eq('userId', user._id).eq('projectId', args.projectId)
      )
      .order('desc')
      .take(MAX_SIGNALS_PER_PROJECT);

    return signals;
  },
});
