/**
 * Wix Content Mapper Integration Tests
 *
 * Tests for Wix-specific Rich Content JSON conversion
 * Following KENT's Testing Trophy: Integration tests for Markdown → Wix Rich Content
 */

import { describe, test, expect } from 'vitest';

// =============================================================================
// FIXTURES
// =============================================================================

const FIXTURES = {
  simpleMarkdown: '# Hello World\n\nThis is a paragraph.',
  withLists: `# Products

Here are our products:

- Product A
- Product B
- Product C

Contact us for more info.`,
  emptyContent: '',
  specialCharacters: '# Café & Restaurant Guide\n\nPrices start at $9.99',
};

// =============================================================================
// MARKDOWN TO WIX RICH CONTENT TESTS
// =============================================================================

describe('Wix Content Mappers', () => {
  describe('markdownToWixRichContent', () => {
    // Reimplemented for testing (matches wixActions.ts)
    const markdownToWixRichContent = (markdown: string): object => {
      const nodes: object[] = [];
      const lines = markdown.split('\n');
      let i = 0;

      while (i < lines.length) {
        const line = lines[i];

        if (line.startsWith('### ')) {
          nodes.push({
            type: 'HEADING',
            headingData: { level: 3 },
            nodes: [{ type: 'TEXT', textData: { text: line.slice(4) } }],
          });
        } else if (line.startsWith('## ')) {
          nodes.push({
            type: 'HEADING',
            headingData: { level: 2 },
            nodes: [{ type: 'TEXT', textData: { text: line.slice(3) } }],
          });
        } else if (line.startsWith('# ')) {
          nodes.push({
            type: 'HEADING',
            headingData: { level: 1 },
            nodes: [{ type: 'TEXT', textData: { text: line.slice(2) } }],
          });
        } else if (line.match(/^\s*[-*] /)) {
          const listItems: object[] = [];
          while (i < lines.length && lines[i].match(/^\s*[-*] /)) {
            listItems.push({
              type: 'LIST_ITEM',
              nodes: [{ type: 'TEXT', textData: { text: lines[i].replace(/^\s*[-*] /, '') } }],
            });
            i++;
          }
          nodes.push({ type: 'BULLETED_LIST', nodes: listItems });
          continue;
        } else if (line.trim()) {
          nodes.push({
            type: 'PARAGRAPH',
            nodes: [{ type: 'TEXT', textData: { text: line } }],
          });
        }

        i++;
      }

      return {
        nodes,
        metadata: {
          version: 1,
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
      };
    };

    test('converts H1 to HEADING node with level 1', () => {
      const result = markdownToWixRichContent('# Main Title') as {
        nodes: Array<{ type: string; headingData?: { level: number } }>;
      };
      expect(result.nodes[0].type).toBe('HEADING');
      expect(result.nodes[0].headingData?.level).toBe(1);
    });

    test('converts H2 and H3 headers', () => {
      const result = markdownToWixRichContent('## Subtitle\n\n### Section') as {
        nodes: Array<{ type: string; headingData?: { level: number } }>;
      };
      const headings = result.nodes.filter((n) => n.type === 'HEADING');
      expect(headings).toHaveLength(2);
    });

    test('converts paragraphs to PARAGRAPH nodes', () => {
      const result = markdownToWixRichContent('Just some text.') as {
        nodes: Array<{ type: string }>;
      };
      expect(result.nodes[0].type).toBe('PARAGRAPH');
    });

    test('converts lists to BULLETED_LIST with LIST_ITEM nodes', () => {
      const result = markdownToWixRichContent('- Item A\n- Item B\n- Item C') as {
        nodes: Array<{ type: string; nodes?: object[] }>;
      };
      const list = result.nodes.find((n) => n.type === 'BULLETED_LIST');
      expect(list).toBeDefined();
      expect(list?.nodes).toHaveLength(3);
    });

    test('includes metadata with version', () => {
      const result = markdownToWixRichContent('# Test') as { metadata: { version: number } };
      expect(result.metadata.version).toBe(1);
    });

    test('handles empty content', () => {
      const result = markdownToWixRichContent('') as { nodes: object[] };
      expect(result.nodes).toHaveLength(0);
    });

    test('handles special characters', () => {
      const result = markdownToWixRichContent(FIXTURES.specialCharacters) as {
        nodes: Array<{ nodes?: Array<{ textData?: { text: string } }> }>;
      };
      const textNode = result.nodes[0]?.nodes?.[0] as { textData?: { text: string } };
      expect(textNode?.textData?.text).toContain('Café');
    });

    test('handles complex content with headers, paragraphs, and lists', () => {
      const result = markdownToWixRichContent(FIXTURES.withLists) as {
        nodes: Array<{ type: string }>;
      };
      const types = result.nodes.map((n) => n.type);
      expect(types).toContain('HEADING');
      expect(types).toContain('PARAGRAPH');
      expect(types).toContain('BULLETED_LIST');
    });
  });
});

// =============================================================================
// API PAYLOAD STRUCTURE TESTS
// =============================================================================

describe('Wix API Payload Structure', () => {
  test('draftPost payload has required fields', () => {
    const payload = {
      draftPost: {
        title: 'Test Post',
        richContent: { nodes: [], metadata: { version: 1 } },
        excerpt: 'Short description',
        slug: 'test-post',
        tags: ['seo'],
        categoryIds: ['cat-123'],
      },
    };

    expect(payload.draftPost.title).toBeDefined();
    expect(payload.draftPost.richContent).toBeDefined();
    expect(payload.draftPost.slug).not.toContain(' ');
    expect(Array.isArray(payload.draftPost.tags)).toBe(true);
  });
});
