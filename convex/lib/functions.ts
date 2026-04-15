/**
 * Secured Function Wrappers
 *
 * Component Hierarchy: convex/lib/functions.ts (Foundation Layer)
 *   - Consumed by: All convex/**\/*.ts endpoint modules
 *   - Depends on: convex/lib/rbac.ts, convex-helpers/server/customFunctions
 *
 * Three-tier function system that enforces RBAC by construction:
 *   - securedQuery/securedMutation: Project-scoped (auto-injects requireProjectAccess)
 *   - adminQuery/adminMutation: Admin portal (auto-injects requireAdmin)
 *   - publicQuery/publicMutation: Pre-auth funnel (explicit bypass, no auth)
 *
 * Origin: Project Glasswing — 14 BOLA/IDOR zero-days from missing manual RBAC calls
 * LDD: docs/LDD_SECURED_FUNCTIONS.md
 */

import {
  customQuery,
  customMutation,
} from 'convex-helpers/server/customFunctions';
import {
  query as baseQuery,
  mutation as baseMutation,
} from '../_generated/server';
import { v } from 'convex/values';
import { requireProjectAccess, requireAdmin } from './rbac';
import type { Id } from '../_generated/dataModel';
import type { OrgRole } from './rbac';

// ============================================================================
// Type Exports
// ============================================================================

/**
 * Enriched context provided to all secured handlers.
 * Contains the verified access result from requireProjectAccess.
 */
export type SecuredAccess = {
  userId: Id<'users'>;
  project: any;
  role: OrgRole | 'owner';
};

// ============================================================================
// TIER 1: Project-Scoped (RBAC auto-enforced)
// ============================================================================

/**
 * securedQuery — Auto-injects `projectId` arg and runs `requireProjectAccess(viewer)`
 * before the handler executes.
 *
 * Handler receives enriched ctx:
 *   - ctx.access: { userId, project, role }
 *   - ctx.projectId: Id<'projects'>
 *
 * @example
 * ```ts
 * import { securedQuery } from '../lib/functions';
 *
 * export const getScheduledPosts = securedQuery({
 *   args: {},
 *   handler: async (ctx, args) => {
 *     // ctx.projectId and ctx.access already verified
 *     return ctx.db.query('scheduledPosts')
 *       .withIndex('by_project', q => q.eq('projectId', ctx.projectId))
 *       .collect();
 *   },
 * });
 * ```
 */
export const securedQuery = customQuery(baseQuery, {
  args: { projectId: v.id('projects') },
  input: async (ctx, { projectId }) => {
    const access = await requireProjectAccess(ctx, projectId, 'viewer');
    return { ctx: { access, projectId }, args: {} };
  },
});

/**
 * securedMutation — Auto-injects `projectId` arg and runs `requireProjectAccess(editor)`
 * before the handler executes.
 *
 * Handler receives enriched ctx:
 *   - ctx.access: { userId, project, role }
 *   - ctx.projectId: Id<'projects'>
 *
 * @example
 * ```ts
 * import { securedMutation } from '../lib/functions';
 *
 * export const createScheduledPost = securedMutation({
 *   args: { title: v.string(), publishDate: v.number() },
 *   handler: async (ctx, args) => {
 *     return ctx.db.insert('scheduledPosts', {
 *       projectId: ctx.projectId,
 *       title: args.title,
 *       publishDate: args.publishDate,
 *       status: 'scheduled',
 *     });
 *   },
 * });
 * ```
 */
export const securedMutation = customMutation(baseMutation, {
  args: { projectId: v.id('projects') },
  input: async (ctx, { projectId }) => {
    const access = await requireProjectAccess(ctx, projectId, 'editor');
    return { ctx: { access, projectId }, args: {} };
  },
});

// ============================================================================
// TIER 2: Admin Portal (admin role auto-enforced)
// ============================================================================

/**
 * adminQuery — Auto-runs `requireAdmin()` before the handler executes.
 *
 * Handler receives enriched ctx:
 *   - ctx.adminUserId: Id<'users'>
 *
 * @example
 * ```ts
 * import { adminQuery } from '../lib/functions';
 *
 * export const getDashboardMetrics = adminQuery({
 *   args: {},
 *   handler: async (ctx, args) => {
 *     // ctx.adminUserId already verified
 *     return ctx.db.query('biEvents').collect();
 *   },
 * });
 * ```
 */
export const adminQuery = customQuery(baseQuery, {
  args: {},
  input: async (ctx) => {
    const adminUserId = await requireAdmin(ctx);
    return { ctx: { adminUserId }, args: {} };
  },
});

/**
 * adminMutation — Auto-runs `requireAdmin()` before the handler executes.
 *
 * Handler receives enriched ctx:
 *   - ctx.adminUserId: Id<'users'>
 */
export const adminMutation = customMutation(baseMutation, {
  args: {},
  input: async (ctx) => {
    const adminUserId = await requireAdmin(ctx);
    return { ctx: { adminUserId }, args: {} };
  },
});

// ============================================================================
// TIER 3: Public (explicit bypass — no auth)
// ============================================================================

/**
 * publicQuery — Explicitly unprotected. Import name signals intent to code reviewers.
 * Use ONLY for pre-auth funnel endpoints (prospects, waitlist, public resources).
 *
 * This is a direct re-export of the base Convex query constructor.
 */
export const publicQuery = baseQuery;

/**
 * publicMutation — Explicitly unprotected. Import name signals intent to code reviewers.
 * Use ONLY for pre-auth funnel endpoints (prospect creation, waitlist signup).
 *
 * This is a direct re-export of the base Convex mutation constructor.
 */
export const publicMutation = baseMutation;
