import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser, seedProject } from './testHelpers';
import { internal } from '../../convex/_generated/api';

describe('MartAI Rating (MR)', () => {
  it('should calculate the rating successfully (even with empty data)', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);

    // Call the MR calculator action
    // In a fresh test project, GA4/GSC stats are missing, so it should default to the lowest tier safely.
    const result = await t.action(internal.analytics.martaiRating.calculatePhooRating, {
      projectId,
    });

    expect(result).toBeDefined();
    expect(result.overall).toBeTypeOf('number');
    expect(result.tier).toBeDefined();
    expect(result.components).toBeDefined();

    // Without data, it should be in the 'needs_work' tier based on strict scoring rules
    expect(result.tier).toBe('needs_work');
  });
});
