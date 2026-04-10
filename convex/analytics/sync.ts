'use node';
import { internalAction } from '../_generated/server';
import { v } from 'convex/values';
import { api, internal } from '../_generated/api';
import { THRESHOLDS } from '../config/thresholds';
import {
  parseGA4Response,
  normalizeGA4Metrics,
  aggregateGSCRows,
  normalizeGSCMetrics,
  normalizeKeywordRow,
  normalizePagePath,
  normalizeDecimalToPercent,
} from './analyticsTransforms';
import type {
  RawGA4Response,
  RawGSCResponse,
  NormalizedGA4Metrics,
  NormalizedGSCMetrics,
} from './analyticsTransforms';

export const syncProjectData = internalAction({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const projectId = args.projectId;
    const now = Date.now();
    // Round to start-of-day (UTC) so same-day syncs upsert the same row
    // This prevents data accumulation when syncing multiple times per day
    const syncDateKey = new Date(now).setUTCHours(0, 0, 0, 0);
    // Use centralized config for date range
    const endDate = new Date(now).toISOString().split('T')[0];
    const startDate = new Date(now - THRESHOLDS.sync.defaultDays * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    // 1. Fetch Connections
    const ga4Connection = await ctx.runQuery(
      internal.integrations.ga4Connections.getGA4ConnectionInternal,
      {
        projectId,
      }
    );
    const gscConnection = await ctx.runQuery(
      internal.integrations.gscConnections.getGSCConnectionInternal,
      {
        projectId,
      }
    );

    let ga4Data: NormalizedGA4Metrics | null = null;
    let gscData: NormalizedGSCMetrics | null = null;
    let leadCount = 0;

    // 2. Fetch GA4 Data (expanded metrics)
    if (ga4Connection) {
      try {
        const raw = (await ctx.runAction(internal.integrations.google.fetchGA4Metrics, {
          connectionId: ga4Connection._id,
          projectId,
          propertyId: ga4Connection.propertyId,
          accessToken: ga4Connection.accessToken,
          refreshToken: ga4Connection.refreshToken,
          startDate,
          endDate,
        })) as RawGA4Response;

        console.log(
          `[GA4 Sync] Project ${projectId} Property ${ga4Connection.propertyId} fetched raw data. Row count: ${raw.rows?.length ?? 0}`
        );

        // Parse and normalize GA4 response using pure transform functions
        const parsed = parseGA4Response(raw);
        ga4Data = normalizeGA4Metrics(parsed);
        console.log(
          `[GA4 Sync] Normalized: sessions=${ga4Data.sessions}, pageViews=${ga4Data.pageViews}, bounceRate=${ga4Data.bounceRate.toFixed(1)}%`
        );

        await ctx.runMutation(internal.integrations.ga4Connections.updateLastSync, {
          connectionId: ga4Connection._id,
        });
      } catch (e) {
        console.error(`GA4 Sync Failed for project ${projectId}:`, e);
      }

      // 2.5. Fetch GA4 Lead Count (filtered by generate_lead event)
      try {
        const leadData = await ctx.runAction(internal.integrations.google.fetchGA4LeadCount, {
          connectionId: ga4Connection._id,
          projectId,
          propertyId: ga4Connection.propertyId,
          accessToken: ga4Connection.accessToken,
          refreshToken: ga4Connection.refreshToken,
          startDate,
          endDate,
        });
        leadCount = leadData.leads;
        console.log(`[Lead Sync] Project ${projectId}: ${leadCount} generate_lead events found`);
      } catch (e) {
        console.error(`GA4 Lead Count Sync Failed for project ${projectId}:`, e);
        // Non-fatal: continue sync without lead data
      }

      // 2.6. Content Metrics Attribution (leads + traffic per page)
      try {
        // Fetch lead attribution AND page traffic metrics in parallel
        const [leadsByPage, pageTraffic] = await Promise.all([
          ctx.runAction(internal.integrations.google.fetchGA4LeadsByPage, {
            connectionId: ga4Connection._id,
            projectId,
            propertyId: ga4Connection.propertyId,
            accessToken: ga4Connection.accessToken,
            refreshToken: ga4Connection.refreshToken,
            startDate,
            endDate,
          }),
          ctx.runAction(internal.integrations.google.fetchGA4PageMetrics, {
            connectionId: ga4Connection._id,
            projectId,
            propertyId: ga4Connection.propertyId,
            accessToken: ga4Connection.accessToken,
            refreshToken: ga4Connection.refreshToken,
            startDate,
            endDate,
          }),
        ]);

        // Aggregate traffic by normalized path (sum on collision, weighted averages)
        const trafficMap = new Map<
          string,
          { pageViews: number; timeWeighted: number; bounceWeighted: number }
        >();
        for (const t of pageTraffic) {
          const normalized = normalizePagePath(t.pagePath);
          const existing = trafficMap.get(normalized) || {
            pageViews: 0,
            timeWeighted: 0,
            bounceWeighted: 0,
          };
          existing.pageViews += t.pageViews;
          existing.timeWeighted += t.avgTimeOnPage * t.pageViews;
          // Normalize bounceRate from GA4's 0-1 decimal to 0-100 percentage
          existing.bounceWeighted += normalizeDecimalToPercent(t.bounceRate) * t.pageViews;
          trafficMap.set(normalized, existing);
        }

        // Aggregate leads by normalized path (sum on collision)
        const leadsMap = new Map<string, number>();
        for (const l of leadsByPage) {
          const normalized = normalizePagePath(l.pagePath);
          leadsMap.set(normalized, (leadsMap.get(normalized) ?? 0) + (l.eventCount ?? 0));
        }

        // Collect all unique normalized paths
        const allNormalizedPaths = new Set([
          ...Array.from(trafficMap.keys()),
          ...Array.from(leadsMap.keys()),
        ]);

        // Load published pieces for URL matching
        const publishedPieces = await ctx.runQuery(
          internal.contentPieces.getPublishedPiecesWithUrls,
          { projectId }
        );

        // Build rows array for bulk upsert
        const rows: Array<{
          contentPieceId?: string;
          pagePath: string;
          publishedUrl?: string;
          leadCount: number;
          pageViews?: number;
          avgTimeOnPage?: number;
          bounceRate?: number;
        }> = [];
        let matchedCount = 0;

        for (const normalizedPath of allNormalizedPaths) {
          const leadCount = leadsMap.get(normalizedPath) ?? 0;
          const traffic = trafficMap.get(normalizedPath);

          // Derive weighted averages from aggregated sums
          const avgTimeOnPage =
            traffic && traffic.pageViews > 0 ? traffic.timeWeighted / traffic.pageViews : undefined;
          const bounceRate =
            traffic && traffic.pageViews > 0
              ? traffic.bounceWeighted / traffic.pageViews
              : undefined;

          // Match to content piece (using normalizePagePath for consistency)
          const matchedPiece = publishedPieces.find((p: { publishedUrl?: string }) => {
            if (!p.publishedUrl) return false;
            try {
              return normalizePagePath(new URL(p.publishedUrl).pathname) === normalizedPath;
            } catch {
              return false;
            }
          });

          if (matchedPiece) matchedCount++;

          rows.push({
            contentPieceId: matchedPiece?._id,
            pagePath: normalizedPath,
            publishedUrl: matchedPiece?.publishedUrl,
            leadCount,
            pageViews: traffic?.pageViews,
            avgTimeOnPage,
            bounceRate,
          });
        }

        // Bulk upsert in chunks of 200 to avoid action timeouts
        const CHUNK_SIZE = 200;
        for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
          await ctx.runMutation(internal.analytics.contentMetrics.bulkUpsertContentMetrics, {
            projectId,
            syncDate: syncDateKey,
            rows: rows.slice(i, i + CHUNK_SIZE),
          });
        }

        console.log(
          `[Content Metrics] Project ${projectId}: ${allNormalizedPaths.size} pages synced in ${Math.ceil(rows.length / CHUNK_SIZE)} chunks, ${matchedCount} matched to content pieces`
        );
      } catch (e) {
        console.error(`Content metrics sync failed for project ${projectId}:`, e);
      }
    }

    // 3. Fetch GSC Data (keyword-level data)
    if (gscConnection) {
      if (!gscConnection.accessToken) {
        console.warn(`[GSC Sync] Aborting generic sync for project ${projectId}. GSC access token missing or decrypted to null.`);
      } else {
        try {
          const raw = (await ctx.runAction(internal.integrations.google.fetchGSCMetrics, {
            connectionId: gscConnection._id,
            siteUrl: gscConnection.siteUrl,
            accessToken: gscConnection.accessToken,
            refreshToken: gscConnection.refreshToken,
            startDate,
            endDate,
          })) as RawGSCResponse;

        console.log(
          `[GSC Sync] Raw API response for ${projectId}: ${raw.rows?.length ?? 0} keyword rows returned`
        );

        // Aggregate and normalize GSC rows using pure transform functions
        const aggregated = aggregateGSCRows(raw);
        if (aggregated) {
          gscData = normalizeGSCMetrics(aggregated);

          // Store each keyword snapshot (normalized CTR as percentage)
          if (raw.rows) {
            for (const row of raw.rows) {
              const normalized = normalizeKeywordRow(row);
              await ctx.runMutation(internal.analytics.gscKeywords.storeKeywordSnapshot, {
                projectId,
                syncDate: syncDateKey,
                keyword: normalized.keyword,
                clicks: normalized.clicks,
                impressions: normalized.impressions,
                ctr: normalized.ctr, // now 0-100 percentage
                position: normalized.position,
              });

              // Bridge GSC keyword into keyword library (upsert)
              await ctx.runMutation(internal.analytics.keywordEnrichment.upsertGSCKeyword, {
                projectId,
                keyword: normalized.keyword,
                position: normalized.position,
                clicks: normalized.clicks,
                impressions: normalized.impressions,
                ctr: normalized.ctr, // now 0-100 percentage
              });
            }
          }

          console.log(
            `[GSC Sync] Stored ${raw.rows?.length ?? 0} keyword snapshots. Totals: ${gscData.clicks} clicks, ${gscData.impressions} impressions, avg position ${gscData.avgPosition.toFixed(1)}`
          );
        } else {
          console.warn(`[GSC Sync] No keyword rows returned from GSC API for ${projectId}`);
        }

        await ctx.runMutation(internal.integrations.gscConnections.updateLastSync, {
          connectionId: gscConnection._id,
        });
      } catch (e) {
        console.error(`[GSC Sync] Failed for project ${projectId}:`, e);
      }
      }
    }

    // 4. Save Data (Upsert to analyticsData)
    if (ga4Data) {
      await ctx.runMutation(api.analytics.analytics.storeAnalyticsData, {
        projectId,
        date: syncDateKey,
        source: 'ga4',
        sessions: ga4Data.sessions,
        users: ga4Data.users,
        engagementDuration: ga4Data.engagementDuration,
        pageViews: ga4Data.pageViews,
        bounceRate: ga4Data.bounceRate, // now 0-100 percentage
        avgSessionDuration: ga4Data.avgSessionDuration,
        newUsers: ga4Data.newUsers,
        engagedSessions: ga4Data.engagedSessions,
        eventCount: ga4Data.eventCount,
        conversions: ga4Data.conversions,
        leads: leadCount, // Sourced from real GA4 generate_lead events
      });

      // Insight: Low Traffic (using centralized threshold)
      if (ga4Data.sessions < THRESHOLDS.insights.lowTrafficSessions) {
        await ctx.runMutation(api.analytics.analytics.storeInsight, {
          projectId,
          type: 'underperformer',
          title: 'Low Organic Traffic',
          description: `Only ${ga4Data.sessions} sessions detected in the last 30 days. Consider publishing more content.`,
          action: 'Plan Content',
          metadata: { sessions: ga4Data.sessions },
        });
      }

      // Insight: High Bounce Rate (using centralized threshold)
      // bounceRate is now 0-100 percentage, threshold is also percentage
      if (ga4Data.bounceRate > THRESHOLDS.insights.highBounceRate) {
        await ctx.runMutation(api.analytics.analytics.storeInsight, {
          projectId,
          type: 'quick_win',
          title: 'High Bounce Rate',
          description: `Your bounce rate is ${ga4Data.bounceRate.toFixed(1)}%. Improve page load speed and content relevance.`,
          action: 'Optimize UX',
          metadata: { bounceRate: ga4Data.bounceRate },
        });
      }
    }

    if (gscData) {
      await ctx.runMutation(api.analytics.analytics.storeAnalyticsData, {
        projectId,
        date: syncDateKey,
        source: 'gsc',
        clicks: gscData.clicks,
        impressions: gscData.impressions,
        ctr: gscData.ctr, // now 0-100 percentage
        avgPosition: gscData.avgPosition,
      });

      // Insight: High Impressions, Low CTR (using centralized thresholds)
      // CTR is now 0-100 percentage, threshold should also be percentage
      if (
        gscData.impressions > THRESHOLDS.insights.highImpressionsThreshold &&
        gscData.ctr < THRESHOLDS.insights.lowCTR
      ) {
        await ctx.runMutation(api.analytics.analytics.storeInsight, {
          projectId,
          type: 'quick_win',
          title: 'High Impressions, Low CTR',
          description:
            'You are ranking but not getting clicks. Improve your meta titles and descriptions.',
          action: 'Optimize Metadata',
          metadata: { ctr: gscData.ctr, impressions: gscData.impressions },
        });
      }
    }

    // Steps 5-11: Only run downstream intelligence when we have fresh data
    // This avoids 7+ unnecessary function invocations per project when connections
    // exist but fail to return data (expired tokens, API quota, etc.)
    const hasFreshData = ga4Data !== null || gscData !== null;

    if (!hasFreshData) {
      console.log(`[Analytics Sync] Project ${projectId}: No fresh data fetched, skipping intelligence pipeline`);
      return { ga4Data, gscData };
    }

    // 5. Detect Quick Win Keywords (position 5-15, high impressions)
    try {
      const quickWins = await ctx.runQuery(internal.analytics.gscKeywords.getQuickWinKeywords, {
        projectId,
        minImpressions: THRESHOLDS.insights.quickWinMinImpressions,
      });

      if (quickWins && quickWins.length > 0) {
        const topQuickWins = quickWins.slice(0, 5);
        await ctx.runMutation(api.analytics.analytics.storeInsight, {
          projectId,
          type: 'quick_win',
          title: `${quickWins.length} Quick Win Keywords Found`,
          description: `You have ${quickWins.length} keywords ranking on page 2 with high impressions. Top opportunities: ${topQuickWins.map((k: { keyword: string }) => k.keyword).join(', ')}`,
          action: 'Create Content',
          metadata: {
            keywords: topQuickWins.map(
              (k: { keyword: string; position: number; impressions: number }) => ({
                keyword: k.keyword,
                position: k.position,
                impressions: k.impressions,
              })
            ),
          },
        });
      }
    } catch (e) {
      console.error('Quick Win detection failed:', e);
    }

    // 6. Generate Enhanced Semantic Insights (cross-reference with keyword library)
    try {
      await ctx.runAction(internal.analytics.insights.generateEnhancedInsights, {
        projectId,
      });
    } catch (e) {
      console.error('Enhanced insights generation failed:', e);
    }

    // 7. Find Content Gaps (high-value keywords we're NOT ranking for)
    try {
      await ctx.runAction(internal.analytics.insights.findContentGaps, {
        projectId,
      });
    } catch (e) {
      console.error('Content gap detection failed:', e);
    }

    // 8. Suggest Keyword Clusters (group semantically similar keywords)
    try {
      await ctx.runAction(internal.analytics.insights.suggestKeywordClusters, {
        projectId,
      });
    } catch (e) {
      console.error('Cluster suggestion failed:', e);
    }

    // 9. Suggest Content Briefs (based on all insights)
    try {
      await ctx.runAction(internal.analytics.insights.suggestBriefs, {
        projectId,
      });
    } catch (e) {
      console.error('Brief suggestion failed:', e);
    }

    // 10. Calculate Phoo Rating — the unified hero metric
    try {
      await ctx.runAction(internal.analytics.martaiRating.calculatePhooRating, {
        projectId,
      });
    } catch (e) {
      console.error('MartAI Rating calculation failed:', e);
    }

    // 11. Prune stale contentMetrics snapshots (prevent unbounded DB growth)
    try {
      await ctx.runMutation(internal.analytics.contentMetrics.pruneStaleSnapshots, {
        projectId,
      });
    } catch (e) {
      console.error('Snapshot pruning failed:', e);
    }

    // RETURNING DATA FOR VERIFICATION
    return { ga4Data, gscData };
  },
});
