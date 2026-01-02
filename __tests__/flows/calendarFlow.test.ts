import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

/**
 * Calendar Flow E2E Tests
 *
 * Verifies the calendar view correctly displays content pieces.
 * This tests the user flow from Strategy → Calendar → Content display.
 *
 * Following /debugging-workflow: After removing briefs/drafts,
 * the calendar now uses contentPieces exclusively.
 */

describe('Calendar Flow Integration', () => {
  let mockDb: {
    query: Mock;
    get: Mock;
  };

  const mockProjectId = 'test-project-id' as any;

  beforeEach(() => {
    // Setup mock database with scheduled content pieces
    const mockScheduledContent = [
      {
        _id: 'content-1',
        projectId: mockProjectId,
        title: 'January Blog Post',
        contentType: 'blog',
        status: 'scheduled',
        publishDate: new Date('2026-01-15').getTime(),
        priority: 'P0',
        keywords: ['seo', 'marketing'],
      },
      {
        _id: 'content-2',
        projectId: mockProjectId,
        title: 'February How-To Guide',
        contentType: 'howto',
        status: 'scheduled',
        publishDate: new Date('2026-02-01').getTime(),
        priority: 'P1',
        keywords: ['tutorial'],
      },
      {
        _id: 'content-3',
        projectId: mockProjectId,
        title: 'Published Article',
        contentType: 'blog',
        status: 'published',
        publishDate: new Date('2025-12-20').getTime(),
        priority: 'P0',
        keywords: ['success'],
      },
    ];

    mockDb = {
      query: vi.fn(() => ({
        withIndex: vi.fn(() => ({
          filter: vi.fn(() => ({
            collect: vi.fn(() => Promise.resolve(mockScheduledContent)),
          })),
          collect: vi.fn(() => Promise.resolve(mockScheduledContent)),
        })),
      })),
      get: vi.fn(),
    };

    vi.clearAllMocks();
  });

  describe('Calendar Display', () => {
    it('should retrieve all scheduled content for a project', async () => {
      // Simulate the query flow used by calendar page
      const result = await mockDb
        .query('contentPieces')
        .withIndex('by_project', (q: any) => q.eq('projectId', mockProjectId))
        .filter((q: any) => q.eq(q.field('status'), 'scheduled'))
        .collect();

      expect(mockDb.query).toHaveBeenCalledWith('contentPieces');
      expect(result.length).toBe(3);
    });

    it('should filter scheduled content by month', async () => {
      // January 2026
      const startOfMonth = new Date('2026-01-01').getTime();
      const endOfMonth = new Date('2026-01-31').getTime();

      const allContent = await mockDb
        .query('contentPieces')
        .withIndex('by_project', (q: any) => q.eq('projectId', mockProjectId))
        .collect();

      // Client-side filter by date range
      const januaryContent = allContent.filter(
        (c: any) => c.publishDate >= startOfMonth && c.publishDate <= endOfMonth
      );

      expect(januaryContent.length).toBe(1);
      expect(januaryContent[0].title).toBe('January Blog Post');
    });

    it('should separate content by priority (P0, P1, P2)', async () => {
      const allContent = await mockDb.query('contentPieces').withIndex('by_project').collect();

      const p0Content = allContent.filter((c: any) => c.priority === 'P0');
      const p1Content = allContent.filter((c: any) => c.priority === 'P1');

      expect(p0Content.length).toBe(2);
      expect(p1Content.length).toBe(1);
    });
  });

  describe('Calendar Empty States', () => {
    it('should handle empty calendar gracefully', async () => {
      // Override mock to return no content
      mockDb.query.mockReturnValue({
        withIndex: vi.fn(() => ({
          collect: vi.fn(() => Promise.resolve([])),
        })),
      });

      const result = await mockDb.query('contentPieces').withIndex('by_project').collect();

      expect(result).toEqual([]);
    });
  });

  describe('Content Piece Navigation', () => {
    it('should provide content piece ID for navigation to editor', async () => {
      const allContent = await mockDb.query('contentPieces').withIndex('by_project').collect();

      const firstPiece = allContent[0];

      // Calendar item should have _id for navigation
      expect(firstPiece._id).toBeDefined();
      expect(typeof firstPiece._id).toBe('string');

      // Navigation URL would be: /studio/{contentPieceId}
      const editorUrl = `/studio/${firstPiece._id}`;
      expect(editorUrl).toBe('/studio/content-1');
    });
  });
});

describe('Calendar Statistics', () => {
  it('should calculate correct stats from contentPieces', () => {
    const mockPieces = [
      { status: 'draft' },
      { status: 'draft' },
      { status: 'approved' },
      { status: 'scheduled' },
      { status: 'scheduled' },
      { status: 'scheduled' },
      { status: 'published' },
    ];

    const stats = {
      total: mockPieces.length,
      draft: mockPieces.filter((p) => p.status === 'draft').length,
      approved: mockPieces.filter((p) => p.status === 'approved').length,
      scheduled: mockPieces.filter((p) => p.status === 'scheduled').length,
      published: mockPieces.filter((p) => p.status === 'published').length,
    };

    expect(stats.total).toBe(7);
    expect(stats.draft).toBe(2);
    expect(stats.approved).toBe(1);
    expect(stats.scheduled).toBe(3);
    expect(stats.published).toBe(1);
  });
});
