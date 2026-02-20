/**
 * Analytics Transforms — Unit Tests
 *
 * Tests the pure transform layer that sits between Google's raw API responses
 * and our Convex storage. Every test verifies that:
 *
 * 1. Direct metrics pass through without transformation
 * 2. bounceRate is normalized from 0-1 decimal → 0-100 percentage
 * 3. CTR is normalized from 0-1 decimal → 0-100 percentage
 * 4. No metrics are fabricated (no leads, no revenue)
 * 5. Edge cases (empty data, zero divisions) are handled gracefully
 *
 * Component Hierarchy: convex/analytics/analyticsTransforms.test.ts (test — no parent)
 */

import { describe, it, expect } from 'vitest';
import {
  parseGA4Response,
  normalizeGA4Metrics,
  aggregateGSCRows,
  normalizeGSCMetrics,
  normalizeKeywordRow,
} from './analyticsTransforms';
import type {
  RawGA4Response,
  RawGSCResponse,
  ParsedGA4Metrics,
  AggregatedGSCMetrics,
} from './analyticsTransforms';

// ─── Fixtures ────────────────────────────────────────────────────────────────────

/** Realistic GA4 API response for a small business site */
const FIXTURE_GA4_RESPONSE: RawGA4Response = {
  rows: [
    {
      metricValues: [
        { value: '1234' }, // sessions
        { value: '987' }, // totalUsers
        { value: '45678' }, // userEngagementDuration (seconds)
        { value: '3456' }, // screenPageViews
        { value: '0.6523' }, // bounceRate (0-1 decimal from Google)
        { value: '123.45' }, // averageSessionDuration (seconds)
        { value: '456' }, // newUsers
        { value: '789' }, // engagedSessions
        { value: '5678' }, // eventCount
        { value: '12' }, // conversions
      ],
    },
  ],
};

/** Realistic GSC API response with keyword-level data */
const FIXTURE_GSC_RESPONSE: RawGSCResponse = {
  rows: [
    {
      keys: ['best coffee shop near me'],
      clicks: 150,
      impressions: 3000,
      ctr: 0.05, // 5% as decimal from Google
      position: 3.2,
    },
    {
      keys: ['artisan coffee downtown'],
      clicks: 80,
      impressions: 2000,
      ctr: 0.04, // 4% as decimal from Google
      position: 7.5,
    },
    {
      keys: ['organic coffee beans'],
      clicks: 20,
      impressions: 1000,
      ctr: 0.02, // 2% as decimal from Google
      position: 15.3,
    },
  ],
};

// ─── parseGA4Response ────────────────────────────────────────────────────────────

describe('parseGA4Response', () => {
  it('correctly maps every GA4 metric by index position', () => {
    const result = parseGA4Response(FIXTURE_GA4_RESPONSE);
    expect(result).not.toBeNull();

    // Direct passthrough metrics (no transformation)
    expect(result!.sessions).toBe(1234);
    expect(result!.users).toBe(987);
    expect(result!.engagementDuration).toBe(45678);
    expect(result!.pageViews).toBe(3456);
    expect(result!.avgSessionDuration).toBe(123.45);
    expect(result!.newUsers).toBe(456);
    expect(result!.engagedSessions).toBe(789);
    expect(result!.eventCount).toBe(5678);
    expect(result!.conversions).toBe(12);

    // bounceRate: still raw 0-1 decimal at this stage (normalization happens in normalizeGA4Metrics)
    expect(result!.bounceRate).toBe(0.6523);
  });

  it('returns null for empty GA4 response', () => {
    expect(parseGA4Response({ rows: [] })).toBeNull();
    expect(parseGA4Response({})).toBeNull();
  });

  it('returns null for response with insufficient metric values', () => {
    const incomplete: RawGA4Response = {
      rows: [{ metricValues: [{ value: '100' }, { value: '50' }] }],
    };
    expect(parseGA4Response(incomplete)).toBeNull();
  });

  it('handles missing metric values with default 0', () => {
    const withMissing: RawGA4Response = {
      rows: [
        {
          metricValues: [
            { value: '' }, // empty string → 0
            { value: '0' }, // explicit 0
            { value: '100' },
            { value: '200' },
            { value: '0.5' },
            { value: '60' },
            { value: '30' },
            { value: '40' },
            { value: '50' },
            { value: '5' },
          ],
        },
      ],
    };
    const result = parseGA4Response(withMissing);
    expect(result).not.toBeNull();
    expect(result!.sessions).toBe(0); // empty → 0
    expect(result!.users).toBe(0); // '0' → 0
    expect(result!.engagementDuration).toBe(100);
  });
});

