import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { authTables } from '@convex-dev/auth/server';

/**
 * MartAI Convex Schema
 *
 * 55 Tables organized by domain:
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ SECTION                    │ TABLES              │ LINES      │
 * ├────────────────────────────────────────────────────────────────┤
 * │ 1. Auth & Users            │ users               │ ~9-100     │
 * │ 2. Clients & Legacy        │ clients, legacy*    │ ~105-280   │
 * │ 3. Prospects & Leads       │ prospects, details  │ ~281-365   │
 * │ 4. Projects & Orgs         │ projects, ga4, gsc  │ ~474-560   │
 * │ 5. SEO & Keywords          │ keywords, clusters  │ ~158-230   │
 * │ 6. Content Creation        │ briefs, drafts,     │ ~560-720   │
 * │                            │ contentPieces, etc  │            │
 * │ 7. Analytics & Insights    │ analyticsData, gsc  │ ~728-810   │
 * │ 8. AI & Generation         │ aiReports, routing  │ ~330-370   │
 * │                            │ providers, health   │ ~1208-1295 │
 * │ 9. Billing & Usage         │ subscriptions, api  │ ~417-470   │
 * │ 10. Platform & Webhooks    │ webhooks, platform  │ ~680-1075  │
 * │ 11. Organizations          │ orgs, teams, invites│ ~927-1014  │
 * │ 12. DEPRECATED             │ legacyUsers/Sessions│ ~248-280   │
 * │                            │ briefs, drafts      │ ~560-615   │
 * └────────────────────────────────────────────────────────────────┘
 *
 * Cleanup Status:
 * - [x] Phase 1: Legacy auth tables deprecated
 * - [x] Phase 2: Content migration scripts ready
 * - [ ] Phase 3: Remove deprecated tables (after migration)
 */

