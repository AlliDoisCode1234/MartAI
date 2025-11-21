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

  // Users (for auth)
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    passwordHash: v.string(), // bcrypt hash
    createdAt: v.number(),
  })
    .index("by_email", ["email"]),

  // Sessions (for auth)
  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_token", ["token"]),

  // Projects (user's SEO projects)
  projects: defineTable({
    userId: v.id("users"),
    name: v.string(),
    websiteUrl: v.string(),
    industry: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  // GA4 Connections
  ga4Connections: defineTable({
    projectId: v.id("projects"),
    propertyId: v.string(),
    propertyName: v.string(),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    lastSync: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"]),

  // GSC Connections
  gscConnections: defineTable({
    projectId: v.id("projects"),
    siteUrl: v.string(),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    lastSync: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"]),

  // Projects (renamed from clients for PRD alignment)
  projects: defineTable({
    userId: v.id("users"),
    name: v.string(), // Business name
    website: v.string(),
    industry: v.string(),
    targetAudience: v.optional(v.string()),
    competitors: v.optional(v.array(v.string())), // Up to 5
    goals: v.optional(v.string()),
    brandVoice: v.optional(v.string()), // URLs/text samples
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_website", ["website"]),

  // GA4 Connections
  ga4Connections: defineTable({
    projectId: v.id("projects"),
    propertyId: v.string(),
    propertyName: v.string(),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    lastSync: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"]),

  // Google Search Console Connections
  gscConnections: defineTable({
    projectId: v.id("projects"),
    siteUrl: v.string(),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    lastSync: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"]),

  // Keyword Clusters (MVP P0)
  keywordClusters: defineTable({
    projectId: v.id("projects"),
    clusterName: v.string(),
    keywords: v.array(v.string()),
    intent: v.string(), // informational, commercial, transactional, navigational
    difficulty: v.optional(v.number()),
    volumeRange: v.optional(v.object({
      min: v.number(),
      max: v.number(),
    })),
    serpUrls: v.optional(v.array(v.string())),
    impactScore: v.number(), // volume_weight*volume + intent_weight*intent - difficulty_weight*difficulty
    status: v.string(), // active, hidden, favorite
    createdAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_impact", ["impactScore"]),

  // Quarterly Plans (MVP P0)
  quarterlyPlans: defineTable({
    projectId: v.id("projects"),
    startDate: v.number(),
    endDate: v.number(),
    contentVelocity: v.number(), // posts per week (1-4)
    version: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_dates", ["startDate", "endDate"]),

  // Briefs (MVP P0)
  briefs: defineTable({
    planId: v.id("quarterlyPlans"),
    clusterId: v.optional(v.id("keywordClusters")),
    titleOptions: v.array(v.string()),
    h2Outline: v.array(v.string()),
    faqs: v.array(v.string()),
    metaTitle: v.optional(v.string()),
    metaDesc: v.optional(v.string()),
    internalLinks: v.array(v.string()),
    schemaSuggestion: v.optional(v.string()),
    status: v.string(), // draft, ready, in_progress
    scheduledDate: v.optional(v.number()),
    version: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_plan", ["planId"])
    .index("by_status", ["status"])
    .index("by_date", ["scheduledDate"]),

  // Drafts (MVP P0)
  drafts: defineTable({
    briefId: v.id("briefs"),
    content: v.string(), // Markdown
    wordCount: v.number(),
    qualityScore: v.optional(v.number()),
    toneScore: v.optional(v.number()),
    seoChecklist: v.object({
      titleLength: v.boolean(),
      h2Density: v.boolean(),
      faqsPresent: v.boolean(),
      internalLinks: v.boolean(),
      schemaPresent: v.boolean(),
    }),
    status: v.string(), // draft, approved, published
    approvedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_brief", ["briefId"])
    .index("by_status", ["status"]),

  // Scheduled Posts (MVP P0)
  scheduledPosts: defineTable({
    draftId: v.id("drafts"),
    cmsPlatform: v.string(), // wordpress, shopify, webflow
    publishDate: v.number(),
    timezone: v.string(),
    tags: v.array(v.string()),
    categories: v.array(v.string()),
    slug: v.string(),
    status: v.string(), // scheduled, published, failed
    cmsUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_draft", ["draftId"])
    .index("by_status", ["status"])
    .index("by_date", ["publishDate"]),
});

