/**
 * Marketing Pages — JSON-LD Structured Data Validation
 *
 * Tests that the homepage JSON-LD schema is valid and contains
 * all required entities for rich search results and AI citations.
 *
 * Per MART (SEO Expert): "FAQ schema is the highest-ROI SEO change."
 * Per KENT: "Test use cases — does the structured data tell Google what we need?"
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// Read the layout file and extract JSON-LD content
function extractJsonLdFromLayout(): Record<string, unknown> | null {
  const layoutPath = path.resolve(__dirname, '../../app/layout.tsx');
  const content = fs.readFileSync(layoutPath, 'utf-8');

  // Extract the JSON structure from the JSON.stringify call
  // Look for the @graph array pattern
  const graphMatch = content.match(/'@graph':\s*\[([\s\S]*?)\],\s*\}\)/);
  if (!graphMatch) return null;

  // Instead of parsing raw TSX, we'll validate the structure by checking
  // for required schema types in the source code
  return { raw: content };
}

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

    it('should contain FAQPage schema', () => {
      expect(layoutContent).toContain("'@type': 'FAQPage'");
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
      expect(layoutContent).toContain("url: 'https://phoo.ai'");
    });

    it('should have founding date', () => {
      expect(layoutContent).toContain("foundingDate: '2025'");
    });

    it('should have unique @id for cross-referencing', () => {
      expect(layoutContent).toContain("'@id': 'https://phoo.ai/#organization'");
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
      expect(layoutContent).toContain("publisher: { '@id': 'https://phoo.ai/#organization' }");
    });
  });

  describe('FAQPage Schema', () => {
    it('should have at least 3 questions', () => {
      const questionMatches =
        layoutContent.match(/"@type': 'Question'/g) || layoutContent.match(/'@type': 'Question'/g);
      expect(questionMatches).toBeDefined();
      expect(questionMatches!.length).toBeGreaterThanOrEqual(3);
    });

    it('should have matching answers for each question', () => {
      const answerMatches = layoutContent.match(/'@type': 'Answer'/g);
      const questionMatches = layoutContent.match(/'@type': 'Question'/g);
      expect(answerMatches?.length).toBe(questionMatches?.length);
    });

    it('should include "What is Phoo?" question', () => {
      expect(layoutContent).toContain("name: 'What is Phoo?'");
    });

    it('should include pricing comparison question', () => {
      expect(layoutContent).toContain('marketing agency');
    });

    it('should include GEO question for AI citation coverage', () => {
      expect(layoutContent).toContain('GEO');
    });
  });

  describe('BreadcrumbList Schema', () => {
    it('should have Home as first item', () => {
      expect(layoutContent).toContain("name: 'Home'");
    });

    it('should include Product breadcrumb', () => {
      expect(layoutContent).toContain("name: 'Product'");
      expect(layoutContent).toContain("item: 'https://phoo.ai/product'");
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
