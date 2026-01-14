/**
 * Google AI Provider Adapter
 *
 * Implements the AIProvider interface for Gemini models.
 */

import type {
  AIProvider,
  AITextRequest,
  AITextResponse,
  HealthCheckResult,
  ProviderModel,
} from './types';

export class GoogleProvider implements AIProvider {
  name = 'google';

  // Updated January 2026 - Gemini 2.5 series (2.0 still available)
  private static MODELS: ProviderModel[] = [
    {
      modelId: 'gemini-2.5-flash',
      displayName: 'Gemini 2.5 Flash',
      capabilities: ['chat', 'vision', 'function_calling'],
      contextWindow: 1000000,
      costPer1kInputTokens: 0.015, // $0.15/1M
      costPer1kOutputTokens: 0.06, // $0.60/1M
      priority: 1, // Cheap tier (fast + affordable)
    },
    {
      modelId: 'gemini-2.0-flash',
      displayName: 'Gemini 2.0 Flash',
      capabilities: ['chat', 'vision', 'function_calling'],
      contextWindow: 1000000,
      costPer1kInputTokens: 0.0075, // $0.075/1M
      costPer1kOutputTokens: 0.03, // $0.30/1M
      priority: 2, // Legacy cheap tier
    },
    {
      modelId: 'gemini-2.5-pro',
      displayName: 'Gemini 2.5 Pro',
      capabilities: ['chat', 'vision', 'function_calling', 'structured_output'],
      contextWindow: 2000000,
      costPer1kInputTokens: 0.125, // $1.25/1M (<200K), $2.50/1M (>200K)
      costPer1kOutputTokens: 0.5, // $5/1M (<200K), $10/1M (>200K)
      priority: 3, // Premium reasoning tier
    },
  ];

  isConfigured(): boolean {
    return !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  }

  getModels(): ProviderModel[] {
    return GoogleProvider.MODELS;
  }

  async generateText(
    request: AITextRequest,
    modelId: string = 'gemini-2.0-flash'
  ): Promise<AITextResponse> {
    const startTime = Date.now();

    // Dynamic import
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const client = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

    try {
      const model = client.getGenerativeModel({ model: modelId });

      // Build chat with system prompt if provided
      const chat = model.startChat({
        history: request.systemPrompt
          ? [
              { role: 'user', parts: [{ text: 'System: ' + request.systemPrompt }] },
              { role: 'model', parts: [{ text: 'Understood.' }] },
            ]
          : [],
      });

      const result = await chat.sendMessage(request.prompt);
      const response = result.response;

      return {
        content: response.text(),
        usage: {
          promptTokens: response.usageMetadata?.promptTokenCount || 0,
          completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: response.usageMetadata?.totalTokenCount || 0,
        },
        finishReason: 'stop',
        latencyMs: Date.now() - startTime,
        model: modelId,
        provider: this.name,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`[Google] ${modelId} failed: ${message}`);
    }
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const client = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');
    const model = client.getGenerativeModel({ model: 'text-embedding-004' });

    const results = await Promise.all(texts.map((text) => model.embedContent(text)));

    return results.map((r) => r.embedding.values);
  }

  async healthCheck(): Promise<HealthCheckResult> {
    if (!this.isConfigured()) {
      return { healthy: false, latencyMs: 0, error: 'API key not configured' };
    }

    const startTime = Date.now();
    try {
      await this.generateText(
        { prompt: 'Say OK', maxTokens: 5, temperature: 0 },
        'gemini-2.0-flash'
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
export const googleProvider = new GoogleProvider();
