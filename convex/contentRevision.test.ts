import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { reviseWithPersona } from './contentRevision';

/**
 * Content Revision Action Tests
 *
 * Tests the Phoo Coach revision flow with the strict Reflection Loop.
 * Following /debugging-workflow: Ensuring root cause validation.
 */

// Mock Convex internals
vi.mock('./_generated/server', () => ({
  action: vi.fn((config) => config.handler),
  mutation: vi.fn((config) => config.handler),
  query: vi.fn((config) => config.handler),
  internalAction: vi.fn((config) => config.handler),
  internalMutation: vi.fn((config) => config),
  internalQuery: vi.fn((config) => config),
}));

vi.mock('@convex-dev/auth/server', () => ({
  getAuthUserId: vi.fn(),
  convexAuth: vi.fn(() => ({ auth: {}, signIn: {}, signOut: {}, store: {} })),
}));

vi.mock('./_generated/api', () => ({
  internal: {
    projects: {
      projects: {
        verifyProjectAccess: 'internal.projects.projects.verifyProjectAccess',
      },
    },
    ai: {
      writerPersonas: {
        getOrCreatePersonaInternal: 'internal.ai.writerPersonas.getOrCreatePersonaInternal',
        updateMetrics: 'internal.ai.writerPersonas.updateMetrics',
      },
    },
    contentFeedback: {
      getPersonaSignalsInternal: 'internal.contentFeedback.getPersonaSignalsInternal',
      submitFeedbackInternal: 'internal.contentFeedback.submitFeedbackInternal',
    },
  },
  api: {
    ai: {
      router: {
        router: {
          generateWithFallback: 'api.ai.router.router.generateWithFallback',
        },
      },
    },
  },
}));

vi.mock('convex/values', () => ({
  v: {
    id: vi.fn((table: string) => ({ _type: 'id', table })),
    string: vi.fn(() => ({ _type: 'string' })),
    number: vi.fn(() => ({ _type: 'number' })),
    boolean: vi.fn(() => ({ _type: 'boolean' })),
    optional: vi.fn((inner) => ({ _type: 'optional', inner })),
    array: vi.fn((inner) => ({ _type: 'array', inner })),
    union: vi.fn((...args) => ({ _type: 'union', options: args })),
    literal: vi.fn((val) => ({ _type: 'literal', value: val })),
    object: vi.fn((schema) => ({ _type: 'object', schema })),
  },
}));

describe('Content Revision: Reflection Loop', () => {
  const mockUserId = 'test-user-id';
  const mockProjectId = 'proj-test' as any;
  const mockContentPieceId = 'piece-test' as any;

  let mockCtx: {
    runQuery: Mock;
    runMutation: Mock;
    runAction: Mock;
  };

  beforeEach(async () => {
    const authModule = await import('@convex-dev/auth/server');
    (authModule.getAuthUserId as Mock).mockResolvedValue(mockUserId);

    mockCtx = {
      runQuery: vi.fn(),
      runMutation: vi.fn(),
      runAction: vi.fn(),
    };

    // Default: project access verified
    mockCtx.runQuery.mockImplementation(async (queryName) => {
      if (queryName === 'internal.projects.projects.verifyProjectAccess') return true;
      if (queryName === 'internal.contentFeedback.getPersonaSignalsInternal') return [];
      return null;
    });

    // Default: persona loaded
    mockCtx.runMutation.mockImplementation(async (mutationName) => {
      if (mutationName === 'internal.ai.writerPersonas.getOrCreatePersonaInternal') {
        return { _id: 'persona-1', name: 'Default Persona' };
      }
      return null;
    });
  });

  it('should return immediately if audit returns PASS', async () => {
    mockCtx.runAction.mockImplementation(async (actionName, args) => {
      if (args.taskType === 'draft') {
        return { content: 'This is the draft revision.', usage: { totalTokens: 100 } };
      }
      if (args.taskType === 'chat') {
        // Audit pass
        return { content: 'PASS', usage: { totalTokens: 50 } };
      }
      return { content: '', usage: { totalTokens: 0 } };
    });

    const handler = (reviseWithPersona as any);
    const result = await handler(mockCtx, {
      projectId: mockProjectId,
      contentPieceId: mockContentPieceId,
      instruction: 'Make it better',
      currentContent: 'This is the original content. '.repeat(20), // Ensure REVISE mode
    });

    expect(result.revisedContent).toBe('This is the draft revision.');
    expect(result.tokensUsed).toBe(150); // 100 + 50
    expect(result.mode).toBe('revise');
    
    // Only two AI calls: Draft and Audit
    expect(mockCtx.runAction).toHaveBeenCalledTimes(2);
  });

  it('should run refinement loop if audit fails', async () => {
    let callCount = 0;
    mockCtx.runAction.mockImplementation(async (actionName, args) => {
      callCount++;
      if (callCount === 1) {
        // Draft
        return { content: 'This is the draft revision with a hallucination.', usage: { totalTokens: 100 } };
      }
      if (callCount === 2) {
        // Audit fail
        return { content: 'Failed: hallucinated fact in paragraph 1.', usage: { totalTokens: 50 } };
      }
      if (callCount === 3) {
        // Refine
        return { content: 'This is the corrected draft revision.', usage: { totalTokens: 120 } };
      }
      return { content: '', usage: { totalTokens: 0 } };
    });

    const handler = (reviseWithPersona as any);
    const result = await handler(mockCtx, {
      projectId: mockProjectId,
      contentPieceId: mockContentPieceId,
      instruction: 'Make it better',
      currentContent: 'This is the original content. '.repeat(20), // Ensure REVISE mode
    });

    expect(result.revisedContent).toBe('This is the corrected draft revision.');
    expect(result.tokensUsed).toBe(270); // 100 + 50 + 120
    
    // Three AI calls: Draft, Audit, Refine
    expect(mockCtx.runAction).toHaveBeenCalledTimes(3);
  });

  it('should switch to GENERATE mode if content is too short', async () => {
    mockCtx.runAction.mockImplementation(async (actionName, args) => {
      if (args.taskType === 'draft') {
        return { content: 'New generated article.', usage: { totalTokens: 500 } };
      }
      if (args.taskType === 'chat') {
        return { content: 'PASS', usage: { totalTokens: 50 } };
      }
      return { content: '', usage: { totalTokens: 0 } };
    });

    const handler = (reviseWithPersona as any);
    const result = await handler(mockCtx, {
      projectId: mockProjectId,
      contentPieceId: mockContentPieceId,
      instruction: 'Write an article about AI',
      currentContent: 'Short', // < 50 words triggers GENERATE mode
      title: 'AI Future',
    });

    expect(result.mode).toBe('generate');
    expect(result.revisedContent).toBe('New generated article.');
  });
});
