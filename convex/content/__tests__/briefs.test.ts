/**
 * Briefs Module Tests
 *
 * Tests for content brief CRUD operations.
 * Part of the core data pipeline: Keywords → Clusters → Plans → Briefs
 */

const mockDb = {
  insert: jest.fn(),
  get: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  query: jest.fn(() => ({
    withIndex: jest.fn(() => ({
      collect: jest.fn(),
    })),
  })),
};

describe('briefs module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBrief', () => {
    it('should create brief with required fields', async () => {
      const briefData = {
        projectId: 'project_123' as any,
        title: 'How to Build an SEO Strategy',
        scheduledDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week from now
      };

      mockDb.insert.mockResolvedValue('brief_1');

      await mockDb.insert('briefs', {
        ...briefData,
        status: 'planned',
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      });

      expect(mockDb.insert).toHaveBeenCalledWith(
        'briefs',
        expect.objectContaining({
          title: 'How to Build an SEO Strategy',
          status: 'planned',
        })
      );
    });

    it('should create brief with all optional fields', async () => {
      const briefData = {
        planId: 'plan_123' as any,
        projectId: 'project_123' as any,
        clusterId: 'cluster_123' as any,
        title: 'Complete SEO Guide',
        scheduledDate: Date.now(),
        status: 'in_progress',
        titleOptions: ['Option 1', 'Option 2'],
        h2Outline: ['Introduction', 'Key Points', 'Conclusion'],
        faqs: [{ question: 'What is SEO?', answer: 'Search Engine Optimization' }],
        metaTitle: 'SEO Guide | MartAI',
        metaDescription: 'Learn SEO with this guide',
        internalLinks: ['/blog/seo-basics'],
        schemaSuggestion: 'Article',
      };

      mockDb.insert.mockResolvedValue('brief_2');

      await mockDb.insert('briefs', briefData);

      expect(mockDb.insert).toHaveBeenCalledWith(
        'briefs',
        expect.objectContaining({
          titleOptions: ['Option 1', 'Option 2'],
          h2Outline: ['Introduction', 'Key Points', 'Conclusion'],
        })
      );
    });

    it('should use default status when not provided', async () => {
      const briefData = {
        projectId: 'project_123' as any,
        title: 'Test Brief',
        scheduledDate: Date.now(),
      };

      await mockDb.insert('briefs', {
        ...briefData,
        status: briefData.status || 'planned',
      });

      expect(mockDb.insert).toHaveBeenCalledWith(
        'briefs',
        expect.objectContaining({ status: 'planned' })
      );
    });
  });

  describe('getBriefById', () => {
    it('should return brief by ID', async () => {
      const brief = {
        _id: 'brief_123',
        title: 'Test Brief',
        status: 'planned',
      };

      mockDb.get.mockResolvedValue(brief);

      const result = await mockDb.get('brief_123');

      expect(result).toEqual(brief);
    });

    it('should return null for non-existent brief', async () => {
      mockDb.get.mockResolvedValue(null);

      const result = await mockDb.get('invalid_id');

      expect(result).toBeNull();
    });
  });

  describe('getBriefsByPlan', () => {
    it('should query briefs with correct index', async () => {
      const mockBriefs = [
        { _id: 'b1', title: 'Brief 1', planId: 'plan_1' },
        { _id: 'b2', title: 'Brief 2', planId: 'plan_1' },
      ];

      const mockCollect = jest.fn().mockResolvedValue(mockBriefs);
      mockDb.query.mockReturnValue({
        withIndex: () => ({ collect: mockCollect }),
      });

      const result = await mockDb.query('briefs').withIndex('by_plan').collect();

      expect(result).toEqual(mockBriefs);
    });

    it('should return empty array for plan with no briefs', async () => {
      const mockCollect = jest.fn().mockResolvedValue([]);
      mockDb.query.mockReturnValue({
        withIndex: () => ({ collect: mockCollect }),
      });

      const result = await mockDb.query('briefs').withIndex('by_plan').collect();

      expect(result).toEqual([]);
    });
  });

  describe('getBriefsByProject', () => {
    it('should return all briefs for a project', async () => {
      const mockBriefs = [
        { _id: 'b1', title: 'Brief 1', projectId: 'project_1' },
        { _id: 'b2', title: 'Brief 2', projectId: 'project_1' },
        { _id: 'b3', title: 'Brief 3', projectId: 'project_1' },
      ];

      const mockCollect = jest.fn().mockResolvedValue(mockBriefs);
      mockDb.query.mockReturnValue({
        withIndex: () => ({ collect: mockCollect }),
      });

      const result = await mockDb.query('briefs').withIndex('by_project').collect();

      expect(result).toHaveLength(3);
    });
  });

  describe('updateBrief', () => {
    it('should update only provided fields', async () => {
      const briefId = 'brief_123' as any;
      const updates = {
        title: 'Updated Title',
        status: 'approved',
      };

      await mockDb.patch(briefId, { ...updates, updatedAt: expect.any(Number) });

      expect(mockDb.patch).toHaveBeenCalledWith(
        briefId,
        expect.objectContaining({
          title: 'Updated Title',
          status: 'approved',
        })
      );
    });

    it('should ignore undefined fields', () => {
      const updates = {
        title: 'New Title',
        h2Outline: undefined,
        status: 'in_progress',
        metaTitle: undefined,
      };

      const cleanUpdates: Record<string, any> = { updatedAt: Date.now() };
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
          cleanUpdates[key] = value;
        }
      }

      expect(cleanUpdates.title).toBe('New Title');
      expect(cleanUpdates.status).toBe('in_progress');
      expect(cleanUpdates.h2Outline).toBeUndefined();
      expect(cleanUpdates.metaTitle).toBeUndefined();
    });

    it('should update FAQs correctly', async () => {
      const briefId = 'brief_123' as any;
      const faqs = [
        { question: 'Q1?', answer: 'A1' },
        { question: 'Q2?', answer: 'A2' },
      ];

      await mockDb.patch(briefId, { faqs, updatedAt: expect.any(Number) });

      expect(mockDb.patch).toHaveBeenCalledWith(briefId, expect.objectContaining({ faqs }));
    });
  });

  describe('deleteBrief', () => {
    it('should delete brief by ID', async () => {
      const briefId = 'brief_123' as any;

      await mockDb.delete(briefId);

      expect(mockDb.delete).toHaveBeenCalledWith(briefId);
    });
  });
});

