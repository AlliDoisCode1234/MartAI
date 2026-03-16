/**
 * Content Generation Workflow (WF-001)
 *
 * Durable wrapper around the existing generateContentInternal pipeline.
 * Provides step-level retry, progress visibility, and crash recovery.
 *
 * Steps:
 * 1. Check rate limit + quota
 * 2. Get/create Writer Persona
 * 3. Create content piece (status: 'generating')
 * 4. Generate outline via AI
 * 5. Three-stage quality pipeline (draft → review → finalize) × up to 3 attempts
 * 6. Finalize content piece (status: 'draft')
 *
 * The quality loop stays as a single step.runAction() — splitting each AI call
 * into separate steps would create 9+ journal writes per generation.
 */

import { workflow } from '../index';
import { v } from 'convex/values';
import { internal, api } from '../_generated/api';
import { contentTypeValidator } from '../phoo/contentTypes';

export const contentGenerationWorkflow = workflow.define({
  args: {
    projectId: v.id('projects'),
    userId: v.id('users'),
    contentType: contentTypeValidator,
    title: v.string(),
    keywords: v.array(v.string()),
    clusterId: v.optional(v.id('keywordClusters')),
  },
  returns: v.object({
    contentPieceId: v.optional(v.id('contentPieces')),
    status: v.union(v.literal('completed'), v.literal('failed')),
    seoScore: v.optional(v.number()),
    message: v.string(),
  }),
  handler: async (step, args): Promise<any> => {
    const { projectId, userId, contentType, title, keywords, clusterId } = args;

    // ── Step 1: Quota check (fails fast if limit exceeded) ──────────
    try {
      await step.runMutation(api.subscriptions.subscriptions.recordUsage, {
        userId,
        metric: 'contentPieces' as const,
        amount: 1,
      });
    } catch {
      return {
        contentPieceId: undefined,
        status: 'failed' as const,
        message: 'Monthly content limit reached. Upgrade your plan for more content.',
      };
    }

    // ── Step 2: Create content piece (status: 'generating') ────────
    const contentPieceId: any = await step.runMutation(
      internal.contentGeneration.createContentPiece,
      {
        projectId,
        contentType,
        title,
        keywords,
        clusterId,
      }
    );

    // ── Step 3: Run the full generation pipeline (durable) ─────────
    // This single step wraps the entire 3-stage quality loop.
    // It calls generateContentForPiece which handles:
    //   - Persona creation
    //   - Outline generation
    //   - Draft → Review → Finalize × up to 3 attempts
    //   - Score calculation
    //   - Status update to 'draft' or 'scheduled'
    try {
      await step.runAction(internal.contentGeneration.generateContentForPiece, {
        contentPieceId,
        userId,
      });
    } catch (error) {
      // Mark piece as failed but don't crash the workflow
      await step.runMutation(internal.contentGeneration.updateContentPiece, {
        contentPieceId,
        status: 'draft',
      });

      return {
        contentPieceId,
        status: 'failed' as const,
        message: `Content generation failed: ${error instanceof Error ? error.message : 'Unknown error'}. A draft shell was created.`,
      };
    }

    // ── Step 4: Read back the final state ──────────────────────────
    const finalPiece: any = await step.runQuery(
      internal.contentGeneration.getContentPieceInternal,
      { contentPieceId }
    );

    return {
      contentPieceId,
      status: 'completed' as const,
      seoScore: finalPiece?.seoScore ?? undefined,
      message: `Article generated with ${finalPiece?.seoScore ?? 0}% SEO score.`,
    };
  },
});
