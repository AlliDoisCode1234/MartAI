// @ts-nocheck
// Note: Run `npx convex dev` to generate proper types
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create or update GSC connection
export const upsertGSCConnection = mutation({
  args: {
    projectId: v.id("projects"),
    siteUrl: v.string(),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if connection exists
    const existing = await ctx.db
      .query("gscConnections")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();

    const connectionData = {
      projectId: args.projectId,
      siteUrl: args.siteUrl,
      accessToken: args.accessToken,
      refreshToken: args.refreshToken,
      lastSync: Date.now(),
      updatedAt: Date.now(),
    };

    if (existing) {
      return await ctx.db.patch(existing._id, connectionData);
    }

    return await ctx.db.insert("gscConnections", {
      ...connectionData,
      createdAt: Date.now(),
    });
  },
});

// Get GSC connection by project
export const getGSCConnection = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("gscConnections")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();
  },
});

// Update last sync time
export const updateLastSync = mutation({
  args: {
    connectionId: v.id("gscConnections"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.connectionId, {
      lastSync: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Delete GSC connection
export const deleteGSCConnection = mutation({
  args: {
    connectionId: v.id("gscConnections"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.connectionId);
  },
});

