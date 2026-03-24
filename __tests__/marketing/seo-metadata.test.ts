/**
 * Marketing Pages — SEO & Metadata Test Suite
 *
 * Tests that all marketing pages have complete, valid SEO metadata
 * by reading source files directly (Node env, no JSX transform).
 *
 * NOTE: Some routes export metadata from layout.tsx (when they have sub-pages),
 * others export from page.tsx (server wrapper pattern). The helper checks both.
 *
 * Per KENT: "Test use cases, not implementation. Mostly integration."
 * Use case: When Google crawls any marketing page, it should find
 * title, description, OG tags, and canonical URL.
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// Helper: read the file that exports metadata for a route.
// Checks page.tsx first (server wrapper pattern), then layout.tsx (sub-route pattern).
function readMetadataFile(routePath: string): string {
  const pagePath = path.resolve(__dirname, `../../app${routePath}/page.tsx`);
  const layoutPath = path.resolve(__dirname, `../../app${routePath}/layout.tsx`);

  if (fs.existsSync(pagePath)) {
    const content = fs.readFileSync(pagePath, 'utf-8');
    if (content.includes('export const metadata')) return content;
  }
  if (fs.existsSync(layoutPath)) {
    const content = fs.readFileSync(layoutPath, 'utf-8');
    if (content.includes('export const metadata')) return content;
  }
  throw new Error(`No metadata export found for route: ${routePath}`);
}

// Helper: read root layout (special case — no subdirectory)
function readRootLayout(): string {
  return fs.readFileSync(path.resolve(__dirname, '../../app/layout.tsx'), 'utf-8');
}

describe('Marketing SEO Metadata', () => {
  describe('Root Layout Metadata', () => {
    const content = readRootLayout();

    it('should have metadataBase for canonical URL resolution', () => {
      expect(content).toContain('metadataBase');
      expect(content).toContain('phoo.ai');
    });

    it('should have title', () => {
      expect(content).toMatch(/title:\s*'/);
    });

    it('should have description', () => {
      expect(content).toMatch(/description:\s*\n?\s*'/);
    });

    it('should have canonical URL via alternates', () => {
      expect(content).toContain('alternates');
      expect(content).toContain('canonical');
    });

    it('should have Open Graph tags', () => {
      expect(content).toContain('openGraph');
      expect(content).toContain("siteName: 'Phoo'");
    });

    it('should have Twitter card metadata', () => {
      expect(content).toContain('twitter');
      expect(content).toContain("card: 'summary_large_image'");
    });

    it('should have robots directives allowing indexing', () => {
      expect(content).toContain('index: true');
      expect(content).toContain('follow: true');
    });
  });

  const CHILD_ROUTES = [
    { route: '/product', expectedTitle: 'product', expectedCanonical: '/product' },
    { route: '/pricing', expectedTitle: 'pricing', expectedCanonical: '/pricing' },
    { route: '/how-it-works', expectedTitle: 'how', expectedCanonical: '/how-it-works' },
    { route: '/about', expectedTitle: 'about', expectedCanonical: '/about' },
    { route: '/features', expectedTitle: 'features', expectedCanonical: '/features' },
    { route: '/solutions', expectedTitle: 'solutions', expectedCanonical: '/solutions' },
  ];

  describe.each(CHILD_ROUTES)(
    '$route page metadata',
    ({ route, expectedTitle, expectedCanonical }) => {
      const content = readMetadataFile(route);

      it(`should have title containing "${expectedTitle}"`, () => {
        expect(content.toLowerCase()).toContain(expectedTitle);
      });

      it('should have description', () => {
        expect(content).toMatch(/description:\s*\n?\s*'/);
      });

      it(`should have canonical URL "${expectedCanonical}"`, () => {
        expect(content).toContain(`canonical: '${expectedCanonical}'`);
      });

      it('should have Open Graph tags', () => {
        expect(content).toContain('openGraph');
      });
    }
  );

  describe('Completeness checks', () => {
    it('should have metadata exports for all 6 child marketing routes', () => {
      for (const { route } of CHILD_ROUTES) {
        // Metadata can be in either page.tsx or layout.tsx
        expect(() => readMetadataFile(route)).not.toThrow();
      }
    });

    it('all canonical URLs should be unique', () => {
      const canonicals = CHILD_ROUTES.map((r) => r.expectedCanonical);
      const unique = new Set(canonicals);
      expect(unique.size).toBe(canonicals.length);
    });
  });
});
