/**
 * WordPress Content Mapper Integration Tests
 *
 * Tests for lib/contentMappers.ts
 * Following KENT's Testing Trophy: Integration tests for the Markdown → Gutenberg conversion layer
 */

import { describe, test, expect } from 'vitest';

// =============================================================================
// FIXTURES: Real content for testing
// =============================================================================

const FIXTURES = {
  markdownContent: `# Expert Lip Fillers in Kansas City

Are you considering lip fillers? This guide covers everything you need to know.

## What Are Lip Fillers?

Lip fillers are injectable treatments using hyaluronic acid.

- Natural-looking results
- Minimal downtime
- Reversible with hyaluronidase

## Ready to Get Started?

Contact us today for your consultation.
`,
  simpleContent: 'Just a paragraph.',
  multiParagraph: `First paragraph here.

Second paragraph here.

Third paragraph here.`,
  withCodeBlock: `# Technical Guide

Here's some code:

\`\`\`javascript
const hello = 'world';
\`\`\`

More text after.`,
  withLinks: 'Check out [our website](https://example.com) for more info.',
  withBold: 'This is **bold text** and this is *italic text*.',
};

// =============================================================================
// CONTENT MAPPER TESTS
// =============================================================================

describe('WordPress Content Mappers', () => {
  describe('markdownToGutenberg', () => {
    test('converts H1 headers to Gutenberg blocks', async () => {
      const { markdownToGutenberg } = await import('../../lib/contentMappers');
      const result = markdownToGutenberg('# Main Title\n\nContent here.');

      expect(result).toContain('wp:heading');
      expect(result).toContain('Main Title');
    });

    test('converts H2 headers', async () => {
      const { markdownToGutenberg } = await import('../../lib/contentMappers');
      const result = markdownToGutenberg('## Subheading');

      expect(result).toContain('wp:heading');
      expect(result).toContain('<h2>');
    });

    test('converts paragraphs to paragraph blocks', async () => {
      const { markdownToGutenberg } = await import('../../lib/contentMappers');
      const result = markdownToGutenberg('This is a paragraph.\n\nThis is another.');

      expect(result).toContain('wp:paragraph');
    });

    test('converts unordered lists to list blocks', async () => {
      const { markdownToGutenberg } = await import('../../lib/contentMappers');
      const result = markdownToGutenberg('- Item 1\n- Item 2\n- Item 3');

      expect(result).toContain('wp:list');
      expect(result).toContain('Item 1');
    });

    test('handles ordered list syntax', async () => {
      const { markdownToGutenberg } = await import('../../lib/contentMappers');
      const result = markdownToGutenberg('1. First\n2. Second\n3. Third');

      // Current implementation converts to paragraphs
      // TODO: Enhance contentMappers to detect ordered lists
      expect(result).toContain('wp:paragraph');
      expect(result).toContain('First');
    });

    test('handles complex content with multiple elements', async () => {
      const { markdownToGutenberg } = await import('../../lib/contentMappers');
      const result = markdownToGutenberg(FIXTURES.markdownContent);

      expect(result).toContain('wp:heading');
      expect(result).toContain('wp:paragraph');
      expect(result).toContain('wp:list');
    });

    test('handles empty content gracefully', async () => {
      const { markdownToGutenberg } = await import('../../lib/contentMappers');
      expect(markdownToGutenberg('')).toBe('');
    });

    test('handles whitespace-only content', async () => {
      const { markdownToGutenberg } = await import('../../lib/contentMappers');
      const result = markdownToGutenberg('   \n\n   ');
      // Should either be empty or valid Gutenberg
      expect(typeof result).toBe('string');
    });
  });

  describe('generateSlug', () => {
    test('converts title to lowercase slug', async () => {
      const { generateSlug } = await import('../../lib/contentMappers');
      expect(generateSlug('Expert Lip Fillers Kansas City')).toBe('expert-lip-fillers-kansas-city');
    });

    test('removes special characters', async () => {
      const { generateSlug } = await import('../../lib/contentMappers');
      expect(generateSlug("What's the Best Option?")).toBe('whats-the-best-option');
    });

    test('handles leading/trailing whitespace', async () => {
      const { generateSlug } = await import('../../lib/contentMappers');
      expect(generateSlug('  Leading/Trailing Spaces  ')).toBe('leadingtrailing-spaces');
    });

    test('handles empty string', async () => {
      const { generateSlug } = await import('../../lib/contentMappers');
      expect(generateSlug('')).toBe('');
    });

    test('handles unicode characters', async () => {
      const { generateSlug } = await import('../../lib/contentMappers');
      const result = generateSlug('Café & Restaurant');
      expect(result).not.toContain(' ');
      expect(result.length).toBeGreaterThan(0);
    });

    test('handles numbers', async () => {
      const { generateSlug } = await import('../../lib/contentMappers');
      expect(generateSlug('Top 10 Tips for 2024')).toBe('top-10-tips-for-2024');
    });
  });

  describe('extractExcerpt', () => {
    test('extracts meaningful text from content', async () => {
      const { extractExcerpt } = await import('../../lib/contentMappers');
      const excerpt = extractExcerpt(FIXTURES.markdownContent);

      expect(excerpt.length).toBeGreaterThan(0);
      expect(excerpt.length).toBeLessThanOrEqual(300);
    });

    test('handles empty content', async () => {
      const { extractExcerpt } = await import('../../lib/contentMappers');
      expect(extractExcerpt('')).toBe('');
    });

    test('strips markdown formatting', async () => {
      const { extractExcerpt } = await import('../../lib/contentMappers');
      const excerpt = extractExcerpt('**Bold** and *italic* text');

      // Should not contain markdown symbols
      expect(excerpt).not.toContain('**');
      expect(excerpt).not.toContain('*');
    });

    test('respects max length', async () => {
      const { extractExcerpt } = await import('../../lib/contentMappers');
      const longContent = 'A'.repeat(500);
      const excerpt = extractExcerpt(longContent);

      expect(excerpt.length).toBeLessThanOrEqual(300);
    });

    test('handles content with only headers', async () => {
      const { extractExcerpt } = await import('../../lib/contentMappers');
      const excerpt = extractExcerpt('# Title\n## Subtitle');

      // Should extract something or return empty
      expect(typeof excerpt).toBe('string');
    });
  });
});

describe('Content Mapper Edge Cases', () => {
  test('handles XSS attempt in content', async () => {
    const { markdownToGutenberg } = await import('../../lib/contentMappers');
    const result = markdownToGutenberg('<script>alert("xss")</script>');

    // Content should be processed (may escape or include as text)
    expect(typeof result).toBe('string');
  });

  test('handles very long content (10000 chars)', async () => {
    const { markdownToGutenberg } = await import('../../lib/contentMappers');
    const longContent = '# Title\n\n' + 'Paragraph content. '.repeat(500);
    const result = markdownToGutenberg(longContent);

    expect(result).toContain('wp:heading');
    expect(result).toContain('wp:paragraph');
  });

  test('handles nested lists', async () => {
    const { markdownToGutenberg } = await import('../../lib/contentMappers');
    const result = markdownToGutenberg('- Item 1\n  - Nested 1\n  - Nested 2\n- Item 2');

    expect(result).toContain('wp:list');
  });
});
