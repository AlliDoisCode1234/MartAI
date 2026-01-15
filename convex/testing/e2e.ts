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
