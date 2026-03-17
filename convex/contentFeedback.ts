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
 * 1. All mutations/queries are RBAC-gated via requireProjectAccess (SEC-001-A)
 * 2. Feedback capped at 50 most recent per project (BILL: storage cost control)
 * 3. No PII in feedback — only signal types and numeric deltas
 */

import { mutation, query, internalQuery, internalMutation } from './_generated/server';
import { v } from 'convex/values';
import { requireProjectAccess } from './lib/rbac';

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
// Shared Helpers
// ============================================================================

/**
 * Enforce per-project cap then insert a feedback document.
 * Extracted to keep DRY across public + internal mutations.
 * Note: `any` types are required because Convex's ctx.db type differs
 * between mutation/internalMutation contexts — no shared interface exists.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function enforceCapAndInsert(
  ctx: { db: any },
  doc: {
    userId: any;
    projectId: any;
    contentPieceId?: any;
    feedbackType: any;
    suggestionId?: string;
    customNote?: string;
    editDelta?: {
      readabilityBefore: number;
      readabilityAfter: number;
      wordCountBefore: number;
      wordCountAfter: number;
    };
    timestamp: number;
  }
) {
  const existing = await ctx.db
    .query('contentFeedback')
    .withIndex('by_user_project', (q: any) =>
      q.eq('userId', doc.userId).eq('projectId', doc.projectId)
    )
    .order('asc')
    .collect();

  if (existing.length >= MAX_SIGNALS_PER_PROJECT) {
    const toDelete = existing.slice(0, existing.length - MAX_SIGNALS_PER_PROJECT + 1);
    await Promise.all(toDelete.map((d: any) => ctx.db.delete(d._id)));
  }

  return await ctx.db.insert('contentFeedback', doc);
}

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
    // SEC-001-A: RBAC — verify caller owns/has editor access to this project
    const { userId } = await requireProjectAccess(ctx, args.projectId, 'editor');

    return await enforceCapAndInsert(ctx, {
      userId,
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
    // SEC-001-A: RBAC — verify caller owns/has editor access to this project
    const { userId } = await requireProjectAccess(ctx, args.projectId, 'editor');

    return await enforceCapAndInsert(ctx, {
      userId,
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
    // SEC-001-A: RBAC — verify caller has at least viewer access
    let userId;
    try {
      ({ userId } = await requireProjectAccess(ctx, args.projectId, 'viewer'));
    } catch {
      // Graceful degradation: return empty array for unauthorized queries
      return [];
    }

    const signals = await ctx.db
      .query('contentFeedback')
      .withIndex('by_user_project', (q) =>
        q.eq('userId', userId).eq('projectId', args.projectId)
      )
      .order('desc')
      .take(MAX_SIGNALS_PER_PROJECT);

    return signals;
  },
});

// ============================================================================
// Internal APIs (for action/workflow context — RBAC already verified by caller)
// ============================================================================

/**
 * Internal: Get persona signals without RBAC check.
 * Used by reviseWithPersona action which has already verified project access.
 */
export const getPersonaSignalsInternal = internalQuery({
  args: {
    userId: v.id('users'),
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const signals = await ctx.db
      .query('contentFeedback')
      .withIndex('by_user_project', (q) =>
        q.eq('userId', args.userId).eq('projectId', args.projectId)
      )
      .order('desc')
      .take(MAX_SIGNALS_PER_PROJECT);

    return signals;
  },
});

/**
 * Internal: Submit feedback without RBAC check.
 * Used by reviseWithPersona action to record coaching signals.
 */
export const submitFeedbackInternal = internalMutation({
  args: {
    userId: v.id('users'),
    projectId: v.id('projects'),
    contentPieceId: v.optional(v.id('contentPieces')),
    feedbackType: feedbackTypeValidator,
    suggestionId: v.optional(v.string()),
    customNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await enforceCapAndInsert(ctx, {
      userId: args.userId,
      projectId: args.projectId,
      contentPieceId: args.contentPieceId,
      feedbackType: args.feedbackType,
      suggestionId: args.suggestionId,
      customNote: args.customNote,
      timestamp: Date.now(),
    });
  },
});
