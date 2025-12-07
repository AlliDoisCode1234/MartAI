'use node';
import { internalAction } from '../_generated/server';
import { v } from 'convex/values';
import { api, internal } from '../_generated/api';

export const syncProjectData = internalAction({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const projectId = args.projectId;
    const now = Date.now();
    // Default to last 30 days
    const endDate = new Date(now).toISOString().split('T')[0];
    const startDate = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // 1. Fetch Connections
    const ga4Connection = await ctx.runQuery(api.integrations.ga4Connections.getGA4Connection, {
      projectId,
    });
    const gscConnection = await ctx.runQuery(api.integrations.gscConnections.getGSCConnection, {
      projectId,
    });

    let ga4Data = null;
    let gscData = null;

    // 2. Fetch GA4 Data
    if (ga4Connection) {
      try {
        const raw = (await ctx.runAction(internal.integrations.google.fetchGA4Metrics, {
          connectionId: ga4Connection._id,
          projectId,
          propertyId: ga4Connection.propertyId,
          accessToken: ga4Connection.accessToken,
          refreshToken: ga4Connection.refreshToken,
          startDate,
          endDate,
        })) as { rows?: Array<{ metricValues: Array<{ value: string }> }> }; // Cast recursive type

        // Parse GA4 Response structure
        if (raw.rows && raw.rows.length > 0) {
          const row = raw.rows[0];
          ga4Data = {
            sessions: parseInt(row.metricValues[0].value || '0'),
            users: parseInt(row.metricValues[1].value || '0'),
          };
        }
        await ctx.runMutation(api.integrations.ga4Connections.updateLastSync, {
          connectionId: ga4Connection._id,
        });
      } catch (e) {
        console.error(`GA4 Sync Failed for project ${projectId}:`, e);
      }
    }

    // 3. Fetch GSC Data
    if (gscConnection) {
      try {
        // GSC aggregate query usually returns rows
        const raw = (await ctx.runAction(internal.integrations.google.fetchGSCMetrics, {
          connectionId: gscConnection._id,
          siteUrl: gscConnection.siteUrl,
          accessToken: gscConnection.accessToken,
          refreshToken: gscConnection.refreshToken,
          startDate,
          endDate,
        })) as {
          rows?: Array<{ clicks?: number; impressions?: number; ctr?: number; position?: number }>;
        }; // Cast recursive type

        // Parse GSC Response
        // { rows: [ { clicks, impressions, ctr, position } ] }
        if (raw.rows && raw.rows.length > 0) {
          const row = raw.rows[0];
          gscData = {
            clicks: row.clicks || 0,
            impressions: row.impressions || 0,
            ctr: row.ctr || 0,
            position: row.position || 0,
          };
        }
        await ctx.runMutation(api.integrations.gscConnections.updateLastSync, {
          connectionId: gscConnection._id,
        });
      } catch (e) {
        console.error(`GSC Sync Failed for project ${projectId}:`, e);
      }
    }

    // 4. Save Data (Upsert to analyticsData)
    if (ga4Data) {
      await ctx.runMutation(api.analytics.analytics.storeAnalyticsData, {
        projectId,
        date: now,
        source: 'ga4',
        sessions: ga4Data.sessions,
        leads: 0, // Placeholder
        revenue: 0, // Placeholder
      });

      // Simple Insight: Low Traffic
      if (ga4Data.sessions < 100) {
        await ctx.runMutation(api.analytics.analytics.storeInsight, {
          projectId,
          type: 'underperformer',
          title: 'Low Organic Traffic',
          description: `Only ${ga4Data.sessions} sessions detected in the last 30 days. Consider publishing more content.`,
          action: 'Plan Content',
          metadata: { sessions: ga4Data.sessions },
        });
      }
    }

    if (gscData) {
      await ctx.runMutation(api.analytics.analytics.storeAnalyticsData, {
        projectId,
        date: now, // We are saving "Sync Date" as the data point for trend tracking
        source: 'gsc',
        clicks: gscData.clicks,
        impressions: gscData.impressions,
        ctr: gscData.ctr,
        avgPosition: gscData.position,
      });

      // Simple Insight: High Impressions, Low CTR
      if (gscData.impressions > 1000 && gscData.ctr < 1) {
        await ctx.runMutation(api.analytics.analytics.storeInsight, {
          projectId,
          type: 'quick_win',
          title: 'High Impressions, Low CTR',
          description:
            'You are ranking but not getting clicks. Improve your meta titles and descriptions.',
          action: 'Optimize Metadata',
          metadata: { ctr: gscData.ctr, impressions: gscData.impressions },
        });
      }
    }

    // RETURNING DATA FOR VERIFICATION
    return { ga4Data, gscData };
  },
});
