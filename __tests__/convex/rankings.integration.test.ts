import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser, seedProject } from './testHelpers';
import { api } from '../../convex/_generated/api';

describe('Rankings', () => {
  it('should add rankings and retrieve them', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);

    // 1. Add Ranking
    await t.mutation(api.seo.rankings.addRanking, {
      projectId,
      keyword: 'best seo tools',
      position: 5,
      url: 'https://test.com/seo-tools',
      searchEngine: 'google',
      location: 'US',
    });

    await t.mutation(api.seo.rankings.addRanking, {
      projectId,
      keyword: 'best seo tools',
      position: 3,
      url: 'https://test.com/seo-tools',
      searchEngine: 'google',
      location: 'US',
    });

    // 2. Get Rankings by Keyword (Should be ordered by date desc)
    const keywordRankings = await t.query(api.seo.rankings.getRankingsByKeyword, {
      projectId,
      keyword: 'best seo tools',
    });

    expect(keywordRankings).toHaveLength(2);
    expect(keywordRankings[0].position).toBe(3); // Newest first
    expect(keywordRankings[1].position).toBe(5);

    // 3. Get All Rankings by Project
    const projectRankings = await t.query(api.seo.rankings.getRankingsByProject, { projectId });
    expect(projectRankings).toHaveLength(2);
  });

  it('should execute the internal updateRankings action', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);

    // Simulate calling the internal action
    const result = await t.action(api.seo.rankings.updateRankings, {
      projectId,
    });

    expect(result.updated).toBe(true);

    const projectRankings = await t.query(api.seo.rankings.getRankingsByProject, { projectId });
    expect(projectRankings).toHaveLength(1);
    expect(projectRankings[0].keyword).toBe('example keyword');
  });
});
