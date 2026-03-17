/**
 * Content Creation — End-to-End Pipeline Tests
 *
 * Tests the deterministic components of the content creation pipeline:
 *
 *   CONTENT_TYPES registry → getTargetWords → outline → draft prompt → score
 *
 * Covers all 17 content types with:
 * 1. CONTENT_TYPES registry validation (templates, placeholders, word counts)
 * 2. getTargetWords() / getTargetSections() mapping
 * 3. getDefaultOutline() fallback outlines
 * 4. generateFallbackContent() content generation
 * 5. scoreContent() quality scoring (5-metric weighted average)
 * 6. Readability scoring (Flesch Reading Ease)
 * 7. Cross-type consistency checks
 *
 * NOTE: AI calls are NOT tested — we test everything deterministic up to
 * and after the AI call boundary.
 */

import { describe, test, expect } from 'vitest';
import {
  CONTENT_TYPES,
  DEFAULT_SEO_CHECKLIST,
  type ContentTypeId,
  QUALITY_THRESHOLD,
  MAX_GENERATION_ATTEMPTS,
  countWords,
  getTargetSections,
  getTargetWords,
  getDefaultOutline,
  generateFallbackContent,
  countSyllablesServer,
  countSentencesServer,
  computeFleschReadingEaseServer,
  scoreContent,
} from '../../lib/contentGenerationHelpers';

// ============================================================================
// Test Helpers
// ============================================================================

const ALL_CONTENT_TYPE_IDS: ContentTypeId[] = [
  'homepage', 'about', 'service', 'blog', 'blogVersus', 'leadMagnet',
  'paidProduct', 'landing', 'areasWeServe', 'employment', 'mentorship',
  'donate', 'events', 'partner', 'program', 'contentRefresh', 'blogVideo',
];

/** Generate a well-structured article scoring high on all metrics */
function makeHighQualityContent(
  title: string,
  sections: string[],
  keywords: string[],
  targetWords: number
): string {
  const primaryKw = keywords[0] || 'topic';
  let content = `# ${title}\n\n`;
  content += `This article about ${primaryKw} covers everything you need to know. `;
  content += `${primaryKw} is important for modern businesses. `;
  content += `Let us explore ${primaryKw} in detail.\n\n`;

  for (const section of sections) {
    content += `## ${section}\n\n`;
    // Generate enough words per section
    const wordsPerSection = Math.ceil(targetWords / sections.length);
    const sentences = [];
    for (let i = 0; i < Math.ceil(wordsPerSection / 12); i++) {
      if (i % 5 === 0) {
        sentences.push(`When it comes to ${primaryKw}, this aspect is very important for success.`);
      } else if (i % 5 === 1) {
        sentences.push(`Many experts agree that ${section.toLowerCase()} plays a key role.`);
      } else if (i % 5 === 2) {
        sentences.push(`You should focus on getting this right for your business.`);
      } else if (i % 5 === 3) {
        sentences.push(`The best approach is to start with simple steps and build up.`);
      } else {
        sentences.push(`This helps you get better results over time.`);
      }
    }
    content += sentences.join(' ') + '\n\n';
  }

  // Add secondary keywords
  for (const kw of keywords.slice(1)) {
    content += `\n${kw} is also relevant to this discussion. `;
  }

  return content;
}

// ============================================================================
// 1. CONTENT_TYPES Registry Validation
// ============================================================================

