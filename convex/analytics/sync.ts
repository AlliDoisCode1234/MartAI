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
    const ga4Connection = await ctx.runQuery(api.integrations.ga4Connections.getGA4Connection, {
      projectId,
    });
    const gscConnection = await ctx.runQuery(api.integrations.gscConnections.getGSCConnection, {
      projectId,
    });

    let ga4Data: NormalizedGA4Metrics | null = null;
    let gscData: NormalizedGSCMetrics | null = null;

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

        // Parse and normalize GA4 response using pure transform functions
        const parsed = parseGA4Response(raw);
        if (parsed) {
          ga4Data = normalizeGA4Metrics(parsed);
        }

        await ctx.runMutation(api.integrations.ga4Connections.updateLastSync, {
          connectionId: ga4Connection._id,
        });
      } catch (e) {
        console.error(`GA4 Sync Failed for project ${projectId}:`, e);
      }
    }

    // 3. Fetch GSC Data (keyword-level data)
    if (gscConnection) {
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

        await ctx.runMutation(api.integrations.gscConnections.updateLastSync, {
          connectionId: gscConnection._id,
        });
      } catch (e) {
        console.error(`[GSC Sync] Failed for project ${projectId}:`, e);
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
        // NOTE: leads and revenue removed — we don't fabricate metrics
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

    // RETURNING DATA FOR VERIFICATION
    return { ga4Data, gscData };
  },
});
