import { query } from '../_generated/server';
import { v } from 'convex/values';
import { requireProjectAccess } from '../lib/rbac';

/**
 * Get all keywords data for a project
 * Note: Keywords are currently tied to clients, but we can get them via project
 */
export const getKeywordsByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    // Get keywords directly by project
    const keywords = await ctx.db
      .query('keywords')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    return {
      projectId: args.projectId,
      keywords: keywords.sort((a, b) => {
        // Sort by priority, then volume
        const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
        const priorityDiff =
          (priorityOrder[b.priority || 'medium'] || 0) -
          (priorityOrder[a.priority || 'medium'] || 0);
        if (priorityDiff !== 0) return priorityDiff;
        return (b.searchVolume || 0) - (a.searchVolume || 0);
      }),
      stats: {
        total: keywords.length,
        highPriority: keywords.filter((k) => k.priority === 'high').length,
        mediumPriority: keywords.filter((k) => k.priority === 'medium').length,
        lowPriority: keywords.filter((k) => k.priority === 'low').length,
        byStatus: {
          suggested: keywords.filter((k) => k.status === 'suggested').length,
          approved: keywords.filter((k) => k.status === 'approved').length,
          rejected: keywords.filter((k) => k.status === 'rejected').length,
        },
      },
    };
  },
});

/**
 * Keywords Library — Enriched Query
 *
 * Module Hierarchy:
 * Convex → SEO → keywordsData (this file)
 *
 * Server-side query that:
 * 1. Fetches all keywords for project
 * 2. Fetches all clusters for project
 * 3. Builds cluster name map (clusterId → clusterName)
 * 4. Returns enriched keywords + aggregated stats
 *
 * Avoids client-side joins per Board Decision (confidence 0.95).
 */
export const getKeywordsEnriched = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    await requireProjectAccess(ctx, args.projectId, 'viewer');

    // Fetch all keywords for project
    const keywords = await ctx.db
      .query('keywords')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    // Fetch all clusters for project (single query)
    const clusters = await ctx.db
      .query('keywordClusters')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    // Fetch latest GSC snapshots as fallback for keywords missing GSC data
    const gscSnapshots = await ctx.db
      .query('gscKeywordSnapshots')
      .withIndex('by_project_date', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .take(500);

    // Build snapshot lookup (most recent per keyword)
    const snapshotByKeyword = new Map<
      string,
      { position: number; clicks: number; impressions: number; ctr: number }
    >();
    for (const snap of gscSnapshots) {
      const key = snap.keyword.toLowerCase();
      if (!snapshotByKeyword.has(key)) {
        snapshotByKeyword.set(key, {
          position: snap.position,
          clicks: snap.clicks,
          impressions: snap.impressions,
          ctr: snap.ctr,
        });
      }
    }

    // Build cluster lookup maps
    const clusterById = new Map<string, string>();
    const clusterByKeyword = new Map<string, string>();

    for (const cluster of clusters) {
      clusterById.set(cluster._id, cluster.clusterName);
      for (const kw of cluster.keywords) {
        clusterByKeyword.set(kw.toLowerCase(), cluster.clusterName);
      }
    }

    // Enrich keywords with cluster name + rank change + GSC fallback
    const enriched = keywords.map((kw) => {
      const clusterName = kw.clusterId
        ? (clusterById.get(kw.clusterId) ?? null)
        : (clusterByKeyword.get(kw.keyword.toLowerCase()) ?? null);

      // Use keyword's GSC data, or fallback to snapshot data
      const snapshot = snapshotByKeyword.get(kw.keyword.toLowerCase());
      const gscPosition = kw.gscPosition ?? snapshot?.position ?? null;
      const gscClicks = kw.gscClicks ?? snapshot?.clicks ?? null;
      const gscImpressions = kw.gscImpressions ?? snapshot?.impressions ?? null;
      const gscCtr = kw.gscCtr ?? snapshot?.ctr ?? null;

      const rankChange =
        kw.previousGscPosition !== undefined && gscPosition !== null
          ? Math.round(gscPosition - (kw.previousGscPosition ?? gscPosition))
          : null;

      // Quick Win: GSC-based (position 11-20, low effort) OR heuristic (low difficulty + decent volume)
      const gscQuickWin =
        gscPosition !== null &&
        gscPosition >= 11 &&
        gscPosition <= 20 &&
        (kw.searchVolume ?? 0) > 100;

      const heuristicQuickWin =
        gscPosition === null && (kw.difficulty ?? 100) <= 35 && (kw.searchVolume ?? 0) >= 300;

      const isQuickWin = gscQuickWin || heuristicQuickWin;

      return {
        _id: kw._id,
        keyword: kw.keyword,
        intent: kw.intent ?? null,
        phase: kw.phase ?? null,
        status: kw.status,
        priority: kw.priority ?? null,
        source: kw.source ?? null,
        searchVolume: kw.searchVolume ?? null,
        difficulty: kw.difficulty ?? null,
        cpc: kw.cpc ?? null,
        gscPosition,
        previousGscPosition: kw.previousGscPosition ?? null,
        rankChange,
        isQuickWin,
        clusterName,
        gscClicks,
        gscImpressions,
        gscCtr,
        createdAt: kw.createdAt,
      };
    });

    // Compute stat card counts
    const stats = {
      total: enriched.length,
      rankingOnGoogle: enriched.filter((k) => k.gscPosition !== null).length,
      quickWins: enriched.filter((k) => k.isQuickWin).length,
      unclustered: enriched.filter((k) => k.clusterName === null).length,
    };

    // Unique cluster names for filter dropdown
    const clusterNames = [
      ...new Set(enriched.map((k) => k.clusterName).filter(Boolean)),
    ] as string[];

    return { keywords: enriched, stats, clusterNames };
  },
});
