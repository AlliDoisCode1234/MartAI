/**
 * AI Router
 *
 * Intelligent routing of AI requests to the best available provider.
 * Implements failover, load balancing, and cost optimization.
 */

import { v } from 'convex/values';
import { action, ActionCtx } from '../../_generated/server';
import { internal, api } from '../../_generated/api';
import {
  getConfiguredProviders,
  type AIProvider,
  type AITextRequest,
  type AITextResponse,
  type RoutingStrategy,
  type TaskType,
} from '../providers';

interface RouteOptions {
  taskType?: TaskType;
  strategy?: RoutingStrategy;
  preferredProvider?: string;
  userId?: string;
}

/**
 * Route and execute an AI text generation request with automatic failover
 */
export const generateWithFallback = action({
  args: {
    prompt: v.string(),
    systemPrompt: v.optional(v.string()),
    maxTokens: v.optional(v.number()),
    temperature: v.optional(v.number()),
    taskType: v.optional(v.string()),
    strategy: v.optional(v.string()),
    preferredProvider: v.optional(v.string()),
    userId: v.optional(v.id('users')),
  },
  handler: async (ctx, args): Promise<AITextResponse> => {
    const startTime = Date.now();
    const fallbackChain: string[] = [];

    const request: AITextRequest = {
      prompt: args.prompt,
      systemPrompt: args.systemPrompt,
      maxTokens: args.maxTokens,
      temperature: args.temperature,
    };

    const taskType = (args.taskType as TaskType) || 'chat';
    const strategy = (args.strategy as RoutingStrategy) || 'balanced';

    // Get available providers ordered by preference
    const providers = await getOrderedProviders(ctx, {
      taskType,
      strategy,
      preferredProvider: args.preferredProvider,
    });

    if (providers.length === 0) {
      throw new Error('[AIRouter] No configured AI providers available');
    }

    // Try each provider in order
    for (const { provider, modelId, providerId } of providers) {
      // Check circuit state
      const isOpen = await ctx.runQuery(api.ai.health.circuitBreaker.isCircuitOpen, {
        providerId,
      });

      if (isOpen) {
        fallbackChain.push(`${provider.name}:circuit_open`);
        continue;
      }

      try {
        const result = await provider.generateText(request, modelId);

        // Record success
        await ctx.runMutation(internal.ai.health.circuitBreaker.recordSuccess, {
          providerId,
          latencyMs: result.latencyMs,
        });

        // Log success
        console.log(
          `[AIRouter] SUCCESS: ${provider.name}/${modelId} (${result.latencyMs}ms, ${result.usage.totalTokens} tokens)`
        );

        return result;
      } catch (error: any) {
        // Record failure
        await ctx.runMutation(internal.ai.health.circuitBreaker.recordFailure, {
          providerId,
          errorMessage: error.message,
        });

        fallbackChain.push(`${provider.name}:${error.message.substring(0, 50)}`);
        console.warn(`[AIRouter] ${provider.name} failed, trying next...`, error.message);
      }
    }

    // All providers failed
    console.error(`[AIRouter] All providers failed. Chain: ${fallbackChain.join(' → ')}`);
    throw new Error(`[AIRouter] All providers failed. Chain: ${fallbackChain.join(' → ')}`);
  },
});

/**
 * Task tier classification
 * Maps task types to tier for model selection
 */
const TASK_TIER_MAP: Record<string, 'cheap' | 'standard' | 'premium'> = {
  chat: 'cheap',
  embeddings: 'cheap',
  brief: 'standard',
  draft: 'standard',
  structured: 'standard',
  vision: 'premium',
};

interface ProviderHealth {
  _id: string;
  name: string;
  health?: {
    circuitState: 'closed' | 'open' | 'half_open';
    errorRate: number;
    avgLatencyMs: number;
  };
  provider?: {
    defaultModel?: string;
    taskTierModels?: {
      cheap: string;
      standard: string;
      premium?: string;
    };
  };
}

/**
 * Get providers ordered by routing strategy
 * Now reads model config from database for multi-model selection
 */
async function getOrderedProviders(
  ctx: ActionCtx,
  options: RouteOptions
): Promise<Array<{ provider: AIProvider; modelId: string; providerId: string }>> {
  const configured = getConfiguredProviders();

  if (configured.length === 0) {
    return [];
  }

  // Get health data from database (includes provider config)
  const healthData = (await ctx.runQuery(
    api.ai.health.circuitBreaker.getAllProviderHealth,
    {}
  )) as ProviderHealth[];

  // Determine task tier for model selection
  const taskTier = TASK_TIER_MAP[options.taskType || 'chat'] || 'standard';

  // Build scored list
  const scored = configured.map((provider) => {
    const dbProvider = healthData.find((h) => h.name === provider.name);
    const models = provider.getModels();

    // Model selection priority:
    // 1. Task tier model (if configured)
    // 2. Default model (if configured)
    // 3. First model from provider (fallback)
    let selectedModelId = models[0]?.modelId;

    if (dbProvider?.provider) {
      // Check task tier model
      if (dbProvider.provider.taskTierModels?.[taskTier]) {
        selectedModelId = dbProvider.provider.taskTierModels[taskTier] as string;
      } else if (dbProvider.provider.defaultModel) {
        // Fallback to default model
        selectedModelId = dbProvider.provider.defaultModel;
      }
    }

    // Find the model config (for cost calculations)
    const selectedModel = models.find((m) => m.modelId === selectedModelId) || models[0];

    let score = 100;

    // Health score
    if (dbProvider?.health) {
      if (dbProvider.health.circuitState === 'open') score -= 100;
      if (dbProvider.health.circuitState === 'half_open') score -= 50;
      score -= dbProvider.health.errorRate * 30;
      score -= Math.min(dbProvider.health.avgLatencyMs / 100, 20);
    }

    // Strategy-specific scoring
    if (options.strategy === 'cheapest' && selectedModel) {
      score -= (selectedModel.costPer1kInputTokens + selectedModel.costPer1kOutputTokens) * 10;
    } else if (options.strategy === 'fastest') {
      score += 20 - Math.min((dbProvider?.health?.avgLatencyMs || 0) / 50, 20);
    } else if (options.strategy === 'best_quality' && selectedModel) {
      score += (10 - selectedModel.priority) * 5;
    }

    // Preferred provider bonus
    if (options.preferredProvider === provider.name) {
      score += 30;
    }

    return {
      provider,
      modelId: selectedModelId,
      providerId: dbProvider?._id as string,
      score,
    };
  });

  // Sort by score (highest first) and filter out undefined providerIds
  return scored.filter((s) => s.providerId).sort((a, b) => b.score - a.score);
}
