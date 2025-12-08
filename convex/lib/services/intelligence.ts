import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { components } from '../../_generated/api';
import { ActionCtx } from '../../_generated/server';

export interface GenerationOptions {
  model?: string;
  useReflection?: boolean;
  temperature?: number;
  persona?: string;
}

export interface GenerationResult {
  content: string;
  traceId: string;
  cost: number; // Estimated cost in cents
  issues?: string[];
}

export class IntelligenceService {
  private ctx: ActionCtx;

  constructor(ctx: ActionCtx) {
    this.ctx = ctx;
  }

  /**
   * Ingest content into the RAG knowledge base.
   */
  async ingest(source: string, text: string, metadata: Record<string, any> = {}) {
    try {
      await this.ctx.runMutation((components as any).rag.add, {
        text,
        metadata: { ...metadata, source },
      });
      console.log(`[IntelligenceService] Ingested ${source}`);
    } catch (error) {
      console.error(`[IntelligenceService] Ingestion failed for ${source}:`, error);
      // Swallow error to prevent blocking main flow, but log it
    }
  }

  /**
   * Retrieve relevant context from the RAG knowledge base.
   */
  async retrieve(query: string, limit: number = 3): Promise<string> {
    try {
      const searchResults = await this.ctx.runQuery((components as any).rag.search, {
        query,
        limit,
      });
      const context = searchResults
        .map((result: any) => `[Source: ${result.metadata?.source || 'Unknown'}]\n${result.text}`)
        .join('\n\n');

      if (context) {
        console.log(
          `[IntelligenceService] Retrieved ${context.length} chars of context for query: "${query}"`
        );
      }
      return context;
    } catch (error) {
      console.warn(`[IntelligenceService] Retrieval failed for query: "${query}"`, error);
      return '';
    }
  }

  async generate(
    prompt: string,
    context: string = '',
    options: GenerationOptions & { userId?: string } = {}
  ): Promise<GenerationResult> {
    // Dynamic import for api to avoid circular dependencies if needed, or simply use the top-level import
    // In Convex actions, top level import of `api` is fine usually, but let's stick to the pattern if it was there for a reason.
    // However, `api` is usually imported from `../../_generated/api`.
    const { api } = require('../../_generated/api');
    const traceId = crypto.randomUUID();
    const modelName = options.model || 'gpt-4o';
    const temperature = options.temperature || 0.7;

    let systemInstruction = '';
    if (options.persona) {
      try {
        const personaData = await this.ctx.runQuery(api.ai.personas.getPersona, {
          name: options.persona,
        });
        if (personaData) {
          systemInstruction = personaData.systemPrompt;
        } else {
          console.warn(
            `[IntelligenceService] Persona '${options.persona}' not found. Using default.`
          );
          systemInstruction = `You are ${options.persona}.`;
        }
      } catch (e) {
        console.error(`[IntelligenceService] Failed to load persona '${options.persona}'`, e);
        systemInstruction = `You are ${options.persona}.`;
      }
    }

    const fullPrompt = `${systemInstruction}
${context ? `\nCONTEXT:\n${context}\n` : ''}
${prompt}`;

    console.log(`[IntelligenceService] Generating (Trace: ${traceId})...`);

    // 1. Initial Draft
    const { text: draft, usage: draftUsage } = await this.callLLM(
      modelName,
      fullPrompt,
      temperature
    );

    // Log cost for draft
    await this.logCost(draftUsage, modelName, traceId, options.userId);

    if (!options.useReflection) {
      return { content: draft, traceId, cost: 0 };
    }

    // 2. Reflection Loop
    console.log(`[IntelligenceService] Critiquing (Trace: ${traceId})...`);
    const { text: critique, usage: critiqueUsage } = await this.critiqueDraft(
      draft,
      options.persona || 'Senior Analyst',
      systemInstruction
    );
    await this.logCost(critiqueUsage, modelName, traceId, options.userId);

    // 3. Refinement
    console.log(`[IntelligenceService] Refining (Trace: ${traceId})...`);
    const { text: refined, usage: refinedUsage } = await this.refineDraft(
      draft,
      critique,
      options.persona || 'Senior Analyst',
      systemInstruction
    );
    await this.logCost(refinedUsage, modelName, traceId, options.userId);

    console.log(
      `[IntelligenceService] Trace ${traceId} Complete. Critique: ${critique.substring(0, 100)}...`
    );

    return {
      content: refined,
      traceId,
      cost: 0,
      issues: [critique],
    };
  }

