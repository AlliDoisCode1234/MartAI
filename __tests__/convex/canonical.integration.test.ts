import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTestContext, seedUser, seedProject } from './testHelpers';
import { api } from '../../convex/_generated/api';

(globalThis as any).vi = vi;

describe('Canonical Data Layer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('canonical.metrics.getCanonicalMetrics', () => {
    it('should accurately aggregate metrics for a seeded project', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      // Seed some data
      await t.run(async (ctx) => {
        // Keywords
        await ctx.db.insert('keywords', {
          projectId,
          keyword: 'test kw 1',
          status: 'implemented',
          createdAt: Date.now(),
        });
        await ctx.db.insert('keywords', {
          projectId,
          keyword: 'test kw 2',
          status: 'suggested',
          createdAt: Date.now(),
        });

        // Content
        await ctx.db.insert('contentPieces', {
          projectId,
          title: 'Draft Piece',
          status: 'draft',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        await ctx.db.insert('contentPieces', {
          projectId,
          title: 'Published Piece',
          status: 'published',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });

        // Calendar
        await ctx.db.insert('contentCalendars', {
          projectId,
          title: 'Dec Calendar',
          contentType: 'blog',
          status: 'scheduled',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });

      const metrics = await t.query(api.canonical.metrics.getCanonicalMetrics, { projectId });

      expect(metrics.keywordCount).toBe(2);
      expect(metrics.keywords.byStatus['implemented']).toBe(1);
      expect(metrics.keywords.byStatus['suggested']).toBe(1);

      expect(metrics.contentCount).toBe(2);
      expect(metrics.draftContentCount).toBe(1);
      expect(metrics.publishedContentCount).toBe(1);

      expect(metrics.calendarItemCount).toBe(1);
      expect(metrics.clusterCount).toBe(0);
    });
  });

  describe('canonical.rating.getCanonicalRating', () => {
    it('should calculate the rating correctly based on seeded data', async () => {
      const t = createTestContext();
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      // When no data exists, rating should be low
      const initialRating = await t.query(api.canonical.rating.getCanonicalRating, { projectId });
      expect(initialRating.rating).toBeLessThan(50);
      expect(initialRating.breakdown.length).toBe(5); // SEO, Keywords, Clusters, Content, GEO

      // Seed data to boost score
      await t.run(async (ctx) => {
        // High SEO Audit
        await ctx.db.insert('seoAudits', {
          projectId,
          website: 'https://example.com',
          overallScore: 90,
          technicalSeo: { score: 90, issues: [], recommendations: [] },
          onPageSeo: { score: 95, issues: [], recommendations: [] },
          contentQuality: { score: 85, issues: [], recommendations: [] },
          backlinks: { score: 80, issues: [], recommendations: [] },
          priorityActions: [],
          createdAt: Date.now(),
        });

        // Many Keywords
        for (let i = 0; i < 50; i++) {
          await ctx.db.insert('keywords', {
            projectId,
            keyword: `kw${i}`,
            status: 'approved',
            createdAt: Date.now(),
          });
        }
      });

      const boostedRating = await t.query(api.canonical.rating.getCanonicalRating, { projectId });
      expect(boostedRating.rating).toBeGreaterThan(initialRating.rating);

      const seoComponent = boostedRating.breakdown.find((b) => b.component === 'SEO Audit');
      expect(seoComponent?.score).toBe(90); // Avg of 90, 95, 85

      const keywordsComponent = boostedRating.breakdown.find((b) => b.component === 'Keywords');
      expect(keywordsComponent?.score).toBe(100); // Because >= 50 keywords seeded

      await t.finishAllScheduledFunctions(() => vi.runAllTimers());
    });
  });
});
