import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const shopDomain = searchParams.get('shop');
  const redirectUri = searchParams.get('redirectUri') || `${request.nextUrl.origin}/api/oauth/shopify/callback`;
  
  if (!shopDomain) {
    return NextResponse.json({ error: 'shop parameter is required' }, { status: 400 });
  }

  const clientId = process.env.SHOPIFY_API_KEY || 'your-shopify-api-key';
  const scopes = 'write_content,read_content';
  
  const authUrl = `https://${shopDomain.replace(/\.myshopify\.com$/, '')}.myshopify.com/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  
  return NextResponse.json({
    authUrl,
    redirectUri,
    instructions: 'Redirect user to authUrl to authorize the application',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shopDomain, accessToken } = body;
    
    if (!shopDomain || !accessToken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Test Shopify connection
    const shop = shopDomain.replace(/\.myshopify\.com$/, '');
    const response = await fetch(`https://${shop}.myshopify.com/admin/api/2024-01/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ 
        error: 'Failed to authenticate with Shopify',
        details: await response.text(),
      }, { status: 401 });
    }

    const shopData = await response.json();

    return NextResponse.json({
      success: true,
      shopDomain: shop,
      shopName: shopData.shop?.name,
      message: 'Shopify connection successful',
    });
  } catch (error) {
    console.error('Shopify OAuth error:', error);
    return NextResponse.json({ 
      error: 'Failed to connect to Shopify',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

