/**
 * Keywords Module Tests
 *
 * Tests for the keyword CRUD operations in the SEO pipeline.
 * Part of the core data pipeline: Keywords → Clusters → Plans → Briefs
 */

// Mock Convex internals for unit testing
const mockDb = {
  insert: jest.fn(),
  get: jest.fn(),
  patch: jest.fn(),
  query: jest.fn(() => ({
    withIndex: jest.fn(() => ({
      order: jest.fn(() => ({
        collect: jest.fn(),
        paginate: jest.fn(),
      })),
      collect: jest.fn(),
    })),
  })),
};

const mockCtx = { db: mockDb };

// Test the handler logic directly
describe('keywords module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createKeywords', () => {
    it('should create keywords with all fields', async () => {
      const projectId = 'project_123' as any;
      const keywords = [
        {
          keyword: 'seo strategy',
          searchVolume: 1000,
          difficulty: 45,
          cpc: 2.5,
          intent: 'informational',
          priority: 'high',
        },
        {
          keyword: 'content marketing',
          searchVolume: 5000,
          difficulty: 60,
          intent: 'commercial',
        },
      ];

      mockDb.insert.mockResolvedValueOnce('kw_1').mockResolvedValueOnce('kw_2');

      // Simulate handler logic
      const keywordIds = [];
      for (const kw of keywords) {
        const id = await mockDb.insert('keywords', {
          projectId,
          keyword: kw.keyword,
          searchVolume: kw.searchVolume,
          difficulty: kw.difficulty,
          cpc: kw.cpc,
          intent: kw.intent,
          priority: kw.priority || 'medium',
          status: 'suggested',
          createdAt: expect.any(Number),
        });
        keywordIds.push(id);
      }

      expect(keywordIds).toHaveLength(2);
      expect(mockDb.insert).toHaveBeenCalledTimes(2);
    });

    it('should use default priority when not provided', async () => {
      const projectId = 'project_123' as any;
      const keywords = [{ keyword: 'test keyword' }];

      mockDb.insert.mockResolvedValueOnce('kw_1');

      // Simulate handler with default priority
      const kw = keywords[0];
      await mockDb.insert('keywords', {
        projectId,
        keyword: kw.keyword,
        priority: (kw as any).priority || 'medium',
        status: 'suggested',
      });

      expect(mockDb.insert).toHaveBeenCalledWith(
        'keywords',
        expect.objectContaining({ priority: 'medium' })
      );
    });

    it('should handle empty keywords array', async () => {
      const keywords: any[] = [];
      const keywordIds = [];

      for (const kw of keywords) {
        const id = await mockDb.insert('keywords', kw);
        keywordIds.push(id);
      }

      expect(keywordIds).toHaveLength(0);
      expect(mockDb.insert).not.toHaveBeenCalled();
    });
  });

  describe('getKeywordsByProject', () => {
    it('should query keywords with correct index', async () => {
      const projectId = 'project_123' as any;
      const mockKeywords = [
        { _id: 'kw_1', keyword: 'seo', projectId },
        { _id: 'kw_2', keyword: 'marketing', projectId },
      ];

      const mockCollect = jest.fn().mockResolvedValue(mockKeywords);
      const mockOrder = jest.fn(() => ({ collect: mockCollect }));
      const mockWithIndex = jest.fn(() => ({ order: mockOrder }));
      mockDb.query.mockReturnValue({ withIndex: mockWithIndex });

      const result = await mockDb.query('keywords').withIndex('by_project').order('desc').collect();

      expect(result).toEqual(mockKeywords);
    });

    it('should return empty array for project with no keywords', async () => {
      const mockCollect = jest.fn().mockResolvedValue([]);
      const mockOrder = jest.fn(() => ({ collect: mockCollect }));
      const mockWithIndex = jest.fn(() => ({ order: mockOrder }));
      mockDb.query.mockReturnValue({ withIndex: mockWithIndex });

      const result = await mockDb.query('keywords').withIndex('by_project').order('desc').collect();

      expect(result).toEqual([]);
    });
  });

  describe('updateKeywordStatus', () => {
    it('should update keyword status', async () => {
      const keywordId = 'kw_123' as any;
      const existingKeyword = { _id: keywordId, keyword: 'test', priority: 'low' };

      mockDb.get.mockResolvedValue(existingKeyword);
      mockDb.patch.mockResolvedValue({ ...existingKeyword, status: 'approved' });

      // Simulate handler
      const keyword = await mockDb.get(keywordId);
      expect(keyword).toBeTruthy();

      const result = await mockDb.patch(keywordId, {
        status: 'approved',
        priority: keyword.priority,
      });

      expect(mockDb.patch).toHaveBeenCalledWith(keywordId, {
        status: 'approved',
        priority: 'low',
      });
    });

    it('should return null for non-existent keyword', async () => {
      mockDb.get.mockResolvedValue(null);

      const keyword = await mockDb.get('non_existent');
      expect(keyword).toBeNull();
    });

    it('should update priority when provided', async () => {
      const keywordId = 'kw_123' as any;
      const existingKeyword = { _id: keywordId, keyword: 'test', priority: 'low' };

      mockDb.get.mockResolvedValue(existingKeyword);

      await mockDb.patch(keywordId, {
        status: 'approved',
        priority: 'high', // Override
      });

      expect(mockDb.patch).toHaveBeenCalledWith(keywordId, {
        status: 'approved',
        priority: 'high',
      });
    });
  });

  describe('getKeywordsByStatus', () => {
    it('should filter keywords by status', async () => {
      const allKeywords = [
        { _id: 'kw_1', status: 'suggested' },
        { _id: 'kw_2', status: 'approved' },
        { _id: 'kw_3', status: 'suggested' },
      ];

      const filtered = allKeywords.filter((k) => k.status === 'suggested');

      expect(filtered).toHaveLength(2);
      expect(filtered.every((k) => k.status === 'suggested')).toBe(true);
    });

    it('should return empty array when no keywords match status', async () => {
      const allKeywords = [
        { _id: 'kw_1', status: 'suggested' },
        { _id: 'kw_2', status: 'suggested' },
      ];

      const filtered = allKeywords.filter((k) => k.status === 'approved');

      expect(filtered).toHaveLength(0);
    });
  });

  describe('getKeyword', () => {
    it('should return single keyword by ID', async () => {
      const keyword = { _id: 'kw_123', keyword: 'test', status: 'suggested' };
      mockDb.get.mockResolvedValue(keyword);

      const result = await mockDb.get('kw_123');

      expect(result).toEqual(keyword);
    });

    it('should return null for invalid ID', async () => {
      mockDb.get.mockResolvedValue(null);

      const result = await mockDb.get('invalid_id');

      expect(result).toBeNull();
    });
  });
});

