/**
 * Onboarding Functions
 *
 * Public and internal mutations/queries for onboarding step tracking
 */

import { v } from 'convex/values';
import { mutation, internalMutation, internalQuery } from './_generated/server';
import { auth } from './auth';
import { api, internal } from './_generated/api';

/**
 * Public mutation for frontend to update onboarding step
 * 
 * GLASSWING-017: Onboarding Boundary
 * strictly enforces that onboarding endpoints CANNOT manipulate the `internalAdmins` 
 * table and MUST NOT touch the `role` field on the `users` table.
 */
export const updateOnboardingStep = mutation({
  args: {
    step: v.union(
      v.literal('signupCompleted'),
      v.literal('planSelected'),
      v.literal('paymentCompleted'),
      v.literal('projectCreated'),
      v.literal('organizationCreated'),
      v.literal('ga4Connected'),
      v.literal('gscConnected')
    ),
    value: v.union(v.boolean(), v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const user = await ctx.db.get(userId);
    if (!user) throw new Error('User not found');

    const currentSteps = user.onboardingSteps || {};
    const now = Date.now();

    const updatedSteps: Record<string, any> = { ...currentSteps };
    updatedSteps[args.step] = args.value;
    updatedSteps[`${args.step}At`] = now;

    // Auto-create organization when signup completes (if not already created)
    if (args.step === 'signupCompleted' && args.value === true && !user.organizationId) {
      // Create org using the teams module
      const orgId = await ctx.runMutation(api.teams.teams.createOrganization, {});
      updatedSteps['organizationCreated'] = true;
      updatedSteps['organizationCreatedAt'] = now;
    }

    // Build patch object
    const patchData: Record<string, any> = {
      onboardingSteps: updatedSteps,
      onboardingStatus: 'in_progress',
      lastActiveAt: now,
      updatedAt: now,
    };

    // When plan is selected, also update the user's membershipTier
    if (args.step === 'planSelected' && typeof args.value === 'string') {
      patchData.membershipTier = args.value;
    }

    await ctx.db.patch(userId, patchData);

    // Fire-and-forget HubSpot sync only for significant milestones to prevent rate-limiting abuse
    if (['signupCompleted', 'paymentCompleted', 'projectCreated'].includes(args.step)) {
      ctx.scheduler.runAfter(0, api.integrations.hubspot.syncUserToHubspot, {
        userId,
      });
    }

    return { success: true };
  },
});

/**
 * Update multiple onboarding steps in a SINGLE write to avoid write conflicts.
 * Use this when updating multiple steps in quick succession (e.g., payment + project).
 */
export const updateMultipleSteps = mutation({
  args: {
    steps: v.array(
      v.object({
        step: v.union(
          v.literal('signupCompleted'),
          v.literal('planSelected'),
          v.literal('paymentCompleted'),
          v.literal('projectCreated'),
          v.literal('ga4Connected'),
          v.literal('gscConnected')
        ),
        value: v.union(v.boolean(), v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const user = await ctx.db.get(userId);
    if (!user) throw new Error('User not found');

    const now = Date.now();
    const updatedSteps: Record<string, any> = { ...(user.onboardingSteps || {}) };

    // Apply ALL steps in ONE write
    for (const { step, value } of args.steps) {
      updatedSteps[step] = value;
      updatedSteps[`${step}At`] = now;
    }

    await ctx.db.patch(userId, {
      onboardingSteps: updatedSteps,
      onboardingStatus: 'in_progress',
      lastActiveAt: now,
      updatedAt: now,
    });

    // Fire-and-forget HubSpot sync only if significant milestones were included
    const hasSignificantStep = args.steps.some(s => ['signupCompleted', 'paymentCompleted', 'projectCreated'].includes(s.step));
    if (hasSignificantStep) {
      ctx.scheduler.runAfter(0, api.integrations.hubspot.syncUserToHubspot, {
        userId,
      });
    }

    return { success: true };
  },
});

/**
 * Update a specific onboarding step
 */
export const updateStep = internalMutation({
  args: {
    userId: v.id('users'),
    step: v.union(
      v.literal('signupCompleted'),
      v.literal('planSelected'),
      v.literal('paymentCompleted'),
      v.literal('projectCreated'),
      v.literal('ga4Connected'),
      v.literal('gscConnected')
    ),
    value: v.union(v.boolean(), v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error('User not found');

    const currentSteps = user.onboardingSteps || {};
    const now = Date.now();

    // Build updated steps object
    const updatedSteps: Record<string, any> = { ...currentSteps };
    updatedSteps[args.step] = args.value;
    updatedSteps[`${args.step}At`] = now;

    await ctx.db.patch(args.userId, {
      onboardingSteps: updatedSteps,
      onboardingStatus: 'in_progress',
      lastActiveAt: now,
      updatedAt: now,
    });

    // Fire-and-forget HubSpot sync (will skip if no API key)
    ctx.scheduler.runAfter(0, api.integrations.hubspot.syncUserToHubspot, {
      userId: args.userId,
    });

    return { success: true };
  },
});

/**
 * Get onboarding progress for a user
 */
export const getProgress = internalQuery({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error('User not found');

    const steps = (user.onboardingSteps || {}) as Record<
      string,
      boolean | string | number | undefined
    >;

    // Required steps to consider onboarding "complete"
    const requiredSteps = ['signupCompleted', 'planSelected', 'paymentCompleted', 'projectCreated'];

    // Optional steps (nice to have but not required)
    const optionalSteps = ['ga4Connected', 'gscConnected'];

    // Count completed required steps
    const completedRequired = requiredSteps.filter(
      (step) => steps[step] === true || (step === 'planSelected' && typeof steps[step] === 'string')
    ).length;

    // Count completed optional steps
    const completedOptional = optionalSteps.filter((step) => steps[step] === true).length;

    const totalSteps = requiredSteps.length + optionalSteps.length;
    const completedSteps = completedRequired + completedOptional;
    const isComplete = completedRequired === requiredSteps.length;

    return {
      steps,
      completedSteps,
      totalSteps,
      completedRequired,
      totalRequired: requiredSteps.length,
      isComplete,
      percentComplete: Math.round((completedSteps / totalSteps) * 100),
    };
  },
});

/**
 * Mark onboarding as complete
 *
 * GLASSWING-018: Onboarding Boundary
 * Strictly sets status and fires generation endpoints. Does not escalate RBAC rank or `role`.
 * 
 * Sets onboardingStatus = 'completed' and:
 * - If user has active subscription → accountStatus = 'active'
 * - If no subscription (beta/bypass) but BYPASS_PAYMENT → accountStatus = 'active'
 * - Otherwise keeps existing accountStatus
 */
export const markComplete = internalMutation({
  args: {
    userId: v.id('users'),
    bypassPayment: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error('User not found');

    // Check if user has active subscription
    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first();

    const hasActiveSubscription = subscription?.status === 'active';

    // Determine account status:
    // - Active subscription = active
    // - BYPASS_PAYMENT flag = active (for beta)
    // - Neither = keep current status
    const shouldActivate = hasActiveSubscription || args.bypassPayment === true;

    await ctx.db.patch(args.userId, {
      onboardingStatus: 'completed',
      accountStatus: shouldActivate ? 'active' : user.accountStatus,
      lastActiveAt: now,
      updatedAt: now,
    });

    // Fire-and-forget HubSpot sync (will skip if no API key)
    ctx.scheduler.runAfter(0, api.integrations.hubspot.syncUserToHubspot, {
      userId: args.userId,
    });

    // NOTE: Content calendar generation happens in handleStep4Next via generateContentCalendar
    // That function is called during onboarding step 4, not here in markComplete

    // Auto-generate first content piece (zero-touch experience)
    // Find user's project — prefer org-scoped lookup
    // Deterministic selection: get the most recently created project for the org/user
    const project = user.organizationId
      ? await ctx.db
          .query('projects')
          .withIndex('by_org', (q) => q.eq('organizationId', user.organizationId!))
          .order('desc')
          .first()
      : await ctx.db
          .query('projects')
          .withIndex('by_user', (q) => q.eq('userId', args.userId))
          .order('desc')
          .first();

    if (project) {
      // Delay 5s to let GSC sync populate keywords first
      ctx.scheduler.runAfter(5000, internal.contentGeneration.autoGenerateFirstContent, {
        userId: args.userId,
        projectId: project._id,
      });
      console.log(`[Onboarding] Scheduled auto-content generation for project ${project._id}`);
    }

    console.log(`[Onboarding] Marked complete for ${args.userId}. Active: ${shouldActivate}`);

    return { success: true, accountStatus: shouldActivate ? 'active' : user.accountStatus };
  },
});

/**
 * Fallback bypass for organic users to bypass Stripe during testing
 */
export const skipBillingForTesting = mutation({
  args: {
    planTier: v.union(v.literal('starter'), v.literal('engine'), v.literal('agency'), v.literal('enterprise')),
    qaBypassCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const expectedPassword = process.env.PHOO_BETA_PASSWORD;
    
    // Check if the QA password matches
    if (!expectedPassword || args.qaBypassCode !== expectedPassword) {
      throw new Error('Invalid QA Bypass Code. You cannot skip billing in production without authorization.');
    }

    const user = await ctx.db.get(userId);
    if (!user) throw new Error('User not found');

    const now = Date.now();
    const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;
    
    // Update user to QA Tester
    const currentSteps = user.onboardingSteps || {};
    await ctx.db.patch(userId, {
      isQATester: true,
      membershipTier: args.planTier,
      onboardingSteps: {
        ...currentSteps,
        planSelected: args.planTier,
        planSelectedAt: now,
        paymentCompleted: true,
        paymentCompletedAt: now,
      },
      updatedAt: now,
    });

    // Create the phantom subscription
    await ctx.db.insert('subscriptions', {
      userId,
      planTier: args.planTier,
      status: 'active',
      billingCycle: 'monthly',
      startsAt: now,
      renewsAt: now + SIX_MONTHS_MS,
      cancelAt: now + SIX_MONTHS_MS,
      priceMonthly: 0,
      createdAt: now,
      updatedAt: now,
      features: args.planTier === 'agency' 
        ? { maxUrls: 10, maxKeywordIdeas: 5000, maxAiReports: 100, maxContentPieces: 100, maxTeamMembers: 25 }
        : { maxUrls: 1, maxKeywordIdeas: 500, maxAiReports: 10, maxContentPieces: 15, maxTeamMembers: 1 }
    });
    
    return { success: true };
  }
});
