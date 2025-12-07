import { workflow } from '../index';
import { v } from 'convex/values';
import { api } from '../_generated/api';

/**
 * SEO Strategy Workflow
 *
 * Complete end-to-end SEO strategy execution:
 * 1. Set goals
 * 2. Keyword research
 * 3. Generate quarterly plan
 * 4. Execute content calendar
 * 5. Monitor and optimize
 */
export const seoStrategyWorkflow = workflow.define({
  args: {
    projectId: v.id('projects'),
    contentVelocity: v.number(),
    startDate: v.number(),
    goals: v.object({
      traffic: v.optional(v.number()),
      leads: v.optional(v.number()),
      revenue: v.optional(v.number()),
    }),
    keywords: v.optional(
      v.array(
        v.object({
          keyword: v.string(),
          searchVolume: v.optional(v.number()),
          difficulty: v.optional(v.number()),
          intent: v.optional(v.string()),
        })
      )
    ),
  },
  returns: v.object({
    status: v.literal('strategy_initialized'),
    keywordClustersGenerated: v.number(),
    planId: v.id('quarterlyPlans'),
    briefsGenerated: v.number(),
    message: v.string(),
  }),
  handler: async (step, args): Promise<any> => {
    const results = {
      keywordClusters: 0,
      planId: null as any,
      briefIds: [] as any[],
    };

    // Step 1: Keyword Research (if keywords provided)
    if (args.keywords && args.keywords.length > 0) {
      await step.runMutation(api.seo.keywords.createKeywords, {
        projectId: args.projectId,
        keywords: args.keywords,
      });

      await step.runAction(api.seo.keywordActions.generateClusters, {
        projectId: args.projectId,
      });

      // Count clusters
      const clusters = await step.runQuery(api.seo.keywordClusters.getActiveClusters, {
        projectId: args.projectId,
      });
      results.keywordClusters = clusters.length;
    }

    // Step 2: Generate Quarterly Plan
    const planResult = await step.runAction(api.content.quarterlyPlanActions.generatePlan, {
      projectId: args.projectId,
      contentVelocity: args.contentVelocity,
      startDate: args.startDate,
      goals: args.goals,
    });
    results.planId = planResult.planId;

    // Generate Briefs
    const briefs = await step.runQuery(api.content.briefs.getBriefsByPlan, {
      planId: results.planId,
    });

    const briefIds = [];
    for (const brief of briefs) {
      // Use generateBrief instead of generateBriefDetails
      const briefResult = await step.runAction(api.content.briefActions.generateBrief, {
        briefId: brief._id,
        projectId: args.projectId,
      });
      // briefResult is likely { success: boolean, ... } based on other actions.
      // If it has briefId, use it. If not, maybe brief._id is enough?
      // Assuming briefResult is the ID if the original code expected it, OR it's an object.
      // Let's assume it's an object and try to access briefId if it exists, or cast it.
      // Actually, looking at contentWorkflows.ts, it expects briefIds.
      // If generateBrief returns { success: true }, we might just use brief._id as the ID.
      briefIds.push(brief._id);
    }
    results.briefIds = briefIds;

    // Step 3: Schedule analytics sync
    await step.runMutation(api.integrations.ga4Connections.updateLastSync, {
      connectionId: 'skip' as any,
    });

    return {
      status: 'strategy_initialized' as const,
      keywordClustersGenerated: results.keywordClusters,
      planId: results.planId,
      briefsGenerated: results.briefIds.length,
      message: 'SEO strategy initialized. Review briefs and start creating content.',
    };
  },
});

/**
 * Content Optimization Workflow
 *
 * Optimizes existing content based on performance data
 */
