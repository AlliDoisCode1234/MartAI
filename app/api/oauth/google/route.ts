import { NextRequest, NextResponse } from 'next/server';
import { getAuthUrl, COMBINED_SCOPES } from '@/lib/googleAuth';
import { verifyAuth } from '@/lib/authMiddleware';

export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const auth = verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // 'ga4' or 'gsc'
    const projectId = searchParams.get('projectId');

    if (!type || !projectId) {
      return NextResponse.json(
        { error: 'type and projectId are required' },
        { status: 400 }
      );
    }

    // Determine scopes based on type
    const scopes = type === 'ga4' 
      ? ['https://www.googleapis.com/auth/analytics.readonly']
      : type === 'gsc'
      ? ['https://www.googleapis.com/auth/webmasters.readonly']
      : COMBINED_SCOPES;

    // Generate state with user and project info
    const state = JSON.stringify({
      userId: auth.user.userId,
      projectId,
      type,
    });

    const authUrl = getAuthUrl(scopes, Buffer.from(state).toString('base64'));

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Google OAuth initiation error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate OAuth' },
      { status: 500 }
    );
  }
}

