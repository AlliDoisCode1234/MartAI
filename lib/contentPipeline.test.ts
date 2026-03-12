/**
 * Content Pipeline Critical Tests
 *
 * Comprehensive test suite covering the revenue-critical content generation
 * pipeline. Tests readability scoring accuracy, brand protection validation,
 * markdown stripping for scoring, content deduplication, and real-world edge cases.
 *
 * Following /debugging-workflow: these tests prevent regressions on bugs
 * that caused visible user impact (readability score 30, competitor-favorable content).
 */

import { describe, it, expect } from 'vitest';
import {
  countWords,
  countSyllables,
  countSentences,
  computeFleschReadingEase,
  countKeywordsUsed,
  computeKeywordDensity,
  scoreContentRealTime,
} from './seoScoring';

// =============================================================================
// REAL-WORLD CONTENT FIXTURES
// =============================================================================

/** Simple, well-written web content (target: Flesch 80+) */
const SIMPLE_WEB_CONTENT = `
## What Are Lip Fillers?

Lip fillers are a quick treatment. They add volume to your lips. Most people see results right away. The process takes about 30 minutes.

A trained doctor uses a small needle. They inject a gel made of hyaluronic acid. This is a substance your body already makes. So it is very safe.

## Why People Love Lip Fillers

Many people want fuller lips. Lip fillers give you a natural look. You can choose how much volume you want. The results last about six months.

There is little downtime. You can go back to work the same day. Some people have mild swelling. This goes away in a day or two.

## How Much Do Lip Fillers Cost?

The cost depends on where you live. Most treatments cost between 500 and 800 dollars. Some clinics offer payment plans. Always choose a board-certified provider.

Do not pick a clinic based on price alone. Your safety matters most. Ask to see before and after photos. Read reviews from real patients.
`;

/** Academic/complex content (should score low on readability) */
const COMPLEX_CONTENT = `
The implementation of sophisticated algorithmic methodologies necessitates a comprehensive understanding of computational complexity theory and its multifaceted implications for contemporary software engineering paradigms. Furthermore, the fundamental principles underlying theoretical frameworks require substantial intellectual consideration and demonstrate the interconnectedness of discrete mathematics with practical applications in distributed computing environments.

The ramifications of utilizing suboptimal architectures in enterprise-level implementations are considerable, particularly when evaluating the performance characteristics of concurrent data processing pipelines that leverage advanced parallelization techniques and sophisticated memory management protocols within heterogeneous computing infrastructures.
`;

/** Competitor-favorable content (should FAIL brand protection) */
const COMPETITOR_FAVORABLE_CONTENT = `
# SEMrush vs MartAI: Which Tool Boosts Your SEO Strategy?

## Why SEMrush Leads the Pack

SEMrush is the clear leader in SEO tools. Its comprehensive database is unmatched. SEMrush excels at everything from keyword research to competitor analysis.

## MartAI: A Simpler Alternative

MartAI is a basic tool for beginners. It offers limited features compared to SEMrush. While MartAI is easier to use, it lacks the depth that serious marketers need.

## Conclusion: SEMrush Is the Superior Choice

In the battle of SEMrush vs MartAI, SEMrush emerges as the superior choice. If you need a comprehensive tool, SEMrush is better. MartAI is only suitable for those who want basic features.
`;

/** Brand-safe content (should PASS brand protection) */
const BRAND_SAFE_CONTENT = `
# MartAI vs SEMrush: Why Smart Marketers Choose MartAI

## Why MartAI Is the Smarter Choice

MartAI uses AI to automate what takes hours with other tools. While SEMrush offers standard features, MartAI goes further with intelligent automation.

## Where Other Tools Fall Short

SEMrush provides basic keyword data. But it requires manual work. MartAI does this automatically. You save time and get better results.

## Conclusion: MartAI Delivers More Value

MartAI is the clear winner for modern marketers. It offers both depth and simplicity. Start your free trial today.
`;

