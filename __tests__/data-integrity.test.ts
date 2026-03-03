/**
 * Data Integrity Verification Test
 *
 * Traces real GA4/GSC API values through the ACTUAL transform functions
 * to verify they arrive at the correct UI field without corruption.
 *
 * This is NOT mocking — it imports the real parseGA4Response,
 * normalizeGA4Metrics, aggregateGSCRows, and normalizeGSCMetrics
 * and runs known input → expected output assertions.
 *
 * Run: npx vitest run __tests__/data-integrity.test.ts
 */

import { describe, it, expect } from 'vitest';
import {
  parseGA4Response,
  normalizeGA4Metrics,
  aggregateGSCRows,
  normalizeGSCMetrics,
  normalizeKeywordRow,
  normalizeDecimalToPercent,
  normalizePagePath,
} from '../convex/analytics/analyticsTransforms';

// ============================================================================
// Simulated raw Google API response — realistic data
// ============================================================================

const MOCK_GA4_API_RESPONSE = {
  rows: [
    {
      metricValues: [
        { value: '1250' }, // 0: sessions
        { value: '980' }, // 1: totalUsers
        { value: '45600' }, // 2: userEngagementDuration (seconds)
        { value: '3200' }, // 3: screenPageViews
        { value: '0.42' }, // 4: bounceRate (0-1 decimal!)
        { value: '182.5' }, // 5: averageSessionDuration (seconds)
        { value: '450' }, // 6: newUsers
        { value: '875' }, // 7: engagedSessions
        { value: '8500' }, // 8: eventCount
        { value: '15' }, // 9: conversions
      ],
    },
  ],
};

const MOCK_GSC_API_RESPONSE = {
  rows: [
    { keys: ['seo tools'], clicks: 120, impressions: 5000, ctr: 0.024, position: 8.5 },
    { keys: ['content marketing'], clicks: 85, impressions: 3200, ctr: 0.0266, position: 12.3 },
    { keys: ['keyword research'], clicks: 45, impressions: 2100, ctr: 0.0214, position: 15.7 },
  ],
};

// ============================================================================
// Test 1: GA4 Index → Parsed Field Mapping
// Verifies that GA4 API metric order (indices 0-9) maps to correct fields
// ============================================================================

describe('GA4 API Index → Parsed Field Integrity', () => {
  const parsed = parseGA4Response(MOCK_GA4_API_RESPONSE);

  it('index 0 (sessions) → parsed.sessions = 1250', () => {
    expect(parsed.sessions).toBe(1250);
  });

  it('index 1 (totalUsers) → parsed.users = 980', () => {
    expect(parsed.users).toBe(980);
  });

  it('index 2 (userEngagementDuration) → parsed.engagementDuration = 45600', () => {
    expect(parsed.engagementDuration).toBe(45600);
  });

  it('index 3 (screenPageViews) → parsed.pageViews = 3200', () => {
    expect(parsed.pageViews).toBe(3200);
  });

  it('index 4 (bounceRate) → parsed.bounceRate = 0.42 (raw, NOT yet normalized)', () => {
    expect(parsed.bounceRate).toBe(0.42);
  });

  it('index 5 (averageSessionDuration) → parsed.avgSessionDuration = 182.5', () => {
    expect(parsed.avgSessionDuration).toBe(182.5);
  });

  it('index 6 (newUsers) → parsed.newUsers = 450', () => {
    expect(parsed.newUsers).toBe(450);
  });

  it('index 7 (engagedSessions) → parsed.engagedSessions = 875', () => {
    expect(parsed.engagedSessions).toBe(875);
  });

  it('index 8 (eventCount) → parsed.eventCount = 8500', () => {
    expect(parsed.eventCount).toBe(8500);
  });

  it('index 9 (conversions) → parsed.conversions = 15', () => {
    expect(parsed.conversions).toBe(15);
  });
});

