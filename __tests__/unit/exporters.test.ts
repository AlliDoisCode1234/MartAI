/**
 * Exporter Unit Tests
 *
 * Tests for WordPress XML, CSV, and Markdown exporters.
 * Following KENT's Testing Trophy: Unit tests for pure export functions.
 */

import { describe, test, expect } from 'vitest';
import {
  toWordPressXML,
  contentPieceToWXR,
  toCSV,
  contentPiecesToCSV,
  toShopifyBlogCSV,
  toShopifyPageCSV,
  toMarkdown,
  contentPieceToMarkdown,
  exportContent,
} from '../../lib/exporters';

// ============================================================================
// WordPress XML Tests
// ============================================================================

describe('toWordPressXML', () => {
  test('generates valid XML header', () => {
    const xml = toWordPressXML({ items: [] });
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"');
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('xmlns:wp="http://wordpress.org/export/1.2/"');
  });

  test('includes site metadata', () => {
    const xml = toWordPressXML({
      siteName: 'My SEO Site',
      siteUrl: 'https://mysite.com',
      items: [],
    });
    expect(xml).toContain('<title>My SEO Site</title>');
    expect(xml).toContain('<link>https://mysite.com</link>');
  });

  test('exports post items correctly', () => {
    const xml = toWordPressXML({
      items: [
        {
          title: 'Test Blog Post',
          content: '<h1>Hello</h1><p>Content here</p>',
          postType: 'post',
          slug: 'test-blog-post',
          status: 'publish',
        },
      ],
    });
    expect(xml).toContain('<title>Test Blog Post</title>');
    expect(xml).toContain('<wp:post_type>post</wp:post_type>');
    expect(xml).toContain('<wp:post_name><![CDATA[test-blog-post]]></wp:post_name>');
    expect(xml).toContain('<wp:status>publish</wp:status>');
  });

  test('exports page items correctly', () => {
    const xml = toWordPressXML({
      items: [
        {
          title: 'About Us',
          content: '<p>About our company</p>',
          postType: 'page',
        },
      ],
    });
    expect(xml).toContain('<wp:post_type>page</wp:post_type>');
  });

  test('escapes XML special characters', () => {
    const xml = toWordPressXML({
      items: [
        {
          title: 'Test & Demo <script>',
          content: 'Content with "quotes"',
          postType: 'post',
        },
      ],
    });
    expect(xml).toContain('Test &amp; Demo &lt;script&gt;');
  });

  test('includes categories and tags', () => {
    const xml = toWordPressXML({
      items: [
        {
          title: 'Tagged Post',
          content: 'Content',
          postType: 'post',
          categories: ['SEO', 'Marketing'],
          tags: ['tips', 'guide'],
        },
      ],
    });
    expect(xml).toContain('<wp:cat_name><![CDATA[SEO]]></wp:cat_name>');
    expect(xml).toContain('<wp:tag_name><![CDATA[tips]]></wp:tag_name>');
  });
});

describe('contentPieceToWXR', () => {
  test('converts blog content type to post', () => {
    const xml = contentPieceToWXR({
      title: 'Blog Post',
      content: '<p>Blog content</p>',
      contentType: 'blog',
    });
    expect(xml).toContain('<wp:post_type>post</wp:post_type>');
  });

  test('converts service content type to page', () => {
    const xml = contentPieceToWXR({
      title: 'Service Page',
      content: '<p>Service description</p>',
      contentType: 'service',
    });
    expect(xml).toContain('<wp:post_type>page</wp:post_type>');
  });
});

// ============================================================================
// CSV Tests
// ============================================================================

describe('toCSV', () => {
  test('generates CSV with header', () => {
    const csv = toCSV({
      rows: [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
      ],
    });
    expect(csv).toContain('name,age');
    expect(csv).toContain('Alice,30');
    expect(csv).toContain('Bob,25');
  });

  test('escapes commas and quotes', () => {
    const csv = toCSV({
      rows: [{ text: 'Hello, World', quote: 'She said "Hi"' }],
    });
    expect(csv).toContain('"Hello, World"');
    expect(csv).toContain('"She said ""Hi"""');
  });

  test('handles null and undefined', () => {
    const csv = toCSV({
      rows: [{ a: null, b: undefined, c: 'value' }],
    });
    expect(csv).toContain(',,value');
  });

  test('respects custom column order', () => {
    const csv = toCSV({
      rows: [{ b: 2, a: 1, c: 3 }],
      columns: ['c', 'b', 'a'],
    });
    const lines = csv.split('\n');
    expect(lines[0]).toBe('c,b,a');
    expect(lines[1]).toBe('3,2,1');
  });
});

describe('contentPiecesToCSV', () => {
  test('exports content pieces with correct columns', () => {
    const csv = contentPiecesToCSV([
      {
        title: 'Test Article',
        content: '<p>Content</p>',
        contentType: 'blog',
        slug: 'test-article',
      },
    ]);
    expect(csv).toContain('title,slug,content_type,status,excerpt,content,created_at');
    expect(csv).toContain('Test Article');
    expect(csv).toContain('blog');
  });
});

