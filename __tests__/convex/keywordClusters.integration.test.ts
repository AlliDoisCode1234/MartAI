import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser, seedProject } from './testHelpers';
import { api } from '../../convex/_generated/api';

describe('Keyword Clusters', () => {
  it('should create, read, update, and merge keyword clusters', async () => {
    const t = createTestContext();
    const userId = await seedUser(t, { role: 'admin' });
    const projectId = await seedProject(t, userId);
    const authT = t.withIdentity({ subject: userId });

    // 1. Create a manual cluster
    const manualClusterId = await authT.mutation(api.seo.keywordClusters.createManualCluster, {
      projectId,
      clusterName: 'Manual SEO',
      keywords: ['seo tool', 'best seo tool', 'seo tool online'],
      intent: 'commercial',
    });

    expect(manualClusterId).toBeDefined();

    // 2. Create standard cluster
    await authT.mutation(api.seo.keywordClusters.createCluster, {
      projectId,
      clusterName: 'Automated SEO',
      keywords: ['automated seo'],
      intent: 'informational',
      difficulty: 30,
      volumeRange: { min: 100, max: 1000 },
      impactScore: 0.5,
      topSerpUrls: [],
      status: 'active',
      createdAt: Date.now(),
    });

    // 3. Upsert existing cluster by name
    await authT.mutation(api.seo.keywordClusters.createCluster, {
      projectId,
      clusterName: 'Automated SEO',
      keywords: ['ai seo automation'], // Should merge
      intent: 'informational',
      difficulty: 30,
      volumeRange: { min: 200, max: 2000 },
      impactScore: 0.6,
      topSerpUrls: [],
      status: 'active',
      createdAt: Date.now(),
    });

    // 4. Get clusters
    const clusters = await authT.query(api.seo.keywordClusters.getClustersByProject, { projectId });
    expect(clusters).toHaveLength(2);

    const autoCluster = clusters.find((c) => c.clusterName === 'Automated SEO');
    expect(autoCluster?.keywords).toContain('automated seo');
    expect(autoCluster?.keywords).toContain('ai seo automation');
    expect(autoCluster?.impactScore).toBe(0.6);

    // 5. Update status
    await authT.mutation(api.seo.keywordClusters.updateClusterStatus, {
      clusterId: autoCluster!._id,
      status: 'hidden',
    });

    const activeClusters = await authT.query(api.seo.keywordClusters.getActiveClusters, {
      projectId,
    });
    expect(activeClusters).toHaveLength(1); // Only Manual SEO is active

    // 6. Merge clusters
    const mergedId = await authT.mutation(api.seo.keywordClusters.mergeClusters, {
      clusterIds: [manualClusterId, autoCluster!._id],
    });

    const finalClusters = await authT.query(api.seo.keywordClusters.getClustersByProject, {
      projectId,
    });
    expect(finalClusters).toHaveLength(1);
    expect(finalClusters[0].clusterName).toBe('Manual SEO (Merged)');
    expect(finalClusters[0].keywords).toHaveLength(5); // 3 from manual + 2 from auto
  });

  it('should rerank clusters based on impact weights', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);
    const authT = t.withIdentity({ subject: userId });

    await authT.mutation(api.seo.keywordClusters.createManualCluster, {
      projectId,
      clusterName: 'Test 1',
      keywords: ['k1', 'k2', 'k3'],
      intent: 'informational',
    });

    await authT.mutation(api.seo.keywordClusters.rerankClusters, {
      projectId,
      volumeWeight: 0.5,
      intentWeight: 0.3,
      difficultyWeight: 0.2,
    });

    const clusters = await authT.query(api.seo.keywordClusters.getClustersByProject, { projectId });
    expect(clusters[0].impactScore).toBeGreaterThan(0);
  });
});
