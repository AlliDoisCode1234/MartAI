/**
 * Comprehensive E2E Integration Test
 *
 * Tests the full beta user flow:
 * 1. Beta User Signup (via waitlist)
 * 2. Onboarding (skipping pricing/payment)
 * 3. Content Generation for ALL 17 content types
 * 4. Score verification (>= 90) and library storage
 *
 * Run with: npx convex run testing.betaUserFlow:runBetaE2E
 */

import { action, internalAction, internalMutation, internalQuery } from '../_generated/server';
import { v } from 'convex/values';
import { internal, api } from '../_generated/api';
import { ContentTypeId } from '../phoo/contentTypes';

// All 17 content types to test
const ALL_CONTENT_TYPES: ContentTypeId[] = [
  'homepage',
  'about',
  'service',
  'blog',
  'blogVersus',
  'leadMagnet',
  'paidProduct',
  'landing',
  'areasWeServe',
  'employment',
  'mentorship',
  'donate',
  'events',
  'partner',
  'program',
  'contentRefresh',
  'blogVideo',
];

// Subset for quick smoke tests (3 diverse types)
const SMOKE_TEST_TYPES: ContentTypeId[] = ['blog', 'service', 'landing'];

// ============================================================================
// Helper Mutations
// ============================================================================

/**
 * Create beta user with waitlist acquisition source
 */