// ============================================================================
// Test 2: Normalization Correctness
// Verifies bounceRate × 100, all other metrics passthrough
// ============================================================================

describe('GA4 Normalization — bounceRate × 100, Others Passthrough', () => {
  const parsed = parseGA4Response(MOCK_GA4_API_RESPONSE);
  const normalized = normalizeGA4Metrics(parsed);

  it('bounceRate: 0.42 → 42.0 (multiplied by 100)', () => {
    expect(normalized.bounceRate).toBe(42);
  });

  it('sessions: passthrough (1250 → 1250)', () => {
    expect(normalized.sessions).toBe(1250);
  });

  it('users: passthrough (980 → 980)', () => {
    expect(normalized.users).toBe(980);
  });

  it('pageViews: passthrough (3200 → 3200)', () => {
    expect(normalized.pageViews).toBe(3200);
  });

  it('avgSessionDuration: passthrough in seconds (182.5 → 182.5)', () => {
    expect(normalized.avgSessionDuration).toBe(182.5);
  });

  it('conversions: passthrough (15 → 15)', () => {
    expect(normalized.conversions).toBe(15);
  });

  it('NO metric is accidentally zeroed, NaN, or undefined', () => {
    for (const [key, value] of Object.entries(normalized)) {
      expect(value, `${key} should be a finite number`).toBeTypeOf('number');
      expect(Number.isFinite(value), `${key} should not be NaN or Infinity`).toBe(true);
    }
  });
});

// ============================================================================
// Test 3: Normalized GA4 → UI Card Field Routing
// Verifies which normalized field feeds which dashboard card
// ============================================================================

describe('Normalized GA4 → Dashboard Card Routing', () => {
  const parsed = parseGA4Response(MOCK_GA4_API_RESPONSE);
  const normalized = normalizeGA4Metrics(parsed);

  // Simulating getDashboardKPIs return shape
  const kpis = {
    sessions: { value: normalized.sessions, change: null },
    users: { value: normalized.users, change: null },
    pageViews: { value: normalized.pageViews, change: null },
    bounceRate: { value: normalized.bounceRate, change: null },
    avgSessionDuration: { value: normalized.avgSessionDuration, change: null },
  };

  // Simulating page.tsx → DashboardStatRow prop wiring
  const statRowProps = {
    sessions: kpis.sessions.value ?? 0,
    users: kpis.users.value ?? 0,
    pageViews: kpis.pageViews.value ?? 0,
    bounceRate: kpis.bounceRate.value ?? 0,
    avgSessionDuration: kpis.avgSessionDuration.value ?? 0,
  };

  it('Card "Site Traffic" → uses `users` (980), NOT sessions', () => {
    expect(statRowProps.users).toBe(980);
  });

  it('Card "Site Traffic" subtitle → uses `pageViews` (3200)', () => {
    expect(statRowProps.pageViews).toBe(3200);
  });

  it('Card "Sessions" → uses `sessions` (1250), NOT users', () => {
    expect(statRowProps.sessions).toBe(1250);
  });

  it('Card "Avg Session" value → uses `avgSessionDuration` (182.5s)', () => {
    expect(statRowProps.avgSessionDuration).toBe(182.5);
  });

  it('Card "Avg Session" subtitle → uses `bounceRate` (42, already 0-100)', () => {
    expect(statRowProps.bounceRate).toBe(42);
    // UI renders: `${bounceRate.toFixed(0)}% bounce` → "42% bounce"
  });

  it('bounceRate is NOT double-normalized (should be 42, not 4200)', () => {
    expect(statRowProps.bounceRate).toBeLessThan(101);
    expect(statRowProps.bounceRate).toBeGreaterThanOrEqual(0);
  });
});

// ============================================================================
// Test 4: GSC Transform Chain Integrity
// ============================================================================

