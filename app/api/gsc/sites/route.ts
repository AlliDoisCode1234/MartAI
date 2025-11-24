import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { getGSCSites } from '@/lib/googleAuth';
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

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      );
    }

    // Get GSC connection
    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    const connection = await callConvexQuery(api.integrations.gscConnections.getGSCConnection, {
      projectId: projectId as any,
    });

    if (!connection || !connection.accessToken) {
      return NextResponse.json(
        { error: 'GSC not connected' },
        { status: 404 }
      );
    }

    // Get sites
    const sites = await getGSCSites(connection.accessToken);

    return NextResponse.json({ sites });
  } catch (error) {
    console.error('Get GSC sites error:', error);
    return NextResponse.json(
      { error: 'Failed to get GSC sites' },
      { status: 500 }
    );
  }
}

