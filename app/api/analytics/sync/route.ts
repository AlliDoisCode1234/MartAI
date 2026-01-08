import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexQuery, callConvexMutation, api } from '@/lib/convexClient';
import { getGA4Data, getGSCData } from '@/lib/googleAuth';
import { formatDate } from '@/lib/dateUtils';
import { assertProjectId } from '@/lib/typeGuards';
import type { ProjectId } from '@/types';
import type { GSCRow, AnalyticsDataPoint } from '@/types/external/google';
import type { Auth } from 'googleapis';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;

    if (!isCron) {
      await requireAuth(request);
    }
    const body = await request.json();
    const { projectId, days = 30 } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }

    // Validate required field - type guaranteed after assertion
    const projectIdTyped = assertProjectId(projectId);

    // Get GA4 connection by project
    const ga4Connection = await callConvexQuery(api.integrations.ga4Connections.getGA4Connection, {
      projectId: projectIdTyped,
    });

    // Get GSC connection by project
    const gscConnection = await callConvexQuery(api.integrations.gscConnections.getGSCConnection, {
      projectId: projectIdTyped,
    });

    const endDate = Date.now();
    const startDate = endDate - days * 24 * 60 * 60 * 1000;
    const syncedDates: number[] = [];

    // Sync GA4 data
    if (ga4Connection && ga4Connection.accessToken && ga4Connection.propertyId) {
      try {
        // Format dates for GA4 API (YYYY-MM-DD or '30daysAgo')
        const startDateStr = formatDate(startDate, 'yyyy-MM-dd');
        const endDateStr = formatDate(endDate, 'yyyy-MM-dd');

        const ga4Data = await getGA4Data(
          ga4Connection.accessToken,
          ga4Connection.refreshToken,
          ga4Connection.propertyId,
          startDateStr,
          endDateStr,
          async (newTokens: Auth.Credentials) => {
            try {
              // Guard against null/undefined tokens
              if (!newTokens.access_token) {
                console.warn('No access token in refreshed credentials, skipping update');
                return;
              }
              await callConvexMutation(api.integrations.ga4Connections.upsertGA4Connection, {
                projectId: projectIdTyped,
                propertyId: ga4Connection.propertyId,
                propertyName: ga4Connection.propertyName ?? 'Unknown',
                accessToken: newTokens.access_token,
                refreshToken: newTokens.refresh_token ?? ga4Connection.refreshToken,
              });
            } catch (tokenError) {
              console.warn('Failed to update GA4 tokens in sync:', tokenError);
            }
          }
        );

        // Parse GA4 response and store data points
        const rows = ga4Data.rows || [];
        for (const row of rows) {
          const dateStr = row.dimensionValues?.[0]?.value;
          const sessions = parseInt(row.metricValues?.[0]?.value || '0');
          const date = dateStr
            ? new Date(dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')).getTime()
            : Date.now();

          await callConvexMutation(api.analytics.analytics.storeAnalyticsData, {
            projectId: projectIdTyped,
            date,
            source: 'ga4',
            sessions,
          });
          syncedDates.push(date);
        }
      } catch (ga4Error) {
        console.error('GA4 sync error:', ga4Error);
      }
    }

    // Sync GSC data
    if (gscConnection && gscConnection.accessToken && gscConnection.siteUrl) {
      try {
        // Format dates for GSC API
        const startDateStr = formatDate(startDate, 'yyyy-MM-dd');
        const endDateStr = formatDate(endDate, 'yyyy-MM-dd');

        const gscData = await getGSCData(
          gscConnection.accessToken,
          gscConnection.refreshToken,
          gscConnection.siteUrl,
          startDateStr,
          endDateStr,
          100, // rowLimit default
          async (newTokens: Auth.Credentials) => {
            try {
              // Guard against null/undefined tokens
              if (!newTokens.access_token) {
                console.warn('No access token in refreshed credentials, skipping update');
                return;
              }
              await callConvexMutation(api.integrations.gscConnections.upsertGSCConnection, {
                projectId: projectIdTyped,
                siteUrl: gscConnection.siteUrl,
                accessToken: newTokens.access_token,
                refreshToken: newTokens.refresh_token ?? gscConnection.refreshToken,
              });
            } catch (tokenError) {
              console.warn('Failed to update GSC tokens in sync:', tokenError);
            }
          }
        );

        // Parse GSC response - it returns aggregated data, not daily
        // For now, store as single data point or parse if daily data available
        const rows: GSCRow[] = gscData.rows || [];
        if (rows.length > 0) {
          // GSC typically returns aggregated data, store as end date
          const totalClicks = rows.reduce((sum: number, r: GSCRow) => sum + (r.clicks || 0), 0);
          const totalImpressions = rows.reduce(
            (sum: number, r: GSCRow) => sum + (r.impressions || 0),
            0
          );
          const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
          const avgPos =
            rows.reduce((sum: number, r: GSCRow) => sum + (r.position || 0), 0) / rows.length;

          await callConvexMutation(api.analytics.analytics.storeAnalyticsData, {
            projectId: projectIdTyped,
            date: endDate,
            source: 'gsc',
            clicks: totalClicks,
            impressions: totalImpressions,
            ctr: avgCTR,
            avgPosition: avgPos,
          });
          syncedDates.push(endDate);
        }
      } catch (gscError) {
        console.error('GSC sync error:', gscError);
      }
    }

    // Generate insights - pass validated projectId
    await generateInsights(projectIdTyped, startDate, endDate);

    return NextResponse.json({
      success: true,
      syncedDates: syncedDates.length,
    });
  } catch (error) {
    console.error('Sync analytics error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to sync analytics' },
      { status: 500 }
    );
  }
}

