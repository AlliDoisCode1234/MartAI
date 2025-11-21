import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexQuery, callConvexMutation } from '@/lib/convexClient';
import { WordPressClient } from '@/lib/wordpress';
import { ShopifyClient } from '@/lib/shopify';

// Import api dynamically
let api: any = null;
if (typeof window === 'undefined') {
  try {
    api = require('@/convex/_generated/api')?.api;
  } catch {
    api = null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { draftId, platform, tags, categories, slug } = body;

    if (!draftId || !platform) {
      return NextResponse.json(
        { error: 'draftId and platform are required' },
        { status: 400 }
      );
    }

    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    // Get draft
    const draft = await callConvexQuery(api.drafts.getDraftById, {
      draftId: draftId as any,
    });

    if (!draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      );
    }

    if (draft.status !== 'approved') {
      return NextResponse.json(
        { error: 'Draft must be approved before publishing' },
        { status: 400 }
      );
    }

    // Get brief for metadata
    const brief = await callConvexQuery(api.briefs.getBriefById, {
      briefId: draft.briefId,
    });

    // Get OAuth connection
    const connection = await callConvexQuery(api.oauthTokens.getOAuthToken, {
      clientId: draft.projectId as any,
      platform,
    });
    
    if (!connection) {
      return NextResponse.json(
        { error: `${platform} connection not found` },
        { status: 404 }
      );
    }

    // Publish to platform
    let publishedUrl;
    const title = brief?.titleOptions?.[0] || brief?.title || 'Untitled';
    const content = draft.content;

    if (platform === 'wordpress') {
      const wpClient = new WordPressClient({
        siteUrl: connection.siteUrl,
        username: connection.wordpressSiteId || 'admin', // Use stored username or default
        password: connection.accessToken,
      });
      const result = await wpClient.createPage({
        title,
        content,
        slug: slug || undefined,
        status: 'publish',
      });
      publishedUrl = result.link;
    } else if (platform === 'shopify') {
      const shopifyClient = new ShopifyClient({
        shopDomain: connection.shopifyShop || connection.siteUrl,
        accessToken: connection.accessToken,
      });
      const result = await shopifyClient.createPage({
        title,
        body_html: content,
        handle: slug || undefined,
        published: true,
      });
      publishedUrl = result.url;
    } else {
      return NextResponse.json(
        { error: 'Unsupported platform' },
        { status: 400 }
      );
    }

    // Update draft and brief status
    await callConvexMutation(api.drafts.updateDraft, {
      draftId: draftId as any,
      status: 'published',
    });

    if (brief) {
      await callConvexMutation(api.briefs.updateBrief, {
        briefId: draft.briefId,
        status: 'published',
      });
    }

    return NextResponse.json({
      success: true,
      url: publishedUrl,
    });
  } catch (error) {
    console.error('Publish now error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to publish' },
      { status: 500 }
    );
  }
}

