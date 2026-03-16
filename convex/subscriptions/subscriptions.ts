import { mutation, query, internalMutation } from '../_generated/server';
import { v } from 'convex/values';
import { startOfMonth, endOfMonth } from 'date-fns';

/**
 * Pricing Tiers with Cost Analysis
 *
 * CANONICAL TIER NAMES (as of Feb 2026 — Lead Generation System pivot):
 *   - free: No subscription (default for new users)
 *   - starter: Lead Starter ($197/mo) - Solopreneurs, 1 website
 *   - engine: Growth Engine ($397/mo) - SMBs scaling, 3 websites
 *   - agency: Agency ($697/mo) - Agencies, multi-location, 10 websites
 *   - enterprise: Custom pricing (contact sales, existing subscribers only)
 *
 * Legacy aliases for backward compatibility (TECHDEBT: migrate records):
 *   - solo → starter
 *   - growth → engine
 *   - team → agency
 *   - starter (old) → starter (new)
 *   - pro → engine
 *
 * Positioning: "The $2,500/month Agency Alternative"
 *   - Value = predictable inbound lead generation
 *   - 3-5 new leads/month within 6-8 months
 *   - $12k-$30k annual revenue impact vs $197-697/mo price
 *
 * AI Token Costs (GPT-4o-mini, Dec 2024):
 *   Input:  $0.15 per 1M tokens
 *   Output: $0.60 per 1M tokens
 *
 * Pricing Philosophy (BILL-approved, Updated Feb 2026):
 *   - Premium pricing attracts action-takers, not dabblers
 *   - AI costs are <1% of price — value is in the lead pipeline
 *   - No free tier (value requires investment)
 *   - Agency tier for white-label and multi-location
 *   - Enterprise = relationship, not sticker price
 */
export const PLAN_LIMITS = {
  // Free: No subscription - used for feature gating only
  free: {
    priceMonthly: 0,
    features: {
      maxUrls: 0,
      maxKeywordIdeas: 0,
      maxAiReports: 0,
      maxContentPieces: 0,
      maxTeamMembers: 0,
    },
  },
  // Lead Starter: $197/mo
  // "Your in-house lead engine for less than the cost of one freelancer."
  // Target: Solopreneurs, 1 website, predictable lead generation
  starter: {
    priceMonthly: 197,
    features: {
      maxUrls: 1,
      maxKeywordIdeas: 500,
      maxAiReports: 10,
      maxContentPieces: 15,
      maxTeamMembers: 1,
    },
  },
  // Growth Engine: $397/mo
  // "Replace your marketing agency for 1/6 the cost."
  // Target: Scaling SMBs, 3 websites, conversion optimization
  engine: {
    priceMonthly: 397,
    features: {
      maxUrls: 3,
      maxKeywordIdeas: 2000,
      maxAiReports: 30,
      maxContentPieces: 50,
      maxTeamMembers: 5,
    },
  },
  // Agency: $697/mo
  // "Built for agencies and multi-location businesses."
  // Target: Agencies, white-label, 10 websites, client access
  agency: {
    priceMonthly: 697,
    features: {
      maxUrls: 10,
      maxKeywordIdeas: 5000,
      maxAiReports: 100,
      maxContentPieces: 100,
      maxTeamMembers: 25,
    },
  },
  // Enterprise: Custom - existing subscribers and contact sales
  // Target: Large companies, need API access, SLA, custom integrations
  enterprise: {
    priceMonthly: 0, // Contact Sales
    features: {
      maxUrls: 999999, // Unlimited
      maxKeywordIdeas: 10000,
      maxAiReports: 100,
      maxContentPieces: 100,
      maxTeamMembers: 999999, // Unlimited
    },
  },
} as const;

export type PlanName = keyof typeof PLAN_LIMITS;

/**
 * Legacy tier alias map — maps old plan IDs to new canonical IDs.
 * TECHDEBT: Once all existing subscriber records are migrated,
 * remove these aliases and reference new IDs directly.
 */
const LEGACY_TIER_ALIASES: Record<string, PlanName> = {
  solo: 'starter',
  growth: 'engine',
  team: 'agency',
  pro: 'engine',
};

export function planConfig(planTier: string) {
  const normalized = planTier.toLowerCase();
  const canonical = LEGACY_TIER_ALIASES[normalized] ?? normalized;
  const tier = canonical as PlanName;
  return PLAN_LIMITS[tier] ?? null;
}

// function removed in favor of import if possible, or just fixing logic
// actually I need better context on project structure first.

async function getActiveSubscription(ctx: any, userId: string) {
  return await ctx.db
    .query('subscriptions')
    .withIndex('by_user', (q: any) => q.eq('userId', userId))
    .first();
}

async function getUsageDoc(ctx: any, userId: string, periodStart: number, periodEnd: number) {
  const existing =
    (await ctx.db
      .query('usageLimits')
      .withIndex('by_user_period', (q: any) =>
        q.eq('userId', userId).eq('periodStart', periodStart)
      )
      .first()) ?? null;

  if (existing) {
    return existing;
  }

  const docId = await ctx.db.insert('usageLimits', {
    userId,
    periodStart,
    periodEnd,
    urlsAnalyzed: 0,
    keywordIdeasGenerated: 0,
    aiReportsGenerated: 0,
    contentPiecesPlanned: 0,
    updatedAt: Date.now(),
  });
  return (await ctx.db.get(docId))!;
}

type UsageField =
  | 'urlsAnalyzed'
  | 'keywordIdeasGenerated'
  | 'aiReportsGenerated'
  | 'contentPiecesPlanned';

