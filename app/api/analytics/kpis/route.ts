import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexQuery } from '@/lib/convexClient';

// Import api dynamically
let api: any = null;
if (typeof window === 'undefined') {
  try {
    api = require('@/convex/_generated/api')?.api;
  } catch {
    api = null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!projectId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'projectId, startDate, and endDate are required' },
        { status: 400 }
      );
    }

    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    // Get current period KPIs
    const currentKPIs = await callConvexQuery(api.analytics.analytics.getKPIs, {
      projectId: projectId as any,
      startDate: parseInt(startDate),
      endDate: parseInt(endDate),
    });

    // Get previous period for comparison
    const periodLength = parseInt(endDate) - parseInt(startDate);
    const prevStartDate = parseInt(startDate) - periodLength;
    const prevEndDate = parseInt(startDate) - 1;

    const previousKPIs = await callConvexQuery(api.analytics.analytics.getKPIs, {
      projectId: projectId as any,
      startDate: prevStartDate,
      endDate: prevEndDate,
    });

    // Calculate changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const kpis = {
      sessions: {
        value: currentKPIs.sessions,
        change: calculateChange(currentKPIs.sessions, previousKPIs.sessions),
        previous: previousKPIs.sessions,
      },
      clicks: {
        value: currentKPIs.clicks,
        change: calculateChange(currentKPIs.clicks, previousKPIs.clicks),
        previous: previousKPIs.clicks,
      },
      ctr: {
        value: currentKPIs.ctr,
        change: calculateChange(currentKPIs.ctr, previousKPIs.ctr),
        previous: previousKPIs.ctr,
      },
      avgPosition: {
        value: currentKPIs.avgPosition,
        change: calculateChange(currentKPIs.avgPosition, previousKPIs.avgPosition),
        previous: previousKPIs.avgPosition,
      },
      leads: {
        value: currentKPIs.leads,
        change: calculateChange(currentKPIs.leads, previousKPIs.leads),
        previous: previousKPIs.leads,
      },
      revenue: {
        value: currentKPIs.revenue,
        change: calculateChange(currentKPIs.revenue, previousKPIs.revenue),
        previous: previousKPIs.revenue,
      },
      conversionRate: {
        value: currentKPIs.conversionRate,
        change: calculateChange(currentKPIs.conversionRate, previousKPIs.conversionRate),
        previous: previousKPIs.conversionRate,
      },
    };

    return NextResponse.json({ kpis });
  } catch (error) {
    console.error('Get KPIs error:', error);
    return NextResponse.json(
      { error: 'Failed to get KPIs' },
      { status: 500 }
    );
  }
}

