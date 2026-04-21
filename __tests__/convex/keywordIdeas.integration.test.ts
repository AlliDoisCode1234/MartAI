import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser, seedProject, asUser } from './testHelpers';
import { api } from '../../convex/_generated/api';

describe('Keyword Ideas', () => {
  it('should create and list keyword ideas by project and prospect', async () => {
    const t = createTestContext();
    const userId = await seedUser(t, { role: 'admin' });
    const projectId = await seedProject(t, userId);
    const authed = asUser(t, userId);

    // Seed a mock prospect
    const prospectId = await t.run(async (ctx) => {
      return await ctx.db.insert('prospects', {
        email: 'prospect@test.com',
        status: 'draft',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    // 1. Create Keyword Idea for Project
    await authed.mutation(api.seo.keywordIdeas.createKeywordIdea, {
      projectId,
      primaryKeyword: 'seo tools',
      trafficPotential: 5000,
      kdScore: 45,
    });

    // 2. Create Keyword Idea for Prospect
    await authed.mutation(api.seo.keywordIdeas.createKeywordIdea, {
      prospectId,
      primaryKeyword: 'marketing automation',
      trafficPotential: 10000,
      priority: 'high',
      status: 'shortlisted',
    });

    // 3. List by Project
    const projectIdeas = await authed.query(api.seo.keywordIdeas.listKeywordIdeas, { projectId });
    expect(projectIdeas).toHaveLength(1);
    expect(projectIdeas[0].primaryKeyword).toBe('seo tools');
    expect(projectIdeas[0].status).toBe('candidate'); // Default status

    // 4. List by Prospect
    const prospectIdeas = await authed.query(api.seo.keywordIdeas.listKeywordIdeas, { prospectId });
    expect(prospectIdeas).toHaveLength(1);
    expect(prospectIdeas[0].primaryKeyword).toBe('marketing automation');

    // 5. List by Status
    const shortlistedIdeas = await authed.query(api.seo.keywordIdeas.listKeywordIdeas, {
      prospectId,
      status: 'shortlisted',
    });
    expect(shortlistedIdeas).toHaveLength(1);
  });

  it('should upsert keyword ideas', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);
    const authed = asUser(t, userId);

    // Upsert (Insert new)
    const newId = await authed.mutation(api.seo.keywordIdeas.upsertKeywordIdea, {
      projectId,
      primaryKeyword: 'upsert test',
      trafficPotential: 100,
    });

    expect(newId).toBeDefined();

    // Upsert (Update existing)
    const updatedId = await authed.mutation(api.seo.keywordIdeas.upsertKeywordIdea, {
      ideaId: newId as any,
      projectId,
      primaryKeyword: 'upsert test',
      trafficPotential: 500, // Changed
      status: 'shortlisted', // Changed
    });

    expect(updatedId).toBe(newId);

    const ideas = await authed.query(api.seo.keywordIdeas.listKeywordIdeas, { projectId });
    expect(ideas).toHaveLength(1);
    expect(ideas[0].trafficPotential).toBe(500);
    expect(ideas[0].status).toBe('shortlisted');
  });

  it('should update keyword idea status directly', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);
    const authed = asUser(t, userId);

    const ideaId = await authed.mutation(api.seo.keywordIdeas.createKeywordIdea, {
      projectId,
      primaryKeyword: 'status test',
    });

    const result = await authed.mutation(api.seo.keywordIdeas.updateKeywordIdeaStatus, {
      ideaId: ideaId as any,
      status: 'scheduled',
    });

    expect(result.success).toBe(true);

    const ideas = await authed.query(api.seo.keywordIdeas.listKeywordIdeas, { projectId });
    expect(ideas[0].status).toBe('scheduled');
  });
});
