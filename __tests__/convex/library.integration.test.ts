import { describe, it, expect } from 'vitest';
import { createTestContext } from './testHelpers';
import { api, internal } from '../../convex/_generated/api';

describe('Keyword Library', () => {
  it('should upsert, get, list, and count keywords in the global library', async () => {
    const t = createTestContext();

    // 1. Upsert keywords
    await t.mutation(internal.seo.library.upsertKeyword, {
      keyword: 'seo tools',
      embedding: Array(1536).fill(0.1), // Mock 1536-dim embedding
      searchVolume: 1000,
      difficulty: 40,
      intent: 'informational',
    });

    await t.mutation(internal.seo.library.upsertKeyword, {
      keyword: 'marketing software',
      embedding: Array(1536).fill(0.2),
      searchVolume: 500,
      difficulty: 60,
      intent: 'commercial',
    });

    // 2. Upsert same keyword should update
    await t.mutation(internal.seo.library.upsertKeyword, {
      keyword: 'seo tools',
      embedding: Array(1536).fill(0.1),
      searchVolume: 1500, // Changed
      difficulty: 40,
      intent: 'informational',
    });

    // 3. Count
    const count = await t.query(api.seo.library.getKeywordCount, {});
    expect(count).toBe(2); // Should be 2, not 3, because 'seo tools' updated

    // 4. List Pagination
    const page = await t.query(api.seo.library.listKeywords, {
      paginationOpts: { numItems: 10, cursor: null },
    });
    expect(page.page).toHaveLength(2);

    const updatedSeoTools = page.page.find((k) => k.keyword === 'seo tools');
    expect(updatedSeoTools?.searchVolume).toBe(1500);

    // 5. Get by ID
    const fetchedId = await t.query(api.seo.library.getKeyword, {
      id: updatedSeoTools!._id,
    });
    expect(fetchedId?.keyword).toBe('seo tools');

    // 6. Internal get by IDs
    const multiple = await t.query(internal.seo.library.getKeywordsByIds, {
      ids: [updatedSeoTools!._id],
    });
    expect(multiple).toHaveLength(1);
    expect(multiple[0].keyword).toBe('seo tools');
  });
});
