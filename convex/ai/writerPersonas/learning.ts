/**
 * Writer Persona Learning Module
 *
 * Processes user feedback to evolve persona rules and preferences.
 *
 * Learning Sources:
 * 1. User edits - Extract patterns from content modifications
 * 2. Rejections - Learn what to avoid
 * 3. Approvals - Reinforce successful patterns
 * 4. Explicit rules - User-defined writing rules
 */

import { v } from 'convex/values';
import { internalMutation, internalAction, MutationCtx } from '../../_generated/server';
import { internal } from '../../_generated/api';
import { Id } from '../../_generated/dataModel';

type LearnedRuleSource = 'user_edit' | 'rejection' | 'explicit' | 'inferred';

type LearnedRule = {
  rule: string;
  source: LearnedRuleSource;
  confidence?: number;
  learnedAt: number;
  appliedCount?: number;
};

/**
 * Record content feedback and trigger learning.
 */
export const recordFeedback = internalMutation({
  args: {
    personaId: v.id('aiWriterPersonas'),
    contentPieceId: v.id('contentPieces'),
    feedback: v.union(v.literal('approved'), v.literal('edited'), v.literal('rejected')),
    originalContent: v.optional(v.string()),
    editedContent: v.optional(v.string()),
    rejectionReason: v.optional(v.string()),
    seoScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const persona = await ctx.db.get(args.personaId);
    if (!persona) return;

    // Calculate edit distance if content was edited
    let editDistance: number | undefined;
    if (args.feedback === 'edited' && args.originalContent && args.editedContent) {
      editDistance = calculateEditDistance(args.originalContent, args.editedContent);
    }

    // Update metrics
    await ctx.runMutation(internal.ai.writerPersonas.index.updateMetrics, {
      personaId: args.personaId,
      outcome: args.feedback,
      seoScore: args.seoScore,
      editDistance,
    });

    // Extract learned rules from feedback
    if (args.feedback === 'rejected' && args.rejectionReason) {
      await learnFromRejection(ctx, args.personaId, args.rejectionReason);
    }

    // For edits, we could analyze patterns (future enhancement)
    // This would require NLP to detect what was changed and why
  },
});

/**
 * Learn a rule from content rejection.
 */
async function learnFromRejection(
  ctx: MutationCtx,
  personaId: Id<'aiWriterPersonas'>,
  reason: string
) {
  const persona = (await ctx.db.get(personaId)) as {
    learnedRules?: LearnedRule[];
  } | null;
  if (!persona) return;

  // Check if similar rule already exists
  const existingRules = persona.learnedRules || [];
  const similarRule = existingRules.find((r) =>
    r.rule.toLowerCase().includes(reason.toLowerCase().slice(0, 20))
  );

  if (similarRule) {
    // Increase confidence of existing rule
    const updatedRules = existingRules.map((r) =>
      r === similarRule ? { ...r, confidence: Math.min(1, (r.confidence || 0.5) + 0.1) } : r
    );
    await ctx.db.patch(personaId, { learnedRules: updatedRules });
  } else {
    // Add new rule
    const newRule: LearnedRule = {
      rule: `Avoid: ${reason}`,
      source: 'rejection',
      confidence: 0.6,
      learnedAt: Date.now(),
      appliedCount: 0,
    };
    await ctx.db.patch(personaId, {
      learnedRules: [...existingRules, newRule],
    });
  }
}

/**
 * Calculate Levenshtein edit distance between two strings.
 * Used to measure how much a user modified content.
 */
function calculateEditDistance(original: string, edited: string): number {
  const o = original.toLowerCase();
  const e = edited.toLowerCase();

  // Simplified word-based distance for efficiency
  const originalWords = o.split(/\s+/);
  const editedWords = e.split(/\s+/);

  let changes = 0;
  const maxLen = Math.max(originalWords.length, editedWords.length);

  for (let i = 0; i < maxLen; i++) {
    if (originalWords[i] !== editedWords[i]) {
      changes++;
    }
  }

  // Return percentage of words changed
  return maxLen > 0 ? (changes / maxLen) * 100 : 0;
}

/**
 * Evolve persona based on accumulated feedback.
 * Called periodically or after significant feedback.
 */
export const evolvePersona = internalMutation({
  args: {
    personaId: v.id('aiWriterPersonas'),
  },
  handler: async (ctx, args) => {
    const persona = await ctx.db.get(args.personaId);
    if (!persona || !persona.metrics) return;

    const { metrics, learnedRules = [] } = persona;

    // Prune low-confidence rules
    const prunedRules = learnedRules.filter((r) => (r.confidence ?? 0.5) >= 0.3);

    // Identify weak areas from rejection patterns
    const weakAreas: string[] = [];
    if (metrics.rejectedCount > 0) {
      const rejectionRate = metrics.rejectedCount / metrics.totalGenerated;
      if (rejectionRate > 0.2) {
        weakAreas.push('High rejection rate - needs more training');
      }
    }

    // Identify top performing content types from rules
    const topPerformingTypes: string[] = [];
    if (metrics.approvedCount > 5) {
      topPerformingTypes.push('blog-post'); // Placeholder - would need content type tracking
    }

    // Update persona
    await ctx.db.patch(args.personaId, {
      learnedRules: prunedRules,
      metrics: {
        ...metrics,
        weakAreas,
        topPerformingTypes,
      },
      updatedAt: Date.now(),
    });
  },
});

/**
 * Bulk evolve all active personas.
 * Called by cron job weekly.
 */
export const evolveAllPersonas = internalMutation({
  args: {},
  handler: async (ctx) => {
    const activePersonas = await ctx.db
      .query('aiWriterPersonas')
      .withIndex('by_status', (q) => q.eq('status', 'active'))
      .collect();

    let evolvedCount = 0;
    for (const persona of activePersonas) {
      if (persona.metrics && persona.metrics.totalGenerated >= 5) {
        await ctx.runMutation(internal.ai.writerPersonas.learning.evolvePersona, {
          personaId: persona._id,
        });
        evolvedCount++;
      }
    }

    console.log(`[PersonaEvolution] Evolved ${evolvedCount} personas`);
    return { evolvedCount };
  },
});
