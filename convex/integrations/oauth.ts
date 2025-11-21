import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Store OAuth token
export const storeOAuthToken = mutation({
  args: {
    clientId: v.id("clients"),
    platform: v.string(),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    tokenExpiry: v.optional(v.number()),
    siteUrl: v.string(),
    shopifyShop: v.optional(v.string()),
    wordpressSiteId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if token exists
    const existing = await ctx.db
      .query("oauthTokens")
      .withIndex("by_client_platform", (q) => 
        q.eq("clientId", args.clientId).eq("platform", args.platform)
      )
      .first();

    const tokenData = {
      clientId: args.clientId,
      platform: args.platform,
      accessToken: args.accessToken,
      refreshToken: args.refreshToken,
      tokenExpiry: args.tokenExpiry,
      siteUrl: args.siteUrl,
      shopifyShop: args.shopifyShop,
      wordpressSiteId: args.wordpressSiteId,
      updatedAt: Date.now(),
    };

    if (existing) {
      return await ctx.db.patch(existing._id, tokenData);
    }

    return await ctx.db.insert("oauthTokens", {
      ...tokenData,
      createdAt: Date.now(),
    });
  },
});

// Get OAuth token
export const getOAuthToken = query({
  args: {
    clientId: v.id("clients"),
    platform: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("oauthTokens")
      .withIndex("by_client_platform", (q) => 
        q.eq("clientId", args.clientId).eq("platform", args.platform)
      )
      .first();
  },
});

// Remove OAuth token
export const removeOAuthToken = mutation({
  args: {
    tokenId: v.id("oauthTokens"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.tokenId);
  },
});

