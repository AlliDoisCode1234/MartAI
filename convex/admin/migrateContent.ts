/**
 * Content Migration Script
 *
 * Migrates data from legacy briefs + drafts tables into unified contentPieces.
 * Run via Convex dashboard.
 */

import { internalMutation } from '../_generated/server';
import { v } from 'convex/values';

// ============================================================================
// Preview Migration - Dry run to see what would be migrated
// ============================================================================

export const previewMigration = internalMutation({
  args: {},
  handler: async (ctx) => {
    const briefs = await ctx.db.query('briefs').collect();
    const drafts = await ctx.db.query('drafts').collect();
    const existingContentPieces = await ctx.db.query('contentPieces').collect();

    // Group drafts by briefId for easy lookup
    const draftsByBriefId = new Map<string, (typeof drafts)[0]>();
    for (const draft of drafts) {
      draftsByBriefId.set(draft.briefId, draft);
    }

    // Count briefs with and without drafts
    const briefsWithDrafts = briefs.filter((b) => draftsByBriefId.has(b._id));
    const briefsWithoutDrafts = briefs.filter((b) => !draftsByBriefId.has(b._id));
    const orphanDrafts = drafts.filter((d) => !briefs.some((b) => b._id === d.briefId));

    return {
      dryRun: true,
      counts: {
        totalBriefs: briefs.length,
        totalDrafts: drafts.length,
        existingContentPieces: existingContentPieces.length,
        briefsWithDrafts: briefsWithDrafts.length,
        briefsWithoutDrafts: briefsWithoutDrafts.length,
        orphanDrafts: orphanDrafts.length,
      },
      willCreate: briefsWithDrafts.length + briefsWithoutDrafts.length,
      sampleBrief: briefs[0]
        ? {
            id: briefs[0]._id,
            title: briefs[0].title,
            status: briefs[0].status,
          }
        : null,
    };
  },
});

// ============================================================================
// Migrate Briefs + Drafts → ContentPieces
// ============================================================================

export const migrateToContentPieces = internalMutation({
  args: {
    batchSize: v.optional(v.number()),
    dryRun: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const batchSize = args.batchSize ?? 50;
    const dryRun = args.dryRun ?? false;

    const briefs = await ctx.db.query('briefs').take(batchSize);

    const drafts = await ctx.db.query('drafts').collect();

    // Group drafts by briefId
    const draftsByBriefId = new Map<string, (typeof drafts)[0]>();
    for (const draft of drafts) {
      draftsByBriefId.set(draft.briefId, draft);
    }

    const results = {
      migrated: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const brief of briefs) {
      try {
        // Check if already migrated
        const existing = await ctx.db
          .query('contentPieces')
          .filter((q) => q.eq(q.field('_legacyBriefId'), brief._id))
          .first();

        if (existing) {
          results.skipped++;
          continue;
        }

        // Find matching draft
        const draft = draftsByBriefId.get(brief._id);

        // Map brief status to contentPiece status
        const statusMap: Record<
          string,
          'generating' | 'draft' | 'approved' | 'published' | 'scheduled'
        > = {
          planned: 'draft',
          in_progress: 'generating',
          approved: 'approved',
          published: 'published',
        };

        // Determine content type from context (default to blog)
        const contentType = 'blog' as const;

        if (!dryRun) {
          await ctx.db.insert('contentPieces', {
            projectId: brief.projectId,
            clusterId: brief.clusterId,
            contentType,
            title: brief.title,
            h2Outline: brief.h2Outline ?? [],
            keywords: [], // Not stored in briefs, will be empty
            metaTitle: brief.metaTitle,
            metaDescription: brief.metaDescription,
            internalLinks: brief.internalLinks,
            content: draft?.content,
            wordCount: draft?.wordCount,
            seoScore: draft?.qualityScore,
            status: statusMap[brief.status] ?? 'draft',
            publishDate: brief.scheduledDate,
            publishedUrl: draft?.publishedUrl,
            _legacyBriefId: brief._id,
            _legacyDraftId: draft?._id,
            createdAt: brief.createdAt,
            updatedAt: Date.now(),
          });
        }

        results.migrated++;
      } catch (e) {
        results.errors.push(`Brief ${brief._id}: ${e}`);
      }
    }

    return {
      dryRun,
      ...results,
      hasMore: briefs.length === batchSize,
    };
  },
});

// ============================================================================
// Verify Migration
// ============================================================================

export const verifyMigration = internalMutation({
  args: {},
  handler: async (ctx) => {
    const briefs = await ctx.db.query('briefs').collect();
    const contentPieces = await ctx.db.query('contentPieces').collect();

    // Check how many briefs have been migrated
    const migratedBriefIds = new Set(
      contentPieces.filter((cp) => cp._legacyBriefId).map((cp) => cp._legacyBriefId)
    );

    const unmigrated = briefs.filter((b) => !migratedBriefIds.has(b._id));

    return {
      totalBriefs: briefs.length,
      totalContentPieces: contentPieces.length,
      migratedFromBriefs: migratedBriefIds.size,
      unmigratedBriefs: unmigrated.length,
      migrationComplete: unmigrated.length === 0,
      sample: unmigrated.slice(0, 5).map((b) => ({
        id: b._id,
        title: b.title,
      })),
    };
  },
});

// ============================================================================
// Cleanup Old Tables (after migration verified)
// ============================================================================

export const cleanupMigratedData = internalMutation({
  args: {
    confirmDelete: v.boolean(),
    batchSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (!args.confirmDelete) {
      return {
        error: 'Must set confirmDelete: true to delete data',
        deleted: 0,
      };
    }

    const batchSize = args.batchSize ?? 100;
    const results = { briefs: 0, drafts: 0 };

    // Only delete briefs that have been migrated
    const contentPieces = await ctx.db.query('contentPieces').collect();
    const migratedBriefIds = new Set(
      contentPieces.filter((cp) => cp._legacyBriefId).map((cp) => cp._legacyBriefId)
    );

    // Delete migrated briefs
    const briefsToDelete = await ctx.db.query('briefs').take(batchSize);

    for (const brief of briefsToDelete) {
      if (migratedBriefIds.has(brief._id)) {
        // Delete associated drafts first
        const drafts = await ctx.db
          .query('drafts')
          .withIndex('by_brief', (q) => q.eq('briefId', brief._id))
          .collect();

        for (const draft of drafts) {
          await ctx.db.delete(draft._id);
          results.drafts++;
        }

        await ctx.db.delete(brief._id);
        results.briefs++;
      }
    }

    return {
      deleted: results,
      hasMore: briefsToDelete.length === batchSize,
    };
  },
});
