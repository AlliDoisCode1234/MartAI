/**
 * Insights Data Transforms — Test Suite
 *
 * Tests all pure data transform functions used by the Insights page.
 * No framework dependencies — runs entirely in vitest.
 */

import { describe, it, expect, vi } from 'vitest';
import {
  aggregatePipeline,
  getTopPerforming,
  getUnderperforming,
  calculateOptimizationHealth,
  generateGrowthActions,
  calculateContentContribution,
  calculateAvgSeoScore,
  estimateTrend,
  isQuickWin,
  truncate,
} from './insightsTransforms';
import type { ContentPieceForInsights } from './insightsTransforms';

// ============================================================================
// Test Fixtures
// ============================================================================

function makePiece(overrides: Partial<ContentPieceForInsights> = {}): ContentPieceForInsights {
  return {
    title: 'Test Article',
    status: 'published',
    seoScore: 75,
    wordCount: 1500,
    keywords: ['test', 'article'],
    contentType: 'blog',
    h2Outline: ['Section 1', 'Section 2'],
    updatedAt: Date.now(),
    ...overrides,
  };
}

const FIXTURE_PIECES: ContentPieceForInsights[] = [
  makePiece({
    title: 'Best SEO Guide',
    seoScore: 92,
    status: 'published',
    wordCount: 2500,
    keywords: ['seo', 'guide'],
  }),
  makePiece({
    title: 'How to Rank',
    seoScore: 85,
    status: 'published',
    wordCount: 2000,
    keywords: ['rank'],
  }),
  makePiece({
    title: 'Content Tips',
    seoScore: 70,
    status: 'approved',
    wordCount: 1200,
    keywords: ['tips'],
  }),
  makePiece({ title: 'Draft Post', seoScore: 45, status: 'draft', wordCount: 800, keywords: [] }),
  makePiece({ title: 'Generating...', seoScore: undefined, status: 'generating', wordCount: 0 }),
  makePiece({
    title: 'Scheduled Post',
    seoScore: 78,
    status: 'scheduled',
    wordCount: 1800,
    keywords: ['scheduled'],
  }),
  makePiece({ title: 'Low Scorer', seoScore: 35, status: 'published', wordCount: 400 }),
  makePiece({
    title: 'Quick Win',
    seoScore: 55,
    status: 'published',
    wordCount: 1100,
    keywords: ['quick', 'win'],
  }),
];

// ============================================================================
// Pipeline Aggregation
// ============================================================================

describe('aggregatePipeline', () => {
  it('counts all statuses correctly', () => {
    const result = aggregatePipeline(FIXTURE_PIECES);
    expect(result.total).toBe(8);
    expect(result.published).toBe(4);
    expect(result.approved).toBe(1);
    expect(result.drafts).toBe(1);
    expect(result.scheduled).toBe(1);
    expect(result.generating).toBe(1);
  });

  it('handles empty array', () => {
    const result = aggregatePipeline([]);
    expect(result.total).toBe(0);
    expect(result.published).toBe(0);
    expect(result.approved).toBe(0);
    expect(result.drafts).toBe(0);
  });

  it('handles single piece', () => {
    const result = aggregatePipeline([makePiece({ status: 'published' })]);
    expect(result.total).toBe(1);
    expect(result.published).toBe(1);
    expect(result.drafts).toBe(0);
  });

  it('handles all same status', () => {
    const pieces = Array.from({ length: 5 }, () => makePiece({ status: 'draft' }));
    const result = aggregatePipeline(pieces);
    expect(result.drafts).toBe(5);
    expect(result.published).toBe(0);
  });
});

// ============================================================================
// Article Ranking
// ============================================================================

describe('getTopPerforming', () => {
  it('returns articles sorted by SEO score descending', () => {
    const result = getTopPerforming(FIXTURE_PIECES);
    expect(result.length).toBeLessThanOrEqual(5);
    expect(result[0].title).toBe('Best SEO Guide');
    expect(result[0].seoScore).toBe(92);
    expect(result[1].title).toBe('How to Rank');
    expect(result[1].seoScore).toBe(85);
  });

  it('assigns correct rank numbers (1-indexed)', () => {
    const result = getTopPerforming(FIXTURE_PIECES);
    result.forEach((article, idx) => {
      expect(article.rank).toBe(idx + 1);
    });
  });

  it('respects limit parameter', () => {
    const result = getTopPerforming(FIXTURE_PIECES, 3);
    expect(result.length).toBe(3);
  });

  it('excludes pieces with no SEO score', () => {
    const result = getTopPerforming(FIXTURE_PIECES);
    expect(result.every((a) => a.seoScore > 0)).toBe(true);
  });

  it('handles empty array', () => {
    expect(getTopPerforming([])).toEqual([]);
  });

  it('handles all pieces with undefined seoScore', () => {
    const pieces = [makePiece({ seoScore: undefined }), makePiece({ seoScore: undefined })];
    expect(getTopPerforming(pieces)).toEqual([]);
  });

  it('includes keyword count from keywords array', () => {
    const result = getTopPerforming(FIXTURE_PIECES);
    expect(result[0].keywordCount).toBe(2); // 'seo', 'guide'
  });
});

