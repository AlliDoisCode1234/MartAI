/**
 * Content Revision — Secure AI Action
 *
 * Component Hierarchy:
 * convex/contentRevision.ts (backend action)
 *
 * Provides a hardened AI action for the Phoo Coach.
 * DUAL MODE:
 *   - REVISE: When content exists (>50 words), revises the existing text.
 *   - GENERATE: When content is empty/minimal (<=50 words), generates a new
 *     article from scratch using the content piece's title, keywords, and type.
 *
 * PERSONA-AWARE (COACH-H-002/003):
 *   Loads the project's writer persona and recent feedback signals, injecting
 *   them into the system prompt prefix for cache-optimized personalization.
 *   Each persona's context creates a stable cache key for Anthropic's 5-min TTL.
 *
 * SECURITY RULES:
 * 1. User instruction is capped at 2,000 characters (server-enforced).
 * 2. Content is capped at 50,000 characters to prevent token exhaustion.
 * 3. Instruction is wrapped in <untrusted_user_instruction> XML tags.
 * 4. System prompt explicitly forbids topic changes, meta-instructions,
 *    and any output unrelated to the article.
 * 5. Auth-gated — only authenticated users may call this action.
 */

import { action } from './_generated/server';
import { api, internal } from './_generated/api';
import { v } from 'convex/values';
import { getAuthUserId } from '@convex-dev/auth/server';
import { buildPersonaContext } from './ai/writerPersonas/index';
import {
  MAX_INSTRUCTION_LENGTH,
  MAX_CONTENT_LENGTH,
  GENERATE_MODE_THRESHOLD,
  HARDENED_REVISE_RULES,
  sanitizeInstruction,
  aggregateFeedbackSignals,
  countContentWords,
  buildReviseSystemPrompt,
  buildGenerateSystemPrompt,
} from '../lib/promptBuilder';

// Re-export for existing test imports
export { HARDENED_REVISE_RULES };


/**
 * Secure action: Revise OR Generate content using the Phoo Coach.
 * Automatically selects mode based on existing content word count.
 *
 * COACH-H-003: Now loads the project's writer persona and recent feedback
 * signals, injecting them into the system prompt for personalized AI output
 * and cache-optimized prompt prefixes.
 */
export const reviseWithPersona = action({
  args: {
    projectId: v.id('projects'),
    contentPieceId: v.optional(v.id('contentPieces')),
    instruction: v.string(),
    currentContent: v.string(),
    // Metadata for GENERATE mode (optional — only needed when content is empty)
    title: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
    contentType: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ revisedContent: string; tokensUsed: number; mode: string }> => {
    // ── Auth Gate ────────────────────────────────────────────────────
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    // ── SEC-001-B: Verify project access BEFORE expensive AI call ───
    await ctx.runQuery(internal.projects.projects.verifyProjectAccess, {
      projectId: args.projectId,
    });

    // ── Server-side length validation ───────────────────────────────
    if (args.instruction.length > MAX_INSTRUCTION_LENGTH) {
      throw new Error(
        `Instruction too long: ${args.instruction.length}/${MAX_INSTRUCTION_LENGTH} characters.`
      );
    }
    if (args.currentContent.length > MAX_CONTENT_LENGTH) {
      throw new Error(
        `Content too long: ${args.currentContent.length}/${MAX_CONTENT_LENGTH} characters.`
      );
    }

    // ── Sanitize: strip any XML-like tags from the user instruction ──
    const sanitizedInstruction = sanitizeInstruction(args.instruction);

    // ── COACH-H-003: Load persona + feedback signals ────────────────
    let personaContext = '';
    let feedbackContext = '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let persona: any = null;

    try {
      // Get or create the project's writer persona
      persona = await ctx.runMutation(
        internal.ai.writerPersonas.getOrCreatePersonaInternal,
        { projectId: args.projectId, userId }
      );

      if (persona) {
        personaContext = buildPersonaContext(persona);
        console.log(`[PhooCoach] Persona loaded: "${persona.name}" (${persona.status})`);
      }

      // Load recent feedback signals for this user+project
      const signals = await ctx.runQuery(
        internal.contentFeedback.getPersonaSignalsInternal,
        { userId, projectId: args.projectId }
      );

      if (signals && signals.length > 0) {
        feedbackContext = aggregateFeedbackSignals(signals);
        console.log(`[PhooCoach] Loaded ${signals.length} feedback signals`);
      }
    } catch (err) {
      // Graceful degradation: if persona/signals fail, proceed without them
      console.warn('[PhooCoach] Failed to load persona/signals, proceeding without:', err);
    }

    // ── Determine mode: GENERATE vs REVISE ──────────────────────────
    const wordCount = countContentWords(args.currentContent);
    const isGenerateMode = wordCount <= GENERATE_MODE_THRESHOLD;

    // ── Build persona-aware prompt ──────────────────────────────────
    let systemPrompt: string;
    let prompt: string;

    if (isGenerateMode) {
      const title = args.title ?? 'Untitled Article';
      const keywords = args.keywords ?? [];
      const contentType = args.contentType ?? 'blog';

      systemPrompt = buildGenerateSystemPrompt(
        sanitizedInstruction, title, keywords, contentType,
        personaContext, feedbackContext
      );
      prompt = `Write a ${contentType} article titled "${title}" about: ${sanitizedInstruction}`;
    } else {
      systemPrompt = buildReviseSystemPrompt(
        sanitizedInstruction, personaContext, feedbackContext
      );
      prompt = args.currentContent;
    }

    console.log(`[PhooCoach] System prompt length: ${systemPrompt.length} chars (~${Math.ceil(systemPrompt.length / 4)} tokens)`);

    // ── Delegate to AI Router ───────────────────────────────────────
    // Explicit type to break circular inference (Convex Trap #30)
    const result: { content: string; usage: { totalTokens: number } } =
      await ctx.runAction(api.ai.router.router.generateWithFallback, {
        prompt,
        systemPrompt,
        maxTokens: isGenerateMode ? 8192 : 4096,
        temperature: isGenerateMode ? 0.5 : 0.3,
        taskType: 'draft',
        strategy: 'balanced',
        userId,
        enableCache: true,
      });

    // ── Record feedback + update persona metrics ────────────────────
    try {
      // Use internal mutation (RBAC already verified above)
      await ctx.runMutation(internal.contentFeedback.submitFeedbackInternal, {
        userId,
        projectId: args.projectId,
        contentPieceId: args.contentPieceId,
        feedbackType: 'custom' as const,
        customNote: sanitizedInstruction,
      });

      // Update persona metrics for this AI interaction
      if (persona?._id) {
        await ctx.runMutation(internal.ai.writerPersonas.updateMetrics, {
          personaId: persona._id,
          outcome: 'edited' as const,
        });
      }
    } catch (err) {
      // Non-blocking: feedback/metrics failure should not break the revision
      console.warn('[PhooCoach] Failed to record feedback/metrics:', err);
    }

    return {
      revisedContent: result.content.length > MAX_CONTENT_LENGTH
        ? result.content.slice(0, MAX_CONTENT_LENGTH)
        : result.content,
      tokensUsed: result.usage.totalTokens,
      mode: isGenerateMode ? 'generate' : 'revise',
    };
  },
});
