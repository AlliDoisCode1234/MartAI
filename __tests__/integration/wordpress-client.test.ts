/**
 * WordPress Client E2E Integration Tests
 *
 * Tests WordPressClient against MSW mock server.
 * Validates the complete publishing flow without real WordPress.
 *
 * Following KENT's Testing Trophy: Integration tests for HTTP client behavior.
 */

import { describe, test, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { mswServer } from '../mocks/server';
import {
  mockWordPressStore,
  MOCK_WP_BASE_URL,
  MOCK_WP_CREDENTIALS,
} from '../mocks/wordpress.handlers';
import { WordPressClient } from '../../lib/integrations/wordpress';

// ============================================================================
// Test Setup
// ============================================================================

beforeAll(() => {
  mswServer.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  mockWordPressStore.reset();
  mswServer.resetHandlers();
});

afterAll(() => {
  mswServer.close();
});

// ============================================================================
// Helper: Create authenticated client
// ============================================================================

function createClient(): WordPressClient {
  return new WordPressClient({
    siteUrl: MOCK_WP_BASE_URL,
    username: MOCK_WP_CREDENTIALS.username,
    password: MOCK_WP_CREDENTIALS.password,
  });
}

function createBadAuthClient(): WordPressClient {
  return new WordPressClient({
    siteUrl: MOCK_WP_BASE_URL,
    username: 'wrong',
    password: 'credentials',
  });
}

// ============================================================================
// Connection Tests
// ============================================================================

describe('WordPressClient: Connection', () => {
  test('testConnection returns valid:true with correct credentials', async () => {
    const client = createClient();
    const result = await client.testConnection();

    expect(result.valid).toBe(true);
    expect(result.siteName).toBe('Mock WordPress Site');
    expect(result.error).toBeUndefined();
  });

  test('testConnection returns valid:false with wrong credentials', async () => {
    const client = createBadAuthClient();
    const result = await client.testConnection();

    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('checkPublishingRights returns canPublish:true for admin', async () => {
    const client = createClient();
    const result = await client.checkPublishingRights();

    expect(result.canPublish).toBe(true);
    expect(result.error).toBeUndefined();
  });

  test('checkPublishingRights returns canPublish:false with wrong credentials', async () => {
    const client = createBadAuthClient();
    const result = await client.checkPublishingRights();

    expect(result.canPublish).toBe(false);
    expect(result.error).toBeDefined();
  });
});

// ============================================================================
// Post CRUD Tests
// ============================================================================

describe('WordPressClient: Posts', () => {
  test('createPost creates a post and returns id + link', async () => {
    const client = createClient();
    const result = await client.createPost({
      title: 'Test Post',
      content: '<!-- wp:paragraph --><p>Hello World</p><!-- /wp:paragraph -->',
      status: 'publish',
      slug: 'test-post',
    });

    expect(result.id).toBe(1);
    expect(result.link).toContain('test-post');
    expect(mockWordPressStore.posts).toHaveLength(1);
    expect(mockWordPressStore.posts[0].title.rendered).toBe('Test Post');
  });

  test('createPost defaults to draft status', async () => {
    const client = createClient();
    await client.createPost({
      title: 'Draft Post',
      content: 'Content',
    });

    expect(mockWordPressStore.posts[0].status).toBe('draft');
  });

  test('getPosts returns all posts', async () => {
    const client = createClient();
    await client.createPost({ title: 'Post 1', content: 'A' });
    await client.createPost({ title: 'Post 2', content: 'B' });

    const posts = await client.getPosts();
    expect(posts).toHaveLength(2);
  });

  test('updatePost modifies existing post', async () => {
    const client = createClient();
    const created = await client.createPost({ title: 'Original', content: 'Original content' });

    const updated = await client.updatePost(created.id, { title: 'Updated' });

    expect(updated.id).toBe(created.id);
    expect(mockWordPressStore.posts[0].title.rendered).toBe('Updated');
  });
});

// ============================================================================
// Page Tests
// ============================================================================

describe('WordPressClient: Pages', () => {
  test('createPage creates a page and returns id + link', async () => {
    const client = createClient();
    const result = await client.createPage({
      title: 'Services',
      content: '<!-- wp:paragraph --><p>Our services</p><!-- /wp:paragraph -->',
      status: 'publish',
      slug: 'services',
    });

    expect(result.id).toBe(1);
    expect(result.link).toContain('services');
    expect(mockWordPressStore.pages).toHaveLength(1);
  });

  test('getPages returns all pages', async () => {
    const client = createClient();
    await client.createPage({ title: 'Page 1', content: 'A' });
    await client.createPage({ title: 'Page 2', content: 'B' });

    const pages = await client.getPages();
    expect(pages).toHaveLength(2);
  });
});

// ============================================================================
// Category Tests
// ============================================================================

describe('WordPressClient: Categories', () => {
  test('getCategories returns default Uncategorized category', async () => {
    const client = createClient();
    const categories = await client.getCategories();

    expect(categories).toHaveLength(1);
    expect(categories[0].name).toBe('Uncategorized');
  });

  test('createCategory creates and returns new category', async () => {
    const client = createClient();
    const category = await client.createCategory('SEO');

    expect(category.id).toBe(2);
    expect(category.name).toBe('SEO');
    expect(category.slug).toBe('seo');
  });

  test('getOrCreateCategory returns existing category', async () => {
    const client = createClient();
    await client.createCategory('Marketing');

    const id = await client.getOrCreateCategory('Marketing');
    expect(id).toBe(2);
    expect(mockWordPressStore.categories).toHaveLength(2); // No duplicate created
  });

  test('getOrCreateCategory creates new if not exists', async () => {
    const client = createClient();
    const id = await client.getOrCreateCategory('New Category');

    expect(id).toBe(2);
    expect(mockWordPressStore.categories).toHaveLength(2);
  });
});

// ============================================================================
// Tag Tests
// ============================================================================

describe('WordPressClient: Tags', () => {
  test('getTags returns empty array initially', async () => {
    const client = createClient();
    const tags = await client.getTags();
    expect(tags).toHaveLength(0);
  });

  test('createTag creates and returns new tag', async () => {
    const client = createClient();
    const tag = await client.createTag('lip filler');

    expect(tag.id).toBe(1);
    expect(tag.name).toBe('lip filler');
    expect(tag.slug).toBe('lip-filler');
  });

  test('getOrCreateTags creates multiple tags', async () => {
    const client = createClient();
    const ids = await client.getOrCreateTags(['seo', 'marketing', 'content']);

    expect(ids).toEqual([1, 2, 3]);
    expect(mockWordPressStore.tags).toHaveLength(3);
  });
});

// ============================================================================
// Media Tests
// ============================================================================

describe('WordPressClient: Media', () => {
  test('uploadMedia uploads and returns media object', async () => {
    const client = createClient();

    // Note: This tests the mock, not actual file upload
    // Real integration would require a valid image URL
    const result = await client.uploadMedia('https://example.com/image.jpg', 'featured-image.jpg');

    expect(result.id).toBe(1);
    expect(result.url).toContain('featured-image.jpg');
  });

  test('getMedia returns uploaded media', async () => {
    const client = createClient();
    const uploaded = await client.uploadMedia('https://example.com/img.jpg', 'test.jpg');

    const media = await client.getMedia(uploaded.id);

    expect(media.id).toBe(uploaded.id);
    expect(media.source_url).toBe(uploaded.url);
  });
});

// ============================================================================
// Full Publishing Flow Tests
// ============================================================================

describe('WordPressClient: publishArticle Flow', () => {
  test('publishArticle creates post with categories and tags', async () => {
    const client = createClient();
    const result = await client.publishArticle({
      title: 'Expert Lip Fillers in Kansas City',
      content: '<!-- wp:paragraph --><p>Complete guide to lip fillers.</p><!-- /wp:paragraph -->',
      excerpt: 'Complete guide to lip fillers.',
      slug: 'lip-fillers-kansas-city',
      status: 'publish',
      categories: ['Medical Spa', 'Injectables'],
      tags: ['lip filler', 'cosmetic', 'kansas city'],
    });

    expect(result.id).toBe(1);
    expect(result.link).toContain('lip-fillers-kansas-city');

    // Verify categories were created
    expect(mockWordPressStore.categories).toHaveLength(3); // Uncategorized + 2 new

    // Verify tags were created
    expect(mockWordPressStore.tags).toHaveLength(3);

    // Verify post has correct associations
    const post = mockWordPressStore.posts[0];
    expect(post.categories).toHaveLength(2);
    expect(post.tags).toHaveLength(3);
  });

  test('publishArticle as page works correctly', async () => {
    const client = createClient();
    const result = await client.publishArticle({
      title: 'About Our Services',
      content: '<!-- wp:paragraph --><p>We offer...</p><!-- /wp:paragraph -->',
      status: 'publish',
      postType: 'page',
    });

    expect(result.id).toBe(1);
    expect(mockWordPressStore.pages).toHaveLength(1);
    expect(mockWordPressStore.posts).toHaveLength(0);
  });

  test('publishArticle with scheduled date sets future status', async () => {
    const client = createClient();
    const futureDate = new Date('2026-02-01T10:00:00Z');

    const result = await client.publishArticle({
      title: 'Scheduled Post',
      content: 'Will publish later',
      status: 'future',
      scheduledDate: futureDate,
    });

    expect(result.id).toBeDefined();
    const post = mockWordPressStore.posts[0];
    expect(post.status).toBe('future');
    expect(post.date).toBe(futureDate.toISOString());
  });

  test('publishArticle with SEO meta fields', async () => {
    const client = createClient();
    await client.publishArticle({
      title: 'SEO Optimized Article',
      content: 'Great content here',
      meta: {
        _yoast_wpseo_title: 'Custom SEO Title | Brand',
        _yoast_wpseo_metadesc: 'Custom meta description for SEO',
      },
    });

    const post = mockWordPressStore.posts[0];
    expect(post.meta._yoast_wpseo_title).toBe('Custom SEO Title | Brand');
    expect(post.meta._yoast_wpseo_metadesc).toBe('Custom meta description for SEO');
  });
});

// ============================================================================
// Error Handling Tests
// ============================================================================

describe('WordPressClient: Error Handling', () => {
  test('request with invalid credentials throws 401', async () => {
    const client = createBadAuthClient();

    await expect(client.createPost({ title: 'Test', content: 'Test' })).rejects.toThrow(
      /401|Authentication|forbidden/i
    );
  });

  test('updatePost with non-existent ID throws 404', async () => {
    const client = createClient();

    await expect(client.updatePost(9999, { title: 'Updated' })).rejects.toThrow(
      /404|Invalid post ID/i
    );
  });

  test('getMedia with non-existent ID throws 404', async () => {
    const client = createClient();

    await expect(client.getMedia(9999)).rejects.toThrow(/404|Invalid media ID/i);
  });
});

// ============================================================================
// Content Type Publishing Tests - All 17 Types
// ============================================================================

/**
 * Test fixture: All 17 content types from convex/phoo/contentTypes.ts
 * Each test verifies the content type successfully publishes to WordPress
 */
const CONTENT_TYPE_FIXTURES = [
  {
    id: 'homepage',
    name: 'Homepage Optimization',
    postType: 'page' as const,
    title: 'Welcome to Acme Corp',
    content:
      '<!-- wp:paragraph --><p>Your trusted partner for solutions.</p><!-- /wp:paragraph -->',
    wordCount: 500,
  },
  {
    id: 'about',
    name: 'About Page',
    postType: 'page' as const,
    title: 'About Us - Our Story',
    content: '<!-- wp:paragraph --><p>Founded in 2010, we have grown...</p><!-- /wp:paragraph -->',
    wordCount: 600,
  },
  {
    id: 'service',
    name: 'Service Page',
    postType: 'page' as const,
    title: 'Lip Filler Treatments',
    content:
      '<!-- wp:paragraph --><p>Our lip filler services enhance your natural beauty.</p><!-- /wp:paragraph -->',
    wordCount: 1000,
  },
  {
    id: 'blog',
    name: 'Blog Post',
    postType: 'post' as const,
    title: 'Top 10 SEO Tips for 2026',
    content: '<!-- wp:paragraph --><p>SEO continues to evolve...</p><!-- /wp:paragraph -->',
    wordCount: 1200,
  },
  {
    id: 'blogVersus',
    name: 'Versus Blog',
    postType: 'post' as const,
    title: 'Botox vs Dysport: Which Is Right for You?',
    content: '<!-- wp:paragraph --><p>Both treatments are effective...</p><!-- /wp:paragraph -->',
    wordCount: 1200,
  },
  {
    id: 'leadMagnet',
    name: 'Lead Magnet Page',
    postType: 'page' as const,
    title: 'Free SEO Checklist Download',
    content:
      '<!-- wp:paragraph --><p>Get our free guide to ranking higher.</p><!-- /wp:paragraph -->',
    wordCount: 500,
  },
  {
    id: 'paidProduct',
    name: 'Paid Product Page',
    postType: 'page' as const,
    title: 'SEO Mastery Course',
    content: '<!-- wp:paragraph --><p>Master SEO in 30 days.</p><!-- /wp:paragraph -->',
    wordCount: 800,
  },
  {
    id: 'landing',
    name: 'Landing Page',
    postType: 'page' as const,
    title: 'Lip Fillers Near Me - Kansas City',
    content:
      '<!-- wp:paragraph --><p>Top-rated lip filler provider in KC.</p><!-- /wp:paragraph -->',
    wordCount: 600,
  },
  {
    id: 'areasWeServe',
    name: 'Areas We Serve',
    postType: 'page' as const,
    title: 'Serving Overland Park, KS',
    content:
      '<!-- wp:paragraph --><p>We proudly serve the Overland Park area.</p><!-- /wp:paragraph -->',
    wordCount: 400,
  },
  {
    id: 'employment',
    name: 'Employment Page',
    postType: 'page' as const,
    title: 'Join Our Team - Careers at Acme',
    content:
      '<!-- wp:paragraph --><p>We are hiring talented individuals.</p><!-- /wp:paragraph -->',
    wordCount: 800,
  },
  {
    id: 'mentorship',
    name: 'Mentorship Page',
    postType: 'page' as const,
    title: 'Mentorship Program',
    content: '<!-- wp:paragraph --><p>Learn from industry leaders.</p><!-- /wp:paragraph -->',
    wordCount: 600,
  },
  {
    id: 'donate',
    name: 'Donate Page',
    postType: 'page' as const,
    title: 'Support Our Mission',
    content: '<!-- wp:paragraph --><p>Your donation makes a difference.</p><!-- /wp:paragraph -->',
    wordCount: 400,
  },
  {
    id: 'events',
    name: 'Events Page',
    postType: 'page' as const,
    title: 'Upcoming Events',
    content: '<!-- wp:paragraph --><p>Join us for these exciting events.</p><!-- /wp:paragraph -->',
    wordCount: 500,
  },
  {
    id: 'partner',
    name: 'Partner Page',
    postType: 'page' as const,
    title: 'Partner With Us',
    content: '<!-- wp:paragraph --><p>Explore partnership opportunities.</p><!-- /wp:paragraph -->',
    wordCount: 600,
  },
  {
    id: 'program',
    name: 'Program Page',
    postType: 'page' as const,
    title: 'Our Training Program',
    content: '<!-- wp:paragraph --><p>Comprehensive training curriculum.</p><!-- /wp:paragraph -->',
    wordCount: 800,
  },
  {
    id: 'contentRefresh',
    name: 'Content Improvement',
    postType: 'post' as const,
    title: 'Updated: Best Practices Guide',
    content:
      '<!-- wp:paragraph --><p>Refreshed content with latest info.</p><!-- /wp:paragraph -->',
    wordCount: 750,
  },
  {
    id: 'blogVideo',
    name: 'Blog + YouTube',
    postType: 'post' as const,
    title: 'How to Do Lip Fillers [Video Guide]',
    content:
      '<!-- wp:paragraph --><p>Watch our video and read the full guide.</p><!-- /wp:paragraph -->',
    wordCount: 1200,
  },
];

describe('WordPressClient: All 17 Content Types', () => {
  test.each(CONTENT_TYPE_FIXTURES)(
    'publishes $name ($id) as $postType successfully',
    async ({ id, postType, title, content }) => {
      const client = createClient();
      const slug = id.toLowerCase().replace(/([A-Z])/g, '-$1');

      const result = await client.publishArticle({
        title,
        content,
        slug,
        status: 'publish',
        postType,
        categories: [id],
        tags: [id, 'seo'],
        meta: {
          _content_type: id,
          _yoast_wpseo_title: `${title} | Brand`,
          _yoast_wpseo_metadesc: `Learn about ${title.toLowerCase()}`,
        },
      });

      // Verify successful publish
      expect(result.id).toBeGreaterThan(0);
      expect(result.link).toContain(slug);

      // Verify stored in correct location
      if (postType === 'page') {
        expect(mockWordPressStore.pages.length).toBeGreaterThan(0);
      } else {
        expect(mockWordPressStore.posts.length).toBeGreaterThan(0);
      }
    }
  );

  test('all 17 content types can be published in sequence', async () => {
    const client = createClient();
    const results: { id: string; postId: number; link: string }[] = [];

    for (const fixture of CONTENT_TYPE_FIXTURES) {
      const result = await client.publishArticle({
        title: fixture.title,
        content: fixture.content,
        slug: fixture.id,
        status: 'publish',
        postType: fixture.postType,
      });

      results.push({ id: fixture.id, postId: result.id, link: result.link });
    }

    // Verify all 17 were published
    expect(results).toHaveLength(17);
    // 4 posts: blog, blogVersus, contentRefresh, blogVideo
    expect(mockWordPressStore.posts).toHaveLength(4);
    // 13 pages: all the rest
    expect(mockWordPressStore.pages).toHaveLength(13);
  });
});
