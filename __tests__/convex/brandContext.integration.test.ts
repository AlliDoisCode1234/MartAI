/**
 * Brand Context Persistence — Integration Tests
 *
 * Tests for Phase 1: brand context fields on the projects table.
 * Verifies updateProject mutation accepts and persists brand fields.
 */

import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser, seedProject } from './testHelpers';
import { api } from '../../convex/_generated/api';

describe('Brand Context Persistence', () => {
  it('should persist brand context fields via updateProject', async () => {
    const t = createTestContext();
    const userId = await seedUser(t, { email: 'brand-test@test.com' });
    const projectId = await seedProject(t, userId);

    // Authenticate as the project owner
    const authT = t.withIdentity({ subject: userId });

    // Update with brand context fields
    await authT.mutation(api.projects.projects.updateProject, {
      projectId,
      brandName: 'Acme Corp',
      brandVoice: 'professional',
      toneKeywords: ['expert', 'data-driven', 'helpful'],
      defaultWordCount: 2000,
      industry: 'technology',
      targetAudience: 'Software engineers and CTOs',
    });

    // Verify fields persisted
    const project = await t.run(async (ctx) => {
      return await ctx.db.get(projectId);
    });

    expect(project).not.toBeNull();
    expect(project!.brandName).toBe('Acme Corp');
    expect(project!.brandVoice).toBe('professional');
    expect(project!.toneKeywords).toEqual(['expert', 'data-driven', 'helpful']);
    expect(project!.defaultWordCount).toBe(2000);
    expect(project!.industry).toBe('technology');
    expect(project!.targetAudience).toBe('Software engineers and CTOs');
  });

  it('should handle partial brand context updates', async () => {
    const t = createTestContext();
    const userId = await seedUser(t, { email: 'partial-test@test.com' });
    const projectId = await seedProject(t, userId);
    const authT = t.withIdentity({ subject: userId });

    // First update — set brandName and industry
    await authT.mutation(api.projects.projects.updateProject, {
      projectId,
      brandName: 'HealthCo',
      industry: 'healthcare',
    });

    // Second update — only update brandVoice (should NOT erase brandName)
    await authT.mutation(api.projects.projects.updateProject, {
      projectId,
      brandVoice: 'authoritative',
    });

    const project = await t.run(async (ctx) => {
      return await ctx.db.get(projectId);
    });

    expect(project!.brandName).toBe('HealthCo');
    expect(project!.industry).toBe('healthcare');
    expect(project!.brandVoice).toBe('authoritative');
  });

  it('should accept empty toneKeywords array', async () => {
    const t = createTestContext();
    const userId = await seedUser(t, { email: 'empty-tone@test.com' });
    const projectId = await seedProject(t, userId);
    const authT = t.withIdentity({ subject: userId });

    await authT.mutation(api.projects.projects.updateProject, {
      projectId,
      toneKeywords: [],
    });

    const project = await t.run(async (ctx) => {
      return await ctx.db.get(projectId);
    });

    expect(project!.toneKeywords).toEqual([]);
  });

  it('should preserve existing fields when only updating brand context', async () => {
    const t = createTestContext();
    const userId = await seedUser(t, { email: 'preserve-test@test.com' });
    const projectId = await seedProject(t, userId, {
      name: 'My Original Project',
      websiteUrl: 'https://original.com',
      industry: 'finance',
    });
    const authT = t.withIdentity({ subject: userId });

    // Update brand context
    await authT.mutation(api.projects.projects.updateProject, {
      projectId,
      brandName: 'FinTech Corp',
      brandVoice: 'technical',
    });

    const project = await t.run(async (ctx) => {
      return await ctx.db.get(projectId);
    });

    // Original fields preserved
    expect(project!.name).toBe('My Original Project');
    expect(project!.websiteUrl).toBe('https://original.com');
    expect(project!.industry).toBe('finance');
    // New brand fields added
    expect(project!.brandName).toBe('FinTech Corp');
    expect(project!.brandVoice).toBe('technical');
  });

  it('should reject unauthenticated requests', async () => {
    const t = createTestContext();
    const userId = await seedUser(t, { email: 'noauth@test.com' });
    const projectId = await seedProject(t, userId);

    // Don't authenticate — should throw
    await expect(
      t.mutation(api.projects.projects.updateProject, {
        projectId,
        brandName: 'Should Fail',
      })
    ).rejects.toThrow();
  });
});