describe('toShopifyBlogCSV', () => {
  test('uses Shopify blog column names', () => {
    const csv = toShopifyBlogCSV([
      {
        title: 'Shopify Blog Post',
        content: '<p>Content</p>',
        tags: ['seo', 'tips'],
      },
    ]);
    expect(csv).toContain('Title,Handle,Body HTML,Excerpt,Author,Tags,Published,Published At');
    expect(csv).toContain('Shopify Blog Post');
    expect(csv).toContain('"seo, tips"');
  });
});

describe('toShopifyPageCSV', () => {
  test('uses Shopify page column names', () => {
    const csv = toShopifyPageCSV([
      {
        title: 'About Us',
        content: '<p>About content</p>',
        slug: 'about-us',
      },
    ]);
    expect(csv).toContain('Title,Handle,Body HTML,Published');
    expect(csv).toContain('About Us');
    expect(csv).toContain('about-us');
  });
});

// ============================================================================
// Markdown Tests
// ============================================================================

describe('toMarkdown', () => {
  test('generates YAML frontmatter by default', () => {
    const md = toMarkdown({
      title: 'Test Post',
      content: 'Hello world',
    });
    expect(md).toContain('---');
    expect(md).toContain('title: "Test Post"');
    expect(md).toContain('Hello world');
  });

  test('includes optional metadata in frontmatter', () => {
    const md = toMarkdown({
      title: 'Full Post',
      content: 'Content',
      excerpt: 'Short description',
      tags: ['seo', 'marketing'],
      contentType: 'blog',
    });
    expect(md).toContain('description: "Short description"');
    expect(md).toContain('tags:');
    expect(md).toContain('  - "seo"');
    expect(md).toContain('content_type: "blog"');
  });

  test('skips frontmatter when disabled', () => {
    const md = toMarkdown({
      title: 'Test',
      content: 'Just content',
      includeYamlFrontmatter: false,
    });
    expect(md).not.toContain('---');
    expect(md).toBe('Just content');
  });

  test('converts HTML to Markdown', () => {
    const md = toMarkdown({
      title: 'HTML Post',
      content: '<h1>Heading</h1><p>Paragraph with <strong>bold</strong> text.</p>',
      includeYamlFrontmatter: false,
    });
    expect(md).toContain('# Heading');
    expect(md).toContain('Paragraph with **bold** text.');
  });

  test('converts HTML links to Markdown', () => {
    const md = toMarkdown({
      title: 'Links',
      content: '<a href="https://example.com">Example</a>',
      includeYamlFrontmatter: false,
    });
    expect(md).toContain('[Example](https://example.com)');
  });

  test('converts HTML lists to Markdown', () => {
    const md = toMarkdown({
      title: 'Lists',
      content: '<ul><li>Item 1</li><li>Item 2</li></ul>',
      includeYamlFrontmatter: false,
    });
    expect(md).toContain('- Item 1');
    expect(md).toContain('- Item 2');
  });
});

// ============================================================================
// Unified Export Tests
// ============================================================================

describe('exportContent', () => {
  const testPiece = {
    title: 'Test Content',
    content: '<p>Test content body</p>',
    contentType: 'blog',
    slug: 'test-content',
  };

  test('exports to WordPress XML', () => {
    const result = exportContent(testPiece, 'wordpress-xml');
    expect(result.filename).toBe('test-content.xml');
    expect(result.mimeType).toBe('application/xml');
    expect(result.content).toContain('<?xml');
  });

  test('exports to CSV', () => {
    const result = exportContent(testPiece, 'csv');
    expect(result.filename).toBe('test-content.csv');
    expect(result.mimeType).toBe('text/csv');
    expect(result.content).toContain('title');
  });

  test('exports to Shopify CSV', () => {
    const result = exportContent(testPiece, 'shopify-csv');
    expect(result.mimeType).toBe('text/csv');
    expect(result.content).toContain('Title,Handle,Body HTML');
  });

  test('exports to Markdown', () => {
    const result = exportContent(testPiece, 'markdown');
    expect(result.filename).toBe('test-content.md');
    expect(result.mimeType).toBe('text/markdown');
    expect(result.content).toContain('---');
  });

  test('exports to JSON', () => {
    const result = exportContent(testPiece, 'json');
    expect(result.filename).toBe('test-content.json');
    expect(result.mimeType).toBe('application/json');
    const parsed = JSON.parse(result.content);
    expect(parsed[0].title).toBe('Test Content');
  });

  test('exports multiple pieces to CSV', () => {
    const result = exportContent([testPiece, { ...testPiece, title: 'Second' }], 'csv');
    expect(result.filename).toBe('content-export.csv');
    expect(result.content).toContain('Test Content');
    expect(result.content).toContain('Second');
  });
});
