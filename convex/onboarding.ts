/**
 * Onboarding Internal Functions
 *
 * Internal mutations and queries for onboarding step tracking
 */

import { v } from 'convex/values';
import { internalMutation, internalQuery } from './_generated/server';

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

    return { success: true };
  },
});
