import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { getGA4Data } from '@/lib/googleAuth';
import { callConvexQuery, callConvexMutation } from '@/lib/convexClient';

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
    const startDate = searchParams.get('startDate') || '30daysAgo';
    const endDate = searchParams.get('endDate') || 'today';

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

    const connection = await callConvexQuery(api.ga4Connections.getGA4Connection, {
      projectId: projectId as any,
    });

    if (!connection || !connection.accessToken) {
      return NextResponse.json(
        { error: 'GA4 not connected' },
        { status: 404 }
      );
    }

    // Get GA4 data
    const data = await getGA4Data(
      connection.accessToken,
      connection.propertyId,
      startDate,
      endDate
    );

    // Update last sync
    if (api) {
      try {
        await callConvexMutation(api.ga4Connections.updateLastSync, {
          connectionId: connection._id,
        });
      } catch (error) {
        console.warn('Failed to update last sync:', error);
      }
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Get GA4 data error:', error);
    return NextResponse.json(
      { error: 'Failed to get GA4 data' },
      { status: 500 }
    );
  }
}

