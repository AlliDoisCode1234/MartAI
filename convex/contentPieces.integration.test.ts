import { convexTest } from 'convex-test';
import { expect, test, describe, beforeEach } from 'vitest';
import { api } from './_generated/api';
import { Id } from './_generated/dataModel';
import schema from './schema';

/**
 * Content Pieces Integration Tests
 *
 * REAL integration tests that call actual Convex handlers.
 * These verify the code WORKS, not just that it compiles.
 *
 * Using REAL industry data fixtures from content_intelligence_datasets.
 */

// =============================================================================
// REAL INDUSTRY FIXTURES
// =============================================================================

const FIXTURES = {
  medSpa: {
    title: 'Expert Lip Fillers Kansas City Can Trust',
    contentType: 'service' as const,
    keywords: ['Lip Fillers Kansas City', 'Med Spa Near Me', 'Botox'],
  },
  electricalB2B: {
    title: 'Commercial Electrician Los Angeles',
    contentType: 'areasWeServe' as const,
    keywords: ['commercial electrician los angeles', 'electrical contractor LA'],
  },
  education: {
    title: 'Wonder Math vs Kumon: Complete Comparison 2026',
    contentType: 'blog' as const,
    keywords: ['Kumon', 'Mathnasium', 'Wonder Math'],
  },
  cleaning: {
    title: 'Commercial Cleaning Near Me - State to State',
    contentType: 'landing' as const,
    keywords: ['commercial cleaning near me', 'janitorial services'],
  },
  tourism: {
    title: 'Unforgettable Kansas City Tours',
    contentType: 'service' as const,
    keywords: ['kansas city tours', 'what to do in kansas city'],
  },
};

// =============================================================================
// INTEGRATION TESTS
// =============================================================================