  private async logCost(usage: any, modelId: string, traceId: string, userId?: string) {
    if (!usage) return;
    try {
      await this.ctx.runAction((components as any).neutralCost.aiCosts.addAICost, {
        messageId: crypto.randomUUID(),
        threadId: traceId,
        modelId,
        providerId: 'openai',
        usage: {
          completionTokens: usage.completionTokens,
          promptTokens: usage.promptTokens,
          totalTokens: usage.totalTokens,
        },
        userId: userId,
      });
    } catch (e) {
      console.error('[IntelligenceService] Failed to log cost:', e);
    }
  }

  /**
   * Model fallback chain: try premium first, then fall back to cheaper models
   */
  private static readonly MODEL_FALLBACK_CHAIN = ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'];

  /**
   * Call LLM with retry and model fallback
   */
  private async callLLM(
    modelName: string,
    prompt: string,
    temperature: number,
    maxRetries: number = 3
  ): Promise<{ text: string; usage: any; modelUsed: string }> {
    // Build fallback chain starting from requested model
    const startIndex = IntelligenceService.MODEL_FALLBACK_CHAIN.indexOf(modelName);
    const fallbackChain =
      startIndex >= 0
        ? IntelligenceService.MODEL_FALLBACK_CHAIN.slice(startIndex)
        : [modelName, ...IntelligenceService.MODEL_FALLBACK_CHAIN];

    let lastError: Error | null = null;

    for (const currentModel of fallbackChain) {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const model = openai(currentModel as any);
          const result = await generateText({
            model,
            prompt,
            temperature,
          });

          if (currentModel !== modelName) {
            console.log(
              `[IntelligenceService] Used fallback model: ${currentModel} (requested: ${modelName})`
            );
          }

          return { text: result.text, usage: result.usage, modelUsed: currentModel };
        } catch (error: any) {
          lastError = error;
          const isRateLimit = error?.message?.includes('rate') || error?.status === 429;
          const isServerError = error?.status >= 500;

          console.warn(
            `[IntelligenceService] LLM call failed (model: ${currentModel}, attempt: ${attempt}/${maxRetries}):`,
            error?.message || error
          );

          // For rate limits or server errors, wait with exponential backoff
          if ((isRateLimit || isServerError) && attempt < maxRetries) {
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Max 10s
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else if (attempt === maxRetries) {
            // Max retries reached for this model, try next in fallback chain
            break;
          }
        }
      }
    }

    // All models and retries exhausted
    throw new Error(
      `[IntelligenceService] All LLM models failed. Last error: ${lastError?.message || 'Unknown error'}`
    );
  }

  private async critiqueDraft(
    draft: string,
    personaName: string,
    personaPrompt: string
  ): Promise<{ text: string; usage: any }> {
    const critiquePrompt = `${personaPrompt || `You are "${personaName}".`}
    
Your job is to bluntly but constructively critique this draft. 
Focus on: 
1. Search Intent mismatch. 
2. Brand Voice consistency. 
3. Missing semantic depth.

Return a concise paragraph of feedback. If it's perfect, say "No changes needed."

DRAFT:
${draft.substring(0, 3000)}... (truncated)`;

    return this.callLLM('gpt-4o', critiquePrompt, 0.5);
  }

  private async refineDraft(
    draft: string,
    critique: string,
    personaName: string,
    personaPrompt: string
  ): Promise<{ text: string; usage: any }> {
    if (critique.includes('No changes needed'))
      return { text: draft, usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 } };

    const refinePrompt = `You are a professional content writer.
    
Critique from ${personaName}:
"${critique}"

Please rewrite the following draft to address this feedback. Keep what works, fix what doesn't.

ORIGINAL DRAFT:
${draft}`;

    return this.callLLM('gpt-4o', refinePrompt, 0.7);
  }
}
