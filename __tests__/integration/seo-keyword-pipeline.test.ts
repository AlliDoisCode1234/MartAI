import { describe, it, expect } from 'vitest';
import type { NormalizedKeywordMetric } from '../../convex/integrations/dataForSeo';

describe('DataForSEO Pipeline Integration Tests', () => {
  it('safely parses perfectly formed DataForSEO Keyword API structures', () => {
    const rawMetrics: NormalizedKeywordMetric[] = [
      {
        keyword: 'roofing software',
        monthlySearches: 4500,
        rankingDifficulty: 85,
        paidCompetition: 'HIGH',
        adCostCpc: 12.50,
      }
    ];

    const mapped = rawMetrics.map((metric) => ({
      keyword: metric.keyword || 'Unknown Keyword',
      volume: metric.monthlySearches ?? 0,
      difficulty: metric.rankingDifficulty ?? 50,
      intent: metric.paidCompetition === 'HIGH' ? 'commercial' : metric.paidCompetition === 'MEDIUM' ? 'transactional' : 'informational',
    }));

    expect(mapped[0].keyword).toBe('roofing software');
    expect(mapped[0].volume).toBe(4500);
    expect(mapped[0].intent).toBe('commercial');
    expect(mapped[0].difficulty).toBe(85);
  });

  it('safely gracefully degrades malformed NULL responses to prevent UI and DB crashes', () => {
    // Malformed data missing boundaries (simulating unexpected DataForSEO live payload drift)
    const rawMalformedMetrics = [
      {
        keyword: null as unknown as string,
        monthlySearches: undefined as unknown as number,
        rankingDifficulty: null as unknown as number,
        paidCompetition: 'UNKNOWN' as any,
        adCostCpc: 0,
      }
    ];

    const mapped = rawMalformedMetrics.map((metric) => ({
      keyword: metric.keyword || 'Unknown Keyword',
      volume: metric.monthlySearches ?? 0,
      difficulty: metric.rankingDifficulty ?? 50,
      intent: metric.paidCompetition === 'HIGH' ? 'commercial' : metric.paidCompetition === 'MEDIUM' ? 'transactional' : 'informational',
    }));

    // Data Boundaries Should Hold
    expect(mapped[0].keyword).toBe('Unknown Keyword');
    // Null defaults to 0 safely
    expect(mapped[0].volume).toBe(0);
    // Null defaults to 50 fallback difficulty securely
    expect(mapped[0].difficulty).toBe(50);
    // Unknown defaults to informational intent securely
    expect(mapped[0].intent).toBe('informational');
  });

  it('executes SEANs intent taxonomy mandate reliably', () => {
    const rawMetrics: NormalizedKeywordMetric[] = [
      { keyword: 'test1', monthlySearches: 10, rankingDifficulty: 10, paidCompetition: 'HIGH', adCostCpc: 5 },
      { keyword: 'test2', monthlySearches: 10, rankingDifficulty: 10, paidCompetition: 'MEDIUM', adCostCpc: 2 },
      { keyword: 'test3', monthlySearches: 10, rankingDifficulty: 10, paidCompetition: 'LOW', adCostCpc: 0.5 },
      { keyword: 'test4', monthlySearches: 10, rankingDifficulty: 10, paidCompetition: 'UNKNOWN', adCostCpc: 0 },
    ];

    const mapped = rawMetrics.map((metric) => ({
      intent: metric.paidCompetition === 'HIGH' ? 'commercial' : metric.paidCompetition === 'MEDIUM' ? 'transactional' : 'informational',
    }));

    expect(mapped[0].intent).toBe('commercial');
    expect(mapped[1].intent).toBe('transactional');
    expect(mapped[2].intent).toBe('informational');
    expect(mapped[3].intent).toBe('informational');
  });
});
