'use node';

import { v } from 'convex/values';
import { action } from '../_generated/server';
import { api } from '../_generated/api';
import { extractExcerpt, generateSlug } from '../../lib/contentMappers';

/**
 * Wix Publishing Actions
 *
 * REST API-based publishing to Wix blogs
 * Reference: https://dev.wix.com/docs/rest/api-reference/wix-blog/draft-posts
 */

/**
 * Helper to make Wix API requests with token refresh
 */
async function wixFetch(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(`https://www.wixapis.com${endpoint}`, {
    ...options,
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

/**
 * List available blog categories
 */
export const listCategories = action({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean;
    categories?: Array<{ id: string; label: string }>;
    error?: string;
  }> => {
    try {
      const connection = await ctx.runQuery(api.integrations.platformConnections.getConnection, {
        projectId: args.projectId,
        platform: 'wix',
      });

      if (!connection || !connection.credentials.accessToken) {
        return { success: false, error: 'Wix not connected' };
      }

      const response = await wixFetch('/blog/v3/categories', connection.credentials.accessToken);

      if (!response.ok) {
        return { success: false, error: `API error: ${response.status}` };
      }

      const data = await response.json();
      const categories =
        data.categories?.map((c: { id: string; label: string }) => ({
          id: c.id,
          label: c.label,
        })) || [];

      return { success: true, categories };
    } catch (error) {
      console.error('[Wix] listCategories error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
});

/**
 * Publish article to Wix blog
 */
export const publishToWix = action({
  args: {
    draftId: v.id('drafts'),
    projectId: v.id('projects'),
    options: v.optional(
      v.object({
        categoryId: v.optional(v.string()),
        status: v.optional(v.union(v.literal('draft'), v.literal('publish'))),
        tags: v.optional(v.array(v.string())),
        scheduledDate: v.optional(v.number()),
      })
    ),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean;
    postId?: string;
    postUrl?: string;
    error?: string;
  }> => {
    try {
      // 1. Get Wix connection
      const connection = await ctx.runQuery(api.integrations.platformConnections.getConnection, {
        projectId: args.projectId,
        platform: 'wix',
      });

      if (!connection || !connection.credentials.accessToken) {
        return { success: false, error: 'Wix not connected. Please connect your Wix site first.' };
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

      // 4. Convert markdown to rich content (Wix uses a specific format)
      const richContent = markdownToWixRichContent(draft.content);

      // 5. Create draft post first
      const createResponse = await wixFetch(
        '/blog/v3/draft-posts',
        connection.credentials.accessToken,
        {
          method: 'POST',
          body: JSON.stringify({
            draftPost: {
              title: brief.title,
              richContent,
              excerpt: extractExcerpt(draft.content, 160),
              slug: generateSlug(brief.title),
              tags: args.options?.tags || brief.keywords || [],
              categoryIds: args.options?.categoryId ? [args.options.categoryId] : [],
            },
          }),
        }
      );

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error('[Wix] Create draft failed:', errorText);
        return { success: false, error: `Failed to create draft: ${createResponse.status}` };
      }

      const createData = await createResponse.json();
      const draftPostId = createData.draftPost?.id;

      if (!draftPostId) {
        return { success: false, error: 'No draft post ID returned' };
      }

      // 6. If status is publish, publish the draft
      if (args.options?.status === 'publish') {
        const publishResponse = await wixFetch(
          `/blog/v3/draft-posts/${draftPostId}/publish`,
          connection.credentials.accessToken,
          { method: 'POST' }
        );

        if (!publishResponse.ok) {
          return { success: false, error: 'Draft created but publish failed' };
        }

        const publishData = await publishResponse.json();
        const post = publishData.post;

        // 7. Update draft status in Convex
        await ctx.runMutation(api['content/drafts'].updateDraft, {
          draftId: args.draftId,
          status: 'published',
          publishedUrl: post?.url || '',
        });

        return {
          success: true,
          postId: post?.id,
          postUrl: post?.url,
        };
      }

      // Draft only - don't publish
      return {
        success: true,
        postId: draftPostId,
      };
    } catch (error: unknown) {
      console.error('[Wix] publishToWix error:', error);
      const message = error instanceof Error ? error.message : 'Publish failed';
      return { success: false, error: message };
    }
  },
});

/**
 * Quick publish to Wix (immediate publish)
 */
export const quickPublish = action({
  args: {
    draftId: v.id('drafts'),
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    return ctx.runAction(api.publishing.wixActions.publishToWix, {
      draftId: args.draftId,
      projectId: args.projectId,
      options: { status: 'publish' },
    });
  },
});

/**
 * Save as draft on Wix
 */
export const saveAsDraft = action({
  args: {
    draftId: v.id('drafts'),
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    return ctx.runAction(api.publishing.wixActions.publishToWix, {
      draftId: args.draftId,
      projectId: args.projectId,
      options: { status: 'draft' },
    });
  },
});

/**
 * Convert markdown to Wix Rich Content format
 * Wix uses a specific JSON structure for rich content
 */
function markdownToWixRichContent(markdown: string): object {
  const nodes: object[] = [];
  const lines = markdown.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Headers
    if (line.startsWith('### ')) {
      nodes.push({
        type: 'HEADING',
        headingData: { level: 3 },
        nodes: [{ type: 'TEXT', textData: { text: line.slice(4) } }],
      });
    } else if (line.startsWith('## ')) {
      nodes.push({
        type: 'HEADING',
        headingData: { level: 2 },
        nodes: [{ type: 'TEXT', textData: { text: line.slice(3) } }],
      });
    } else if (line.startsWith('# ')) {
      nodes.push({
        type: 'HEADING',
        headingData: { level: 1 },
        nodes: [{ type: 'TEXT', textData: { text: line.slice(2) } }],
      });
    }
    // List items
    else if (line.match(/^\s*[-*] /)) {
      const listItems: object[] = [];
      while (i < lines.length && lines[i].match(/^\s*[-*] /)) {
        listItems.push({
          type: 'LIST_ITEM',
          nodes: [{ type: 'TEXT', textData: { text: lines[i].replace(/^\s*[-*] /, '') } }],
        });
        i++;
      }
      nodes.push({
        type: 'BULLETED_LIST',
        nodes: listItems,
      });
      continue;
    }
    // Paragraphs
    else if (line.trim()) {
      nodes.push({
        type: 'PARAGRAPH',
        nodes: [{ type: 'TEXT', textData: { text: line } }],
      });
    }

    i++;
  }

  return {
    nodes,
    metadata: {
      version: 1,
      createdTimestamp: Date.now(),
      updatedTimestamp: Date.now(),
    },
  };
}