describe('CONTENT_TYPES Registry', () => {
  test('has exactly 17 content types', () => {
    expect(Object.keys(CONTENT_TYPES).length).toBe(17);
  });

  test.each(ALL_CONTENT_TYPE_IDS)('content type "%s" exists in registry', (typeId) => {
    expect(CONTENT_TYPES[typeId]).toBeDefined();
  });

  test.each(ALL_CONTENT_TYPE_IDS)('content type "%s" has required fields', (typeId) => {
    const config = CONTENT_TYPES[typeId];
    expect(config.id).toBe(typeId);
    expect(config.name).toBeDefined();
    expect(config.name.length).toBeGreaterThan(3);
    expect(config.description).toBeDefined();
    expect(config.description.length).toBeGreaterThan(10);
    expect(config.wordCount).toBeGreaterThan(0);
    expect(config.promptTemplate).toBeDefined();
    expect(config.promptTemplate.length).toBeGreaterThan(50);
    expect(config.priority).toBeGreaterThan(0);
    expect(['once', 'monthly', 'quarterly', 'asNeeded']).toContain(config.frequency);
  });

  describe('prompt templates', () => {
    test.each(ALL_CONTENT_TYPE_IDS)(
      'template for "%s" contains {{title}} placeholder',
      (typeId) => {
        expect(CONTENT_TYPES[typeId].promptTemplate).toContain('{{title}}');
      }
    );

    test.each(ALL_CONTENT_TYPE_IDS)(
      'template for "%s" contains {{keywords}} placeholder',
      (typeId) => {
        expect(CONTENT_TYPES[typeId].promptTemplate).toContain('{{keywords}}');
      }
    );

    test.each(ALL_CONTENT_TYPE_IDS)(
      'template for "%s" contains Requirements section',
      (typeId) => {
        expect(CONTENT_TYPES[typeId].promptTemplate).toContain('Requirements');
      }
    );

    // contentRefresh intentionally omits word count — it optimizes existing content
    const TYPES_WITH_WORD_COUNTS = ALL_CONTENT_TYPE_IDS.filter((id) => id !== 'contentRefresh');
    test.each(TYPES_WITH_WORD_COUNTS)(
      'template for "%s" contains word count range',
      (typeId) => {
        const template = CONTENT_TYPES[typeId].promptTemplate;
        // Should mention a number (word count target)
        expect(template).toMatch(/\d{3,4}/);
      }
    );

    test.each(ALL_CONTENT_TYPE_IDS)(
      'template for "%s" requests structured JSON output',
      (typeId) => {
        expect(CONTENT_TYPES[typeId].promptTemplate).toContain('Return JSON');
      }
    );

    test.each(ALL_CONTENT_TYPE_IDS)(
      'template for "%s" contains no emojis',
      (typeId) => {
        const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}]/u;
        expect(emojiRegex.test(CONTENT_TYPES[typeId].promptTemplate)).toBe(false);
      }
    );

    test.each(ALL_CONTENT_TYPE_IDS)(
      'template for "%s" has no dangling template syntax',
      (typeId) => {
        const template = CONTENT_TYPES[typeId].promptTemplate;
        expect(template).not.toContain('${');
        expect(template).not.toContain('undefined');
        expect(template).not.toContain('NaN');
      }
    );

    test.each(ALL_CONTENT_TYPE_IDS)(
      'template for "%s" contains CTA requirement',
      (typeId) => {
        const template = CONTENT_TYPES[typeId].promptTemplate.toLowerCase();
        // Most templates require a CTA
        const hasCta = template.includes('cta') || template.includes('call to action');
        expect(hasCta).toBe(true);
      }
    );
  });

  describe('word count ranges are sane', () => {
    test.each(ALL_CONTENT_TYPE_IDS)(
      '"%s" word count is between 300 and 3000',
      (typeId) => {
        const wc = CONTENT_TYPES[typeId].wordCount;
        expect(wc).toBeGreaterThanOrEqual(300);
        expect(wc).toBeLessThanOrEqual(3000);
      }
    );

    test('blog and blogVersus have same word count', () => {
      expect(CONTENT_TYPES.blog.wordCount).toBe(CONTENT_TYPES.blogVersus.wordCount);
    });

    test('homepage has fewer words than blog', () => {
      expect(CONTENT_TYPES.homepage.wordCount).toBeLessThan(CONTENT_TYPES.blog.wordCount);
    });

    test('service has more words than landing', () => {
      expect(CONTENT_TYPES.service.wordCount).toBeGreaterThan(CONTENT_TYPES.landing.wordCount);
    });
  });

  describe('priorities are valid', () => {
    test.each(ALL_CONTENT_TYPE_IDS)(
      '"%s" priority is between 1 and 10',
      (typeId) => {
        expect(CONTENT_TYPES[typeId].priority).toBeGreaterThanOrEqual(1);
        expect(CONTENT_TYPES[typeId].priority).toBeLessThanOrEqual(10);
      }
    );

    test('homepage has highest priority (1)', () => {
      expect(CONTENT_TYPES.homepage.priority).toBe(1);
    });
  });
});

// ============================================================================
// 2. getTargetWords() / getTargetSections()
// ============================================================================

describe('getTargetWords', () => {
  test.each(ALL_CONTENT_TYPE_IDS)(
    'returns correct word count for "%s"',
    (typeId) => {
      expect(getTargetWords(typeId)).toBe(CONTENT_TYPES[typeId].wordCount);
    }
  );

  test('returns legacy target for "pillar"', () => {
    expect(getTargetWords('pillar')).toBe(3500);
  });

  test('returns legacy target for "howto"', () => {
    expect(getTargetWords('howto')).toBe(1800);
  });

  test('returns legacy target for "comparison"', () => {
    expect(getTargetWords('comparison')).toBe(2000);
  });

  test('returns legacy target for "listicle"', () => {
    expect(getTargetWords('listicle')).toBe(1500);
  });

  test('returns default for unknown type', () => {
    expect(getTargetWords('nonexistent')).toBe(DEFAULT_SEO_CHECKLIST.wordCount);
  });
});

describe('getTargetSections', () => {
  test('blog returns 8 sections', () => {
    expect(getTargetSections('blog')).toBe(8);
  });

  test('pillar returns 10 sections', () => {
    expect(getTargetSections('pillar')).toBe(10);
  });

  test('unknown type defaults to 8', () => {
    expect(getTargetSections('unknown')).toBe(8);
  });

  test.each(['blog', 'pillar', 'howto', 'comparison', 'listicle'])(
    '"%s" returns a valid section count (>= 5)',
    (type) => {
      expect(getTargetSections(type)).toBeGreaterThanOrEqual(5);
    }
  );
});