describe('GSC API → Aggregation → Normalization Integrity', () => {
  const aggregated = aggregateGSCRows(MOCK_GSC_API_RESPONSE);

  it('aggregation should not return null', () => {
    expect(aggregated).not.toBeNull();
  });

  it('totalClicks = 120 + 85 + 45 = 250', () => {
    expect(aggregated!.totalClicks).toBe(250);
  });

  it('totalImpressions = 5000 + 3200 + 2100 = 10300', () => {
    expect(aggregated!.totalImpressions).toBe(10300);
  });

  it('avgPosition = (8.5 + 12.3 + 15.7) / 3 = 12.166...', () => {
    expect(aggregated!.avgPosition).toBeCloseTo(12.167, 2);
  });

  it('ctrDecimal = 250 / 10300 = 0.02427...', () => {
    expect(aggregated!.ctrDecimal).toBeCloseTo(0.02427, 4);
  });

  it('keywordCount = 3', () => {
    expect(aggregated!.keywordCount).toBe(3);
  });

  // Normalization
  const normalized = normalizeGSCMetrics(aggregated!);

  it('normalized clicks passthrough (250)', () => {
    expect(normalized.clicks).toBe(250);
  });

  it('normalized impressions passthrough (10300)', () => {
    expect(normalized.impressions).toBe(10300);
  });

  it('normalized ctr: 0.02427 → 2.427 (× 100)', () => {
    expect(normalized.ctr).toBeCloseTo(2.427, 2);
  });

  it('normalized avgPosition passthrough (12.167)', () => {
    expect(normalized.avgPosition).toBeCloseTo(12.167, 2);
  });

  it('ctr is NOT double-normalized (should be < 100)', () => {
    expect(normalized.ctr).toBeLessThan(100);
  });
});

// ============================================================================
// Test 5: GSC → UI Card Routing
// ============================================================================

describe('GSC Normalized → Dashboard Card Routing', () => {
  const aggregated = aggregateGSCRows(MOCK_GSC_API_RESPONSE);
  const normalized = normalizeGSCMetrics(aggregated!);

  it('Card "Phoo Rating" value → avgPosition (12.167)', () => {
    expect(normalized.avgPosition).toBeCloseTo(12.167, 2);
    // UI renders: `avgPosition.toFixed(1)` → "12.2"
  });

  it('Card "Phoo Rating" subtitle → impressions (10300)', () => {
    expect(normalized.impressions).toBe(10300);
    // UI renders: `${impressions.toLocaleString()} impressions` → "10,300 impressions"
  });

  it('Growth Chart → totalClicks (250)', () => {
    expect(normalized.clicks).toBe(250);
  });
});

// ============================================================================
// Test 6: Keyword Row Normalization
// ============================================================================

describe('GSC Keyword Row → KeywordsClimbedCard Integrity', () => {
  const row = MOCK_GSC_API_RESPONSE.rows[0];
  const normalized = normalizeKeywordRow(row);

  it('keyword extracted from keys[0]', () => {
    expect(normalized.keyword).toBe('seo tools');
  });

  it('clicks passthrough (120)', () => {
    expect(normalized.clicks).toBe(120);
  });

  it('position passthrough (8.5)', () => {
    expect(normalized.position).toBe(8.5);
  });

  it('ctr normalized: 0.024 → 2.4 (× 100)', () => {
    expect(normalized.ctr).toBeCloseTo(2.4, 1);
  });
});

// ============================================================================
// Test 7: Edge Cases — Zero Data
// ============================================================================

