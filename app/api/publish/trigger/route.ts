import { NextRequest, NextResponse } from 'next/server';
import { callConvexQuery, callConvexMutation } from '@/lib/convexClient';
import { WordPressClient } from '@/lib/integrations/wordpress';
import { ShopifyClient } from '@/lib/integrations/shopify';

export const dynamic = 'force-dynamic';

// Import api dynamically
let api: any = null;
if (typeof window === 'undefined') {
  try {
    api = require('@/convex/_generated/api')?.api;
  } catch {
    api = null;
  }
}

/**
 * This endpoint can be called by a cron job or webhook
 * to check for and publish scheduled posts
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization');
    const expectedAuth = process.env.CRON_SECRET || 'your-cron-secret';

    if (authHeader !== `Bearer ${expectedAuth}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!api) {
      return NextResponse.json({ error: 'Convex not configured' }, { status: 503 });
    }

    const body = await request.json().catch(() => ({}));
    const { postId } = body;

    // If postId provided, publish that specific post
    if (postId) {
      const post = await callConvexQuery(api.publishing.scheduledPosts.getScheduledPostById, {
        postId: postId as any,
      });

      if (!post || post.status !== 'scheduled') {
        return NextResponse.json({ error: 'Post not found or not scheduled' }, { status: 404 });
      }

      const duePosts = [post];
      return await processPosts(duePosts, api);
    }

    // Otherwise, get all due posts
    const now = Date.now();
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');

    let allPosts: any[] = [];

    if (projectId) {
      allPosts =
        (await callConvexQuery(api.publishing.scheduledPosts.getScheduledPosts, {
          projectId: projectId as any,
        })) || [];
    } else {
      // Use internal query to get all due posts across all projects
      const duePostsQuery = await callConvexQuery(api.publishing.scheduledPosts.getDuePosts, {
        beforeTime: now,
      });
      allPosts = duePostsQuery || [];
    }

    const duePosts = (allPosts || []).filter(
      (p: any) => p.status === 'scheduled' && p.publishDate <= now
    );

    return await processPosts(duePosts, api);
  } catch (error) {
    console.error('Trigger publish error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to trigger publish' },
      { status: 500 }
    );
  }
}

async function processPosts(duePosts: any[], api: any) {
  const results = [];

  for (const post of duePosts) {
    try {
      // Get draft
      const draft = await callConvexQuery(api.content.drafts.getDraftById, {
        draftId: post.draftId,
      });

      if (!draft) {
        throw new Error('Draft not found');
      }

      // Get brief
      const brief = await callConvexQuery(api.content.briefs.getBriefById, {
        briefId: post.briefId,
      });

      // Get connection
      const connection = await callConvexQuery(api.integrations.oauth.getOAuthToken, {
        clientId: post.projectId as any,
        platform: post.platform,
      });

      if (!connection) {
        throw new Error(`${post.platform} connection not found`);
      }

      // Publish to platform
      const title = brief?.titleOptions?.[0] || brief?.title || 'Untitled';
      let publishedUrl = '';

      const { publishWithRetry } = await import('@/lib/publishingRetry');

      if (post.platform === 'wordpress') {
        const wpClient = new WordPressClient({
          siteUrl: connection.siteUrl,
          username: connection.wordpressSiteId || 'admin',
          password: connection.accessToken,
        });

        const result = await publishWithRetry(
          async () => {
            const publishResult = await wpClient.createPage({
              title,
              content: draft.content,
              slug: post.slug || undefined,
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

        if (!result.success || !result.url) {
          throw new Error(result.error || 'Failed to publish after retries');
        }

        publishedUrl = result.url;
      } else if (post.platform === 'shopify') {
        const shopifyClient = new ShopifyClient({
          shopDomain: connection.shopifyShop || connection.siteUrl,
          accessToken: connection.accessToken,
        });

        const result = await publishWithRetry(
          async () => {
            const publishResult = await shopifyClient.createPage({
              title,
              body_html: draft.content,
              handle: post.slug || undefined,
              published: true,
            });
            return { url: publishResult.url };
          },
          {
            maxRetries: 3,
            initialDelayMs: 1000,
          }
        );

        if (!result.success || !result.url) {
          throw new Error(result.error || 'Failed to publish after retries');
        }

        publishedUrl = result.url;
      }

      // Update post status
      if (!publishedUrl) {
        throw new Error('Published URL not returned from platform');
      }

      await callConvexMutation(api.publishing.scheduledPosts.updateScheduledPost, {
        postId: post._id,
        status: 'published',
        publishedUrl,
      });

      // Update draft and brief
      await callConvexMutation(api.content.drafts.updateDraft, {
        draftId: post.draftId,
        status: 'published',
      });

      if (brief) {
        await callConvexMutation(api.content.briefs.updateBrief, {
          briefId: post.briefId,
          status: 'published',
        });
      }

      results.push({ postId: post._id, success: true, url: publishedUrl });
    } catch (error) {
      console.error(`Error publishing post ${post._id}:`, error);
      await callConvexMutation(api.publishing.scheduledPosts.updateScheduledPost, {
        postId: post._id,
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
      results.push({
        postId: post._id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return NextResponse.json({
    success: true,
    processed: duePosts.length,
    results,
  });
}
