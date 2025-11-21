import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexQuery, callConvexMutation } from '@/lib/convexClient';
import { getGA4Data, getGSCData } from '@/lib/googleAuth';
import { format } from 'date-fns';

// Import api dynamically
let api: any = null;
if (typeof window === 'undefined') {
  try {
    api = require('@/convex/_generated/api')?.api;
  } catch {
    api = null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { projectId, days = 30 } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      );
    }

    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    // Get GA4 connection by project
    const ga4Connection = await callConvexQuery(api.ga4Connections.getGA4Connection, {
      projectId: projectId as any,
    });

    // Get GSC connection by project
    const gscConnection = await callConvexQuery(api.gscConnections.getGSCConnection, {
      projectId: projectId as any,
    });

    const endDate = Date.now();
    const startDate = endDate - (days * 24 * 60 * 60 * 1000);
    const syncedDates: number[] = [];

    // Sync GA4 data
    if (ga4Connection && ga4Connection.accessToken && ga4Connection.propertyId) {
      try {
        // Format dates for GA4 API (YYYY-MM-DD or '30daysAgo')
        const startDateStr = format(new Date(startDate), 'yyyy-MM-dd');
        const endDateStr = format(new Date(endDate), 'yyyy-MM-dd');
        
        const ga4Data = await getGA4Data(
          ga4Connection.accessToken,
          ga4Connection.propertyId,
          startDateStr,
          endDateStr
        );

        // Parse GA4 response and store data points
        const rows = ga4Data.rows || [];
        for (const row of rows) {
          const dateStr = row.dimensionValues?.[0]?.value;
          const sessions = parseInt(row.metricValues?.[0]?.value || '0');
          const date = dateStr ? new Date(dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')).getTime() : Date.now();
          
          await callConvexMutation(api.analytics.storeAnalyticsData, {
            projectId: projectId as any,
            date,
            source: 'ga4',
            sessions,
          });
          syncedDates.push(date);
        }
      } catch (error) {
        console.error('GA4 sync error:', error);
      }
    }

    // Sync GSC data
    if (gscConnection && gscConnection.accessToken && gscConnection.siteUrl) {
      try {
        // Format dates for GSC API
        const startDateStr = format(new Date(startDate), 'yyyy-MM-dd');
        const endDateStr = format(new Date(endDate), 'yyyy-MM-dd');
        
        const gscData = await getGSCData(
          gscConnection.accessToken,
          gscConnection.siteUrl,
          startDateStr,
          endDateStr
        );

        // Parse GSC response - it returns aggregated data, not daily
        // For now, store as single data point or parse if daily data available
        const rows = gscData.rows || [];
        if (rows.length > 0) {
          // GSC typically returns aggregated data, store as end date
          const totalClicks = rows.reduce((sum: number, r: any) => sum + (parseInt(r.clicks) || 0), 0);
          const totalImpressions = rows.reduce((sum: number, r: any) => sum + (parseInt(r.impressions) || 0), 0);
          const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
          const avgPos = rows.reduce((sum: number, r: any) => sum + (parseFloat(r.position) || 0), 0) / rows.length;
          
          await callConvexMutation(api.analytics.storeAnalyticsData, {
            projectId: projectId as any,
            date: endDate,
            source: 'gsc',
            clicks: totalClicks,
            impressions: totalImpressions,
            ctr: avgCTR,
            avgPosition: avgPos,
          });
          syncedDates.push(endDate);
        }
      } catch (error) {
        console.error('GSC sync error:', error);
      }
    }

    // Generate insights
    await generateInsights(projectId, startDate, endDate);

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

async function generateInsights(projectId: string, startDate: number, endDate: number) {
  if (!api) return;

  try {
    const data = await callConvexQuery(api.analytics.getAnalyticsData, {
      projectId: projectId as any,
      startDate,
      endDate,
    });

    // Simple insight generation
    const ga4Data = data.filter((d: any) => d.source === 'ga4');
    const gscData = data.filter((d: any) => d.source === 'gsc');

    // Top gainers - pages with most traffic growth
    if (ga4Data.length > 0) {
      const avgSessions = ga4Data.reduce((sum: number, d: any) => sum + (d.sessions || 0), 0) / ga4Data.length;
      if (avgSessions > 1000) {
        await callConvexMutation(api.analytics.storeInsight, {
          projectId: projectId as any,
          type: 'top_gainer',
          title: 'Strong Traffic Growth',
          description: `Average ${Math.round(avgSessions)} sessions per day. Consider doubling down on top-performing content.`,
          action: 'view_content',
        });
      }
    }

    // Underperformers - low CTR
    if (gscData.length > 0) {
      const avgCTR = gscData.reduce((sum: number, d: any) => sum + (d.ctr || 0), 0) / gscData.length;
      if (avgCTR < 2) {
        await callConvexMutation(api.analytics.storeInsight, {
          projectId: projectId as any,
          type: 'underperformer',
          title: 'Low Click-Through Rate',
          description: `CTR is ${avgCTR.toFixed(1)}%. Improve meta titles and descriptions to increase clicks.`,
          action: 'improve_meta',
        });
      }
    }

    // Quick wins - high impressions, low clicks
    const highImpressions = gscData.filter((d: any) => (d.impressions || 0) > 1000 && (d.clicks || 0) < 50);
    if (highImpressions.length > 0) {
      await callConvexMutation(api.analytics.storeInsight, {
        projectId: projectId as any,
        type: 'quick_win',
        title: 'Quick Win Opportunity',
        description: `${highImpressions.length} keywords have high impressions but low clicks. Optimize these for immediate gains.`,
        action: 'optimize_keywords',
      });
    }
  } catch (error) {
    console.error('Generate insights error:', error);
  }
}

