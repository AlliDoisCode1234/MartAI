import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, requireAuth } from '@/lib/authMiddleware';
import { getGA4Properties } from '@/lib/googleAuth';
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

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      );
    }

    // Get GA4 connection
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

    // Refresh token if needed
    let accessToken = connection.accessToken;
    // TODO: Implement token refresh logic

    // Get properties
    const properties = await getGA4Properties(accessToken);

    return NextResponse.json({ properties });
  } catch (error) {
    console.error('Get GA4 properties error:', error);
    return NextResponse.json(
      { error: 'Failed to get GA4 properties' },
      { status: 500 }
    );
  }
}

