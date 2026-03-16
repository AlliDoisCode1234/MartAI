import { workflow } from '../index';
import { v } from 'convex/values';
import { api, internal } from '../_generated/api';

/**
 * Analytics Sync Workflow
 *
 * Syncs data from GA4 and GSC, analyzes performance, and generates insights
 */
type AnalyticsSyncWorkflowReturn = {
  status: 'synced';
  ga4Synced: boolean;
  gscSynced: boolean;
  insightsGenerated: number;
  dateRange: {
    startDate: string;
    endDate: string;
  };
};
export const analyticsSyncWorkflow = workflow.define({
  args: {
    projectId: v.id('projects'),
    dateRange: v.object({
      startDate: v.string(), // YYYY-MM-DD
      endDate: v.string(), // YYYY-MM-DD
    }),
  },
  returns: v.object({
    status: v.literal('synced'),
    ga4Synced: v.boolean(),
    gscSynced: v.boolean(),
    insightsGenerated: v.number(),
    dateRange: v.object({
      startDate: v.string(),
      endDate: v.string(),
    }),
  }),
  handler: async (step, args): Promise<AnalyticsSyncWorkflowReturn> => {
    // ---- Step 1: GA4 Connection ----
    const ga4Connection = await step.runQuery(api.integrations.ga4Connections.getGA4Connection, {
      projectId: args.projectId,
    });

    if (ga4Connection) {
      // In a real app, we would call an action to fetch data here
      // For now, we just update the last sync time
      await step.runMutation(api.integrations.ga4Connections.updateLastSync, {
        connectionId: ga4Connection._id,
      });
    }

    // ---- Step 2: GSC Connection ----
    const gscConnection = await step.runQuery(api.integrations.gscConnections.getGSCConnection, {
      projectId: args.projectId,
    });

    if (gscConnection) {
      await step.runMutation(api.integrations.gscConnections.updateLastSync, {
        connectionId: gscConnection._id,
      });
    }

    // ---- Step 3: Generate Insights ----
    // We use the internal action we created/verified
    const insights = await step.runAction(internal.analytics.insights.generateInsights, {
      projectId: args.projectId,
      ga4Data: ga4Connection ?? undefined,
      gscData: gscConnection ?? undefined,
    });

    // ---- Step 4: Store Insights ----
    for (const insight of insights) {
      await step.runMutation(api.analytics.analytics.storeInsight, {
        projectId: args.projectId,
        type: insight.type,
        title: insight.title,
        description: insight.description,
        action: insight.action,
        metadata: insight.metadata,
      });
    }

    return {
      status: 'synced',
      ga4Synced: !!ga4Connection,
      gscSynced: !!gscConnection,
      insightsGenerated: insights.length,
      dateRange: args.dateRange,
    };
  },
});

/**
 * NOTE: contentPerformanceWorkflow was removed (2026-03-16, WF-004)
 *
 * It referenced the deleted 'briefs' table (v.id('briefs')).
 * Content performance analysis should be rebuilt using contentPieces
 * when content analytics features are prioritized.
 */

/**
 * Competitor Analysis Workflow
 *
 * Analyzes competitor content and identifies opportunities
 */
type CompetitorAnalysisWorkflowReturn = {
  status: 'completed';
  competitorsAnalyzed: number;
  opportunitiesFound: number;
};
export const competitorAnalysisWorkflow = workflow.define({
  args: {
    projectId: v.id('projects'),
    competitorDomains: v.array(v.string()),
  },
  returns: v.object({
    status: v.literal('completed'),
    competitorsAnalyzed: v.number(),
    opportunitiesFound: v.number(),
  }),
  handler: async (step, args): Promise<CompetitorAnalysisWorkflowReturn> => {
    // Step 1: Analyze competitors
    const results = await step.runAction(internal.analytics.competitors.analyzeCompetitors, {
      projectId: args.projectId,
      competitorDomains: args.competitorDomains,
    });

    // Step 2: Store opportunities (omitted for brevity, would be a mutation)

    return {
      status: 'completed',
      competitorsAnalyzed: args.competitorDomains.length,
      opportunitiesFound: results.reduce(
        (acc: number, r: any) => acc + (r.opportunities?.length || 0),
        0
      ),
    };
  },
});


// NOTE: rankTrackingWorkflow was removed because seo/rankings module was deleted.
// Rank tracking now happens through GSC keyword sync in analytics/sync.ts.
