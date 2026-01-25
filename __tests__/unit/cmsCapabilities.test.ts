/**
 * CMS Capabilities Unit Tests
 *
 * Tests for CMS capability helpers in integrations.ts.
 */

import { describe, test, expect } from 'vitest';
import {
  CMS_CAPABILITIES,
  canAutoPublish,
  getRecommendedExportFormat,
  getExportFormats,
  getPlatformLimitation,
  hasConnectedPlatform,
  PAGE_CONTENT_TYPES,
  POST_CONTENT_TYPES,
  ALL_CONTENT_TYPES,
} from '../../lib/constants/integrations';

// ============================================================================
// Content Type Arrays
// ============================================================================

describe('Content Type Arrays', () => {
  test('PAGE_CONTENT_TYPES has 13 types', () => {
    expect(PAGE_CONTENT_TYPES).toHaveLength(13);
    expect(PAGE_CONTENT_TYPES).toContain('homepage');
    expect(PAGE_CONTENT_TYPES).toContain('service');
    expect(PAGE_CONTENT_TYPES).toContain('about');
  });

  test('POST_CONTENT_TYPES has 4 types', () => {
    expect(POST_CONTENT_TYPES).toHaveLength(4);
    expect(POST_CONTENT_TYPES).toContain('blog');
    expect(POST_CONTENT_TYPES).toContain('blogVersus');
    expect(POST_CONTENT_TYPES).toContain('blogVideo');
    expect(POST_CONTENT_TYPES).toContain('contentRefresh');
  });

  test('ALL_CONTENT_TYPES has 17 types', () => {
    expect(ALL_CONTENT_TYPES).toHaveLength(17);
  });
});

// ============================================================================
// CMS Capabilities Object
// ============================================================================

describe('CMS_CAPABILITIES', () => {
  test('WordPress supports all content types', () => {
    const wp = CMS_CAPABILITIES.wordpress;
    expect(wp.supports).toBe('all');
    expect(wp.publishableTypes).toHaveLength(17);
    expect(wp.unsupportedTypes).toHaveLength(0);
    expect(wp.limitation).toBeNull();
  });

  test('Shopify supports pages only', () => {
    const shopify = CMS_CAPABILITIES.shopify;
    expect(shopify.supports).toBe('pages');
    expect(shopify.publishableTypes).toHaveLength(13);
    expect(shopify.unsupportedTypes).toHaveLength(4);
    expect(shopify.limitation).toContain('Blog posts');
  });

  test('Wix supports blog only', () => {
    const wix = CMS_CAPABILITIES.wix;
    expect(wix.supports).toBe('blog');
    expect(wix.publishableTypes).toHaveLength(4);
    expect(wix.unsupportedTypes).toHaveLength(13);
    expect(wix.limitation).toContain('Pages');
  });

  test('Webflow supports CMS collections', () => {
    const webflow = CMS_CAPABILITIES.webflow;
    expect(webflow.supports).toBe('cms');
    expect(webflow.publishableTypes).toHaveLength(4);
  });

  test('all platforms have export formats', () => {
    expect(CMS_CAPABILITIES.wordpress.exportFormats.length).toBeGreaterThan(0);
    expect(CMS_CAPABILITIES.shopify.exportFormats.length).toBeGreaterThan(0);
    expect(CMS_CAPABILITIES.wix.exportFormats.length).toBeGreaterThan(0);
    expect(CMS_CAPABILITIES.webflow.exportFormats.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// canAutoPublish Helper
// ============================================================================

describe('canAutoPublish', () => {
  test('WordPress can publish all types', () => {
    expect(canAutoPublish('wordpress', 'blog')).toBe(true);
    expect(canAutoPublish('wordpress', 'service')).toBe(true);
    expect(canAutoPublish('wordpress', 'homepage')).toBe(true);
  });

  test('Shopify can publish pages but not blogs', () => {
    expect(canAutoPublish('shopify', 'homepage')).toBe(true);
    expect(canAutoPublish('shopify', 'service')).toBe(true);
    expect(canAutoPublish('shopify', 'about')).toBe(true);
    expect(canAutoPublish('shopify', 'blog')).toBe(false);
    expect(canAutoPublish('shopify', 'blogVersus')).toBe(false);
  });

  test('Wix can publish blogs but not pages', () => {
    expect(canAutoPublish('wix', 'blog')).toBe(true);
    expect(canAutoPublish('wix', 'blogVersus')).toBe(true);
    expect(canAutoPublish('wix', 'contentRefresh')).toBe(true);
    expect(canAutoPublish('wix', 'homepage')).toBe(false);
    expect(canAutoPublish('wix', 'service')).toBe(false);
  });
});

// ============================================================================
// getRecommendedExportFormat Helper
// ============================================================================

describe('getRecommendedExportFormat', () => {
  test('returns wordpress-xml for Wix unsupported types', () => {
    expect(getRecommendedExportFormat('wix', 'homepage')).toBe('wordpress-xml');
  });

  test('returns wordpress-xml for Shopify unsupported types', () => {
    expect(getRecommendedExportFormat('shopify', 'blog')).toBe('wordpress-xml');
  });

  test('returns first format for supported types', () => {
    expect(getRecommendedExportFormat('wordpress', 'blog')).toBe('wordpress-xml');
    expect(getRecommendedExportFormat('shopify', 'homepage')).toBe('shopify-csv');
  });
});

// ============================================================================
// getExportFormats Helper
// ============================================================================

describe('getExportFormats', () => {
  test('returns all formats for WordPress', () => {
    const formats = getExportFormats('wordpress');
    expect(formats).toContain('wordpress-xml');
    expect(formats).toContain('csv');
    expect(formats).toContain('markdown');
    expect(formats).toContain('json');
  });

  test('returns appropriate formats for Shopify', () => {
    const formats = getExportFormats('shopify');
    expect(formats).toContain('shopify-csv');
    expect(formats).toContain('wordpress-xml');
  });

  test('returns wordpress-xml for Wix', () => {
    const formats = getExportFormats('wix');
    expect(formats).toContain('wordpress-xml');
  });
});

// ============================================================================
// getPlatformLimitation Helper
// ============================================================================

describe('getPlatformLimitation', () => {
  test('returns null for WordPress', () => {
    expect(getPlatformLimitation('wordpress')).toBeNull();
  });

  test('returns limitation string for Shopify', () => {
    const limitation = getPlatformLimitation('shopify');
    expect(limitation).toBeTruthy();
    expect(limitation).toContain('Blog');
  });

  test('returns limitation string for Wix', () => {
    const limitation = getPlatformLimitation('wix');
    expect(limitation).toBeTruthy();
    expect(limitation).toContain('Pages');
  });
});

// ============================================================================
// hasConnectedPlatform Helper
// ============================================================================

describe('hasConnectedPlatform', () => {
  test('returns true when platform is in array', () => {
    expect(hasConnectedPlatform(['wordpress', 'shopify'], 'wordpress')).toBe(true);
    expect(hasConnectedPlatform(['wordpress', 'shopify'], 'shopify')).toBe(true);
  });

  test('returns false when platform is not in array', () => {
    expect(hasConnectedPlatform(['wordpress'], 'shopify')).toBe(false);
  });

  test('returns false for undefined array', () => {
    expect(hasConnectedPlatform(undefined, 'wordpress')).toBe(false);
  });

  test('returns false for empty array', () => {
    expect(hasConnectedPlatform([], 'wordpress')).toBe(false);
  });
});
