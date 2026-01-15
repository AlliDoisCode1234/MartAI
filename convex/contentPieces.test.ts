import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

/**
 * ContentPieces E2E Flow Tests
 *
 * Tests the core content management flow after cleanup:
 * - Create content piece
 * - Retrieve content piece
 * - Update content piece
 * - Schedule/unschedule content
 * - Delete content piece
 *
 * Following /debugging-workflow: These tests verify the flows
 * work correctly after removing deprecated briefs/drafts tables.
 */

// Mock Convex internals
vi.mock('./_generated/server', () => ({
  query: vi.fn((config) => config),
  mutation: vi.fn((config) => config),
}));

vi.mock('./auth', () => ({
  auth: {
    getUserId: vi.fn(),
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

// Import after mocks
import * as contentPieces from './contentPieces';

describe('ContentPieces CRUD', () => {
  const mockUserId = 'test-user-id';
  const mockProjectId = 'test-project-id' as unknown as any;
  const mockContentPieceId = 'test-content-piece-id' as unknown as any;
  const mockClusterId = 'test-cluster-id' as unknown as any;

  // Mock project that belongs to the user
  const mockProject = {
    _id: mockProjectId,
    userId: mockUserId,
    name: 'Test Project',
  };

  // Mock content piece
  const mockContentPiece = {
    _id: mockContentPieceId,
    projectId: mockProjectId,
    title: 'Test Content',
    status: 'draft',
  };

  let mockCtx: {
    db: {
      get: Mock;
      query: Mock;
      insert: Mock;
      patch: Mock;
      delete: Mock;
    };
  };

  beforeEach(async () => {
    // Setup auth mock to return valid user
    const mockAuth = await import('./auth');
    (mockAuth.auth.getUserId as Mock).mockResolvedValue(mockUserId);

    mockCtx = {
      db: {
        get: vi.fn((id: unknown) => {
          // Return project when querying project ID, content piece otherwise
          if (id === mockProjectId) return Promise.resolve(mockProject);
          if (id === mockContentPieceId) return Promise.resolve(mockContentPiece);
          return Promise.resolve(null);
        }),
        query: vi.fn(() => ({
          withIndex: vi.fn(() => ({
            filter: vi.fn(() => ({
              order: vi.fn(() => ({
                take: vi.fn(() => Promise.resolve([])),
                collect: vi.fn(() => Promise.resolve([])),
                first: vi.fn(() => Promise.resolve(null)),
              })),
              collect: vi.fn(() => Promise.resolve([])),
            })),
            order: vi.fn(() => ({
              take: vi.fn(() => Promise.resolve([])),
              collect: vi.fn(() => Promise.resolve([])),
            })),
            collect: vi.fn(() => Promise.resolve([])),
            first: vi.fn(() => Promise.resolve(null)),
          })),
        })),
        insert: vi.fn(() => Promise.resolve(mockContentPieceId)),
        patch: vi.fn(() => Promise.resolve()),
        delete: vi.fn(() => Promise.resolve()),
      },
    };
  });

  describe('create', () => {
    it('should create a content piece with required fields', async () => {
      const handler = (contentPieces.create as unknown as { handler: Function }).handler;
      const args = {
        projectId: mockProjectId,
        contentType: 'blog' as const,
        title: 'Test Blog Post',
        keywords: ['seo', 'marketing'],
        clusterId: mockClusterId,
      };

      const result = await handler(mockCtx, args);

      expect(mockCtx.db.insert).toHaveBeenCalledWith(
        'contentPieces',
        expect.objectContaining({
          projectId: mockProjectId,
          contentType: 'blog',
          title: 'Test Blog Post',
          keywords: ['seo', 'marketing'],
        })
      );
      expect(result).toBe(mockContentPieceId);
    });

    it('should set initial status to generating', async () => {
      const handler = (contentPieces.create as unknown as { handler: Function }).handler;
      const args = {
        projectId: mockProjectId,
        contentType: 'pillar' as const,
        title: 'Pillar Content',
        keywords: ['main topic'],
      };

      await handler(mockCtx, args);

      expect(mockCtx.db.insert).toHaveBeenCalledWith(
        'contentPieces',
        expect.objectContaining({
          status: 'generating',
        })
      );
    });
  });

  describe('getById', () => {
    it('should return content piece by ID', async () => {
      const handler = (contentPieces.getById as unknown as { handler: Function }).handler;
      const result = await handler(mockCtx, { contentPieceId: mockContentPieceId });

      expect(mockCtx.db.get).toHaveBeenCalledWith(mockContentPieceId);
      expect(result).toEqual(mockContentPiece);
    });

    it('should return null for non-existent ID', async () => {
      const handler = (contentPieces.getById as unknown as { handler: Function }).handler;
      const result = await handler(mockCtx, { contentPieceId: 'non-existent' });

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update content piece fields', async () => {
      const handler = (contentPieces.update as unknown as { handler: Function }).handler;
      const args = {
        contentPieceId: mockContentPieceId,
        title: 'New Title',
        content: 'Updated content here',
        seoScore: 85,
      };

      await handler(mockCtx, args);

      expect(mockCtx.db.patch).toHaveBeenCalledWith(
        mockContentPieceId,
        expect.objectContaining({
          title: 'New Title',
          content: 'Updated content here',
          seoScore: 85,
        })
      );
    });

    it('should throw if content piece not found', async () => {
      const handler = (contentPieces.update as unknown as { handler: Function }).handler;

      await expect(
        handler(mockCtx, { contentPieceId: 'non-existent', title: 'New' })
      ).rejects.toThrow();
    });
  });

  describe('schedule', () => {
    it('should schedule content piece with future publish date', async () => {
      const handler = (contentPieces.schedule as unknown as { handler: Function }).handler;
      const publishDate = Date.now() + 86400000; // Tomorrow

      await handler(mockCtx, {
        contentPieceId: mockContentPieceId,
        publishDate,
      });

      expect(mockCtx.db.patch).toHaveBeenCalledWith(
        mockContentPieceId,
        expect.objectContaining({
          status: 'scheduled',
          scheduledDate: publishDate,
        })
      );
    });

    it('should throw if content piece not found', async () => {
      const handler = (contentPieces.schedule as unknown as { handler: Function }).handler;

      await expect(
        handler(mockCtx, { contentPieceId: 'non-existent', publishDate: Date.now() + 86400000 })
      ).rejects.toThrow();
    });
  });

  describe('unschedule', () => {
    it('should revert scheduled content to draft', async () => {
      const handler = (contentPieces.unschedule as unknown as { handler: Function }).handler;
      await handler(mockCtx, { contentPieceId: mockContentPieceId });

      expect(mockCtx.db.patch).toHaveBeenCalledWith(
        mockContentPieceId,
        expect.objectContaining({
          status: 'draft',
          scheduledDate: undefined,
        })
      );
    });
  });

  describe('remove', () => {
    it('should delete content piece', async () => {
      const handler = (contentPieces.remove as unknown as { handler: Function }).handler;
      await handler(mockCtx, { contentPieceId: mockContentPieceId });

      expect(mockCtx.db.delete).toHaveBeenCalledWith(mockContentPieceId);
    });

    it('should throw if content piece not found', async () => {
      const handler = (contentPieces.remove as unknown as { handler: Function }).handler;

      await expect(handler(mockCtx, { contentPieceId: 'non-existent' })).rejects.toThrow();
    });
  });
});

describe('ContentPieces Calendar Integration', () => {
  const mockProjectId = 'test-project-id' as unknown as any;

  const mockScheduledPieces = [
    {
      _id: 'piece-1',
      title: 'Blog Post 1',
      status: 'scheduled',
      scheduledDate: Date.now() + 86400000,
    },
    {
      _id: 'piece-2',
      title: 'Blog Post 2',
      status: 'scheduled',
      scheduledDate: Date.now() + 172800000,
    },
  ];

  let mockCtx: {
    db: {
      query: Mock;
    };
  };

  beforeEach(async () => {
    const mockAuth = await import('./auth');
    (mockAuth.auth.getUserId as Mock).mockResolvedValue('test-user-id');

    mockCtx = {
      db: {
        query: vi.fn(() => ({
          withIndex: vi.fn(() => ({
            filter: vi.fn(() => ({
              collect: vi.fn(() => Promise.resolve(mockScheduledPieces)),
            })),
            collect: vi.fn(() => Promise.resolve(mockScheduledPieces)),
          })),
        })),
      },
    };
  });

  describe('listScheduled', () => {
    it('should return scheduled content for project', async () => {
      const handler = (contentPieces.listScheduled as unknown as { handler: Function }).handler;
      const result = await handler(mockCtx, { projectId: mockProjectId });

      expect(mockCtx.db.query).toHaveBeenCalledWith('contentPieces');
      expect(result.length).toBe(2);
    });

    it('should filter by date range when provided', async () => {
      const handler = (contentPieces.listScheduled as unknown as { handler: Function }).handler;
      const startDate = Date.now();
      const endDate = Date.now() + 604800000; // 1 week

      await handler(mockCtx, {
        projectId: mockProjectId,
        startDate,
        endDate,
      });

      expect(mockCtx.db.query).toHaveBeenCalledWith('contentPieces');
    });
  });

  describe('getStats', () => {
    it('should return content statistics for project', async () => {
      const mockPieces = [
        { status: 'draft' },
        { status: 'draft' },
        { status: 'scheduled' },
        { status: 'published' },
      ];

      mockCtx.db.query = vi.fn(() => ({
        withIndex: vi.fn(() => ({
          collect: vi.fn(() => Promise.resolve(mockPieces)),
        })),
      }));

      const handler = (contentPieces.getStats as unknown as { handler: Function }).handler;
      const result = await handler(mockCtx, { projectId: mockProjectId });

      expect(result).toEqual(
        expect.objectContaining({
          total: 4,
          drafts: 2,
          scheduled: 1,
          published: 1,
        })
      );
    });
  });
});
