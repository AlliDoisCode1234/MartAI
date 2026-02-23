import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser, seedProject } from './testHelpers';
import { internal } from '../../convex/_generated/api';

describe('Competitors Internal Actions', () => {
  it('should successfully run analyzeCompetitors mock', async () => {
    const t = createTestContext();
    const userId = await seedUser(t, { role: 'admin' });
    const projectId = await seedProject(t, userId);

    const result = await t.action(internal.analytics.competitors.analyzeCompetitors, {
      projectId,
      competitorDomains: ['example.com'],
    });

    expect(result).toHaveLength(1);
    expect(result[0].domain).toBe('example.com');
    expect(result[0].opportunities).toContain('keyword1');
  });
});
