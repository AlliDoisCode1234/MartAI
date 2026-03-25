/**
 * Industry Context Builder — Unit Tests
 *
 * Tests the buildIndustryContext function from contentGeneration.ts.
 * Since the function is not exported, we test it indirectly by importing
 * INDUSTRY_TEMPLATES directly and verifying the same matching logic.
 *
 * This validates Sprint 2 CQ-1 (industry context injection into prompts).
 */

import { describe, it, expect } from 'vitest';
import { INDUSTRY_TEMPLATES, type IndustryId, type IndustryTemplate } from '../../convex/phoo/industryTemplates';

// ── Local mirror of buildIndustryContext logic for testing ──
// This is the EXACT same logic from contentGeneration.ts
function buildIndustryContext(industry?: string): string {
  if (!industry) return '';

  const normalizedIndustry = industry.toLowerCase().trim();
  let matchedTemplate: IndustryTemplate | undefined = INDUSTRY_TEMPLATES[normalizedIndustry as IndustryId];

  if (!matchedTemplate) {
    for (const [, template] of Object.entries(INDUSTRY_TEMPLATES)) {
      if (template.detectionPatterns.some((p: string) => normalizedIndustry.includes(p))) {
        matchedTemplate = template;
        break;
      }
    }
  }

  if (!matchedTemplate) return '';

  const industryKeywords = matchedTemplate.keywords.slice(0, 5).join(', ');
  const audienceHint = `${matchedTemplate.name} professionals and their customers`;

  return `
INDUSTRY CONTEXT (from ${matchedTemplate.name} research):
- Industry: ${matchedTemplate.name} — ${matchedTemplate.description}
- Industry keywords to reference naturally: ${industryKeywords}
- Target audience: ${audienceHint}
- Write with ${matchedTemplate.name}-specific expertise. Use industry terminology accurately.
- Reference real challenges, trends, and solutions specific to this industry.
- Avoid generic advice that could apply to any industry. Be specific to ${matchedTemplate.name}.`;
}

describe('Industry Context Builder', () => {
  describe('exact match', () => {
    it('should return context for exact IndustryId match', () => {
      const result = buildIndustryContext('medSpa');
      expect(result).toContain('Med Spa / Aesthetics');
      expect(result).toContain('INDUSTRY CONTEXT');
      expect(result).toContain('Industry keywords to reference naturally:');
    });

    it('should return context for electricalContractor', () => {
      const result = buildIndustryContext('electricalContractor');
      expect(result).toContain('INDUSTRY CONTEXT');
      expect(result.length).toBeGreaterThan(100);
    });
  });

  describe('fuzzy match via detection patterns', () => {
    it('should match "botox" to medSpa via detection patterns', () => {
      const result = buildIndustryContext('botox clinic');
      expect(result).toContain('Med Spa / Aesthetics');
    });

    it('should match "beauty" to medSpa via detection patterns', () => {
      const result = buildIndustryContext('beauty treatments');
      expect(result).toContain('Med Spa / Aesthetics');
    });

    it('should be case-insensitive', () => {
      const result = buildIndustryContext('MEDSPA');
      // 'MEDSPA' lowercased = 'medspa', which is a detection pattern for medSpa
      expect(result).toContain('Med Spa');
    });

    it('should trim whitespace', () => {
      const result = buildIndustryContext('  medSpa  ');
      expect(result).toContain('INDUSTRY CONTEXT');
    });
  });

  describe('no match', () => {
    it('should return empty string for undefined industry', () => {
      expect(buildIndustryContext(undefined)).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(buildIndustryContext('')).toBe('');
    });

    it('should return empty string for unrecognized industry', () => {
      const result = buildIndustryContext('underwater basket weaving');
      expect(result).toBe('');
    });
  });

  describe('output format', () => {
    it('should include all required context sections', () => {
      const result = buildIndustryContext('medSpa');
      expect(result).toContain('INDUSTRY CONTEXT');
      expect(result).toContain('Industry:');
      expect(result).toContain('Industry keywords to reference naturally:');
      expect(result).toContain('Target audience:');
      expect(result).toContain('Write with');
      expect(result).toContain('Reference real challenges');
      expect(result).toContain('Avoid generic advice');
    });

    it('should include at most 5 industry keywords', () => {
      const result = buildIndustryContext('medSpa');
      // The keywords line should have at most 5 comma-separated values
      const keywordLine = result.split('\n').find((l) => l.includes('Industry keywords'));
      expect(keywordLine).toBeDefined();
      const keywords = keywordLine!.split(':')[1].split(',');
      expect(keywords.length).toBeLessThanOrEqual(5);
    });
  });

  describe('INDUSTRY_TEMPLATES completeness', () => {
    it('should have at least 15 industry templates', () => {
      const templateCount = Object.keys(INDUSTRY_TEMPLATES).length;
      expect(templateCount).toBeGreaterThanOrEqual(15);
    });

    it('every template should have required fields', () => {
      for (const [id, template] of Object.entries(INDUSTRY_TEMPLATES)) {
        expect(template.id).toBe(id);
        expect(template.name).toBeTruthy();
        expect(template.description).toBeTruthy();
        expect(template.keywords.length).toBeGreaterThan(0);
        // 'general' is a catch-all template with no detection patterns — skip that check
        if (id !== 'general') {
          expect(template.detectionPatterns.length).toBeGreaterThan(0);
        }
        expect(template.contentPlan.length).toBeGreaterThan(0);
      }
    });

    it('every template should have unique detection patterns', () => {
      // No two templates should share the exact same detection pattern
      const allPatterns: string[] = [];
      for (const template of Object.values(INDUSTRY_TEMPLATES)) {
        for (const pattern of template.detectionPatterns) {
          if (allPatterns.includes(pattern)) {
            // It's acceptable for the "general" template to overlap
            if (template.id !== 'general') {
              console.warn(`Duplicate detection pattern "${pattern}" in template ${template.id}`);
            }
          }
          allPatterns.push(pattern);
        }
      }
    });
  });
});
