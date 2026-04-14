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

    // SEC-002: Verify org membership before allowing project creation in an org.
    // Prevents IDOR/BOLA — users cannot create projects in foreign orgs.
    if (orgId) {
      const membership = await ctx.db
        .query('teamMembers')
        .withIndex('by_user_org', (q) =>
          q.eq('userId', userId).eq('organizationId', orgId)
        )
        .first();

      if (!membership || (membership.status && membership.status !== 'active')) {
        throw new Error('Forbidden: Not an active member of this organization');
      }
    }

    const allProjects = orgId
      ? await ctx.db
          .query('projects')
          .withIndex('by_org', (q) => q.eq('organizationId', orgId))
          .collect()
      : await ctx.db
          .query('projects')
          .withIndex('by_user', (q) => q.eq('userId', userId))
          .collect();

    // Filter out soft-deleted projects
    const projects = allProjects.filter((p) => p.status !== 'deleted');

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
 * Returns whether the current user is permitted to create a new project.
 * Uses the precise logic identical to createProject, isolating the capacity check.
 */
export const getProjectCreationLimits = query({
  args: { organizationId: v.optional(v.id('organizations')) },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    const orgId = args.organizationId || user.organizationId;
    
    // SEC-002 replication for query context
    if (orgId) {
      const membership = await ctx.db
        .query('teamMembers')
        .withIndex('by_user_org', (q) =>
          q.eq('userId', userId).eq('organizationId', orgId)
        )
        .first();

      if (!membership || (membership.status && membership.status !== 'active')) {
        return null;
      }
    }

    const allProjects = orgId
      ? await ctx.db
          .query('projects')
          .withIndex('by_org', (q) => q.eq('organizationId', orgId))
          .collect()
      : await ctx.db
          .query('projects')
          .withIndex('by_user', (q) => q.eq('userId', userId))
          .collect();

    // Filter out soft-deleted projects for limit check
    const projects = allProjects.filter((p) => p.status !== 'deleted');

    let effectiveTier = user.membershipTier ?? 'none';
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
    const limit: number = orgId 
      ? (await ctx.db.get(orgId))?.maxProjects ?? config?.features.maxUrls ?? 0 
      : config?.features.maxUrls ?? 0;

    const current = projects.length;
    let canCreate = current < limit;
    
    // Exception: If config strictly yields unlimited (e.g. 999999) then always allow
    if (limit >= 99999) canCreate = true;

    return {
      canCreate,
      limit,
      current,
      errorReason: canCreate 
        ? undefined 
        : limit === 0 
          ? 'LIMIT_REACHED: Payment required. Please subscribe to a plan to start MartAI.'
          : `LIMIT_REACHED: Upgrade your plan to manage more websites. Current limit: ${limit}`
    };
  }
});

/**
 * SuperAdmin Project Deletion
 * Exclusive mutation restricted entirely to internal technical operations.
 */
export const adminDeleteProject = mutation({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    // SECURITY: Strictly restrict this to super_admins
    await requireSuperAdmin(ctx);

    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error('Project not found');

    await ctx.db.delete(args.projectId);

    return { success: true };
  }
});
/**
 * @deprecated Use `projects.list` (org-aware, auth-scoped) for frontend consumers.
 * For server-side internal operations, use `getProjectsByUserInternal` instead.
 * This public query bypasses org membership validation and will be removed in a future release.
 */
export const getProjectsByUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query('projects')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();
    return projects.filter((p) => p.status !== 'deleted');
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
    const projects = await ctx.db
      .query('projects')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();
    return projects.filter((p) => p.status !== 'deleted');
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

    let projects: any[] = [];

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
        projects = await ctx.db
          .query('projects')
          .withIndex('by_org', (q) => q.eq('organizationId', user.organizationId!))
          .collect();
      } else {
        // Membership missing or inactive — fall back to user-scoped
        projects = await ctx.db
          .query('projects')
          .withIndex('by_user', (q) => q.eq('userId', userId))
          .collect();
      }
    } else {
      // Fallback: user-scoped (legacy / no org / invalid membership)
      projects = await ctx.db
        .query('projects')
        .withIndex('by_user', (q) => q.eq('userId', userId))
        .collect();
    }

    return projects.filter((p) => p.status !== 'deleted');
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

    const projects = await ctx.db
      .query('projects')
      .withIndex('by_org', (q) => q.eq('organizationId', args.organizationId))
      .collect();

    return projects.filter((p) => p.status !== 'deleted');
  },
});

// Get project by ID
export const getProjectById = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    // Hide soft-deleted projects from direct UI component fetches
    if (project && project.status === 'deleted') return null;
    return project;
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
    // Strict Financial Security RBAC: Only system super-admins may invoke project deletion.
    // This forcibly prevents standard users from churning projects to evade billing quotas.
    await requireSuperAdmin(ctx);

    const { projectId } = args;

    // CASCADE DELETE SENSITIVE CONNECTIONS
    // To prevent storing orphaned OAuth credentials, we must synchronously delete integrating rows.
    // We intentionally leave huge tables (analyticsData) orphaned to avoid exceeding Convex's mutation limit.
    const ga4 = await ctx.db.query('ga4Connections').withIndex('by_project', (q) => q.eq('projectId', projectId)).collect();
    for (const row of ga4) await ctx.db.delete(row._id);

    const gsc = await ctx.db.query('gscConnections').withIndex('by_project', (q) => q.eq('projectId', projectId)).collect();
    for (const row of gsc) await ctx.db.delete(row._id);

    const gtm = await ctx.db.query('gtmConnections').withIndex('by_project', (q) => q.eq('projectId', projectId)).collect();
    for (const row of gtm) await ctx.db.delete(row._id);

    const platforms = await ctx.db.query('platformConnections').withIndex('by_project', (q) => q.eq('projectId', projectId)).collect();
    for (const row of platforms) await ctx.db.delete(row._id);

    // Hard delete for super admins
    await ctx.db.delete(projectId);
  },
});

/**
 * Internal-only: Retrieve a project by ID without requiring an active user session.
 * Exclusively used by background systems.
 */
export const getProjectInternal = internalQuery({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.projectId);
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
