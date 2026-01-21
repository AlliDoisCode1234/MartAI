import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexQuery, callConvexMutation, unsafeApi } from '@/lib/convexClient';
import { WordPressClient } from '@/lib/integrations/wordpress';
import { ShopifyClient } from '@/lib/integrations/shopify';
import { assertDraftId, assertProjectId } from '@/lib/typeGuards';

// Use unsafeApi to avoid TypeScript type instantiation issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const apiLocal: any = unsafeApi;

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
    const body = await request.json();
    const { draftId, platform, tags, categories, slug } = body;

    if (!draftId || !platform) {
      return NextResponse.json({ error: 'draftId and platform are required' }, { status: 400 });
    }

    if (!apiLocal) {
      return NextResponse.json({ error: 'Convex not configured' }, { status: 503 });
    }

    // Validate required field - type guaranteed after assertion
    const draftIdTyped = assertDraftId(draftId);
    const draft = await callConvexQuery(apiLocal.drafts.getDraftById, {
      draftId: draftIdTyped,
    });

    if (!draft) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
    }

    if (draft.status !== 'approved') {
      return NextResponse.json(
        { error: 'Draft must be approved before publishing' },
        { status: 400 }
      );
    }

    // Get brief for metadata
    const brief = await callConvexQuery(apiLocal.briefs.getBriefById, {
      briefId: draft.briefId,
    });

    // Get OAuth connection
    const projectIdTyped = assertProjectId(draft.projectId);
    const connection = await callConvexQuery(apiLocal.oauthTokens.getOAuthToken, {
      clientId: projectIdTyped,
      platform,
    });

    if (!connection) {
      return NextResponse.json({ error: `${platform} connection not found` }, { status: 404 });
    }

    // Publish to platform with retry logic
    let publishedUrl;
    const title = brief?.titleOptions?.[0] || brief?.title || 'Untitled';
    const content = draft.content;

    const { publishWithRetry } = await import('@/lib/publishingRetry');

    if (platform === 'wordpress') {
      const wpClient = new WordPressClient({
        siteUrl: connection.siteUrl,
        username: connection.wordpressSiteId || 'admin',
        password: connection.accessToken,
      });

      const result = await publishWithRetry(
        async () => {
          const publishResult = await wpClient.createPage({
            title,
            content,
            slug: slug || undefined,
            status: 'publish',
          });
          return { url: publishResult.link };
        },
        {
          maxRetries: 3,
          initialDelayMs: 1000,
          retryableErrors: [
            'ECONNRESET',
            'ETIMEDOUT',
            'timeout',
            'rate limit',
            '429',
            '503',
            '502',
            '500',
          ],
        }
      );

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to publish after retries' },
          { status: 500 }
        );
      }

      publishedUrl = result.url;
    } else if (platform === 'shopify') {
      const shopifyClient = new ShopifyClient({
        shopDomain: connection.shopifyShop || connection.siteUrl,
        accessToken: connection.accessToken,
      });

      const result = await publishWithRetry(
        async () => {
          const publishResult = await shopifyClient.createPage({
            title,
            body_html: content,
            handle: slug || undefined,
            published: true,
          });
          return { url: publishResult.url };
        },
        {
          maxRetries: 3,
          initialDelayMs: 1000,
        }
      );

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to publish after retries' },
          { status: 500 }
        );
      }

      publishedUrl = result.url;
    } else {
      return NextResponse.json({ error: 'Unsupported platform' }, { status: 400 });
    }

    // Update draft and brief status
    await callConvexMutation(apiLocal.drafts.updateDraft, {
      draftId: draftIdTyped,
      status: 'published',
    });

    if (brief) {
      await callConvexMutation(apiLocal.briefs.updateBrief, {
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
