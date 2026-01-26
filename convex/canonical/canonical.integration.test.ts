import { convexTest } from 'convex-test';
import { expect, test, describe, beforeEach } from 'vitest';
import { api } from '../_generated/api';
import { Id } from '../_generated/dataModel';
import schema from '../schema';

/**
 * Canonical Data Layer Integration Tests
 *
 * Tests for the single source of truth metrics and rating queries.
 * These verify data consistency across Dashboard, Ask Phoo, and other pages.
 *
 * @see implementation_plan.md - Section 2.1
 */

// =============================================================================
// INTEGRATION TESTS: CANONICAL METRICS
// =============================================================================

describe('Canonical Metrics Query', () => {
  let t: ReturnType<typeof convexTest>;
  let testProjectId: Id<'projects'>;
  let testUserId: Id<'users'>;

  beforeEach(async () => {
    t = convexTest(schema);

    // Seed a test project with various data
    const result = await t.run(async (ctx) => {
      // Create test user
      const userId = await ctx.db.insert('users', {
        email: 'test@canonical.com',
        role: 'user',
        onboardingStatus: 'completed',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Create test project
      const projectId = await ctx.db.insert('projects', {
        userId,
        name: 'Canonical Test Project',
        websiteUrl: 'https://canonical-test.com',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return { userId, projectId };
    });

    testUserId = result.userId;
    testProjectId = result.projectId;
  });

  test('should return zero counts for empty project', async () => {
    const metrics = await t.query(api.canonical.metrics.getCanonicalMetrics, {
      projectId: testProjectId,
    });

    expect(metrics.keywordCount).toBe(0);
    expect(metrics.clusterCount).toBe(0);
    expect(metrics.contentCount).toBe(0);
    expect(metrics.calendarItemCount).toBe(0);
  });

  test('should return accurate keyword count', async () => {
    // Seed 5 keywords
    await t.run(async (ctx) => {
      for (let i = 0; i < 5; i++) {
        await ctx.db.insert('keywords', {
          projectId: testProjectId,
          keyword: `test keyword ${i}`,
          searchVolume: 100 * (i + 1),
          status: 'active',
          source: 'manual',
          createdAt: Date.now(),
        });
      }
    });

    const metrics = await t.query(api.canonical.metrics.getCanonicalMetrics, {
      projectId: testProjectId,
    });

    expect(metrics.keywordCount).toBe(5);
    expect(metrics.keywords.total).toBe(5);
  });

  test('should return accurate cluster count', async () => {
    // Seed 3 clusters
    await t.run(async (ctx) => {
      for (let i = 0; i < 3; i++) {
        await ctx.db.insert('keywordClusters', {
          projectId: testProjectId,
          clusterName: `Cluster ${i}`,
          keywords: [`kw${i}-1`, `kw${i}-2`],
          intent: 'informational',
          difficulty: 50,
          volumeRange: { min: 100, max: 500 },
          impactScore: 75,
          topSerpUrls: [],
          status: 'active',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    });

    const metrics = await t.query(api.canonical.metrics.getCanonicalMetrics, {
      projectId: testProjectId,
    });

    expect(metrics.clusterCount).toBe(3);
  });

  test('should return accurate content counts with status breakdown', async () => {
    // Seed content pieces with different statuses
    await t.run(async (ctx) => {
      await ctx.db.insert('contentPieces', {
        projectId: testProjectId,
        title: 'Draft Content',
        status: 'draft',
        contentType: 'blog',
        keywords: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      await ctx.db.insert('contentPieces', {
        projectId: testProjectId,
        title: 'Scheduled Content',
        status: 'scheduled',
        contentType: 'blog',
        keywords: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      await ctx.db.insert('contentPieces', {
        projectId: testProjectId,
        title: 'Published Content 1',
        status: 'published',
        contentType: 'blog',
        keywords: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      await ctx.db.insert('contentPieces', {
        projectId: testProjectId,
        title: 'Published Content 2',
        status: 'published',
        contentType: 'blog',
        keywords: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const metrics = await t.query(api.canonical.metrics.getCanonicalMetrics, {
      projectId: testProjectId,
    });

    expect(metrics.contentCount).toBe(4);
    expect(metrics.draftContentCount).toBe(1);
    expect(metrics.scheduledContentCount).toBe(1);
    expect(metrics.publishedContentCount).toBe(2);
  });

  test('should match Dashboard counts with Keywords Library counts', async () => {
    // This test verifies the core bug fix: data consistency
    await t.run(async (ctx) => {
      for (let i = 0; i < 10; i++) {
        await ctx.db.insert('keywords', {
          projectId: testProjectId,
          keyword: `consistency test ${i}`,
          searchVolume: 100,
          status: 'active',
          source: 'manual',
          createdAt: Date.now(),
        });
      }
    });

    // Query from canonical source (what Dashboard uses)
    const metrics = await t.query(api.canonical.metrics.getCanonicalMetrics, {
      projectId: testProjectId,
    });

    // Query direct count (what Keywords page might use)
    const directCount = await t.run(async (ctx) => {
      const allKeywords = await ctx.db.query('keywords').collect();
      const projectKeywords = allKeywords.filter((k) => k.projectId === testProjectId);
      return projectKeywords.length;
    });

    // They MUST match (this is the bug we're fixing)
    expect(metrics.keywordCount).toBe(directCount);
    expect(metrics.keywordCount).toBe(10);
  });
});

// =============================================================================
// INTEGRATION TESTS: CANONICAL RATING
// =============================================================================

describe('Canonical Rating Query', () => {
  let t: ReturnType<typeof convexTest>;
  let testProjectId: Id<'projects'>;

  beforeEach(async () => {
    t = convexTest(schema);

    const result = await t.run(async (ctx) => {
      const userId = await ctx.db.insert('users', {
        email: 'rating-test@canonical.com',
        role: 'user',
        onboardingStatus: 'completed',
        createdAt: Date.now(),
      });

      const projectId = await ctx.db.insert('projects', {
        userId,
        name: 'Rating Test Project',
        websiteUrl: 'https://rating-test.com',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return { projectId };
    });

    testProjectId = result.projectId;
  });

  test('should return low rating for empty project', async () => {
    const rating = await t.query(api.canonical.rating.getCanonicalRating, {
      projectId: testProjectId,
    });

    expect(rating.rating).toBe(0);
    expect(rating.status).toBe('Needs Work');
    expect(rating.breakdown.length).toBeGreaterThan(0);
  });

  test('should increase rating with more keywords', async () => {
    // Add 25 keywords (should give score of 75 for keywords component)
    await t.run(async (ctx) => {
      for (let i = 0; i < 25; i++) {
        await ctx.db.insert('keywords', {
          projectId: testProjectId,
          keyword: `rating keyword ${i}`,
          searchVolume: 100,
          status: 'active',
          source: 'manual',
          createdAt: Date.now(),
        });
      }
    });

    const rating = await t.query(api.canonical.rating.getCanonicalRating, {
      projectId: testProjectId,
    });

    // Keywords component should show 75 (25+ keywords)
    const keywordBreakdown = rating.breakdown.find(
      (b: { component: string }) => b.component === 'Keywords'
    );
    expect(keywordBreakdown?.score).toBe(75);
    expect(rating.rating).toBeGreaterThan(0);
  });

  test('should include SEO audit in rating calculation', async () => {
    // Add an SEO audit
    await t.run(async (ctx) => {
      await ctx.db.insert('seoAudits', {
        projectId: testProjectId,
        website: 'https://rating-test.com',
        overallScore: 75,
        technicalSeo: { score: 80, issues: [], recommendations: [] },
        onPageSeo: { score: 70, issues: [], recommendations: [] },
        contentQuality: { score: 75, issues: [], recommendations: [] },
        backlinks: { score: 60, issues: [], recommendations: [] },
        priorityActions: [],
        createdAt: Date.now(),
      });
    });

    const rating = await t.query(api.canonical.rating.getCanonicalRating, {
      projectId: testProjectId,
    });

    const seoBreakdown = rating.breakdown.find(
      (b: { component: string }) => b.component === 'SEO Audit'
    );
    expect(seoBreakdown?.score).toBeGreaterThan(0);
  });

  test('should return consistent rating between Dashboard and Ask Phoo', async () => {
    // Add some data
    await t.run(async (ctx) => {
      for (let i = 0; i < 10; i++) {
        await ctx.db.insert('keywords', {
          projectId: testProjectId,
          keyword: `consistency ${i}`,
          status: 'active',
          source: 'manual',
          createdAt: Date.now(),
        });
      }

      for (let i = 0; i < 3; i++) {
        await ctx.db.insert('keywordClusters', {
          projectId: testProjectId,
          clusterName: `Cluster ${i}`,
          keywords: [],
          intent: 'informational',
          difficulty: 50,
          volumeRange: { min: 100, max: 500 },
          impactScore: 75,
          topSerpUrls: [],
          status: 'active',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    });

    // Query twice (simulating Dashboard and Ask Phoo)
    const dashboardRating = await t.query(api.canonical.rating.getCanonicalRating, {
      projectId: testProjectId,
    });

    const askPhooRating = await t.query(api.canonical.rating.getCanonicalRating, {
      projectId: testProjectId,
    });

    // They MUST be identical (this is the core bug we're fixing)
    expect(dashboardRating.rating).toBe(askPhooRating.rating);
    expect(dashboardRating.status).toBe(askPhooRating.status);
  });

  test('should provide actionable top opportunity', async () => {
    const rating = await t.query(api.canonical.rating.getCanonicalRating, {
      projectId: testProjectId,
    });

    expect(rating.topOpportunity).toBeDefined();
    expect(rating.topOpportunity.length).toBeGreaterThan(0);
  });

  test('should include insights for improvement', async () => {
    const rating = await t.query(api.canonical.rating.getCanonicalRating, {
      projectId: testProjectId,
    });

    expect(rating.insights).toBeDefined();
    expect(Array.isArray(rating.insights)).toBe(true);
  });
});

// =============================================================================
// DATA CONSISTENCY TESTS (P0 Bug Verification)
// =============================================================================

describe('Data Consistency Verification', () => {
  let t: ReturnType<typeof convexTest>;
  let testProjectId: Id<'projects'>;

  beforeEach(async () => {
    t = convexTest(schema);

    const result = await t.run(async (ctx) => {
      const userId = await ctx.db.insert('users', {
        email: 'consistency@test.com',
        role: 'user',
        onboardingStatus: 'completed',
        createdAt: Date.now(),
      });

      const projectId = await ctx.db.insert('projects', {
        userId,
        name: 'Consistency Test',
        websiteUrl: 'https://consistency.test',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Seed with realistic data
      for (let i = 0; i < 15; i++) {
        await ctx.db.insert('keywords', {
          projectId,
          keyword: `seo keyword ${i}`,
          searchVolume: 100 + i * 10,
          status: 'active',
          source: 'manual',
          createdAt: Date.now(),
        });
      }

      for (let i = 0; i < 4; i++) {
        await ctx.db.insert('keywordClusters', {
          projectId,
          clusterName: `Topic ${i}`,
          keywords: [`kw${i}`],
          intent: 'informational',
          difficulty: 40 + i * 5,
          volumeRange: { min: 50, max: 200 },
          impactScore: 70,
          topSerpUrls: [],
          status: 'active',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }

      for (let i = 0; i < 6; i++) {
        await ctx.db.insert('contentPieces', {
          projectId,
          title: `Blog Post ${i}`,
          status: i < 2 ? 'draft' : i < 4 ? 'scheduled' : 'published',
          contentType: 'blog',
          keywords: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }

      return { projectId };
    });

    testProjectId = result.projectId;
  });

  test('metrics and rating should calculate from same data source', async () => {
    const metrics = await t.query(api.canonical.metrics.getCanonicalMetrics, {
      projectId: testProjectId,
    });

    const rating = await t.query(api.canonical.rating.getCanonicalRating, {
      projectId: testProjectId,
    });

    // Verify both are using the same underlying data
    expect(metrics.keywordCount).toBe(15);
    expect(metrics.clusterCount).toBe(4);
    expect(metrics.contentCount).toBe(6);

    // Rating should reflect the data we seeded
    expect(rating.rating).toBeGreaterThan(0);
    expect(rating.breakdown.length).toBe(5); // SEO, Keywords, Clusters, Content, GEO
  });

  test('should never show zero when data exists (P0 bug)', async () => {
    const metrics = await t.query(api.canonical.metrics.getCanonicalMetrics, {
      projectId: testProjectId,
    });

    // This was the P0 bug: strategyData = null caused zeros
    expect(metrics.keywordCount).not.toBe(0);
    expect(metrics.clusterCount).not.toBe(0);
    expect(metrics.contentCount).not.toBe(0);
  });
});
