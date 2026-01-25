/**
 * WordPress REST API MSW Handlers
 *
 * Mock handlers for testing WordPressClient without real WordPress.
 * Simulates WordPress REST API v2 endpoints with realistic responses.
 */

import { http, HttpResponse } from 'msw';

// ============================================================================
// Types
// ============================================================================

interface MockPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  status: 'publish' | 'draft' | 'private' | 'future';
  link: string;
  categories: number[];
  tags: number[];
  featured_media: number;
  date: string;
  meta: Record<string, unknown>;
}

interface MockCategory {
  id: number;
  name: string;
  slug: string;
}

interface MockTag {
  id: number;
  name: string;
  slug: string;
}

interface MockMedia {
  id: number;
  source_url: string;
  title: { rendered: string };
}

// ============================================================================
// In-Memory Store
// ============================================================================

export const mockWordPressStore = {
  posts: [] as MockPost[],
  pages: [] as MockPost[],
  categories: [{ id: 1, name: 'Uncategorized', slug: 'uncategorized' }] as MockCategory[],
  tags: [] as MockTag[],
  media: [] as MockMedia[],
  nextPostId: 1,
  nextPageId: 1,
  nextCategoryId: 2,
  nextTagId: 1,
  nextMediaId: 1,

  reset() {
    this.posts = [];
    this.pages = [];
    this.categories = [{ id: 1, name: 'Uncategorized', slug: 'uncategorized' }];
    this.tags = [];
    this.media = [];
    this.nextPostId = 1;
    this.nextPageId = 1;
    this.nextCategoryId = 2;
    this.nextTagId = 1;
    this.nextMediaId = 1;
  },
};

// ============================================================================
// Auth Validation Helper
// ============================================================================

const VALID_CREDENTIALS = {
  username: 'admin',
  password: 'test-app-password',
};

function validateAuth(request: Request): boolean {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Basic ')) return false;

  const base64 = authHeader.slice(6);
  const decoded = Buffer.from(base64, 'base64').toString();
  const [username, password] = decoded.split(':');

  return username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password;
}

function unauthorizedResponse() {
  return HttpResponse.json(
    { code: 'rest_forbidden', message: 'Authentication required', data: { status: 401 } },
    { status: 401 }
  );
}

// ============================================================================
// Handlers
// ============================================================================

const BASE_URL = 'http://mock-wordpress.local';

