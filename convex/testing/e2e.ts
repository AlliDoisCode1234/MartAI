import { internalAction, internalMutation, internalQuery } from '../_generated/server';
import { v } from 'convex/values';
import { internal } from '../_generated/api';

/**
 * STARTING E2E VALIDATION ORCHESTRATOR
 *
 * Verifies the critical path:
 * 1. User Creation
 * 2. Subscription Provisioning (Team Tier)
 * 3. Project Creation
 * 4. Calendar Generation
 * 5. Article Generation
 */

export const createUser = internalMutation({
  args: { name: v.string(), email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert('users', {
      name: args.name,
      email: args.email,
      role: 'admin',
      onboardingStatus: 'completed',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const createProject = internalMutation({
  args: { userId: v.id('users'), name: v.string(), url: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert('projects', {
      userId: args.userId,
      name: args.name,
      websiteUrl: args.url,
      industry: 'SaaS',
      projectType: 'own',
      urlLocked: true,
      serpAnalysisUsed: false,
      targetAudience: 'Business Owners',
      businessGoals: 'Growth',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const getContent = internalQuery({
  args: { contentPieceId: v.id('contentPieces') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.contentPieceId);
  },
});

export const validateLaunch = internalAction({
  args: { targetUrl: v.string() },
  handler: async (ctx, args) => {
    console.log('--- STARTING E2E VALIDATION ---');

    // A. Create User
    const email = `validator_${Date.now()}@test.com`;
    const userId = await ctx.runMutation(internal.testing.e2e.createUser, {
      name: 'Launch Validator',
      email,
    });
    console.log(`[E2E] User created: ${userId} (${email})`);

    // B. Provision Team Tier
    await ctx.runMutation(internal.subscriptions.subscriptions.upsertSubscription, {
      userId,
      planTier: 'team',
      status: 'active',
      oneTimeFeePaid: false,
      startsAt: Date.now(),
    });
    console.log('[E2E] Subscription provisioned: Team Tier');

    // C. Create Project
    const projectId = await ctx.runMutation(internal.testing.e2e.createProject, {
      userId,
      name: 'Validator Project',
      url: args.targetUrl,
    });
    console.log(`[E2E] Project created: ${projectId}`);

    // D. Generate Calendar
    await ctx.runAction(
      internal.contentCalendar.generateCalendar.triggerOnboardingCalendarGeneration,
      {
        projectId,
        hasGa4: false,
        hasGsc: false,
      }
    );
    console.log('[E2E] Calendar generated');

    // E. Generate Article (Core validation)
    const title = `The Future of AI in SaaS: Why ${args.targetUrl} Matters`;
    console.log(`[E2E] Generating article: "${title}"... (This takes time)`);

    // We skip retry loop inside generateContentInternal by handling it there, but here we just call it once.
    // Ideally we want the BEST quality, so we let it run its loops.
    const contentPieceId = await ctx.runAction(internal.contentGeneration.generateContentInternal, {
      projectId,
      userId,
      contentType: 'blog',
      title,
      keywords: ['ai future', 'saas innovation', 'automation'],
    });
    console.log(`[E2E] Article generated: ${contentPieceId}`);

    // F. Fetch Content
    const article = await ctx.runQuery(internal.testing.e2e.getContent, { contentPieceId });

    return {
      step: 'COMPLETE',
      articleId: contentPieceId,
      content: article?.content,
      seoScore: article?.seoScore,
      wordCount: article?.wordCount,
      metrics: article?.qualityMetrics,
    };
  },
});

/**
 * CRITICAL ONBOARDING CONTENT TEST
 *
 * Validates THE core product promise:
 * User passes URL → Onboarding generates calendar → Calendar triggers content generation → Content has REAL WORDS
 *
 * This is the WHOLE POINT of the product.
 *
 * Run with: npx convex run testing/e2e:validateOnboardingContentGeneration '{"targetUrl": "https://example.com"}'
 */
export const validateOnboardingContentGeneration = internalAction({
  args: { targetUrl: v.string() },
  handler: async (ctx, args) => {
    console.log('='.repeat(60));
    console.log('CRITICAL ONBOARDING CONTENT TEST');
    console.log('Validating: URL → Calendar → Content with REAL WORDS');
    console.log('='.repeat(60));

    const startTime = Date.now();

    // 1. Create User
    const email = `onboarding_test_${Date.now()}@test.phoo.ai`;
    const userId = await ctx.runMutation(internal.testing.e2e.createUser, {
      name: 'Onboarding Content Tester',
      email,
    });
    console.log(`[1/5] User created: ${userId}`);

    // 2. Provision Solo Tier
    await ctx.runMutation(internal.subscriptions.subscriptions.upsertSubscription, {
      userId,
      planTier: 'solo',
      status: 'active',
      oneTimeFeePaid: false,
      startsAt: Date.now(),
    });
    console.log('[2/5] Solo subscription provisioned');

    // 3. Create Project with URL
    const projectId = await ctx.runMutation(internal.testing.e2e.createProject, {
      userId,
      name: 'Onboarding Test Project',
      url: args.targetUrl,
    });
    console.log(`[3/5] Project created: ${projectId}`);

    // 4. Trigger Calendar Generation (THIS SHOULD NOW GENERATE CONTENT!)
    console.log('[4/5] Generating calendar with content...');
    const calendarResult = await ctx.runAction(
      internal.contentCalendar.generateCalendar.triggerOnboardingCalendarGeneration,
      {
        projectId,
        hasGa4: false,
        hasGsc: false,
      }
    );
    console.log(`[4/5] Calendar generated: ${calendarResult.itemsGenerated} pieces`);

    // 5. Wait for async content generation (scheduler runs after 0ms but still async)
    console.log('[5/5] Waiting 30s for async content generation...');
    await new Promise((resolve) => setTimeout(resolve, 30000));

    // 6. Verify content pieces have REAL WORDS (not just metadata)
    const contentPieces = await ctx.runQuery(
      internal.testing.betaUserFlow.getProjectContentPieces,
      {
        projectId,
      }
    );

    const piecesWithContent = contentPieces.filter(
      (p: { wordCount?: number }) => (p.wordCount ?? 0) > 0
    );
    const piecesWithScheduled = contentPieces.filter(
      (p: { status: string }) => p.status === 'scheduled'
    );

    const result = {
      passed: piecesWithContent.length >= 3, // At least 3 pieces should have content
      totalPieces: contentPieces.length,
      piecesWithContent: piecesWithContent.length,
      piecesScheduled: piecesWithScheduled.length,
      pieces: piecesWithContent.map(
        (p: {
          title: string;
          contentType: string;
          wordCount?: number;
          seoScore?: number;
          status: string;
        }) => ({
          title: p.title,
          contentType: p.contentType,
          wordCount: p.wordCount,
          seoScore: p.seoScore,
          status: p.status,
        })
      ),
      durationMs: Date.now() - startTime,
    };

    console.log('='.repeat(60));
    console.log(`RESULT: ${result.passed ? 'PASSED' : 'FAILED'}`);
    console.log(`Total pieces: ${result.totalPieces}`);
    console.log(`Pieces with content (wordCount > 0): ${result.piecesWithContent}`);
    console.log(`Pieces scheduled: ${result.piecesScheduled}`);
    console.log(`Duration: ${(result.durationMs / 1000).toFixed(1)}s`);
    console.log('='.repeat(60));

    if (!result.passed) {
      console.error('CRITICAL FAILURE: Onboarding did not generate content with real words!');
      console.error('This is THE WHOLE POINT OF THE PRODUCT!');
    }

    return result;
  },
});