describe('ContentPieces CRUD Integration', () => {
  let t: ReturnType<typeof convexTest>;
  let authT: ReturnType<ReturnType<typeof convexTest>['withIdentity']>;
  let testProjectId: Id<'projects'>;
  let testUserId: Id<'users'>;

  beforeEach(async () => {
    t = convexTest(schema);

    // Seed a test project for content pieces
    const result = await t.run(async (ctx) => {
      // Create test user first
      const userId = await ctx.db.insert('users', {
        email: 'test@content-studio.com',
        role: 'user',
        onboardingStatus: 'completed',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Create test project
      const projectId = await ctx.db.insert('projects', {
        userId,
        name: 'Content Studio Test Project',
        websiteUrl: 'https://test-content-studio.com',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return { userId, projectId };
    });

    testUserId = result.userId;
    testProjectId = result.projectId;

    // Set authenticated identity for all tests
    authT = t.withIdentity({ subject: testUserId });
  });

  describe('Create Content Piece', () => {
    test('should create content piece with all required fields', async () => {
      const fixture = FIXTURES.medSpa;

      const contentPieceId = await authT.mutation(api.contentPieces.create, {
        projectId: testProjectId,
        contentType: fixture.contentType,
        title: fixture.title,
        keywords: fixture.keywords,
      });

      expect(contentPieceId).toBeDefined();

      // Verify it was actually created
      const piece = await authT.query(api.contentPieces.getById, {
        contentPieceId,
      });

      expect(piece).not.toBeNull();
      expect(piece?.title).toBe(fixture.title);
      expect(piece?.contentType).toBe(fixture.contentType);
      expect(piece?.status).toBe('generating');
    });

    test('should create content piece for each industry', async () => {
      const createdIds: any[] = [];

      for (const [industry, fixture] of Object.entries(FIXTURES)) {
        const id = await authT.mutation(api.contentPieces.create, {
          projectId: testProjectId,
          contentType: fixture.contentType,
          title: fixture.title,
          keywords: fixture.keywords,
        });

        expect(id).toBeDefined();
        createdIds.push({ industry, id });
      }

      expect(createdIds.length).toBe(5);
    });
  });

  describe('Read Content Pieces', () => {
    test('should list content pieces by project', async () => {
      // Create 3 pieces
      for (let i = 0; i < 3; i++) {
        await authT.mutation(api.contentPieces.create, {
          projectId: testProjectId,
          contentType: 'blog',
          title: `Test Blog ${i + 1}`,
          keywords: ['test', 'keyword'],
        });
      }

      // List them
      const pieces = await authT.query(api.contentPieces.listByProject, {
        projectId: testProjectId,
      });

      expect(pieces.length).toBe(3);
    });

    test('should filter by status', async () => {
      // Create pieces with different statuses
      const draftId = await authT.mutation(api.contentPieces.create, {
        projectId: testProjectId,
        contentType: 'blog',
        title: 'Draft Piece',
        keywords: ['draft'],
      });

      // Update one to published
      await authT.mutation(api.contentPieces.update, {
        contentPieceId: draftId,
        status: 'published',
      });

      // Query for drafts only
      const drafts = await authT.query(api.contentPieces.listByProject, {
        projectId: testProjectId,
        status: 'draft',
      });

      // The published one should not appear
      expect(drafts.find((p: any) => p._id === draftId)).toBeUndefined();
    });
  });

  describe('Update Content Piece', () => {
    test('should update title and content', async () => {
      const id = await authT.mutation(api.contentPieces.create, {
        projectId: testProjectId,
        contentType: 'blog',
        title: 'Original Title',
        keywords: ['test'],
      });

      await authT.mutation(api.contentPieces.update, {
        contentPieceId: id,
        title: 'Updated Title',
        content: '# Updated Content\n\nThis is the updated body.',
      });

      const updated = await authT.query(api.contentPieces.getById, {
        contentPieceId: id,
      });

      expect(updated?.title).toBe('Updated Title');
      expect(updated?.content).toContain('Updated Content');
    });

    test('should update SEO score', async () => {
      const id = await authT.mutation(api.contentPieces.create, {
        projectId: testProjectId,
        contentType: 'blog',
        title: 'SEO Test',
        keywords: ['seo', 'test'],
      });

      await authT.mutation(api.contentPieces.update, {
        contentPieceId: id,
        seoScore: 92,
        wordCount: 1500,
      });

      const updated = await authT.query(api.contentPieces.getById, {
        contentPieceId: id,
      });

      expect(updated?.seoScore).toBe(92);
      expect(updated?.wordCount).toBe(1500);
    });
  });

  describe('Delete Content Piece', () => {
    test('should remove content piece', async () => {
      const id = await authT.mutation(api.contentPieces.create, {
        projectId: testProjectId,
        contentType: 'blog',
        title: 'To Be Deleted',
        keywords: ['delete'],
      });

      // Verify it exists
      let piece = await authT.query(api.contentPieces.getById, { contentPieceId: id });
      expect(piece).not.toBeNull();

      // Delete it
      await authT.mutation(api.contentPieces.remove, { contentPieceId: id });

      // Verify it's gone
      piece = await authT.query(api.contentPieces.getById, { contentPieceId: id });
      expect(piece).toBeNull();
    });
  });

  describe('Calendar Scheduling', () => {
    test('should schedule content for future date', async () => {
      const id = await authT.mutation(api.contentPieces.create, {
        projectId: testProjectId,
        contentType: 'blog',
        title: 'Scheduled Post',
        keywords: ['schedule'],
      });

      const futureDate = Date.now() + 7 * 24 * 60 * 60 * 1000; // 1 week

      await authT.mutation(api.contentPieces.schedule, {
        contentPieceId: id,
        publishDate: futureDate,
      });

      const scheduled = await authT.query(api.contentPieces.getById, {
        contentPieceId: id,
      });

      expect(scheduled?.status).toBe('scheduled');
      expect(scheduled?.publishDate).toBe(futureDate);
    });

    test('should list scheduled content by date range', async () => {
      // Create and schedule multiple pieces
      const now = Date.now();

      for (let i = 1; i <= 3; i++) {
        const id = await authT.mutation(api.contentPieces.create, {
          projectId: testProjectId,
          contentType: 'blog',
          title: `Scheduled ${i}`,
          keywords: ['schedule'],
        });

        await authT.mutation(api.contentPieces.schedule, {
          contentPieceId: id,
          publishDate: now + i * 24 * 60 * 60 * 1000, // Day 1, 2, 3
        });
      }

      const scheduled = await authT.query(api.contentPieces.listScheduled, {
        projectId: testProjectId,
        startDate: now,
        endDate: now + 4 * 24 * 60 * 60 * 1000, // 4 days
      });

      expect(scheduled.length).toBe(3);
    });
  });
});

describe('Content Pieces Edge Cases', () => {
  let t: ReturnType<typeof convexTest>;
  let authT: ReturnType<ReturnType<typeof convexTest>['withIdentity']>;
  let testProjectId: Id<'projects'>;
  let testUserId: Id<'users'>;

  beforeEach(async () => {
    t = convexTest(schema);

    const result = await t.run(async (ctx) => {
      const userId = await ctx.db.insert('users', {
        email: 'edge-test@content-studio.com',
        role: 'user',
        onboardingStatus: 'completed',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      const projectId = await ctx.db.insert('projects', {
        userId,
        name: 'Edge Case Test Project',
        websiteUrl: 'https://edge-test.com',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return { userId, projectId };
    });

    testUserId = result.userId;
    testProjectId = result.projectId;

    // Set authenticated identity for all tests
    authT = t.withIdentity({ subject: testUserId });
  });

  test('should handle empty keywords array', async () => {
    const id = await authT.mutation(api.contentPieces.create, {
      projectId: testProjectId,
      contentType: 'blog',
      title: 'No Keywords',
      keywords: [],
    });

    expect(id).toBeDefined();

    const piece = await authT.query(api.contentPieces.getById, { contentPieceId: id });
    expect(piece?.keywords).toEqual([]);
  });

  test('should handle very long title', async () => {
    const longTitle = 'A'.repeat(500);

    const id = await authT.mutation(api.contentPieces.create, {
      projectId: testProjectId,
      contentType: 'blog',
      title: longTitle,
      keywords: ['test'],
    });

    const piece = await authT.query(api.contentPieces.getById, { contentPieceId: id });
    expect(piece?.title).toBe(longTitle);
  });

  test('should handle special characters in title', async () => {
    const specialTitle = 'SEO Tips: 10 "Ways" to <Improve> & Rank #1 @ Google!';

    const id = await authT.mutation(api.contentPieces.create, {
      projectId: testProjectId,
      contentType: 'blog',
      title: specialTitle,
      keywords: ['seo', 'tips'],
    });

    const piece = await authT.query(api.contentPieces.getById, { contentPieceId: id });
    expect(piece?.title).toBe(specialTitle);
  });

  test('should return empty list for project with no content', async () => {
    const pieces = await authT.query(api.contentPieces.listByProject, {
      projectId: testProjectId,
    });

    expect(pieces).toEqual([]);
  });

  test('should reject scheduling content in the past', async () => {
    // Create content first
    const id = await authT.mutation(api.contentPieces.create, {
      projectId: testProjectId,
      contentType: 'blog',
      title: 'Past Scheduled Content',
      keywords: ['test'],
    });

    // Attempt to schedule in the past (1 hour ago)
    const pastDate = Date.now() - 60 * 60 * 1000;

    await expect(
      t.mutation(api.contentPieces.schedule, {
        contentPieceId: id,
        publishDate: pastDate,
      })
    ).rejects.toThrow('Publish date must be in the future');
  });
});
