import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const siteUrl = searchParams.get('siteUrl');
  const redirectUri = searchParams.get('redirectUri') || `${request.nextUrl.origin}/api/oauth/wordpress/callback`;
  
  if (!siteUrl) {
    return NextResponse.json({ error: 'siteUrl is required' }, { status: 400 });
  }

  // WordPress OAuth 1.0a or Application Password flow
  // For simplicity, we'll use Application Password which is easier
  const authUrl = `${siteUrl}/wp-admin/admin.php?page=application-passwords`;
  
  return NextResponse.json({
    authUrl,
    instructions: 'Please create an Application Password in WordPress and provide the credentials',
    redirectUri,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { siteUrl, username, password, clientId } = body;
    
    if (!siteUrl || !username || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Test WordPress connection
    const testUrl = `${siteUrl.replace(/\/$/, '')}/wp-json/wp/v2/`;
    const response = await fetch(testUrl, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ 
        error: 'Failed to authenticate with WordPress',
        details: await response.text(),
      }, { status: 401 });
    }

    // Return token info (in production, store securely)
    return NextResponse.json({
      success: true,
      siteUrl,
      username,
      // In production, don't return password
      message: 'WordPress connection successful',
    });
  } catch (error) {
    console.error('WordPress OAuth error:', error);
    return NextResponse.json({ 
      error: 'Failed to connect to WordPress',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

