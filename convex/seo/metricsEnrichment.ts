import { internalAction, internalMutation, internalQuery, action, mutation, query } from '../_generated/server';
import { v } from 'convex/values';
import { api, internal } from '../_generated/api';
import { auth } from '../auth';
import type { NormalizedKeywordMetric } from '../integrations/dataForSeo';

const ENRICHMENT_BATCH_SIZE = 500;

export const sweepKeywordsForEnrichment = internalQuery({
  handler: async (ctx) => {
    // Find keywords that have never been enriched (metricsLastUpdated is undefined)
    // We limit to a safe batch size for DFS (up to 1000 per request, we use 500)
    const keywordsToEnrich = await ctx.db
      .query('keywords')
      .withIndex('by_metrics_updated', (q) => q.eq('metricsLastUpdated', undefined))
      .take(ENRICHMENT_BATCH_SIZE);

    return keywordsToEnrich.map(k => ({ id: k._id, keyword: k.keyword, projectId: k.projectId }));
  },
});

export const updateKeywordMetrics = internalMutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id('keywords'),
        searchVolume: v.number(),
        difficulty: v.number(),
        cpc: v.number(),
        intent: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    for (const update of args.updates) {
      const existing = await ctx.db.get(update.id);
      if (!existing) continue;
      
      const newIntent = (!existing.intent || existing.intent === 'informational') ? update.intent : existing.intent;

      await ctx.db.patch(update.id, {
        searchVolume: update.searchVolume,
        difficulty: update.difficulty,
        cpc: update.cpc,
        // Only update intent if we don't have one or if the existing one is just a default
        intent: newIntent, 
        metricsLastUpdated: now,
      });
    }
  },
});

export const processEnrichmentBatch = internalAction({
  args: {
    // Optional array of specific keywords to enrich (used for manual project refreshes)
    // If not provided, it runs the background sweeper
    targets: v.optional(v.array(v.object({ id: v.id('keywords'), keyword: v.string(), projectId: v.id('projects') }))),
  },
  handler: async (ctx, args) => {
    let activeTargets = args.targets;

    if (!activeTargets) {
      activeTargets = await ctx.runQuery(internal.seo.metricsEnrichment.sweepKeywordsForEnrichment);
    }
    
    activeTargets = activeTargets || [];

    if (activeTargets.length === 0) {
      console.log('[MetricsEnrichment] No keywords found to enrich.');
      return { success: true, count: 0 };
    }

    // Extract unique keywords to fetch
    const uniqueKeywordsToFetch = Array.from(new Set(activeTargets.map((t) => t.keyword)));

    // 1. Check Semantic Cache
    const cachedMetrics: NormalizedKeywordMetric[] = await ctx.runQuery(internal.ai.semanticKeywords.getMetrics, {
      keywords: uniqueKeywordsToFetch,
    });

    const cachedKeywordSet = new Set(cachedMetrics.map((m: NormalizedKeywordMetric) => m.keyword.toLowerCase()));
    
    // 2. Identify missing keywords to fetch from DFS
    const missingKeywords = uniqueKeywordsToFetch.filter(
      (kw) => !cachedKeywordSet.has(kw.toLowerCase())
    );

    let fetchedMetrics: NormalizedKeywordMetric[] = [];

    // 3. Fetch missing from DataForSEO
    if (missingKeywords.length > 0) {
      try {
        fetchedMetrics = await ctx.runAction(internal.integrations.dataForSeo.getKeywordIdeas, {
          keywords: missingKeywords,
        });

        if (fetchedMetrics.length > 0) {
          // 4. Update Semantic Cache with new results
          await ctx.runMutation(internal.ai.semanticKeywords.upsertMetrics, {
            metrics: fetchedMetrics.map(m => ({
              keyword: m.keyword,
              monthlySearches: m.monthlySearches,
              rankingDifficulty: m.rankingDifficulty,
              adCostCpc: m.adCostCpc,
              paidCompetition: m.paidCompetition,
            })),
          });
        }
      } catch (error) {
        console.error('[MetricsEnrichment] DataForSEO fetch failed:', error);
        // Continue with whatever cached metrics we have to at least process those
      }
    }

    // Combine cached and fetched metrics
    const allMetricsMap = new Map<string, NormalizedKeywordMetric>();
    for (const m of cachedMetrics) {
      allMetricsMap.set(m.keyword.toLowerCase(), m);
    }
    for (const m of fetchedMetrics) {
      allMetricsMap.set(m.keyword.toLowerCase(), m);
    }

    // 5. Update the project keywords
    const updates = activeTargets
      .map((t) => {
        const metric = allMetricsMap.get(t.keyword.toLowerCase());
        if (!metric) return null;

        // Derive intent from competition if not explicitly available
        // Simple heuristic: High comp = commercial/transactional, Low/Med = informational
        const derivedIntent = metric.paidCompetition === 'HIGH' ? 'commercial' : 'informational';

        return {
          id: t.id,
          searchVolume: metric.monthlySearches,
          difficulty: metric.rankingDifficulty,
          cpc: metric.adCostCpc,
          intent: derivedIntent,
        };
      })
      .filter((u): u is NonNullable<typeof u> => u !== null);

    if (updates.length > 0) {
      await ctx.runMutation(internal.seo.metricsEnrichment.updateKeywordMetrics, { updates });
    }

    console.log(`[MetricsEnrichment] Enriched ${updates.length} keywords.`);
    return { success: true, count: updates.length };
  },
});

