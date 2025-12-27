/**
 * OpenAI Provider Adapter
 *
 * Implements the AIProvider interface for OpenAI models.
 */

import { generateText, embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import type {
  AIProvider,
  AITextRequest,
  AITextResponse,
  HealthCheckResult,
  ProviderModel,
} from './types';

export class OpenAIProvider implements AIProvider {
  name = 'openai';

  private static MODELS: ProviderModel[] = [
    {
      modelId: 'gpt-4o',
      displayName: 'GPT-4o',
      capabilities: ['chat', 'vision', 'function_calling', 'structured_output'],
      contextWindow: 128000,
      costPer1kInputTokens: 0.25, // $0.0025 per 1K
      costPer1kOutputTokens: 1.0, // $0.01 per 1K
      priority: 1,
    },
    {
      modelId: 'gpt-4o-mini',
      displayName: 'GPT-4o Mini',
      capabilities: ['chat', 'vision', 'function_calling', 'structured_output'],
      contextWindow: 128000,
      costPer1kInputTokens: 0.015, // $0.00015 per 1K
      costPer1kOutputTokens: 0.06, // $0.0006 per 1K
      priority: 2,
    },
    {
      modelId: 'gpt-3.5-turbo',
      displayName: 'GPT-3.5 Turbo',
      capabilities: ['chat', 'function_calling'],
      contextWindow: 16385,
      costPer1kInputTokens: 0.05, // $0.0005 per 1K
      costPer1kOutputTokens: 0.15, // $0.0015 per 1K
      priority: 3,
    },
  ];

  isConfigured(): boolean {
    return !!process.env.OPENAI_API_KEY;
  }

  getModels(): ProviderModel[] {
    return OpenAIProvider.MODELS;
  }

  async generateText(request: AITextRequest, modelId: string = 'gpt-4o'): Promise<AITextResponse> {
    const startTime = Date.now();

    try {
      const model = openai(modelId);
      const result = await generateText({
        model,
        prompt: request.prompt,
        system: request.systemPrompt,
        temperature: request.temperature,
        stopSequences: request.stopSequences,
        // maxTokens is controlled by model defaults
      });

      const usage = result.usage as any;

      return {
        content: result.text,
        usage: {
          promptTokens: usage?.promptTokens || usage?.inputTokens || 0,
          completionTokens: usage?.completionTokens || usage?.outputTokens || 0,
          totalTokens:
            usage?.totalTokens || (usage?.promptTokens || 0) + (usage?.completionTokens || 0),
        },
        finishReason: (result.finishReason as AITextResponse['finishReason']) || 'stop',
        latencyMs: Date.now() - startTime,
        model: modelId,
        provider: this.name,
      };
    } catch (error: any) {
      throw new Error(`[OpenAI] ${modelId} failed: ${error.message}`);
    }
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    if (texts.length === 1) {
      const { embedding } = await embed({
        model: openai.embedding('text-embedding-3-small'),
        value: texts[0],
      });
      return [embedding];
    }

    const { embeddings } = await embedMany({
      model: openai.embedding('text-embedding-3-small'),
      values: texts,
    });
    return embeddings;
  }

  async healthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    try {
      // Use cheapest model for health check
      await this.generateText({ prompt: 'Say OK', maxTokens: 5, temperature: 0 }, 'gpt-3.5-turbo');
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
export const openaiProvider = new OpenAIProvider();