export const createBetaUser = internalMutation({
  args: { email: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const now = Date.now();
    const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;

    return await ctx.db.insert('users', {
      email: args.email,
      name: args.name || 'E2E Beta Tester',
      role: 'user',
      onboardingStatus: 'completed',
      accountStatus: 'active',
      acquisitionSource: 'waitlist_beta',
      isBetaUser: true,
      betaExpiresAt: now + SIX_MONTHS_MS,
      membershipTier: 'solo',
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Create test project with industry context
 */
export const createTestProject = internalMutation({
  args: {
    userId: v.id('users'),
    name: v.string(),
    url: v.string(),
    industry: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert('projects', {
      userId: args.userId,
      name: args.name,
      websiteUrl: args.url,
      industry: args.industry,
      projectType: 'own',
      urlLocked: true,
      serpAnalysisUsed: false,
      targetAudience: 'Business Owners',
      businessGoals: 'Growth',
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Get content piece by ID
 */
export const getContentPiece = internalQuery({
  args: { contentPieceId: v.id('contentPieces') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.contentPieceId);
  },
});

/**
 * Get all content pieces for a project
 */
export const getProjectContentPieces = internalQuery({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('contentPieces')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
  },
});

/**
 * Cleanup test data
 */
export const cleanupTestData = internalMutation({
  args: { userId: v.id('users'), projectId: v.id('projects') },
  handler: async (ctx, args) => {
    // Delete all content pieces for project
    const contentPieces = await ctx.db
      .query('contentPieces')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    for (const piece of contentPieces) {
      await ctx.db.delete(piece._id);
    }

    // Delete project
    await ctx.db.delete(args.projectId);

    // Delete subscription if exists
    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first();
    if (subscription) {
      await ctx.db.delete(subscription._id);
    }

    // Delete user
    await ctx.db.delete(args.userId);

    return { cleaned: true };
  },
});

// ============================================================================
// Main E2E Test Actions
// ============================================================================

interface ContentResult {
  contentType: ContentTypeId;
  contentPieceId: string;
  title: string;
  seoScore: number;
  wordCount: number;
  passed: boolean;
  error?: string;
}

interface E2EResult {
  status: 'PASSED' | 'FAILED' | 'PARTIAL';
  userId: string;
  projectId: string;
  totalTypes: number;
  passedCount: number;
  failedCount: number;
  results: ContentResult[];
  summary: string;
  durationMs: number;
}

/**
 * Run full E2E test for a single content type
 */
export const generateSingleContentType = internalAction({
  args: {
    projectId: v.id('projects'),
    userId: v.id('users'),
    contentType: v.string(),
  },
  handler: async (ctx, args): Promise<ContentResult> => {
    const contentType = args.contentType as ContentTypeId;
    const title = `E2E Test: ${contentType} - ${Date.now()}`;
    const keywords = ['test keyword', 'e2e validation', contentType];

    try {
      console.log(`[E2E] Generating ${contentType}...`);

      const contentPieceId = await ctx.runAction(
        internal.contentGeneration.generateContentInternal,
        {
          projectId: args.projectId,
          userId: args.userId,
          contentType,
          title,
          keywords,
        }
      );

      // Fetch the generated content
      const content = await ctx.runQuery(internal.testing.betaUserFlow.getContentPiece, {
        contentPieceId,
      });

      const seoScore = content?.seoScore || 0;
      const wordCount = content?.wordCount || 0;
      const passed = seoScore >= 90;

      console.log(`[E2E] ${contentType}: Score=${seoScore}, Words=${wordCount}, Passed=${passed}`);

      return {
        contentType,
        contentPieceId,
        title,
        seoScore,
        wordCount,
        passed,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[E2E] ${contentType} FAILED:`, message);
      return {
        contentType,
        contentPieceId: '',
        title,
        seoScore: 0,
        wordCount: 0,
        passed: false,
        error: message,
      };
    }
  },
});

/**
 * Full Beta User E2E Flow - Tests all content types
 *
 * Usage: npx convex run testing.betaUserFlow:runBetaE2E --smokeTest true
 */
export const runBetaE2E = action({
  args: {
    targetUrl: v.optional(v.string()),
    industry: v.optional(v.string()),
    smokeTest: v.optional(v.boolean()), // Only test 3 types instead of 17
  },
  handler: async (ctx, args): Promise<E2EResult> => {
    const startTime = Date.now();
    const targetUrl = args.targetUrl || 'https://test-company.com';
    const industry = args.industry || 'SaaS';
    const contentTypes = args.smokeTest ? SMOKE_TEST_TYPES : ALL_CONTENT_TYPES;

    console.log('='.repeat(60));
    console.log('STARTING BETA USER E2E VALIDATION');
    console.log(`Content Types: ${contentTypes.length} (${args.smokeTest ? 'Smoke' : 'Full'})`);
    console.log('='.repeat(60));

    // =========================================================================
    // STEP 1: Create Beta User
    // =========================================================================
    const email = `e2e_beta_${Date.now()}@test.phoo.ai`;
    const userId = await ctx.runMutation(internal.testing.betaUserFlow.createBetaUser, {
      email,
      name: 'E2E Beta Tester',
    });
    console.log(`[E2E] Step 1: Beta User created: ${userId}`);

    // =========================================================================
    // STEP 2: Provision Solo Tier (Beta users get solo)
    // =========================================================================
    await ctx.runMutation(internal.subscriptions.subscriptions.upsertSubscription, {
      userId,
      planTier: 'solo',
      status: 'active',
      oneTimeFeePaid: false,
      startsAt: Date.now(),
    });
    console.log('[E2E] Step 2: Solo subscription provisioned');

    // =========================================================================
    // STEP 3: Create Project
    // =========================================================================
    const projectId = await ctx.runMutation(internal.testing.betaUserFlow.createTestProject, {
      userId,
      name: 'E2E Validation Project',
      url: targetUrl,
      industry,
    });
    console.log(`[E2E] Step 3: Project created: ${projectId}`);

    // =========================================================================
    // STEP 4: Generate Content for Each Type
    // =========================================================================
    console.log(`[E2E] Step 4: Generating ${contentTypes.length} content types...`);

    const results: ContentResult[] = [];

    for (const contentType of contentTypes) {
      const result = await ctx.runAction(internal.testing.betaUserFlow.generateSingleContentType, {
        projectId,
        userId,
        contentType,
      });
      results.push(result);
    }

    // =========================================================================
    // STEP 5: Verify Content Library
    // =========================================================================
    const allContent = await ctx.runQuery(internal.testing.betaUserFlow.getProjectContentPieces, {
      projectId,
    });
    console.log(`[E2E] Step 5: Content library has ${allContent.length} pieces`);

    // =========================================================================
    // Calculate Results
    // =========================================================================
    const passedCount = results.filter((r) => r.passed).length;
    const failedCount = results.filter((r) => !r.passed).length;
    const status: 'PASSED' | 'FAILED' | 'PARTIAL' =
      failedCount === 0 ? 'PASSED' : passedCount === 0 ? 'FAILED' : 'PARTIAL';

    const durationMs = Date.now() - startTime;

    const summary = `
=== E2E BETA USER FLOW RESULTS ===
Status: ${status}
Duration: ${(durationMs / 1000).toFixed(1)}s
Content Types Tested: ${contentTypes.length}
Passed (Score >= 90): ${passedCount}
Failed: ${failedCount}
Library Total: ${allContent.length}

${results.map((r) => `  ${r.passed ? '✓' : '✗'} ${r.contentType}: ${r.seoScore}/100 (${r.wordCount} words)`).join('\n')}
===================================
`;

    console.log(summary);

    return {
      status,
      userId,
      projectId,
      totalTypes: contentTypes.length,
      passedCount,
      failedCount,
      results,
      summary,
      durationMs,
    };
  },
});

/**
 * Cleanup after E2E test
 */
export const cleanupBetaE2E = internalAction({
  args: {
    userId: v.id('users'),
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    console.log('[E2E] Cleaning up test data...');
    await ctx.runMutation(internal.testing.betaUserFlow.cleanupTestData, {
      userId: args.userId,
      projectId: args.projectId,
    });
    console.log('[E2E] Cleanup complete');
    return { cleaned: true };
  },
});

// ============================================================================
// Multi-Persona E2E Testing (Real Customers with GA4/GSC Keywords)
// ============================================================================

import { TEST_PERSONAS, type TestPersona } from './testPersonas';

interface PersonaE2EResult {
  personaId: string;
  personaName: string;
  industry: string;
  totalTypes: number;
  passedCount: number;
  failedCount: number;
  avgScore: number;
  results: ContentResult[];
  durationMs: number;
}

interface MultiPersonaE2EResult {
  status: 'PASSED' | 'FAILED' | 'PARTIAL';
  totalPersonas: number;
  totalContentPieces: number;
  overallPassedCount: number;
  overallFailedCount: number;
  avgScore: number;
  personaResults: PersonaE2EResult[];
  summary: string;
  durationMs: number;
}

/**
 * Run E2E test for a single persona with real keywords
 */
export const runPersonaE2E = internalAction({
  args: {
    persona: v.object({
      id: v.string(),
      name: v.string(),
      industry: v.string(),
      targetUrl: v.string(),
      companyName: v.string(),
      location: v.string(),
      founderName: v.string(),
      tone: v.string(),
      targetAudience: v.string(),
      keywords: v.array(v.string()),
      topContentTypes: v.array(v.string()),
    }),
    contentTypes: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args): Promise<PersonaE2EResult> => {
    const startTime = Date.now();
    const persona = args.persona;
    const contentTypes =
      (args.contentTypes as ContentTypeId[]) || (persona.topContentTypes as ContentTypeId[]);

    console.log('='.repeat(60));
    console.log(`TESTING PERSONA: ${persona.name}`);
    console.log(`Industry: ${persona.industry}, Keywords: ${persona.keywords.length}`);
    console.log(`Content Types: ${contentTypes.length}`);
    console.log('='.repeat(60));

    // Create test user and project for this persona
    const email = `e2e_${persona.id}_${Date.now()}@test.phoo.ai`;
    const userId = await ctx.runMutation(internal.testing.betaUserFlow.createBetaUser, {
      email,
      name: persona.name,
    });

    // Provision subscription
    await ctx.runMutation(internal.subscriptions.subscriptions.upsertSubscription, {
      userId,
      planTier: 'solo',
      status: 'active',
      oneTimeFeePaid: false,
      startsAt: Date.now(),
    });

    // Create project with persona context
    const projectId = await ctx.runMutation(internal.testing.betaUserFlow.createTestProject, {
      userId,
      name: persona.companyName,
      url: persona.targetUrl,
      industry: persona.industry,
    });

    // Generate content in PARALLEL batches for 3x speed improvement
    const BATCH_SIZE = 3; // Process 3 content types simultaneously
    const results: ContentResult[] = [];

    // Split content types into batches
    const batches: ContentTypeId[][] = [];
    for (let i = 0; i < contentTypes.length; i += BATCH_SIZE) {
      batches.push(contentTypes.slice(i, i + BATCH_SIZE));
    }

    console.log(
      `[${persona.id}] Processing ${contentTypes.length} types in ${batches.length} parallel batches`
    );

    for (const batch of batches) {
      const batchStartTime = Date.now();

      // Process batch in parallel using Promise.all
      const batchPromises = batch.map(async (contentType) => {
        const keywordsToUse = persona.keywords.slice(0, 3); // Use top 3 keywords
        const title = `${persona.companyName}: ${contentType.charAt(0).toUpperCase() + contentType.slice(1)} Page`;

        try {
          console.log(
            `[${persona.id}] Generating ${contentType} with keywords: ${keywordsToUse.join(', ')}`
          );

          const contentPieceId = await ctx.runAction(
            internal.contentGeneration.generateContentInternal,
            {
              projectId,
              userId,
              contentType: contentType as ContentTypeId,
              title,
              keywords: keywordsToUse,
            }
          );

          // Fetch the generated content
          const content = await ctx.runQuery(internal.testing.betaUserFlow.getContentPiece, {
            contentPieceId,
          });

          const seoScore = content?.seoScore || 0;
          const wordCount = content?.wordCount || 0;
          const passed = seoScore >= 90;

          console.log(
            `[${persona.id}] ${contentType}: Score=${seoScore}, Words=${wordCount}, Passed=${passed}`
          );

          return {
            contentType: contentType as ContentTypeId,
            contentPieceId,
            title,
            seoScore,
            wordCount,
            passed,
          } as ContentResult;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          console.error(`[${persona.id}] ${contentType} FAILED:`, message);
          return {
            contentType: contentType as ContentTypeId,
            contentPieceId: '',
            title,
            seoScore: 0,
            wordCount: 0,
            passed: false,
            error: message,
          } as ContentResult;
        }
      });

      // Wait for all in batch to complete
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      console.log(`[${persona.id}] Batch completed in ${(Date.now() - batchStartTime) / 1000}s`);
    }

    // Calculate stats
    const passedCount = results.filter((r) => r.passed).length;
    const failedCount = results.filter((r) => !r.passed).length;
    const avgScore = results.reduce((sum, r) => sum + r.seoScore, 0) / results.length;

    return {
      personaId: persona.id,
      personaName: persona.name,
      industry: persona.industry,
      totalTypes: contentTypes.length,
      passedCount,
      failedCount,
      avgScore: Math.round(avgScore * 10) / 10,
      results,
      durationMs: Date.now() - startTime,
    };
  },
});

/**
 * Run Multi-Persona E2E Test - Tests all 5 customer personas
 *
 * Usage:
 *   npx convex run testing/betaUserFlow:runMultiPersonaE2E '{}'
 *   npx convex run testing/betaUserFlow:runMultiPersonaE2E '{"personaIds": ["helps2"]}'
 *   npx convex run testing/betaUserFlow:runMultiPersonaE2E '{"personaIds": ["savageBeauty", "lifewayChiro"]}'
 */
export const runMultiPersonaE2E = action({
  args: {
    personaIds: v.optional(v.array(v.string())), // Filter to specific personas
    contentTypes: v.optional(v.array(v.string())), // Filter to specific content types
    smokeTest: v.optional(v.boolean()), // Use only top content types per persona
  },
  handler: async (ctx, args): Promise<MultiPersonaE2EResult> => {
    const startTime = Date.now();

    // Filter personas if specified
    const personas = args.personaIds
      ? TEST_PERSONAS.filter((p) => args.personaIds!.includes(p.id))
      : TEST_PERSONAS;

    console.log('='.repeat(60));
    console.log('MULTI-PERSONA E2E VALIDATION');
    console.log(`Personas: ${personas.length}`);
    console.log(`IDs: ${personas.map((p) => p.id).join(', ')}`);
    console.log('='.repeat(60));

    const personaResults: PersonaE2EResult[] = [];

    for (const persona of personas) {
      // Determine content types for this persona
      const typesToTest = args.contentTypes
        ? args.contentTypes
        : args.smokeTest
          ? persona.topContentTypes.slice(0, 3) // Smoke: top 3 types
          : persona.topContentTypes; // Full: all relevant types

      const result = await ctx.runAction(internal.testing.betaUserFlow.runPersonaE2E, {
        persona: {
          id: persona.id,
          name: persona.name,
          industry: persona.industry,
          targetUrl: persona.targetUrl,
          companyName: persona.companyName,
          location: persona.location,
          founderName: persona.founderName,
          tone: persona.tone,
          targetAudience: persona.targetAudience,
          keywords: persona.keywords,
          topContentTypes: typesToTest,
        },
        contentTypes: typesToTest,
      });

      personaResults.push(result);
    }

    // Aggregate results
    const totalContentPieces = personaResults.reduce((sum, r) => sum + r.totalTypes, 0);
    const overallPassedCount = personaResults.reduce((sum, r) => sum + r.passedCount, 0);
    const overallFailedCount = personaResults.reduce((sum, r) => sum + r.failedCount, 0);
    const avgScore =
      personaResults.reduce((sum, r) => sum + r.avgScore * r.totalTypes, 0) / totalContentPieces;

    const status: 'PASSED' | 'FAILED' | 'PARTIAL' =
      overallFailedCount === 0 ? 'PASSED' : overallPassedCount === 0 ? 'FAILED' : 'PARTIAL';

    const durationMs = Date.now() - startTime;

    const summary = `
=== MULTI-PERSONA E2E RESULTS ===
Status: ${status}
Duration: ${(durationMs / 1000 / 60).toFixed(1)} minutes
Personas Tested: ${personas.length}
Total Content Pieces: ${totalContentPieces}
Passed (Score >= 90): ${overallPassedCount}
Failed: ${overallFailedCount}
Average Score: ${avgScore.toFixed(1)}

Per Persona:
${personaResults.map((r) => `  ${r.passedCount === r.totalTypes ? '✓' : '✗'} ${r.personaName}: ${r.passedCount}/${r.totalTypes} passed (avg ${r.avgScore})`).join('\n')}
===================================
`;

    console.log(summary);

    return {
      status,
      totalPersonas: personas.length,
      totalContentPieces,
      overallPassedCount,
      overallFailedCount,
      avgScore: Math.round(avgScore * 10) / 10,
      personaResults,
      summary,
      durationMs,
    };
  },
});
