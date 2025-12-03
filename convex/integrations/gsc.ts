import { action } from '../_generated/server';
import { v } from 'convex/values';
import { api } from '../_generated/api';

export const fetchKeywordData = action({
  args: {
    projectId: v.id('projects'),
    dateRange: v.object({
      startDate: v.string(),
      endDate: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    // 1. Get GSC Connection
    const connection = await ctx.runQuery(api.integrations.gscConnections.getGSCConnection, {
      projectId: args.projectId,
    });

    if (!connection) {
      throw new Error('GSC not connected');
    }

    // 2. Fetch data from Google Search Console API
    // Placeholder for actual API call

    return {
      rows: [
        {
          keys: ['example keyword'],
          clicks: 100,
          impressions: 1000,
          ctr: 0.1,
          position: 5,
        },
      ],
    };
  },
});