// ============================================================================
// 3. getDefaultOutline()
// ============================================================================

describe('getDefaultOutline', () => {
  test('blog outline includes Introduction and Conclusion', () => {
    const outline = getDefaultOutline('blog', 'SEO');
    expect(outline[0]).toBe('Introduction');
    expect(outline[outline.length - 1]).toBe('Conclusion');
  });

  test('blog outline includes primary keyword', () => {
    const outline = getDefaultOutline('blog', 'content marketing');
    const joined = outline.join(' ');
    expect(joined).toContain('content marketing');
  });

  test('pillar outline has 10 sections', () => {
    expect(getDefaultOutline('pillar', 'SEO').length).toBe(10);
  });

  test('howto outline has step-by-step sections', () => {
    const outline = getDefaultOutline('howto', 'SEO');
    const hasSteps = outline.some((s) => s.startsWith('Step'));
    expect(hasSteps).toBe(true);
  });

  test('comparison outline has comparison table section', () => {
    const outline = getDefaultOutline('comparison', 'tools');
    expect(outline).toContain('Quick Comparison Table');
  });

  test('listicle outline has numbered items', () => {
    const outline = getDefaultOutline('listicle', 'tools');
    const numbered = outline.filter((s) => /^\d+\./.test(s));
    expect(numbered.length).toBeGreaterThanOrEqual(5);
  });

  test('unknown type falls back to blog outline', () => {
    const unknown = getDefaultOutline('unknown', 'test');
    const blog = getDefaultOutline('blog', 'test');
    expect(unknown).toEqual(blog);
  });

  test.each(ALL_CONTENT_TYPE_IDS)(
    'outline for type-as-keyword "%s" produces non-empty array',
    (typeId) => {
      const outline = getDefaultOutline('blog', typeId);
      expect(outline.length).toBeGreaterThan(0);
      expect(outline[0]).toBe('Introduction');
    }
  );
});

// ============================================================================
// 4. generateFallbackContent()
// ============================================================================

describe('generateFallbackContent', () => {
  test('includes H1 title', () => {
    const content = generateFallbackContent('Test Title', ['Section 1'], ['keyword1']);
    expect(content).toContain('# Test Title');
  });

  test('includes H2 for each outline section', () => {
    const outline = ['First Section', 'Second Section', 'Third Section'];
    const content = generateFallbackContent('Title', outline, ['kw']);
    for (const section of outline) {
      expect(content).toContain(`## ${section}`);
    }
  });

  test('mentions primary keyword', () => {
    const content = generateFallbackContent('Title', ['Section'], ['SEO optimization']);
    expect(content).toContain('SEO optimization');
  });

  test('produces header-only content for empty outline', () => {
    const content = generateFallbackContent('Title', [], ['kw']);
    expect(content).toContain('# Title');
    // Empty outline = only H1 + newlines, no sections
    expect(content.trim()).toBe('# Title');
  });

  test('uses "topic" when no keywords provided', () => {
    const content = generateFallbackContent('Title', ['Section'], []);
    expect(content).toContain('topic');
  });

  test.each(ALL_CONTENT_TYPE_IDS)(
    'produces valid fallback for content type "%s" outline',
    (typeId) => {
      const outline = getDefaultOutline('blog', typeId);
      const content = generateFallbackContent(
        `Guide to ${typeId}`, outline, [typeId]
      );
      expect(content).toContain(`# Guide to ${typeId}`);
      for (const section of outline) {
        expect(content).toContain(`## ${section}`);
      }
    }
  );
});

// ============================================================================
// 5. countWords()
// ============================================================================

describe('countWords', () => {
  test('counts simple words', () => {
    expect(countWords('hello world foo')).toBe(3);
  });

  test('handles multiple spaces', () => {
    expect(countWords('hello    world')).toBe(2);
  });

  test('handles empty string', () => {
    expect(countWords('')).toBe(0);
  });

  test('handles null-like input', () => {
    expect(countWords(null as unknown as string)).toBe(0);
  });

  test('handles markdown content', () => {
    const md = '# Title\n\n## Section\n\nThis is a test.';
    expect(countWords(md)).toBeGreaterThan(5);
  });
});

// ============================================================================
// 6. Readability Scoring
// ============================================================================

describe('countSyllablesServer', () => {
  test('one-syllable words', () => {
    expect(countSyllablesServer('cat')).toBe(1);
    expect(countSyllablesServer('the')).toBe(1);
    expect(countSyllablesServer('dog')).toBe(1);
  });

  test('two-syllable words', () => {
    expect(countSyllablesServer('apple')).toBe(2);
    expect(countSyllablesServer('happy')).toBe(2);
  });

  test('three-syllable words', () => {
    expect(countSyllablesServer('beautiful')).toBe(3);
    expect(countSyllablesServer('banana')).toBe(3);
  });

  test('handles short words (1-2 chars)', () => {
    expect(countSyllablesServer('I')).toBe(1);
    expect(countSyllablesServer('go')).toBe(1);
  });

  test('strips non-alpha characters', () => {
    expect(countSyllablesServer("won't")).toBe(1);
  });

  test('returns at least 1 for any word', () => {
    expect(countSyllablesServer('')).toBeGreaterThanOrEqual(1);
  });
});

