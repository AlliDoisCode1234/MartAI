import { describe, it, expect, beforeEach } from 'vitest';
import { internal } from '../../convex/_generated/api';
import { createTestContext, seedUser, seedProject } from '../convex/testHelpers';

/**
 * Content Generation Integration Tests
 *
 * Uses established testHelpers pattern with modules.
 * Tests internal mutations directly.
 */

// Real MedSpa fixture
const MED_SPA_FIXTURE = {
  title: 'Expert Lip Fillers Kansas City Can Trust',
  keywords: ['Lip Fillers Kansas City', 'Med Spa Near Me', 'Botox'],
};

const MOCK_AI_CONTENT = `# Expert Lip Fillers Kansas City Can Trust

Are you considering lip fillers in Kansas City? According to the American Society of Plastic Surgeons, lip augmentation procedures increased by 43% in 2024.

## What Are Lip Fillers?

Lip fillers are injectable treatments using hyaluronic acid.

## Ready to Transform Your Lips?

Contact us today for your consultation.
`;

describe('Content Generation Integration', () => {
  let t: ReturnType<typeof createTestContext>;

  beforeEach(() => {
    t = createTestContext();
  });

  describe('createContentPiece Mutation', () => {
    it('should create content piece with generating status', async () => {
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      const contentPieceId = await t.mutation(internal.contentGeneration.createContentPiece, {
        projectId,
        contentType: 'service',
        title: MED_SPA_FIXTURE.title,
        keywords: MED_SPA_FIXTURE.keywords,
      });

      expect(contentPieceId).toBeDefined();

      const piece = await t.run(async (ctx) => ctx.db.get(contentPieceId));
      expect(piece?.status).toBe('generating');
      expect(piece?.title).toBe(MED_SPA_FIXTURE.title);
    });
  });

  describe('updateContentPiece Mutation', () => {
    it('should update with generated content', async () => {
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      const contentPieceId = await t.mutation(internal.contentGeneration.createContentPiece, {
        projectId,
        contentType: 'service',
        title: MED_SPA_FIXTURE.title,
        keywords: MED_SPA_FIXTURE.keywords,
      });

      await t.mutation(internal.contentGeneration.updateContentPiece, {
        contentPieceId,
        content: MOCK_AI_CONTENT,
        wordCount: 100,
        seoScore: 92,
        status: 'draft',
        h2Outline: ['What Are Lip Fillers?'],
      });

      const updated = await t.run(async (ctx) => ctx.db.get(contentPieceId));
      expect(updated?.status).toBe('draft');
      expect(updated?.seoScore).toBe(92);
    });

    it('should track generation attempts', async () => {
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      const contentPieceId = await t.mutation(internal.contentGeneration.createContentPiece, {
        projectId,
        contentType: 'blog',
        title: 'Test Blog',
        keywords: ['test'],
      });

      await t.mutation(internal.contentGeneration.updateContentPiece, {
        contentPieceId,
        generationAttempts: 2,
      });

      const result = await t.run(async (ctx) => ctx.db.get(contentPieceId));
      expect(result?.generationAttempts).toBe(2);
    });
  });

  describe('Quality Metrics Storage', () => {
    it('should store quality breakdown', async () => {
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      const contentPieceId = await t.mutation(internal.contentGeneration.createContentPiece, {
        projectId,
        contentType: 'service',
        title: 'Test',
        keywords: ['test'],
      });

      const qualityMetrics = {
        wordCountScore: 85,
        h2Score: 90,
        keywordScore: 88,
        linkScore: 50,
        readabilityScore: 78,
      };

      await t.mutation(internal.contentGeneration.updateContentPiece, {
        contentPieceId,
        qualityMetrics,
        seoScore: 78,
        status: 'draft',
      });

      const result = await t.run(async (ctx) => ctx.db.get(contentPieceId));
      expect(result?.qualityMetrics).toEqual(qualityMetrics);
    });
  });

  describe('All Content Types', () => {
    const types = [
      'homepage',
      'about',
      'service',
      'landing',
      'blog',
      'blogVersus',
      'blogVideo',
      'contentRefresh',
      'leadMagnet',
      'paidProduct',
      'areasWeServe',
      'employment',
      'mentorship',
      'donate',
      'events',
      'partner',
      'program',
    ];

    it.each(types)('accepts %s content type', async (contentType) => {
      const userId = await seedUser(t);
      const projectId = await seedProject(t, userId);

      const id = await t.mutation(internal.contentGeneration.createContentPiece, {
        projectId,
        contentType: contentType as any,
        title: `Test ${contentType}`,
        keywords: ['test'],
      });

      expect(id).toBeDefined();
    });
  });
});

describe('Quality Engine with Real Content', () => {
  it('should score medical aesthetics content', async () => {
    const { calculateContentQuality } = await import('../../lib/ai/qualityEngine');
    const { selectWriterPersona } = await import('../../lib/ai/writerPersonas');

    const persona = selectWriterPersona('service', 'medical aesthetics');
    const result = calculateContentQuality(
      MOCK_AI_CONTENT,
      'service',
      MED_SPA_FIXTURE.keywords,
      persona,
      1200
    );

    expect(result.overallScore).toBeGreaterThan(50);
    expect(result.strategic.summary.hasStatistics).toBe(true);
  });
});