describe('getUnderperforming', () => {
  it('returns articles with low scores sorted ascending', () => {
    const result = getUnderperforming(FIXTURE_PIECES);
    expect(result.length).toBeLessThanOrEqual(3);
    // Low Scorer (35) should be first, then Draft Post (45)
    expect(result[0].seoScore).toBeLessThanOrEqual(result[result.length - 1].seoScore);
  });

  it('excludes generating content', () => {
    const result = getUnderperforming(FIXTURE_PIECES);
    expect(result.every((a) => a.title !== 'Generating...')).toBe(true);
  });

  it('identifies quick wins correctly', () => {
    const result = getUnderperforming(FIXTURE_PIECES);
    const quickWinArticle = result.find((a) => a.title === 'Quick Win');
    if (quickWinArticle) {
      expect(quickWinArticle.quickWin).toBe(true);
    }
  });

  it('handles empty array', () => {
    expect(getUnderperforming([])).toEqual([]);
  });

  it('handles all high-scoring pieces (no underperformers)', () => {
    const highScorers = [makePiece({ seoScore: 90 }), makePiece({ seoScore: 85 })];
    expect(getUnderperforming(highScorers)).toEqual([]);
  });
});

// ============================================================================
// Optimization Health
// ============================================================================

describe('calculateOptimizationHealth', () => {
  it('calculates correct average on-page score', () => {
    const result = calculateOptimizationHealth(FIXTURE_PIECES);
    const scored = FIXTURE_PIECES.filter((p) => p.seoScore && p.seoScore > 0);
    const expectedAvg = Math.round(
      scored.reduce((sum, p) => sum + (p.seoScore ?? 0), 0) / scored.length
    );
    expect(result.onPageScore).toBe(expectedAvg);
  });

  it('returns all zeros for empty data', () => {
    const result = calculateOptimizationHealth([]);
    expect(result.onPageScore).toBe(0);
    expect(result.internalLinkingScore).toBe(0);
    expect(result.clusterCoverage).toBe(0);
  });

  it('calculates cluster coverage from keyword presence', () => {
    const pieces = [
      makePiece({ keywords: ['k1'], seoScore: 80 }),
      makePiece({ keywords: [], seoScore: 70 }),
      makePiece({ keywords: ['k1', 'k2'], seoScore: 60 }),
    ];
    const result = calculateOptimizationHealth(pieces);
    // 2 out of 3 have keywords
    expect(result.clusterCoverage).toBe(67);
  });

  it('returns valid totalReworksBunch format', () => {
    const result = calculateOptimizationHealth(FIXTURE_PIECES);
    expect(result.totalReworksBunch).toMatch(/^\d+\/\d+$/);
  });
});

// ============================================================================
// Growth Actions
// ============================================================================

