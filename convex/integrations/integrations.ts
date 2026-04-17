import { query } from "../_generated/server";
import { v } from "convex/values";
import { requireProjectAccess } from "../lib/rbac";

/**
 * Get all integration connections for a project
 */
export const getIntegrationsByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {

          // GLASSWING BOLA PATCH: Verify project-level RBAC via Glasswing Protocol
          await requireProjectAccess(ctx, args.projectId, 'viewer');
    // Get GA4 connection
    const ga4Connection = await ctx.db
      .query("ga4Connections")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();

    // Get GSC connection
    const gscConnection = await ctx.db
      .query("gscConnections")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();

    // Get CMS platform connections (replaced legacy oauthTokens)
    const platformConns = await ctx.db
      .query("platformConnections")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    return {
      projectId: args.projectId,
      ga4: ga4Connection
        ? {
            connected: true,
            propertyName: ga4Connection.propertyName,
            lastSync: ga4Connection.lastSync,
          }
        : { connected: false },
      gsc: gscConnection
        ? {
            connected: true,
            siteUrl: gscConnection.siteUrl,
            lastSync: gscConnection.lastSync,
          }
        : { connected: false },
      cms: {
        wordpress: platformConns.some((c) => c.platform === "wordpress"),
        shopify: platformConns.some((c) => c.platform === "shopify"),
        webflow: platformConns.some((c) => c.platform === "webflow"),
      },
    };
  },
});
