// @ts-nocheck
// Note: Run `npx convex dev` to generate proper types
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Add keywords
export const addKeywords = mutation({
  args: {
    clientId: v.id("clients"),
    keywords: v.array(v.object({
      keyword: v.string(),
      searchVolume: v.optional(v.number()),
      difficulty: v.optional(v.number()),
      cpc: v.optional(v.number()),
      intent: v.optional(v.string()),
      priority: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const keywordIds = [];
    for (const kw of args.keywords) {
      const id = await ctx.db.insert("keywords", {
        clientId: args.clientId,
        keyword: kw.keyword,
        searchVolume: kw.searchVolume,
        difficulty: kw.difficulty,
        cpc: kw.cpc,
        intent: kw.intent,
        priority: kw.priority || "medium",
        status: "suggested",
        createdAt: Date.now(),
      });
      keywordIds.push(id);
    }
    return keywordIds;
  },
});

// Get keywords by client
export const getKeywordsByClient = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("keywords")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .order("desc")
      .collect();
  },
});

// Update keyword status
export const updateKeywordStatus = mutation({
  args: {
    keywordId: v.id("keywords"),
    status: v.string(),
    priority: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const keyword = await ctx.db.get(args.keywordId);
    if (!keyword) return null;
    
    return await ctx.db.patch(args.keywordId, {
      status: args.status,
      priority: args.priority || keyword.priority,
    });
  },
});

// Get keywords by status
export const getKeywordsByStatus = query({
  args: { 
    clientId: v.id("clients"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const allKeywords = await ctx.db
      .query("keywords")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .collect();
    
    return allKeywords.filter(k => k.status === args.status);
  },
});

