/**
 * Provider Seeding
 *
 * Seeds the database with default AI providers and models.
 * Run once to initialize the multi-agent infrastructure.
 */

import { v } from 'convex/values';
import { mutation, internalMutation } from '../../_generated/server';
import { internal } from '../../_generated/api';

/**
 * Seed default providers and models
 */
export const seedProviders = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Check if already seeded
    const existing = await ctx.db.query('aiProviders').first();
    if (existing) {
      console.log('[Seed] Providers already exist, skipping seed');
      return { seeded: false, message: 'Providers already exist' };
    }

    // ========================================
    // OPENAI
    // ========================================
    const openaiId = await ctx.db.insert('aiProviders', {
      name: 'openai',
      displayName: 'OpenAI',
      apiKeyEnvVar: 'OPENAI_API_KEY',
      isEnabled: true,
      priority: 1,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert('aiModels', {
      providerId: openaiId,
      modelId: 'gpt-4o',
      displayName: 'GPT-4o',
      capabilities: ['chat', 'vision', 'function_calling', 'structured_output'],
      contextWindow: 128000,
      costPer1kInputTokens: 0.25,
      costPer1kOutputTokens: 1.0,
      isEnabled: true,
      priority: 1,
      createdAt: now,
    });

    await ctx.db.insert('aiModels', {
      providerId: openaiId,
      modelId: 'gpt-4o-mini',
      displayName: 'GPT-4o Mini',
      capabilities: ['chat', 'vision', 'function_calling', 'structured_output'],
      contextWindow: 128000,
      costPer1kInputTokens: 0.015,
      costPer1kOutputTokens: 0.06,
      isEnabled: true,
      priority: 2,
      createdAt: now,
    });

    // Initialize health
    await ctx.db.insert('aiProviderHealth', {
      providerId: openaiId,
      status: 'healthy',
      avgLatencyMs: 0,
      errorRate: 0,
      successCount: 0,
      errorCount: 0,
      circuitState: 'closed',
      consecutiveFailures: 0,
      consecutiveSuccesses: 0,
      lastHealthCheckAt: now,
      updatedAt: now,
    });

    // ========================================
    // ANTHROPIC
    // ========================================
    const anthropicId = await ctx.db.insert('aiProviders', {
      name: 'anthropic',
      displayName: 'Anthropic Claude',
      apiKeyEnvVar: 'ANTHROPIC_API_KEY',
      isEnabled: true,
      priority: 2,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert('aiModels', {
      providerId: anthropicId,
      modelId: 'claude-3-5-sonnet-20241022',
      displayName: 'Claude 3.5 Sonnet',
      capabilities: ['chat', 'vision', 'function_calling'],
      contextWindow: 200000,
      costPer1kInputTokens: 0.3,
      costPer1kOutputTokens: 1.5,
      isEnabled: true,
      priority: 1,
      createdAt: now,
    });

    await ctx.db.insert('aiModels', {
      providerId: anthropicId,
      modelId: 'claude-3-haiku-20240307',
      displayName: 'Claude 3 Haiku',
      capabilities: ['chat', 'vision'],
      contextWindow: 200000,
      costPer1kInputTokens: 0.025,
      costPer1kOutputTokens: 0.125,
      isEnabled: true,
      priority: 2,
      createdAt: now,
    });

    // Initialize health
    await ctx.db.insert('aiProviderHealth', {
      providerId: anthropicId,
      status: 'healthy',
      avgLatencyMs: 0,
      errorRate: 0,
      successCount: 0,
      errorCount: 0,
      circuitState: 'closed',
      consecutiveFailures: 0,
      consecutiveSuccesses: 0,
      lastHealthCheckAt: now,
      updatedAt: now,
    });

    // ========================================
    // GOOGLE
    // ========================================
    const googleId = await ctx.db.insert('aiProviders', {
      name: 'google',
      displayName: 'Google Gemini',
      apiKeyEnvVar: 'GOOGLE_AI_API_KEY',
      isEnabled: true,
      priority: 3,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert('aiModels', {
      providerId: googleId,
      modelId: 'gemini-1.5-pro',
      displayName: 'Gemini 1.5 Pro',
      capabilities: ['chat', 'vision', 'function_calling', 'structured_output', 'embeddings'],
      contextWindow: 2000000,
      costPer1kInputTokens: 0.125,
      costPer1kOutputTokens: 0.5,
      isEnabled: true,
      priority: 1,
      createdAt: now,
    });

    await ctx.db.insert('aiModels', {
      providerId: googleId,
      modelId: 'gemini-1.5-flash',
      displayName: 'Gemini 1.5 Flash',
      capabilities: ['chat', 'vision', 'function_calling'],
      contextWindow: 1000000,
      costPer1kInputTokens: 0.0075,
      costPer1kOutputTokens: 0.03,
      isEnabled: true,
      priority: 2,
      createdAt: now,
    });

    // Initialize health
    await ctx.db.insert('aiProviderHealth', {
      providerId: googleId,
      status: 'healthy',
      avgLatencyMs: 0,
      errorRate: 0,
      successCount: 0,
      errorCount: 0,
      circuitState: 'closed',
      consecutiveFailures: 0,
      consecutiveSuccesses: 0,
      lastHealthCheckAt: now,
      updatedAt: now,
    });

    console.log('[Seed] Created 3 providers with 6 models');
    return { seeded: true, providers: 3, models: 6 };
  },
});

/**
 * Get provider status summary
 */
export const getProviderSummary = mutation({
  args: {},
  handler: async (ctx) => {
    const providers = await ctx.db.query('aiProviders').collect();
    const models = await ctx.db.query('aiModels').collect();
    const health = await ctx.db.query('aiProviderHealth').collect();

    return providers.map((p) => ({
      ...p,
      models: models.filter((m) => m.providerId === p._id),
      health: health.find((h) => h.providerId === p._id),
    }));
  },
});

/**
 * Seed models only (for when providers exist but models table is empty).
 * Uses CURRENT March 2026 model lineup. Safe to run multiple times.
 *
 * Uses internalMutation — only callable from Convex dashboard, scheduled
 * functions, or other server-side code. This bypasses RLS because it writes
 * to global config tables (aiModels requires super_admin in RLS rules).
 *
 * MODEL ROTATION STRATEGY:
 * When new models release or old ones deprecate:
 * 1. Update the modelCatalog below with new model IDs and pricing
 * 2. Run this function in production (it skips existing provider+model pairs)
 * 3. Disable deprecated models via the admin dashboard
 *
 * Last updated: 2026-03-11
 * Deprecations tracked:
 * - GPT-4o: retired Feb 16, 2026 -> replaced by GPT-4.1
 * - Claude 3.5 Sonnet: legacy -> replaced by Claude Sonnet 4.6
 * - Gemini 1.5 Pro/Flash: deprecated -> replaced by Gemini 3.x series
 */
export const seedModels = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const providers = await ctx.db.query('aiProviders').collect();
    const existingModels = await ctx.db.query('aiModels').collect();

    if (providers.length === 0) {
      return { seeded: false, message: 'No providers found. Run seedProviders first.' };
    }

    // Composite key: providerId:modelId — prevents false dedup across providers
    const existingKeys = new Set(
      existingModels.map((m) => `${m.providerId}:${m.modelId}`)
    );
    let modelsCreated = 0;

    // Model catalog keyed by provider name
    const modelCatalog: Record<string, Array<{
      modelId: string;
      displayName: string;
      capabilities: string[];
      contextWindow: number;
      costPer1kInputTokens: number;
      costPer1kOutputTokens: number;
      priority: number;
    }>> = {
      openai: [
        { modelId: 'gpt-4.1', displayName: 'GPT-4.1', capabilities: ['chat', 'vision', 'function_calling', 'structured_output'], contextWindow: 1000000, costPer1kInputTokens: 0.15, costPer1kOutputTokens: 0.6, priority: 1 },
        { modelId: 'gpt-5.1', displayName: 'GPT-5.1 (Reasoning)', capabilities: ['chat', 'vision', 'function_calling', 'structured_output', 'reasoning'], contextWindow: 400000, costPer1kInputTokens: 0.5, costPer1kOutputTokens: 2, priority: 2 },
        { modelId: 'gpt-5-mini', displayName: 'GPT-5 Mini', capabilities: ['chat', 'vision', 'function_calling'], contextWindow: 128000, costPer1kInputTokens: 0.03, costPer1kOutputTokens: 0.12, priority: 3 },
      ],
      anthropic: [
        { modelId: 'claude-opus-4.6', displayName: 'Claude Opus 4.6', capabilities: ['chat', 'vision', 'function_calling', 'reasoning'], contextWindow: 1000000, costPer1kInputTokens: 0.6, costPer1kOutputTokens: 3, priority: 1 },
        { modelId: 'claude-sonnet-4.6', displayName: 'Claude Sonnet 4.6', capabilities: ['chat', 'vision', 'function_calling'], contextWindow: 1000000, costPer1kInputTokens: 0.3, costPer1kOutputTokens: 1.5, priority: 2 },
        { modelId: 'claude-haiku-4.5', displayName: 'Claude Haiku 4.5', capabilities: ['chat', 'vision'], contextWindow: 200000, costPer1kInputTokens: 0.04, costPer1kOutputTokens: 0.2, priority: 3 },
      ],
      google: [
        { modelId: 'gemini-3.1-pro', displayName: 'Gemini 3.1 Pro', capabilities: ['chat', 'vision', 'function_calling', 'structured_output', 'reasoning'], contextWindow: 2000000, costPer1kInputTokens: 0.25, costPer1kOutputTokens: 1, priority: 1 },
        { modelId: 'gemini-3-flash', displayName: 'Gemini 3 Flash', capabilities: ['chat', 'vision', 'function_calling', 'structured_output'], contextWindow: 1000000, costPer1kInputTokens: 0.05, costPer1kOutputTokens: 0.2, priority: 2 },
        { modelId: 'gemini-3.1-flash-lite', displayName: 'Gemini 3.1 Flash-Lite', capabilities: ['chat', 'vision'], contextWindow: 1000000, costPer1kInputTokens: 0.01, costPer1kOutputTokens: 0.04, priority: 3 },
      ],
    };

    for (const provider of providers) {
      const catalog = modelCatalog[provider.name];
      if (!catalog) continue;

      for (const model of catalog) {
        const compositeKey = `${provider._id}:${model.modelId}`;
        if (existingKeys.has(compositeKey)) continue;

        await ctx.db.insert('aiModels', {
          providerId: provider._id,
          ...model,
          isEnabled: true,
          createdAt: now,
        });
        modelsCreated++;
      }
    }

    console.log(`[Seed] Created ${modelsCreated} models for ${providers.length} providers`);
    return { seeded: true, modelsCreated, skippedExisting: existingKeys.size };
  },
});
