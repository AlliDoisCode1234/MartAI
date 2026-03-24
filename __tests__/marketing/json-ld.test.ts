/**
 * Marketing Pages — JSON-LD Structured Data Validation
 *
 * Tests that the homepage JSON-LD schema is valid and contains
 * all required entities for rich search results and AI citations.
 *
 * IMPORTANT: FAQPage schema must NOT be in root layout @graph.
 * FAQ schemas belong on the specific page displaying FAQ content
 * (e.g. /pricing). Having it in root layout causes Google's
 * "Duplicate field FAQPage" error that blocks indexing.
 *
 * Per MART (SEO Expert): "FAQ schema is the highest-ROI SEO change."
 * Per KENT: "Test use cases — does the structured data tell Google what we need?"
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('JSON-LD Structured Data', () => {
  const layoutPath = path.resolve(__dirname, '../../app/layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

  describe('Schema Graph Contains Required Types', () => {
    it('should contain Organization schema', () => {
      expect(layoutContent).toContain("'@type': 'Organization'");
    });

    it('should contain WebSite schema', () => {
      expect(layoutContent).toContain("'@type': 'WebSite'");
    });

    it('should contain SoftwareApplication schema', () => {
      expect(layoutContent).toContain("'@type': 'SoftwareApplication'");
    });

    it('should NOT contain FAQPage in root layout (causes duplicate schema)', () => {
      // FAQPage was removed from root @graph in March 2026.
      // It duplicated the pricing page's FAQPage, causing Google Search Console
      // "Duplicate field FAQPage" critical indexing error.
      expect(layoutContent).not.toContain("'@type': 'FAQPage'");
    });

    it('should contain BreadcrumbList schema', () => {
      expect(layoutContent).toContain("'@type': 'BreadcrumbList'");
    });
  });

  describe('Organization Schema', () => {
    it('should have organization name', () => {
      expect(layoutContent).toContain("name: 'Phoo AI'");
    });

    it('should have organization URL', () => {
      expect(layoutContent).toContain("url: 'https://www.phoo.ai'");
    });

    it('should have founding date', () => {
      expect(layoutContent).toContain("foundingDate: '2025'");
    });

    it('should have unique @id for cross-referencing', () => {
      expect(layoutContent).toContain("'@id': 'https://www.phoo.ai/#organization'");
    });
  });

  describe('SoftwareApplication Schema', () => {
    it('should have application category', () => {
      expect(layoutContent).toContain("applicationCategory: 'BusinessApplication'");
    });

    it('should have pricing offer', () => {
      expect(layoutContent).toContain("'@type': 'Offer'");
      expect(layoutContent).toContain("price: '164'");
      expect(layoutContent).toContain("priceCurrency: 'USD'");
    });

    it('should link to Organization publisher', () => {
      expect(layoutContent).toContain("publisher: { '@id': 'https://www.phoo.ai/#organization' }");
    });
  });

  describe('FAQPage Schema (Pricing Page)', () => {
    const pricingPath = path.resolve(__dirname, '../../app/pricing/PricingPageClient.tsx');
    const pricingContent = fs.readFileSync(pricingPath, 'utf-8');

    it('should exist on pricing page, not root layout', () => {
      expect(pricingContent).toContain('faq-schema');
      expect(pricingContent).toContain('application/ld+json');
    });

    it('should use schemas.ts FAQ generator', () => {
      expect(pricingContent).toContain('getFaqSchema');
      expect(pricingContent).toContain('PRICING_FAQ_ITEMS');
    });
  });

  describe('BreadcrumbList Schema', () => {
    it('should have Home as first item', () => {
      expect(layoutContent).toContain("name: 'Home'");
    });

    it('should include Product breadcrumb', () => {
      expect(layoutContent).toContain("name: 'Product'");
      expect(layoutContent).toContain("item: 'https://www.phoo.ai/product'");
    });

    it('should include Pricing breadcrumb', () => {
      expect(layoutContent).toContain("name: 'Pricing'");
    });

    it('should have sequential position numbers', () => {
      expect(layoutContent).toContain('position: 1');
      expect(layoutContent).toContain('position: 2');
      expect(layoutContent).toContain('position: 3');
    });
  });

  describe('Script Tag Structure', () => {
    it('should use application/ld+json type', () => {
      expect(layoutContent).toContain('type="application/ld+json"');
    });

    it('should use JSON.stringify for safe serialization', () => {
      expect(layoutContent).toContain('JSON.stringify');
    });

    it('should use schema.org context', () => {
      expect(layoutContent).toContain("'@context': 'https://schema.org'");
    });
  });
});