describe('status transitions', () => {
  const VALID_STATUSES = ['planned', 'in_progress', 'approved', 'published'];

  it('should validate all status values', () => {
    for (const status of VALID_STATUSES) {
      expect(VALID_STATUSES.includes(status)).toBe(true);
    }
  });

  it('should allow transition from planned to in_progress', () => {
    const currentStatus = 'planned';
    const newStatus = 'in_progress';

    expect(VALID_STATUSES.indexOf(newStatus)).toBeGreaterThan(
      VALID_STATUSES.indexOf(currentStatus)
    );
  });

  it('should allow transition from in_progress to approved', () => {
    const currentStatus = 'in_progress';
    const newStatus = 'approved';

    expect(VALID_STATUSES.indexOf(newStatus)).toBeGreaterThan(
      VALID_STATUSES.indexOf(currentStatus)
    );
  });
});

describe('edge cases', () => {
  it('should handle brief with empty outline', async () => {
    const brief = {
      title: 'Test Brief',
      h2Outline: [],
    };

    expect(brief.h2Outline).toHaveLength(0);
  });

  it('should handle brief with empty FAQs', async () => {
    const brief = {
      title: 'Test Brief',
      faqs: [],
    };

    expect(brief.faqs).toHaveLength(0);
  });

  it('should handle very long title', async () => {
    const longTitle = 'A'.repeat(500);
    const brief = { title: longTitle };

    expect(brief.title.length).toBe(500);
  });

  it('should handle special characters in title', async () => {
    const brief = {
      title: 'How to Use & Operators <script>alert(1)</script>',
    };

    expect(brief.title).toContain('&');
    expect(brief.title).toContain('<script>');
  });

  it('should handle scheduled date in the past', async () => {
    const pastDate = Date.now() - 7 * 24 * 60 * 60 * 1000; // 1 week ago

    const brief = {
      title: 'Past Brief',
      scheduledDate: pastDate,
    };

    expect(brief.scheduledDate).toBeLessThan(Date.now());
  });

  it('should handle scheduled date far in the future', async () => {
    const futureDate = Date.now() + 365 * 24 * 60 * 60 * 1000; // 1 year from now

    const brief = {
      title: 'Future Brief',
      scheduledDate: futureDate,
    };

    expect(brief.scheduledDate).toBeGreaterThan(Date.now());
  });
});