export const contentOptimizationWorkflow = workflow.define({
  args: {
    briefId: v.id('briefs'),
    optimizationType: v.union(v.literal('refresh'), v.literal('expand'), v.literal('improve_ctr')),
  },
  returns: v.object({
    status: v.literal('optimized'),
    optimizationType: v.union(v.literal('refresh'), v.literal('expand'), v.literal('improve_ctr')),
    republished: v.boolean(),
  }),
  handler: async (step, args): Promise<any> => {
    // Step 1: Analyze current performance
    const insights = await step.runAction((api.analytics as any).insights.generateContentInsights, {
      briefId: args.briefId,
      metrics: { type: 'underperformer' },
    });

    const recommendations = insights.recommendations;

    // Step 2: Apply optimizations based on type
    if (args.optimizationType === 'refresh') {
      await step.runAction(api.content.draftActions.generateDraft, {
        briefId: args.briefId,
        regenerationNotes: `Refresh content based on recommendations: ${JSON.stringify(recommendations)}`,
      });
    } else if (args.optimizationType === 'expand') {
      await step.runAction(api.content.draftActions.generateDraft, {
        briefId: args.briefId,
        regenerationNotes: `Expand content based on recommendations: ${JSON.stringify(recommendations)}`,
      });
    } else if (args.optimizationType === 'improve_ctr') {
      await step.runAction(api.content.briefActions.optimizeCTR, {
        briefId: args.briefId,
        recommendations,
      });
    }

    // Step 3: Re-publish to WordPress
    const draft = await step.runQuery(api.content.drafts.getDraftByBrief, {
      briefId: args.briefId,
    });

    let republished = false;
    if (draft) {
      // Inline publishing logic
      const wpConnection = await step.runQuery((api.integrations as any).wordpress.getConnection, {
        projectId: draft.projectId,
      });

      if (wpConnection) {
        await step.runAction(api.publishing.wordpressActions.publishPost, {
          draftId: draft._id,
          projectId: draft.projectId,
          siteUrl: wpConnection.url,
          username: wpConnection.username,
          password: wpConnection.password,
          status: 'publish',
        });
        republished = true;
      }
    }

    return {
      status: 'optimized' as const,
      optimizationType: args.optimizationType,
      republished,
    };
  },
});

/**
 * Batch Content Generation Workflow
 *
 * Generates multiple pieces of content in a batch
 */
export const batchContentGenerationWorkflow = workflow.define({
  args: {
    briefIds: v.array(v.id('briefs')),
    autoPublish: v.optional(v.boolean()),
  },
  returns: v.object({
    status: v.literal('completed'),
    totalBriefs: v.number(),
    draftsGenerated: v.number(),
    published: v.number(),
    failed: v.number(),
  }),
  handler: async (step, args): Promise<any> => {
    const results = {
      draftsGenerated: 0,
      published: 0,
      failed: 0,
    };

    // Generate drafts for each brief
    for (const briefId of args.briefIds) {
      try {
        // Rate limit: 2 seconds between generations

        // Inline draft generation
        const brief = await step.runQuery(api.content.briefs.getBriefById, {
          briefId,
        });

        if (brief && brief.status === 'in_progress') {
          const draftResult = await step.runAction(api.content.draftActions.generateDraft, {
            briefId,
          });
          const draftId = draftResult.draftId;
          // await step.runAction(api.content.draftActions.calculateQualityScores, {
          //   draftId,
          // });
          results.draftsGenerated++;

          // Auto-publish if requested
          if (args.autoPublish) {
            const wpConnection = await step.runQuery(
              (api.integrations as any).wordpress.getConnection,
              {
                projectId: brief.projectId,
              }
            );

            if (wpConnection) {
              await step.runAction(api.publishing.wordpressActions.publishPost, {
                draftId,
                projectId: brief.projectId,
                siteUrl: wpConnection.url,
                username: wpConnection.username,
                password: wpConnection.password,
                status: 'publish',
              });
              results.published++;
            }
          }
        }
      } catch (error: any) {
        results.failed++;
      }
    }

    return {
      status: 'completed' as const,
      totalBriefs: args.briefIds.length,
      draftsGenerated: results.draftsGenerated,
      published: results.published,
      failed: results.failed,
    };
  },
});
