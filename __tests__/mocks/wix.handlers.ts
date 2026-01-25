/**
 * Wix Blog REST API MSW Handlers
 *
 * Mock handlers for testing Wix integration without real Wix.
 * Simulates Wix Blog v3 API endpoints.
 */

import { http, HttpResponse } from 'msw';

// ============================================================================
// Types
// ============================================================================

interface MockDraftPost {
  id: string;
  title: string;
  richContent: object;
  excerpt: string;
  slug: string;
  tags: string[];
  categoryIds: string[];
  status: 'draft' | 'published';
  url?: string;
}

interface MockCategory {
  id: string;
  label: string;
  slug: string;
}

// ============================================================================
// In-Memory Store
// ============================================================================

export const mockWixStore = {
  draftPosts: [] as MockDraftPost[],
  publishedPosts: [] as MockDraftPost[],
  categories: [{ id: 'cat-1', label: 'Uncategorized', slug: 'uncategorized' }] as MockCategory[],
  nextPostId: 1,
  nextCategoryId: 2,

  reset() {
    this.draftPosts = [];
    this.publishedPosts = [];
    this.categories = [{ id: 'cat-1', label: 'Uncategorized', slug: 'uncategorized' }];
    this.nextPostId = 1;
    this.nextCategoryId = 2;
  },
};

// ============================================================================
// Auth Validation Helper
// ============================================================================

const VALID_ACCESS_TOKEN = 'wix_test_token_123';

function validateAuth(request: Request): boolean {
  const auth = request.headers.get('Authorization');
  return auth === VALID_ACCESS_TOKEN;
}

function unauthorizedResponse() {
  return HttpResponse.json({ message: 'Unauthorized', code: 401 }, { status: 401 });
}

// ============================================================================
// Handlers
// ============================================================================

const BASE_URL = 'https://www.wixapis.com';

export const wixHandlers = [
  // ─────────────────────────────────────────────────────────────────────────
  // Categories
  // ─────────────────────────────────────────────────────────────────────────
  http.get(`${BASE_URL}/blog/v3/categories`, ({ request }) => {
    if (!validateAuth(request)) return unauthorizedResponse();

    return HttpResponse.json({ categories: mockWixStore.categories });
  }),

  http.post(`${BASE_URL}/blog/v3/categories`, async ({ request }) => {
    if (!validateAuth(request)) return unauthorizedResponse();

    const body = (await request.json()) as { category: { label: string } };
    const id = `cat-${mockWixStore.nextCategoryId++}`;
    const slug = body.category.label.toLowerCase().replace(/\s+/g, '-');

    const category: MockCategory = { id, label: body.category.label, slug };
    mockWixStore.categories.push(category);

    return HttpResponse.json({ category }, { status: 201 });
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Draft Posts
  // ─────────────────────────────────────────────────────────────────────────
  http.get(`${BASE_URL}/blog/v3/draft-posts`, ({ request }) => {
    if (!validateAuth(request)) return unauthorizedResponse();
    return HttpResponse.json({ draftPosts: mockWixStore.draftPosts });
  }),

  http.post(`${BASE_URL}/blog/v3/draft-posts`, async ({ request }) => {
    if (!validateAuth(request)) return unauthorizedResponse();

    const body = (await request.json()) as { draftPost: Record<string, unknown> };
    const id = `draft-${mockWixStore.nextPostId++}`;

    const draftPost: MockDraftPost = {
      id,
      title: String(body.draftPost.title || ''),
      richContent: (body.draftPost.richContent as object) || { nodes: [] },
      excerpt: String(body.draftPost.excerpt || ''),
      slug: String(body.draftPost.slug || id),
      tags: (body.draftPost.tags as string[]) || [],
      categoryIds: (body.draftPost.categoryIds as string[]) || [],
      status: 'draft',
    };

    mockWixStore.draftPosts.push(draftPost);
    return HttpResponse.json({ draftPost }, { status: 201 });
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Publish Draft
  // ─────────────────────────────────────────────────────────────────────────
  http.post(`${BASE_URL}/blog/v3/draft-posts/:id/publish`, ({ request, params }) => {
    if (!validateAuth(request)) return unauthorizedResponse();

    const draftId = params.id as string;
    const draftIndex = mockWixStore.draftPosts.findIndex((p) => p.id === draftId);

    if (draftIndex === -1) {
      return HttpResponse.json({ message: 'Draft not found' }, { status: 404 });
    }

    const draft = mockWixStore.draftPosts[draftIndex];
    const publishedPost: MockDraftPost = {
      ...draft,
      id: draft.id.replace('draft-', 'post-'),
      status: 'published',
      url: `https://mock-wix-site.com/blog/${draft.slug}`,
    };

    mockWixStore.draftPosts.splice(draftIndex, 1);
    mockWixStore.publishedPosts.push(publishedPost);

    return HttpResponse.json({ post: publishedPost });
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Get Published Posts
  // ─────────────────────────────────────────────────────────────────────────
  http.get(`${BASE_URL}/blog/v3/posts`, ({ request }) => {
    if (!validateAuth(request)) return unauthorizedResponse();
    return HttpResponse.json({ posts: mockWixStore.publishedPosts });
  }),
];

// Export constants for tests
export const MOCK_WIX_ACCESS_TOKEN = VALID_ACCESS_TOKEN;
