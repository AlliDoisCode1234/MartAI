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

    // Early exit if no changes needed
    const critiqueNormalized = critique.toLowerCase().trim();
    if (
      critiqueNormalized.includes('no changes needed') ||
      critiqueNormalized.includes('no changes required') ||
      critiqueNormalized.includes('no improvements') ||
      critiqueNormalized === ''
    ) {
      console.log(`[IntelligenceService] Trace ${traceId} Complete - No refinement needed.`);
      return {
        content: draft,
        traceId,
        cost: 0,
        issues: [critique],
      };
    }

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
   * Call LLM with automatic multi-provider failover
   * Uses the AI router for intelligent provider selection and failover
   */
  private async callLLM(
    modelName: string,
    prompt: string,
    temperature: number,
    _maxRetries: number = 3
  ): Promise<{ text: string; usage: any; modelUsed: string }> {
    const { api } = require('../../_generated/api');

    try {
      // Use the multi-agent router for automatic failover
      const result = await this.ctx.runAction(api.ai.router.router.generateWithFallback, {
        prompt,
        temperature,
        strategy: 'balanced',
        userId: undefined, // Can be passed from outer context if needed
      });

      return {
        text: result.content,
        usage: result.usage,
        modelUsed: `${result.provider}/${result.model}`,
      };
    } catch (error: any) {
      console.error('[IntelligenceService] Multi-provider failover exhausted:', error.message);
      throw error;
    }
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