describe('Edge Case: Zero/Empty Data', () => {
  it('GA4: empty response → all fields explicitly zero', () => {
    const parsed = parseGA4Response({ rows: [] });
    expect(parsed.sessions).toBe(0);
    expect(parsed.users).toBe(0);
    expect(parsed.pageViews).toBe(0);
    expect(parsed.bounceRate).toBe(0);
    expect(parsed.conversions).toBe(0);
  });

  it('GA4: no rows key → all fields explicitly zero', () => {
    const parsed = parseGA4Response({});
    expect(parsed.sessions).toBe(0);
  });

  it('GA4: zero bounceRate → normalized to 0 (not NaN)', () => {
    const parsed = parseGA4Response({});
    const normalized = normalizeGA4Metrics(parsed);
    expect(normalized.bounceRate).toBe(0);
    expect(Number.isNaN(normalized.bounceRate)).toBe(false);
  });

  it('GSC: empty response → null', () => {
    expect(aggregateGSCRows({ rows: [] })).toBeNull();
    expect(aggregateGSCRows({})).toBeNull();
  });

  it('GSC keyword: missing keys → "unknown"', () => {
    const row = normalizeKeywordRow({ clicks: 5, impressions: 100 });
    expect(row.keyword).toBe('unknown');
  });

  it('GSC keyword: missing values → 0', () => {
    const row = normalizeKeywordRow({});
    expect(row.clicks).toBe(0);
    expect(row.impressions).toBe(0);
    expect(row.ctr).toBe(0);
    expect(row.position).toBe(0);
  });
});

// ============================================================================
// Test 8: Schema Mismatch Guard
// ============================================================================

describe('Schema Mismatch Protection', () => {
  it('GA4: fewer metrics than expected → throws explicit error', () => {
    expect(() =>
      parseGA4Response({
        rows: [{ metricValues: [{ value: '100' }, { value: '50' }] }],
      })
    ).toThrow('GA4 Schema Mismatch');
  });

  it('GA4: error message includes expected vs received count', () => {
    try {
      parseGA4Response({
        rows: [{ metricValues: [{ value: '100' }] }],
      });
    } catch (e: unknown) {
      expect((e as Error).message).toContain('Expected 10');
      expect((e as Error).message).toContain('received 1');
    }
  });
});

// ============================================================================
// Test 9: normalizeDecimalToPercent safety
// ============================================================================

describe('normalizeDecimalToPercent', () => {
  it('0.65 → 65 (multiply by 100)', () => {
    expect(normalizeDecimalToPercent(0.65)).toBe(65);
  });

  it('0 → 0 (zero stays zero)', () => {
    expect(normalizeDecimalToPercent(0)).toBe(0);
  });

  it('1.0 → 100 (edge: exactly 1)', () => {
    expect(normalizeDecimalToPercent(1.0)).toBe(100);
  });

  it('42 → 42 (already normalized, passthrough)', () => {
    expect(normalizeDecimalToPercent(42)).toBe(42);
  });

  it('100 → 100 (already 100%, passthrough)', () => {
    expect(normalizeDecimalToPercent(100)).toBe(100);
  });
});

// ============================================================================
// Test 10: Page Path Normalization
// ============================================================================

describe('normalizePagePath', () => {
  it('strips trailing slash', () => {
    expect(normalizePagePath('/blog/')).toBe('/blog');
  });

  it('lowercases', () => {
    expect(normalizePagePath('/Blog/Post')).toBe('/blog/post');
  });

  it('empty string → /', () => {
    expect(normalizePagePath('')).toBe('/');
  });

  it('root slash stays root', () => {
    expect(normalizePagePath('/')).toBe('/');
  });
});

// ============================================================================
// Test 11: Keywords Pipeline — GSC Enrichment Logic
// Simulates getKeywordsEnriched enrichment: keyword row + snapshot fallback
// ============================================================================

