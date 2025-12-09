import {
  ActionCtx,
  internalMutation,
  internalQuery,
  mutation,
  query,
  action,
} from '../_generated/server';
import { v } from 'convex/values';
import { api, internal } from '../_generated/api';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';
import { Doc, Id } from '../_generated/dataModel';

// --- Internal Database Mutations/Queries ---

export const upsertKeyword = internalMutation({
  args: {
    keyword: v.string(),
    embedding: v.array(v.float64()),
    searchVolume: v.number(),
    difficulty: v.number(),
    intent: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('keywordLibrary')
      .withIndex('by_keyword', (q) => q.eq('keyword', args.keyword))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        embedding: args.embedding, // Update embedding if needed
        searchVolume: args.searchVolume,
        difficulty: args.difficulty,
        intent: args.intent,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert('keywordLibrary', {
        keyword: args.keyword,
        embedding: args.embedding,
        searchVolume: args.searchVolume,
        difficulty: args.difficulty,
        intent: args.intent,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

export const getKeywordsByIds = internalQuery({
  args: {
    ids: v.array(v.id('keywordLibrary')),
  },
  handler: async (ctx, args) => {
    const docs = [];
    for (const id of args.ids) {
      const doc = await ctx.db.get(id);
      if (doc) docs.push(doc);
    }
    return docs;
  },
});

export const getKeyword = query({
  args: {
    id: v.id('keywordLibrary'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listKeywords = query({
  args: {
    paginationOpts: v.any(),
    minVolume: v.optional(v.number()),
    maxDifficulty: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Current simple implementation: Filtering in memory for now implicitly via pagination?
    // Convex paginatedQuery doesn't support complex filters efficiently without specific indexes.
    // For the Admin Library, we'll start with basic listing.

    // Note: Applying filters here without an index is inefficient for large datasets.
    // We will iterate and add indexes if needed. For now, fetch all.
    let q = ctx.db.query('keywordLibrary').order('desc');
    // If we had an index by_volume, we would use it.

    return await q.paginate(args.paginationOpts);
  },
});

// --- Public Actions (AI/External) ---

export const seedKeywords = action({
  args: {
    keywords: v.array(
      v.object({
        keyword: v.string(),
        searchVolume: v.number(),
        difficulty: v.number(),
        intent: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const k of args.keywords) {
      try {
        const { embedding } = await embed({
          model: openai.embedding('text-embedding-3-small'),
          value: k.keyword,
        });

        await ctx.runMutation(internal.seo.library.upsertKeyword, {
          keyword: k.keyword,
          embedding: embedding,
          searchVolume: k.searchVolume,
          difficulty: k.difficulty,
          intent: k.intent,
        });
      } catch (e) {
        console.error(`Failed to seed keyword ${k.keyword}:`, e);
      }
    }
  },
});

export const searchLibrary = action({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<Array<Doc<'keywordLibrary'> & { _score: number }>> => {
    const { embedding } = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: args.query,
    });

    // Valid Vector Search implementation for Convex Actions
    const results = await ctx.vectorSearch('keywordLibrary', 'by_embedding', {
      vector: embedding,
      limit: args.limit || 20,
    });

    const ids = results.map((r) => r._id);

    // Fetch the actual documents
    // Note: This does not preserve the order or scores automatically attached to the document object
    // We need to merge them.
    const docs = await ctx.runQuery(internal.seo.library.getKeywordsByIds, { ids });

    // Re-attach scores and sort by score (which vectorSearch already did, but map lookup might scramble)
    const docsMap = new Map(docs.map((d: Doc<'keywordLibrary'>) => [d._id, d]));

    return results
      .map((r) => {
        const doc = docsMap.get(r._id);
        return doc ? { ...doc, _score: r._score } : null;
      })
      .filter((d): d is Doc<'keywordLibrary'> & { _score: number } => d !== null);
  },
});