export default defineSchema({
  ...authTables,

  // ============================================================================
  // SECTION 1: AUTH & USERS
  // ============================================================================

  // Users - Extended for MartAI
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerified: v.optional(v.string()),
    emailVerificationTime: v.optional(v.float64()), // For @convex-dev/auth OAuth
    // Custom fields
    role: v.optional(
      v.union(v.literal('super_admin'), v.literal('admin'), v.literal('user'), v.literal('viewer'))
    ),
    membershipTier: v.optional(
      v.union(
        v.literal('free'),
        v.literal('solo'), // Canonical entry tier
        v.literal('starter'), // Legacy alias for solo
        v.literal('growth'), // Canonical mid tier
        v.literal('team'), // Team tier ($299/mo)
        v.literal('pro'), // Legacy alias for growth
        v.literal('enterprise') // Canonical top tier
      )
    ),
    bio: v.optional(v.string()),
    preferences: v.optional(
      v.object({
        theme: v.optional(v.union(v.literal('light'), v.literal('dark'), v.literal('auto'))),
        notifications: v.optional(v.boolean()),
        timezone: v.optional(v.string()),
      })
    ),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    // Onboarding status - optional since Convex Auth creates users automatically
    // undefined = not_started, code treats missing as needing onboarding
    onboardingStatus: v.optional(
      v.union(v.literal('not_started'), v.literal('in_progress'), v.literal('completed'))
    ),
    // Granular onboarding step tracking
    onboardingSteps: v.optional(
      v.object({
        signupCompleted: v.optional(v.boolean()),
        signupCompletedAt: v.optional(v.number()),
        organizationCreated: v.optional(v.boolean()),
        organizationCreatedAt: v.optional(v.number()),
        planSelected: v.optional(v.string()), // 'starter', 'growth', 'pro'
        planSelectedAt: v.optional(v.number()),
        paymentCompleted: v.optional(v.boolean()),
        paymentCompletedAt: v.optional(v.number()),
        projectCreated: v.optional(v.boolean()),
        projectCreatedAt: v.optional(v.number()),
        ga4Connected: v.optional(v.boolean()),
        ga4ConnectedAt: v.optional(v.number()),
        gscConnected: v.optional(v.boolean()),
        gscConnectedAt: v.optional(v.number()),
      })
    ),
    lastActiveAt: v.optional(v.number()),
    // Prospect conversion tracking
    previousProspect: v.optional(v.boolean()),
    prospectConvertedAt: v.optional(v.number()),
    prospectId: v.optional(v.id('prospects')),
    // Engagement milestones for funnel tracking (ADMIN-003)
    engagementMilestones: v.optional(
      v.object({
        // First-time events (timestamps)
        firstKeywordCreatedAt: v.optional(v.number()),
        firstClusterCreatedAt: v.optional(v.number()),
        firstBriefCreatedAt: v.optional(v.number()),
        firstDraftCreatedAt: v.optional(v.number()),
        firstContentPublishedAt: v.optional(v.number()),
        firstGa4ConnectedAt: v.optional(v.number()),
        firstGscConnectedAt: v.optional(v.number()),
        firstWordPressConnectedAt: v.optional(v.number()),
        // Totals (counters)
        totalKeywords: v.optional(v.number()),
        totalClusters: v.optional(v.number()),
        totalBriefs: v.optional(v.number()),
        totalDrafts: v.optional(v.number()),
        totalPublished: v.optional(v.number()),
      })
    ),
    // Legacy auth fields (for backward compatibility)
    passwordHash: v.optional(v.string()),
    // Account status (separate from subscription)
    accountStatus: v.optional(
      v.union(
        v.literal('active'),
        v.literal('inactive'),
        v.literal('churned'),
        v.literal('suspended') // Admin action
      )
    ),
    // Churn tracking
    churnedAt: v.optional(v.number()),
    churnReason: v.optional(v.string()),
    reactivatedAt: v.optional(v.number()),
    // Beta user tracking (expires 6 months after onboarding completion)
    isBetaUser: v.optional(v.boolean()),
    betaExpiresAt: v.optional(v.number()), // Unix timestamp - calculated as onboardingCompletedAt + 6 months
    betaNotes: v.optional(v.string()), // Admin notes about beta user
    // Founding Member badge - permanent, never expires (for beta cohort recognition)
    isFoundingMember: v.optional(v.boolean()),
    foundingMemberCohort: v.optional(v.string()), // e.g., "Beta 2026"
    // Payment tracking (synced from subscription)
    lastPaymentAt: v.optional(v.number()),
    // Stripe customer ID for billing
    stripeCustomerId: v.optional(v.string()),
    // Team Management: Which organization this user belongs to
    organizationId: v.optional(v.id('organizations')),
    // Acquisition tracking - how user was acquired
    acquisitionSource: v.optional(
      v.union(
        v.literal('waitlist_beta'), // Phoo.ai beta waitlist
        v.literal('organic'), // Direct signup
        v.literal('referral'), // Referred by another user
        v.literal('partner'), // Partner/affiliate
        v.literal('paid'), // Paid advertising
        v.literal('migration') // Migrated from legacy system
      )
    ),
    acquisitionMetadata: v.optional(
      v.object({
        utmSource: v.optional(v.string()),
        utmMedium: v.optional(v.string()),
        utmCampaign: v.optional(v.string()),
        referrer: v.optional(v.string()),
        waitlistId: v.optional(v.id('waitlist')), // Link to original waitlist entry
      })
    ),
    acquisitionDate: v.optional(v.number()),
  })
    .index('email', ['email'])
    .index('by_role', ['role'])
    .index('by_account_status', ['accountStatus'])
    .index('by_acquisition_source', ['acquisitionSource']),

  // Beta Access Codes - Gates login for closed beta
  betaCodes: defineTable({
    code: v.string(), // Unique access code (e.g., "PHOO-A1B2C3")
    status: v.union(
      v.literal('active'),
      v.literal('sent'),
      v.literal('used'),
      v.literal('revoked')
    ),
    createdAt: v.number(),
    expiresAt: v.number(), // Required - codes expire (default 7 days)
    sentAt: v.optional(v.number()), // When email was sent
    sentTo: v.optional(v.string()), // Email address
    usedAt: v.optional(v.number()),
    usedBy: v.optional(v.id('users')),
    metadata: v.optional(
      v.object({
        batch: v.optional(v.string()), // e.g., "founding-101"
        label: v.optional(v.string()), // Admin notes
      })
    ),
  })
    .index('by_code', ['code'])
    .index('by_status', ['status'])
    .index('by_sent_to', ['sentTo']),

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
    clientId: v.optional(v.id('clients')), // Optional for backwards compatibility
    projectId: v.optional(v.id('projects')), // New SaaS link
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
    .index('by_project', ['projectId'])
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
    source: v.optional(v.string()), // 'intelligence', 'gsc', 'import', 'serp'
    phase: v.optional(v.string()), // 'foundation', 'authority', 'conversion'
    createdAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_status', ['status'])
    .index('by_keyword', ['keyword'])
    .index('by_project_source', ['projectId', 'source'])
    .index('by_project_phase', ['projectId', 'phase']),

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

  // Prospect intake (lead capture)
  prospects: defineTable({
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    companyName: v.optional(v.string()),
    // Onboarding-specific fields
    websiteUrl: v.optional(v.string()),
    planSelected: v.optional(v.string()),
    // Legacy fields
    monthlyRevenue: v.optional(v.string()),
    marketingFrustration: v.optional(v.string()),
    investedBefore: v.optional(v.string()),
    timeline: v.optional(v.string()),
    source: v.optional(v.string()),
    status: v.string(), // draft, initial_submitted, details_submitted, converted
    userId: v.optional(v.id('users')),
    // Conversion tracking
    convertedAt: v.optional(v.number()),
    convertedUserId: v.optional(v.id('users')),
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
    briefId: v.optional(v.id('briefs')), // Link to content brief
    title: v.string(), // "Exact Title To Use"
    contentType: v.string(),
    pageType: v.optional(v.string()), // homepage | service | blog | about | product
    primaryKeyword: v.optional(v.string()),
    supportingKeywords: v.optional(v.array(v.string())),
    targetKeywords: v.optional(
      v.array(
        v.object({
          keywordId: v.optional(v.id('keywords')), // Link to keyword table
          keyword: v.string(),
          volume: v.optional(v.number()),
        })
      )
    ),
    status: v.string(), // idea, scheduled, in_progress, published
    publishDate: v.optional(v.number()),
    notes: v.optional(v.string()), // Content pillar, theme, notes
    heroOffer: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_status', ['status'])
    .index('by_prospect', ['prospectId'])
    .index('by_publish_date', ['publishDate'])
    .index('by_project_date', ['projectId', 'publishDate'])
    .index('by_page_type', ['projectId', 'pageType']),

  subscriptions: defineTable({
    userId: v.id('users'),
    planTier: v.string(), // solo, growth, enterprise
    // Subscription lifecycle status
    status: v.union(
      v.literal('active'),
      v.literal('trialing'),
      v.literal('grace_period'),
      v.literal('maintenance_mode'),
      v.literal('past_due'),
      v.literal('cancelled'),
      v.literal('expired')
    ),
    // Billing cycle
    billingCycle: v.optional(v.union(v.literal('monthly'), v.literal('annual'))),
    features: v.object({
      maxUrls: v.number(),
      maxKeywordIdeas: v.number(),
      maxAiReports: v.number(),
      maxContentPieces: v.number(),
      maxTeamMembers: v.optional(v.number()), // Added Jan 2026 for team tier
    }),
    priceMonthly: v.number(),
    oneTimeFeePaid: v.optional(v.boolean()),
    startsAt: v.number(),
    renewsAt: v.optional(v.number()),
    cancelAt: v.optional(v.number()),
    // Stripe billing integration
    stripeSubscriptionId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    // Grace period and maintenance mode tracking
    graceStartedAt: v.optional(v.number()),
    maintenanceStartedAt: v.optional(v.number()),
    // Payment tracking
    lastPaymentAt: v.optional(v.number()),
    lastPaymentFailedAt: v.optional(v.number()),
    failedPaymentCount: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_status', ['status'])
    .index('by_stripe_subscription', ['stripeSubscriptionId'])
    .index('by_status_grace_start', ['status', 'graceStartedAt']),

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
    // Phase 3: Organization support (optional for backward compatibility)
    organizationId: v.optional(v.id('organizations')),
    name: v.string(),
    websiteUrl: v.string(),
    industry: v.optional(v.string()),
    // PROJ-001: Project type differentiates own vs competitor projects
    projectType: v.optional(v.union(v.literal('own'), v.literal('competitor'))),
    // URL locked after creation - cannot be changed (PROJ-001)
    urlLocked: v.optional(v.boolean()),
    // SERP analysis quota tracking (1 per project included)
    serpAnalysisUsed: v.optional(v.boolean()),
    // Additional context fields from onboarding
    targetAudience: v.optional(v.string()),
    businessGoals: v.optional(v.string()),
    competitors: v.optional(v.array(v.string())),
    // Generation status for onboarding progress visibility
    generationStatus: v.optional(
      v.union(v.literal('idle'), v.literal('generating'), v.literal('complete'), v.literal('error'))
    ),
    // Connected CMS platforms for capability-aware publishing
    connectedPlatforms: v.optional(
      v.array(
        v.union(
          v.literal('wordpress'),
          v.literal('shopify'),
          v.literal('wix'),
          v.literal('webflow')
        )
      )
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_org', ['organizationId'])
    .index('by_type', ['projectType']),

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

  // Content Quality Checks (Plagiarism & AI Detection)
  contentChecks: defineTable({
    contentPieceId: v.id('contentPieces'),
    projectId: v.id('projects'),
    // Check results
    plagiarismScore: v.number(), // 0-100, higher = more unique
    aiScore: v.number(), // 0-100, higher = more AI-like
    readabilityScore: v.optional(v.number()), // 0-100
    // Overall status
    status: v.union(v.literal('pass'), v.literal('warning'), v.literal('fail')),
    // Detailed results
    details: v.optional(
      v.object({
        flaggedSentences: v.optional(
          v.array(
            v.object({
              text: v.string(),
              aiProbability: v.number(),
            })
          )
        ),
        plagiarismMatches: v.optional(
          v.array(
            v.object({
              text: v.string(),
              source: v.string(),
              matchPercentage: v.number(),
            })
          )
        ),
      })
    ),
    // API response metadata
    provider: v.optional(v.string()), // 'originality.ai', 'gptzero', etc.
    rawResponse: v.optional(v.any()), // Store full API response for debugging
    checkedAt: v.number(),
    createdAt: v.number(),
  })
    .index('by_content_piece', ['contentPieceId'])
    .index('by_project', ['projectId'])
    .index('by_status', ['status']),

  // Scheduled Posts
  // NOTE: Some legacy documents may have draftId/briefId instead of contentPieceId.
  // These should be migrated or deleted from the Convex dashboard.
  scheduledPosts: defineTable({
    contentPieceId: v.optional(v.id('contentPieces')), // Optional for legacy data migration
    projectId: v.id('projects'),
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

  // Platform Connections (WordPress, Shopify, etc.)
  platformConnections: defineTable({
    projectId: v.id('projects'),
    platform: v.union(
      v.literal('wordpress'),
      v.literal('shopify'),
      v.literal('wix'),
      v.literal('webflow'),
      v.literal('ghost')
    ),
    // Connection details
    siteUrl: v.string(),
    siteName: v.optional(v.string()),
    credentials: v.object({
      username: v.optional(v.string()),
      applicationPassword: v.optional(v.string()), // WordPress App Password
      apiKey: v.optional(v.string()), // Shopify/other APIs
      accessToken: v.optional(v.string()),
      refreshToken: v.optional(v.string()),
    }),
    // Validation status
    isValid: v.boolean(),
    lastValidatedAt: v.optional(v.number()),
    validationError: v.optional(v.string()),
    // User capabilities on the platform
    capabilities: v.optional(
      v.object({
        canPublishPosts: v.optional(v.boolean()),
        canPublishPages: v.optional(v.boolean()),
        canUploadMedia: v.optional(v.boolean()),
        canManageCategories: v.optional(v.boolean()),
      })
    ),
    // Default publish settings
    defaultPostType: v.optional(v.union(v.literal('post'), v.literal('page'))),
    defaultStatus: v.optional(
      v.union(v.literal('draft'), v.literal('publish'), v.literal('private'))
    ),
    defaultCategories: v.optional(v.array(v.string())),
    defaultTags: v.optional(v.array(v.string())),
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_project_platform', ['projectId', 'platform'])
    .index('by_platform', ['platform']),

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
    // Expanded GA4 metrics
    pageViews: v.optional(v.number()),
    bounceRate: v.optional(v.number()),
    avgSessionDuration: v.optional(v.number()),
    newUsers: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_project_date', ['projectId', 'date'])
    .index('by_project_date_source', ['projectId', 'date', 'source']),

  // GSC Keyword Snapshots (Historical Tracking)
  gscKeywordSnapshots: defineTable({
    projectId: v.id('projects'),
    syncDate: v.number(), // Date of snapshot
    keyword: v.string(),
    clicks: v.number(),
    impressions: v.number(),
    ctr: v.number(),
    position: v.number(),
  })
    .index('by_project_date', ['projectId', 'syncDate'])
    .index('by_project_keyword', ['projectId', 'keyword']),

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

  // MartAI Rating (MR) Historical Scores
  projectScores: defineTable({
    projectId: v.id('projects'),
    date: v.number(),
    // Overall MR score (0-100)
    overall: v.number(),
    // Tier: 'needs_work' | 'fair' | 'good' | 'really_good' | 'excellent' | 'super' | 'top_performer'
    tier: v.string(),
    // Component scores (0-100 each)
    visibility: v.number(),
    trafficHealth: v.number(),
    ctrPerformance: v.number(),
    engagementQuality: v.number(),
    quickWinPotential: v.number(),
    contentVelocity: v.number(),
    // Raw metrics for debugging
    rawMetrics: v.optional(
      v.object({
        avgPosition: v.optional(v.number()),
        sessionsChange: v.optional(v.number()),
        ctr: v.optional(v.number()),
        bounceRate: v.optional(v.number()),
        quickWinCount: v.optional(v.number()),
        briefsThisMonth: v.optional(v.number()),
      })
    ),
  })
    .index('by_project_date', ['projectId', 'date'])
    .index('by_project', ['projectId']),

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

  // Content Templates (AI prompts + SEO checklists per page type)
  contentTemplates: defineTable({
    projectId: v.optional(v.id('projects')), // null = global template
    pageType: v.string(), // blog | service | homepage | about | product
    name: v.string(),
    promptTemplate: v.string(), // AI prompt with {{placeholders}}
    seoChecklist: v.optional(
      v.array(
        v.object({
          rule: v.string(),
          value: v.optional(v.string()),
        })
      )
    ),
    wordCountTarget: v.optional(v.number()),
    isDefault: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_page_type', ['pageType'])
    .index('by_default', ['isDefault']),

  // Global Keyword Library (Admin Managed)
  keywordLibrary: defineTable({
    keyword: v.string(),
    searchVolume: v.number(),
    difficulty: v.number(),
    cpc: v.optional(v.number()),
    intent: v.string(), // e.g. informational
    // The embedding vector (1536 dimensions for text-embedding-3-small)
    embedding: v.array(v.float64()),
    // Metadata
    category: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_keyword', ['keyword'])
    .vectorIndex('by_embedding', {
      vectorField: 'embedding',
      dimensions: 1536,
    }),

  // ========================================
  // PHASE 3: ENTERPRISE - Organizations & RBAC
  // ========================================

  // Organizations (Teams/Workspaces)
  organizations: defineTable({
    name: v.string(),
    slug: v.string(), // URL-friendly identifier
    logoUrl: v.optional(v.string()),
    // Billing info
    billingEmail: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    subscriptionId: v.optional(v.string()),
    subscriptionStatus: v.optional(
      v.union(
        v.literal('active'),
        v.literal('canceled'),
        v.literal('past_due'),
        v.literal('trialing')
      )
    ),
    // Plan/tier at org level
    plan: v.optional(
      v.union(
        v.literal('free'),
        v.literal('solo'), // Canonical entry tier
        v.literal('starter'), // Legacy alias for solo
        v.literal('growth'), // Canonical mid tier
        v.literal('team'), // Team tier ($299/mo)
        v.literal('pro'), // Legacy alias for growth
        v.literal('enterprise') // Canonical top tier
      )
    ),
    // Limits
    maxProjects: v.optional(v.number()),
    maxMembers: v.optional(v.number()),
    seatsPurchased: v.optional(v.number()), // For enterprise custom seat counts
    // Owner
    ownerId: v.id('users'),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_slug', ['slug'])
    .index('by_owner', ['ownerId'])
    .index('by_stripe_customer', ['stripeCustomerId']),

  // Team Members (Junction table: User <-> Organization)
  teamMembers: defineTable({
    userId: v.id('users'),
    organizationId: v.id('organizations'),
    // Role within the organization
    role: v.union(
      v.literal('owner'), // Full control, can delete org
      v.literal('admin'), // Can manage members and projects
      v.literal('editor'), // Can edit content
      v.literal('viewer') // Read-only access
    ),
    // Invitation status
    status: v.optional(v.union(v.literal('pending'), v.literal('active'), v.literal('revoked'))),
    invitedBy: v.optional(v.id('users')),
    invitedAt: v.optional(v.number()),
    joinedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_org', ['organizationId'])
    .index('by_user_org', ['userId', 'organizationId'])
    .index('by_org_role', ['organizationId', 'role']),

  // Organization Invitations (for pending invites before user signup)
  organizationInvitations: defineTable({
    organizationId: v.id('organizations'),
    email: v.string(),
    role: v.union(v.literal('admin'), v.literal('editor'), v.literal('viewer')),
    invitedBy: v.id('users'),
    token: v.string(), // Unique invite token
    expiresAt: v.number(),
    status: v.union(
      v.literal('pending'),
      v.literal('accepted'),
      v.literal('expired'),
      v.literal('revoked')
    ),
    createdAt: v.number(),
  })
    .index('by_org', ['organizationId'])
    .index('by_email', ['email'])
    .index('by_token', ['token']),

  // Team Audit Logs (Track all team member changes)
  teamAuditLogs: defineTable({
    organizationId: v.id('organizations'),
    actorId: v.id('users'), // Who performed the action
    targetUserId: v.optional(v.id('users')), // Who was affected
    action: v.union(
      v.literal('member_invited'),
      v.literal('member_joined'),
      v.literal('member_removed'),
      v.literal('role_changed'),
      v.literal('invite_revoked'),
      v.literal('org_name_changed')
    ),
    details: v.optional(
      v.object({
        previousRole: v.optional(v.string()),
        newRole: v.optional(v.string()),
        previousName: v.optional(v.string()),
        newName: v.optional(v.string()),
        email: v.optional(v.string()),
      })
    ),
    createdAt: v.number(),
  })
    .index('by_org', ['organizationId'])
    .index('by_org_date', ['organizationId', 'createdAt']),

  // ========================================
  // PHASE 3: ENTERPRISE - Webhooks
  // ========================================

  // Webhook Endpoints (registered by users/integrations)
  webhooks: defineTable({
    // Owner - can be project or organization level
    projectId: v.optional(v.id('projects')),
    organizationId: v.optional(v.id('organizations')),
    userId: v.id('users'), // Who created it
    // Endpoint config
    name: v.string(),
    url: v.string(), // The webhook endpoint URL
    secret: v.string(), // HMAC secret for signature verification
    // Events to trigger on
    events: v.array(v.string()), // e.g., ['brief.created', 'draft.published', 'insight.generated']
    // Status
    isActive: v.boolean(),
    // Metadata
    description: v.optional(v.string()),
    headers: v.optional(v.any()), // Custom headers to include
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_org', ['organizationId'])
    .index('by_user', ['userId'])
    .index('by_active', ['isActive']),

  // Webhook Delivery Logs (track each delivery attempt)
  webhookDeliveries: defineTable({
    webhookId: v.id('webhooks'),
    // Event details
    event: v.string(), // e.g., 'brief.created'
    payload: v.any(), // The JSON payload sent
    // Delivery status
    status: v.union(
      v.literal('pending'),
      v.literal('success'),
      v.literal('failed'),
      v.literal('retrying')
    ),
    // Response details
    responseStatus: v.optional(v.number()), // HTTP status code
    responseBody: v.optional(v.string()), // Truncated response
    responseTime: v.optional(v.number()), // ms
    // Retry info
    attempts: v.number(),
    maxAttempts: v.number(),
    nextRetryAt: v.optional(v.number()),
    lastAttemptAt: v.optional(v.number()),
    // Error tracking
    error: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_webhook', ['webhookId'])
    .index('by_status', ['status'])
    .index('by_webhook_status', ['webhookId', 'status'])
    .index('by_next_retry', ['nextRetryAt']),

  // ========================================
  // SERP ANALYSIS (Competitor Research)
  // ========================================

  // SERP Analysis Results (1 per project limit, upsell for more)
  serpAnalyses: defineTable({
    projectId: v.id('projects'),
    keyword: v.string(),
    location: v.optional(v.string()), // 'US', 'UK', etc.
    results: v.array(
      v.object({
        position: v.number(),
        url: v.string(),
        domain: v.string(),
        title: v.string(),
        snippet: v.optional(v.string()),
        isAd: v.optional(v.boolean()),
      })
    ),
    // Metadata
    searchVolume: v.optional(v.number()),
    difficulty: v.optional(v.number()),
    analyzedAt: v.number(),
    // Source tracking
    source: v.optional(v.string()), // 'dataforseo', 'serpapi', 'mock'
  })
    .index('by_project', ['projectId'])
    .index('by_keyword', ['keyword'])
    .index('by_project_keyword', ['projectId', 'keyword']),

  // Google SEO Updates - Algorithm changes and announcements from Google Search Central
  seoUpdates: defineTable({
    title: v.string(),
    link: v.string(),
    publishedAt: v.number(), // Original publish date from Google
    summary: v.string(),
    category: v.union(
      v.literal('algorithm'),
      v.literal('feature'),
      v.literal('documentation'),
      v.literal('announcement'),
      v.literal('other')
    ),
    severity: v.union(v.literal('critical'), v.literal('important'), v.literal('informational')),
    // Tracking
    acknowledged: v.boolean(), // Has admin seen this?
    acknowledgedAt: v.optional(v.number()),
    createdAt: v.number(), // When we stored it
  })
    .index('by_severity', ['severity', 'acknowledged'])
    .index('by_published', ['publishedAt'])
    .index('by_link', ['link']),

  // ========================================
  // PUBLIC API
  // ========================================

  // API Access Requests (Lead Gen for Enterprise API)
  apiAccessRequests: defineTable({
    // Contact info
    email: v.string(),
    companyName: v.string(),
    contactName: v.optional(v.string()),
    // Use case info
    useCase: v.string(), // e.g., 'bi_integration', 'automation', 'custom_reports', 'other'
    useCaseDetails: v.optional(v.string()),
    expectedMonthlyVolume: v.string(), // e.g., 'under_100', '100_1000', '1000_10000', 'over_10000'
    // Status tracking
    status: v.union(
      v.literal('pending'),
      v.literal('approved'),
      v.literal('rejected'),
      v.literal('contacted')
    ),
    // Linked user (if they already have an account)
    userId: v.optional(v.id('users')),
    // HubSpot sync
    hubspotContactId: v.optional(v.string()),
    hubspotSyncedAt: v.optional(v.number()),
    // Admin notes
    adminNotes: v.optional(v.string()),
    reviewedBy: v.optional(v.id('users')),
    reviewedAt: v.optional(v.number()),
    // Generated API key (on approval)
    apiKeyId: v.optional(v.id('apiKeys')),
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_email', ['email'])
    .index('by_status', ['status'])
    .index('by_user', ['userId']),

  // API Keys for public API access (Enterprise feature)
  apiKeys: defineTable({
    userId: v.id('users'),
    projectId: v.id('projects'),
    // Key storage (only store hash, prefix for display)
    keyHash: v.string(), // SHA-256 hash of full key
    keyPrefix: v.string(), // First 8 chars for display (mart_xxxx)
    // Metadata
    name: v.string(), // User-friendly name
    description: v.optional(v.string()),
    // Permissions
    permissions: v.array(v.union(v.literal('read'), v.literal('write'), v.literal('admin'))),
    // Usage & Status
    isActive: v.boolean(),
    lastUsedAt: v.optional(v.number()),
    usageCount: v.number(),
    // Expiration
    expiresAt: v.optional(v.number()),
    // Timestamps
    createdAt: v.number(),
    revokedAt: v.optional(v.number()),
  })
    .index('by_key_hash', ['keyHash'])
    .index('by_user', ['userId'])
    .index('by_project', ['projectId'])
    .index('by_active', ['isActive']),

  // ========================================
  // ANALYTICS: Event Tracking for BI
  // ========================================
  analyticsEvents: defineTable({
    userId: v.optional(v.id('users')),
    sessionId: v.optional(v.string()), // UUID for grouping session events
    event: v.string(), // 'click', 'page_view', 'funnel_step', 'error'
    trackId: v.optional(v.string()), // data-track-id attribute value
    properties: v.optional(v.any()), // Additional event data
    url: v.optional(v.string()), // Page URL
    referrer: v.optional(v.string()), // Referrer URL
    userAgent: v.optional(v.string()), // Browser/device info
    timestamp: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_session', ['sessionId'])
    .index('by_event', ['event'])
    .index('by_timestamp', ['timestamp'])
    .index('by_track_id', ['trackId']),

  // ========================================
  // PASSWORD RESET TOKENS
  // ========================================
  passwordResetTokens: defineTable({
    userId: v.id('users'),
    // Token hash (never store raw token)
    tokenHash: v.string(),
    expiresAt: v.number(),
    usedAt: v.optional(v.number()),
    createdAt: v.number(),
    // Admin-triggered flag
    triggeredBy: v.optional(v.id('users')),
  })
    .index('by_user', ['userId'])
    .index('by_token_hash', ['tokenHash'])
    .index('by_expires', ['expiresAt']),

  // ========================================
  // MULTI-AGENT AI INFRASTRUCTURE
  // ========================================

  // AI Providers (OpenAI, Anthropic, Google, etc.)
  aiProviders: defineTable({
    name: v.string(), // 'openai', 'anthropic', 'google'
    displayName: v.string(), // 'OpenAI', 'Anthropic Claude'
    apiKeyEnvVar: v.string(), // 'OPENAI_API_KEY'
    isEnabled: v.boolean(),
    priority: v.number(), // Lower = preferred (1-100)
    // Multi-model selection (INFRA-001)
    defaultModel: v.optional(v.string()), // e.g., 'gpt-4o'
    taskTierModels: v.optional(
      v.object({
        cheap: v.string(), // Model for cheap tasks (summaries, translations)
        standard: v.string(), // Model for standard tasks (content generation)
        premium: v.optional(v.string()), // Model for premium tasks (complex reasoning)
      })
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_name', ['name'])
    .index('by_enabled', ['isEnabled'])
    .index('by_priority', ['priority']),

  // AI Models per provider
  aiModels: defineTable({
    providerId: v.id('aiProviders'),
    modelId: v.string(), // 'gpt-4o', 'claude-3-sonnet'
    displayName: v.string(), // 'GPT-4o', 'Claude 3 Sonnet'
    capabilities: v.array(v.string()), // ['chat', 'embeddings', 'vision']
    contextWindow: v.number(), // 128000
    costPer1kInputTokens: v.number(), // In cents
    costPer1kOutputTokens: v.number(),
    isEnabled: v.boolean(),
    priority: v.number(), // Within provider
    createdAt: v.number(),
  })
    .index('by_provider', ['providerId'])
    .index('by_model', ['modelId']),

  // Provider health metrics
  aiProviderHealth: defineTable({
    providerId: v.id('aiProviders'),
    status: v.union(
      v.literal('healthy'),
      v.literal('degraded'),
      v.literal('unhealthy'),
      v.literal('circuit_open')
    ),
    // Rolling metrics (15-minute window)
    avgLatencyMs: v.number(),
    errorRate: v.number(), // 0.0 to 1.0
    successCount: v.number(),
    errorCount: v.number(),
    // Circuit breaker state
    circuitState: v.union(v.literal('closed'), v.literal('open'), v.literal('half_open')),
    circuitOpenUntil: v.optional(v.number()),
    consecutiveFailures: v.number(),
    consecutiveSuccesses: v.number(),
    // Last events
    lastSuccessAt: v.optional(v.number()),
    lastErrorAt: v.optional(v.number()),
    lastErrorMessage: v.optional(v.string()),
    lastHealthCheckAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_provider', ['providerId'])
    .index('by_status', ['status'])
    .index('by_circuit_state', ['circuitState'])
    .index('by_last_checked', ['lastHealthCheckAt']),

  // AI routing decision logs
  aiRoutingLogs: defineTable({
    traceId: v.string(),
    taskType: v.string(), // 'brief', 'draft', 'embeddings', 'chat'
    requestedProvider: v.optional(v.string()),
    selectedProvider: v.string(),
    selectedModel: v.string(),
    strategy: v.string(), // 'balanced', 'fastest', 'cheapest'
    fallbackUsed: v.boolean(),
    fallbackChain: v.optional(v.array(v.string())),
    latencyMs: v.number(),
    tokensIn: v.optional(v.number()),
    tokensOut: v.optional(v.number()),
    cost: v.optional(v.number()),
    status: v.union(v.literal('success'), v.literal('error')),
    errorMessage: v.optional(v.string()),
    userId: v.optional(v.id('users')),
    createdAt: v.number(),
  })
    .index('by_trace', ['traceId'])
    .index('by_provider', ['selectedProvider'])
    .index('by_status', ['status'])
    .index('by_date', ['createdAt']),

  // AI Usage Aggregation (INFRA-003) - For cost dashboard
  aiUsage: defineTable({
    // Aggregation key
    userId: v.id('users'),
    projectId: v.optional(v.id('projects')),
    provider: v.string(), // 'openai', 'anthropic', 'google'
    model: v.string(), // 'gpt-4o', 'claude-sonnet-4'
    dateKey: v.string(), // 'YYYY-MM-DD' for daily aggregation
    // Usage totals
    requestCount: v.number(),
    inputTokens: v.number(),
    outputTokens: v.number(),
    totalTokens: v.number(),
    costUsd: v.number(), // Accumulated cost in USD
    // Task breakdown
    taskBreakdown: v.optional(
      v.object({
        chat: v.optional(v.number()),
        brief: v.optional(v.number()),
        draft: v.optional(v.number()),
        embeddings: v.optional(v.number()),
        other: v.optional(v.number()),
      })
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user_date', ['userId', 'dateKey'])
    .index('by_project', ['projectId', 'dateKey'])
    .index('by_provider', ['provider', 'dateKey'])
    .index('by_model', ['model', 'dateKey']),

  // ============================================================================
  // Content Studio (Phase 1) - Unified content management
  // ============================================================================

  // ContentPieces - Unified Brief + Draft into single entity
  contentPieces: defineTable({
    projectId: v.id('projects'),
    clusterId: v.optional(v.id('keywordClusters')),

    // Content Type (17 types from Content Intelligence framework)
    contentType: v.union(
      // Core Pages
      v.literal('homepage'),
      v.literal('about'),
      v.literal('service'),
      v.literal('landing'),
      // Blog Content
      v.literal('blog'),
      v.literal('blogVersus'),
      v.literal('blogVideo'),
      v.literal('contentRefresh'),
      // Conversion
      v.literal('leadMagnet'),
      v.literal('paidProduct'),
      // Local/Geo
      v.literal('areasWeServe'),
      // Specialty
      v.literal('employment'),
      v.literal('mentorship'),
      v.literal('donate'),
      v.literal('events'),
      v.literal('partner'),
      v.literal('program'),
      // DEPRECATED: Legacy types kept for backward compatibility
      // TODO: Migrate existing documents and remove these
      v.literal('pillar'),
      v.literal('howto'),
      v.literal('comparison'),
      v.literal('listicle')
    ),

    // Legacy field for PhooIntelligence content type (kept for backward compatibility)
    phooContentType: v.optional(v.string()),

    // Priority for calendar ordering
    priority: v.optional(v.union(v.literal('P0'), v.literal('P1'), v.literal('P2'))),

    // Metadata (was: Brief)
    title: v.string(),
    h2Outline: v.optional(v.array(v.string())),
    keywords: v.array(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    internalLinks: v.optional(v.array(v.string())),

    // Content (was: Draft)
    content: v.optional(v.string()),
    wordCount: v.optional(v.number()),

    // Quality Metrics - 90+ score guarantee
    seoScore: v.optional(v.number()), // 0-100 SEO optimization score
    geoScore: v.optional(v.number()), // 0-100 GEO (Generative Engine Optimization) score
    qualityMetrics: v.optional(
      v.object({
        wordCountScore: v.number(),
        h2Score: v.number(),
        keywordScore: v.number(),
        // Migration: linkScore is deprecated, structureScore is new
        linkScore: v.optional(v.number()),
        structureScore: v.optional(v.number()),
        readabilityScore: v.number(),
        uniquenessScore: v.optional(v.number()),
      })
    ),
    generationAttempts: v.optional(v.number()), // Track retry count

    // Status
    status: v.union(
      v.literal('generating'),
      v.literal('draft'),
      v.literal('approved'),
      v.literal('published'),
      v.literal('scheduled')
    ),
    publishDate: v.optional(v.number()),
    scheduledDate: v.optional(v.number()), // Calendar scheduled date
    publishedUrl: v.optional(v.string()),

    // Legacy fields removed - briefs/drafts tables deprecated

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_project_status', ['projectId', 'status'])
    .index('by_project_created', ['projectId', 'createdAt'])
    .index('by_cluster', ['clusterId'])
    .index('by_project_scheduled', ['projectId', 'scheduledDate']),

  // ============================================================================
  // SECTION 12: WAITLIST (Phoo.ai Lead Capture)
  // ============================================================================

  /**
   * Waitlist table for phoo.ai landing page lead capture.
   * Tracks early access signups before public launch.
   */
  waitlist: defineTable({
    email: v.string(),
    source: v.optional(v.string()), // 'phoo.ai', 'referral', etc.
    metadata: v.optional(
      v.object({
        referrer: v.optional(v.string()),
        utmSource: v.optional(v.string()),
        utmMedium: v.optional(v.string()),
        utmCampaign: v.optional(v.string()),
        userAgent: v.optional(v.string()),
      })
    ),
    status: v.optional(v.union(v.literal('pending'), v.literal('invited'), v.literal('converted'))),
    invitedAt: v.optional(v.number()),
    convertedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_email', ['email'])
    .index('by_status', ['status'])
    .index('by_created', ['createdAt']),

  // ============================================================================
  // SECTION 13: IMPERSONATION SESSIONS (Admin User Debugging)
  // ============================================================================

  /**
   * Impersonation sessions for super_admins to debug as specific users.
   * Full audit trail with immutable logging for security compliance.
   *
   * Security Requirements:
   * - super_admin role only
   * - 1 hour max session duration
   * - All actions during session tagged in audit log
   * - Visual banner required in UI
   */
  impersonationSessions: defineTable({
    // Who is doing the impersonating (must be super_admin)
    adminUserId: v.id('users'),
    adminEmail: v.string(), // Denormalized for audit readability

    // Who is being impersonated
    targetUserId: v.id('users'),
    targetEmail: v.string(), // Denormalized for audit readability

    // Session control
    status: v.union(v.literal('active'), v.literal('ended'), v.literal('expired')),
    permissions: v.union(v.literal('read_only'), v.literal('full_access')),

    // Timestamps
    startedAt: v.number(),
    expiresAt: v.number(), // 1 hour from start by default
    endedAt: v.optional(v.number()),

    // Audit metadata
    reason: v.optional(v.string()), // Optional reason for impersonation
    actionsCount: v.optional(v.number()), // Count of actions taken during session
    endReason: v.optional(
      v.union(v.literal('manual'), v.literal('expired'), v.literal('admin_logout'))
    ),

    // Device/session info for audit
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()), // If available
  })
    .index('by_admin', ['adminUserId'])
    .index('by_target', ['targetUserId'])
    .index('by_status', ['status'])
    .index('by_admin_active', ['adminUserId', 'status']),

  // ============================================================================
  // SECTION 14: AI WRITER PERSONAS (Per-Project Content Intelligence)
  // ============================================================================

  /**
   * Per-project AI Writer Personas that learn and evolve over time.
   * Each project can have personalized AI writers that understand
   * brand voice, industry context, and audience preferences.
   *
   * Learning Loop:
   * 1. Generate content with persona context
   * 2. User edits/approves/rejects
   * 3. Extract patterns from feedback
   * 4. Evolve persona rules
   *
   * Tier Limits:
   * - Solo: 1 persona per project
   * - Growth: 3 personas per project
   * - Enterprise: Unlimited
   */
  aiWriterPersonas: defineTable({
    // Ownership
    projectId: v.id('projects'),
    createdBy: v.optional(v.id('users')),

    // Identity
    name: v.string(), // e.g., "Brand Voice Expert", "Technical Writer"
    avatar: v.optional(v.string()), // Optional custom avatar URL
    description: v.optional(v.string()), // Brief description of this persona

    // Brand Voice Preferences (learned from feedback)
    brandVoice: v.optional(
      v.object({
        tone: v.optional(v.string()), // "professional", "casual", "authoritative", "friendly"
        style: v.optional(v.string()), // "educational", "persuasive", "storytelling", "technical"
        vocabulary: v.optional(v.array(v.string())), // Preferred terms to use
        avoidWords: v.optional(v.array(v.string())), // Words/phrases to avoid
        sentenceStyle: v.optional(v.string()), // "short", "varied", "complex"
      })
    ),

    // Industry & Audience Context
    industry: v.optional(v.string()), // e.g., "Medical Aesthetics", "SaaS", "E-commerce"
    targetAudience: v.optional(v.string()), // e.g., "B2B decision makers", "Consumers 25-45"
    competitorContext: v.optional(v.string()), // Key competitors to differentiate from
    uniqueSellingPoints: v.optional(v.array(v.string())), // USPs to emphasize

    // SEO & Content Preferences
    seoPreferences: v.optional(
      v.object({
        keywordDensity: v.optional(v.string()), // "light", "moderate", "dense"
        internalLinkingStyle: v.optional(v.string()), // "minimal", "moderate", "extensive"
        ctaStyle: v.optional(v.string()), // "soft", "direct", "urgent"
        preferredContentLength: v.optional(v.string()), // "concise", "standard", "comprehensive"
      })
    ),

    // Learned Rules (accumulated from user feedback)
    learnedRules: v.optional(
      v.array(
        v.object({
          rule: v.string(), // e.g., "Always use Oxford comma", "Avoid passive voice"
          source: v.union(
            v.literal('user_edit'), // Extracted from user edits
            v.literal('rejection'), // Learned from content rejection
            v.literal('explicit'), // Explicitly set by user
            v.literal('inferred') // Inferred from approval patterns
          ),
          confidence: v.optional(v.number()), // 0-1 confidence in this rule
          learnedAt: v.number(),
          appliedCount: v.optional(v.number()), // Times this rule was applied
        })
      )
    ),

    // Performance Metrics (updated after each generation)
    metrics: v.optional(
      v.object({
        totalGenerated: v.number(), // Total content pieces generated
        approvedCount: v.number(), // Approved without major edits
        editedCount: v.number(), // Approved with edits
        rejectedCount: v.number(), // Rejected entirely
        avgEditDistance: v.optional(v.number()), // Average Levenshtein distance of edits
        avgSeoScore: v.optional(v.number()), // Average SEO score achieved
        topPerformingTypes: v.optional(v.array(v.string())), // Content types with best performance
        weakAreas: v.optional(v.array(v.string())), // Areas needing improvement
      })
    ),

    // Status & Lifecycle
    status: v.union(
      v.literal('active'), // Ready for use
      v.literal('training'), // Still learning (< 5 content pieces)
      v.literal('archived') // No longer in use
    ),
    trainingProgress: v.optional(v.number()), // 0-100 percentage
    lastUsedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_status', ['status'])
    .index('by_project_status', ['projectId', 'status']),
  // BI Events (Server-side analytics)
  biEvents: defineTable({
    projectId: v.id('projects'),
    userId: v.optional(v.id('users')),
    event: v.string(), // e.g., 'content:published', 'content:scheduled'
    properties: v.optional(v.any()),
    timestamp: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_event', ['event'])
    .index('by_timestamp', ['timestamp']),

  // ============================================================================
  // SECTION 13: PUBLIC RESOURCES (Blog/Educational Content)
  // ============================================================================

  // Resources - Public SEO content for dogfooding and E-E-A-T
  resources: defineTable({
    // Content identification
    slug: v.string(), // URL-friendly identifier
    title: v.string(),
    description: v.string(), // Meta description for SEO
    excerpt: v.optional(v.string()), // Short preview for cards

    // Categorization
    category: v.union(
      v.literal('guide'), // How-to guides
      v.literal('tutorial'), // Step-by-step tutorials
      v.literal('case-study'), // Customer success stories
      v.literal('insight'), // Thought leadership
      v.literal('news') // Product updates
    ),
    tags: v.optional(v.array(v.string())),

    // Content metadata
    readTimeMinutes: v.number(),
    wordCount: v.optional(v.number()),

    // Author info (for E-E-A-T)
    authorName: v.string(),
    authorTitle: v.optional(v.string()),
    authorImage: v.optional(v.string()),

    // Publishing
    status: v.union(v.literal('draft'), v.literal('published'), v.literal('archived')),
    publishedAt: v.optional(v.number()),
    updatedAt: v.number(),
    createdAt: v.number(),

    // Engagement metrics
    views: v.number(),
    featured: v.boolean(),

    // Our own Phoo Rating (dogfooding!)
    phooRating: v.optional(v.number()), // 0-100
    phooRatedAt: v.optional(v.number()),

    // SEO
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
  })
    .index('by_slug', ['slug'])
    .index('by_category', ['category'])
    .index('by_status', ['status'])
    .index('by_published', ['publishedAt'])
    .index('by_featured', ['featured']),
});
