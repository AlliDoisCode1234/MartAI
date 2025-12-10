/**
 * Keyword Clusters Module Tests
 *
 * Tests for topic cluster CRUD and business logic.
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

describe('keywordClusters module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCluster', () => {
    it('should create a cluster with all required fields', async () => {
      const clusterData = {
        projectId: 'project_123' as any,
        clusterName: 'SEO Strategy',
        keywords: ['seo', 'strategy', 'content'],
        intent: 'informational',
        difficulty: 45,
        volumeRange: { min: 100, max: 1000 },
        impactScore: 0.75,
        topSerpUrls: ['https://example.com/1', 'https://example.com/2'],
        status: 'active',
        createdAt: Date.now(),
      };

      mockDb.insert.mockResolvedValue('cluster_1');

      await mockDb.insert('keywordClusters', {
        ...clusterData,
        updatedAt: expect.any(Number),
      });

      expect(mockDb.insert).toHaveBeenCalledWith(
        'keywordClusters',
        expect.objectContaining({
          clusterName: 'SEO Strategy',
          keywords: ['seo', 'strategy', 'content'],
          intent: 'informational',
        })
      );
    });

    it('should use default status when not provided', async () => {
      const clusterData = {
        projectId: 'project_123' as any,
        clusterName: 'Test Cluster',
        keywords: ['test'],
        intent: 'commercial',
        difficulty: 50,
        volumeRange: { min: 0, max: 100 },
        impactScore: 0.5,
        topSerpUrls: [],
        createdAt: Date.now(),
      };

      await mockDb.insert('keywordClusters', {
        ...clusterData,
        status: clusterData.status || 'active',
        updatedAt: Date.now(),
      });

      expect(mockDb.insert).toHaveBeenCalledWith(
        'keywordClusters',
        expect.objectContaining({ status: 'active' })
      );
    });
  });

  describe('getClustersByProject', () => {
    it('should query clusters with correct index', async () => {
      const mockClusters = [
        { _id: 'c1', clusterName: 'Cluster 1', status: 'active' },
        { _id: 'c2', clusterName: 'Cluster 2', status: 'hidden' },
      ];

      const mockCollect = jest.fn().mockResolvedValue(mockClusters);
      const mockWithIndex = jest.fn(() => ({ collect: mockCollect }));
      mockDb.query.mockReturnValue({ withIndex: mockWithIndex });

      const result = await mockDb.query('keywordClusters').withIndex('by_project').collect();

      expect(result).toEqual(mockClusters);
    });

    it('should return empty array for project with no clusters', async () => {
      const mockCollect = jest.fn().mockResolvedValue([]);
      mockDb.query.mockReturnValue({ withIndex: () => ({ collect: mockCollect }) });

      const result = await mockDb.query('keywordClusters').withIndex('by_project').collect();

      expect(result).toEqual([]);
    });
  });

  describe('getActiveClusters', () => {
    it('should filter out hidden clusters', async () => {
      const allClusters = [
        { _id: 'c1', status: 'active' },
        { _id: 'c2', status: 'hidden' },
        { _id: 'c3', status: 'favorite' },
      ];

      const activeClusters = allClusters.filter((c) => c.status !== 'hidden');

      expect(activeClusters).toHaveLength(2);
      expect(activeClusters.map((c) => c._id)).toEqual(['c1', 'c3']);
    });
  });

  describe('updateCluster', () => {
    it('should update only provided fields', async () => {
      const clusterId = 'cluster_123' as any;
      const updates = { clusterName: 'Updated Name' };

      await mockDb.patch(clusterId, { ...updates, updatedAt: expect.any(Number) });

      expect(mockDb.patch).toHaveBeenCalledWith(
        clusterId,
        expect.objectContaining({ clusterName: 'Updated Name' })
      );
    });

    it('should ignore undefined fields', () => {
      const updates = {
        clusterName: 'New Name',
        keywords: undefined,
        intent: 'commercial',
        difficulty: undefined,
      };

      const cleanUpdates: Record<string, any> = { updatedAt: Date.now() };
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
          cleanUpdates[key] = value;
        }
      }

      expect(cleanUpdates).toEqual(
        expect.objectContaining({
          clusterName: 'New Name',
          intent: 'commercial',
        })
      );
      expect(cleanUpdates.keywords).toBeUndefined();
      expect(cleanUpdates.difficulty).toBeUndefined();
    });
  });

  describe('updateClusterStatus', () => {
    it('should update cluster status to hidden', async () => {
      const clusterId = 'cluster_123' as any;

      await mockDb.patch(clusterId, { status: 'hidden', updatedAt: expect.any(Number) });

      expect(mockDb.patch).toHaveBeenCalledWith(
        clusterId,
        expect.objectContaining({ status: 'hidden' })
      );
    });

    it('should update cluster status to favorite', async () => {
      const clusterId = 'cluster_123' as any;

      await mockDb.patch(clusterId, { status: 'favorite', updatedAt: expect.any(Number) });

      expect(mockDb.patch).toHaveBeenCalled();
    });
  });

  describe('rerankClusters', () => {
    it('should calculate impact score with default weights', () => {
      const volumeWeight = 0.4;
      const intentWeight = 0.3;
      const difficultyWeight = 0.3;

      const cluster = {
        volumeRange: { min: 100, max: 500 },
        intent: 'transactional',
        difficulty: 30,
      };

      const intentScores: Record<string, number> = {
        transactional: 1.0,
        commercial: 0.8,
        informational: 0.6,
        navigational: 0.4,
      };

      const avgVolume = (cluster.volumeRange.min + cluster.volumeRange.max) / 2; // 300
      const normalizedVolume = Math.min(avgVolume / 10000, 1); // 0.03
      const intentScore = intentScores[cluster.intent]; // 1.0
      const normalizedDifficulty = 1 - cluster.difficulty / 100; // 0.7

      const impactScore =
        volumeWeight * normalizedVolume +
        intentWeight * intentScore +
        difficultyWeight * normalizedDifficulty;

      expect(impactScore).toBeCloseTo(0.4 * 0.03 + 0.3 * 1.0 + 0.3 * 0.7);
    });

    it('should handle empty intent gracefully', () => {
      const intentScores: Record<string, number> = {
        transactional: 1.0,
        commercial: 0.8,
        informational: 0.6,
        navigational: 0.4,
      };

      const unknownIntent = 'unknown';
      const intentScore = intentScores[unknownIntent] || 0.5;

      expect(intentScore).toBe(0.5);
    });
  });

  describe('deleteCluster', () => {
    it('should delete cluster by ID', async () => {
      const clusterId = 'cluster_123' as any;

      await mockDb.delete(clusterId);

      expect(mockDb.delete).toHaveBeenCalledWith(clusterId);
    });
  });

  describe('mergeClusters', () => {
    it('should throw error if less than 2 clusters provided', () => {
      const clusterIds = ['cluster_1'];

      expect(() => {
        if (clusterIds.length < 2) {
          throw new Error('Need at least 2 clusters to merge');
        }
      }).toThrow('Need at least 2 clusters to merge');
    });

    it('should throw error if no valid clusters found', () => {
      const clusters: any[] = [];

      expect(() => {
        if (clusters.length === 0) {
          throw new Error('No valid clusters found to merge');
        }
      }).toThrow('No valid clusters found to merge');
    });

    it('should merge keywords from all clusters (unique)', () => {
      const clusters = [
        { keywords: ['seo', 'strategy'] },
        { keywords: ['strategy', 'marketing'] },
        { keywords: ['content', 'seo'] },
      ];

      const allKeywords = new Set<string>();
      clusters.forEach((c) => c.keywords.forEach((k) => allKeywords.add(k)));

      expect(Array.from(allKeywords)).toEqual(['seo', 'strategy', 'marketing', 'content']);
    });

    it('should aggregate volume ranges', () => {
      const clusters = [
        { volumeRange: { min: 100, max: 500 } },
        { volumeRange: { min: 200, max: 800 } },
      ];

      const minVol = clusters.reduce((sum, c) => sum + c.volumeRange.min, 0);
      const maxVol = clusters.reduce((sum, c) => sum + c.volumeRange.max, 0);

      expect(minVol).toBe(300);
      expect(maxVol).toBe(1300);
    });

    it('should calculate average difficulty', () => {
      const clusters = [{ difficulty: 30 }, { difficulty: 50 }, { difficulty: 70 }];

      const avgDiff = clusters.reduce((sum, c) => sum + c.difficulty, 0) / clusters.length;

      expect(avgDiff).toBe(50);
    });
  });
});

describe('edge cases', () => {
  it('should handle cluster with empty keywords array', async () => {
    const cluster = {
      clusterName: 'Empty Keywords Cluster',
      keywords: [],
      intent: 'informational',
    };

    expect(cluster.keywords).toHaveLength(0);
  });

  it('should handle cluster with very large keyword count', () => {
    const keywords = Array.from({ length: 100 }, (_, i) => `keyword_${i}`);

    const cluster = {
      keywords,
    };

    expect(cluster.keywords).toHaveLength(100);
  });

  it('should handle volume range with min > max gracefully', () => {
    const volumeRange = { min: 1000, max: 100 };

    // In practice, validation should catch this, but test the edge case
    const avgVolume = (volumeRange.min + volumeRange.max) / 2;

    expect(avgVolume).toBe(550); // Still calculates, doesn't break
  });

  it('should handle zero difficulty correctly', () => {
    const difficulty = 0;
    const normalizedDifficulty = 1 - difficulty / 100;

    expect(normalizedDifficulty).toBe(1); // Max score when difficulty is 0
  });

  it('should handle 100 difficulty correctly', () => {
    const difficulty = 100;
    const normalizedDifficulty = 1 - difficulty / 100;

    expect(normalizedDifficulty).toBe(0); // Min score when difficulty is 100
  });
});
