// @ts-nocheck
// Note: Run `npx convex dev` to generate proper types
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create generated page record
export const createGeneratedPage = mutation({
  args: {
    clientId: v.id("clients"),
    platform: v.string(),
    pageId: v.string(),
    pageUrl: v.string(),
    title: v.string(),
    content: v.string(),
    keywords: v.array(v.string()),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("generatedPages", {
      clientId: args.clientId,
      platform: args.platform,
      pageId: args.pageId,
      pageUrl: args.pageUrl,
      title: args.title,
      content: args.content,
      keywords: args.keywords,
      status: args.status,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Get pages by client
export const getPagesByClient = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("generatedPages")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .order("desc")
      .collect();
  },
});

// Update page status
export const updatePageStatus = mutation({
  args: {
    pageId: v.id("generatedPages"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.pageId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

