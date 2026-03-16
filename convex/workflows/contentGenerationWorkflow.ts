/**
 * Content Generation Workflow (WF-001)
 *
 * Durable wrapper around the existing generateContentInternal pipeline.
 * Provides step-level retry, progress visibility, and crash recovery.
 *
 * Steps:
 * 1. Create content piece (status: 'generating')
 * 2. Record subscription usage (quota gate)
 * 3. Run full generation pipeline (3-stage quality loop)
 * 4. Read back final state
 *
 * CR-003: Piece creation before usage recording — if recordUsage fails,
 * the empty piece shell is harmless. But if usage recorded first and
 * creation fails, the user loses quota for nothing.
 *
 * CR-004: On-demand generation passes targetStatus:'draft' to avoid
 * getting status:'scheduled' without a scheduledDate.
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

    // ── Step 1: Create content piece FIRST (CR-003) ────────────────
    // Creating the piece before recording usage ensures we never
    // consume quota without producing a piece. An empty shell is
    // harmless — a consumed quota slot with no content is not.
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

    // ── Step 2: Quota check (CR-003: after piece creation) ─────────
    try {
      // CR-005: Use internalRecordUsage — workflow steps run in internal context
      await step.runMutation(internal.subscriptions.subscriptions.internalRecordUsage, {
        userId,
        metric: 'contentPieces' as const,
        amount: 1,
      });
    } catch {
      // Quota exceeded — clean up the empty piece shell
      await step.runMutation(internal.contentGeneration.updateContentPiece, {
        contentPieceId,
        status: 'draft',
      });

      return {
        contentPieceId,
        status: 'failed' as const,
        message: 'Monthly content limit reached. Upgrade your plan for more content.',
      };
    }

    // ── Step 3: Run the full generation pipeline (durable) ─────────
    // This single step wraps the entire 3-stage quality loop.
    // It calls generateContentForPiece which handles:
    //   - Persona creation
    //   - Outline generation
    //   - Draft -> Review -> Finalize x up to 3 attempts
    //   - Score calculation
    //   - Status update
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

    // ── Step 4: Fix status for on-demand pieces (CR-004) ───────────
    // generateContentForPiece hardcodes status:'scheduled' (designed for
    // calendar). On-demand pieces don't have scheduledDate, so they must
    // be 'draft' instead.
    const finalPiece: any = await step.runQuery(
      internal.contentGeneration.getContentPieceInternal,
      { contentPieceId }
    );

    if (finalPiece?.status === 'scheduled' && !finalPiece?.scheduledDate) {
      await step.runMutation(internal.contentGeneration.updateContentPiece, {
        contentPieceId,
        status: 'draft',
      });
    }

    return {
      contentPieceId,
      status: 'completed' as const,
      seoScore: finalPiece?.seoScore ?? undefined,
      message: `Article generated with ${finalPiece?.seoScore ?? 0}% SEO score.`,
    };
  },
});
