import { workflow } from '../index';
import { v } from 'convex/values';
import { api, internal } from '../_generated/api';

/**
 * NOTE: contentCreationWorkflow was removed (2026-01-22)
 *
 * It referenced non-existent modules:
 * - api.content.quarterlyPlanActions.generatePlan
 * - api.content.briefs.getBriefsByPlan
 * - api.content.briefActions.generateBrief
 *
 * The working content generation system uses:
 * - generateCalendar.ts → generateFullCalendar (creates contentPieces directly)
 * - contentGeneration.ts → generateContent (AI-powered article generation)
 *
 * See articleGenerationWorkflow below for the quota-enforced workflow.
 */

/**
 * NOTE: draftGenerationWorkflow was removed (2026-01-22)
 *
 * It referenced non-existent tables: briefs, drafts
 * The new system uses contentPieces directly.
 */

/**
 * NOTE: publishingWorkflow was removed (2026-01-22)
 *
 * It referenced non-existent tables: drafts
 * Publishing now works directly with contentPieces via:
 * - publishing/scheduledPosts.ts
 * - publishing/wordpressActions.ts
 */

/**
 * Article Generation Workflow
 *
 * Single-click content generation with:
 * 1. Quota enforcement (fails fast if limit exceeded)
 * 2. Writer Persona integration (brand voice)
 * 3. Quality guarantee loop (90+ SEO score)
 *
 * This workflow handles concurrent users gracefully through Convex's
 * durable execution model - each user's generation runs independently.
 */
export const articleGenerationWorkflow = workflow.define({
  args: {
    projectId: v.id('projects'),
    userId: v.id('users'),
    contentType: v.string(),
    title: v.string(),
    keywords: v.array(v.string()),
    clusterId: v.optional(v.id('keywordClusters')),
  },
  returns: v.object({
    contentPieceId: v.id('contentPieces'),
    status: v.union(v.literal('completed'), v.literal('failed')),
    seoScore: v.optional(v.number()),
    message: v.string(),
  }),
  handler: async (step, args): Promise<any> => {
    const { projectId, userId, contentType, title, keywords, clusterId } = args;

    // Step 1: Check quota FIRST (fails fast if exceeded)
    // This prevents wasted AI calls if user is at limit
    try {
      await step.runMutation(api.subscriptions.subscriptions.recordUsage, {
        userId,
        metric: 'contentPieces' as const,
        amount: 1,
      });
    } catch (error) {
      return {
        contentPieceId: undefined as any,
        status: 'failed' as const,
        message: 'Monthly content limit reached. Upgrade your plan for more content.',
      };
    }

    // Step 2: Create content piece with "generating" status
    const contentPieceId = await step.runMutation(api.contentGeneration.createContentPiece, {
      projectId,
      contentType: contentType as any,
      title,
      keywords,
      clusterId,
    });

    // Step 3: Get or create Writer Persona (brand voice for this project)
    const persona = await step.runMutation(api.ai.writerPersonas.index.getOrCreatePersonaInternal, {
      projectId,
      userId,
    });

    // Step 4: Generate outline using AI
    const outlineResult = await step.runAction(api.contentGeneration.generateOutlineAction, {
      contentPieceId,
      contentType,
      title,
      keywords,
      personaId: persona?._id,
    });

    // Step 5: Generate full content with quality loop
    // This step may retry internally to achieve 90+ score
    const contentResult = await step.runAction(api.contentGeneration.generateFullContentAction, {
      contentPieceId,
      outline: outlineResult.outline,
      contentType,
      title,
      keywords,
      personaId: persona?._id,
    });

    // Step 6: Finalize - update status to "draft"
    await step.runMutation(api.contentGeneration.updateContentPiece, {
      contentPieceId,
      status: 'draft',
      seoScore: contentResult.seoScore,
    });

    return {
      contentPieceId,
      status: 'completed' as const,
      seoScore: contentResult.seoScore,
      message: `Article generated with ${contentResult.seoScore}% SEO score.`,
    };
  },
});