// ─── normalizeGA4Metrics ─────────────────────────────────────────────────────────

describe('normalizeGA4Metrics', () => {
  it('converts bounceRate from 0-1 decimal to 0-100 percentage', () => {
    const parsed: ParsedGA4Metrics = {
      sessions: 1000,
      users: 800,
      engagementDuration: 5000,
      pageViews: 2000,
      bounceRate: 0.6523, // Google returns this
      avgSessionDuration: 120,
      newUsers: 300,
      engagedSessions: 600,
      eventCount: 4000,
      conversions: 10,
    };

    const normalized = normalizeGA4Metrics(parsed);

    // BUG A FIX VERIFICATION: bounceRate must be percentage
    expect(normalized.bounceRate).toBe(65.23);

    // All other metrics are direct passthrough
    expect(normalized.sessions).toBe(1000);
    expect(normalized.users).toBe(800);
    expect(normalized.engagementDuration).toBe(5000);
    expect(normalized.pageViews).toBe(2000);
    expect(normalized.avgSessionDuration).toBe(120);
    expect(normalized.newUsers).toBe(300);
    expect(normalized.engagedSessions).toBe(600);
    expect(normalized.eventCount).toBe(4000);
    expect(normalized.conversions).toBe(10);
  });

  it('handles 0% bounce rate correctly', () => {
    const parsed: ParsedGA4Metrics = {
      sessions: 100,
      users: 80,
      engagementDuration: 500,
      pageViews: 200,
      bounceRate: 0,
      avgSessionDuration: 60,
      newUsers: 30,
      engagedSessions: 70,
      eventCount: 400,
      conversions: 5,
    };
    expect(normalizeGA4Metrics(parsed).bounceRate).toBe(0);
  });

  it('handles 100% bounce rate correctly', () => {
    const parsed: ParsedGA4Metrics = {
      sessions: 100,
      users: 80,
      engagementDuration: 500,
      pageViews: 200,
      bounceRate: 1.0,
      avgSessionDuration: 60,
      newUsers: 30,
      engagedSessions: 70,
      eventCount: 400,
      conversions: 5,
    };
    expect(normalizeGA4Metrics(parsed).bounceRate).toBe(100);
  });

  it('does NOT fabricate leads or revenue', () => {
    const parsed: ParsedGA4Metrics = {
      sessions: 100,
      users: 80,
      engagementDuration: 500,
      pageViews: 200,
      bounceRate: 0.5,
      avgSessionDuration: 60,
      newUsers: 30,
      engagedSessions: 70,
      eventCount: 400,
      conversions: 5,
    };
    const normalized = normalizeGA4Metrics(parsed);

    // Verify no fabricated fields exist
    expect(normalized).not.toHaveProperty('leads');
    expect(normalized).not.toHaveProperty('revenue');
    expect(normalized).not.toHaveProperty('conversionRate');
  });
});

// ─── aggregateGSCRows ────────────────────────────────────────────────────────────

