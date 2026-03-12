import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getConnection = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    // Use platformConnections (replaced legacy oauthTokens + clients pattern)
    const connection = await ctx.db
      .query('platformConnections')
      .withIndex('by_project_platform', (q) =>
        q.eq('projectId', args.projectId).eq('platform', 'wordpress')
      )
      .first();

    if (!connection) return null;

    return {
      url: connection.siteUrl,
      username: connection.credentials.username ?? 'admin',
      password: connection.credentials.applicationPassword ?? '',
    };
  },
});
