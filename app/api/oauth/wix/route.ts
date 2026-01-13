import { NextRequest, NextResponse } from 'next/server';

/**
 * Wix OAuth Initiation Route
 *
 * GET /api/oauth/wix?projectId=xxx
 * Returns authUrl for redirecting user to Wix authorization
 *
 * Wix OAuth uses client ID only (no client secret required).
 * Tokens expire in 4 hours and must be refreshed.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'projectId parameter is required' }, { status: 400 });
  }

  const clientId = process.env.WIX_CLIENT_ID;
  if (!clientId) {
    console.error('[Wix OAuth] WIX_CLIENT_ID not configured');
    return NextResponse.json({ error: 'Wix integration not configured' }, { status: 500 });
  }

  const baseUrl = request.nextUrl.origin;
  const redirectUri = `${baseUrl}/api/oauth/wix/callback`;

  // Encode state with projectId for callback
  const state = Buffer.from(
    JSON.stringify({
      projectId,
      returnTo: '/settings?tab=integrations',
    })
  ).toString('base64');

  // Wix OAuth URL
  // Reference: https://dev.wix.com/docs/build-apps/develop-your-app/apis-and-webhooks/oauth
  const authUrl =
    `https://www.wix.com/installer/install?` +
    `token=${clientId}&` +
    `appId=${clientId}&` +
    `redirectUrl=${encodeURIComponent(redirectUri)}&` +
    `state=${state}`;

  return NextResponse.json({
    authUrl,
    redirectUri,
  });
}
