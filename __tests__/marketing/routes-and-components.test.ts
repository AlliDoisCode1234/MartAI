/**
 * Marketing Pages — Route Whitelisting & Component Data Tests
 *
 * Tests that:
 * 1. All marketing routes are properly whitelisted in PUBLIC_ROUTES and STANDALONE_ROUTES
 * 2. ComparisonTable data is complete and valid
 * 3. Marketing barrel exports are complete
 *
 * Per SAM: "What are all the edge cases? Is this tested?"
 * Per KENT: "Integration tests provide the best ROI."
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Route Whitelisting', () => {
  const layoutPath = path.resolve(__dirname, '../../src/components/Layout/index.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

  const REQUIRED_PUBLIC_ROUTES = [
    '/',
    '/pricing',
    '/how-it-works',
    '/about',
    '/features',
    '/solutions',
    '/product',
    '/resources',
  ];

  const REQUIRED_STANDALONE_ROUTES = [
    '/',
    '/pricing',
    '/how-it-works',
    '/about',
    '/features',
    '/solutions',
    '/product',
    '/resources',
  ];

  describe('PUBLIC_ROUTES', () => {
    // Extract PUBLIC_ROUTES array from source
    const publicRoutesMatch = layoutContent.match(/const PUBLIC_ROUTES = \[([\s\S]*?)\];/);
    const publicRoutesBlock = publicRoutesMatch?.[1] || '';

    it.each(REQUIRED_PUBLIC_ROUTES)('%s should be in PUBLIC_ROUTES', (route) => {
      expect(publicRoutesBlock).toContain(`'${route}'`);
    });
  });

  describe('STANDALONE_ROUTES', () => {
    const standaloneMatch = layoutContent.match(/const STANDALONE_ROUTES = \[([\s\S]*?)\];/);
    const standaloneBlock = standaloneMatch?.[1] || '';

    it.each(REQUIRED_STANDALONE_ROUTES)('%s should be in STANDALONE_ROUTES', (route) => {
      expect(standaloneBlock).toContain(`'${route}'`);
    });
  });

  describe('Route consistency', () => {
    it('every STANDALONE route should also be PUBLIC', () => {
      const publicMatch = layoutContent.match(/const PUBLIC_ROUTES = \[([\s\S]*?)\];/);
      const standaloneMatch = layoutContent.match(/const STANDALONE_ROUTES = \[([\s\S]*?)\];/);

      const publicRoutes =
        publicMatch?.[1]?.match(/'([^']+)'/g)?.map((r) => r.replace(/'/g, '')) || [];
      const standaloneRoutes =
        standaloneMatch?.[1]?.match(/'([^']+)'/g)?.map((r) => r.replace(/'/g, '')) || [];

      for (const route of standaloneRoutes) {
        // auth routes are an exception
        if (route.startsWith('/auth')) continue;
        expect(publicRoutes).toContain(route);
      }
    });
  });
});

describe('ComparisonTable Data Integrity', () => {
  const tablePath = path.resolve(__dirname, '../../src/components/marketing/ComparisonTable.tsx');
  const tableContent = fs.readFileSync(tablePath, 'utf-8');

  it('should have exactly 10 comparison rows', () => {
    // Count the objects in COMPARISON_DATA
    const rowMatches = tableContent.match(/feature: '/g);
    expect(rowMatches).toBeDefined();
    expect(rowMatches!.length).toBe(10);
  });

  it('should include Monthly Cost row', () => {
    expect(tableContent).toContain("feature: 'Monthly Cost'");
  });

  it('should include GEO row', () => {
    expect(tableContent).toContain("feature: 'GEO (AI Citations)'");
  });

  it('should show Phoo price starting from $164', () => {
    expect(tableContent).toContain('From $164/mo');
  });

  it('should show Agency cost of $2,500+', () => {
    expect(tableContent).toContain('$2,500+');
  });

  it('should use check/x values for boolean features', () => {
    // GEO should be check for Phoo but x for Agency and DIY
    expect(tableContent).toContain(
      "{ feature: 'GEO (AI Citations)', agency: 'x', diy: 'x', phoo: 'check' }"
    );
  });

  it('should have aria-labels for accessibility', () => {
    expect(tableContent).toContain('aria-label="Included"');
    expect(tableContent).toContain('aria-label="Not included"');
  });
});

describe('Marketing Barrel Exports', () => {
  const barrelPath = path.resolve(__dirname, '../../src/components/marketing/index.ts');
  const barrelContent = fs.readFileSync(barrelPath, 'utf-8');

  const REQUIRED_EXPORTS = [
    'MegaMenuHeader',
    'PremiumFooter',
    'FeatureShowcase',
    'ProductScreenshot',
    'SocialProofBar',
    'DarkGradientAISection',
    'CTASection',
    'ComparisonTable',
  ];

  it.each(REQUIRED_EXPORTS)('%s should be exported from marketing barrel', (component) => {
    expect(barrelContent).toContain(`export { ${component} }`);
  });
});

describe('Product Page Structure', () => {
  const pagePath = path.resolve(__dirname, '../../app/product/ProductPageClient.tsx');
  const pageContent = fs.readFileSync(pagePath, 'utf-8');

  it('should have component hierarchy comment', () => {
    expect(pageContent).toContain('Component Hierarchy:');
  });

  it('should render MegaMenuHeader', () => {
    expect(pageContent).toContain('<MegaMenuHeader');
  });

  it('should render PremiumFooter', () => {
    expect(pageContent).toContain('<PremiumFooter');
  });

  it('should render ComparisonTable', () => {
    expect(pageContent).toContain('<ComparisonTable');
  });

  it('should render CTASection', () => {
    expect(pageContent).toContain('<CTASection');
  });

  it('should have exactly 6 FeatureShowcase sections', () => {
    const showcaseMatches = pageContent.match(/<FeatureShowcase/g);
    expect(showcaseMatches).toBeDefined();
    expect(showcaseMatches!.length).toBe(6);
  });

  it('should have a single h1 heading', () => {
    const h1Matches = pageContent.match(/as="h1"/g);
    expect(h1Matches).toBeDefined();
    expect(h1Matches!.length).toBe(1);
  });

  it('should use IS_LAUNCHED for conditional CTAs', () => {
    expect(pageContent).toContain('IS_LAUNCHED');
  });

  it('should have descriptive alt text on product screenshots', () => {
    const altMatches = pageContent.match(/alt="[^"]+"/g);
    expect(altMatches).toBeDefined();
    // Each alt text should be descriptive (more than 10 chars)
    for (const alt of altMatches!) {
      const altText = alt.replace(/alt="/, '').replace(/"$/, '');
      expect(altText.length).toBeGreaterThan(10);
    }
  });
});

describe('Accessibility Hardening', () => {
  describe('CTASection', () => {
    const ctaPath = path.resolve(__dirname, '../../src/components/marketing/CTASection.tsx');
    const ctaContent = fs.readFileSync(ctaPath, 'utf-8');

    it('should have aria-label on section element', () => {
      expect(ctaContent).toContain('aria-label=');
    });

    it('should not use rgba below 0.7 for text on dark backgrounds', () => {
      // Check that TEXT colors use at least 0.7 opacity on dark backgrounds
      // Exclude borderColor/border values (decorative, not readable text)
      const lines = ctaContent.split('\n');
      const lowContrastTextLines = lines.filter((line) => {
        const isTextColor = line.includes('color=') && !line.toLowerCase().includes('border');
        const hasLowOpacity = /rgba\(255,\s*255,\s*255,\s*0\.[0-6]\)/.test(line);
        return isTextColor && hasLowOpacity;
      });
      expect(lowContrastTextLines).toHaveLength(0);
    });
  });

  describe('DarkGradientAISection', () => {
    const darkPath = path.resolve(
      __dirname,
      '../../src/components/marketing/DarkGradientAISection.tsx'
    );
    const darkContent = fs.readFileSync(darkPath, 'utf-8');

    it('should have aria-label on section element', () => {
      expect(darkContent).toContain('aria-label=');
    });

    it('should have aria-hidden on decorative glow orbs', () => {
      expect(darkContent).toContain('aria-hidden="true"');
    });
  });

  describe('SocialProofBar', () => {
    const spbPath = path.resolve(__dirname, '../../src/components/marketing/SocialProofBar.tsx');
    const spbContent = fs.readFileSync(spbPath, 'utf-8');

    it('should have aria-label on section element', () => {
      expect(spbContent).toContain('aria-label=');
    });

    it('should have aria-hidden on decorative icons', () => {
      expect(spbContent).toContain('aria-hidden="true"');
    });
  });

  describe('ComparisonTable', () => {
    const tablePath = path.resolve(__dirname, '../../src/components/marketing/ComparisonTable.tsx');
    const tableContent = fs.readFileSync(tablePath, 'utf-8');

    it('should have role="img" on icon wrappers', () => {
      expect(tableContent).toContain('role="img"');
    });

    it('should have aria-label on check icons', () => {
      expect(tableContent).toContain('aria-label="Included"');
    });

    it('should have aria-label on x icons', () => {
      expect(tableContent).toContain('aria-label="Not included"');
    });

    it('should use semantic table elements', () => {
      expect(tableContent).toContain('<Table');
      expect(tableContent).toContain('<Thead');
      expect(tableContent).toContain('<Tbody');
      expect(tableContent).toContain('<Tr');
      expect(tableContent).toContain('<Th');
      expect(tableContent).toContain('<Td');
    });
  });
});
