// @ts-nocheck
// Brief version history
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new version of a brief
export const createBriefVersion = mutation({
  args: {
    briefId: v.id("briefs"),
    title: v.optional(v.string()),
    h2Outline: v.optional(v.array(v.string())),
    faqs: v.optional(v.array(v.object({
      question: v.string(),
      answer: v.string(),
    }))),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    internalLinks: v.optional(v.array(v.string())),
    schema: v.optional(v.any()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { briefId, ...versionData } = args;
    
    // Get current brief
    const brief = await ctx.db.get(briefId);
    if (!brief) {
      throw new Error('Brief not found');
    }

    // Create version snapshot
    return await ctx.db.insert("briefVersions", {
      briefId,
      versionNumber: await getNextVersionNumber(ctx, briefId),
      data: {
        title: versionData.title || brief.title,
        h2Outline: versionData.h2Outline || brief.h2Outline,
        faqs: versionData.faqs || brief.faqs,
        metaTitle: versionData.metaTitle || brief.metaTitle,
        metaDescription: versionData.metaDescription || brief.metaDescription,
        internalLinks: versionData.internalLinks || brief.internalLinks,
        schema: versionData.schema || brief.schema,
      },
      notes: versionData.notes,
      createdAt: Date.now(),
    });
  },
});

// Get version number helper
async function getNextVersionNumber(ctx: any, briefId: any) {
  const versions = await ctx.db
    .query("briefVersions")
    .withIndex("by_brief", (q: any) => q.eq("briefId", briefId))
    .collect();
  
  return versions.length + 1;
}

// Get all versions for a brief
export const getBriefVersions = query({
  args: { briefId: v.id("briefs") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("briefVersions")
      .withIndex("by_brief", (q) => q.eq("briefId", args.briefId))
      .order("desc")
      .collect();
  },
});

// Get specific version
export const getBriefVersion = query({
  args: { versionId: v.id("briefVersions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.versionId);
  },
});

// Restore a version (creates new version with old data)
export const restoreBriefVersion = mutation({
  args: {
    versionId: v.id("briefVersions"),
  },
  handler: async (ctx, args) => {
    const version = await ctx.db.get(args.versionId);
    if (!version) {
      throw new Error('Version not found');
    }

    // Create new version with restored data
    return await createBriefVersion(ctx, {
      briefId: version.briefId,
      ...version.data,
      notes: `Restored from version ${version.versionNumber}`,
    });
  },
});

