/**
 * Row Level Security (RLS) Module
 *
 * Implements database-level access control using convex-helpers.
 * All queries/mutations should use queryWithRLS/mutationWithRLS.
 *
 * Rules:
 * - member: can read/modify own data (via project ownership)
 * - admin: can read all, modify with restrictions
 * - super_admin: full access
 *
 * @see https://stack.convex.dev/row-level-security
 */

import { customCtx, customMutation, customQuery } from 'convex-helpers/server/customFunctions';
import {
  Rules,
  wrapDatabaseReader,
  wrapDatabaseWriter,
} from 'convex-helpers/server/rowLevelSecurity';
import { DataModel } from '../_generated/dataModel';
import { mutation, query, QueryCtx, MutationCtx } from '../_generated/server';
import { auth } from '../auth';

// Helper to get current user context
async function getUserContext(ctx: QueryCtx) {
  const userId = await auth.getUserId(ctx);
  if (!userId) return { userId: null, user: null, isAdmin: false, isSuperAdmin: false };

  const user = await ctx.db.get(userId);
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';

  return { userId, user, isAdmin, isSuperAdmin };
}

// Define RLS rules for each table
async function rlsRules(ctx: QueryCtx): Promise<Rules<QueryCtx, DataModel>> {
  const { userId, isAdmin, isSuperAdmin } = await getUserContext(ctx);

  return {
    // Users: can only read/modify self, admins can read all
    users: {
      read: async (_ctx, targetUser) => {
        if (isAdmin) return true;
        return targetUser._id === userId;
      },
      modify: async (_ctx, targetUser) => {
        if (isSuperAdmin) return true;
        return targetUser._id === userId;
      },
    },

    // Projects: owner or admin
    projects: {
      read: async (_ctx, project) => {
        if (isAdmin) return true;
        if (!userId) return false;
        return project.userId === userId;
      },
      modify: async (_ctx, project) => {
        if (isAdmin) return true;
        if (!userId) return false;
        return project.userId === userId;
      },
    },

    // Keywords: project-scoped
    keywords: {
      read: async (ruleCtx, keyword) => {
        if (isAdmin) return true;
        if (!userId) return false;
        const project = await ruleCtx.db.get(keyword.projectId);
        return project?.userId === userId;
      },
      modify: async (ruleCtx, keyword) => {
        if (isAdmin) return true;
        if (!userId) return false;
        const project = await ruleCtx.db.get(keyword.projectId);
        return project?.userId === userId;
      },
    },

    // Keyword clusters: project-scoped
    keywordClusters: {
      read: async (ruleCtx, cluster) => {
        if (isAdmin) return true;
        if (!userId) return false;
        const project = await ruleCtx.db.get(cluster.projectId);
        return project?.userId === userId;
      },
      modify: async (ruleCtx, cluster) => {
        if (isAdmin) return true;
        if (!userId) return false;
        const project = await ruleCtx.db.get(cluster.projectId);
        return project?.userId === userId;
      },
    },

    // Competitors: project-scoped
    competitors: {
      read: async (ruleCtx, competitor) => {
        if (isAdmin) return true;
        if (!userId) return false;
        const project = await ruleCtx.db.get(competitor.projectId);
        return project?.userId === userId;
      },
      modify: async (ruleCtx, competitor) => {
        if (isAdmin) return true;
        if (!userId) return false;
        const project = await ruleCtx.db.get(competitor.projectId);
        return project?.userId === userId;
      },
    },

    // API Keys: user-scoped
    apiKeys: {
      read: async (_ctx, apiKey) => {
        if (isAdmin) return true;
        return apiKey.userId === userId;
      },
      modify: async (_ctx, apiKey) => {
        if (isSuperAdmin) return true;
        return apiKey.userId === userId;
      },
    },

    // Subscriptions: user-scoped
    subscriptions: {
      read: async (_ctx, sub) => {
        if (isAdmin) return true;
        return sub.userId === userId;
      },
      modify: async (_ctx, sub) => {
        if (isSuperAdmin) return true;
        return sub.userId === userId;
      },
    },

    // Quarterly plans: project-scoped
    quarterlyPlans: {
      read: async (ruleCtx, plan) => {
        if (isAdmin) return true;
        if (!userId) return false;
        const project = await ruleCtx.db.get(plan.projectId);
        return project?.userId === userId;
      },
      modify: async (ruleCtx, plan) => {
        if (isAdmin) return true;
        if (!userId) return false;
        const project = await ruleCtx.db.get(plan.projectId);
        return project?.userId === userId;
      },
    },

    // Prospects: admin only (sales data)
    prospects: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // Prospect details: admin only
    prospectDetails: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // Content calendars: project-scoped (projectId is optional)
    contentCalendars: {
      read: async (ruleCtx, calendar) => {
        if (isAdmin) return true;
        if (!userId) return false;
        if (!calendar.projectId) return false; // No project = no access
        const project = await ruleCtx.db.get(calendar.projectId);
        return project?.userId === userId;
      },
      modify: async (ruleCtx, calendar) => {
        if (isAdmin) return true;
        if (!userId) return false;
        if (!calendar.projectId) return false;
        const project = await ruleCtx.db.get(calendar.projectId);
        return project?.userId === userId;
      },
    },

    // Content templates: readable by all authenticated, modifiable by super_admin only
    contentTemplates: {
      read: async () => !!userId, // Any authenticated user can read templates
      modify: async () => isSuperAdmin, // Only super_admin can modify
    },

    // Organizations: member-scoped
    organizations: {
      read: async (ruleCtx, org) => {
        if (isAdmin) return true;
        if (!userId) return false;
        // Check if user is a member
        const membership = await ruleCtx.db
          .query('teamMembers')
          .withIndex('by_user_org', (q) => q.eq('userId', userId).eq('organizationId', org._id))
          .first();
        return !!membership;
      },
      modify: async (ruleCtx, org) => {
        if (isSuperAdmin) return true;
        if (!userId) return false;
        // Check if user is org admin or owner
        const membership = await ruleCtx.db
          .query('teamMembers')
          .withIndex('by_user_org', (q) => q.eq('userId', userId).eq('organizationId', org._id))
          .first();
        return membership?.role === 'owner' || membership?.role === 'admin';
      },
    },

    // Team members: org-scoped
    teamMembers: {
      read: async (ruleCtx, member) => {
        if (isAdmin) return true;
        if (!userId) return false;
        // Can read if member of same org
        const myMembership = await ruleCtx.db
          .query('teamMembers')
          .withIndex('by_user_org', (q) =>
            q.eq('userId', userId).eq('organizationId', member.organizationId)
          )
          .first();
        return !!myMembership;
      },
      modify: async (ruleCtx, member) => {
        if (isSuperAdmin) return true;
        if (!userId) return false;
        // Can only modify own membership or if org admin
        if (member.userId === userId) return true;
        const myMembership = await ruleCtx.db
          .query('teamMembers')
          .withIndex('by_user_org', (q) =>
            q.eq('userId', userId).eq('organizationId', member.organizationId)
          )
          .first();
        return myMembership?.role === 'owner' || myMembership?.role === 'admin';
      },
    },

    // Analytics events: admin only
    analyticsEvents: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // AI generations (cost tracking): super_admin for read, admin for write
    aiGenerations: {
      read: async () => isSuperAdmin, // Only super_admin can see AI costs
      modify: async () => isAdmin, // Admins can log generations
    },

    // API access requests: user-scoped read, admin modify
    apiAccessRequests: {
      read: async (_ctx, request) => {
        if (isAdmin) return true;
        return request.userId === userId;
      },
      modify: async () => isAdmin, // Only admins can approve/reject
    },

    // Insights: project-scoped
    insights: {
      read: async (ruleCtx, insight) => {
        if (isAdmin) return true;
        if (!userId) return false;
        const project = await ruleCtx.db.get(insight.projectId);
        return project?.userId === userId;
      },
      modify: async () => isAdmin, // System-generated
    },

    // Scheduled posts: project-scoped
    scheduledPosts: {
      read: async (ruleCtx, post) => {
        if (isAdmin) return true;
        if (!userId) return false;
        const project = await ruleCtx.db.get(post.projectId);
        return project?.userId === userId;
      },
      modify: async (ruleCtx, post) => {
        if (isAdmin) return true;
        if (!userId) return false;
        const project = await ruleCtx.db.get(post.projectId);
        return project?.userId === userId;
      },
    },

    // Platform connections: project-scoped
    platformConnections: {
      read: async (ruleCtx, connection) => {
        if (isAdmin) return true;
        if (!userId) return false;
        const project = await ruleCtx.db.get(connection.projectId);
        return project?.userId === userId;
      },
      modify: async (ruleCtx, connection) => {
        if (isAdmin) return true;
        if (!userId) return false;
        const project = await ruleCtx.db.get(connection.projectId);
        return project?.userId === userId;
      },
    },

    // GA4 connections: project-scoped
    ga4Connections: {
      read: async (ruleCtx, connection) => {
        if (isAdmin) return true;
        if (!userId) return false;
        const project = await ruleCtx.db.get(connection.projectId);
        return project?.userId === userId;
      },
      modify: async (ruleCtx, connection) => {
        if (isAdmin) return true;
        if (!userId) return false;
        const project = await ruleCtx.db.get(connection.projectId);
        return project?.userId === userId;
      },
    },

    // GSC connections: project-scoped
    gscConnections: {
      read: async (ruleCtx, connection) => {
        if (isAdmin) return true;
        if (!userId) return false;
        const project = await ruleCtx.db.get(connection.projectId);
        return project?.userId === userId;
      },
      modify: async (ruleCtx, connection) => {
        if (isAdmin) return true;
        if (!userId) return false;
        const project = await ruleCtx.db.get(connection.projectId);
        return project?.userId === userId;
      },
    },

    // OAuth tokens: super_admin only (sensitive)
    oauthTokens: {
      read: async () => isSuperAdmin,
      modify: async () => isSuperAdmin,
    },

    // Usage limits: user-scoped read, admin modify
    usageLimits: {
      read: async (_ctx, limit) => {
        if (isAdmin) return true;
        return limit.userId === userId;
      },
      modify: async () => isAdmin,
    },

    // Personas: global table with isDefault flag - readable by all authenticated, modifiable by admin
    personas: {
      read: async () => !!userId, // Any authenticated user can read personas
      modify: async () => isAdmin, // Only admins can modify personas
    },

    // Beta codes: admin only (sensitive)
    betaCodes: {
      read: async () => isAdmin, // Only admins can view codes
      modify: async () => isAdmin, // Only admins can create/revoke codes
    },

    // ========================================================================
    // P0 CRITICAL - Sensitive Security Data
    // ========================================================================

    // Impersonation sessions: super_admin only (contains IP, session tokens)
    impersonationSessions: {
      read: async () => isSuperAdmin,
      modify: async () => isSuperAdmin,
    },

    // Password reset tokens: system-only (no direct user/admin access)
    passwordResetTokens: {
      read: async () => false, // Never directly readable
      modify: async () => false, // System mutations only
    },

    // Webhooks: admin-only (webhook secrets are sensitive)
    webhooks: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // Webhook deliveries: admin-only
    webhookDeliveries: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // Organization invitations: admin-only (contains tokens)
    organizationInvitations: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // Team audit logs: admin-only
    teamAuditLogs: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // ========================================================================
    // P1 HIGH - Project-Scoped Business Data
    // ========================================================================

    // Content pieces: project-scoped
    contentPieces: {
      read: async (ruleCtx, piece) => {
        if (isAdmin) return true;
        if (!userId) return false;
        const project = await ruleCtx.db.get(piece.projectId);
        return project?.userId === userId;
      },
      modify: async (ruleCtx, piece) => {
        if (isAdmin) return true;
        if (!userId) return false;
        const project = await ruleCtx.db.get(piece.projectId);
        return project?.userId === userId;
      },
    },

    // Brief versions: admin-only (needs cross-table lookup via briefs)
    briefVersions: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // Keyword library: global table (admin-only)
    keywordLibrary: {
      read: async () => !!userId, // Any authenticated user can search
      modify: async () => isAdmin, // Only admins can modify global library
    },

    // Keyword ideas: admin-only (projectId optional)
    keywordIdeas: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // Rankings: admin-only (system-generated data)
    rankings: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // SEO audits: admin-only
    seoAudits: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // SEO statistics: admin-only (legacy table without projectId)
    seoStatistics: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // SERP analyses: admin-only
    serpAnalyses: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // Generated pages: admin-only (legacy table with clientId instead of projectId)
    generatedPages: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // Submitted URLs: admin-only (prospect-scoped, not project-scoped)
    submittedUrls: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // Project scores: admin-only (system-generated)
    projectScores: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // Competitor analytics: user-scoped (has userId directly)
    competitorAnalytics: {
      read: async (_ruleCtx, analytics) => {
        if (isAdmin) return true;
        return analytics.userId === userId;
      },
      modify: async () => isAdmin, // System-generated
    },

    // Content checks: admin-only
    contentChecks: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // GSC keyword snapshots: admin-only (system-generated)
    gscKeywordSnapshots: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // Analytics data: admin-only (system-generated)
    analyticsData: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // ========================================================================
    // P2 MEDIUM - System/Config Data
    // ========================================================================

    // AI models: admin read, super_admin modify
    aiModels: {
      read: async () => isAdmin,
      modify: async () => isSuperAdmin,
    },

    // AI providers: admin read, super_admin modify
    aiProviders: {
      read: async () => isAdmin,
      modify: async () => isSuperAdmin,
    },

    // AI provider health: admin only
    aiProviderHealth: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // AI reports: admin only
    aiReports: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // AI routing logs: super_admin only (debug data)
    aiRoutingLogs: {
      read: async () => isSuperAdmin,
      modify: async () => isSuperAdmin,
    },

    // AI usage: admin only
    aiUsage: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // AI writer personas: authenticated read, admin modify
    aiWriterPersonas: {
      read: async () => !!userId,
      modify: async () => isAdmin,
    },

    // BI events: admin only
    biEvents: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // SEO updates: admin only
    seoUpdates: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // Resources (CMS content): public read, admin write
    resources: {
      read: async () => true, // Public content
      modify: async () => isAdmin,
    },

    // ========================================================================
    // P3 LOW - Legacy/Deprecated
    // ========================================================================

    // Clients (deprecated): admin only
    clients: {
      read: async () => isAdmin,
      modify: async () => isAdmin,
    },

    // Waitlist: admin read, public write
    waitlist: {
      read: async () => isAdmin,
      modify: async () => true, // Anyone can add themselves
    },
  };
}

// Export wrapped query with RLS
export const queryWithRLS = customQuery(
  query,
  customCtx(async (ctx) => ({
    db: wrapDatabaseReader(ctx, ctx.db, await rlsRules(ctx)),
  }))
);

// Export wrapped mutation with RLS
export const mutationWithRLS = customMutation(
  mutation,
  customCtx(async (ctx) => ({
    db: wrapDatabaseWriter(ctx, ctx.db, await rlsRules(ctx)),
  }))
);

// Re-export for convenience
export { getUserContext };
