import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { getGSCData } from '@/lib/googleAuth';
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
    const rowLimit = parseInt(searchParams.get('rowLimit') || '100');

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

    const connection = await callConvexQuery(api.gscConnections.getGSCConnection, {
      projectId: projectId as any,
    });

    if (!connection || !connection.accessToken) {
      return NextResponse.json(
        { error: 'GSC not connected' },
        { status: 404 }
      );
    }

    // Get GSC data (top queries)
    const data = await getGSCData(
      connection.accessToken,
      connection.siteUrl,
      startDate,
      endDate,
      rowLimit
    );

    // Update last sync
    if (api) {
      try {
        await callConvexMutation(api.gscConnections.updateLastSync, {
          connectionId: connection._id,
        });
      } catch (error) {
        console.warn('Failed to update last sync:', error);
      }
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Get GSC data error:', error);
    return NextResponse.json(
      { error: 'Failed to get GSC data' },
      { status: 500 }
    );
  }
}

