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

  // Updated January 2026 - Latest OpenAI models
  private static MODELS: ProviderModel[] = [
    {
      modelId: 'gpt-4o',
      displayName: 'GPT-4o',
      capabilities: ['chat', 'vision', 'function_calling', 'structured_output'],
      contextWindow: 128000,
      costPer1kInputTokens: 0.25, // $2.50/1M
      costPer1kOutputTokens: 1.0, // $10/1M
      priority: 1, // Standard tier
    },
    {
      modelId: 'gpt-4o-mini',
      displayName: 'GPT-4o Mini',
      capabilities: ['chat', 'vision', 'function_calling', 'structured_output'],
      contextWindow: 128000,
      costPer1kInputTokens: 0.015, // $0.15/1M
      costPer1kOutputTokens: 0.06, // $0.60/1M
      priority: 2, // Cheap tier
    },
    {
      modelId: 'o3-mini',
      displayName: 'O3 Mini (Reasoning)',
      capabilities: ['chat', 'structured_output'],
      contextWindow: 200000,
      costPer1kInputTokens: 1.1, // $1.10/1M
      costPer1kOutputTokens: 4.4, // $4.40/1M
      priority: 3, // Premium reasoning tier
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

      // AI SDK usage type is loosely typed, safely access properties
      const usage = result.usage as
        | {
            promptTokens?: number;
            completionTokens?: number;
            totalTokens?: number;
            inputTokens?: number;
            outputTokens?: number;
          }
        | undefined;

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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`[OpenAI] ${modelId} failed: ${message}`);
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
      // Use cheapest model for health check (gpt-4o-mini)
      await this.generateText({ prompt: 'Say OK', maxTokens: 5, temperature: 0 }, 'gpt-4o-mini');
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
export const openaiProvider = new OpenAIProvider();