describe('aggregateGSCRows', () => {
  it('correctly sums clicks and impressions across keywords', () => {
    const result = aggregateGSCRows(FIXTURE_GSC_RESPONSE);
    expect(result).not.toBeNull();

    // 150 + 80 + 20 = 250
    expect(result!.totalClicks).toBe(250);
    // 3000 + 2000 + 1000 = 6000
    expect(result!.totalImpressions).toBe(6000);
  });

  it('correctly averages position across keywords', () => {
    const result = aggregateGSCRows(FIXTURE_GSC_RESPONSE);
    expect(result).not.toBeNull();

    // (3.2 + 7.5 + 15.3) / 3 = 8.666...
    expect(result!.avgPosition).toBeCloseTo(8.667, 2);
  });

  it('recalculates aggregate CTR from totals (decimal 0-1)', () => {
    const result = aggregateGSCRows(FIXTURE_GSC_RESPONSE);
    expect(result).not.toBeNull();

    // Aggregate CTR = totalClicks / totalImpressions = 250 / 6000 = 0.04166...
    expect(result!.ctrDecimal).toBeCloseTo(0.04167, 4);
  });

  it('returns null for empty GSC response', () => {
    expect(aggregateGSCRows({ rows: [] })).toBeNull();
    expect(aggregateGSCRows({})).toBeNull();
  });

  it('handles single keyword row', () => {
    const single: RawGSCResponse = {
      rows: [{ keys: ['test keyword'], clicks: 10, impressions: 100, ctr: 0.1, position: 5.0 }],
    };
    const result = aggregateGSCRows(single);
    expect(result).not.toBeNull();
    expect(result!.totalClicks).toBe(10);
    expect(result!.totalImpressions).toBe(100);
    expect(result!.avgPosition).toBe(5.0);
    expect(result!.ctrDecimal).toBe(0.1);
    expect(result!.keywordCount).toBe(1);
  });

  it('handles zero impressions without division by zero', () => {
    const noImpressions: RawGSCResponse = {
      rows: [{ keys: ['test'], clicks: 0, impressions: 0, ctr: 0, position: 50.0 }],
    };
    const result = aggregateGSCRows(noImpressions);
    expect(result).not.toBeNull();
    expect(result!.ctrDecimal).toBe(0);
    expect(Number.isFinite(result!.ctrDecimal)).toBe(true);
  });
});

// ─── normalizeGSCMetrics ─────────────────────────────────────────────────────────

describe('normalizeGSCMetrics', () => {
  it('converts aggregate CTR from 0-1 decimal to 0-100 percentage', () => {
    const aggregated: AggregatedGSCMetrics = {
      totalClicks: 250,
      totalImpressions: 6000,
      avgPosition: 8.667,
      ctrDecimal: 0.04167,
      keywordCount: 3,
    };

    const normalized = normalizeGSCMetrics(aggregated);

    // BUG B FIX VERIFICATION: CTR must be percentage
    expect(normalized.ctr).toBeCloseTo(4.167, 2);

    // Direct passthrough metrics
    expect(normalized.clicks).toBe(250);
    expect(normalized.impressions).toBe(6000);
    expect(normalized.avgPosition).toBe(8.667);
  });
});

// ─── normalizeKeywordRow ─────────────────────────────────────────────────────────

describe('normalizeKeywordRow', () => {
  it('converts per-keyword CTR from 0-1 decimal to 0-100 percentage', () => {
    const row = FIXTURE_GSC_RESPONSE.rows![0];
    const normalized = normalizeKeywordRow(row);

    // BUG B FIX VERIFICATION: keyword CTR must also be percentage (consistent with aggregate)
    expect(normalized.ctr).toBe(5.0); // 0.05 * 100

    // Direct passthrough
    expect(normalized.keyword).toBe('best coffee shop near me');
    expect(normalized.clicks).toBe(150);
    expect(normalized.impressions).toBe(3000);
    expect(normalized.position).toBe(3.2);
  });

  it('handles missing keyword key gracefully', () => {
    const noKeys = { clicks: 10, impressions: 100, ctr: 0.1, position: 5.0 };
    const normalized = normalizeKeywordRow(noKeys);
    expect(normalized.keyword).toBe('unknown');
  });

  it('handles missing numeric fields with default 0', () => {
    const sparse = { keys: ['test keyword'] };
    const normalized = normalizeKeywordRow(sparse);
    expect(normalized.clicks).toBe(0);
    expect(normalized.impressions).toBe(0);
    expect(normalized.ctr).toBe(0);
    expect(normalized.position).toBe(0);
  });
});

