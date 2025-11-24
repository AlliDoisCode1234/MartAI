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
    await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const source = searchParams.get('source');

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

    const data = await callConvexQuery(api.analytics.analytics.getAnalyticsData, {
      projectId: projectId as any,
      startDate: parseInt(startDate),
      endDate: parseInt(endDate),
      source: source || undefined,
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Get analytics data error:', error);
    return NextResponse.json(
      { error: 'Failed to get analytics data' },
      { status: 500 }
    );
  }
}

