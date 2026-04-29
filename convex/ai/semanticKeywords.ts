import { internalQuery, internalMutation } from '../_generated/server';
import { v } from 'convex/values';
import { NormalizedKeywordMetric } from '../integrations/dataForSeo';

const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const parseCompetition = (comp: unknown): 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN' => {
  if (typeof comp === 'string' && ['LOW', 'MEDIUM', 'HIGH', 'UNKNOWN'].includes(comp)) {
    return comp as 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';
  }
  return 'UNKNOWN';
};

export const getMetrics = internalQuery({
  args: {
    keywords: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const results = new Map<string, NormalizedKeywordMetric>();

    for (const kw of args.keywords) {
      const normalized = kw.toLowerCase().trim();
      const row = await ctx.db
        .query('semanticKeywords')
        .withIndex('by_keyword', (q) => q.eq('keyword', normalized))
        .filter((q) => q.gt(q.field('expiresAt'), now))
        .first();

      if (row) {
        results.set(normalized, {
          keyword: row.keyword,
          monthlySearches: row.searchVolume ?? 0,
          rankingDifficulty: row.difficulty ?? 0,
          adCostCpc: row.cpc ?? 0,
          paidCompetition: parseCompetition(row.competition),
        });
      }
    }

    return Array.from(results.values());
  },
});

export const upsertMetrics = internalMutation({
  args: {
    metrics: v.array(
      v.object({
        keyword: v.string(),
        monthlySearches: v.number(),
        rankingDifficulty: v.number(),
        adCostCpc: v.number(),
        paidCompetition: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    for (const metric of args.metrics) {
      const normalized = metric.keyword.toLowerCase().trim();
      
      const existing = await ctx.db
        .query('semanticKeywords')
        .withIndex('by_keyword', (q) => q.eq('keyword', normalized))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          searchVolume: metric.monthlySearches,
          difficulty: metric.rankingDifficulty,
          cpc: metric.adCostCpc,
          competition: metric.paidCompetition,
          expiresAt: now + TTL_MS,
          updatedAt: now,
        });
      } else {
        await ctx.db.insert('semanticKeywords', {
          keyword: normalized,
          searchVolume: metric.monthlySearches,
          difficulty: metric.rankingDifficulty,
          cpc: metric.adCostCpc,
          competition: metric.paidCompetition,
          expiresAt: now + TTL_MS,
          updatedAt: now,
        });
      }
    }
  },
});