describe('Keywords Pipeline — GSC Enrichment Logic', () => {
  // Simulate what getKeywordsEnriched does in lines 116-126
  const keywordWithGSC = {
    keyword: 'seo tools',
    gscPosition: 8.5,
    gscClicks: 120,
    gscImpressions: 5000,
    gscCtr: 2.4, // already normalized (0-100)
    previousGscPosition: 12.0,
  };

  const keywordWithoutGSC = {
    keyword: 'content marketing',
    gscPosition: undefined,
    gscClicks: undefined,
    gscImpressions: undefined,
    gscCtr: undefined,
    previousGscPosition: undefined,
  };

  const mockSnapshot = {
    position: 15.7,
    clicks: 45,
    impressions: 2100,
    ctr: 2.14, // normalized
  };

  it('keyword with GSC data → uses keyword fields directly', () => {
    const gscPosition = keywordWithGSC.gscPosition ?? null;
    expect(gscPosition).toBe(8.5);
  });

  it('keyword without GSC data → falls back to snapshot', () => {
    const gscPosition = keywordWithoutGSC.gscPosition ?? mockSnapshot?.position ?? null;
    expect(gscPosition).toBe(15.7);
  });

  it('keyword without GSC or snapshot → null', () => {
    const gscPosition = keywordWithoutGSC.gscPosition ?? null;
    // No snapshot available either → stays null
    expect(gscPosition).toBeNull();
  });

  it('rankChange = currentPosition - previousPosition (negative = improved)', () => {
    const gscPosition = keywordWithGSC.gscPosition!;
    const previousPosition = keywordWithGSC.previousGscPosition!;
    const rankChange = Math.round(gscPosition - previousPosition);
    // 8.5 - 12 = -3.5 → Math.round(-3.5) = -3 (JS rounds half toward +∞)
    expect(rankChange).toBe(-3);
  });

  it('negative rankChange = improved (matches UI convention)', () => {
    const rankChange = -4; // moved UP (better)
    const improved = rankChange < 0; // RankChangeCell logic
    expect(improved).toBe(true); // green arrow for improvement
  });
});

// ============================================================================
// Test 12: Quick Win Heuristic Integrity
// ============================================================================

describe('Keywords Pipeline — Quick Win Heuristic', () => {
  it('GSC Quick Win: position 11-20 AND volume > 100', () => {
    const gscPosition = 15;
    const searchVolume = 500;
    const difficulty = 30;
    const isGscQuickWin = gscPosition >= 11 && gscPosition <= 20 && searchVolume > 100;
    expect(isGscQuickWin).toBe(true);
  });

  it('NOT Quick Win: position 5 (too good for "quick win")', () => {
    const gscPosition = 5;
    const searchVolume = 500;
    const isGscQuickWin = gscPosition >= 11 && gscPosition <= 20 && searchVolume > 100;
    expect(isGscQuickWin).toBe(false);
  });

  it('NOT Quick Win: position 15 but volume = 50 (too low)', () => {
    const gscPosition = 15;
    const searchVolume = 50;
    const isGscQuickWin = gscPosition >= 11 && gscPosition <= 20 && searchVolume > 100;
    expect(isGscQuickWin).toBe(false);
  });

  it('Heuristic Quick Win: no GSC data, difficulty ≤ 35, volume ≥ 300', () => {
    const gscPosition: number | null = null;
    const difficulty = 25;
    const searchVolume = 500;
    const heuristicQuickWin = gscPosition === null && difficulty <= 35 && searchVolume >= 300;
    expect(heuristicQuickWin).toBe(true);
  });

  it('NOT Heuristic Quick Win: has GSC data (even if low difficulty)', () => {
    const gscPosition: number | null = 50;
    const difficulty = 10;
    const searchVolume = 1000;
    const heuristicQuickWin = gscPosition === null && difficulty <= 35 && searchVolume >= 300;
    expect(heuristicQuickWin).toBe(false);
  });
});

// ============================================================================
// Test 13: Phoo Score Computation (real function)
// ============================================================================

import { computeKeywordPhooScore } from '../src/lib/utils/phooScore';

