import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { authTables } from '@convex-dev/auth/server';

export default defineSchema({
  ...authTables,

  // Users - Extended for MartAI
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerified: v.optional(v.string()),
    // Custom fields
    role: v.optional(
      v.union(v.literal('super_admin'), v.literal('admin'), v.literal('user'), v.literal('viewer'))
    ),
    membershipTier: v.optional(
      v.union(v.literal('free'), v.literal('starter'), v.literal('growth'), v.literal('pro'))
    ),
    bio: v.optional(v.string()),
    preferences: v.optional(
      v.object({
        theme: v.optional(v.union(v.literal('light'), v.literal('dark'), v.literal('auto'))),
        notifications: v.optional(v.boolean()),
        timezone: v.optional(v.string()),
      })
    ),
    createdAt: v.optional(v.number()), // Auth doesn't enforce this but good to have
    updatedAt: v.optional(v.number()),
    onboardingStatus: v.optional(v.string()), // 'in_progress', 'completed'
    // Legacy auth fields (for backward compatibility)
    passwordHash: v.optional(v.string()),
  })
    .index('email', ['email'])
    .index('by_role', ['role']),

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
    .index('by_user', ['userId'])
    .index('by_website', ['website']),

  // SEO Audits
  seoAudits: defineTable({
    clientId: v.id('clients'),
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
    .index('by_client', ['clientId'])
    .index('by_website', ['website']),

  // Keywords
  keywords: defineTable({
    projectId: v.id('projects'),
    keyword: v.string(),
    searchVolume: v.optional(v.number()),
    difficulty: v.optional(v.number()),
    cpc: v.optional(v.number()),
    intent: v.optional(v.string()), // informational, commercial, transactional
    priority: v.optional(v.string()), // high, medium, low
    status: v.string(), // suggested, approved, implemented
    createdAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_status', ['status'])
    .index('by_keyword', ['keyword']),

  // OAuth tokens for WordPress/Shopify
  oauthTokens: defineTable({
    clientId: v.id('clients'),
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
    .index('by_client', ['clientId'])
    .index('by_platform', ['platform'])
    .index('by_client_platform', ['clientId', 'platform']),

  // Generated pages (WordPress/Shopify)
  generatedPages: defineTable({
    clientId: v.id('clients'),
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
    .index('by_client', ['clientId'])
    .index('by_platform', ['platform'])
    .index('by_status', ['status']),

  // Rank tracking
  rankings: defineTable({
    projectId: v.id('projects'),
    keyword: v.string(),
    position: v.number(),
    url: v.string(),
    searchEngine: v.string(), // google, bing
    location: v.optional(v.string()),
    date: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_keyword', ['keyword'])
    .index('by_project_keyword', ['projectId', 'keyword'])
    .index('by_date', ['date']),

  // SEO Statistics/Reports
  seoStatistics: defineTable({
    clientId: v.id('clients'),
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
    .index('by_client', ['clientId'])
    .index('by_period', ['periodStart', 'periodEnd']),

  // Users (legacy - migrating to Convex Auth)
  legacyUsers: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    passwordHash: v.string(), // bcrypt hash
    role: v.optional(
      v.union(v.literal('super_admin'), v.literal('admin'), v.literal('user'), v.literal('viewer'))
    ), // User role: super_admin, admin, user, viewer
    avatarUrl: v.optional(v.string()), // User profile picture
    bio: v.optional(v.string()), // User bio/description
    preferences: v.optional(
      v.object({
        theme: v.optional(v.union(v.literal('light'), v.literal('dark'), v.literal('auto'))),
        notifications: v.optional(v.boolean()),
        timezone: v.optional(v.string()),
      })
    ),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index('by_email', ['email'])
    .index('by_role', ['role']),

  // Sessions (legacy - migrating to Convex Auth)
  legacySessions: defineTable({
    userId: v.id('legacyUsers'),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_token', ['token']),

  // Prospect intake (lead capture)
  prospects: defineTable({
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    companyName: v.optional(v.string()),
    monthlyRevenue: v.optional(v.string()),
    marketingFrustration: v.optional(v.string()),
    investedBefore: v.optional(v.string()),
    timeline: v.optional(v.string()),
    source: v.optional(v.string()),
    status: v.string(), // draft, initial_submitted, details_submitted
    userId: v.optional(v.id('users')),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_email', ['email'])
    .index('by_status', ['status'])
    .index('by_user', ['userId']),

  prospectDetails: defineTable({
    prospectId: v.id('prospects'),
    businessName: v.optional(v.string()),
    topPriority: v.optional(v.string()),
    marketingTried: v.optional(v.string()),
    goals: v.optional(v.string()),
    supportNeeds: v.optional(v.array(v.string())),
    idealOutcome: v.optional(v.string()),
    additionalNotes: v.optional(v.string()),
    hearAbout: v.optional(v.string()),
    sendSms: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_prospect', ['prospectId']),

  submittedUrls: defineTable({
    prospectId: v.id('prospects'),
    label: v.string(),
    url: v.string(),
    createdAt: v.number(),
  }).index('by_prospect', ['prospectId']),

  aiReports: defineTable({
    prospectId: v.optional(v.id('prospects')),
    projectId: v.optional(v.id('projects')),
    url: v.optional(v.string()),
    status: v.string(), // pending, completed, failed
    summary: v.optional(v.string()),
    metrics: v.object({
      coverageScore: v.optional(v.number()),
      backlinksProxy: v.optional(v.number()),
      domainRatingProxy: v.optional(v.number()),
      organicKeywords: v.optional(v.number()),
      trafficEstimate: v.optional(v.number()),
    }),
    confidence: v.object({
      score: v.number(),
      sources: v.array(v.string()),
    }),
    dataSources: v.optional(v.array(v.string())),
    crawlData: v.optional(
      v.object({
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        wordCount: v.optional(v.number()),
        headings: v.optional(v.array(v.string())),
        loadTime: v.optional(v.number()),
        htmlSample: v.optional(v.string()),
      })
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_prospect', ['prospectId'])
    .index('by_project', ['projectId'])
    .index('by_status', ['status']),

  keywordIdeas: defineTable({
    prospectId: v.optional(v.id('prospects')),
    projectId: v.optional(v.id('projects')),
    primaryKeyword: v.string(),
    supportingKeywords: v.optional(v.array(v.string())),
    intent: v.optional(v.string()),
    trafficPotential: v.optional(v.number()),
    kdScore: v.optional(v.number()),
    cpc: v.optional(v.number()),
    entities: v.optional(v.array(v.string())),
    serpNotes: v.optional(v.string()),
    priority: v.optional(v.string()),
    status: v.string(), // candidate, shortlisted, scheduled
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_prospect', ['prospectId'])
    .index('by_project', ['projectId'])
    .index('by_keyword', ['primaryKeyword']),

  contentCalendars: defineTable({
    prospectId: v.optional(v.id('prospects')),
    projectId: v.optional(v.id('projects')),
    title: v.string(),
    contentType: v.string(),
    primaryKeyword: v.optional(v.string()),
    supportingKeywords: v.optional(v.array(v.string())),
    status: v.string(), // idea, scheduled, published
    publishDate: v.optional(v.number()),
    notes: v.optional(v.string()),
    heroOffer: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_status', ['status'])
    .index('by_prospect', ['prospectId'])
    .index('by_publish_date', ['publishDate']),

  subscriptions: defineTable({
    userId: v.id('users'),
    planTier: v.string(), // starter, growth, scale
    status: v.string(), // active, past_due, cancelled
    features: v.object({
      maxUrls: v.number(),
      maxKeywordIdeas: v.number(),
      maxAiReports: v.number(),
      maxContentPieces: v.number(),
    }),
    priceMonthly: v.number(),
    oneTimeFeePaid: v.optional(v.boolean()),
    startsAt: v.number(),
    renewsAt: v.optional(v.number()),
    cancelAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_status', ['status']),

  usageLimits: defineTable({
    userId: v.id('users'),
    periodStart: v.number(),
    periodEnd: v.number(),
    urlsAnalyzed: v.number(),
    keywordIdeasGenerated: v.number(),
    aiReportsGenerated: v.number(),
    contentPiecesPlanned: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user_period', ['userId', 'periodStart'])
    .index('by_user_period_end', ['userId', 'periodEnd']),

  // Projects (user's SEO projects)
  projects: defineTable({
    userId: v.id('users'),
    name: v.string(),
    websiteUrl: v.string(),
    industry: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_user', ['userId']),

  // GA4 Connections
  ga4Connections: defineTable({
    projectId: v.id('projects'),
    propertyId: v.string(),
    propertyName: v.string(),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    lastSync: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_project', ['projectId']),

  // GSC Connections
  gscConnections: defineTable({
    projectId: v.id('projects'),
    siteUrl: v.string(),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    lastSync: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_project', ['projectId']),

  // Keyword Clusters
  keywordClusters: defineTable({
    projectId: v.id('projects'),
    clusterName: v.string(),
    keywords: v.array(v.string()),
    intent: v.string(), // informational, commercial, transactional, navigational
    difficulty: v.number(), // 0-100
    volumeRange: v.object({
      min: v.number(),
      max: v.number(),
    }),
    impactScore: v.number(), // 0-1, calculated
    topSerpUrls: v.array(v.string()),
    status: v.string(), // active, hidden, favorite
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_status', ['status']),

  // Quarterly Plans
  quarterlyPlans: defineTable({
    projectId: v.id('projects'),
    contentVelocity: v.number(), // posts per week
    startDate: v.number(), // timestamp
    goals: v.object({
      traffic: v.optional(v.number()),
      leads: v.optional(v.number()),
      revenue: v.optional(v.number()),
    }),
    assumptions: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_project', ['projectId']),

  // Briefs
  briefs: defineTable({
    planId: v.optional(v.id('quarterlyPlans')),
    projectId: v.id('projects'),
    clusterId: v.optional(v.id('keywordClusters')),
    title: v.string(),
    scheduledDate: v.number(),
    status: v.string(), // planned, in_progress, approved, published
    // Brief details
    titleOptions: v.optional(v.array(v.string())),
    h2Outline: v.optional(v.array(v.string())),
    faqs: v.optional(
      v.array(
        v.object({
          question: v.string(),
          answer: v.string(),
        })
      )
    ),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    internalLinks: v.optional(v.array(v.string())),
    schema: v.optional(v.any()),
    schemaSuggestion: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_plan', ['planId'])
    .index('by_project', ['projectId'])
    .index('by_status', ['status']),

  // Drafts
  drafts: defineTable({
    briefId: v.id('briefs'),
    projectId: v.id('projects'),
    content: v.string(), // Markdown
    qualityScore: v.optional(v.number()), // 0-100
    toneScore: v.optional(v.number()), // 0-100
    wordCount: v.optional(v.number()),
    status: v.string(), // draft, approved, published
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_brief', ['briefId'])
    .index('by_project', ['projectId'])
    .index('by_status', ['status']),

  // Scheduled Posts
  scheduledPosts: defineTable({
    draftId: v.id('drafts'),
    projectId: v.id('projects'),
    briefId: v.id('briefs'),
    publishDate: v.number(), // timestamp
    timezone: v.string(),
    platform: v.string(), // wordpress, shopify
    tags: v.array(v.string()),
    categories: v.array(v.string()),
    slug: v.optional(v.string()),
    status: v.string(), // scheduled, publishing, published, failed, cancelled
    publishedUrl: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_status', ['status'])
    .index('by_publish_date', ['publishDate']),

  // Analytics Data
  analyticsData: defineTable({
    projectId: v.id('projects'),
    date: v.number(), // timestamp
    source: v.string(), // ga4, gsc
    sessions: v.optional(v.number()),
    clicks: v.optional(v.number()),
    impressions: v.optional(v.number()),
    ctr: v.optional(v.number()),
    avgPosition: v.optional(v.number()),
    leads: v.optional(v.number()),
    revenue: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_project_date', ['projectId', 'date'])
    .index('by_project_date_source', ['projectId', 'date', 'source']),

  // Insights
  insights: defineTable({
    projectId: v.id('projects'),
    type: v.string(), // top_gainer, underperformer, quick_win
    title: v.string(),
    description: v.string(),
    action: v.optional(v.string()),
    metadata: v.optional(v.any()),
    status: v.string(), // active, applied, dismissed
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_type', ['type']),

  // Brief Versions (version history)
  briefVersions: defineTable({
    briefId: v.id('briefs'),
    versionNumber: v.number(),
    data: v.any(), // Snapshot of brief data
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_brief', ['briefId'])
    .index('by_brief_version', ['briefId', 'versionNumber']),

  // Competitors
  competitors: defineTable({
    projectId: v.id('projects'),
    domain: v.string(),
    priority: v.optional(v.number()), // 1-5
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_priority', ['priority']),

  // Competitor / Ad-hoc Analytics
  competitorAnalytics: defineTable({
    userId: v.id('users'),
    url: v.string(),
    metrics: v.object({
      traffic: v.optional(v.number()),
      keywords: v.optional(v.number()),
      domainAuthority: v.optional(v.number()),
    }),
    status: v.string(), // pending, completed, failed
    metadata: v.optional(v.any()), // Extended data (technologies, social, etc.)
    cost: v.optional(v.number()), // tracked via neutral-cost
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_url', ['url'])
    .index('by_user_url', ['userId', 'url']),

  // AI Generations (Persistent Cache & Audit Log)
  aiGenerations: defineTable({
    inputHash: v.string(), // SHA-256 of sorted input args
    operation: v.string(), // e.g. generateKeywordClusters
    provider: v.optional(v.string()), // e.g. openai
    model: v.optional(v.string()), // e.g. gpt-4o
    inputArgs: v.any(), // Full input arguments
    output: v.any(), // Full output response
    tokensIn: v.optional(v.number()),
    tokensOut: v.optional(v.number()),
    cost: v.optional(v.number()),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index('by_hash', ['inputHash'])
    .index('by_operation', ['operation'])
    .index('by_date', ['createdAt']),
  // AI Personas
  personas: defineTable({
    name: v.string(), // Unique key e.g. "Mart"
    role: v.string(), // e.g. "Senior SEO Analyst"
    tone: v.string(), // e.g. "Direct, Professional"
    systemPrompt: v.string(), // The core instructions
    isDefault: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_name', ['name'])
    .index('by_default', ['isDefault']),
});
