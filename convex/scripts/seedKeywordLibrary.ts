/**
 * Seed Keyword Library Script
 *
 * Populates the keywordLibrary table with curated keywords for users who don't have GSC.
 *
 * Usage:
 *   npx convex run scripts/seedKeywordLibrary
 *
 * This uses the existing seedKeywords action which generates embeddings for semantic search.
 */

import { action } from '../_generated/server';
import { v } from 'convex/values';
import { api } from '../_generated/api';
import seedData from '../../data/seedKeywords.json';

// Batch size for seeding (to avoid rate limits on embeddings)
const BATCH_SIZE = 20;

/**
 * Seed the keyword library with curated keywords
 */
export const seedKeywordLibrary = action({
  args: {
    dryRun: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const keywords = seedData.keywords;
    const total = keywords.length;

    console.log(`[SeedKeywords] Starting seed of ${total} keywords...`);

    if (args.dryRun) {
      console.log(`[SeedKeywords] DRY RUN - would seed ${total} keywords`);
      return { success: true, count: total, dryRun: true };
    }

    let seeded = 0;
    let errors = 0;

    // Process in batches
    for (let i = 0; i < keywords.length; i += BATCH_SIZE) {
      const batch = keywords.slice(i, i + BATCH_SIZE);

      try {
        await ctx.runAction(api.seo.library.seedKeywords, {
          keywords: batch.map((k) => ({
            keyword: k.keyword,
            searchVolume: k.searchVolume,
            difficulty: k.difficulty,
            intent: k.intent,
          })),
        });

        seeded += batch.length;
        console.log(`[SeedKeywords] Progress: ${seeded}/${total}`);
      } catch (error) {
        console.error(`[SeedKeywords] Batch failed:`, error);
        errors += batch.length;
      }

      // Small delay between batches to avoid rate limits
      if (i + BATCH_SIZE < keywords.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log(`[SeedKeywords] Complete: ${seeded} seeded, ${errors} errors`);

    return {
      success: errors === 0,
      seeded,
      errors,
      total,
    };
  },
});

/**
 * Check current library stats
 */
export const getLibraryStats = action({
  args: {},
  handler: async (ctx) => {
    const count = await ctx.runQuery(api.seo.library.getKeywordCount, {});
    return { keywordCount: count };
  },
});
