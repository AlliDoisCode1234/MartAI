/**
 * Shopify REST API MSW Handlers
 *
 * Mock handlers for testing ShopifyClient without real Shopify.
 * Simulates Shopify Admin REST API endpoints.
 */

import { http, HttpResponse } from 'msw';

// ============================================================================
// Types
// ============================================================================

interface MockPage {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface MockShop {
  id: number;
  name: string;
  email: string;
  domain: string;
  myshopify_domain: string;
}

// ============================================================================
// In-Memory Store
// ============================================================================

export const mockShopifyStore = {
  pages: [] as MockPage[],
  nextPageId: 1,
  shop: {
    id: 1,
    name: 'Mock Shopify Store',
    email: 'admin@mockstore.com',
    domain: 'mockstore.com',
    myshopify_domain: 'mock-store.myshopify.com',
  } as MockShop,

  reset() {
    this.pages = [];
    this.nextPageId = 1;
  },
};

// ============================================================================
// Auth Validation Helper
// ============================================================================

const VALID_ACCESS_TOKEN = 'shpat_mock_test_token_123';

function validateAuth(request: Request): boolean {
  const token = request.headers.get('X-Shopify-Access-Token');
  return token === VALID_ACCESS_TOKEN;
}

function unauthorizedResponse() {
  return HttpResponse.json({ errors: 'Invalid API token' }, { status: 401 });
}

// ============================================================================
// Handlers
// ============================================================================

const SHOP_DOMAIN = 'mock-store';
const API_VERSION = '2024-01';
const BASE_URL = `https://${SHOP_DOMAIN}.myshopify.com/admin/api/${API_VERSION}`;

export const shopifyHandlers = [
  // ─────────────────────────────────────────────────────────────────────────
  // Shop Info
  // ─────────────────────────────────────────────────────────────────────────
  http.get(`${BASE_URL}/shop.json`, ({ request }) => {
    if (!validateAuth(request)) return unauthorizedResponse();

    return HttpResponse.json({ shop: mockShopifyStore.shop });
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Pages
  // ─────────────────────────────────────────────────────────────────────────
  http.get(`${BASE_URL}/pages.json`, ({ request }) => {
    if (!validateAuth(request)) return unauthorizedResponse();
    return HttpResponse.json({ pages: mockShopifyStore.pages });
  }),

  http.post(`${BASE_URL}/pages.json`, async ({ request }) => {
    if (!validateAuth(request)) return unauthorizedResponse();

    const body = (await request.json()) as { page: Record<string, unknown> };
    const id = mockShopifyStore.nextPageId++;
    const now = new Date().toISOString();

    const page: MockPage = {
      id,
      title: String(body.page.title || ''),
      handle: String(body.page.handle || `page-${id}`),
      body_html: String(body.page.body_html || ''),
      published_at: body.page.published !== false ? now : null,
      created_at: now,
      updated_at: now,
    };

    mockShopifyStore.pages.push(page);
    return HttpResponse.json({ page }, { status: 201 });
  }),

  http.put(`${BASE_URL}/pages/:id.json`, async ({ request, params }) => {
    if (!validateAuth(request)) return unauthorizedResponse();

    const pageId = Number(params.id);
    const page = mockShopifyStore.pages.find((p) => p.id === pageId);

    if (!page) {
      return HttpResponse.json({ errors: 'Page not found' }, { status: 404 });
    }

    const body = (await request.json()) as { page: Record<string, unknown> };
    const now = new Date().toISOString();

    if (body.page.title) page.title = String(body.page.title);
    if (body.page.body_html) page.body_html = String(body.page.body_html);
    if (body.page.handle) page.handle = String(body.page.handle);
    if (body.page.published !== undefined) {
      page.published_at = body.page.published ? now : null;
    }
    page.updated_at = now;

    return HttpResponse.json({ page });
  }),

  http.get(`${BASE_URL}/pages/:id.json`, ({ request, params }) => {
    if (!validateAuth(request)) return unauthorizedResponse();

    const pageId = Number(params.id);
    const page = mockShopifyStore.pages.find((p) => p.id === pageId);

    if (!page) {
      return HttpResponse.json({ errors: 'Page not found' }, { status: 404 });
    }

    return HttpResponse.json({ page });
  }),
];

// Export constants for tests
export const MOCK_SHOPIFY_DOMAIN = SHOP_DOMAIN;
export const MOCK_SHOPIFY_ACCESS_TOKEN = VALID_ACCESS_TOKEN;
