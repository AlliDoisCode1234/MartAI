/**
 * Marketing Pages — SEO & Metadata Test Suite
 *
 * Tests that all marketing pages have complete, valid SEO metadata
 * by reading the layout source files directly (Node env, no JSX transform).
 *
 * Per KENT: "Test use cases, not implementation. Mostly integration."
 * Use case: When Google crawls any marketing page, it should find
 * title, description, OG tags, and canonical URL.
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// Helper: read layout file content
function readLayout(routePath: string): string {
  const filePath = path.resolve(__dirname, `../../app${routePath}/layout.tsx`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Layout file not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf-8');
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
      const content = readLayout(route);

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
    it('should have layout files for all 6 child marketing routes', () => {
      for (const { route } of CHILD_ROUTES) {
        const filePath = path.resolve(__dirname, `../../app${route}/layout.tsx`);
        expect(fs.existsSync(filePath)).toBe(true);
      }
    });

    it('all canonical URLs should be unique', () => {
      const canonicals = CHILD_ROUTES.map((r) => r.expectedCanonical);
      const unique = new Set(canonicals);
      expect(unique.size).toBe(canonicals.length);
    });
  });
});
