'use node';

import { v } from 'convex/values';
import { action } from '../_generated/server';
import { internal, api } from '../_generated/api';
import { Id } from '../_generated/dataModel';

/**
 * Platform Connection Actions
 *
 * Node.js actions for testing connections to WordPress, Shopify, etc.
 */

// Platform type
const platformValidator = v.union(
  v.literal('wordpress'),
  v.literal('shopify'),
  v.literal('wix'),
  v.literal('webflow'),
  v.literal('ghost')
);

interface TestResult {
  success: boolean;
  siteName?: string;
  capabilities?: {
    canPublishPosts: boolean;
    canPublishPages: boolean;
    canUploadMedia: boolean;
  };
  error?: string;
}

/**
 * Test WordPress connection
 */
export const testWordPressConnection = action({
  args: {
    siteUrl: v.string(),
    username: v.string(),
    applicationPassword: v.string(),
  },
  handler: async (ctx, args): Promise<TestResult> => {
    const siteUrl = args.siteUrl.replace(/\/$/, '');
    const apiUrl = `${siteUrl}/wp-json/wp/v2`;

    const authHeader =
      'Basic ' + Buffer.from(`${args.username}:${args.applicationPassword}`).toString('base64');

    try {
      // Test basic connection
      const siteResponse = await fetch(`${siteUrl}/wp-json`, {
        headers: { Authorization: authHeader },
      });

      if (!siteResponse.ok) {
        return {
          success: false,
          error: `Cannot connect to WordPress site. Status: ${siteResponse.status}`,
        };
      }

      const siteData = await siteResponse.json();
      const siteName = siteData.name || 'WordPress Site';

      // Check user permissions
      const userResponse = await fetch(`${apiUrl}/users/me?context=edit`, {
        headers: { Authorization: authHeader },
      });

      if (!userResponse.ok) {
        return {
          success: false,
          error: 'Invalid username or Application Password',
        };
      }

      const userData = await userResponse.json();
      const caps = userData.capabilities || {};

      return {
        success: true,
        siteName,
        capabilities: {
          canPublishPosts: caps.publish_posts || caps.administrator || false,
          canPublishPages: caps.publish_pages || caps.administrator || false,
          canUploadMedia: caps.upload_files || caps.administrator || false,
        },
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Connection failed';
      return {
        success: false,
        error: message,
      };
    }
  },
});

/**
 * Test and save WordPress connection in one step
 */
export const connectWordPress = action({
  args: {
    projectId: v.id('projects'),
    siteUrl: v.string(),
    username: v.string(),
    applicationPassword: v.string(),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean;
    connectionId?: Id<'platformConnections'>;
    siteName?: string;
    error?: string;
  }> => {
    // Test the connection first
    const testResult = await ctx.runAction(
      internal.integrations.platformConnectionActions.testWordPressConnection,
      {
        siteUrl: args.siteUrl,
        username: args.username,
        applicationPassword: args.applicationPassword,
      }
    );

    if (!testResult.success) {
      return {
        success: false,
        error: testResult.error,
      };
    }

    // Save the connection
    const connectionId = await ctx.runMutation(
      api.integrations.platformConnections.saveConnection,
      {
        projectId: args.projectId,
        platform: 'wordpress' as const,
        siteUrl: args.siteUrl,
        siteName: testResult.siteName,
        credentials: {
          username: args.username,
          applicationPassword: args.applicationPassword,
        },
      }
    );

    // Update validation status
    await ctx.runMutation(internal.integrations.platformConnections.updateValidationStatus, {
      connectionId,
      isValid: true,
      siteName: testResult.siteName,
      capabilities: testResult.capabilities,
    });

    return {
      success: true,
      connectionId,
      siteName: testResult.siteName,
    };
  },
});

/**
 * Validate an existing WordPress connection
 */
export const validateWordPressConnection = action({
  args: {
    connectionId: v.id('platformConnections'),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean;
    siteName?: string;
    error?: string;
  }> => {
    // Get the connection
    const connection = await ctx.runQuery(api.integrations.platformConnections.getConnection, {
      projectId: args.connectionId as unknown as Id<'projects'>, // This is a workaround
      platform: 'wordpress',
    });

    if (!connection) {
      return {
        success: false,
        error: 'Connection not found',
      };
    }

    // Test it
    const testResult = await ctx.runAction(
      internal.integrations.platformConnectionActions.testWordPressConnection,
      {
        siteUrl: connection.siteUrl,
        username: connection.credentials.username || '',
        applicationPassword: connection.credentials.applicationPassword || '',
      }
    );

    // Update status
    await ctx.runMutation(internal.integrations.platformConnections.updateValidationStatus, {
      connectionId: args.connectionId,
      isValid: testResult.success,
      siteName: testResult.siteName,
      validationError: testResult.error,
      capabilities: testResult.capabilities,
    });

    return {
      success: testResult.success,
      siteName: testResult.siteName,
      error: testResult.error,
    };
  },
});
