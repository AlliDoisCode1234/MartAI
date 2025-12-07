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

  /**
   * Generate content using AI, optionally with reflection (Self-Correction).
   */
  async generate(
    prompt: string,
    context: string = '',
    options: GenerationOptions = {}
  ): Promise<GenerationResult> {
    const traceId = crypto.randomUUID();
    const modelName = options.model || 'gpt-4o';
    const temperature = options.temperature || 0.7;

    const fullPrompt = `${options.persona ? `You are ${options.persona}.\n` : ''}
${context ? `\nCONTEXT:\n${context}\n` : ''}
${prompt}`;

    console.log(`[IntelligenceService] Generating (Trace: ${traceId})...`);

    // 1. Initial Draft
    const draft = await this.callLLM(modelName, fullPrompt, temperature);

    if (!options.useReflection) {
      return { content: draft, traceId, cost: 0 }; // TODO: Calculate actual cost
    }

    // 2. Reflection Loop (The "Mart" Persona)
    console.log(`[IntelligenceService] Critiquing (Trace: ${traceId})...`);
    const critique = await this.critiqueDraft(draft, options.persona || 'Senior Analyst');

    // 3. Refinement
    console.log(`[IntelligenceService] Refining (Trace: ${traceId})...`);
    const refined = await this.refineDraft(draft, critique, options.persona || 'Senior Analyst');

    // Log the chain of thought (Stub for future DB logging)
    console.log(
      `[IntelligenceService] Trace ${traceId} Complete. Critique: ${critique.substring(0, 100)}...`
    );

    return {
      content: refined,
      traceId,
      cost: 0, // Placeholder
      issues: [critique],
    };
  }

  // --- Internal Helpers ---

  private async callLLM(modelName: string, prompt: string, temperature: number): Promise<string> {
    const model = openai(modelName as any);
    const result = await generateText({
      model,
      prompt,
      temperature,
    });
    return result.text;
  }

  private async critiqueDraft(draft: string, persona: string): Promise<string> {
    const critiquePrompt = `You are "Mart", a Senior SEO Analyst at MartAI. 
Your job is to bluntly but constructively critique this draft. 
Focus on: 
1. Search Intent mismatch. 
2. Brand Voice consistency. 
3. Missing semantic depth.

Return a concise paragraph of feedback. If it's perfect, say "No changes needed."

DRAFT:
${draft.substring(0, 3000)}... (truncated)`; // Truncate to save tokens on critique

    return this.callLLM('gpt-4o', critiquePrompt, 0.5); // Lower temp for critique
  }

  private async refineDraft(draft: string, critique: string, persona: string): Promise<string> {
    if (critique.includes('No changes needed')) return draft;

    const refinePrompt = `You are a professional content writer.
    
Critique from Senior Analyst Mart:
"${critique}"

Please rewrite the following draft to address this feedback. Keep what works, fix what doesn't.

ORIGINAL DRAFT:
${draft}`;

    return this.callLLM('gpt-4o', refinePrompt, 0.7);
  }
}
