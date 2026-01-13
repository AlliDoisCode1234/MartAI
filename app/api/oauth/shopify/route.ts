import { NextRequest, NextResponse } from 'next/server';

/**
 * Shopify OAuth Initiation Route
 *
 * GET /api/oauth/shopify?shop=mystore&projectId=xxx
 * Returns authUrl for redirecting user to Shopify authorization
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const shopDomain = searchParams.get('shop');
  const projectId = searchParams.get('projectId');

  if (!shopDomain) {
    return NextResponse.json({ error: 'shop parameter is required' }, { status: 400 });
  }

  if (!projectId) {
    return NextResponse.json({ error: 'projectId parameter is required' }, { status: 400 });
  }

  const clientId = process.env.SHOPIFY_CLIENT_ID;
  if (!clientId) {
    console.error('[Shopify OAuth] SHOPIFY_CLIENT_ID not configured');
    return NextResponse.json({ error: 'Shopify integration not configured' }, { status: 500 });
  }

  const baseUrl = request.nextUrl.origin;
  const redirectUri = `${baseUrl}/api/oauth/shopify/callback`;
  const scopes = 'write_content,read_content';

  // Encode state with projectId for callback
  const state = Buffer.from(
    JSON.stringify({
      projectId,
      returnTo: '/settings?tab=integrations',
    })
  ).toString('base64');

  // Normalize shop domain
  const shop = shopDomain.replace(/\.myshopify\.com$/, '');

  const authUrl =
    `https://${shop}.myshopify.com/admin/oauth/authorize?` +
    `client_id=${clientId}&` +
    `scope=${scopes}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `state=${state}`;

  return NextResponse.json({
    authUrl,
    shop,
    redirectUri,
  });
}

/**
 * Test Shopify connection with existing access token
 * POST /api/oauth/shopify
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shopDomain, accessToken } = body;

    if (!shopDomain || !accessToken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Test Shopify connection using GraphQL
    const shop = shopDomain.replace(/\.myshopify\.com$/, '');
    const response = await fetch(`https://${shop}.myshopify.com/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({
        query: `{ shop { name email myshopifyDomain } }`,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: 'Failed to authenticate with Shopify',
          details: await response.text(),
        },
        { status: 401 }
      );
    }

    const { data, errors } = await response.json();

    if (errors) {
      return NextResponse.json(
        {
          error: 'GraphQL errors',
          details: errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      shopDomain: shop,
      shopName: data.shop?.name,
      shopEmail: data.shop?.email,
      message: 'Shopify connection successful',
    });
  } catch (error) {
    console.error('[Shopify OAuth] Connection test error:', error);
    return NextResponse.json(
      {
        error: 'Failed to connect to Shopify',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
