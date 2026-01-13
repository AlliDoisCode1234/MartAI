'use node';
import { action } from '../_generated/server';
import { v } from 'convex/values';
import { api, internal } from '../_generated/api';

// Type for GSC API response
type GSCRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

type GSCResponse = {
  rows?: GSCRow[];
};

/**
 * Fetch real GSC keyword data for a project
 * Uses the internal fetchGSCMetrics action which handles token refresh
 */
export const fetchKeywordData = action({
  args: {
    projectId: v.id('projects'),
    dateRange: v.object({
      startDate: v.string(),
      endDate: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    // 1. Get GSC Connection with tokens
    const connection = await ctx.runQuery(api.integrations.gscConnections.getGSCConnection, {
      projectId: args.projectId,
    });

    if (!connection) {
      throw new Error('GSC not connected');
    }

    // 2. Fetch real data from GSC API (with explicit type cast to avoid TS7022)
    const data = (await ctx.runAction(internal.integrations.google.fetchGSCMetrics, {
      connectionId: connection._id,
      siteUrl: connection.siteUrl,
      accessToken: connection.accessToken,
      refreshToken: connection.refreshToken,
      startDate: args.dateRange.startDate,
      endDate: args.dateRange.endDate,
    })) as GSCResponse;

    // 3. Transform GSC response to expected format
    return {
      rows: (data.rows || []).map((row) => ({
        keys: row.keys || [],
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        ctr: row.ctr || 0,
        position: row.position || 0,
      })),
    };
  },
});
