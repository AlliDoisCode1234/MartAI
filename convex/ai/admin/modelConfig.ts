/**
 * AI Provider Admin Mutations
 *
 * Admin controls for multi-model selection per provider.
 * Part of INFRA-001: Multi-Model Selection per Provider.
 */

import { v } from 'convex/values';
import { mutation, query } from '../../_generated/server';
import { Id } from '../../_generated/dataModel';

// Task tier type for routing
export type TaskTier = 'cheap' | 'standard' | 'premium';

/**
 * Get provider with model configuration
 */
export const getProviderConfig = query({
  args: {
    providerId: v.id('aiProviders'),
  },
  handler: async (ctx, args) => {
    const provider = await ctx.db.get(args.providerId);
    if (!provider) return null;

    return {
      ...provider,
      defaultModel: provider.defaultModel ?? null,
      taskTierModels: provider.taskTierModels ?? null,
    };
  },
});

/**
 * Get all providers with their model configurations
 */
export const getAllProviderConfigs = query({
  args: {},
  handler: async (ctx) => {
    const providers = await ctx.db.query('aiProviders').withIndex('by_priority').collect();

    return providers.map((p) => ({
      ...p,
      defaultModel: p.defaultModel ?? null,
      taskTierModels: p.taskTierModels ?? null,
    }));
  },
});

/**
 * Set default model for a provider
 */
export const setDefaultModel = mutation({
  args: {
    providerId: v.id('aiProviders'),
    modelId: v.string(),
  },
  handler: async (ctx, args) => {
    const provider = await ctx.db.get(args.providerId);
    if (!provider) {
      throw new Error('Provider not found');
    }

    await ctx.db.patch(args.providerId, {
      defaultModel: args.modelId,
      updatedAt: Date.now(),
    });

    return { success: true, providerId: args.providerId, modelId: args.modelId };
  },
});

/**
 * Set task tier models for a provider
 */
export const setTaskTierModels = mutation({
  args: {
    providerId: v.id('aiProviders'),
    tierModels: v.object({
      cheap: v.string(),
      standard: v.string(),
      premium: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const provider = await ctx.db.get(args.providerId);
    if (!provider) {
      throw new Error('Provider not found');
    }

    await ctx.db.patch(args.providerId, {
      taskTierModels: args.tierModels,
      updatedAt: Date.now(),
    });

    return { success: true, providerId: args.providerId, tierModels: args.tierModels };
  },
});

/**
 * Get model for a specific task tier from provider config
 * Returns defaultModel if no tier-specific model is configured
 */
export const getModelForTier = query({
  args: {
    providerId: v.id('aiProviders'),
    tier: v.union(v.literal('cheap'), v.literal('standard'), v.literal('premium')),
  },
  handler: async (ctx, args) => {
    const provider = await ctx.db.get(args.providerId);
    if (!provider) return null;

    // Try tier-specific model first
    if (provider.taskTierModels) {
      const tierModel = provider.taskTierModels[args.tier];
      if (tierModel) return tierModel;
    }

    // Fall back to default model
    return provider.defaultModel ?? null;
  },
});
