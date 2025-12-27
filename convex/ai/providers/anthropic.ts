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

  private static MODELS: ProviderModel[] = [
    {
      modelId: 'claude-3-5-sonnet-20241022',
      displayName: 'Claude 3.5 Sonnet',
      capabilities: ['chat', 'vision', 'function_calling'],
      contextWindow: 200000,
      costPer1kInputTokens: 0.3, // $0.003 per 1K
      costPer1kOutputTokens: 1.5, // $0.015 per 1K
      priority: 1,
    },
    {
      modelId: 'claude-3-haiku-20240307',
      displayName: 'Claude 3 Haiku',
      capabilities: ['chat', 'vision'],
      contextWindow: 200000,
      costPer1kInputTokens: 0.025, // $0.00025 per 1K
      costPer1kOutputTokens: 0.125, // $0.00125 per 1K
      priority: 2,
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
    modelId: string = 'claude-3-5-sonnet-20241022'
  ): Promise<AITextResponse> {
    const startTime = Date.now();

    // Dynamic import to avoid loading if not configured
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    try {
      const result = await client.messages.create({
        model: modelId,
        max_tokens: request.maxTokens || 4096,
        system: request.systemPrompt,
        messages: [{ role: 'user', content: request.prompt }],
      });

      const textBlock = result.content.find((c) => c.type === 'text');

      return {
        content: textBlock?.text || '',
        usage: {
          promptTokens: result.usage.input_tokens,
          completionTokens: result.usage.output_tokens,
          totalTokens: result.usage.input_tokens + result.usage.output_tokens,
        },
        finishReason: result.stop_reason === 'end_turn' ? 'stop' : 'length',
        latencyMs: Date.now() - startTime,
        model: modelId,
        provider: this.name,
      };
    } catch (error: any) {
      throw new Error(`[Anthropic] ${modelId} failed: ${error.message}`);
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
        'claude-3-haiku-20240307'
      );
      return { healthy: true, latencyMs: Date.now() - startTime };
    } catch (error: any) {
      return {
        healthy: false,
        latencyMs: Date.now() - startTime,
        error: error.message,
      };
    }
  }
}

// Singleton instance
export const anthropicProvider = new AnthropicProvider();
