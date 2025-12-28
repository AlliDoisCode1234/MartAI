import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { IntelligenceService } from './intelligence';
import { generateText } from 'ai';

// Mock dependencies
vi.mock('ai', () => ({
  generateText: vi.fn(),
}));

vi.mock('@ai-sdk/openai', () => ({
  openai: vi.fn(),
}));

vi.mock('../../_generated/api', () => ({
  api: {
    ai: {
      personas: {
        getPersona: 'ai:personas:getPersona',
      },
    },
  },
  components: {
    rag: {
      add: 'rag:add',
      search: 'rag:search',
    },
    neutralCost: {
      aiCosts: {
        addAICost: 'neutralCost:aiCosts:addAICost',
      },
    },
  },
}));

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid',
  },
});

describe('IntelligenceService', () => {
  let ctx: {
    runQuery: Mock;
    runMutation: Mock;
    runAction: Mock;
  };
  let service: IntelligenceService;
  const mockGenerateText = generateText as Mock;

  beforeEach(() => {
    ctx = {
      runQuery: vi.fn(),
      runMutation: vi.fn(),
      runAction: vi.fn(),
    };
    service = new IntelligenceService(ctx as any);
    vi.clearAllMocks();
  });

  describe('ingest', () => {
    it('should call rag.add mutation', async () => {
      const source = 'test-source';
      const text = 'test content';
      const metadata = { valid: true };

      await service.ingest(source, text, metadata);

      expect(ctx.runMutation).toHaveBeenCalledWith('rag:add', {
        text,
        metadata: { ...metadata, source },
      });
    });

    it('should handle errors gracefully', async () => {
      ctx.runMutation.mockRejectedValue(new Error('Ingest failed'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await service.ingest('source', 'text');

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('retrieve', () => {
    it('should call rag.search and format results', async () => {
      const query = 'test query';
      const mockResults = [
        { text: 'Result 1', metadata: { source: 'Source A' } },
        { text: 'Result 2', metadata: { source: 'Source B' } },
      ];

      ctx.runQuery.mockResolvedValue(mockResults);

      const result = await service.retrieve(query);

      expect(ctx.runQuery).toHaveBeenCalledWith('rag:search', {
        query,
        limit: 3, // default
      });
      expect(result).toContain('[Source: Source A]\nResult 1');
      expect(result).toContain('[Source: Source B]\nResult 2');
    });

    it('should return empty string on failure', async () => {
      ctx.runQuery.mockRejectedValue(new Error('Search failed'));
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = await service.retrieve('query');

      expect(result).toBe('');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('generate', () => {
    const mockUsage = { promptTokens: 10, completionTokens: 20, totalTokens: 30 };

    // Helper to create router response format
    const mockRouterResponse = (content: string) => ({
      content,
      usage: mockUsage,
      provider: 'openai',
      model: 'gpt-4o-mini',
    });

    it('should generate text without reflection', async () => {
      // Mock the router action call
      ctx.runAction.mockResolvedValue(mockRouterResponse('Generated content'));

      const result = await service.generate('Prompt', '', { useReflection: false });

      expect(result.content).toBe('Generated content');
      expect(result.cost).toBe(0);
      // Should call router once for draft, then once for logging cost
      expect(ctx.runAction).toHaveBeenCalled();
    });

    it.skip('should use persona context if provided (TODO: fix mock format issue)', async () => {
      ctx.runAction.mockResolvedValue(mockRouterResponse('Persona content'));

      // Mock persona fetch
      ctx.runQuery.mockResolvedValue({ systemPrompt: 'You are custom persona.' });

      await service.generate('Prompt', '', { persona: 'CustomBot' });

      expect(ctx.runQuery).toHaveBeenCalledWith('ai:personas:getPersona', { name: 'CustomBot' });
    });

    it('should perform reflection loop when useReflection is true', async () => {
      // Mock 3 calls: Draft, Critique, Refine
      ctx.runAction
        .mockResolvedValueOnce(mockRouterResponse('Initial Draft')) // Draft
        .mockResolvedValueOnce(undefined) // Cost logging
        .mockResolvedValueOnce(mockRouterResponse('Critique: Improve X')) // Critique
        .mockResolvedValueOnce(undefined) // Cost logging
        .mockResolvedValueOnce(mockRouterResponse('Refined Draft')) // Refine
        .mockResolvedValueOnce(undefined); // Cost logging

      const result = await service.generate('Prompt', '', { useReflection: true });

      // Final result should be the refined text
      expect(result.content).toBe('Refined Draft');
      expect(result.issues).toEqual(['Critique: Improve X']);
    });

    it('should skip refinement if critique says "No changes needed"', async () => {
      ctx.runAction
        .mockResolvedValueOnce(mockRouterResponse('Perfect Draft')) // Draft
        .mockResolvedValueOnce(undefined) // Cost logging
        .mockResolvedValueOnce(mockRouterResponse('No changes needed.')); // Critique

      const result = await service.generate('Prompt', '', { useReflection: true });

      // Should return the draft since no refinement needed
      expect(result.content).toBe('Perfect Draft');
    });
  });
});
