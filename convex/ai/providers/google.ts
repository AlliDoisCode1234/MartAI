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

  private static MODELS: ProviderModel[] = [
    {
      modelId: 'gemini-2.0-flash',
      displayName: 'Gemini 2.0 Flash',
      capabilities: ['chat', 'vision', 'function_calling'],
      contextWindow: 1000000,
      costPer1kInputTokens: 0.0075,
      costPer1kOutputTokens: 0.03,
      priority: 1,
    },
    {
      modelId: 'gemini-pro',
      displayName: 'Gemini Pro',
      capabilities: ['chat', 'function_calling', 'structured_output'],
      contextWindow: 32000,
      costPer1kInputTokens: 0.125,
      costPer1kOutputTokens: 0.5,
      priority: 2,
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
    } catch (error: any) {
      throw new Error(`[Google] ${modelId} failed: ${error.message}`);
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
export const googleProvider = new GoogleProvider();
