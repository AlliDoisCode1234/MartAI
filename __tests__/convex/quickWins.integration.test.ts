import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser, seedProject } from './testHelpers';
import { api } from '../../convex/_generated/api';

describe('Quick Wins', () => {
  it('should return keywords with low difficulty and high volume', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);

    await t.run(async (ctx) => {
      // Eligible quick win
      await ctx.db.insert('keywords', {
        projectId,
        keyword: 'best seo tool',
        searchVolume: 500,
        difficulty: 10,
        status: 'approved',
        createdAt: Date.now(),
      });
      // Not a quick win (high difficulty)
      await ctx.db.insert('keywords', {
        projectId,
        keyword: 'seo',
        searchVolume: 10000,
        difficulty: 85,
        status: 'approved',
        createdAt: Date.now(),
      });
      // Not a quick win (low volume)
      await ctx.db.insert('keywords', {
        projectId,
        keyword: 'long tail weird keyword 2026',
        searchVolume: 10,
        difficulty: 5,
        status: 'approved',
        createdAt: Date.now(),
      });
    });

    const quickWins = await t.query(api.content.quickWins.getQuickWins, { projectId });
    expect(quickWins.length).toBe(1);
    expect(quickWins[0].keyword).toBe('best seo tool');

    const count = await t.query(api.content.quickWins.getQuickWinCount, { projectId });
    expect(count).toBe(1);
  });
});
