import { workflow } from '../index';
import { v } from 'convex/values';
import { api, internal } from '../_generated/api';

/**
 * Keyword Research Workflow
 *
 * Steps:
 * 1. Import keywords (CSV or GSC)
 * 2. Generate AI clusters
 * 3. Calculate impact scores
 * 4. Assign to content calendar
 */
export const keywordResearchWorkflow = workflow.define({
  args: {
    projectId: v.id('projects'),
    keywords: v.array(
      v.object({
        keyword: v.string(),
        searchVolume: v.optional(v.number()),
        difficulty: v.optional(v.number()),
        intent: v.optional(v.string()),
      })
    ),
  },
  returns: v.object({
    keywordCount: v.number(),
    clusterCount: v.number(),
    status: v.literal('clusters_generated'),
    message: v.string(),
  }),
  handler: async (
    step,
    args
  ): Promise<{
    keywordCount: number;
    clusterCount: number;
    status: 'clusters_generated';
    message: string;
  }> => {
    // Step 1: Import keywords
    const keywordIds = [];
    for (const keyword of args.keywords) {
      // We use runMutation for creating keywords
      const keywordId = await step.runMutation(api.seo.keywords.addKeywords, {
        projectId: args.projectId,
        ...keyword,
      });
      keywordIds.push(keywordId);
    }

    // Step 2: Generate AI clusters
    // Note: We rely on workflow retries if rate limited

    // Note: generateClusters returns { success: boolean, count: number }
    // We might need to fetch the clusters if we want their IDs, or update generateClusters to return IDs.
    // For now, let's assume we can query them or just proceed.
    // The original code expected clusterIds.
    // Let's check generateClusters return type in keywordActions.ts...
    // It returns { success: true, count: number }.
    // So we can't get clusterIds directly from it.
    // We'll query for active clusters created recently or just all active clusters.

    await step.runAction(api.seo.keywordActions.generateClusters, {
      projectId: args.projectId,
    });

    // Fetch clusters to calculate impact scores
    // This is a bit loose (fetching all active clusters), but fits the current logic structure
    const clusters = await step.runQuery(api.seo.keywordClusters.getActiveClusters, {
      projectId: args.projectId,
    });

    // Step 3: Calculate impact scores for each cluster
    // We can use the bulk rerank action/mutation
    await step.runMutation(api.seo.keywordClusters.rerankClusters, {
      projectId: args.projectId,
    });

    return {
      keywordCount: keywordIds.length,
      clusterCount: clusters.length,
      status: 'clusters_generated',
      message: 'Keyword clusters generated. Review and refine as needed.',
    };
  },
});

/**
 * GSC Import Workflow
 *
 * Imports keywords from Google Search Console
 */
export const gscImportWorkflow = workflow.define({
  args: {
    projectId: v.id('projects'),
    dateRange: v.object({
      startDate: v.string(), // YYYY-MM-DD
      endDate: v.string(), // YYYY-MM-DD
    }),
  },
  returns: v.object({
    keywordCount: v.number(),
    clusterCount: v.number(),
    status: v.literal('clusters_generated'),
    message: v.string(),
    source: v.literal('google_search_console'),
    dateRange: v.object({
      startDate: v.string(),
      endDate: v.string(),
    }),
  }),
  handler: async (
    step,
    args
  ): Promise<{
    keywordCount: number;
    clusterCount: number;
    status: 'clusters_generated';
    message: string;
    source: 'google_search_console';
    dateRange: { startDate: string; endDate: string };
  }> => {
    // Step 1: Fetch GSC data
    const gscData = await step.runAction(api.integrations.gsc.fetchKeywordData, {
      projectId: args.projectId,
      dateRange: args.dateRange,
    });

    // Step 2: Import keywords
    const keywords = gscData.rows.map((row: any) => ({
      keyword: row.keys[0],
      searchVolume: row.impressions,
      difficulty: undefined, // GSC doesn't provide difficulty
      intent: undefined, // Will be determined by AI clustering
    }));

    // Step 3: Trigger keyword research workflow
    // We can call another workflow from a workflow?
    // The docs say "Workflows ... should implement most of its logic by calling out to other Convex functions."
    // Calling another workflow via `workflow.start` is possible but async (fire and forget usually).
    // But here we want to wait.
    // We can just call the logic directly or use a sub-workflow if supported.
    // The user's code used `ctx.runWorkflow`.
    // The `workflow` component might support child workflows.
    // If not, we should inline the logic or call the steps.
    // Given the refactor, I'll assume we can call the other workflow or just replicate the steps.
    // Replicating steps is safer for now to avoid "workflow within workflow" complexity if not explicitly supported as synchronous child.
    // Actually, `step.runQuery` etc are available. `step.runWorkflow` isn't standard in the basic docs I read.
    // I will inline the logic of `keywordResearchWorkflow` here or call the mutations/actions directly.

    // Inline logic of keywordResearchWorkflow:

    // 1. Create keywords
    const keywordIds = await step.runMutation(api.seo.keywords.createKeywords, {
      projectId: args.projectId,
      keywords: keywords,
    });

    // 2. Generate clusters
    await step.runAction(api.seo.keywordActions.generateClusters, {
      projectId: args.projectId,
    });

    // 3. Rerank
    await step.runMutation(api.seo.keywordClusters.rerankClusters, {
      projectId: args.projectId,
    });

    // Get count
    const clusters = await step.runQuery(api.seo.keywordClusters.getActiveClusters, {
      projectId: args.projectId,
    });

    return {
      keywordCount: keywordIds.length,
      clusterCount: clusters.length,
      status: 'clusters_generated',
      message: 'Keyword clusters generated. Review and refine as needed.',
      source: 'google_search_console',
      dateRange: args.dateRange,
    };
  },
});

/**
 * Cluster Refinement Workflow
 *
 * Re-clusters keywords based on user feedback
 */
export const clusterRefinementWorkflow = workflow.define({
  args: {
    projectId: v.id('projects'),
    clusterIds: v.array(v.id('keywordClusters')),
    action: v.union(v.literal('merge'), v.literal('split'), v.literal('recluster')),
  },
  returns: v.object({
    status: v.union(v.literal('merged'), v.literal('split'), v.literal('reclustered')),
    clusterIds: v.optional(v.array(v.id('keywordClusters'))),
    clusterId: v.optional(v.id('keywordClusters')),
  }),
  handler: async (step, args) => {
    if (args.action === 'merge') {
      // Merge multiple clusters into one
      // We need a mutation for this. Let's assume it exists or use a placeholder.
      // I'll check keywordClusters.ts later, but for now I'll assume `mergeClusters` exists or I'll add it.
      // It wasn't in the file I read earlier.
      // I'll add a TODO or use a placeholder mutation.
      // For now, I'll comment it out and throw error if not implemented.

      // const mergedClusterId = await step.runMutation(api.seo.keywordClusters.mergeClusters, {
      //   clusterIds: args.clusterIds,
      // });

      throw new Error('Merge not implemented yet');

      /*
      return {
        clusterId: mergedClusterId,
        status: 'merged',
      };
      */
    } else if (args.action === 'split') {
      // Split a cluster into multiple clusters
      const newClusterIds = await step.runAction(api.seo.keywordActions.splitCluster, {
        clusterId: args.clusterIds[0],
      });

      return {
        clusterIds: newClusterIds,
        status: 'split',
      };
    } else {
      // Re-cluster with AI
      const newClusterIds = await step.runAction(api.seo.keywordActions.reclusterKeywords, {
        clusterIds: args.clusterIds,
      });

      return {
        clusterIds: newClusterIds,
        status: 'reclustered',
      };
    }
  },
});