// ==========================================
// PUBLIC MUTATIONS (Manual Refresh)
// ==========================================

export const getProjectKeywordsToRefresh = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== userId) return [];

    // Get a bounded batch of keywords for the project to prevent OOM
    const keywords = await ctx.db
      .query('keywords')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .take(5000);

    // Return the targets to be refreshed
    return keywords.map(k => ({ id: k._id, keyword: k.keyword, projectId: k.projectId }));
  }
});

/**
 * Public action to trigger an immediate metrics refresh for a project's keyword library.
 * Designed to be called from the UI (e.g. a "Refresh Metrics" button).
 */
export const refreshProjectMetrics = action({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    // To prevent the action from doing a DB read (actions can't read directly),
    // we query an internal or public query function to get the keywords.
    const targets = await ctx.runQuery(api.seo.metricsEnrichment.getProjectKeywordsToRefresh, {
      projectId: args.projectId,
    });

    if (targets.length === 0) {
      return { success: true, count: 0, message: 'No keywords to refresh.' };
    }

    const MAX_BATCHES_PER_INVOCATION = 3;
    let totalEnriched = 0;
    const batchPromises = [];

    const limit = Math.min(targets.length, ENRICHMENT_BATCH_SIZE * MAX_BATCHES_PER_INVOCATION);
    for (let i = 0; i < limit; i += ENRICHMENT_BATCH_SIZE) {
      const batch = targets.slice(i, i + ENRICHMENT_BATCH_SIZE);
      batchPromises.push(ctx.runAction(internal.seo.metricsEnrichment.processEnrichmentBatch, { targets: batch }));
    }

    const results = await Promise.all(batchPromises);
    for (const result of results) {
      totalEnriched += result.count;
    }

    const remainingTargets = targets.slice(limit);
    if (remainingTargets.length > 0) {
      // Schedule continuation to avoid action timeout
      await ctx.scheduler.runAfter(0, internal.seo.metricsEnrichment.continueRefreshProjectMetrics, {
        targets: remainingTargets,
      });
    }

    return { success: true, count: totalEnriched, message: `Successfully refreshed metrics for ${totalEnriched} keywords. Remaining scheduled.` };
  },
});

export const continueRefreshProjectMetrics = internalAction({
  args: {
    targets: v.array(v.object({ id: v.id('keywords'), keyword: v.string(), projectId: v.id('projects') }))
  },
  handler: async (ctx, args) => {
    const MAX_BATCHES_PER_INVOCATION = 3;
    let totalEnriched = 0;
    const batchPromises = [];

    const limit = Math.min(args.targets.length, ENRICHMENT_BATCH_SIZE * MAX_BATCHES_PER_INVOCATION);
    for (let i = 0; i < limit; i += ENRICHMENT_BATCH_SIZE) {
      const batch = args.targets.slice(i, i + ENRICHMENT_BATCH_SIZE);
      batchPromises.push(ctx.runAction(internal.seo.metricsEnrichment.processEnrichmentBatch, { targets: batch }));
    }

    const results = await Promise.all(batchPromises);
    for (const result of results) {
      totalEnriched += result.count;
    }

    const remainingTargets = args.targets.slice(limit);
    if (remainingTargets.length > 0) {
      await ctx.scheduler.runAfter(0, internal.seo.metricsEnrichment.continueRefreshProjectMetrics, {
        targets: remainingTargets,
      });
    }

    return { success: true, count: totalEnriched };
  }
});