describe('generateGrowthActions', () => {
  it('returns at most 3 actions', () => {
    const pipeline = aggregatePipeline(FIXTURE_PIECES);
    const result = generateGrowthActions(FIXTURE_PIECES, pipeline);
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it('each action has required fields', () => {
    const pipeline = aggregatePipeline(FIXTURE_PIECES);
    const result = generateGrowthActions(FIXTURE_PIECES, pipeline);
    result.forEach((action) => {
      expect(action.title).toBeTruthy();
      expect(action.description).toBeTruthy();
      expect(action.color).toBeTruthy();
    });
  });

  it('prioritizes refresh action for low-scoring content', () => {
    const lowPieces = [makePiece({ seoScore: 30, title: 'Bad Article' })];
    const pipeline = aggregatePipeline(lowPieces);
    const result = generateGrowthActions(lowPieces, pipeline);
    expect(result[0].title).toContain('Refresh');
  });

  it('includes publish action when approved content exists', () => {
    const pieces = [
      makePiece({ status: 'approved', seoScore: 80 }),
      makePiece({ status: 'approved', seoScore: 75 }),
    ];
    const pipeline = aggregatePipeline(pieces);
    const result = generateGrowthActions(pieces, pipeline);
    const publishAction = result.find((a) => a.title.includes('Publish'));
    expect(publishAction).toBeDefined();
  });

  it('handles empty content gracefully', () => {
    const pipeline = aggregatePipeline([]);
    const result = generateGrowthActions([], pipeline);
    // Should suggest creating content
    expect(result.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// Content Contribution
// ============================================================================

describe('calculateContentContribution', () => {
  it('calculates correct percentage', () => {
    const pipeline = {
      total: 10,
      published: 5,
      drafts: 3,
      approved: 2,
      scheduled: 0,
      generating: 0,
    };
    expect(calculateContentContribution(pipeline)).toBe(50);
  });

  it('returns 0 for empty pipeline', () => {
    const pipeline = {
      total: 0,
      published: 0,
      drafts: 0,
      approved: 0,
      scheduled: 0,
      generating: 0,
    };
    expect(calculateContentContribution(pipeline)).toBe(0);
  });

  it('returns 100 when all content is published', () => {
    const pipeline = {
      total: 5,
      published: 5,
      drafts: 0,
      approved: 0,
      scheduled: 0,
      generating: 0,
    };
    expect(calculateContentContribution(pipeline)).toBe(100);
  });
});

// ============================================================================
// Average SEO Score
// ============================================================================

describe('calculateAvgSeoScore', () => {
  it('calculates correct average', () => {
    const pieces = [makePiece({ seoScore: 80 }), makePiece({ seoScore: 60 })];
    expect(calculateAvgSeoScore(pieces)).toBe(70);
  });

  it('excludes pieces with no score', () => {
    const pieces = [makePiece({ seoScore: 80 }), makePiece({ seoScore: undefined })];
    expect(calculateAvgSeoScore(pieces)).toBe(80);
  });

  it('returns 0 for empty array', () => {
    expect(calculateAvgSeoScore([])).toBe(0);
  });

  it('rounds to nearest integer', () => {
    const pieces = [makePiece({ seoScore: 33 }), makePiece({ seoScore: 34 })];
    expect(calculateAvgSeoScore(pieces)).toBe(34); // 33.5 rounds to 34
  });
});

// ============================================================================
// Helper Functions
// ============================================================================

describe('isQuickWin', () => {
  it('returns true for scores 50-69', () => {
    expect(isQuickWin(makePiece({ seoScore: 50 }))).toBe(true);
    expect(isQuickWin(makePiece({ seoScore: 65 }))).toBe(true);
    expect(isQuickWin(makePiece({ seoScore: 69 }))).toBe(true);
  });

  it('returns false for high scores', () => {
    expect(isQuickWin(makePiece({ seoScore: 70 }))).toBe(false);
    expect(isQuickWin(makePiece({ seoScore: 90 }))).toBe(false);
  });

  it('returns false for very low scores', () => {
    expect(isQuickWin(makePiece({ seoScore: 20 }))).toBe(false);
    expect(isQuickWin(makePiece({ seoScore: 49 }))).toBe(false);
  });

  it('returns false for undefined score', () => {
    expect(isQuickWin(makePiece({ seoScore: undefined }))).toBe(false);
  });
});

describe('truncate', () => {
  it('returns original string if within max length', () => {
    expect(truncate('Hello', 10)).toBe('Hello');
  });

  it('truncates with ellipsis at max length', () => {
    expect(truncate('Hello World', 8)).toBe('Hello W\u2026');
  });

  it('handles exact length', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
  });

  it('handles empty string', () => {
    expect(truncate('', 5)).toBe('');
  });

  it('handles max length of 1', () => {
    expect(truncate('Hello', 1)).toBe('\u2026');
  });
});

describe('estimateTrend', () => {
  it('returns a positive trend for recently updated pieces', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const recent = makePiece({ updatedAt: Date.now() - 1000 * 60 * 60 }); // 1 hour ago
    const trend = estimateTrend(recent);
    expect(trend).toBeGreaterThan(0);
    vi.restoreAllMocks();
  });

  it('returns a negative trend for stale pieces', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const stale = makePiece({ updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 60 }); // 60 days ago
    const trend = estimateTrend(stale);
    expect(trend).toBeLessThanOrEqual(0);
    vi.restoreAllMocks();
  });

  it('returns a number for moderately fresh pieces', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const moderate = makePiece({ updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 15 }); // 15 days ago
    const trend = estimateTrend(moderate);
    expect(typeof trend).toBe('number');
    vi.restoreAllMocks();
  });
});
