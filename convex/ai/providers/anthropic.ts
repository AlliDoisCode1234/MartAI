/**
 * Anthropic Provider Adapter
 *
 * Implements the AIProvider interface for Claude models.
 */

import type {
  AIProvider,
  AITextRequest,
  AITextResponse,
  HealthCheckResult,
  ProviderModel,
} from './types';

export class AnthropicProvider implements AIProvider {
  name = 'anthropic';

  // Updated January 2026 - Claude 4 series (Claude 3.5 deprecated Aug 2025)
  private static MODELS: ProviderModel[] = [
    {
      modelId: 'claude-sonnet-4-20250514',
      displayName: 'Claude Sonnet 4',
      capabilities: ['chat', 'vision', 'function_calling'],
      contextWindow: 200000,
      costPer1kInputTokens: 0.3, // $3/1M
      costPer1kOutputTokens: 1.5, // $15/1M
      priority: 1, // Standard tier
    },
    {
      modelId: 'claude-haiku-4-20251015',
      displayName: 'Claude Haiku 4.5',
      capabilities: ['chat', 'vision'],
      contextWindow: 200000,
      costPer1kInputTokens: 0.025, // $0.25/1M
      costPer1kOutputTokens: 0.125, // $1.25/1M
      priority: 2, // Cheap tier
    },
    {
      modelId: 'claude-opus-4-20250522',
      displayName: 'Claude Opus 4',
      capabilities: ['chat', 'vision', 'function_calling'],
      contextWindow: 200000,
      costPer1kInputTokens: 1.5, // $15/1M
      costPer1kOutputTokens: 7.5, // $75/1M
      priority: 3, // Premium tier
    },
  ];

  isConfigured(): boolean {
    return !!process.env.ANTHROPIC_API_KEY;
  }

  getModels(): ProviderModel[] {
    return AnthropicProvider.MODELS;
  }

  async generateText(
    request: AITextRequest,
    modelId: string = 'claude-sonnet-4-20250514'
  ): Promise<AITextResponse> {
    const startTime = Date.now();

    // Dynamic import to avoid loading if not configured
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    try {
      // Build system prompt with optional cache control
      let systemContent: string | Array<{ type: 'text'; text: string; cache_control?: { type: 'ephemeral' } }> | undefined;
      if (request.systemPrompt) {
        systemContent = request.enableCache
          ? [{ type: 'text' as const, text: request.systemPrompt, cache_control: { type: 'ephemeral' as const } }]
          : request.systemPrompt;
      }

      const result = await client.messages.create({
        model: modelId,
        max_tokens: request.maxTokens || 4096,
        system: systemContent,
        messages: [{ role: 'user', content: request.prompt }],
      });

      const textBlock = result.content.find((c) => c.type === 'text');

      // Extract cache metrics from Anthropic response
      const usage = result.usage as unknown as Record<string, number>;
      const cachedTokens = usage.cache_read_input_tokens || 0;
      const cacheCreationTokens = usage.cache_creation_input_tokens || 0;

      if (cachedTokens > 0) {
        console.log(
          `[Anthropic] CACHE HIT: ${cachedTokens}/${usage.input_tokens} tokens cached (${modelId})`
        );
      }

      return {
        content: textBlock?.text || '',
        usage: {
          promptTokens: usage.input_tokens,
          completionTokens: usage.output_tokens,
          totalTokens: usage.input_tokens + usage.output_tokens,
          cachedTokens,
          cacheCreationTokens,
        },
        finishReason: result.stop_reason === 'end_turn' ? 'stop' : 'length',
        latencyMs: Date.now() - startTime,
        model: modelId,
        provider: this.name,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`[Anthropic] ${modelId} failed: ${message}`);
    }
  }

  async generateEmbeddings(): Promise<number[][]> {
    // Anthropic doesn't have embeddings - throw to trigger fallback
    throw new Error('Anthropic does not support embeddings - use OpenAI or Google');
  }

  async healthCheck(): Promise<HealthCheckResult> {
    if (!this.isConfigured()) {
      return { healthy: false, latencyMs: 0, error: 'API key not configured' };
    }

    const startTime = Date.now();
    try {
      await this.generateText(
        { prompt: 'Say OK', maxTokens: 5, temperature: 0 },
        'claude-haiku-4-20251015'
      );
      return { healthy: true, latencyMs: Date.now() - startTime };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        healthy: false,
        latencyMs: Date.now() - startTime,
        error: message,
      };
    }
  }
}

// Singleton instance
export const anthropicProvider = new AnthropicProvider();
