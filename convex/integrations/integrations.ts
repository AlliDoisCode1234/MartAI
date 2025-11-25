import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Get all integration connections for a project
 */
export const getIntegrationsByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
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

    // Get OAuth tokens (CMS connections)
    const oauthTokens = await ctx.db
      .query("oauthTokens")
      .collect(); // Note: May need to filter by project/client if schema supports it

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
        wordpress: oauthTokens.some((t) => t.platform === "wordpress"),
        shopify: oauthTokens.some((t) => t.platform === "shopify"),
        webflow: oauthTokens.some((t) => t.platform === "webflow"),
      },
    };
  },
});

