import { describe, it, expect } from 'vitest';
import { createTestContext } from './testHelpers';
import { api, internal } from '../../convex/_generated/api';

describe('Google SEO Feed', () => {
  it('should store, list, and acknowledge SEO updates', async () => {
    const t = createTestContext();

    // 1. Store Update (Internal)
    const updateId = await t.mutation(internal.seo.googleSeoFeed.storeUpdate, {
      title: 'Google Core Update March 2026',
      link: 'https://example.com/core-update',
      publishedAt: Date.now(),
      summary: 'Major core update rolling out.',
      category: 'algorithm',
      severity: 'critical',
    });

    const update2Id = await t.mutation(internal.seo.googleSeoFeed.storeUpdate, {
      title: 'New Search Console Feature',
      link: 'https://example.com/gsc-feature',
      publishedAt: Date.now(),
      summary: 'New charts in GSC.',
      category: 'feature',
      severity: 'informational',
    });

    // It should ignore duplicates (same link)
    const duplicateId = await t.mutation(internal.seo.googleSeoFeed.storeUpdate, {
      title: 'Duplicate Core Update',
      link: 'https://example.com/core-update',
      publishedAt: Date.now(),
      summary: 'Different summary',
      category: 'algorithm',
      severity: 'critical',
    });

    expect(duplicateId).toBe(updateId); // Should return existing ID

    // 2. Get Recent Updates
    const recent = await t.query(api.seo.googleSeoFeed.getRecentUpdates, { limit: 10 });
    expect(recent).toHaveLength(2);

    // 3. Get Critical Updates
    const critical = await t.query(api.seo.googleSeoFeed.getCriticalUpdates, {});
    expect(critical).toHaveLength(1);
    expect(critical[0]._id).toBe(updateId);
    expect(critical[0].acknowledged).toBe(false);

    // 4. Acknowledge Update
    await t.mutation(api.seo.googleSeoFeed.acknowledgeUpdate, { updateId: critical[0]._id });

    // Should no longer be in critical unacknowledged list
    const criticalAfter = await t.query(api.seo.googleSeoFeed.getCriticalUpdates, {});
    expect(criticalAfter).toHaveLength(0);
  });
});
