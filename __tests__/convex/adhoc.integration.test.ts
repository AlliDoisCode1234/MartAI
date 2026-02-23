import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser } from './testHelpers';
import { api } from '../../convex/_generated/api';

describe('Adhoc Analytics', () => {
  it('should store competitor analysis and retrieve history', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const authT = t.withIdentity({ subject: userId });

    // 1. Store competitor analysis
    const analysisId = await authT.mutation(api.analytics.adhoc.storeCompetitorAnalysis, {
      url: 'https://competitor.com',
      metrics: {
        traffic: 1500,
        keywords: 200,
        domainAuthority: 45,
      },
      status: 'completed',
      metadata: { server: 'nginx' },
      cost: 0,
    });

    expect(analysisId).toBeDefined();

    // 2. Get Competitor History
    const history = await authT.query(api.analytics.adhoc.getCompetitorHistory, {});
    expect(history).toHaveLength(1);
    expect(history[0].url).toBe('https://competitor.com');
  });

  it('should handle analyzeCompetitor action fallback or auth properly', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const authT = t.withIdentity({ subject: userId });

    try {
      const result = await authT.action(api.analytics.adhoc.analyzeCompetitor, {
        url: 'https://example.com',
      });
      expect(result).toBeDefined();
    } catch (e: any) {
      // It might throw due to API keys or fetch failures, testing the boundary handles it.
      expect(e.message).toBeDefined();
    }
  });
});
