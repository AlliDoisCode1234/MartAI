// @ts-nocheck
// Note: Run `npx convex dev` to generate proper types
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Client/Business information
  clients: defineTable({
    companyName: v.string(),
    website: v.string(),
    industry: v.string(),
    targetAudience: v.string(),
    monthlyRevenueGoal: v.optional(v.string()),
    userId: v.string(), // Auth user ID
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_website", ["website"]),

  // SEO Audits
  seoAudits: defineTable({
    clientId: v.id("clients"),
    website: v.string(),
    overallScore: v.number(),
    technicalSeo: v.object({
      score: v.number(),
      issues: v.array(v.string()),
      recommendations: v.array(v.string()),
    }),
    onPageSeo: v.object({
      score: v.number(),
      issues: v.array(v.string()),
      recommendations: v.array(v.string()),
    }),
    contentQuality: v.object({
      score: v.number(),
      issues: v.array(v.string()),
      recommendations: v.array(v.string()),
    }),
    backlinks: v.object({
      score: v.number(),
      issues: v.array(v.string()),
      recommendations: v.array(v.string()),
    }),
    priorityActions: v.array(v.string()),
    // Additional statistics
    pageSpeed: v.optional(v.number()),
    mobileFriendly: v.optional(v.boolean()),
    sslEnabled: v.optional(v.boolean()),
    indexedPages: v.optional(v.number()),
    crawlErrors: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_client", ["clientId"])
    .index("by_website", ["website"]),

  // Keywords
  keywords: defineTable({
    clientId: v.id("clients"),
    keyword: v.string(),
    searchVolume: v.optional(v.number()),
    difficulty: v.optional(v.number()),
    cpc: v.optional(v.number()),
    intent: v.optional(v.string()), // informational, commercial, transactional
    priority: v.optional(v.string()), // high, medium, low
    status: v.string(), // suggested, approved, implemented
    createdAt: v.number(),
  })
    .index("by_client", ["clientId"])
    .index("by_status", ["status"])
    .index("by_keyword", ["keyword"]),

  // OAuth tokens for WordPress/Shopify
  oauthTokens: defineTable({
    clientId: v.id("clients"),
    platform: v.string(), // wordpress, shopify
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    tokenExpiry: v.optional(v.number()),
    siteUrl: v.string(), // WordPress site URL or Shopify shop domain
    shopifyShop: v.optional(v.string()),
    wordpressSiteId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_client", ["clientId"])
    .index("by_platform", ["platform"])
    .index("by_client_platform", ["clientId", "platform"]),

  // Generated pages (WordPress/Shopify)
  generatedPages: defineTable({
    clientId: v.id("clients"),
    platform: v.string(), // wordpress, shopify
    pageId: v.string(), // External page ID
    pageUrl: v.string(),
    title: v.string(),
    content: v.string(),
    keywords: v.array(v.string()),
    status: v.string(), // draft, published, failed
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_client", ["clientId"])
    .index("by_platform", ["platform"])
    .index("by_status", ["status"]),

  // Rank tracking
  rankings: defineTable({
    clientId: v.id("clients"),
    keyword: v.string(),
    position: v.number(),
    url: v.string(),
    searchEngine: v.string(), // google, bing
    location: v.optional(v.string()),
    date: v.number(),
  })
    .index("by_client", ["clientId"])
    .index("by_keyword", ["keyword"])
    .index("by_client_keyword", ["clientId", "keyword"])
    .index("by_date", ["date"]),

  // SEO Statistics/Reports
  seoStatistics: defineTable({
    clientId: v.id("clients"),
    // Traffic metrics
    organicTraffic: v.optional(v.number()),
    organicKeywords: v.optional(v.number()),
    backlinks: v.optional(v.number()),
    referringDomains: v.optional(v.number()),
    // Performance metrics
    avgPosition: v.optional(v.number()),
    clickThroughRate: v.optional(v.number()),
    impressions: v.optional(v.number()),
    // Date range
    periodStart: v.number(),
    periodEnd: v.number(),
    createdAt: v.number(),
  })
    .index("by_client", ["clientId"])
    .index("by_period", ["periodStart", "periodEnd"]),
});

