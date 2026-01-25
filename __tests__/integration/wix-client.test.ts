/**
 * Wix Blog Client E2E Integration Tests
 *
 * Tests WixBlogClient against MSW mock server.
 * Validates the complete blog publishing flow without real Wix.
 *
 * Following KENT's Testing Trophy: Integration tests for HTTP client behavior.
 */

import { describe, test, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { mswServer } from '../mocks/server';
import { mockWixStore, MOCK_WIX_ACCESS_TOKEN } from '../mocks/wix.handlers';
import { WixBlogClient, markdownToWixRichContent } from '../../lib/integrations/wix';

// ============================================================================
// Test Setup
// ============================================================================

beforeAll(() => {
  mswServer.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  mockWixStore.reset();
  mswServer.resetHandlers();
});

afterAll(() => {
  mswServer.close();
});

// ============================================================================
// Helper: Create authenticated client
// ============================================================================

function createClient(): WixBlogClient {
  return new WixBlogClient({
    accessToken: MOCK_WIX_ACCESS_TOKEN,
  });
}

function createBadAuthClient(): WixBlogClient {
  return new WixBlogClient({
    accessToken: 'invalid_token',
  });
}

// ============================================================================
// Category Tests
// ============================================================================

describe('WixBlogClient: Categories', () => {
  test('getCategories returns default Uncategorized category', async () => {
    const client = createClient();
    const categories = await client.getCategories();

    expect(categories).toHaveLength(1);
    expect(categories[0].label).toBe('Uncategorized');
  });

  test('createCategory creates and returns new category', async () => {
    const client = createClient();
    const category = await client.createCategory('SEO Tips');

    expect(category.id).toBe('cat-2');
    expect(category.label).toBe('SEO Tips');
    expect(category.slug).toBe('seo-tips');
  });
});

// ============================================================================
// Draft Post Tests
// ============================================================================

describe('WixBlogClient: Draft Posts', () => {
  test('createDraftPost creates draft and returns id', async () => {
    const client = createClient();
    const richContent = markdownToWixRichContent('# Test Post\n\nThis is content.');

    const draft = await client.createDraftPost({
      title: 'Test Blog Post',
      richContent,
      excerpt: 'A test post',
      slug: 'test-blog-post',
      tags: ['seo', 'tips'],
    });

    expect(draft.id).toBe('draft-1');
    expect(mockWixStore.draftPosts).toHaveLength(1);
    expect(mockWixStore.draftPosts[0].title).toBe('Test Blog Post');
  });

  test('getDraftPosts returns all drafts', async () => {
    const client = createClient();
    const richContent = { nodes: [] };

    await client.createDraftPost({ title: 'Draft 1', richContent });
    await client.createDraftPost({ title: 'Draft 2', richContent });

    const drafts = await client.getDraftPosts();
    expect(drafts).toHaveLength(2);
  });
});

// ============================================================================
// Publishing Tests
// ============================================================================

describe('WixBlogClient: Publishing', () => {
  test('publishDraft moves draft to published and returns post with URL', async () => {
    const client = createClient();
    const richContent = markdownToWixRichContent('# Published Post\n\nContent here.');

    const draft = await client.createDraftPost({
      title: 'To Be Published',
      richContent,
      slug: 'to-be-published',
    });

    const published = await client.publishDraft(draft.id);

    expect(published.id).toBe('post-1');
    expect(published.url).toContain('to-be-published');
    expect(published.status).toBe('published');

    // Draft should be removed
    expect(mockWixStore.draftPosts).toHaveLength(0);
    expect(mockWixStore.publishedPosts).toHaveLength(1);
  });

  test('getPublishedPosts returns all published posts', async () => {
    const client = createClient();
    const richContent = { nodes: [] };

    const draft1 = await client.createDraftPost({ title: 'Post 1', richContent, slug: 'post-1' });
    const draft2 = await client.createDraftPost({ title: 'Post 2', richContent, slug: 'post-2' });

    await client.publishDraft(draft1.id);
    await client.publishDraft(draft2.id);

    const posts = await client.getPublishedPosts();
    expect(posts).toHaveLength(2);
  });
});

// ============================================================================
// Full Publishing Flow Tests
// ============================================================================

describe('WixBlogClient: publishArticle Flow', () => {
  test('publishArticle creates and publishes in one call', async () => {
    const client = createClient();
    const richContent = markdownToWixRichContent('# Full Flow Test\n\nContent.');

    const result = await client.publishArticle({
      title: 'Full Flow Post',
      richContent,
      excerpt: 'Testing the full flow',
      slug: 'full-flow-post',
      tags: ['test'],
      status: 'publish',
    });

    expect(result.id).toBe('post-1');
    expect(result.url).toContain('full-flow-post');
    expect(mockWixStore.publishedPosts).toHaveLength(1);
  });

  test('publishArticle with status=draft keeps as draft', async () => {
    const client = createClient();
    const richContent = { nodes: [] };

    const result = await client.publishArticle({
      title: 'Draft Only',
      richContent,
      status: 'draft',
    });

    expect(result.id).toBe('draft-1');
    expect(result.url).toBeUndefined();
    expect(mockWixStore.draftPosts).toHaveLength(1);
    expect(mockWixStore.publishedPosts).toHaveLength(0);
  });
});

// ============================================================================
// Content Type Publishing Tests - All 4 Blog Types
// ============================================================================

/**
 * Wix Blog only supports posts, so we test the 4 post-type content types
 */
const BLOG_CONTENT_TYPES = [
  { id: 'blog', title: 'Top 10 SEO Tips for 2026' },
  { id: 'blogVersus', title: 'Botox vs Dysport: Complete Comparison' },
  { id: 'contentRefresh', title: 'Updated: Best Practices Guide' },
  { id: 'blogVideo', title: 'How to Optimize Your Site [Video Guide]' },
];

describe('WixBlogClient: Content Types as Blog Posts', () => {
  test.each(BLOG_CONTENT_TYPES)(
    'publishes $id content type as blog post successfully',
    async ({ id, title }) => {
      const client = createClient();
      const richContent = markdownToWixRichContent(`# ${title}\n\nContent for ${id}.`);

      const result = await client.publishArticle({
        title,
        richContent,
        slug: id,
        tags: [id, 'seo'],
        status: 'publish',
      });

      expect(result.id).toContain('post-');
      expect(result.url).toContain(id);
    }
  );

  test('all 4 blog content types can be published in sequence', async () => {
    const client = createClient();

    for (const { id, title } of BLOG_CONTENT_TYPES) {
      const richContent = markdownToWixRichContent(`# ${title}\n\nContent.`);
      await client.publishArticle({
        title,
        richContent,
        slug: id,
        status: 'publish',
      });
    }

    expect(mockWixStore.publishedPosts).toHaveLength(4);
  });
});

// ============================================================================
// Error Handling Tests
// ============================================================================

describe('WixBlogClient: Error Handling', () => {
  test('request with invalid token throws 401', async () => {
    const client = createBadAuthClient();

    await expect(client.getCategories()).rejects.toThrow(/401|Unauthorized|error/i);
  });

  test('publishDraft with non-existent ID throws 404', async () => {
    const client = createClient();

    await expect(client.publishDraft('non-existent-id')).rejects.toThrow(/404|not found|error/i);
  });
});

// ============================================================================
// Rich Content Conversion Tests
// ============================================================================

describe('markdownToWixRichContent', () => {
  test('converts headers correctly', () => {
    const result = markdownToWixRichContent('# H1\n## H2\n### H3') as {
      nodes: Array<{ type: string; headingData?: { level: number } }>;
    };

    expect(result.nodes).toHaveLength(3);
    expect(result.nodes[0].headingData?.level).toBe(1);
    expect(result.nodes[1].headingData?.level).toBe(2);
    expect(result.nodes[2].headingData?.level).toBe(3);
  });

  test('converts paragraphs correctly', () => {
    const result = markdownToWixRichContent('Just text.') as {
      nodes: Array<{ type: string }>;
    };

    expect(result.nodes[0].type).toBe('PARAGRAPH');
  });

  test('converts lists correctly', () => {
    const result = markdownToWixRichContent('- Item 1\n- Item 2') as {
      nodes: Array<{ type: string; nodes?: object[] }>;
    };

    expect(result.nodes[0].type).toBe('BULLETED_LIST');
    expect(result.nodes[0].nodes).toHaveLength(2);
  });

  test('includes metadata with version', () => {
    const result = markdownToWixRichContent('Test') as { metadata: { version: number } };
    expect(result.metadata.version).toBe(1);
  });
});
