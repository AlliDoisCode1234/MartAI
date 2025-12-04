import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';

import { auth } from '../auth';

// Create project
export const createProject = mutation({
  args: {
    name: v.string(),
    websiteUrl: v.string(),
    industry: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized: User must be logged in to create a project');
    }

    console.log('🏗️ [Convex] createProject mutation called with:', args);
    const projectId = await ctx.db.insert('projects', {
      userId,
      name: args.name,
      websiteUrl: args.websiteUrl,
      industry: args.industry,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    console.log('✅ [Convex] Project created with ID:', projectId);
    return projectId;
  },
});

// Get projects by user
export const getProjectsByUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('projects')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();
  },
});

// Get project by ID
export const getProjectById = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.projectId);
  },
});

// Update project
export const updateProject = mutation({
  args: {
    projectId: v.id('projects'),
    name: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    industry: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: any = { updatedAt: Date.now() };
    if (args.name !== undefined) updates.name = args.name;
    if (args.websiteUrl !== undefined) updates.websiteUrl = args.websiteUrl;
    if (args.industry !== undefined) updates.industry = args.industry;

    return await ctx.db.patch(args.projectId, updates);
  },
});

// Delete project
export const deleteProject = mutation({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.projectId);
  },
});
