import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';

import { planConfig } from '../subscriptions/subscriptions';
import { auth } from '../auth';

// Create project
export const createProject = mutation({
  args: {
    name: v.string(),
    websiteUrl: v.string(),
    industry: v.optional(v.string()),
    // Phase 3: Organization support
    organizationId: v.optional(v.id('organizations')),
    // Context fields from onboarding
    targetAudience: v.optional(v.string()),
    businessGoals: v.optional(v.string()),
    competitors: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized: User must be logged in to create a project');
    }

    // Check membership limits
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const projects = await ctx.db
      .query('projects')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();

    const tier = user.membershipTier ?? 'none';
    const config = planConfig(tier);

    // Strict enforcement: No config means no paid plan = 0 limit
    const limit: number = config?.features.maxUrls ?? 0;

    // TODO: Uncomment this before launch - temporarily disabled for testing/dogfooding
    // if (projects.length >= limit) {
    //   if (limit === 0) {
    //     throw new Error(
    //       'LIMIT_REACHED: Payment required. Please subscribe to a plan to start MartAI.'
    //     );
    //   }
    //   throw new Error(
    //     `LIMIT_REACHED: Upgrade your plan to manage more websites. Current limit: ${limit}`
    //   );
    // }

    console.log('🏗️ [Convex] createProject mutation called with:', args);
    const projectId = await ctx.db.insert('projects', {
      userId,
      organizationId: args.organizationId,
      name: args.name,
      websiteUrl: args.websiteUrl,
      industry: args.industry,
      targetAudience: args.targetAudience,
      businessGoals: args.businessGoals,
      competitors: args.competitors,
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

// Get projects by organization (Phase 3)
export const getProjectsByOrganization = query({
  args: { organizationId: v.id('organizations') },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    // Check if user is a member of this org
    const membership = await ctx.db
      .query('teamMembers')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', userId).eq('organizationId', args.organizationId)
      )
      .first();

    if (!membership) {
      return [];
    }

    return await ctx.db
      .query('projects')
      .withIndex('by_org', (q) => q.eq('organizationId', args.organizationId))
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
    organizationId: v.optional(v.id('organizations')),
    targetAudience: v.optional(v.string()),
    businessGoals: v.optional(v.string()),
    competitors: v.optional(v.array(v.string())),
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

export const createTestProject = mutation({
  args: {
    name: v.string(),
    websiteUrl: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Create a dummy user if not exists
    const email = 'test-dogfood@martai.com';
    let user = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', email))
      .first();

    if (!user) {
      const userId = await ctx.db.insert('users', {
        email,
        name: 'Dogfood Tester',
        role: 'admin',
        membershipTier: 'enterprise', // Startup with high limits
        onboardingStatus: 'completed',
        createdAt: Date.now(),
      });
      user = await ctx.db.get(userId);
    }

    if (!user) throw new Error('Failed to create test user');

    // 2. Create Project
    const projectId = await ctx.db.insert('projects', {
      userId: user._id,
      name: args.name,
      websiteUrl: args.websiteUrl,
      industry: 'Testing',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return projectId;
  },
});
