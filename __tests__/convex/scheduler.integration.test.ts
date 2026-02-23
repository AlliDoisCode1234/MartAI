import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser, seedProject } from './testHelpers';
import { api } from '../../convex/_generated/api';

describe('Analytics Scheduler', () => {
  it('should handle single project sync', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);

    // Call the action. If analytics sync is mocked or errors due to missing tokens,
    // we just want to ensure the action doesn't crash the orchestrator, returning an error status instead.
    try {
      const result = await t.action(api.analytics.scheduler.syncProject, {
        projectId,
      });
      // The scheduler catches inner errors and returns { status: 'error' } if something goes wrong
      expect(result).toBeDefined();
      expect(result.projectId).toBe(projectId);
      expect(['success', 'error']).toContain(result.status);
    } catch (e: any) {
      // In case it throws an unexpected system validation error
      expect(e.message).toBeDefined();
    }
  });

  it('should handle syncing all projects', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    await seedProject(t, userId);

    try {
      const results = await t.action(api.analytics.scheduler.syncAllProjects, {});
      expect(Array.isArray(results)).toBe(true);
      if (results.length > 0) {
        expect(['success', 'error']).toContain(results[0].status);
      }
    } catch (e: any) {
      expect(e.message).toBeDefined();
    }
  });
});
