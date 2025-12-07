import { mutation, query, internalAction } from '../_generated/server';
import { v } from 'convex/values';
import { api } from '../_generated/api';

// Add ranking data
export const addRanking = mutation({
  args: {
    projectId: v.id('projects'),
    keyword: v.string(),
    position: v.number(),
    url: v.string(),
    searchEngine: v.string(),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('rankings', {
      projectId: args.projectId,
      keyword: args.keyword,
      position: args.position,
      url: args.url,
      searchEngine: args.searchEngine,
      location: args.location,
      date: Date.now(),
    });
  },
});

// Get rankings for keyword
export const getRankingsByKeyword = query({
  args: {
    projectId: v.id('projects'),
    keyword: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('rankings')
      .withIndex('by_project_keyword', (q) =>
        q.eq('projectId', args.projectId).eq('keyword', args.keyword)
      )
      .order('desc')
      .collect();
  },
});

// Get all rankings for project
export const getRankingsByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('rankings')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .take(100); // Latest 100 rankings
  },
});

export const updateRankings = internalAction({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    // Placeholder: Fetch rankings from external API
    // Then store them using internal mutation

    // For now, just simulate an update
    await ctx.runMutation(api.seo.rankings.addRanking, {
      projectId: args.projectId,
      keyword: 'example keyword',
      position: Math.floor(Math.random() * 10) + 1,
      url: 'https://example.com',
      searchEngine: 'google',
    });

    return { updated: true };
  },
});
