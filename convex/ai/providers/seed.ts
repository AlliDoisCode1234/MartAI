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
