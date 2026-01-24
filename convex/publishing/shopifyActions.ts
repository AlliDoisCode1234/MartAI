'use node';

import { v } from 'convex/values';
import { action } from '../_generated/server';
import { api } from '../_generated/api';
import { extractExcerpt, generateSlug } from '../../lib/contentMappers';

/**
 * Shopify Publishing Actions
 *
 * GraphQL-based publishing to Shopify blogs
 */

// GraphQL Types
interface ShopifyBlog {
  id: string;
  title: string;
  handle: string;
}

interface ShopifyArticle {
  id: string;
  title: string;
  handle: string;
  url: string;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string; field?: string[] }>;
}

/**
 * Execute GraphQL query against Shopify Admin API
 */
async function shopifyGraphQL<T>(
  shopDomain: string,
  accessToken: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<GraphQLResponse<T>> {
  const shop = shopDomain.replace(/\.myshopify\.com$/, '');

  const response = await fetch(`https://${shop}.myshopify.com/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * List available blogs for a Shopify store
 */
export const listBlogs = action({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (
    ctx,
    args
  ): Promise<{ success: boolean; blogs?: ShopifyBlog[]; error?: string }> => {
    try {
      const connection = await ctx.runQuery(api.integrations.platformConnections.getConnection, {
        projectId: args.projectId,
        platform: 'shopify',
      });

      if (!connection || !connection.credentials.accessToken) {
        return { success: false, error: 'Shopify not connected' };
      }

      const query = `
        query {
          blogs(first: 20) {
            edges {
              node {
                id
                title
                handle
              }
            }
          }
        }
      `;

      const result = await shopifyGraphQL<{ blogs: { edges: Array<{ node: ShopifyBlog }> } }>(
        connection.siteUrl,
        connection.credentials.accessToken,
        query
      );

      if (result.errors) {
        return { success: false, error: result.errors[0]?.message || 'GraphQL error' };
      }

      const blogs = result.data?.blogs.edges.map((e) => e.node) || [];
      return { success: true, blogs };
    } catch (error) {
      console.error('[Shopify] listBlogs error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
});

/**
 * Publish article to Shopify blog
 */
export const publishToShopify = action({
  args: {
    draftId: v.id('drafts'),
    projectId: v.id('projects'),
    options: v.optional(
      v.object({
        blogId: v.optional(v.string()), // Shopify blog GID, defaults to first blog
        status: v.optional(v.union(v.literal('draft'), v.literal('publish'))),
        tags: v.optional(v.array(v.string())),
        scheduledDate: v.optional(v.number()), // timestamp
      })
    ),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean;
    articleId?: string;
    articleUrl?: string;
    error?: string;
  }> => {
    try {
      // 1. Get Shopify connection
      const connection = await ctx.runQuery(api.integrations.platformConnections.getConnection, {
        projectId: args.projectId,
        platform: 'shopify',
      });

      if (!connection || !connection.credentials.accessToken) {
        return {
          success: false,
          error: 'Shopify not connected. Please connect your Shopify store first.',
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

      // 4. Get blog ID (use provided or fetch first available)
      let blogId = args.options?.blogId;
      if (!blogId) {
        const blogsResult = await ctx.runAction(api.publishing.shopifyActions.listBlogs, {
          projectId: args.projectId,
        });

        if (!blogsResult.success || !blogsResult.blogs?.length) {
          return { success: false, error: 'No blogs found in Shopify store. Create a blog first.' };
        }
        blogId = blogsResult.blogs[0].id;
      }

      // 5. Convert markdown to HTML (Shopify uses bodyHtml)
      const bodyHtml = markdownToHtml(draft.content);

      // 6. Build GraphQL mutation
      const mutation = `
        mutation articleCreate($article: ArticleInput!) {
          articleCreate(article: $article) {
            article {
              id
              title
              handle
              url
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const publishedAt = args.options?.scheduledDate
        ? new Date(args.options.scheduledDate).toISOString()
        : args.options?.status === 'draft'
          ? null
          : new Date().toISOString();

      const variables = {
        article: {
          blogId,
          title: brief.title,
          bodyHtml,
          summary: extractExcerpt(draft.content, 160),
          handle: generateSlug(brief.title),
          tags: args.options?.tags || brief.keywords || [],
          publishedAt,
        },
      };

      // 7. Execute mutation
      const result = await shopifyGraphQL<{
        articleCreate: {
          article: ShopifyArticle | null;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>(connection.siteUrl, connection.credentials.accessToken, mutation, variables);

      if (result.errors) {
        return { success: false, error: result.errors[0]?.message || 'GraphQL error' };
      }

      const userErrors = result.data?.articleCreate.userErrors;
      if (userErrors?.length) {
        return { success: false, error: userErrors[0].message };
      }

      const article = result.data?.articleCreate.article;
      if (!article) {
        return { success: false, error: 'Article not created' };
      }

      // 8. Update draft status
      await ctx.runMutation(api['content/drafts'].updateDraft, {
        draftId: args.draftId,
        status: 'published',
        publishedUrl: article.url,
      });

      return {
        success: true,
        articleId: article.id,
        articleUrl: article.url,
      };
    } catch (error: unknown) {
      console.error('[Shopify] publishToShopify error:', error);
      const message = error instanceof Error ? error.message : 'Publish failed';
      return { success: false, error: message };
    }
  },
});

/**
 * Quick publish to Shopify (immediate publish to first blog)
 */
export const quickPublish = action({
  args: {
    draftId: v.id('drafts'),
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    return ctx.runAction(api.publishing.shopifyActions.publishToShopify, {
      draftId: args.draftId,
      projectId: args.projectId,
      options: { status: 'publish' },
    });
  },
});

/**
 * Save as draft on Shopify
 */
export const saveAsDraft = action({
  args: {
    draftId: v.id('drafts'),
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    return ctx.runAction(api.publishing.shopifyActions.publishToShopify, {
      draftId: args.draftId,
      projectId: args.projectId,
      options: { status: 'draft' },
    });
  },
});

/**
 * Simple markdown to HTML converter
 * Handles basic markdown for Shopify's bodyHtml field
 */
function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>');

  // Lists
  html = html.replace(/^\s*[-*] (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/gim, '<ul>$&</ul>');

  // Paragraphs
  html = html.replace(/\n\n/gim, '</p><p>');
  html = '<p>' + html + '</p>';

  // Clean up
  html = html.replace(/<p><h/gim, '<h');
  html = html.replace(/<\/h(\d)><\/p>/gim, '</h$1>');
  html = html.replace(/<p><ul>/gim, '<ul>');
  html = html.replace(/<\/ul><\/p>/gim, '</ul>');
  html = html.replace(/<p><\/p>/gim, '');

  return html;
}
