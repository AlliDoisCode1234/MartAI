'use node';
import { internalAction } from '../_generated/server';
import { v } from 'convex/values';
import { api, internal } from '../_generated/api';
import { THRESHOLDS } from '../config/thresholds';

export const syncProjectData = internalAction({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const projectId = args.projectId;
    const now = Date.now();
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

    let ga4Data = null;
    let gscData = null;

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
        })) as { rows?: Array<{ metricValues: Array<{ value: string }> }> };

        // Parse GA4 Response structure
        // Metrics order: sessions, totalUsers, userEngagementDuration, screenPageViews, bounceRate, averageSessionDuration, newUsers
        if (raw.rows && raw.rows.length > 0) {
          const row = raw.rows[0];
          const getValue = (index: number) => parseFloat(row.metricValues[index]?.value || '0');
          ga4Data = {
            sessions: getValue(0),
            users: getValue(1),
            engagementDuration: getValue(2),
            pageViews: getValue(3),
            bounceRate: getValue(4),
            avgSessionDuration: getValue(5),
            newUsers: getValue(6),
          };
        }
        await ctx.runMutation(api.integrations.ga4Connections.updateLastSync, {
          connectionId: ga4Connection._id,
        });
      } catch (e) {
        console.error(`GA4 Sync Failed for project ${projectId}:`, e);
      }
    }

    // 3. Fetch GSC Data (now returns keyword-level data)
    if (gscConnection) {
      try {
        const raw = (await ctx.runAction(internal.integrations.google.fetchGSCMetrics, {
          connectionId: gscConnection._id,
          siteUrl: gscConnection.siteUrl,
          accessToken: gscConnection.accessToken,
          refreshToken: gscConnection.refreshToken,
          startDate,
          endDate,
        })) as {
          rows?: Array<{
            keys?: string[];
            clicks?: number;
            impressions?: number;
            ctr?: number;
            position?: number;
          }>;
        };

        // Parse GSC Response - now with keyword (query) data
        if (raw.rows && raw.rows.length > 0) {
          // Aggregate totals for analytics data
          let totalClicks = 0;
          let totalImpressions = 0;
          let avgPosition = 0;

          // Store each keyword snapshot
          for (const row of raw.rows) {
            const keyword = row.keys?.[0] || 'unknown';
            const clicks = row.clicks || 0;
            const impressions = row.impressions || 0;
            const ctr = row.ctr || 0;
            const position = row.position || 0;

            totalClicks += clicks;
            totalImpressions += impressions;
            avgPosition += position;

            // Store keyword snapshot for history
            await ctx.runMutation(internal.analytics.gscKeywords.storeKeywordSnapshot, {
              projectId,
              syncDate: now,
              keyword,
              clicks,
              impressions,
              ctr,
              position,
            });
          }

          // Calculate averages
          avgPosition = raw.rows.length > 0 ? avgPosition / raw.rows.length : 0;

          gscData = {
            clicks: totalClicks,
            impressions: totalImpressions,
            ctr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
            position: avgPosition,
          };
        }
        await ctx.runMutation(api.integrations.gscConnections.updateLastSync, {
          connectionId: gscConnection._id,
        });
      } catch (e) {
        console.error(`GSC Sync Failed for project ${projectId}:`, e);
      }
    }

    // 4. Save Data (Upsert to analyticsData)
    if (ga4Data) {
      await ctx.runMutation(api.analytics.analytics.storeAnalyticsData, {
        projectId,
        date: now,
        source: 'ga4',
        sessions: ga4Data.sessions,
        pageViews: ga4Data.pageViews,
        bounceRate: ga4Data.bounceRate,
        avgSessionDuration: ga4Data.avgSessionDuration,
        leads: 0, // Placeholder
        revenue: 0, // Placeholder
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
        date: now, // We are saving "Sync Date" as the data point for trend tracking
        source: 'gsc',
        clicks: gscData.clicks,
        impressions: gscData.impressions,
        ctr: gscData.ctr,
        avgPosition: gscData.position,
      });

      // Insight: High Impressions, Low CTR (using centralized thresholds)
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
          description: `You have ${quickWins.length} keywords ranking on page 2 with high impressions. Top opportunities: ${topQuickWins.map((k) => k.keyword).join(', ')}`,
          action: 'Create Content',
          metadata: {
            keywords: topQuickWins.map((k) => ({
              keyword: k.keyword,
              position: k.position,
              impressions: k.impressions,
            })),
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

    // 10. Calculate MartAI Rating (MR) - the hero metric
    try {
      await ctx.runAction(internal.analytics.martaiRating.calculateMartAIRating, {
        projectId,
      });
    } catch (e) {
      console.error('MartAI Rating calculation failed:', e);
    }

    // RETURNING DATA FOR VERIFICATION
    return { ga4Data, gscData };
  },
});
