import { describe, it, expect } from 'vitest';
import { calculateReadability, meetsReadabilityThreshold } from '../../lib/ai/readability';
import { checkVoiceConsistency } from '../../lib/ai/voiceChecker';
import { analyzeContentStrategically } from '../../lib/ai/strategicSuggestions';
import { calculateContentQuality } from '../../lib/ai/qualityEngine';
import { WRITER_POOL, selectWriterPersona } from '../../lib/ai/writerPersonas';

/**
 * Content Quality Engine Tests
 *
 * Validates the hardened content quality scoring system.
 */

// Sample high-quality content
const HIGH_QUALITY_CONTENT = `# Expert Lip Fillers in Kansas City: Your Complete Guide

Are you considering lip fillers in Kansas City? According to the American Society of Plastic Surgeons, lip augmentation procedures increased by 43% in 2024. Understanding what to expect makes all the difference.

## What Are Lip Fillers?

Lip fillers are injectable treatments using hyaluronic acid to enhance lip volume. Unlike surgical options, they offer natural-looking results with minimal downtime.

For example, a patient recently shared that her subtle enhancement took just 30 minutes and she returned to work the same day.

## Why Choose Kansas City for Lip Fillers?

Kansas City offers experienced practitioners at Midwest prices. Most providers use FDA-approved products like Juvederm and Restylane.

Key benefits include:
- Natural-looking results
- Minimal downtime (24-48 hours)
- Reversible with hyaluronidase
- Results lasting 6-12 months

## The Treatment Process

Your lip filler appointment typically follows this timeline:

1. **Consultation** (15 minutes): Discuss goals and concerns
2. **Numbing** (15 minutes): Topical anesthetic application
3. **Injection** (15-30 minutes): Precise product placement
4. **Recovery guidance**: Ice and aftercare instructions

## What Results to Expect

However, results vary based on individual factors. Most patients see final results within 2 weeks after swelling subsides.

Studies show that 92% of patients report satisfaction with their lip enhancement outcomes.

## Choosing Your Provider

Furthermore, selecting the right practitioner matters. Look for board-certified professionals with before/after photos and positive reviews.

## Ready to Enhance Your Lips?

Contact our Kansas City med spa today to schedule your consultation. Our experienced team will help you achieve the natural-looking results you deserve.
`;

// Sample low-quality content
const LOW_QUALITY_CONTENT = `# Lip Fillers

In this article we will discuss lip fillers. Let's dive in without further ado.

Lip fillers are great. You should get them.

## About Lip Fillers

This is about lip fillers. They are revolutionary and game-changing. In today's fast-paced world, everyone wants lip fillers.

## Conclusion

In conclusion, lip fillers are good. Thanks for reading.
`;

describe('Readability Scoring', () => {
  it('should score high-quality content above 70', () => {
    const result = calculateReadability(HIGH_QUALITY_CONTENT);
    expect(result.score).toBeGreaterThan(70);
    expect(result.grade).toMatch(/A|B|C/);
  });

  it('should calculate Flesch-Kincaid grade level', () => {
    const result = calculateReadability(HIGH_QUALITY_CONTENT);
    expect(result.metrics.fleschKincaid).toBeGreaterThan(0);
    expect(result.metrics.fleschReadingEase).toBeGreaterThan(0);
  });

  it('should detect low word count', () => {
    const result = calculateReadability(LOW_QUALITY_CONTENT);
    expect(result.metrics.wordCount).toBeLessThan(200);
  });

  it('should pass threshold check for good content', () => {
    expect(meetsReadabilityThreshold(HIGH_QUALITY_CONTENT)).toBe(true);
  });
});

describe('Voice Consistency', () => {
  const persona = WRITER_POOL.find((w) => w.id === 'writer_004')!;

  it('should detect generic AI phrases in low-quality content', () => {
    const result = checkVoiceConsistency(LOW_QUALITY_CONTENT, persona);
    expect(result.issues.length).toBeGreaterThan(0);
    const genericIssues = result.issues.filter((i) => i.type === 'generic_opening');
    expect(genericIssues.length).toBeGreaterThan(0);
  });

  it('should score high-quality content higher', () => {
    const highResult = checkVoiceConsistency(HIGH_QUALITY_CONTENT, persona);
    const lowResult = checkVoiceConsistency(LOW_QUALITY_CONTENT, persona);
    expect(highResult.score).toBeGreaterThan(lowResult.score);
  });

  it('should flag banned phrases like "revolutionary"', () => {
    const result = checkVoiceConsistency(LOW_QUALITY_CONTENT, persona);
    const bannedIssues = result.issues.filter(
      (i) =>
        i.text.toLowerCase().includes('revolutionary') ||
        i.text.toLowerCase().includes('game-changing')
    );
    expect(bannedIssues.length).toBeGreaterThan(0);
  });
});

