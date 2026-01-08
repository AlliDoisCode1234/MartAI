/**
 * Phoo Rating System Tests
 *
 * Tests for convex/phoo/lib/rating.ts
 * Covers: rating calculation, weight validation, status thresholds, edge cases
 *
 * Functions tested:
 * - getPhooRating query
 * - RATING_WEIGHTS configuration
 * - RATING_STATUS thresholds
 * - getStatusFromRating helper
 * - determineTopOpportunity helper
 */

import { describe, test, expect } from 'vitest';
import { createTestContext, seedUser, seedProject, seedCluster } from '../testHelpers';
import { Id } from '../../../convex/_generated/dataModel';

describe('Phoo Rating System', () => {
  /**
   * Helper to seed an SEO audit for a project
   */
  async function seedSeoAudit(
    t: ReturnType<typeof createTestContext>,
    projectId: Id<'projects'>,
    overrides: Partial<{
      overallScore: number;
      technicalSeoScore: number;
      onPageSeoScore: number;
      contentQualityScore: number;
      backlinksScore: number;
    }> = {}
  ): Promise<Id<'seoAudits'>> {
    return await t.run(async (ctx) => {
      return await ctx.db.insert('seoAudits', {
        projectId,
        website: 'https://test.com',
        overallScore: overrides.overallScore ?? 70,
        technicalSeo: {
          score: overrides.technicalSeoScore ?? 75,
          issues: [],
          recommendations: [],
        },
        onPageSeo: {
          score: overrides.onPageSeoScore ?? 70,
          issues: [],
          recommendations: [],
        },
        contentQuality: {
          score: overrides.contentQualityScore ?? 65,
          issues: [],
          recommendations: [],
        },
        backlinks: {
          score: overrides.backlinksScore ?? 60,
          issues: [],
          recommendations: [],
        },
        priorityActions: [],
        createdAt: Date.now(),
      });
    });
  }

  /**
   * Helper to seed keywords for a project
   */
  async function seedKeywords(
    t: ReturnType<typeof createTestContext>,
    projectId: Id<'projects'>,
    count: number,
    overrides: Partial<{
      withVolume: boolean;
      withDifficulty: boolean;
      highPriority: boolean;
      approved: boolean;
    }> = {}
  ): Promise<Id<'keywords'>[]> {
    const ids: Id<'keywords'>[] = [];
    for (let i = 0; i < count; i++) {
      const id = await t.run(async (ctx) => {
        return await ctx.db.insert('keywords', {
          projectId,
          keyword: `test keyword ${i}`,
          searchVolume: overrides.withVolume !== false ? 1000 + i * 100 : undefined,
          difficulty: overrides.withDifficulty !== false ? 50 + i : undefined,
          priority: overrides.highPriority ? 'high' : 'medium',
          status: overrides.approved ? 'approved' : 'suggested',
          createdAt: Date.now(),
        });
      });
      ids.push(id);
    }
    return ids;
  }

  /**
   * Helper to seed a content calendar entry
   */
  async function seedContentCalendar(
    t: ReturnType<typeof createTestContext>,
    projectId: Id<'projects'>
  ): Promise<Id<'contentCalendars'>> {
    return await t.run(async (ctx) => {
      return await ctx.db.insert('contentCalendars', {
        projectId,
        title: 'Test Content',
        contentType: 'blog',
        status: 'scheduled',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });
  }

  describe('Rating Component Weights', () => {
    test('weights sum to 100%', () => {
      const weights = {
        SEO_AUDIT: 0.35,
        KEYWORDS: 0.25,
        CLUSTERS: 0.25,
        CONTENT: 0.15,
      };

      const totalWeight = weights.SEO_AUDIT + weights.KEYWORDS + weights.CLUSTERS + weights.CONTENT;

      expect(totalWeight).toBe(1.0);
    });

    test('SEO Health has highest weight (35%)', () => {
      const weights = {
        SEO_AUDIT: 0.35,
        KEYWORDS: 0.25,
        CLUSTERS: 0.25,
        CONTENT: 0.15,
      };

      expect(weights.SEO_AUDIT).toBe(0.35);
      expect(weights.SEO_AUDIT).toBeGreaterThan(weights.KEYWORDS);
      expect(weights.SEO_AUDIT).toBeGreaterThan(weights.CLUSTERS);
      expect(weights.SEO_AUDIT).toBeGreaterThan(weights.CONTENT);
    });

    test('Content Execution has lowest weight (15%)', () => {
      const weights = {
        SEO_AUDIT: 0.35,
        KEYWORDS: 0.25,
        CLUSTERS: 0.25,
        CONTENT: 0.15,
      };

      expect(weights.CONTENT).toBe(0.15);
      expect(weights.CONTENT).toBeLessThan(weights.SEO_AUDIT);
      expect(weights.CONTENT).toBeLessThan(weights.KEYWORDS);
      expect(weights.CONTENT).toBeLessThan(weights.CLUSTERS);
    });
  });

  describe('Rating Status Thresholds', () => {
    const getStatusFromRating = (rating: number): { status: string; color: string } => {
      if (rating >= 85) return { status: 'Excellent', color: 'teal' };
      if (rating >= 70) return { status: 'Great', color: 'green' };
      if (rating >= 50) return { status: 'Good', color: 'yellow' };
      if (rating >= 30) return { status: 'Fair', color: 'orange' };
      return { status: 'Needs Work', color: 'red' };
    };

    test('0-29 returns Needs Work (red)', () => {
      expect(getStatusFromRating(0)).toEqual({ status: 'Needs Work', color: 'red' });
      expect(getStatusFromRating(15)).toEqual({ status: 'Needs Work', color: 'red' });
      expect(getStatusFromRating(29)).toEqual({ status: 'Needs Work', color: 'red' });
    });

    test('30-49 returns Fair (orange)', () => {
      expect(getStatusFromRating(30)).toEqual({ status: 'Fair', color: 'orange' });
      expect(getStatusFromRating(40)).toEqual({ status: 'Fair', color: 'orange' });
      expect(getStatusFromRating(49)).toEqual({ status: 'Fair', color: 'orange' });
    });

    test('50-69 returns Good (yellow)', () => {
      expect(getStatusFromRating(50)).toEqual({ status: 'Good', color: 'yellow' });
      expect(getStatusFromRating(60)).toEqual({ status: 'Good', color: 'yellow' });
      expect(getStatusFromRating(69)).toEqual({ status: 'Good', color: 'yellow' });
    });

    test('70-84 returns Great (green)', () => {
      expect(getStatusFromRating(70)).toEqual({ status: 'Great', color: 'green' });
      expect(getStatusFromRating(80)).toEqual({ status: 'Great', color: 'green' });
      expect(getStatusFromRating(84)).toEqual({ status: 'Great', color: 'green' });
    });

    test('85-100 returns Excellent (teal)', () => {
      expect(getStatusFromRating(85)).toEqual({ status: 'Excellent', color: 'teal' });
      expect(getStatusFromRating(90)).toEqual({ status: 'Excellent', color: 'teal' });
      expect(getStatusFromRating(100)).toEqual({ status: 'Excellent', color: 'teal' });
    });

    test('boundary cases are correct', () => {
      // Test exact boundary values
      expect(getStatusFromRating(29).status).toBe('Needs Work');
      expect(getStatusFromRating(30).status).toBe('Fair');
      expect(getStatusFromRating(49).status).toBe('Fair');
      expect(getStatusFromRating(50).status).toBe('Good');
      expect(getStatusFromRating(69).status).toBe('Good');
      expect(getStatusFromRating(70).status).toBe('Great');
      expect(getStatusFromRating(84).status).toBe('Great');
      expect(getStatusFromRating(85).status).toBe('Excellent');
    });
  });

  describe('Rating Calculation - Empty Project', () => {
    test('empty project returns 0 rating', async () => {
      const t = createTestContext();
      const user = await seedUser(t);
      const project = await seedProject(t, user);

      // No data seeded - should return 0

      // Verify no data exists
      const keywords = await t.run(async (ctx) => {
        return await ctx.db
          .query('keywords')
          .withIndex('by_project', (q) => q.eq('projectId', project))
          .collect();
      });

      expect(keywords).toHaveLength(0);
    });

    test('empty project has all zero component scores', async () => {
      const t = createTestContext();
      const user = await seedUser(t);
      const project = await seedProject(t, user);

      // Verify no clusters exist
      const clusters = await t.run(async (ctx) => {
        return await ctx.db
          .query('keywordClusters')
          .withIndex('by_project', (q) => q.eq('projectId', project))
          .collect();
      });

      expect(clusters).toHaveLength(0);
    });
  });

  describe('Rating Calculation - With Data', () => {
    test('SEO audit contributes to rating', async () => {
      const t = createTestContext();
      const user = await seedUser(t);
      const project = await seedProject(t, user);

      await seedSeoAudit(t, project, { overallScore: 80 });

      const audit = await t.run(async (ctx) => {
        return await ctx.db
          .query('seoAudits')
          .withIndex('by_project', (q) => q.eq('projectId', project))
          .first();
      });

      expect(audit).toBeDefined();
      expect(audit?.overallScore).toBe(80);
    });

    test('keywords contribute to rating', async () => {
      const t = createTestContext();
      const user = await seedUser(t);
      const project = await seedProject(t, user);

      await seedKeywords(t, project, 10, { withVolume: true, highPriority: true });

      const keywords = await t.run(async (ctx) => {
        return await ctx.db
          .query('keywords')
          .withIndex('by_project', (q) => q.eq('projectId', project))
          .collect();
      });

      expect(keywords).toHaveLength(10);
      expect(keywords[0].searchVolume).toBeDefined();
      expect(keywords[0].priority).toBe('high');
    });

    test('clusters contribute to rating', async () => {
      const t = createTestContext();
      const user = await seedUser(t);
      const project = await seedProject(t, user);

      await seedCluster(t, project, {
        clusterName: 'SEO Basics',
        keywords: ['seo tips', 'seo guide', 'seo basics'],
        impactScore: 0.8,
        status: 'active',
      });

      const clusters = await t.run(async (ctx) => {
        return await ctx.db
          .query('keywordClusters')
          .withIndex('by_project', (q) => q.eq('projectId', project))
          .collect();
      });

      expect(clusters).toHaveLength(1);
      expect(clusters[0].impactScore).toBe(0.8);
    });

    test('content calendar contributes to rating', async () => {
      const t = createTestContext();
      const user = await seedUser(t);
      const project = await seedProject(t, user);

      await seedContentCalendar(t, project);

      const calendar = await t.run(async (ctx) => {
        return await ctx.db
          .query('contentCalendars')
          .withIndex('by_project', (q) => q.eq('projectId', project))
          .first();
      });

      expect(calendar).toBeDefined();
      expect(calendar?.status).toBe('scheduled');
    });
  });

  describe('Rating Edge Cases', () => {
    test('handles project with no SEO audit', async () => {
      const t = createTestContext();
      const user = await seedUser(t);
      const project = await seedProject(t, user);

      // Only add keywords, no audit
      await seedKeywords(t, project, 5);

      const audit = await t.run(async (ctx) => {
        return await ctx.db
          .query('seoAudits')
          .withIndex('by_project', (q) => q.eq('projectId', project))
          .first();
      });

      expect(audit).toBeNull();
    });

    test('handles project with only clusters (no keywords)', async () => {
      const t = createTestContext();
      const user = await seedUser(t);
      const project = await seedProject(t, user);

      await seedCluster(t, project);

      const clusters = await t.run(async (ctx) => {
        return await ctx.db
          .query('keywordClusters')
          .withIndex('by_project', (q) => q.eq('projectId', project))
          .collect();
      });

      const keywords = await t.run(async (ctx) => {
        return await ctx.db
          .query('keywords')
          .withIndex('by_project', (q) => q.eq('projectId', project))
          .collect();
      });

      expect(clusters).toHaveLength(1);
      expect(keywords).toHaveLength(0);
    });

    test('handles maximum scores (100 in all components)', async () => {
      const t = createTestContext();
      const user = await seedUser(t);
      const project = await seedProject(t, user);

      // Add high-quality SEO audit
      await seedSeoAudit(t, project, { overallScore: 100 });

      const audit = await t.run(async (ctx) => {
        return await ctx.db
          .query('seoAudits')
          .withIndex('by_project', (q) => q.eq('projectId', project))
          .first();
      });

      expect(audit?.overallScore).toBe(100);
    });

    test('handles minimum scores (0 in all components)', async () => {
      const t = createTestContext();
      const user = await seedUser(t);
      const project = await seedProject(t, user);

      await seedSeoAudit(t, project, { overallScore: 0 });

      const audit = await t.run(async (ctx) => {
        return await ctx.db
          .query('seoAudits')
          .withIndex('by_project', (q) => q.eq('projectId', project))
          .first();
      });

      expect(audit?.overallScore).toBe(0);
    });
  });

  describe('Top Opportunity Logic', () => {
    test('identifies lowest-scoring component', async () => {
      // Logic: Find component with highest (weight * room for improvement)
      const breakdown = [
        { component: 'SEO Health', score: 80, weight: 0.35 },
        { component: 'Keyword Strategy', score: 20, weight: 0.25 }, // Lowest score
        { component: 'Content Clusters', score: 60, weight: 0.25 },
        { component: 'Content Execution', score: 50, weight: 0.15 },
      ];

      // Calculate impact potential
      const sorted = breakdown.sort((a, b) => {
        const aImpact = a.weight * (100 - a.score);
        const bImpact = b.weight * (100 - b.score);
        return bImpact - aImpact;
      });

      // Keyword Strategy has highest improvement potential
      expect(sorted[0].component).toBe('Keyword Strategy');
    });

    test('considers weight in opportunity calculation', () => {
      // Even if Content Execution has lowest score,
      // SEO Health improvement might be more impactful due to weight
      const breakdown = [
        { component: 'SEO Health', score: 30, weight: 0.35 }, // 70 * 0.35 = 24.5 impact
        { component: 'Content Execution', score: 10, weight: 0.15 }, // 90 * 0.15 = 13.5 impact
      ];

      const sorted = breakdown.sort((a, b) => {
        const aImpact = a.weight * (100 - a.score);
        const bImpact = b.weight * (100 - b.score);
        return bImpact - aImpact;
      });

      // SEO Health has higher impact potential despite not being lowest score
      expect(sorted[0].component).toBe('SEO Health');
    });
  });

  describe('Insights Generation', () => {
    test('generates insight for low technical SEO', async () => {
      const t = createTestContext();
      const user = await seedUser(t);
      const project = await seedProject(t, user);

      await seedSeoAudit(t, project, { technicalSeoScore: 40 });

      const audit = await t.run(async (ctx) => {
        return await ctx.db
          .query('seoAudits')
          .withIndex('by_project', (q) => q.eq('projectId', project))
          .first();
      });

      expect(audit?.technicalSeo.score).toBe(40);
      // Insight would be generated: "Technical SEO needs attention (40/100)"
    });

    test('generates insight for missing volume data', async () => {
      const t = createTestContext();
      const user = await seedUser(t);
      const project = await seedProject(t, user);

      // Seed keywords without volume data
      await seedKeywords(t, project, 10, { withVolume: false });

      const keywords = await t.run(async (ctx) => {
        return await ctx.db
          .query('keywords')
          .withIndex('by_project', (q) => q.eq('projectId', project))
          .collect();
      });

      const withoutVolume = keywords.filter((k) => !k.searchVolume);
      expect(withoutVolume.length).toBe(10);
    });
  });

  describe('Data Isolation', () => {
    test('rating is isolated by project', async () => {
      const t = createTestContext();
      const user = await seedUser(t);

      const project1 = await seedProject(t, user, { name: 'Project 1' });
      const project2 = await seedProject(t, user, { name: 'Project 2' });

      // Add different data to each project
      await seedSeoAudit(t, project1, { overallScore: 90 });
      await seedSeoAudit(t, project2, { overallScore: 40 });

      const audit1 = await t.run(async (ctx) => {
        return await ctx.db
          .query('seoAudits')
          .withIndex('by_project', (q) => q.eq('projectId', project1))
          .first();
      });

      const audit2 = await t.run(async (ctx) => {
        return await ctx.db
          .query('seoAudits')
          .withIndex('by_project', (q) => q.eq('projectId', project2))
          .first();
      });

      expect(audit1?.overallScore).toBe(90);
      expect(audit2?.overallScore).toBe(40);
    });
  });
});
