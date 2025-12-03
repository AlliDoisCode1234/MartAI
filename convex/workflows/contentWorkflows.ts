import { workflow } from '../index';
import { v } from 'convex/values';
import { api } from '../_generated/api';

/**
 * Content Creation Workflow
 *
 * Steps:
 * 1. Generate Quarterly Plan
 * 2. Generate Briefs for each week
 * 3. Generate Drafts from briefs
 * 4. Approve drafts
 * 5. Publish to WordPress
 * 6. Track performance
 */
export const contentCreationWorkflow = workflow.define({
  args: {
    projectId: v.id('projects'),
    contentVelocity: v.number(), // posts per week
    startDate: v.number(),
    goals: v.optional(
      v.object({
        traffic: v.optional(v.number()),
        leads: v.optional(v.number()),
        revenue: v.optional(v.number()),
      })
    ),
  },
  returns: v.object({
    planId: v.id('quarterlyPlans'),
    briefIds: v.array(v.id('briefs')),
    status: v.literal('briefs_generated'),
    message: v.string(),
  }),
  handler: async (step, args): Promise<any> => {
    // Step 1: Generate Quarterly Plan
    const planResult = await step.runAction(api.content.quarterlyPlanActions.generatePlan, {
      projectId: args.projectId,
      contentVelocity: args.contentVelocity,
      startDate: args.startDate,
      goals: args.goals,
    });
    const planId = planResult.planId;

    // Step 2: Generate Briefs (in batches to avoid rate limits)
    const briefs = await step.runQuery(api.content.briefs.getBriefsByPlan, {
      planId,
    });

    const briefIds = [];
    for (const brief of briefs) {
      // Wait between brief generations to respect rate limits
      // Note: We rely on workflow retries if rate limited

      const briefResult = await step.runAction(api.content.briefActions.generateBrief, {
        briefId: brief._id,
        projectId: args.projectId,
      });

      // Assuming briefResult is the ID or we use brief._id
      briefIds.push(brief._id);
    }

    // Step 3: Wait for user review (workflow can be paused here)
    // This is where the user would review and edit briefs in the UI
    // The workflow continues when user approves

    return {
      planId,
      briefIds,
      status: 'briefs_generated' as const,
      message: 'Briefs generated. Review and approve to continue.',
    };
  },
});

/**
 * Draft Generation Workflow
 *
 * Generates a draft from an approved brief
 */
export const draftGenerationWorkflow = workflow.define({
  args: {
    briefId: v.id('briefs'),
  },
  returns: v.object({
    draftId: v.id('drafts'),
    status: v.literal('draft_generated'),
    message: v.string(),
  }),
  handler: async (step, args): Promise<any> => {
    // Step 1: Validate brief is ready
    const brief = await step.runQuery(api.content.briefs.getBriefById, {
      briefId: args.briefId,
    });

    if (!brief || brief.status !== 'in_progress') {
      throw new Error("Brief must be in 'in_progress' status");
    }

    // Step 2: Generate draft
    const draftResult = await step.runAction(api.content.draftActions.generateDraft, {
      briefId: args.briefId,
    });
    const draftId = draftResult.draftId;

    // Step 3: Calculate quality scores
    // await step.runAction(api.content.draftActions.calculateQualityScores, {
    //   draftId,
    // });

    return {
      draftId,
      status: 'draft_generated' as const,
      message: 'Draft generated. Review and approve to publish.',
    };
  },
});

/**
 * Publishing Workflow
 *
 * Publishes an approved draft to WordPress
 */
export const publishingWorkflow = workflow.define({
  args: {
    draftId: v.id('drafts'),
    publishDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    categories: v.optional(v.array(v.string())),
  },
  returns: v.object({
    scheduledPostId: v.id('scheduledPosts'),
    status: v.union(v.literal('scheduled'), v.literal('published')),
    publishDate: v.number(),
  }),
  handler: async (step, args): Promise<any> => {
    // Step 1: Validate draft is approved
    const draft = await step.runQuery(api.content.drafts.getDraftById, {
      draftId: args.draftId,
    });

    if (!draft || draft.status !== 'approved') {
      throw new Error('Draft must be approved before publishing');
    }

    // Step 2: Check WordPress connection
    // We use the integration module we created
    const wpConnection = await step.runQuery((api.integrations as any).wordpress.getConnection, {
      projectId: draft.projectId,
    });

    if (!wpConnection) {
      throw new Error('WordPress not connected. Please connect WordPress first.');
    }

    // Step 3: Schedule or publish immediately
    const publishDate = args.publishDate || Date.now();

    const scheduledPostId = await step.runMutation(
      api.publishing.scheduledPosts.createScheduledPost,
      {
        draftId: args.draftId,
        projectId: draft.projectId,
        briefId: draft.briefId,
        publishDate,
        timezone: 'UTC',
        platform: 'wordpress',
        tags: args.tags || [],
        categories: args.categories || [],
        status: publishDate > Date.now() ? 'scheduled' : 'publishing',
      }
    );

    // Step 4: If immediate publish, trigger publishing action
    if (publishDate <= Date.now()) {
      await step.runAction(api.publishing.wordpressActions.publishPost, {
        draftId: args.draftId,
        projectId: draft.projectId,
        siteUrl: wpConnection.url,
        username: wpConnection.username,
        password: wpConnection.password,
        status: 'publish',
      });
    }

    return {
      scheduledPostId,
      status: (publishDate > Date.now() ? 'scheduled' : 'published') as any,
      publishDate,
    };
  },
});
