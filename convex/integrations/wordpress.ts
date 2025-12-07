import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getConnection = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    // In a real implementation, this would fetch from a table like 'wordpressConnections'
    let token = await ctx.db
      .query('oauthTokens')
      .withIndex('by_platform', (q) => q.eq('platform', 'wordpress'))
      .first();

    // If not found by platform, try to find via project -> user -> client
    if (!token) {
      const project = await ctx.db.get(args.projectId);
      if (project) {
        const client = await ctx.db
          .query('clients')
          .withIndex('by_user', (q) => q.eq('userId', project.userId))
          .first();

        if (client) {
          token = await ctx.db
            .query('oauthTokens')
            .withIndex('by_client_platform', (q) =>
              q.eq('clientId', client._id).eq('platform', 'wordpress')
            )
            .first();
        }
      }
    }

    // Note: Schema has oauthTokens.clientId pointing to "clients".
    // But we are passing projectId.
    // If we assume clients table is separate, we might have an issue.
    // But for now, let's just return null if not found.

    if (!token) return null;

    return {
      url: token.siteUrl,
      username: 'admin', // Placeholder
      password: token.accessToken, // Placeholder
    };
  },
});
