import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';
import { startOfMonth, endOfMonth } from 'date-fns';

/**
 * Pricing Tiers with Cost Analysis
 *
 * AI Token Costs (GPT-4o-mini, Dec 2024):
 *   Input:  $0.15 per 1M tokens
 *   Output: $0.60 per 1M tokens
 *
 * Estimated AI Cost Per Feature:
 *   - Keyword Research (250): ~$0.006
 *   - AI Report (1 URL):      ~$0.010
 *   - Content Brief:          ~$0.007
 *   - Draft Generation:       ~$0.016
 *
 * Pricing Philosophy (BILL-approved):
 *   - AI costs are <1% of price
 *   - Value is in intelligence layer + time savings (~10hrs/mo @ $50/hr)
 *   - No free tier (value requires investment)
 *   - Enterprise = relationship, not sticker price
 *   - Billing via Polar (not Stripe)
 */
export const PLAN_LIMITS = {
  // Solo: $49/mo - AI cost ~$0.13/mo (10x markup + intelligence value)
  // Target: Solopreneurs, 1 website, getting started with SEO
  solo: {
    priceMonthly: 49,
    features: {
      maxUrls: 1,
      maxKeywordIdeas: 250,
      maxAiReports: 4,
      maxContentPieces: 4,
    },
  },
  // Growth: $149/mo - AI cost ~$0.40/mo (375x markup - justifies intelligence layer)
  // Target: SMBs <$500k/yr, 3 websites, serious about content marketing
  growth: {
    priceMonthly: 149,
    features: {
      maxUrls: 3,
      maxKeywordIdeas: 1000,
      maxAiReports: 12,
      maxContentPieces: 12,
    },
  },
  // Enterprise: Custom - AI cost ~$4/mo (contact sales)
  // Target: Agencies, large companies, need API access, SLA, custom integrations
  enterprise: {
    priceMonthly: 0, // Contact Sales
    features: {
      maxUrls: 999999, // Unlimited
      maxKeywordIdeas: 10000,
      maxAiReports: 100,
      maxContentPieces: 100,
    },
  },
  // Legacy aliases for backward compatibility
  starter: {
    priceMonthly: 49,
    features: {
      maxUrls: 1,
      maxKeywordIdeas: 250,
      maxAiReports: 4,
      maxContentPieces: 4,
    },
  },
  scale: {
    priceMonthly: 399,
    features: {
      maxUrls: 10,
      maxKeywordIdeas: 2000,
      maxAiReports: 20,
      maxContentPieces: 20,
    },
  },
} as const;

export type PlanName = keyof typeof PLAN_LIMITS;

export function planConfig(planTier: string) {
  const tier = planTier.toLowerCase() as PlanName;
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

export const upsertSubscription = mutation({
  args: {
    userId: v.id('users'),
    planTier: v.string(),
    status: v.string(),
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
  args: { status: v.optional(v.string()) },
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