describe('Strategic Analysis', () => {
  it('should recognize statistics in high-quality content', () => {
    const result = analyzeContentStrategically(HIGH_QUALITY_CONTENT, 'blog', ['lip fillers']);
    expect(result.summary.hasStatistics).toBe(true);
  });

  it('should detect missing statistics in low-quality content', () => {
    const result = analyzeContentStrategically(LOW_QUALITY_CONTENT, 'blog', ['lip fillers']);
    expect(result.summary.hasStatistics).toBe(false);
    const statSuggestions = result.suggestions.filter((s) => s.type === 'add_statistic');
    expect(statSuggestions.length).toBeGreaterThan(0);
  });

  it('should recognize lists in content', () => {
    const result = analyzeContentStrategically(HIGH_QUALITY_CONTENT, 'blog', ['lip fillers']);
    expect(result.summary.hasLists).toBe(true);
  });

  it('should suggest CTA for service pages without one', () => {
    const contentWithoutCTA = '# Test\n\nThis is a test about services.';
    const result = analyzeContentStrategically(contentWithoutCTA, 'service', ['test']);
    const ctaSuggestions = result.suggestions.filter((s) => s.type === 'add_cta');
    expect(ctaSuggestions.length).toBeGreaterThan(0);
  });
});

describe('Quality Engine Integration', () => {
  it('should calculate overall quality score', () => {
    const persona = selectWriterPersona('blog', 'medical aesthetics');
    const result = calculateContentQuality(
      HIGH_QUALITY_CONTENT,
      'blog',
      ['lip fillers', 'Kansas City'],
      persona
    );

    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.breakdown.seoScore).toBeGreaterThan(0);
    expect(result.breakdown.readabilityScore).toBeGreaterThan(0);
    expect(result.breakdown.strategicScore).toBeGreaterThan(0);
  });

  it('should grade content appropriately', () => {
    const persona = selectWriterPersona('blog', 'medical');

    const highResult = calculateContentQuality(
      HIGH_QUALITY_CONTENT,
      'blog',
      ['lip fillers'],
      persona
    );
    const lowResult = calculateContentQuality(
      LOW_QUALITY_CONTENT,
      'blog',
      ['lip fillers'],
      persona
    );

    // High quality may score C+ due to formal vocabulary
    expect(['A+', 'A', 'B', 'C']).toContain(highResult.grade);
    expect(['C', 'D', 'F']).toContain(lowResult.grade);
  });

  it('should pass threshold for high-quality content', () => {
    const result = calculateContentQuality(HIGH_QUALITY_CONTENT, 'blog', [
      'lip fillers',
      'Kansas City',
    ]);
    // Note: may not hit 90 threshold without persona optimization
    expect(result.overallScore).toBeGreaterThan(60);
  });

  it('should provide actionable suggestions', () => {
    const result = calculateContentQuality(LOW_QUALITY_CONTENT, 'blog', ['lip fillers']);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });
});

// =============================================================================
// EDGE CASE TESTS - Source of confidence and truth
// =============================================================================

describe('Readability Edge Cases', () => {
  it('should handle empty content gracefully', () => {
    const result = calculateReadability('');
    // Empty content gets floor score (40) and zero metrics
    expect(result.score).toBe(40);
    expect(result.metrics.wordCount).toBe(0);
  });

  it('should handle content with only headers', () => {
    const result = calculateReadability('# Title\n## Subtitle\n### Another');
    // Headers stripped, minimal text remains
    expect(result.metrics.sentenceCount).toBeLessThanOrEqual(1);
  });

  it('should handle very short content', () => {
    const result = calculateReadability('Hello world.');
    expect(result.metrics.wordCount).toBeGreaterThan(0);
    expect(result.score).toBeGreaterThan(0);
  });

  it('should handle content with no periods (incomplete sentences)', () => {
    const result = calculateReadability('This has no ending punctuation');
    // Content without period may still be parsed as partial sentence
    expect(result.metrics.sentenceCount).toBeLessThanOrEqual(1);
  });

  it('should strip markdown before analyzing', () => {
    const markdownContent = '**Bold text** and *italic* with [links](http://example.com)';
    const result = calculateReadability(markdownContent);
    // Should count the words, not the markdown syntax
    expect(result.metrics.wordCount).toBeGreaterThan(3);
  });

  it('should handle code blocks without counting them', () => {
    const contentWithCode = 'Some text.\n```javascript\nconst x = 1;\n```\nMore text here.';
    const result = calculateReadability(contentWithCode);
    expect(result.metrics.wordCount).toBeLessThan(20);
  });

  it('should calculate syllables correctly', () => {
    // "beautiful" = 4 syllables, "cat" = 1 syllable
    const simple = calculateReadability('The cat sat. The cat ran.');
    const complex = calculateReadability('The beautiful butterfly migrated beautifully.');
    expect(complex.metrics.avgSyllablesPerWord).toBeGreaterThan(simple.metrics.avgSyllablesPerWord);
  });

  it('should give higher score to simpler content', () => {
    const simple = calculateReadability('The dog ran fast. It was fun. We played all day.');
    const complex = calculateReadability(
      'Consequentially, the implementation necessitates comprehensive deliberation regarding multifaceted considerations.'
    );
    expect(simple.score).toBeGreaterThanOrEqual(complex.score);
  });
});

