// @ts-nocheck
// Note: Run `npx convex dev` to generate proper types
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create or update client
export const createClient = mutation({
  args: {
    companyName: v.string(),
    website: v.string(),
    industry: v.string(),
    targetAudience: v.string(),
    monthlyRevenueGoal: v.optional(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("clients")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("website"), args.website))
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        companyName: args.companyName,
        industry: args.industry,
        targetAudience: args.targetAudience,
        monthlyRevenueGoal: args.monthlyRevenueGoal,
        updatedAt: Date.now(),
      });
    }

    return await ctx.db.insert("clients", {
      companyName: args.companyName,
      website: args.website,
      industry: args.industry,
      targetAudience: args.targetAudience,
      monthlyRevenueGoal: args.monthlyRevenueGoal,
      userId: args.userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Get client by ID
export const getClient = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.clientId);
  },
});

// Get clients by user
export const getClientsByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("clients")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

