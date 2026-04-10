import { mutation, query, internalQuery } from '../_generated/server';
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

    // Count projects: per-org if user has an active org, otherwise global
    const orgId = args.organizationId || user?.organizationId;
    const projects = orgId
      ? await ctx.db
          .query('projects')
          .withIndex('by_org', (q) => q.eq('organizationId', orgId))
          .collect()
      : await ctx.db
          .query('projects')
          .withIndex('by_user', (q) => q.eq('userId', userId))
          .collect();

    // Determine the effective tier for limit calculation
    // By default, use the acting user's tier
    let effectiveTier = user.membershipTier ?? 'none';
    
    // If creating within an organization, the limits are dictated by the organization OWNER's tier,
    // NOT the acting member's tier (whether higher or lower).
    if (orgId) {
      const org = await ctx.db.get(orgId);
      if (org && org.ownerId) {
        const owner = await ctx.db.get(org.ownerId);
        if (owner) {
          effectiveTier = owner.membershipTier ?? 'none';
        }
      }
    }

    const config = planConfig(effectiveTier);

    // Strict enforcement: No config means no paid plan = 0 limit
    // For Enterprise, checking config.features might require fallback if custom limits apply
    const limit: number = orgId 
      ? (await ctx.db.get(orgId))?.maxProjects ?? config?.features.maxUrls ?? 0 
      : config?.features.maxUrls ?? 0;

    if (projects.length >= limit) {
      if (limit === 0) {
        throw new Error(
          'LIMIT_REACHED: Payment required. Please subscribe to a plan to start MartAI.'
        );
      }
      throw new Error(
        `LIMIT_REACHED: Upgrade your plan to manage more websites. Current limit: ${limit}`
      );
    }

    // NOTE: Project limit check enabled

    const projectId = await ctx.db.insert('projects', {
      userId,
      organizationId: orgId,
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

/**
 * @deprecated Use `projects.list` (org-aware, auth-scoped) for frontend consumers.
 * For server-side internal operations, use `getProjectsByUserInternal` instead.
 * This public query bypasses org membership validation and will be removed in a future release.
 */
export const getProjectsByUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('projects')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();
  },
});

/**
 * Internal-only: Get all projects for a user regardless of org context.
 * Used by server-side operations (HubSpot sync, onboarding completion)
 * where cross-org visibility is intentional.
 */
export const getProjectsByUserInternal = internalQuery({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('projects')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();
  },
});

// List projects for current user's active organization (or fallback to user-scoped)
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    const user = await ctx.db.get(userId);

    // Org-scoped: verify active membership before showing org projects
    if (user?.organizationId) {
      const membership = await ctx.db
        .query('teamMembers')
        .withIndex('by_user_org', (q) =>
          q.eq('userId', userId).eq('organizationId', user.organizationId!)
        )
        .first();

      // Active membership confirmed — return org projects
      if (membership && (!membership.status || membership.status === 'active')) {
        return await ctx.db
          .query('projects')
          .withIndex('by_org', (q) => q.eq('organizationId', user.organizationId!))
          .collect();
      }

      // Membership missing or inactive — fall back to user-scoped
    }

    // Fallback: user-scoped (legacy / no org / invalid membership)
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

/**
 * SEC-001-B: Internal-only project access verification.
 * Actions cannot use requireProjectAccess directly (it needs ctx.db).
 * They call this via ctx.runQuery to verify access before expensive work.
 */
export const verifyProjectAccess = internalQuery({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    await requireProjectAccess(ctx, args.projectId, 'viewer');
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
    // Brand & Content Intelligence
    brandName: v.optional(v.string()),
    brandVoice: v.optional(v.string()),
    toneKeywords: v.optional(v.array(v.string())),
    defaultWordCount: v.optional(v.number()),
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

    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.name !== undefined) updates.name = args.name;
    if (args.websiteUrl !== undefined) updates.websiteUrl = args.websiteUrl;
    if (args.industry !== undefined) updates.industry = args.industry;
    if (args.generationStatus !== undefined) updates.generationStatus = args.generationStatus;
    if (args.targetAudience !== undefined) updates.targetAudience = args.targetAudience;
    if (args.businessGoals !== undefined) updates.businessGoals = args.businessGoals;
    if (args.competitors !== undefined) updates.competitors = args.competitors;
    if (args.brandName !== undefined) updates.brandName = args.brandName;
    if (args.brandVoice !== undefined) updates.brandVoice = args.brandVoice;
    if (args.toneKeywords !== undefined) updates.toneKeywords = args.toneKeywords;
    if (args.defaultWordCount !== undefined) updates.defaultWordCount = args.defaultWordCount;

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
        role: 'user',
        membershipTier: 'enterprise', // Startup with high limits
        onboardingStatus: 'completed',
        createdAt: Date.now(),
      });
      await ctx.db.insert('internalAdmins', {
        userId,
        role: 'admin',
        createdAt: Date.now(),
        updatedAt: Date.now(),
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
