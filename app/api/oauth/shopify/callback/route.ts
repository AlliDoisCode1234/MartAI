import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  console.warn('[Shopify Callback] NEXT_PUBLIC_CONVEX_URL is not defined');
}

const convex = convexUrl ? new ConvexHttpClient(convexUrl) : null;

/**
 * Shopify OAuth Callback Handler
 *
 * GET /api/oauth/shopify/callback?code=xxx&shop=xxx&state=xxx
 * Exchanges authorization code for access token and stores connection
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const shop = req.nextUrl.searchParams.get('shop');
  const stateParam = req.nextUrl.searchParams.get('state');
  const error = req.nextUrl.searchParams.get('error');

  const baseUrl = new URL(req.url).origin;

  // Handle OAuth errors
  if (error) {
    console.error('[Shopify Callback] OAuth error:', error);
    return NextResponse.redirect(new URL(`/settings?tab=integrations&error=${error}`, baseUrl));
  }

  // Validate required params
  if (!code || !shop || !stateParam) {
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
    console.log(`[Shopify Callback] Decoded state - projectId: ${projectId}`);
  } catch {
    console.error('[Shopify Callback] Failed to decode state parameter');
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
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('[Shopify Callback] Missing SHOPIFY_CLIENT_ID or SHOPIFY_CLIENT_SECRET');
    return NextResponse.redirect(new URL('/settings?tab=integrations&error=config_error', baseUrl));
  }

  try {
    // Normalize shop domain
    const shopDomain = shop.replace(/\.myshopify\.com$/, '');

    // Exchange authorization code for access token
    const tokenResponse = await fetch(
      `https://${shopDomain}.myshopify.com/admin/oauth/access_token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[Shopify Callback] Token exchange failed:', errorText);
      return NextResponse.redirect(
        new URL('/settings?tab=integrations&error=token_exchange_failed', baseUrl)
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error('[Shopify Callback] No access token in response');
      return NextResponse.redirect(
        new URL('/settings?tab=integrations&error=no_access_token', baseUrl)
      );
    }

    // Get shop details via GraphQL
    const shopResponse = await fetch(
      `https://${shopDomain}.myshopify.com/admin/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
        },
        body: JSON.stringify({
          query: `{ shop { name email myshopifyDomain } }`,
        }),
      }
    );

    const shopData = shopResponse.ok ? await shopResponse.json() : null;
    const shopName = shopData?.data?.shop?.name || shopDomain;

    console.log(`[Shopify Callback] Connected shop: ${shopName} (${shopDomain})`);

    // Store connection in Convex (if client available)
    if (convex) {
      try {
        await convex.mutation(api.integrations.platformConnections.saveConnection, {
          projectId: projectId as any,
          platform: 'shopify',
          siteUrl: `https://${shopDomain}.myshopify.com`,
          siteName: shopName,
          credentials: {
            accessToken,
          },
        });
        console.log(`[Shopify Callback] Connection stored for project: ${projectId}`);
      } catch (convexError) {
        console.error('[Shopify Callback] Failed to store connection:', convexError);
        // Continue anyway - user can retry
      }
    }

    // Redirect back with success
    const successUrl = new URL(returnTo, baseUrl);
    successUrl.searchParams.set('shopify', 'connected');
    successUrl.searchParams.set('shop', shopDomain);
    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error('[Shopify Callback] Unexpected error:', error);
    return NextResponse.redirect(
      new URL('/settings?tab=integrations&error=unexpected_error', baseUrl)
    );
  }
}
