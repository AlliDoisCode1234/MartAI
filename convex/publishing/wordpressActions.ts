'use node';

import { v } from 'convex/values';
import { action } from '../_generated/server';
import { api } from '../_generated/api';
import { WordPressClient } from '../../lib/integrations/wordpress';
import { markdownToGutenberg, generateSlug, extractExcerpt } from '../../lib/contentMappers';

/**
 * WordPress Publishing Actions
 *
 * Complete publishing flow: fetch draft → convert to WordPress format → publish
 */

/**
 * Publish a draft to WordPress
 */
export const publishToWordPress = action({
  args: {
    draftId: v.id('drafts'),
    projectId: v.id('projects'),
    options: v.optional(
      v.object({
        status: v.optional(v.union(v.literal('draft'), v.literal('publish'), v.literal('future'))),
        categories: v.optional(v.array(v.string())),
        tags: v.optional(v.array(v.string())),
        featuredImageUrl: v.optional(v.string()),
        scheduledDate: v.optional(v.number()), // timestamp
        postType: v.optional(v.union(v.literal('post'), v.literal('page'))),
        useGutenberg: v.optional(v.boolean()),
      })
    ),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean;
    postId?: number;
    postUrl?: string;
    error?: string;
  }> => {
    try {
      // 1. Get WordPress connection
      const connection = await ctx.runQuery(api.integrations.platformConnections.getConnection, {
        projectId: args.projectId,
        platform: 'wordpress',
      });

      if (!connection) {
        return {
          success: false,
          error: 'WordPress not connected. Please connect your WordPress site first.',
        };
      }

      if (!connection.isValid) {
        return {
          success: false,
          error: 'WordPress connection is invalid. Please reconnect.',
        };
      }

      // 2. Get draft content
      const draft = await ctx.runQuery(api['content/drafts'].getDraftById, {
        draftId: args.draftId,
      });

      if (!draft) {
        return { success: false, error: 'Draft not found' };
      }

      // 3. Get brief for title and metadata
      const brief = await ctx.runQuery(api['content/briefs'].getBriefById, {
        briefId: draft.briefId,
      });

      if (!brief) {
        return { success: false, error: 'Brief not found' };
      }

      // 4. Initialize WordPress client
      const wpClient = new WordPressClient({
        siteUrl: connection.siteUrl,
        username: connection.credentials.username || '',
        password: connection.credentials.applicationPassword || '',
      });

      // 5. Convert content to WordPress format
      const useGutenberg = args.options?.useGutenberg ?? true;
      const content = useGutenberg ? markdownToGutenberg(draft.content) : draft.content; // Fallback to raw if HTML

      // 6. Publish article
      const result = await wpClient.publishArticle({
        title: brief.title,
        content,
        excerpt: extractExcerpt(draft.content),
        slug: generateSlug(brief.title),
        status: args.options?.status || 'publish',
        categories: args.options?.categories,
        tags: args.options?.tags || brief.keywords,
        featuredImageUrl: args.options?.featuredImageUrl,
        scheduledDate: args.options?.scheduledDate
          ? new Date(args.options.scheduledDate)
          : undefined,
        meta: {
          _yoast_wpseo_title: brief.title,
          _yoast_wpseo_metadesc: extractExcerpt(draft.content),
        },
        postType: args.options?.postType || 'post',
      });

      // 7. Update draft status
      await ctx.runMutation(api['content/drafts'].updateDraft, {
        draftId: args.draftId,
        status: 'published',
        publishedUrl: result.link,
      });

      return {
        success: true,
        postId: result.id,
        postUrl: result.link,
      };
    } catch (error: unknown) {
      console.error('WordPress publish failed:', error);
      const message = error instanceof Error ? error.message : 'Publish failed';
      return {
        success: false,
        error: message,
      };
    }
  },
});

/**
 * Publish directly (simpler version for quick publish)
 */
export const quickPublish = action({
  args: {
    draftId: v.id('drafts'),
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    return ctx.runAction(api.publishing.wordpressActions.publishToWordPress, {
      draftId: args.draftId,
      projectId: args.projectId,
      options: {
        status: 'publish',
        useGutenberg: true,
      },
    });
  },
});

/**
 * Save as draft on WordPress (don't publish yet)
 */
export const saveAsDraft = action({
  args: {
    draftId: v.id('drafts'),
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    return ctx.runAction(api.publishing.wordpressActions.publishToWordPress, {
      draftId: args.draftId,
      projectId: args.projectId,
      options: {
        status: 'draft',
        useGutenberg: true,
      },
    });
  },
});
