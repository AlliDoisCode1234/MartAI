import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTestContext, seedUser, seedProject, asUser } from './testHelpers';
import { api, internal } from '../../convex/_generated/api';

describe('Generate Calendar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should generate a calendar using industry templates', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const projectId = await seedProject(t, userId);
    const authed = asUser(t, userId);

    const result = await authed.action(api.contentCalendar.generateCalendar.generateFullCalendar, {
      projectId,
      useGa4Gsc: false, // Force template fallback to avoid real API calls
    });

    expect(result.success).toBe(true);
    expect(result.itemsGenerated).toBeGreaterThan(0);
    expect(result.contentPieceIds.length).toBeGreaterThan(0);

    await t.finishAllScheduledFunctions(() => vi.runAllTimers());
  });
});
