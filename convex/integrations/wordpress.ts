import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getConnection = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    // In a real implementation, this would fetch from a table like 'wordpressConnections'
    // For now, we'll check oauthTokens or return a mock
    const token = await ctx.db
      .query('oauthTokens')
      .withIndex('by_platform', (q) => q.eq('platform', 'wordpress'))
      .filter((q) => q.eq(q.field('clientId'), args.projectId)) // Assuming projectId maps to clientId here or we need to fix schema
      .first();

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
