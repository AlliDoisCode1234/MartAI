/**
 * Writer Personas Integration Tests
 *
 * Tests the AI Writer Personas learning and evolution system.
 * Following Kent C. Dodds Testing Trophy - mostly integration tests.
 *
 * Test Hierarchy:
 * __tests__/convex/ai/
 * └── writerPersonas.test.ts (this file)
 */

import { convexTest } from 'convex-test';
import { expect, describe, it, beforeEach } from 'vitest';
import { api, internal } from '../../../convex/_generated/api';
import schema from '../../../convex/schema';

describe('AI Writer Personas', () => {
  describe('getOrCreatePersona', () => {
    it('should create a default persona for a new project', async () => {
      const t = convexTest(schema);

      // Setup: Create user and project
      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
          createdAt: Date.now(),
        });
      });

      const projectId = await t.run(async (ctx) => {
        return await ctx.db.insert('projects', {
          name: 'Test Project',
          userId,
          websiteUrl: 'https://test.com',
          industry: 'Technology',
          targetAudience: 'B2B Decision Makers',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });

      // Act: Get or create persona
      const persona = await t
        .withIdentity({ email: 'test@example.com' })
        .mutation(api.ai.writerPersonas.index.getOrCreatePersona, {
          projectId,
        });

      // Assert
      expect(persona).toBeDefined();
      expect(persona?.name).toBe('Content Expert');
      expect(persona?.status).toBe('training');
      expect(persona?.projectId).toBe(projectId);
      expect(persona?.industry).toBe('Technology');
    });

    it('should return existing persona if one exists', async () => {
      const t = convexTest(schema);

      // Setup: Create user, project, and existing persona
      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
          createdAt: Date.now(),
        });
      });

      const projectId = await t.run(async (ctx) => {
        return await ctx.db.insert('projects', {
          name: 'Test Project',
          userId,
          websiteUrl: 'https://test.com',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });

      const existingPersonaId = await t.run(async (ctx) => {
        return await ctx.db.insert('aiWriterPersonas', {
          projectId,
          name: 'Existing Persona',
          status: 'active',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });

      // Act
      const persona = await t
        .withIdentity({ email: 'test@example.com' })
        .mutation(api.ai.writerPersonas.index.getOrCreatePersona, {
          projectId,
        });

      // Assert
      expect(persona?._id).toBe(existingPersonaId);
      expect(persona?.name).toBe('Existing Persona');
    });
  });

  describe('updatePersona', () => {
    it('should update persona brand voice settings', async () => {
      const t = convexTest(schema);

      // Setup
      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'test@example.com',
          createdAt: Date.now(),
        });
      });

      const projectId = await t.run(async (ctx) => {
        return await ctx.db.insert('projects', {
          name: 'Test Project',
          userId,
          websiteUrl: 'https://test.com',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });

      const personaId = await t.run(async (ctx) => {
        return await ctx.db.insert('aiWriterPersonas', {
          projectId,
          name: 'Test Persona',
          status: 'active',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });

      // Act
      const updated = await t
        .withIdentity({ email: 'test@example.com' })
        .mutation(api.ai.writerPersonas.index.updatePersona, {
          personaId,
          brandVoice: {
            tone: 'casual',
            style: 'storytelling',
            vocabulary: ['awesome', 'incredible'],
            avoidWords: ['synergy', 'leverage'],
          },
        });

      // Assert
      expect(updated?.brandVoice?.tone).toBe('casual');
      expect(updated?.brandVoice?.style).toBe('storytelling');
      expect(updated?.brandVoice?.vocabulary).toContain('awesome');
      expect(updated?.brandVoice?.avoidWords).toContain('synergy');
    });
  });

  describe('addLearnedRule', () => {
    it('should add an explicit rule to the persona', async () => {
      const t = convexTest(schema);

      // Setup
      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'test@example.com',
          createdAt: Date.now(),
        });
      });

      const projectId = await t.run(async (ctx) => {
        return await ctx.db.insert('projects', {
          name: 'Test Project',
          userId,
          websiteUrl: 'https://test.com',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });

      const personaId = await t.run(async (ctx) => {
        return await ctx.db.insert('aiWriterPersonas', {
          projectId,
          name: 'Test Persona',
          status: 'active',
          learnedRules: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });

      // Act
      await t
        .withIdentity({ email: 'test@example.com' })
        .mutation(api.ai.writerPersonas.index.addLearnedRule, {
          personaId,
          rule: 'Always use Oxford comma',
        });

      // Assert
      const persona = await t.run(async (ctx) => {
        return await ctx.db.get(personaId);
      });

      expect(persona?.learnedRules).toHaveLength(1);
      expect(persona?.learnedRules?.[0].rule).toBe('Always use Oxford comma');
      expect(persona?.learnedRules?.[0].source).toBe('explicit');
      expect(persona?.learnedRules?.[0].confidence).toBe(1.0);
    });
  });

  describe('updateMetrics', () => {
    it('should update metrics and transition from training to active', async () => {
      const t = convexTest(schema);

      // Setup
      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          email: 'test@example.com',
          createdAt: Date.now(),
        });
      });

      const projectId = await t.run(async (ctx) => {
        return await ctx.db.insert('projects', {
          name: 'Test Project',
          userId,
          websiteUrl: 'https://test.com',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });

      const personaId = await t.run(async (ctx) => {
        return await ctx.db.insert('aiWriterPersonas', {
          projectId,
          name: 'Test Persona',
          status: 'training',
          trainingProgress: 0,
          metrics: {
            totalGenerated: 0,
            approvedCount: 0,
            editedCount: 0,
            rejectedCount: 0,
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });

      // Act: Simulate 5 content generations
      for (let i = 0; i < 5; i++) {
        await t.mutation(internal.ai.writerPersonas.index.updateMetrics, {
          personaId,
          outcome: 'approved',
          seoScore: 85 + i,
        });
      }

      // Assert
      const persona = await t.run(async (ctx) => {
        return await ctx.db.get(personaId);
      });

      expect(persona?.status).toBe('active');
      expect(persona?.trainingProgress).toBe(100);
      expect(persona?.metrics?.totalGenerated).toBe(5);
      expect(persona?.metrics?.approvedCount).toBe(5);
      expect(persona?.metrics?.avgSeoScore).toBeGreaterThan(85);
    });
  });

  describe('buildPersonaContext', () => {
    it('should build a comprehensive context string', async () => {
      // This is a unit test for the pure function
      const { buildPersonaContext } = await import('../../../convex/ai/writerPersonas/index');

      const context = buildPersonaContext({
        name: 'Brand Expert',
        industry: 'Medical Aesthetics',
        targetAudience: 'Women 35-55',
        brandVoice: {
          tone: 'professional',
          style: 'educational',
          vocabulary: ['rejuvenation', 'non-invasive'],
          avoidWords: ['cheap', 'discount'],
        },
        learnedRules: [
          { rule: 'Use second person (you)', confidence: 0.9 },
          { rule: 'Include before/after mentions', confidence: 0.8 },
        ],
        uniqueSellingPoints: ['FDA-approved treatments', 'Board-certified staff'],
      });

      expect(context).toContain('Brand Expert');
      expect(context).toContain('Medical Aesthetics');
      expect(context).toContain('Women 35-55');
      expect(context).toContain('professional');
      expect(context).toContain('rejuvenation');
      expect(context).toContain('AVOID: cheap, discount');
      expect(context).toContain('Use second person');
      expect(context).toContain('FDA-approved treatments');
    });
  });
});
