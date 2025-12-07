import { IntelligenceService } from './intelligence';
import { generateText } from 'ai';

// Mock dependencies
jest.mock('ai', () => ({
  generateText: jest.fn(),
}));

jest.mock('@ai-sdk/openai', () => ({
  openai: jest.fn(),
}));

jest.mock('../../_generated/api', () => ({
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
  let ctx: any;
  let service: IntelligenceService;
  const mockGenerateText = generateText as jest.Mock;

  beforeEach(() => {
    ctx = {
      runQuery: jest.fn(),
      runMutation: jest.fn(),
      runAction: jest.fn(),
    };
    service = new IntelligenceService(ctx);
    jest.clearAllMocks();
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
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

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
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = await service.retrieve('query');

      expect(result).toBe('');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('generate', () => {
    const mockUsage = { promptTokens: 10, completionTokens: 20, totalTokens: 30 };

    it('should generate text without reflection', async () => {
      mockGenerateText.mockResolvedValue({
        text: 'Generated content',
        usage: mockUsage,
      });

      const result = await service.generate('Prompt', '', { useReflection: false });

      expect(result.content).toBe('Generated content');
      expect(result.cost).toBe(0);
      expect(mockGenerateText).toHaveBeenCalledTimes(1);
      // Verify cost logging
      expect(ctx.runAction).toHaveBeenCalledWith(
        'neutralCost:aiCosts:addAICost',
        expect.objectContaining({
          usage: mockUsage,
        })
      );
    });

    it('should use persona context if provided', async () => {
      mockGenerateText.mockResolvedValue({
        text: 'Persona content',
        usage: mockUsage,
      });

      // Mock persona fetch
      ctx.runQuery.mockResolvedValue({ systemPrompt: 'You are custom persona.' });

      await service.generate('Prompt', '', { persona: 'CustomBot' });

      expect(ctx.runQuery).toHaveBeenCalledWith('ai:personas:getPersona', { name: 'CustomBot' });
      // Verify the prompt passed to LLM includes the persona prompt
      const callArgs = mockGenerateText.mock.calls[0][0]; // 1st call, 1st arg (options)
      expect(callArgs.prompt).toContain('You are custom persona.');
    });

    it('should perform reflection loop when useReflection is true', async () => {
      // We need 3 mock responses for the loop: Draft, Critique, Refine
      mockGenerateText
        .mockResolvedValueOnce({ text: 'Initial Draft', usage: mockUsage })
        .mockResolvedValueOnce({ text: 'Critique: Improve X', usage: mockUsage })
        .mockResolvedValueOnce({ text: 'Refined Draft', usage: mockUsage });

      const result = await service.generate('Prompt', '', { useReflection: true });

      // Expect 3 calls
      expect(mockGenerateText).toHaveBeenCalledTimes(3);

      // Final result should be the refined text
      expect(result.content).toBe('Refined Draft');

      // Issues should contain the critique
      expect(result.issues).toEqual(['Critique: Improve X']);
    });

    it('should skip refinement if critique says "No changes needed"', async () => {
      mockGenerateText
        .mockResolvedValueOnce({ text: 'Perfect Draft', usage: mockUsage })
        .mockResolvedValueOnce({ text: 'No changes needed.', usage: mockUsage });

      const result = await service.generate('Prompt', '', { useReflection: true });

      // Should stop after critique
      expect(mockGenerateText).toHaveBeenCalledTimes(2);
      expect(result.content).toBe('Perfect Draft');
    });
  });
});
