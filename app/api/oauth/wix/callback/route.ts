import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexHttpClient(convexUrl) : null;

/**
 * Wix OAuth Callback Handler
 *
 * GET /api/oauth/wix/callback?code=xxx&instanceId=xxx&state=xxx
 * Exchanges authorization code for access token and stores connection
 *
 * Wix tokens expire in 4 hours - refresh token is long-lived.
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const instanceId = req.nextUrl.searchParams.get('instanceId');
  const stateParam = req.nextUrl.searchParams.get('state');
  const error = req.nextUrl.searchParams.get('error');

  const baseUrl = new URL(req.url).origin;

  // Handle OAuth errors
  if (error) {
    console.error('[Wix Callback] OAuth error:', error);
    return NextResponse.redirect(new URL(`/settings?tab=integrations&error=${error}`, baseUrl));
  }

  // Validate required params
  if (!code || !stateParam) {
    return NextResponse.redirect(
      new URL('/settings?tab=integrations&error=missing_params', baseUrl)
    );
  }

  // Decode state parameter
  let projectId: string | undefined;
  let returnTo: string = '/settings?tab=integrations';
  try {
    const stateJson = Buffer.from(stateParam, 'base64').toString('utf-8');
    const stateData = JSON.parse(stateJson);
    projectId = stateData.projectId;
    returnTo = stateData.returnTo || returnTo;
    console.log(`[Wix Callback] Decoded state - projectId: ${projectId}`);
  } catch {
    console.error('[Wix Callback] Failed to decode state parameter');
    return NextResponse.redirect(
      new URL('/settings?tab=integrations&error=invalid_state', baseUrl)
    );
  }

  if (!projectId) {
    return NextResponse.redirect(
      new URL('/settings?tab=integrations&error=missing_project_id', baseUrl)
    );
  }

  // Exchange code for access token
  const clientId = process.env.WIX_CLIENT_ID;
  const clientSecret = process.env.WIX_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('[Wix Callback] Missing WIX_CLIENT_ID or WIX_CLIENT_SECRET');
    return NextResponse.redirect(new URL('/settings?tab=integrations&error=config_error', baseUrl));
  }

  try {
    // Exchange authorization code for access token
    // Reference: https://dev.wix.com/docs/rest/api-reference/auth/oauth/create-access-token
    const tokenResponse = await fetch('https://www.wixapis.com/oauth/access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[Wix Callback] Token exchange failed:', errorText);
      return NextResponse.redirect(
        new URL('/settings?tab=integrations&error=token_exchange_failed', baseUrl)
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;

    if (!accessToken) {
      console.error('[Wix Callback] No access token in response');
      return NextResponse.redirect(
        new URL('/settings?tab=integrations&error=no_access_token', baseUrl)
      );
    }

    // Get site details
    const siteResponse = await fetch('https://www.wixapis.com/site-properties/v4/properties', {
      headers: {
        Authorization: accessToken,
      },
    });

    let siteName = instanceId || 'Wix Site';
    let siteUrl = '';

    if (siteResponse.ok) {
      const siteData = await siteResponse.json();
      siteName = siteData.properties?.siteDisplayName || siteName;
      siteUrl = siteData.properties?.url || '';
    }

    console.log(`[Wix Callback] Connected site: ${siteName}`);

    // Store connection in Convex
    if (convex) {
      try {
        await convex.mutation(api.integrations.platformConnections.saveConnection, {
          projectId: projectId as any,
          platform: 'wix',
          siteUrl: siteUrl || `https://wix.com/site/${instanceId}`,
          siteName,
          credentials: {
            accessToken,
            refreshToken,
          },
        });
        console.log(`[Wix Callback] Connection stored for project: ${projectId}`);
      } catch (convexError) {
        console.error('[Wix Callback] Failed to store connection:', convexError);
      }
    }

    // Redirect back with success
    const successUrl = new URL(returnTo, baseUrl);
    successUrl.searchParams.set('wix', 'connected');
    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error('[Wix Callback] Unexpected error:', error);
    return NextResponse.redirect(
      new URL('/settings?tab=integrations&error=unexpected_error', baseUrl)
    );
  }
}
