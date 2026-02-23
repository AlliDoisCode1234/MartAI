import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser, seedProject, expectMutationToThrow } from './testHelpers';
import { api } from '../../convex/_generated/api';

describe('Competitors', () => {
  it('should add, get, update, and remove a competitor', async () => {
    const t = createTestContext();
    const userId = await seedUser(t, { role: 'admin' });
    const projectId = await seedProject(t, userId);

    const authT = t.withIdentity({ subject: userId });

    // 1. Add Competitor
    await authT.mutation(api.seo.competitors.addCompetitor, {
      projectId,
      domain: 'competitor.com',
      priority: 5,
      notes: 'Main rival',
    });

    // 2. Get Competitors
    let comps = await authT.query(api.seo.competitors.getCompetitorsByProject, { projectId });
    expect(comps).toHaveLength(1);
    expect(comps[0].domain).toBe('competitor.com');
    expect(comps[0].priority).toBe(5);

    const compId = comps[0]._id;

    // 3. Update Priority
    await authT.mutation(api.seo.competitors.updateCompetitorPriority, {
      competitorId: compId,
      priority: 1,
    });

    comps = await authT.query(api.seo.competitors.getCompetitorsByProject, { projectId });
    expect(comps[0].priority).toBe(1);

    // 4. Remove Competitor
    await authT.mutation(api.seo.competitors.removeCompetitor, {
      competitorId: compId,
    });

    comps = await authT.query(api.seo.competitors.getCompetitorsByProject, { projectId });
    expect(comps).toHaveLength(0);
  });

  it('should patch existing competitor if added again with same domain', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);
    const authT = t.withIdentity({ subject: userId });

    // Add first time
    await authT.mutation(api.seo.competitors.addCompetitor, {
      projectId,
      domain: 'duplicate.com',
      priority: 3,
    });

    // Add second time (same domain)
    await authT.mutation(api.seo.competitors.addCompetitor, {
      projectId,
      domain: 'duplicate.com',
      priority: 8,
      notes: 'Updated notes',
    });

    const comps = await authT.query(api.seo.competitors.getCompetitorsByProject, { projectId });
    expect(comps).toHaveLength(1); // Should still only be 1
    expect(comps[0].priority).toBe(8);
    expect(comps[0].notes).toBe('Updated notes');
  });

  it('should enforce project access for getting competitors', async () => {
    const t = createTestContext();

    // Seed Owner
    const ownerId = await seedUser(t);
    const projectId = await seedProject(t, ownerId);

    // Seed Stranger
    const strangerId = await seedUser(t);

    // Switch auth context to stranger
    const strangerT = t.withIdentity({ subject: strangerId });

    await expect(
      strangerT.query(api.seo.competitors.getCompetitorsByProject, { projectId })
    ).rejects.toThrow();
  });
});