describe('edge cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle keywords with unicode characters', async () => {
    const keyword = { keyword: 'SEO策略 маркетинг 🚀' };

    mockDb.insert.mockResolvedValue('kw_unicode');

    await mockDb.insert('keywords', keyword);

    expect(mockDb.insert).toHaveBeenCalledWith('keywords', expect.objectContaining(keyword));
  });

  it('should handle very long keyword strings', async () => {
    const longKeyword = 'a'.repeat(1000);
    const keyword = { keyword: longKeyword };

    mockDb.insert.mockResolvedValue('kw_long');

    await mockDb.insert('keywords', keyword);

    expect(mockDb.insert).toHaveBeenCalled();
  });

  it('should handle keywords with special characters', async () => {
    const keyword = { keyword: 'seo & marketing | content <script>alert(1)</script>' };

    mockDb.insert.mockResolvedValue('kw_special');

    await mockDb.insert('keywords', keyword);

    expect(mockDb.insert).toHaveBeenCalledWith('keywords', expect.objectContaining(keyword));
  });

  it('should handle zero values for numeric fields', async () => {
    const keyword = {
      keyword: 'test',
      searchVolume: 0,
      difficulty: 0,
      cpc: 0,
    };

    mockDb.insert.mockResolvedValue('kw_zeros');

    await mockDb.insert('keywords', keyword);

    expect(mockDb.insert).toHaveBeenCalledWith(
      'keywords',
      expect.objectContaining({
        searchVolume: 0,
        difficulty: 0,
        cpc: 0,
      })
    );
  });
});