// ─── Full Pipeline Integrity ─────────────────────────────────────────────────────

describe('Full Pipeline Integrity', () => {
  it('GA4: raw API → parse → normalize produces correct storage-ready data', () => {
    const parsed = parseGA4Response(FIXTURE_GA4_RESPONSE);
    expect(parsed).not.toBeNull();

    const normalized = normalizeGA4Metrics(parsed!);

    // bounceRate: 0.6523 → 65.23 (percentage)
    expect(normalized.bounceRate).toBe(65.23);

    // All other metrics unchanged from API
    expect(normalized.sessions).toBe(1234);
    expect(normalized.users).toBe(987);
    expect(normalized.engagementDuration).toBe(45678);
    expect(normalized.pageViews).toBe(3456);
    expect(normalized.avgSessionDuration).toBe(123.45);
    expect(normalized.newUsers).toBe(456);
    expect(normalized.engagedSessions).toBe(789);
    expect(normalized.eventCount).toBe(5678);
    expect(normalized.conversions).toBe(12);
  });

  it('GSC: raw API → aggregate → normalize produces correct storage-ready data', () => {
    const aggregated = aggregateGSCRows(FIXTURE_GSC_RESPONSE);
    expect(aggregated).not.toBeNull();

    const normalized = normalizeGSCMetrics(aggregated!);

    // CTR: 0.04167 → 4.167 (percentage)
    expect(normalized.ctr).toBeCloseTo(4.167, 2);

    // Aggregate totals
    expect(normalized.clicks).toBe(250);
    expect(normalized.impressions).toBe(6000);
    expect(normalized.avgPosition).toBeCloseTo(8.667, 2);
  });

  it('GSC keyword CTR matches aggregate CTR format (both percentage)', () => {
    const aggregated = aggregateGSCRows(FIXTURE_GSC_RESPONSE);
    const normalizedAggregate = normalizeGSCMetrics(aggregated!);
    const normalizedKeyword = normalizeKeywordRow(FIXTURE_GSC_RESPONSE.rows![0]);

    // BOTH should be percentage format
    expect(normalizedAggregate.ctr).toBeGreaterThan(1); // Not 0-1 decimal
    expect(normalizedKeyword.ctr).toBeGreaterThan(1); // Not 0-1 decimal
  });

  it('Phoo Rating scoring functions receive correctly-formatted inputs', () => {
    // Verify that the data flowing to Phoo Rating's scoreEngagement and scoreCTR
    // is in the format they expect (0-100 percentage)

    const parsed = parseGA4Response(FIXTURE_GA4_RESPONSE);
    const normalized = normalizeGA4Metrics(parsed!);

    // scoreEngagement expects bounceRate as percentage (thresholds: <25, <35, <45...)
    // 65.23 should NOT score 95 (which happens with 0.6523)
    expect(normalized.bounceRate).toBeGreaterThan(1); // Must be percentage, not decimal

    // scoreCTR expects CTR as percentage (thresholds: >=1, >=2, >=3, >=5...)
    const aggregated = aggregateGSCRows(FIXTURE_GSC_RESPONSE);
    const normalizedGSC = normalizeGSCMetrics(aggregated!);
    expect(normalizedGSC.ctr).toBeGreaterThan(1); // Must be percentage, not decimal
  });

  it('no fabricated metrics exist in the pipeline output', () => {
    const parsed = parseGA4Response(FIXTURE_GA4_RESPONSE);
    const normalized = normalizeGA4Metrics(parsed!);

    // These fields must NOT exist — they were fabricated
    const keys = Object.keys(normalized);
    expect(keys).not.toContain('leads');
    expect(keys).not.toContain('revenue');
    expect(keys).not.toContain('conversionRate');
  });
});
