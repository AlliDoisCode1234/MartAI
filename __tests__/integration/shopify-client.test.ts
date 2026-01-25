/**
 * Shopify Client E2E Integration Tests
 *
 * Tests ShopifyClient against MSW mock server.
 * Validates page management without real Shopify.
 *
 * Following KENT's Testing Trophy: Integration tests for HTTP client behavior.
 */

import { describe, test, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { mswServer } from '../mocks/server';
import {
  mockShopifyStore,
  MOCK_SHOPIFY_DOMAIN,
  MOCK_SHOPIFY_ACCESS_TOKEN,
} from '../mocks/shopify.handlers';
import { ShopifyClient } from '../../lib/integrations/shopify';

// ============================================================================
// Test Setup
// ============================================================================

beforeAll(() => {
  mswServer.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  mockShopifyStore.reset();
  mswServer.resetHandlers();
});

afterAll(() => {
  mswServer.close();
});

// ============================================================================
// Helper: Create authenticated client
// ============================================================================

function createClient(): ShopifyClient {
  return new ShopifyClient({
    shopDomain: MOCK_SHOPIFY_DOMAIN,
    accessToken: MOCK_SHOPIFY_ACCESS_TOKEN,
  });
}

function createBadAuthClient(): ShopifyClient {
  return new ShopifyClient({
    shopDomain: MOCK_SHOPIFY_DOMAIN,
    accessToken: 'invalid_token',
  });
}

// ============================================================================
// Connection Tests
// ============================================================================

describe('ShopifyClient: Connection', () => {
  test('testConnection returns valid:true with correct token', async () => {
    const client = createClient();
    const result = await client.testConnection();

    expect(result.valid).toBe(true);
    expect(result.shopName).toBe('Mock Shopify Store');
    expect(result.error).toBeUndefined();
  });

  test('testConnection returns valid:false with wrong token', async () => {
    const client = createBadAuthClient();
    const result = await client.testConnection();

    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('checkPublishingRights returns canPublish:true for valid token', async () => {
    const client = createClient();
    const result = await client.checkPublishingRights();

    expect(result.canPublish).toBe(true);
    expect(result.error).toBeUndefined();
  });

  test('checkPublishingRights returns canPublish:false with wrong token', async () => {
    const client = createBadAuthClient();
    const result = await client.checkPublishingRights();

    expect(result.canPublish).toBe(false);
    expect(result.error).toBeDefined();
  });
});

// ============================================================================
// Page CRUD Tests
// ============================================================================

describe('ShopifyClient: Pages', () => {
  test('createPage creates a page and returns id + url', async () => {
    const client = createClient();
    const result = await client.createPage({
      title: 'About Us',
      body_html: '<h1>About Our Company</h1><p>We are awesome.</p>',
      handle: 'about-us',
      published: true,
    });

    expect(result.id).toBe(1);
    expect(result.handle).toBe('about-us');
    expect(result.url).toContain('about-us');
    expect(mockShopifyStore.pages).toHaveLength(1);
    expect(mockShopifyStore.pages[0].title).toBe('About Us');
  });

  test('createPage defaults to published', async () => {
    const client = createClient();
    await client.createPage({
      title: 'Published Page',
      body_html: '<p>Content</p>',
    });

    expect(mockShopifyStore.pages[0].published_at).not.toBeNull();
  });

  test('createPage with published:false creates draft', async () => {
    const client = createClient();
    await client.createPage({
      title: 'Draft Page',
      body_html: '<p>Draft content</p>',
      published: false,
    });

    expect(mockShopifyStore.pages[0].published_at).toBeNull();
  });

  test('getPages returns all pages', async () => {
    const client = createClient();
    await client.createPage({ title: 'Page 1', body_html: '<p>A</p>' });
    await client.createPage({ title: 'Page 2', body_html: '<p>B</p>' });

    const pages = await client.getPages();
    expect(pages).toHaveLength(2);
  });

  test('updatePage modifies existing page', async () => {
    const client = createClient();
    const created = await client.createPage({
      title: 'Original Title',
      body_html: '<p>Original</p>',
    });

    const updated = await client.updatePage(created.id, {
      title: 'Updated Title',
    });

    expect(updated.id).toBe(created.id);
    expect(mockShopifyStore.pages[0].title).toBe('Updated Title');
  });
});

// ============================================================================
// Content Type Publishing Tests - All 17 Types (Page-based)
// ============================================================================

/**
 * Shopify only supports pages (not posts), so we test all page-type content types
 */
const PAGE_CONTENT_TYPES = [
  { id: 'homepage', title: 'Welcome to Our Store' },
  { id: 'about', title: 'About Us' },
  { id: 'service', title: 'Our Services' },
  { id: 'leadMagnet', title: 'Free Guide Download' },
  { id: 'paidProduct', title: 'Premium Course' },
  { id: 'landing', title: 'Special Offer' },
  { id: 'areasWeServe', title: 'Serving Kansas City' },
  { id: 'employment', title: 'Career Opportunities' },
  { id: 'mentorship', title: 'Mentorship Program' },
  { id: 'donate', title: 'Support Our Cause' },
  { id: 'events', title: 'Upcoming Events' },
  { id: 'partner', title: 'Partner With Us' },
  { id: 'program', title: 'Our Programs' },
];

describe('ShopifyClient: Content Types as Pages', () => {
  test.each(PAGE_CONTENT_TYPES)(
    'publishes $id content type as page successfully',
    async ({ id, title }) => {
      const client = createClient();
      const handle = id.toLowerCase().replace(/([A-Z])/g, '-$1');

      const result = await client.createPage({
        title,
        body_html: `<h1>${title}</h1><p>Content for ${id} page.</p>`,
        handle,
        published: true,
      });

      expect(result.id).toBeGreaterThan(0);
      expect(result.url).toContain(handle);
      expect(mockShopifyStore.pages.length).toBeGreaterThan(0);
    }
  );

  test('all 13 page-based content types can be created in sequence', async () => {
    const client = createClient();

    for (const { id, title } of PAGE_CONTENT_TYPES) {
      await client.createPage({
        title,
        body_html: `<h1>${title}</h1><p>Content</p>`,
        handle: id,
      });
    }

    expect(mockShopifyStore.pages).toHaveLength(13);
  });
});

// ============================================================================
// Error Handling Tests
// ============================================================================

describe('ShopifyClient: Error Handling', () => {
  test('request with invalid token throws 401', async () => {
    const client = createBadAuthClient();

    await expect(client.createPage({ title: 'Test', body_html: '<p>Test</p>' })).rejects.toThrow(
      /401|Invalid|error/i
    );
  });

  test('updatePage with non-existent ID throws 404', async () => {
    const client = createClient();

    await expect(client.updatePage(9999, { title: 'Updated' })).rejects.toThrow(
      /404|not found|error/i
    );
  });
});