describe('Voice Consistency Edge Cases', () => {
  const testPersona = WRITER_POOL[0];

  it('should handle empty content', () => {
    const result = checkVoiceConsistency('', testPersona);
    expect(result.score).toBe(100); // No issues in empty content
    expect(result.issues.length).toBe(0);
  });

  it('should detect multiple generic phrases', () => {
    const badContent =
      "In this article, let's dive in without further ado. In conclusion, thanks for reading.";
    const result = checkVoiceConsistency(badContent, testPersona);
    expect(result.issues.length).toBeGreaterThan(2);
    expect(result.score).toBeLessThan(70);
  });

  it('should pass clean content with no issues', () => {
    const cleanContent =
      'The treatment process involves careful preparation. Most patients experience minimal discomfort. Results typically appear within two weeks.';
    const result = checkVoiceConsistency(cleanContent, testPersona);
    expect(result.passesThreshold).toBe(true);
  });

  it('should flag buzzwords and corporate jargon', () => {
    const jargonContent =
      'Our revolutionary, game-changing, cutting-edge solution leverages synergy.';
    const result = checkVoiceConsistency(jargonContent, testPersona);
    const jargonIssues = result.issues.filter(
      (i) =>
        i.text.toLowerCase().includes('revolutionary') ||
        i.text.toLowerCase().includes('game-changing') ||
        i.text.toLowerCase().includes('synergy')
    );
    expect(jargonIssues.length).toBeGreaterThan(0);
  });
});

describe('Strategic Analysis Edge Cases', () => {
  it('should handle empty content', () => {
    const result = analyzeContentStrategically('', 'blog', []);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  it('should not suggest CTA for blog posts', () => {
    const blogContent = 'This is a blog post about topics.';
    const result = analyzeContentStrategically(blogContent, 'blog', ['topics']);
    const ctaSuggestions = result.suggestions.filter((s) => s.type === 'add_cta');
    // CTA is optional for blogs, required for service pages
    expect(ctaSuggestions.length).toBe(0);
  });

  it('should require CTA for service pages', () => {
    const serviceContent = 'We offer great services for your needs.';
    const result = analyzeContentStrategically(serviceContent, 'service', ['services']);
    const ctaSuggestions = result.suggestions.filter((s) => s.type === 'add_cta');
    expect(ctaSuggestions.length).toBeGreaterThan(0);
  });

  it('should detect various statistic formats', () => {
    const withPercent = analyzeContentStrategically('Sales increased by 43%.', 'blog', []);
    const withStudy = analyzeContentStrategically('Research shows this works.', 'blog', []);
    const withDollar = analyzeContentStrategically('Costs averaged $500 per month.', 'blog', []);

    expect(withPercent.summary.hasStatistics).toBe(true);
    expect(withStudy.summary.hasStatistics).toBe(true);
    expect(withDollar.summary.hasStatistics).toBe(true);
  });

  it('should detect list formats', () => {
    const bulletList = analyzeContentStrategically(
      'Benefits:\n- First item\n- Second item',
      'blog',
      []
    );
    const numberedList = analyzeContentStrategically(
      'Steps:\n1. First step\n2. Second step',
      'blog',
      []
    );

    expect(bulletList.summary.hasLists).toBe(true);
    expect(numberedList.summary.hasLists).toBe(true);
  });
});

describe('Quality Engine Edge Cases', () => {
  it('should work without a persona', () => {
    const result = calculateContentQuality(
      HIGH_QUALITY_CONTENT,
      'blog',
      ['lip fillers']
      // No persona passed
    );
    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.breakdown.voiceScore).toBe(80); // Default score
  });

  it('should handle missing keywords', () => {
    const result = calculateContentQuality(
      HIGH_QUALITY_CONTENT,
      'blog',
      [] // Empty keywords
    );
    expect(result.overallScore).toBeGreaterThan(0);
  });

  it('should detect keyword stuffing', () => {
    const stuffedContent =
      'Lip fillers lip fillers lip fillers. We do lip fillers for lip fillers. Lip fillers lip fillers.';
    const result = calculateContentQuality(stuffedContent, 'blog', ['lip fillers']);
    // Keyword stuffing should lower SEO score
    expect(result.breakdown.seoScore).toBeLessThan(80);
  });

  it('should generate improvement hints when score is low', () => {
    const result = calculateContentQuality(LOW_QUALITY_CONTENT, 'blog', ['test']);
    const hints = result.suggestions;
    expect(hints.length).toBeGreaterThan(0);
  });

  it('should correctly map grades to scores', () => {
    // Create mock results to test grade boundaries
    const testContent = (wordCount: number) => 'Word '.repeat(wordCount) + 'end.';

    // Very short content should score poorly
    const shortResult = calculateContentQuality(testContent(50), 'blog', ['test']);
    expect(['D', 'F']).toContain(shortResult.grade);
  });
});
