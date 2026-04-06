import { convexTest } from 'convex-test';
import { expect, test, describe, beforeEach } from 'vitest';
import { api } from '../_generated/api';
import schema from '../schema';
import { Id } from '../_generated/dataModel';

/**
 * Keyword Generation Flow E2E Tests
 *
 * Verifies that the unified onboarding + project creation flow
 * accurately invokes keyword generation, respecting custom industries
 * and gracefully handling DataForSEO exhaustion (402 mock fallbacks).
 */

describe('E2E: Unified Keyword Sourcing', () => {
  let t: ReturnType<typeof convexTest>;
  let authT: ReturnType<ReturnType<typeof convexTest>['withIdentity']>;
  let testUserId: Id<'users'>;

  beforeEach(async () => {
    t = convexTest(schema);

    const result = await t.run(async (ctx) => {
      const userId = await ctx.db.insert('users', {
        email: 'e2e-keyword-test@example.com',
        role: 'user',
        membershipTier: 'engine', // Premium tier to clear limits
        onboardingStatus: 'completed',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return { userId };
    });

    testUserId = result.userId;
    authT = t.withIdentity({ subject: testUserId });
  });

  test('should successfully generate keywords for a basic industry (DFS Mock)', async () => {
    // 1. Create a project simulating the SubsquentProject Onboarding Flow
    const projectId = await authT.mutation(api.projects.projects.createProject, {
      name: 'Standard Plumbing',
      websiteUrl: 'https://standard-plumbing.com',
      industry: 'plumbing',
    });

    expect(projectId).toBeDefined();

    // 2. Fire the keyword generation action (typically fired via background in OnboardingFlow)
    const kwResult = await authT.action(api.seo.keywordActions.generateKeywordsFromUrl, {
      projectId,
      limit: 10,
    });

    // Action should return success
    expect(kwResult.success).toBe(true);

    // 3. Verify the Convex database holds populated keywords with Volumes
    const keywords = await t.run(async (ctx) => {
      return await ctx.db
        .query('keywords' as any)
        .withIndex('by_project' as any, (q: any) => q.eq('projectId', projectId))
        .collect();
    });

    // Should have seeded at least some keywords (Action uses DFS or mock fallback)
    expect(keywords.length).toBeGreaterThan(0);
    
    // Verify schema integrity: must have volume and difficulty
    const sampleKeyword = keywords[0];
    expect(sampleKeyword.searchVolume).toBeGreaterThan(0);
    expect(sampleKeyword.difficulty).toBeDefined();
    expect(sampleKeyword.status).toBe('suggested'); // Defaults to suggested
  });

  test('should flawlessly process a highly custom industry (B2B Micro-Niche)', async () => {
    // The custom text string provided from "Other" dropdown -> Input
    const microNiche = 'B2B Medical Orthopedic Hardware';

    const projectId = await authT.mutation(api.projects.projects.createProject, {
      name: 'OrthoSupplies',
      websiteUrl: 'https://orthosupplies-demo.com',
      industry: microNiche,
    });

    // Fire Generation
    await authT.action(api.seo.keywordActions.generateKeywordsFromUrl, {
      projectId,
      limit: 5,
    });

    // Verify it saved the industry verbatim
    const project = await t.run(async (ctx) => {
      return await ctx.db.get(projectId);
    });

    expect(project?.industry).toBe(microNiche);

    // Verify it still fell back safely and generated keywords without crashing
    const keywords = await t.run(async (ctx) => {
      return await ctx.db
        .query('keywords' as any)
        .withIndex('by_project' as any, (q: any) => q.eq('projectId', projectId))
        .collect();
    });

    expect(keywords.length).toBeGreaterThan(0);
  });
});
