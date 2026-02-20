/**
 * Analytics Transform Layer
 *
 * Pure, testable functions for transforming raw GA4/GSC API responses
 * into storage-ready formats. The ONLY place metric normalization happens.
 *
 * RULES:
 * 1. All percentages stored as 0-100 (not 0-1 decimals)
 * 2. All counts stored as integers
 * 3. All durations stored in seconds
 * 4. No metric is invented — only Google-sourced data is stored
 *
 * Component Hierarchy: convex/analytics/analyticsTransforms.ts (utility — no parent)
 */

// ─── Types ──────────────────────────────────────────────────────────────────────

/** Raw GA4 API response shape from `runReport` */
export interface RawGA4Response {
  rows?: Array<{
    metricValues: Array<{ value: string }>;
  }>;
  metricHeaders?: Array<{ name: string; type: string }>;
}

/** Raw GSC API response row from `searchAnalytics/query` */
export interface RawGSCRow {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number; // 0.0-1.0 decimal from Google
  position?: number;
}

/** Raw GSC API response */
export interface RawGSCResponse {
  rows?: RawGSCRow[];
}

/** Parsed GA4 metrics — raw values as Google returns them */
export interface ParsedGA4Metrics {
  sessions: number;
  users: number;
  engagementDuration: number; // seconds
  pageViews: number;
  bounceRate: number; // 0.0-1.0 from Google
  avgSessionDuration: number; // seconds
  newUsers: number;
  engagedSessions: number;
  eventCount: number;
  conversions: number;
}

/** Normalized GA4 metrics — ready for DB storage */
export interface NormalizedGA4Metrics {
  sessions: number;
  users: number;
  engagementDuration: number; // seconds (unchanged)
  pageViews: number;
  bounceRate: number; // 0-100 percentage
  avgSessionDuration: number; // seconds (unchanged)
  newUsers: number;
  engagedSessions: number;
  eventCount: number;
  conversions: number;
}

/** Aggregated GSC metrics from keyword-level rows */
export interface AggregatedGSCMetrics {
  totalClicks: number;
  totalImpressions: number;
  avgPosition: number;
  ctrDecimal: number; // 0.0-1.0 (raw from aggregation)
  keywordCount: number;
}

/** Normalized GSC metrics — ready for DB storage */
export interface NormalizedGSCMetrics {
  clicks: number;
  impressions: number;
  ctr: number; // 0-100 percentage
  avgPosition: number;
}

/** Single keyword snapshot — normalized for storage */
export interface NormalizedKeywordSnapshot {
  keyword: string;
  clicks: number;
  impressions: number;
  ctr: number; // 0-100 percentage (normalized from Google's 0-1)
  position: number;
}

// ─── GA4 Transforms ─────────────────────────────────────────────────────────────

/**
 * GA4 API metric request order (must match `runGA4Report` in google.ts).
 * GA4 Data API guarantees response order matches request order.
 */
const GA4_METRIC_ORDER = [
  'sessions', // 0
  'totalUsers', // 1
  'userEngagementDuration', // 2
  'screenPageViews', // 3
  'bounceRate', // 4
  'averageSessionDuration', // 5
  'newUsers', // 6
  'engagedSessions', // 7
  'eventCount', // 8
  'conversions', // 9
] as const;

/**
 * Parse raw GA4 API response into typed metrics.
 * Returns null if response has no data.
 */
export function parseGA4Response(raw: RawGA4Response): ParsedGA4Metrics | null {
  if (!raw.rows || raw.rows.length === 0) return null;

  const row = raw.rows[0];
  if (!row.metricValues || row.metricValues.length < GA4_METRIC_ORDER.length) {
    return null;
  }

  const getValue = (index: number): number => parseFloat(row.metricValues[index]?.value || '0');

  return {
    sessions: getValue(0),
    users: getValue(1),
    engagementDuration: getValue(2),
    pageViews: getValue(3),
    bounceRate: getValue(4), // raw 0-1 from Google
    avgSessionDuration: getValue(5),
    newUsers: getValue(6),
    engagedSessions: getValue(7),
    eventCount: getValue(8),
    conversions: getValue(9),
  };
}

/**
 * Normalize GA4 metrics for storage.
 * - bounceRate: 0-1 decimal → 0-100 percentage
 * - All other metrics: passthrough (no transformation)
 */
export function normalizeGA4Metrics(parsed: ParsedGA4Metrics): NormalizedGA4Metrics {
  return {
    sessions: parsed.sessions,
    users: parsed.users,
    engagementDuration: parsed.engagementDuration,
    pageViews: parsed.pageViews,
    bounceRate: parsed.bounceRate * 100, // NORMALIZE: 0.65 → 65.0
    avgSessionDuration: parsed.avgSessionDuration,
    newUsers: parsed.newUsers,
    engagedSessions: parsed.engagedSessions,
    eventCount: parsed.eventCount,
    conversions: parsed.conversions,
  };
}

// ─── GSC Transforms ─────────────────────────────────────────────────────────────

/**
 * Aggregate keyword-level GSC rows into totals.
 * Returns null if response has no data.
 */
export function aggregateGSCRows(raw: RawGSCResponse): AggregatedGSCMetrics | null {
  if (!raw.rows || raw.rows.length === 0) return null;

  let totalClicks = 0;
  let totalImpressions = 0;
  let totalPosition = 0;

  for (const row of raw.rows) {
    totalClicks += row.clicks || 0;
    totalImpressions += row.impressions || 0;
    totalPosition += row.position || 0;
  }

  const keywordCount = raw.rows.length;
  const avgPosition = keywordCount > 0 ? totalPosition / keywordCount : 0;
  const ctrDecimal = totalImpressions > 0 ? totalClicks / totalImpressions : 0;

  return {
    totalClicks,
    totalImpressions,
    avgPosition,
    ctrDecimal,
    keywordCount,
  };
}

/**
 * Normalize aggregated GSC metrics for storage.
 * - CTR: 0-1 decimal → 0-100 percentage
 * - All other metrics: passthrough
 */
export function normalizeGSCMetrics(aggregated: AggregatedGSCMetrics): NormalizedGSCMetrics {
  return {
    clicks: aggregated.totalClicks,
    impressions: aggregated.totalImpressions,
    ctr: aggregated.ctrDecimal * 100, // NORMALIZE: 0.052 → 5.2
    avgPosition: aggregated.avgPosition,
  };
}

/**
 * Normalize a single GSC keyword row for snapshot storage.
 * - CTR: 0-1 decimal → 0-100 percentage (consistent with aggregate)
 */
export function normalizeKeywordRow(row: RawGSCRow): NormalizedKeywordSnapshot {
  return {
    keyword: row.keys?.[0] || 'unknown',
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: (row.ctr || 0) * 100, // NORMALIZE: 0.052 → 5.2
    position: row.position || 0,
  };
}
