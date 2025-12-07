import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';
import { getMonthBoundaries } from '../lib/dateUtils';

const PLAN_LIMITS = {
  starter: {
    priceMonthly: 49,
    features: {
      maxUrls: 5,
      maxKeywordIdeas: 100,
      maxAiReports: 2,
      maxContentPieces: 2,
    },
  },
  growth: {
    priceMonthly: 149,
    features: {
      maxUrls: 20,
      maxKeywordIdeas: 500,
      maxAiReports: 8,
      maxContentPieces: 8,
    },
  },
  scale: {
    priceMonthly: 399,
    features: {
      maxUrls: 999999, // Unlimited
      maxKeywordIdeas: 2000,
      maxAiReports: 20,
      maxContentPieces: 20,
    },
  },
} as const;

type PlanName = keyof typeof PLAN_LIMITS;

function planConfig(planTier: string) {
  const tier = planTier.toLowerCase() as PlanName;
  return PLAN_LIMITS[tier] ?? PLAN_LIMITS.starter;
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
    const { start, end } = getMonthBoundaries(now);
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
    const { start, end } = getMonthBoundaries(Date.now());
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
