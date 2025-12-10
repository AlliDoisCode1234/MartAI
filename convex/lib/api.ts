/**
 * API Access Helpers
 *
 * USAGE FOR NESTED MODULES:
 * Convex generates paths like 'seo/keywordClusters' but the exported `api`
 * object uses nested access. Use bracket notation for nested paths:
 *
 *   import { api } from '../_generated/api';
 *
 *   // Access nested modules with bracket notation:
 *   await ctx.runQuery(api['seo/keywordClusters'].getClustersByProject, { projectId });
 *   await ctx.runMutation(api['content/briefs'].updateBrief, { briefId, ... });
 *
 *   // Or use dot notation for top-level modules:
 *   await ctx.runQuery(api.projects.getProjectById, { projectId });
 *   await ctx.runQuery(api.users.current);
 *
 * IMPORTANT: Do NOT try to re-export typed versions of modules here.
 * This causes circular type inference errors in TypeScript.
 *
 * PATH REFERENCE:
 * - SEO: api['seo/keywordClusters'], api['seo/keywords'], api['seo/serpAnalysis'], etc.
 * - Content: api['content/briefs'], api['content/drafts'], api['content/calendars'], etc.
 * - Analytics: api['analytics/adhoc'], api['analytics/insights'], etc.
 * - Integrations: api['integrations/google'], api['integrations/gsc'], etc.
 * - Top-level: api.projects, api.users, api.onboarding, api.apiKeys, etc.
 */

// Re-export the api for convenience (import from here or from _generated/api)
export { api, internal } from '../_generated/api';