async function generateInsights(projectId: ProjectId, startDate: number, endDate: number) {
  try {
    const data = await callConvexQuery(api.analytics.analytics.getAnalyticsData, {
      projectId,
      startDate,
      endDate,
    });

    // Simple insight generation - type the data properly
    const analyticsData = data as AnalyticsDataPoint[];
    const ga4Data = analyticsData.filter((d) => d.source === 'ga4');
    const gscData = analyticsData.filter((d) => d.source === 'gsc');

    // Top gainers - pages with most traffic growth
    if (ga4Data.length > 0) {
      const avgSessions = ga4Data.reduce((sum, d) => sum + (d.sessions || 0), 0) / ga4Data.length;
      if (avgSessions > 1000) {
        await callConvexMutation(api.analytics.analytics.storeInsight, {
          projectId,
          type: 'top_gainer',
          title: 'Strong Traffic Growth',
          description: `Average ${Math.round(avgSessions)} sessions per day. Consider doubling down on top-performing content.`,
          action: 'view_content',
        });
      }
    }

    // Underperformers - low CTR
    if (gscData.length > 0) {
      const avgCTR = gscData.reduce((sum, d) => sum + (d.ctr || 0), 0) / gscData.length;
      if (avgCTR < 2) {
        await callConvexMutation(api.analytics.analytics.storeInsight, {
          projectId,
          type: 'underperformer',
          title: 'Low Click-Through Rate',
          description: `CTR is ${avgCTR.toFixed(1)}%. Improve meta titles and descriptions to increase clicks.`,
          action: 'improve_meta',
        });
      }
    }

    // Quick wins - high impressions, low clicks
    const highImpressions = gscData.filter(
      (d) => (d.impressions || 0) > 1000 && (d.clicks || 0) < 50
    );
    if (highImpressions.length > 0) {
      await callConvexMutation(api.analytics.analytics.storeInsight, {
        projectId,
        type: 'quick_win',
        title: 'Quick Win Opportunity',
        description: `${highImpressions.length} keywords have high impressions but low clicks. Optimize these for immediate gains.`,
        action: 'optimize_keywords',
      });
    }
  } catch (insightError) {
    console.error('Generate insights error:', insightError);
  }
}
