import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser, seedProject } from './testHelpers';
import { internal } from '../../convex/_generated/api';

describe('Analytics Internal Queries', () => {
  it('should fetch all projects correctly', async () => {
    const t = createTestContext();

    // Seed a couple of projects
    const userId1 = await seedUser(t, { email: 'user1@test.com' });
    await seedProject(t, userId1);

    const userId2 = await seedUser(t, { email: 'user2@test.com' });
    await seedProject(t, userId2);

    const allProjects = await t.query(internal.analytics.queries.getAllProjectsInternal, {});
    expect(allProjects.length).toBeGreaterThanOrEqual(2);
  });
});