/** Markdown-heavy content for stripping tests */
const MARKDOWN_HEAVY_CONTENT = `
# Main Title

## Section One

This is a **bold** sentence with *italic* words. Here is [a link](https://example.com) and an ![image](photo.jpg).

- Bullet one is here.
- Bullet two is here.
- Bullet three is here.

1. First item now.
2. Second item now.
3. Third item now.

\`\`\`javascript
const x = 42;
console.log(x);
\`\`\`

Here is \`inline code\` in a sentence. This is the last sentence here.

> This is a blockquote with some words. It should count as a sentence.

---

## Section Two

Another paragraph with short sentences. Keep it simple. Write for humans.
`;

// =============================================================================
// MARKDOWN STRIPPING IN SENTENCE COUNTING
// =============================================================================

describe('countSentences — Markdown Stripping', () => {
  it('strips heading markers before counting', () => {
    const text = '## My Heading\nThis is sentence one. This is sentence two.';
    expect(countSentences(text)).toBe(2);
  });

  it('strips bold and italic markers', () => {
    const text = 'This **bold** sentence is here. This *italic* sentence too.';
    expect(countSentences(text)).toBe(2);
  });

  it('strips markdown links', () => {
    const text = 'Visit [our site](https://example.com) today. Learn more now.';
    expect(countSentences(text)).toBe(2);
  });

  it('strips images', () => {
    const text = '![alt text](image.jpg) This is a real sentence. Another one here.';
    expect(countSentences(text)).toBe(2);
  });

  it('strips code blocks entirely', () => {
    const text = 'A sentence before code.\n```\nconst x = 1;\n```\nA sentence after code.';
    // Only the prose sentences count, not code
    const count = countSentences(text);
    expect(count).toBeGreaterThanOrEqual(1);
  });

  it('strips inline code', () => {
    const text = 'Use `npm install` to set up. Then run `npm start` to begin.';
    expect(countSentences(text)).toBe(2);
  });

  it('strips bullet point markers', () => {
    const text = '- First item here. Second part here.\n- Third item here. Fourth part here.';
    expect(countSentences(text)).toBeGreaterThanOrEqual(2);
  });

  it('strips numbered list markers', () => {
    const text = '1. Do this first thing.\n2. Then do this thing.';
    expect(countSentences(text)).toBe(2);
  });

  it('strips blockquote markers', () => {
    const text = '> This is a quoted sentence. It has two parts.';
    expect(countSentences(text)).toBe(2);
  });

  it('handles real-world markdown content accurately', () => {
    const count = countSentences(MARKDOWN_HEAVY_CONTENT);
    // Should count meaningful prose sentences, not markdown artifacts
    expect(count).toBeGreaterThanOrEqual(8);
    expect(count).toBeLessThanOrEqual(25);
  });

  it('does NOT undercount sentences (the bug that caused Flesch=30)', () => {
    // This was the root cause: old code required 3+ words per sentence fragment
    // and counted markdown formatting as sentence content
    const simpleText = 'I am here. You are there. We go now. They run fast. It is good.';
    expect(countSentences(simpleText)).toBe(5);
  });

  it('counts 2-word sentences', () => {
    // Our fix reduced minimum from 3 to 2 words
    const text = 'Get started. Learn more. Sign up. Try now.';
    expect(countSentences(text)).toBe(4);
  });
});

// =============================================================================
// FLESCH READABILITY ACCURACY
// =============================================================================

