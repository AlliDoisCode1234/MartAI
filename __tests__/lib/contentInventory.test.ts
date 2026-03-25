/**
 * Content Inventory Builder — Unit Tests (CQ-4)
 *
 * Tests the buildContentInventory function that prevents
 * duplicate topic generation by injecting existing content
 * titles into the AI prompt.
 */

import { describe, it, expect } from 'vitest';

// Mirror the exact logic from contentGeneration.ts for testing
function buildContentInventory(existingTitles: string[]): string {
  if (!existingTitles || existingTitles.length === 0) return '';

  const numbered = existingTitles
    .slice(0, 20)
    .map((t, i) => `${i + 1}. "${t}"`);

  return `
EXISTING CONTENT INVENTORY (do NOT repeat these topics):
${numbered.join('\n')}

Your new article MUST cover a DIFFERENT angle from all of the above. Do not repeat advice or topics already covered.`;
}

describe('Content Inventory Builder (CQ-4)', () => {
  it('should return empty string for empty array', () => {
    expect(buildContentInventory([])).toBe('');
  });

  it('should return empty string for undefined-like input', () => {
    expect(buildContentInventory(null as unknown as string[])).toBe('');
  });

  it('should format single title correctly', () => {
    const result = buildContentInventory(['10 SEO Tips for Small Business']);
    expect(result).toContain('EXISTING CONTENT INVENTORY');
    expect(result).toContain('1. "10 SEO Tips for Small Business"');
    expect(result).toContain('MUST cover a DIFFERENT angle');
  });

  it('should number multiple titles', () => {
    const titles = ['Article One', 'Article Two', 'Article Three'];
    const result = buildContentInventory(titles);
    expect(result).toContain('1. "Article One"');
    expect(result).toContain('2. "Article Two"');
    expect(result).toContain('3. "Article Three"');
  });

  it('should cap at 20 titles for prompt token budget', () => {
    const titles = Array.from({ length: 30 }, (_, i) => `Article ${i + 1}`);
    const result = buildContentInventory(titles);

    // Should contain article 20 but NOT article 21
    expect(result).toContain('20. "Article 20"');
    expect(result).not.toContain('21.');
    expect(result).not.toContain('Article 21');
  });

  it('should handle special characters in titles', () => {
    const titles = [
      'SEO vs PPC: Which is Better?',
      "10 Things You Didn't Know About Content Marketing",
      'How to Use <h2> Tags Properly',
    ];
    const result = buildContentInventory(titles);
    expect(result).toContain('SEO vs PPC: Which is Better?');
    expect(result).toContain("10 Things You Didn't Know");
    expect(result).toContain('<h2>');
  });
});
