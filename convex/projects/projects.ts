import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';

import { planConfig } from '../subscriptions/subscriptions';
import { auth } from '../auth';
import { requireProjectAccess, requireSuperAdmin } from '../lib/rbac';

// Create project
export const createProject = mutation({
  args: {
    name: v.string(),
    websiteUrl: v.string(),
    industry: v.optional(v.string()),
    // Phase 3: Organization support
    organizationId: v.optional(v.id('organizations')),
    // PROJ-001: Project type (defaults to 'own')
    projectType: v.optional(v.union(v.literal('own'), v.literal('competitor'))),
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

    // NOTE: Project limit check temporarily disabled for testing - uncomment before launch
    const projectId = await ctx.db.insert('projects', {
      userId,
      organizationId: args.organizationId,
      name: args.name,
      websiteUrl: args.websiteUrl,
      industry: args.industry,
      // PROJ-001: Set project type and lock URL
      projectType: args.projectType ?? 'own',
      urlLocked: true, // URL cannot be changed after creation
      serpAnalysisUsed: false, // Track SERP quota usage
      targetAudience: args.targetAudience,
      businessGoals: args.businessGoals,
      competitors: args.competitors,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
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

// List projects for current user (simplified for Content Studio)
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query('projects')
      .withIndex('by_user', (q) => q.eq('userId', userId))
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

// Update project (requires project editor access)
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
    // Generation status for onboarding visibility
    generationStatus: v.optional(
      v.union(v.literal('idle'), v.literal('generating'), v.literal('complete'), v.literal('error'))
    ),
  },
  handler: async (ctx, args) => {
    // Security: Require project access
    await requireProjectAccess(ctx, args.projectId, 'editor');

    // PROJ-001: Check if URL is locked before allowing URL changes
    if (args.websiteUrl !== undefined) {
      const project = await ctx.db.get(args.projectId);
      if (project?.urlLocked) {
        throw new Error('URL_LOCKED: Website URL cannot be changed after project creation.');
      }
    }

    const updates: any = { updatedAt: Date.now() };
    if (args.name !== undefined) updates.name = args.name;
    if (args.websiteUrl !== undefined) updates.websiteUrl = args.websiteUrl;
    if (args.industry !== undefined) updates.industry = args.industry;
    if (args.generationStatus !== undefined) updates.generationStatus = args.generationStatus;

    return await ctx.db.patch(args.projectId, updates);
  },
});

// Delete project (requires project admin access)
export const deleteProject = mutation({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    // Security: Require project admin access for deletion
    await requireProjectAccess(ctx, args.projectId, 'admin');

    await ctx.db.delete(args.projectId);
  },
});

// Create test project (SUPER ADMIN ONLY - for testing/dogfooding)
// Security: This is a privileged operation that creates a test user
export const createTestProject = mutation({
  args: {
    name: v.string(),
    websiteUrl: v.string(),
  },
  handler: async (ctx, args) => {
    // Security: Only super_admin can create test projects
    await requireSuperAdmin(ctx);
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