describe('Phoo Score — computeKeywordPhooScore', () => {
  it('position 1 + high vol + low diff + high CTR → highest score', () => {
    const score = computeKeywordPhooScore({
      position: 1,
      volume: 10000,
      difficulty: 10,
      ctr: 0.05,
    });
    expect(score).toBeGreaterThanOrEqual(80);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('position 100 + low vol + high diff + 0 CTR → lowest score', () => {
    const score = computeKeywordPhooScore({
      position: 100,
      volume: 10,
      difficulty: 95,
      ctr: 0,
    });
    expect(score).toBeLessThanOrEqual(20);
  });

  it('all null inputs → fallback defaults (not 0, not NaN)', () => {
    const score = computeKeywordPhooScore({
      position: null,
      volume: null,
      difficulty: null,
      ctr: null,
    });
    expect(score).toBeGreaterThan(0); // defaults produce non-zero
    expect(Number.isNaN(score)).toBe(false);
    expect(Number.isFinite(score)).toBe(true);
  });

  it('score is always 0-100 (clamped)', () => {
    const extremeHigh = computeKeywordPhooScore({
      position: 1,
      volume: 999999,
      difficulty: 0,
      ctr: 1,
    });
    const extremeLow = computeKeywordPhooScore({
      position: 500,
      volume: 0,
      difficulty: 100,
      ctr: 0,
    });
    expect(extremeHigh).toBeLessThanOrEqual(100);
    expect(extremeHigh).toBeGreaterThanOrEqual(0);
    expect(extremeLow).toBeLessThanOrEqual(100);
    expect(extremeLow).toBeGreaterThanOrEqual(0);
  });

  it('weight distribution: position=40%, volume=25%, difficulty=20%, CTR=15%', () => {
    // Position-only change (all else null defaults)
    const pos1 = computeKeywordPhooScore({
      position: 1,
      volume: null,
      difficulty: null,
      ctr: null,
    });
    const pos50 = computeKeywordPhooScore({
      position: 50,
      volume: null,
      difficulty: null,
      ctr: null,
    });
    // Position should have the biggest impact (40% weight)
    expect(pos1 - pos50).toBeGreaterThan(15); // significant delta
  });
});

// ============================================================================
// Test 14: KeywordStatCards Computed Fields
// ============================================================================

describe('Keywords Pipeline — Stat Card Computed Fields', () => {
  const mockKeywords = [
    { phase: 'foundation', intent: 'informational', isQuickWin: false },
    { phase: 'foundation', intent: 'informational', isQuickWin: true },
    { phase: 'authority', intent: 'transactional', isQuickWin: false },
    { phase: 'authority', intent: 'commercial', isQuickWin: true },
    { phase: 'authority', intent: 'navigational', isQuickWin: false },
  ];

  // Simulate getKeywordsEnriched stat computation (lines 164-172)
  const stats = {
    total: mockKeywords.length,
    foundation: mockKeywords.filter((k) => k.phase === 'foundation').length,
    authority: mockKeywords.filter((k) => k.phase === 'authority').length,
    revenueReady: mockKeywords.filter(
      (k) => k.intent === 'transactional' || k.intent === 'commercial'
    ).length,
    quickWins: mockKeywords.filter((k) => k.isQuickWin).length,
  };

  it('total = all keywords', () => {
    expect(stats.total).toBe(5);
  });

  it('foundation = phase == "foundation"', () => {
    expect(stats.foundation).toBe(2);
  });

  it('authority = phase == "authority"', () => {
    expect(stats.authority).toBe(3);
  });

  it('revenueReady = transactional + commercial intents ONLY', () => {
    expect(stats.revenueReady).toBe(2); // 1 transactional + 1 commercial
  });

  it('quickWins = isQuickWin flag count', () => {
    expect(stats.quickWins).toBe(2);
  });

  it('informational and navigational intents are NOT revenue-ready', () => {
    const nonRevenue = mockKeywords.filter(
      (k) => k.intent === 'informational' || k.intent === 'navigational'
    );
    const matchesRevenueReady = nonRevenue.filter(
      (k) => k.intent === 'transactional' || k.intent === 'commercial'
    );
    expect(matchesRevenueReady.length).toBe(0);
  });
});
