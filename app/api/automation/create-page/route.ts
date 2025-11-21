import { NextRequest, NextResponse } from 'next/server';
import { WordPressClient, generateServicesPageContent as wpGenerateContent } from '@/lib/wordpress';
import { ShopifyClient, generateServicesPageContent as shopifyGenerateContent } from '@/lib/shopify';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      platform,
      clientId, // Convex client ID
      companyName,
      industry,
      targetAudience,
      keywords,
      // OAuth credentials
      siteUrl,
      username,
      password, // WordPress app password or Shopify access token
      shopDomain, // For Shopify
    } = body;

    if (!platform || !keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json({ error: 'Missing required fields: platform, keywords' }, { status: 400 });
    }

    if (platform === 'wordpress') {
      if (!siteUrl || !username || !password) {
        return NextResponse.json({ error: 'WordPress requires siteUrl, username, and password' }, { status: 400 });
      }

      const wpClient = new WordPressClient({ siteUrl, username, password });
      
      // Test connection
      const isConnected = await wpClient.testConnection();
      if (!isConnected) {
        return NextResponse.json({ error: 'Failed to connect to WordPress' }, { status: 401 });
      }

      // Generate content
      const content = wpGenerateContent(companyName, industry, keywords, targetAudience);
      const pageTitle = keywords[0] ? `${keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1)} Services` : 'Our Services';
      const slug = `services-${keywords[0]?.toLowerCase().replace(/\s+/g, '-') || 'page'}`;

      // Create page
      const result = await wpClient.createPage({
        title: pageTitle,
        content,
        slug,
        status: 'publish',
        excerpt: `Comprehensive ${industry} services for ${targetAudience}`,
      });

      return NextResponse.json({
        success: true,
        platform: 'wordpress',
        pageId: result.id,
        pageUrl: result.link,
        title: pageTitle,
        keywords,
      });
    }

    if (platform === 'shopify') {
      if (!shopDomain || !password) {
        return NextResponse.json({ error: 'Shopify requires shopDomain and accessToken' }, { status: 400 });
      }

      const shopifyClient = new ShopifyClient({
        shopDomain,
        accessToken: password,
      });

      // Test connection
      const isConnected = await shopifyClient.testConnection();
      if (!isConnected) {
        return NextResponse.json({ error: 'Failed to connect to Shopify' }, { status: 401 });
      }

      // Generate content
      const content = shopifyGenerateContent(companyName, industry, keywords, targetAudience);
      const pageTitle = keywords[0] ? `${keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1)} Services` : 'Our Services';
      const handle = `services-${keywords[0]?.toLowerCase().replace(/\s+/g, '-') || 'page'}`;

      // Create page
      const result = await shopifyClient.createPage({
        title: pageTitle,
        body_html: content,
        handle,
        published: true,
      });

      return NextResponse.json({
        success: true,
        platform: 'shopify',
        pageId: result.id,
        pageUrl: result.url,
        title: pageTitle,
        keywords,
      });
    }

    return NextResponse.json({ error: 'Unsupported platform. Use "wordpress" or "shopify"' }, { status: 400 });
  } catch (error) {
    console.error('Page creation error:', error);
    return NextResponse.json({
      error: 'Failed to create page',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

