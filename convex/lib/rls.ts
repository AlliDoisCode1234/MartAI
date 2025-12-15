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

    // Briefs: project-scoped
    briefs: {
      read: async (ruleCtx, brief) => {
        if (isAdmin) return true;
        if (!userId) return false;
        const project = await ruleCtx.db.get(brief.projectId);
        return project?.userId === userId;
      },
      modify: async (ruleCtx, brief) => {
        if (isAdmin) return true;
        if (!userId) return false;
        const project = await ruleCtx.db.get(brief.projectId);
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