const metricToField: Record<'urls' | 'keywordIdeas' | 'aiReports' | 'contentPieces', UsageField> = {
  urls: 'urlsAnalyzed',
  keywordIdeas: 'keywordIdeasGenerated',
  aiReports: 'aiReportsGenerated',
  contentPieces: 'contentPiecesPlanned',
};

const fieldToLimit: Record<UsageField, keyof typeof PLAN_LIMITS.starter.features> = {
  urlsAnalyzed: 'maxUrls',
  keywordIdeasGenerated: 'maxKeywordIdeas',
  aiReportsGenerated: 'maxAiReports',
  contentPiecesPlanned: 'maxContentPieces',
};

export const upsertSubscription = internalMutation({
  args: {
    userId: v.id('users'),
    planTier: v.string(),
    status: v.union(
      v.literal('active'),
      v.literal('trialing'),
      v.literal('grace_period'),
      v.literal('maintenance_mode'),
      v.literal('past_due'),
      v.literal('cancelled'),
      v.literal('expired')
    ),
    billingCycle: v.optional(v.union(v.literal('monthly'), v.literal('annual'))),
    startsAt: v.number(),
    renewsAt: v.optional(v.number()),
    cancelAt: v.optional(v.number()),
    oneTimeFeePaid: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const config = planConfig(args.planTier);
    const existing = await getActiveSubscription(ctx, args.userId);

    const payload = {
      planTier: args.planTier,
      status: args.status,
      billingCycle: args.billingCycle,
      priceMonthly: config.priceMonthly,
      features: config.features,
      startsAt: args.startsAt,
      renewsAt: args.renewsAt,
      cancelAt: args.cancelAt,
      oneTimeFeePaid: args.oneTimeFeePaid,
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }

    return await ctx.db.insert('subscriptions', {
      userId: args.userId,
      ...payload,
      createdAt: now,
    });
  },
});

export const getSubscriptionByUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const subscription = await getActiveSubscription(ctx, args.userId);
    if (!subscription) {
      return null;
    }

    const now = Date.now();
    const dateObj = new Date(now);
    const start = startOfMonth(dateObj).getTime();
    const end = endOfMonth(dateObj).getTime();
    const usage = await getUsageDoc(ctx, args.userId, start, end);

    return { subscription, usage };
  },
});

export const listSubscriptions = query({
  args: {
    status: v.optional(
      v.union(
        v.literal('active'),
        v.literal('trialing'),
        v.literal('grace_period'),
        v.literal('maintenance_mode'),
        v.literal('past_due'),
        v.literal('cancelled'),
        v.literal('expired')
      )
    ),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query('subscriptions')
        .withIndex('by_status', (q) => q.eq('status', args.status!))
        .order('desc')
        .collect();
    }
    return await ctx.db.query('subscriptions').order('desc').collect();
  },
});

export const recordUsage = mutation({
  args: {
    userId: v.id('users'),
    metric: v.union(
      v.literal('urls'),
      v.literal('keywordIdeas'),
      v.literal('aiReports'),
      v.literal('contentPieces')
    ),
    amount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const subscription = await getActiveSubscription(ctx, args.userId);
    if (!subscription || subscription.status !== 'active') {
      throw new Error('Active subscription required');
    }

    const config = planConfig(subscription.planTier);
    const dateObj = new Date(Date.now());
    const start = startOfMonth(dateObj).getTime();
    const end = endOfMonth(dateObj).getTime();
    const usageDoc = await getUsageDoc(ctx, args.userId, start, end);

    const field = metricToField[args.metric];
    const limitField = fieldToLimit[field];
    const increment = args.amount ?? 1;
    const nextValue = usageDoc[field] + increment;

    if (nextValue > config.features[limitField]) {
      throw new Error(`Plan limit reached for ${args.metric}`);
    }

    await ctx.db.patch(usageDoc._id, {
      [field]: nextValue,
      updatedAt: Date.now(),
    });

    return { success: true, remaining: config.features[limitField] - nextValue };
  },
});

/**
 * CR-005: Internal variant of recordUsage for durable workflows.
 *
 * Workflow steps (step.runMutation) execute in internal context.
 * Using the public mutation() would require auth context propagation
 * which is not guaranteed in workflow step execution.
 *
 * Same logic as recordUsage — accepts userId explicitly.
 */
export const internalRecordUsage = internalMutation({
  args: {
    userId: v.id('users'),
    metric: v.union(
      v.literal('urls'),
      v.literal('keywordIdeas'),
      v.literal('aiReports'),
      v.literal('contentPieces')
    ),
    amount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const subscription = await getActiveSubscription(ctx, args.userId);
    if (!subscription || subscription.status !== 'active') {
      throw new Error('Active subscription required');
    }

    const config = planConfig(subscription.planTier);
    const dateObj = new Date(Date.now());
    const start = startOfMonth(dateObj).getTime();
    const end = endOfMonth(dateObj).getTime();
    const usageDoc = await getUsageDoc(ctx, args.userId, start, end);

    const field = metricToField[args.metric];
    const limitField = fieldToLimit[field];
    const increment = args.amount ?? 1;
    const nextValue = usageDoc[field] + increment;

    if (nextValue > config.features[limitField]) {
      throw new Error(`Plan limit reached for ${args.metric}`);
    }

    await ctx.db.patch(usageDoc._id, {
      [field]: nextValue,
      updatedAt: Date.now(),
    });

    return { success: true, remaining: config.features[limitField] - nextValue };
  },
});

