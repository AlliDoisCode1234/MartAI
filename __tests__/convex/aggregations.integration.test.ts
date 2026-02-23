import { describe, it, expect } from 'vitest';
import { createTestContext } from './testHelpers';
import { api } from '../../convex/_generated/api';

describe('Analytics Aggregations', () => {
  it('should fetch dashboard metrics', async () => {
    const t = createTestContext();

    // Currently, aggregations are mocked in the file, so we just verify the route logic
    const metrics = await t.query(api.analytics.aggregations.getDashboardMetrics, {});
    expect(metrics).toBeDefined();
    // In its current mocked state, it returns totalGenerations: 0
    expect(metrics.totalGenerations).toBe(0);
  });
});
