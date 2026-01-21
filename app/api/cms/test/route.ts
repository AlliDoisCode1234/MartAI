import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { WordPressClient } from '@/lib/integrations/wordpress';
import { ShopifyClient } from '@/lib/integrations/shopify';
import { WebflowClient } from '@/lib/integrations/webflow';
import { callConvexQuery, callConvexMutation, unsafeApi as api } from '@/lib/convexClient';

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
    const body = await request.json();
    const { platform, projectId, credentials } = body;

    if (!platform || !projectId || !credentials) {
      return NextResponse.json(
        { error: 'platform, projectId, and credentials are required' },
        { status: 400 }
      );
    }

    let testResult: { valid: boolean; siteName?: string; error?: string; canPublish?: boolean };

    try {
      switch (platform) {
        case 'wordpress': {
          const client = new WordPressClient({
            siteUrl: credentials.siteUrl,
            username: credentials.username,
            password: credentials.password,
          });

          // Test connection
          const connectionTest = await client.testConnection();
          if (!connectionTest.valid) {
            return NextResponse.json({
              valid: false,
              error: connectionTest.error,
            });
          }

          // Check publishing rights
          const rightsCheck = await client.checkPublishingRights();

          testResult = {
            valid: true,
            siteName: connectionTest.siteName,
            canPublish: rightsCheck.canPublish,
            error: rightsCheck.canPublish ? undefined : rightsCheck.error,
          };
          break;
        }

        case 'shopify': {
          const client = new ShopifyClient({
            shopDomain: credentials.shopDomain,
            accessToken: credentials.accessToken,
          });

          const connectionTest = await client.testConnection();
          if (!connectionTest.valid) {
            return NextResponse.json({
              valid: false,
              error: connectionTest.error,
            });
          }

          const rightsCheck = await client.checkPublishingRights();

          testResult = {
            valid: true,
            siteName: connectionTest.shopName,
            canPublish: rightsCheck.canPublish,
            error: rightsCheck.canPublish ? undefined : rightsCheck.error,
          };
          break;
        }

        case 'webflow': {
          const client = new WebflowClient({
            siteId: credentials.siteId,
            accessToken: credentials.accessToken,
            collectionId: credentials.collectionId,
          });

          const connectionTest = await client.testConnection();
          if (!connectionTest.valid) {
            return NextResponse.json({
              valid: false,
              error: connectionTest.error,
            });
          }

          const rightsCheck = await client.checkPublishingRights();

          testResult = {
            valid: true,
            siteName: connectionTest.siteName,
            canPublish: rightsCheck.canPublish,
            error: rightsCheck.canPublish ? undefined : rightsCheck.error,
          };
          break;
        }

        default:
          return NextResponse.json({ error: `Unsupported platform: ${platform}` }, { status: 400 });
      }

      // Store connection if valid and has publishing rights
      if (testResult.valid && testResult.canPublish && api) {
        try {
          await callConvexMutation(api.integrations.oauth.storeOAuthToken, {
            projectId: projectId as any,
            platform,
            accessToken: JSON.stringify(credentials),
            status: 'connected',
          });
        } catch (error) {
          console.warn('Failed to store connection:', error);
        }
      }

      return NextResponse.json(testResult);
    } catch (error) {
      console.error('CMS test error:', error);
      return NextResponse.json(
        {
          valid: false,
          error: error instanceof Error ? error.message : 'Test failed',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('CMS test route error:', error);
    return NextResponse.json({ error: 'Failed to test CMS connection' }, { status: 500 });
  }
}