export const wordPressHandlers = [
  // ─────────────────────────────────────────────────────────────────────────
  // API Discovery
  // ─────────────────────────────────────────────────────────────────────────
  http.get(`${BASE_URL}/wp-json/wp/v2/`, ({ request }) => {
    if (!validateAuth(request)) return unauthorizedResponse();

    return HttpResponse.json({
      name: 'Mock WordPress Site',
      description: 'Test site for MartAI integration',
      url: BASE_URL,
      namespaces: ['wp/v2'],
    });
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Users
  // ─────────────────────────────────────────────────────────────────────────
  http.get(`${BASE_URL}/wp-json/wp/v2/users/me`, ({ request }) => {
    if (!validateAuth(request)) return unauthorizedResponse();

    return HttpResponse.json({
      id: 1,
      name: 'admin',
      slug: 'admin',
      capabilities: {
        publish_posts: true,
        publish_pages: true,
        edit_posts: true,
        edit_pages: true,
        upload_files: true,
      },
    });
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Posts
  // ─────────────────────────────────────────────────────────────────────────
  http.get(`${BASE_URL}/wp-json/wp/v2/posts`, ({ request }) => {
    if (!validateAuth(request)) return unauthorizedResponse();
    return HttpResponse.json(mockWordPressStore.posts);
  }),

  http.post(`${BASE_URL}/wp-json/wp/v2/posts`, async ({ request }) => {
    if (!validateAuth(request)) return unauthorizedResponse();

    const body = (await request.json()) as Record<string, unknown>;
    const id = mockWordPressStore.nextPostId++;

    const post: MockPost = {
      id,
      title: { rendered: String(body.title || '') },
      content: { rendered: String(body.content || '') },
      excerpt: { rendered: String(body.excerpt || '') },
      slug: String(body.slug || `post-${id}`),
      status: (body.status as MockPost['status']) || 'draft',
      link: `${BASE_URL}/${body.slug || `post-${id}`}/`,
      categories: (body.categories as number[]) || [1],
      tags: (body.tags as number[]) || [],
      featured_media: (body.featured_media as number) || 0,
      date: (body.date as string) || new Date().toISOString(),
      meta: (body.meta as Record<string, unknown>) || {},
    };

    mockWordPressStore.posts.push(post);
    return HttpResponse.json(post, { status: 201 });
  }),

  http.post(`${BASE_URL}/wp-json/wp/v2/posts/:id`, async ({ request, params }) => {
    if (!validateAuth(request)) return unauthorizedResponse();

    const postId = Number(params.id);
    const post = mockWordPressStore.posts.find((p) => p.id === postId);
    if (!post) {
      return HttpResponse.json(
        { code: 'rest_post_invalid_id', message: 'Invalid post ID' },
        { status: 404 }
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    if (body.title) post.title = { rendered: String(body.title) };
    if (body.content) post.content = { rendered: String(body.content) };
    if (body.status) post.status = body.status as MockPost['status'];

    return HttpResponse.json(post);
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Pages
  // ─────────────────────────────────────────────────────────────────────────
  http.get(`${BASE_URL}/wp-json/wp/v2/pages`, ({ request }) => {
    if (!validateAuth(request)) return unauthorizedResponse();
    return HttpResponse.json(mockWordPressStore.pages);
  }),

  http.post(`${BASE_URL}/wp-json/wp/v2/pages`, async ({ request }) => {
    if (!validateAuth(request)) return unauthorizedResponse();

    const body = (await request.json()) as Record<string, unknown>;
    const id = mockWordPressStore.nextPageId++;

    const page: MockPost = {
      id,
      title: { rendered: String(body.title || '') },
      content: { rendered: String(body.content || '') },
      excerpt: { rendered: String(body.excerpt || '') },
      slug: String(body.slug || `page-${id}`),
      status: (body.status as MockPost['status']) || 'draft',
      link: `${BASE_URL}/${body.slug || `page-${id}`}/`,
      categories: [],
      tags: [],
      featured_media: (body.featured_media as number) || 0,
      date: (body.date as string) || new Date().toISOString(),
      meta: (body.meta as Record<string, unknown>) || {},
    };

    mockWordPressStore.pages.push(page);
    return HttpResponse.json(page, { status: 201 });
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Categories
  // ─────────────────────────────────────────────────────────────────────────
  http.get(`${BASE_URL}/wp-json/wp/v2/categories`, ({ request }) => {
    if (!validateAuth(request)) return unauthorizedResponse();
    return HttpResponse.json(mockWordPressStore.categories);
  }),

  http.post(`${BASE_URL}/wp-json/wp/v2/categories`, async ({ request }) => {
    if (!validateAuth(request)) return unauthorizedResponse();

    const body = (await request.json()) as { name: string };
    const id = mockWordPressStore.nextCategoryId++;
    const slug = body.name.toLowerCase().replace(/\s+/g, '-');

    const category: MockCategory = { id, name: body.name, slug };
    mockWordPressStore.categories.push(category);

    return HttpResponse.json(category, { status: 201 });
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Tags
  // ─────────────────────────────────────────────────────────────────────────
  http.get(`${BASE_URL}/wp-json/wp/v2/tags`, ({ request }) => {
    if (!validateAuth(request)) return unauthorizedResponse();
    return HttpResponse.json(mockWordPressStore.tags);
  }),

  http.post(`${BASE_URL}/wp-json/wp/v2/tags`, async ({ request }) => {
    if (!validateAuth(request)) return unauthorizedResponse();

    const body = (await request.json()) as { name: string };
    const id = mockWordPressStore.nextTagId++;
    const slug = body.name.toLowerCase().replace(/\s+/g, '-');

    const tag: MockTag = { id, name: body.name, slug };
    mockWordPressStore.tags.push(tag);

    return HttpResponse.json(tag, { status: 201 });
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Media
  // ─────────────────────────────────────────────────────────────────────────
  http.get(`${BASE_URL}/wp-json/wp/v2/media/:id`, ({ request, params }) => {
    if (!validateAuth(request)) return unauthorizedResponse();

    const mediaId = Number(params.id);
    const media = mockWordPressStore.media.find((m) => m.id === mediaId);

    if (!media) {
      return HttpResponse.json(
        { code: 'rest_post_invalid_id', message: 'Invalid media ID' },
        { status: 404 }
      );
    }

    return HttpResponse.json(media);
  }),

  http.post(`${BASE_URL}/wp-json/wp/v2/media`, async ({ request }) => {
    if (!validateAuth(request)) return unauthorizedResponse();

    const id = mockWordPressStore.nextMediaId++;
    const contentDisposition = request.headers.get('Content-Disposition') || '';
    const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
    const filename = filenameMatch?.[1] || `upload-${id}.jpg`;

    const media: MockMedia = {
      id,
      source_url: `${BASE_URL}/wp-content/uploads/${filename}`,
      title: { rendered: filename.replace(/\.[^/.]+$/, '') },
    };

    mockWordPressStore.media.push(media);
    return HttpResponse.json(media, { status: 201 });
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Mock External Images (for uploadMedia which fetches the image first)
  // ─────────────────────────────────────────────────────────────────────────
  http.get('https://example.com/*', () => {
    // Return a minimal 1x1 transparent PNG
    const transparentPng = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44,
      0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f,
      0x15, 0xc4, 0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00,
      0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
    ]);

    return new HttpResponse(transparentPng, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': String(transparentPng.length),
      },
    });
  }),
];
// Export constants for tests
export const MOCK_WP_BASE_URL = BASE_URL;
export const MOCK_WP_CREDENTIALS = VALID_CREDENTIALS;
