/**
 * Onboarding Functions
 *
 * Public and internal mutations/queries for onboarding step tracking
 */

import { v } from 'convex/values';
import { mutation, internalMutation, internalQuery } from './_generated/server';
import { auth } from './auth';
import { api } from './_generated/api';

/**
 * Public mutation for frontend to update onboarding step
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
 */
export const markComplete = internalMutation({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    await ctx.db.patch(args.userId, {
      onboardingStatus: 'completed',
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
