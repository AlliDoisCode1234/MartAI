import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, requireAuth } from '@/lib/authMiddleware';
import { getGA4Properties } from '@/lib/googleAuth';
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
    await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }

    // Get GA4 connection
    if (!api) {
      return NextResponse.json({ error: 'Convex not configured' }, { status: 503 });
    }

    const connection = await callConvexQuery(api.integrations.ga4Connections.getGA4Connection, {
      projectId: projectId as any,
    });

    if (!connection || !connection.accessToken) {
      return NextResponse.json({ error: 'GA4 not connected' }, { status: 404 });
    }

    // Refresh token if needed
    let accessToken = connection.accessToken;

    // Get properties with auto-refresh
    const properties = await getGA4Properties(
      accessToken,
      connection.refreshToken,
      async (tokens) => {
        console.log('Refreshed GA4 tokens, updating connection...');
        if (tokens.access_token) {
          await callConvexMutation(api.integrations.ga4Connections.updateTokens, {
            connectionId: connection._id,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token, // optional, might not always rotate
          });
        }
      }
    );

    return NextResponse.json({ properties });
  } catch (error) {
    console.error('Get GA4 properties error:', error);
    return NextResponse.json({ error: 'Failed to get GA4 properties' }, { status: 500 });
  }
}
