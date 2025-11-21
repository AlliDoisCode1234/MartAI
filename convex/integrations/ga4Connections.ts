import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// Create or update GA4 connection
export const upsertGA4Connection = mutation({
  args: {
    projectId: v.id("projects"),
    propertyId: v.string(),
    propertyName: v.string(),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if connection exists
    const existing = await ctx.db
      .query("ga4Connections")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();

    const connectionData = {
      projectId: args.projectId,
      propertyId: args.propertyId,
      propertyName: args.propertyName,
      accessToken: args.accessToken,
      refreshToken: args.refreshToken,
      lastSync: Date.now(),
      updatedAt: Date.now(),
    };

    if (existing) {
      return await ctx.db.patch(existing._id, connectionData);
    }

    return await ctx.db.insert("ga4Connections", {
      ...connectionData,
      createdAt: Date.now(),
    });
  },
});

// Get GA4 connection by project
export const getGA4Connection = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ga4Connections")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();
  },
});

// Update last sync time
export const updateLastSync = mutation({
  args: {
    connectionId: v.id("ga4Connections"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.connectionId, {
      lastSync: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Delete GA4 connection
export const deleteGA4Connection = mutation({
  args: {
    connectionId: v.id("ga4Connections"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.connectionId);
  },
});

