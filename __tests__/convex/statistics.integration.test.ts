import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser } from './testHelpers';
import { api } from '../../convex/_generated/api';

describe('SEO Statistics', () => {
  it('should insert and retrieve SEO statistics for a client', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);

    // Seed a dummy client (bypassing full client creation which might need multiple deps)
    const clientId = await t.run(async (ctx) => {
      return await ctx.db.insert('clients', {
        companyName: 'Stat Client',
        website: 'https://stat.com',
        industry: 'Tech',
        targetAudience: 'Everyone',
        userId: userId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    // 1. Insert first stat
    await t.mutation(api.seo.statistics.upsertStatistics, {
      clientId,
      organicTraffic: 1000,
      organicKeywords: 50,
      periodStart: now - oneDay * 7,
      periodEnd: now,
    });

    // 2. Insert second stat (newer)
    await t.mutation(api.seo.statistics.upsertStatistics, {
      clientId,
      organicTraffic: 1200,
      organicKeywords: 60,
      periodStart: now,
      periodEnd: now + oneDay * 7,
    });

    // 3. Get latest
    const latest = await t.query(api.seo.statistics.getLatestStatistics, { clientId });
    expect(latest?.organicTraffic).toBe(1200);

    // 4. Get by period
    const periodStats = await t.query(api.seo.statistics.getStatisticsByPeriod, {
      clientId,
      periodStart: now - oneDay * 7,
      periodEnd: now + oneDay * 7,
    });
    expect(periodStats).toHaveLength(2);

    const narrowStats = await t.query(api.seo.statistics.getStatisticsByPeriod, {
      clientId,
      periodStart: now,
      periodEnd: now + oneDay * 7,
    });
    expect(narrowStats).toHaveLength(1);
    expect(narrowStats[0].organicTraffic).toBe(1200);
  });
});