describe('countSentencesServer', () => {
  test('counts simple sentences', () => {
    expect(countSentencesServer('Hello world. This is a test.')).toBe(2);
  });

  test('single-word punctuated fragments count as minimum 1', () => {
    // "What", "Really", "Yes" are all single words — filtered by >= 2 word check
    // Math.max(1, 0) returns 1
    expect(countSentencesServer('What? Really! Yes.')).toBe(1);
  });

  test('returns 0 for empty string', () => {
    expect(countSentencesServer('')).toBe(0);
  });

  test('strips markdown headings but keeps text', () => {
    expect(countSentencesServer('## Title\n\nThis is a test. And another one.')).toBeGreaterThan(0);
  });

  test('single-word input returns minimum 1 (Math.max guard)', () => {
    // "Hello." has 1 word — filtered, but Math.max(1, 0) = 1
    expect(countSentencesServer('Hello.')).toBe(1);
  });

  test('returns at least 1 for valid content', () => {
    expect(countSentencesServer('This is a valid sentence.')).toBe(1);
  });
});

describe('computeFleschReadingEaseServer', () => {
  test('returns 0 for empty content', () => {
    expect(computeFleschReadingEaseServer('', 0)).toBe(0);
  });

  test('returns 0 for very short content (< 10 words)', () => {
    expect(computeFleschReadingEaseServer('Short text.', 2)).toBe(0);
  });

  test('simple content scores high readability (60+)', () => {
    const simple = 'The cat sat on the mat. The dog ran in the yard. The sun was very bright. Birds sang in the trees. Kids played in the park.';
    const score = computeFleschReadingEaseServer(simple, countWords(simple));
    expect(score).toBeGreaterThan(60);
  });

  test('complex content scores lower', () => {
    const complex = 'The implementation of sophisticated neurological computational paradigms necessitates comprehensive understanding of multifaceted algorithmic architectures. Furthermore, the instantiation of heterogeneous distributed systems requires meticulous consideration of concurrent processing methodologies and their corresponding synchronization mechanisms.';
    const score = computeFleschReadingEaseServer(complex, countWords(complex));
    expect(score).toBeLessThan(40);
  });

  test('score is between 0 and 100', () => {
    const content = 'This is a test. It has some words. We want to see the score. The result should be valid.';
    const score = computeFleschReadingEaseServer(content, countWords(content));
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('strips markdown formatting before scoring', () => {
    const md = '## Section\n\n**Bold text** and *italic text* in a paragraph. This is another sentence here.';
    const score = computeFleschReadingEaseServer(md, countWords(md));
    expect(score).toBeGreaterThan(0);
  });
});

// ============================================================================
// 7. scoreContent() — Quality Scoring
// ============================================================================

describe('scoreContent', () => {
  describe('basic scoring', () => {
    test('empty content scores 0', () => {
      const { score } = scoreContent('', [], [], 1200);
      expect(score).toBe(0);
    });

    test('returns all 5 metrics', () => {
      const { metrics } = scoreContent('test content', ['section'], ['kw'], 100);
      expect(metrics).toHaveProperty('wordCountScore');
      expect(metrics).toHaveProperty('h2Score');
      expect(metrics).toHaveProperty('keywordScore');
      expect(metrics).toHaveProperty('structureScore');
      expect(metrics).toHaveProperty('readabilityScore');
    });

    test('score is capped at 100', () => {
      // Even with perfect metrics on all dimensions, score should not exceed 100
      const content = makeHighQualityContent(
        'Test', ['Intro', 'Body 1', 'Body 2', 'Body 3', 'Body 4', 'Body 5', 'Conclusion'],
        ['keyword'], 500
      );
      const { score } = scoreContent(content, ['Intro'], ['keyword'], 100);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('word count scoring', () => {
    test('100% when at target', () => {
      const words = Array.from({ length: 1200 }, () => 'word').join(' ');
      const { metrics } = scoreContent(words, [], [], 1200);
      expect(metrics.wordCountScore).toBe(100);
    });

    test('50% when at half target', () => {
      const words = Array.from({ length: 600 }, () => 'word').join(' ');
      const { metrics } = scoreContent(words, [], [], 1200);
      expect(metrics.wordCountScore).toBe(50);
    });

    test('capped at 100% even when exceeding target', () => {
      const words = Array.from({ length: 2000 }, () => 'word').join(' ');
      const { metrics } = scoreContent(words, [], [], 1200);
      expect(metrics.wordCountScore).toBe(100);
    });
  });

  describe('H2 scoring', () => {
    test('100% with 6+ H2 sections', () => {
      const content = '## A\n## B\n## C\n## D\n## E\n## F\n## G';
      const { metrics } = scoreContent(content, [], [], 100);
      expect(metrics.h2Score).toBe(100);
    });

    test('50% with 3 H2 sections', () => {
      const content = '## A\n## B\n## C';
      const { metrics } = scoreContent(content, [], [], 100);
      expect(metrics.h2Score).toBe(50);
    });

    test('0% with no H2 sections', () => {
      const { metrics } = scoreContent('No headings here.', [], [], 100);
      expect(metrics.h2Score).toBe(0);
    });
  });

  describe('keyword scoring', () => {
    test('100% coverage when all keywords present', () => {
      const content = 'seo optimization content marketing guide for beginners.';
      const keywords = ['seo', 'content marketing'];
      const { metrics } = scoreContent(content, [], keywords, 100);
      expect(metrics.keywordScore).toBeGreaterThan(50);
    });

    test('0% when no keywords', () => {
      const { metrics } = scoreContent('some content', [], [], 100);
      expect(metrics.keywordScore).toBe(0);
    });

    test('partial score when only some keywords present', () => {
      const content = 'This is about seo and nothing else.';
      const keywords = ['seo', 'content marketing', 'digital strategy'];
      const { metrics } = scoreContent(content, [], keywords, 100);
      expect(metrics.keywordScore).toBeGreaterThan(0);
      expect(metrics.keywordScore).toBeLessThan(100);
    });
  });

  describe('structure scoring', () => {
    test('100% when all outline sections covered', () => {
      const outline = ['Why SEO Matters', 'Getting Started'];
      const content = 'This is about why seo matters and getting started with it.';
      const { metrics } = scoreContent(content, outline, [], 100);
      expect(metrics.structureScore).toBe(100);
    });

    test('0% when no outline sections covered', () => {
      const outline = ['Completely Unrelated Title'];
      const content = 'This has nothing to do with the outline section name.';
      const { metrics } = scoreContent(content, outline, [], 100);
      expect(metrics.structureScore).toBe(0);
    });
  });

  describe('cross-content-type scoring', () => {
    test.each(ALL_CONTENT_TYPE_IDS)(
      'fallback content for "%s" produces non-zero score',
      (typeId) => {
        const config = CONTENT_TYPES[typeId];
        const outline = getDefaultOutline('blog', typeId);
        const content = generateFallbackContent(
          `Guide to ${typeId}`, outline, [typeId]
        );
        const { score, metrics } = scoreContent(
          content, outline, [typeId], config.wordCount
        );
        // Fallback content should score > 0 on most metrics
        expect(score).toBeGreaterThan(0);
        expect(metrics.h2Score).toBeGreaterThan(0);
        expect(metrics.structureScore).toBeGreaterThan(0);
      }
    );

    test.each(ALL_CONTENT_TYPE_IDS)(
      'high-quality content for "%s" scores above 50',
      (typeId) => {
        const config = CONTENT_TYPES[typeId];
        const outline = ['Introduction', 'Main Topic', 'Benefits', 'How To', 'Tips', 'Conclusion'];
        const content = makeHighQualityContent(
          `Complete Guide to ${typeId}`, outline, [typeId, 'best practices'], config.wordCount
        );
        const { score } = scoreContent(content, outline, [typeId, 'best practices'], config.wordCount);
        expect(score).toBeGreaterThan(50);
      }
    );
  });
});

// ============================================================================
// 8. Constants
// ============================================================================

describe('Constants', () => {
  test('QUALITY_THRESHOLD is 95', () => {
    expect(QUALITY_THRESHOLD).toBe(95);
  });

  test('MAX_GENERATION_ATTEMPTS is 3', () => {
    expect(MAX_GENERATION_ATTEMPTS).toBe(3);
  });

  test('DEFAULT_SEO_CHECKLIST has required fields', () => {
    expect(DEFAULT_SEO_CHECKLIST.wordCount).toBe(750);
    expect(DEFAULT_SEO_CHECKLIST.faqCount).toBe(3);
    expect(DEFAULT_SEO_CHECKLIST.mainKeywordCount).toBe(4);
    expect(DEFAULT_SEO_CHECKLIST.metaDescription).toEqual({ min: 150, max: 160 });
  });
});

// ============================================================================
// 9. Cross-Type Consistency
// ============================================================================

describe('Cross-Type Consistency', () => {
  test('all CONTENT_TYPE_IDS are in CONTENT_TYPES registry', () => {
    for (const id of ALL_CONTENT_TYPE_IDS) {
      expect(CONTENT_TYPES[id]).toBeDefined();
      expect(CONTENT_TYPES[id].id).toBe(id);
    }
  });

  test('getTargetWords returns CONTENT_TYPES.wordCount for all types', () => {
    for (const id of ALL_CONTENT_TYPE_IDS) {
      expect(getTargetWords(id)).toBe(CONTENT_TYPES[id].wordCount);
    }
  });

  test('no two content types have the same name', () => {
    const names = ALL_CONTENT_TYPE_IDS.map((id) => CONTENT_TYPES[id].name);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });

  test('no two content types have the same description', () => {
    const descs = ALL_CONTENT_TYPE_IDS.map((id) => CONTENT_TYPES[id].description);
    const unique = new Set(descs);
    expect(unique.size).toBe(descs.length);
  });

  test('content type IDs match their id field', () => {
    for (const [key, config] of Object.entries(CONTENT_TYPES)) {
      expect(config.id).toBe(key);
    }
  });
});

// ============================================================================
// 10. Structural Deliverables — "We deliver what we promise"
// ============================================================================

describe('Structural Deliverables', () => {
  /**
   * Maps each content type to:
   * - returnJsonFields: fields promised in the Return JSON spec
   * - templateMustMention: words/phrases the Requirements section MUST contain
   *   to ensure the AI is actually asked to produce the promised deliverables
   */
  const DELIVERABLES_MAP: Record<
    string,
    { returnJsonFields: string[]; templateMustMention: string[] }
  > = {
    homepage: {
      returnJsonFields: ['content', 'metaDescription', 'cta', 'h1'],
      templateMustMention: ['value proposition', 'H1'],
    },
    about: {
      returnJsonFields: ['content', 'metaDescription', 'cta'],
      templateMustMention: ['story', 'E-E-A-T'],
    },
    service: {
      returnJsonFields: ['content', 'metaDescription', 'faqs', 'cta'],
      templateMustMention: ['FAQ', 'meta description', 'benefits'],
    },
    blog: {
      returnJsonFields: ['content', 'metaDescription', 'faqs', 'cta', 'outline'],
      templateMustMention: ['FAQ', 'meta description', 'H2', 'actionable'],
    },
    blogVersus: {
      returnJsonFields: ['content', 'metaDescription', 'comparisonTable', 'cta'],
      templateMustMention: ['comparison', 'table', 'pros/cons', 'recommendation'],
    },
    leadMagnet: {
      returnJsonFields: ['content', 'metaDescription', 'bulletPoints', 'cta'],
      templateMustMention: ['bullet point', 'opt-in', 'urgency'],
    },
    paidProduct: {
      returnJsonFields: ['content', 'metaDescription', 'whatsIncluded', 'faqs', 'cta'],
      templateMustMention: ['included', 'FAQ', 'price'],
    },
    landing: {
      returnJsonFields: ['content', 'metaDescription', 'cta'],
      templateMustMention: ['conversion', 'CTA', 'benefits'],
    },
    areasWeServe: {
      returnJsonFields: ['content', 'metaDescription', 'cta'],
      templateMustMention: ['location', 'local'],
    },
    employment: {
      returnJsonFields: ['content', 'metaDescription', 'requirements', 'benefits', 'cta'],
      templateMustMention: ['job', 'requirements', 'benefits', 'culture'],
    },
    mentorship: {
      returnJsonFields: ['content', 'metaDescription', 'cta'],
      templateMustMention: ['program', 'who it'],
    },
    donate: {
      returnJsonFields: ['content', 'metaDescription', 'impactStatement', 'cta'],
      templateMustMention: ['impact', 'donation', 'tax'],
    },
    events: {
      returnJsonFields: ['content', 'metaDescription', 'eventTypes', 'cta'],
      templateMustMention: ['event', 'attend', 'registration'],
    },
    partner: {
      returnJsonFields: ['content', 'metaDescription', 'partnerTypes', 'cta'],
      templateMustMention: ['partner', 'application'],
    },
    program: {
      returnJsonFields: ['content', 'metaDescription', 'curriculum', 'outcomes', 'cta'],
      templateMustMention: ['curriculum', 'outcomes', 'enrollment'],
    },
    contentRefresh: {
      returnJsonFields: ['content', 'metaDescription', 'changes', 'cta'],
      templateMustMention: ['existing', 'structure', 'keyword'],
    },
    blogVideo: {
      returnJsonFields: ['blogContent', 'videoScript', 'metaDescription', 'faqs', 'cta'],
      templateMustMention: ['video script', 'video embed', 'blog'],
    },
  };

  // --- Return JSON spec validation ---
  describe('Return JSON promises', () => {
    test.each(ALL_CONTENT_TYPE_IDS)(
      '"%s" Return JSON spec contains all promised fields',
      (typeId) => {
        const template = CONTENT_TYPES[typeId].promptTemplate;
        const deliverables = DELIVERABLES_MAP[typeId];
        expect(deliverables).toBeDefined();

        // Extract everything after "Return JSON:" to handle nested braces/brackets
        const returnJsonMatch = template.match(/Return JSON:\s*(.+)/s);
        expect(returnJsonMatch).not.toBeNull();
        const returnJsonStr = returnJsonMatch![1];

        for (const field of deliverables.returnJsonFields) {
          expect(returnJsonStr).toContain(field);
        }
      }
    );

    test('every content type is covered in DELIVERABLES_MAP', () => {
      for (const id of ALL_CONTENT_TYPE_IDS) {
        expect(DELIVERABLES_MAP[id]).toBeDefined();
      }
    });
  });

  // --- Template requirements validation ---
  describe('Template requirements match promises', () => {
    test.each(ALL_CONTENT_TYPE_IDS)(
      '"%s" template mentions all required deliverable keywords',
      (typeId) => {
        const template = CONTENT_TYPES[typeId].promptTemplate.toLowerCase();
        const deliverables = DELIVERABLES_MAP[typeId];

        for (const keyword of deliverables.templateMustMention) {
          expect(template).toContain(keyword.toLowerCase());
        }
      }
    );
  });

  // --- Type-specific structural tests ---
  describe('Type-specific deliverables', () => {
    // blogVideo: must request BOTH blog content AND video script
    test('blogVideo requests both blog content AND video script', () => {
      const template = CONTENT_TYPES.blogVideo.promptTemplate;
      expect(template).toContain('blog');
      expect(template.toLowerCase()).toContain('video script');
      expect(template).toContain('blogContent');
      expect(template).toContain('videoScript');
    });

    test('blogVideo specifies video duration', () => {
      const template = CONTENT_TYPES.blogVideo.promptTemplate;
      // "3-5 minute read" for video script length
      expect(template).toMatch(/\d+-\d+\s*minute/i);
    });

    test('blogVideo requests video embed placeholder', () => {
      const template = CONTENT_TYPES.blogVideo.promptTemplate.toLowerCase();
      expect(template).toContain('video embed');
    });

    // blogVersus: must request comparison table structure
    test('blogVersus requests structured comparison table', () => {
      const template = CONTENT_TYPES.blogVersus.promptTemplate;
      expect(template).toContain('comparisonTable');
      expect(template).toContain('headers');
      // Table should have rows
      expect(template).toContain('row1');
      expect(template).toContain('row2');
    });

    test('blogVersus mentions {{companyName}} for differentiation', () => {
      const template = CONTENT_TYPES.blogVersus.promptTemplate;
      // companyName should appear in requirements (not just header)
      const matches = template.match(/\{\{companyName\}\}/g) || [];
      expect(matches.length).toBeGreaterThanOrEqual(2);
    });

    // service: must request FAQs with question/answer structure
    test('service requests structured FAQs with question/answer pairs', () => {
      const template = CONTENT_TYPES.service.promptTemplate;
      expect(template).toContain('faqs');
      expect(template).toContain('question');
      expect(template).toContain('answer');
    });

    test('service specifies FAQ count (3)', () => {
      const template = CONTENT_TYPES.service.promptTemplate;
      expect(template).toContain('3 FAQ');
    });

    // blog: must request FAQs AND outline
    test('blog requests FAQs AND outline in output', () => {
      const template = CONTENT_TYPES.blog.promptTemplate;
      expect(template).toContain('faqs');
      expect(template).toContain('outline');
      expect(template).toContain('h2s');
    });

    // paidProduct: must request whatsIncluded AND faqs
    test('paidProduct requests whatsIncluded AND faqs', () => {
      const template = CONTENT_TYPES.paidProduct.promptTemplate;
      expect(template).toContain('whatsIncluded');
      expect(template).toContain('faqs');
      expect(template.toLowerCase()).toContain("what's included");
    });

    test('paidProduct requests price justification', () => {
      const template = CONTENT_TYPES.paidProduct.promptTemplate.toLowerCase();
      expect(template).toContain('price');
    });

    // leadMagnet: must request bulletPoints
    test('leadMagnet requests bullet points in both requirements and output', () => {
      const template = CONTENT_TYPES.leadMagnet.promptTemplate;
      expect(template).toContain('bulletPoints');
      expect(template.toLowerCase()).toContain('bullet point');
    });

    // employment: must request requirements AND benefits arrays
    test('employment requests requirements AND benefits arrays', () => {
      const template = CONTENT_TYPES.employment.promptTemplate;
      expect(template).toContain('requirements: []');
      expect(template).toContain('benefits: []');
    });

    test('employment mentions application process', () => {
      const template = CONTENT_TYPES.employment.promptTemplate.toLowerCase();
      expect(template).toContain('application');
    });

    // donate: must request impactStatement
    test('donate requests impactStatement deliverable', () => {
      const template = CONTENT_TYPES.donate.promptTemplate;
      expect(template).toContain('impactStatement');
      expect(template.toLowerCase()).toContain('impact');
    });

    test('donate mentions tax deduction information', () => {
      const template = CONTENT_TYPES.donate.promptTemplate.toLowerCase();
      expect(template).toContain('tax');
    });

    // events: must request eventTypes
    test('events requests eventTypes array', () => {
      const template = CONTENT_TYPES.events.promptTemplate;
      expect(template).toContain('eventTypes: []');
    });

    // partner: must request partnerTypes
    test('partner requests partnerTypes array', () => {
      const template = CONTENT_TYPES.partner.promptTemplate;
      expect(template).toContain('partnerTypes: []');
    });

    // program: must request curriculum AND outcomes
    test('program requests curriculum AND outcomes arrays', () => {
      const template = CONTENT_TYPES.program.promptTemplate;
      expect(template).toContain('curriculum: []');
      expect(template).toContain('outcomes: []');
    });

    // areasWeServe: must have {{location}} placeholder
    test('areasWeServe has {{location}} placeholder', () => {
      const template = CONTENT_TYPES.areasWeServe.promptTemplate;
      expect(template).toContain('{{location}}');
    });

    test('areasWeServe mentions local landmarks', () => {
      const template = CONTENT_TYPES.areasWeServe.promptTemplate.toLowerCase();
      expect(template).toContain('landmark');
    });

    // contentRefresh: must have {{existingContent}} placeholder
    test('contentRefresh has {{existingContent}} placeholder', () => {
      const template = CONTENT_TYPES.contentRefresh.promptTemplate;
      expect(template).toContain('{{existingContent}}');
    });

    test('contentRefresh requests changes array in output', () => {
      const template = CONTENT_TYPES.contentRefresh.promptTemplate;
      expect(template).toContain('changes: []');
    });

    // homepage: must request h1 in output
    test('homepage requests h1 in Return JSON', () => {
      const template = CONTENT_TYPES.homepage.promptTemplate;
      const returnJson = template.match(/Return JSON:\s*(.+)/s)![1];
      expect(returnJson).toContain('h1');
    });
  });

  // --- Every type delivers metaDescription ---
  describe('Universal deliverables', () => {
    test.each(ALL_CONTENT_TYPE_IDS)(
      '"%s" promises metaDescription in Return JSON',
      (typeId) => {
        const template = CONTENT_TYPES[typeId].promptTemplate;
        expect(template).toContain('metaDescription');
      }
    );

    test.each(ALL_CONTENT_TYPE_IDS)(
      '"%s" promises cta in Return JSON',
      (typeId) => {
        const template = CONTENT_TYPES[typeId].promptTemplate;
        expect(template).toContain('cta');
      }
    );

    test.each(ALL_CONTENT_TYPE_IDS)(
      '"%s" promises content body in Return JSON',
      (typeId) => {
        const template = CONTENT_TYPES[typeId].promptTemplate;
        const returnJson = template.match(/Return JSON:\s*(.+)/s)![1];
        // Either "content" or "blogContent" (blogVideo uses blogContent)
        const hasContentField =
          returnJson.includes('content') || returnJson.includes('blogContent');
        expect(hasContentField).toBe(true);
      }
    );
  });

  // --- FAQ types all use consistent structure ---
  describe('FAQ consistency', () => {
    const FAQ_TYPES: ContentTypeId[] = ['service', 'blog', 'paidProduct', 'blogVideo'];

    test.each(FAQ_TYPES)(
      '"%s" uses consistent FAQ structure [{question, answer}]',
      (typeId) => {
        const template = CONTENT_TYPES[typeId].promptTemplate;
        expect(template).toContain('faqs: [{question, answer}]');
      }
    );

    test('non-FAQ types do NOT promise faqs', () => {
      const NON_FAQ_TYPES: ContentTypeId[] = [
        'homepage', 'about', 'landing', 'areasWeServe',
        'mentorship', 'donate', 'events', 'partner', 'contentRefresh',
      ];
      for (const typeId of NON_FAQ_TYPES) {
        const template = CONTENT_TYPES[typeId].promptTemplate;
        const returnJson = template.match(/Return JSON:\s*(.+)/s)![1];
        expect(returnJson).not.toContain('faqs');
      }
    });
  });
});

// ============================================================================
// 11. Regression Guards
// ============================================================================

describe('Regression Guards', () => {
  test('REGRESSION: scoreContent crashed on undefined content', () => {
    expect(() => scoreContent(undefined as unknown as string, [], [], 1200)).not.toThrow();
  });

  test('REGRESSION: scoreContent throws on null keywords (expected — no null guard)', () => {
    // Production code also has no null guard — keywords is always an array from Convex validators
    expect(() => scoreContent('test', [], null as unknown as string[], 1200)).toThrow();
  });

  test('REGRESSION: countWords crashed on empty string', () => {
    expect(countWords('')).toBe(0);
  });

  test('REGRESSION: getDefaultOutline crashed on unknown type', () => {
    expect(() => getDefaultOutline('nonexistent', 'keyword')).not.toThrow();
    expect(getDefaultOutline('nonexistent', 'keyword').length).toBeGreaterThan(0);
  });

  test('REGRESSION: computeFleschReadingEaseServer returned NaN', () => {
    const score = computeFleschReadingEaseServer('', 0);
    expect(Number.isNaN(score)).toBe(false);
  });

  test('REGRESSION: scoreContent returned score > 100', () => {
    // Even with impossibly good content, score should cap at 100
    const hugeContent = Array.from({ length: 5000 }, () => 'word').join(' ');
    const { score } = scoreContent(hugeContent, [], [], 100);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('REGRESSION: keyword density calculation divided by zero', () => {
    const { metrics } = scoreContent('', [], ['keyword'], 100);
    expect(Number.isNaN(metrics.keywordScore)).toBe(false);
  });
});
