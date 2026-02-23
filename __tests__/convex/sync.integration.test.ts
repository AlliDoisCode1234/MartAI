import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser, seedProject } from './testHelpers';
import { internal } from '../../convex/_generated/api';

describe('Analytics Sync Action', () => {
  it('should attempt to sync a project (and gracefully handle missing external connections)', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);

    // Run the syncProjectData internal action directly
    // Because the project is freshly seeded, it has no GA4 or GSC connections.
    // The sync logic should check connections, find none, and return safely without crashing.
    const result = await t.action(internal.analytics.sync.syncProjectData, {
      projectId,
    });

    expect(result).toBeDefined();
    expect(result.ga4Data).toBeNull();
    expect(result.gscData).toBeNull();
  });
});