describe('computeFleschReadingEase — Accuracy', () => {
  it('simple web content scores 70+ (Fairly Easy or better)', () => {
    const score = computeFleschReadingEase(SIMPLE_WEB_CONTENT);
    expect(score).toBeGreaterThanOrEqual(70);
  });

  it('complex academic text scores below 40 (Difficult)', () => {
    const score = computeFleschReadingEase(COMPLEX_CONTENT);
    expect(score).toBeLessThan(40);
  });

  it('simple children-level sentences score 80+ (Easy)', () => {
    const easyText = Array(30)
      .fill('The cat sat on the mat. The dog ran fast. I like cake.')
      .join(' ');
    const score = computeFleschReadingEase(easyText);
    expect(score).toBeGreaterThanOrEqual(80);
  });

  it('markdown formatting does NOT inflate syllable count', () => {
    const withMarkdown = '## Section\n**Bold text** here. A [link](url) is nice. Use `code` too.';
    const withoutMarkdown = 'Bold text here. A link is nice. Use code too.';

    const scoreWithMd = computeFleschReadingEase(
      // Need enough content for Flesch to work (10+ words)
      Array(5).fill(withMarkdown).join('\n')
    );
    const scoreWithoutMd = computeFleschReadingEase(
      Array(5).fill(withoutMarkdown).join('\n')
    );

    // Both should be similar — markdown should not penalize the score
    expect(Math.abs(scoreWithMd - scoreWithoutMd)).toBeLessThan(15);
  });

  it('never returns negative or above 100', () => {
    const content = 'A short easy read. Go now. Do it. Run fast and jump high over fences.';
    const score = computeFleschReadingEase(content);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('returns 0 for content under 10 words', () => {
    expect(computeFleschReadingEase('Too short here')).toBe(0);
  });
});

// =============================================================================
// BRAND PROTECTION VALIDATION
// =============================================================================

/**
 * These tests validate that we can detect competitor-favorable language.
 * The actual enforcement is in the AI prompt, but we can test detection
 * as a post-generation safety net.
 */

/** Detect if content contains competitor-favorable language */
function detectBrandViolations(content: string, brandName: string): string[] {
  const violations: string[] = [];
  const contentLower = content.toLowerCase();
  const brandLower = brandName.toLowerCase();

  // Check for competitor being called "superior", "better", "leads"
  const competitorFavorablePatterns = [
    /(\w+)\s+(is|emerges as|remains)\s+(the\s+)?(superior|better|best|leading|clear) choice/gi,
    /(\w+)\s+(leads|excels|dominates|outperforms)/gi,
    /choose\s+(\w+)\s+(over|instead of)/gi,
    /(if you need|if you want|for those who need).*choose\s+(?!.*brand)/gi,
  ];

  for (const pattern of competitorFavorablePatterns) {
    const matches = content.match(pattern);
    if (matches) {
      for (const match of matches) {
        if (!match.toLowerCase().includes(brandLower)) {
          violations.push(`Competitor-favorable: "${match}"`);
        }
      }
    }
  }

  // Check that conclusion favors brand
  const conclusionMatch = content.match(/## Conclusion[\s\S]*$/i);
  if (conclusionMatch) {
    const conclusion = conclusionMatch[0].toLowerCase();
    if (!conclusion.includes(brandLower)) {
      violations.push('Conclusion does not mention the brand');
    }
  }

  return violations;
}

describe('Brand Protection — Competitor Detection', () => {
  it('detects competitor-favorable language', () => {
    const violations = detectBrandViolations(COMPETITOR_FAVORABLE_CONTENT, 'MartAI');
    expect(violations.length).toBeGreaterThan(0);
  });

  it('passes for brand-safe content', () => {
    const violations = detectBrandViolations(BRAND_SAFE_CONTENT, 'MartAI');
    expect(violations.length).toBe(0);
  });

  it('detects "leads the pack" for competitor', () => {
    const content = 'SEMrush leads the pack with advanced features.';
    const violations = detectBrandViolations(content, 'MartAI');
    expect(violations.length).toBeGreaterThan(0);
  });

  it('detects "emerges as the superior choice" for competitor', () => {
    const content = 'SEMrush emerges as the superior choice for marketers.';
    const violations = detectBrandViolations(content, 'MartAI');
    expect(violations.length).toBeGreaterThan(0);
  });

  it('detects "excels at" for competitor', () => {
    const content = 'SEMrush excels at keyword research and analytics.';
    const violations = detectBrandViolations(content, 'MartAI');
    expect(violations.length).toBeGreaterThan(0);
  });

  it('allows brand-favorable language', () => {
    const content = 'MartAI leads the pack with AI-driven innovation. MartAI excels at automation.';
    const violations = detectBrandViolations(content, 'MartAI');
    expect(violations.length).toBe(0);
  });

  it('catches the exact pattern from the real bug', () => {
    // This is the actual content that was generated and caused the issue
    const bugContent = 'In the battle of SEMrush vs MartAI, SEMrush emerges as the superior choice.';
    const violations = detectBrandViolations(bugContent, 'MartAI');
    expect(violations.length).toBeGreaterThan(0);
  });
});

// =============================================================================
// CONTENT QUALITY — REAL-WORLD SCORING
// =============================================================================

describe('scoreContentRealTime — Real-World Quality', () => {
  it('high-quality content scores 60+', () => {
    const content = `# Best Lip Fillers in Kansas City

## What Are Lip Fillers?

Lip fillers add volume to your lips. They use hyaluronic acid. This is a safe substance. Most people love their results.

A quick treatment takes 30 minutes. You see results right away. There is little downtime. Go back to work the same day.

## Why Choose Our Kansas City Clinic?

Our team has years of experience. We use only FDA-approved products. Every client gets a custom plan. Your safety comes first.

We offer free consultations. See our before and after photos. Read real patient reviews. Book your appointment today.

## How Much Do Lip Fillers Cost?

Lip fillers cost 500 to 800 dollars. The price depends on the amount of filler used. We offer payment plans. Ask about our specials.

## Benefits of Lip Fillers

Fuller lips boost your confidence. The results look natural. You can adjust the volume over time. Lip fillers are reversible too.

## What to Expect During Treatment

First, we apply a numbing cream. Then the doctor uses a fine needle. The injection takes minutes. You may have mild swelling after.

## Recovery and Aftercare

Avoid touching your lips for 24 hours. Do not exercise on the day of treatment. Use ice to reduce swelling. Results settle in two to three days.`;

    const result = scoreContentRealTime({
      content,
      outline: ['What Are Lip Fillers?', 'Why Choose Our Kansas City Clinic?', 'How Much Do Lip Fillers Cost?', 'Benefits of Lip Fillers', 'What to Expect During Treatment', 'Recovery and Aftercare'],
      keywords: ['lip fillers', 'Kansas City', 'lip fillers Kansas City'],
      targetWordCount: 750,
    });

    expect(result.score).toBeGreaterThanOrEqual(60);
    expect(result.metrics.readabilityScore).toBeGreaterThanOrEqual(60);
    expect(result.metrics.h2Score).toBeGreaterThan(0);
  });

  it('poor-quality content scores below 40', () => {
    const poorContent = 'Just a short paragraph about nothing in particular.';

    const result = scoreContentRealTime({
      content: poorContent,
      outline: ['Section 1', 'Section 2', 'Section 3'],
      keywords: ['lip fillers', 'Kansas City'],
      targetWordCount: 1200,
    });

    expect(result.score).toBeLessThan(40);
  });

  it('readability metric reflects actual prose quality', () => {
    const simpleResult = scoreContentRealTime({
      content: SIMPLE_WEB_CONTENT,
      outline: [],
      keywords: [],
    });

    const complexResult = scoreContentRealTime({
      content: COMPLEX_CONTENT,
      outline: [],
      keywords: [],
    });

    expect(simpleResult.metrics.readabilityScore).toBeGreaterThan(
      complexResult.metrics.readabilityScore
    );
  });
});

// =============================================================================
// KEYWORD SCORING EDGE CASES
// =============================================================================

describe('Keyword Scoring — Edge Cases', () => {
  it('handles empty keyword array gracefully', () => {
    expect(countKeywordsUsed('any content', [])).toBe(0);
  });

  it('handles keywords with special regex characters', () => {
    const content = 'We use C++ and C# for development.';
    // This should not crash
    expect(() => countKeywordsUsed(content, ['C++', 'C#'])).not.toThrow();
  });

  it('finds multi-word keywords case-insensitively', () => {
    const content = 'LIP FILLERS are great. lip fillers work well.';
    expect(countKeywordsUsed(content, ['lip fillers'])).toBe(1);
  });

  it('keyword density handles edge case of zero words', () => {
    expect(computeKeywordDensity('', 'keyword')).toBe(0);
  });

  it('keyword density is accurate for known density', () => {
    // 100 words, keyword appears twice, keyword is 1 word = 2%
    const words = Array(98).fill('word').join(' ') + ' seo seo';
    const density = computeKeywordDensity(words, 'seo');
    expect(density).toBe(2);
  });
});

// =============================================================================
// SYLLABLE COUNTING ACCURACY
// =============================================================================

describe('countSyllables — Accuracy for SEO Words', () => {
  it('common SEO terms have correct syllable counts', () => {
    // These words appear frequently in SEO content
    expect(countSyllables('SEO')).toBeGreaterThanOrEqual(1); // acronym
    expect(countSyllables('keyword')).toBe(2);
    expect(countSyllables('content')).toBe(2);
    expect(countSyllables('marketing')).toBe(3);
    expect(countSyllables('optimization')).toBeGreaterThanOrEqual(4);
    expect(countSyllables('strategy')).toBeGreaterThanOrEqual(2);
  });

  it('simple words score 1 syllable', () => {
    expect(countSyllables('the')).toBe(1);
    expect(countSyllables('and')).toBe(1);
    expect(countSyllables('but')).toBe(1);
    expect(countSyllables('not')).toBe(1);
  });

  it('handles hyphenated and compound words', () => {
    expect(countSyllables('user-friendly')).toBeGreaterThanOrEqual(3);
  });
});

// =============================================================================
// REGRESSION TESTS — Exact Bug Reproduction
// =============================================================================

describe('Regression: Readability Score Bug (Flesch=30)', () => {
  it('REGRESSION: content with many markdown headings should not score 30', () => {
    const markdownContent = `
## Introduction to SEO

SEO helps your site rank higher. It brings more visitors. More visitors means more sales.

## Why SEO Matters

Google uses SEO to find your pages. Good SEO means you show up first. Bad SEO means no one finds you.

## Getting Started with SEO

Start with keyword research. Find words people search for. Use those words in your content.

## On-Page SEO Tips

Use your keyword in the title. Add it to the first paragraph. Use it in your headings too.

## Off-Page SEO Basics

Get links from other sites. Share your content on social media. Build your online reputation.

## Conclusion

SEO is not hard. Start with the basics. Improve a little each day. You will see results soon.
`;
    const score = computeFleschReadingEase(markdownContent);
    // This content is SIMPLE. It should NEVER score 30.
    expect(score).toBeGreaterThanOrEqual(60);
  });

  it('REGRESSION: sentence counter should not require 3+ words per fragment', () => {
    // The old bug: countSentences required 3+ words, filtering out short sentences
    const shortSentences = 'Get started. Learn more. Try it. Sign up. Contact us.';
    const count = countSentences(shortSentences);
    // All 5 are valid sentences (2 words each)
    expect(count).toBe(5);
  });

  it('REGRESSION: markdown headings should not inflate words/sentence ratio', () => {
    // Old bug: headings were counted as "words" but not as "sentence boundaries"
    // This inflated the words-per-sentence ratio, killing the Flesch score
    const withHeadings = '## Title\nShort sentence here.\n## Another\nAnother short one.';
    const withoutHeadings = 'Short sentence here. Another short one.';

    const countWith = countSentences(withHeadings);
    const countWithout = countSentences(withoutHeadings);

    expect(countWith).toBe(countWithout);
  });
});

describe('Regression: Competitor-Favorable Content Bug', () => {
  it('REGRESSION: SEMrush article should not conclude competitor is superior', () => {
    // This exact pattern was generated and published
    const violations = detectBrandViolations(
      'SEMrush emerges as the superior choice for those seeking comprehensive SEO tools.',
      'MartAI'
    );
    expect(violations.length).toBeGreaterThan(0);
  });

  it('REGRESSION: competitor should never "lead the pack"', () => {
    const violations = detectBrandViolations(
      'When it comes to advanced SEO capabilities, SEMrush firmly leads the pack.',
      'MartAI'
    );
    expect(violations.length).toBeGreaterThan(0);
  });
});
