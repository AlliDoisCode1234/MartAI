// @ts-nocheck
// Note: Run `npx convex dev` to generate proper types
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create draft
export const createDraft = mutation({
  args: {
    briefId: v.id("briefs"),
    projectId: v.id("projects"),
    content: v.string(), // Markdown content
    qualityScore: v.optional(v.number()), // 0-100
    toneScore: v.optional(v.number()), // 0-100
    wordCount: v.optional(v.number()),
    status: v.string(), // draft, approved, published
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("drafts", {
      briefId: args.briefId,
      projectId: args.projectId,
      content: args.content,
      qualityScore: args.qualityScore,
      toneScore: args.toneScore,
      wordCount: args.wordCount,
      status: args.status || "draft",
      notes: args.notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Get draft by ID
export const getDraftById = query({
  args: { draftId: v.id("drafts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.draftId);
  },
});

// Get draft by brief
export const getDraftByBrief = query({
  args: { briefId: v.id("briefs") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("drafts")
      .withIndex("by_brief", (q) => q.eq("briefId", args.briefId))
      .first();
  },
});

// Get all drafts for a project
export const getDraftsByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("drafts")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});

// Update draft
export const updateDraft = mutation({
  args: {
    draftId: v.id("drafts"),
    content: v.optional(v.string()),
    qualityScore: v.optional(v.number()),
    toneScore: v.optional(v.number()),
    wordCount: v.optional(v.number()),
    status: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { draftId, ...updates } = args;
    const cleanUpdates: any = { updatedAt: Date.now() };
    
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        cleanUpdates[key] = updates[key];
      }
    });
    
    return await ctx.db.patch(draftId, cleanUpdates);
  },
});

// Approve draft
export const approveDraft = mutation({
  args: { draftId: v.id("drafts") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.draftId, {
      status: "approved",
      updatedAt: Date.now(),
    });
  },
});

// Delete draft
export const deleteDraft = mutation({
  args: { draftId: v.id("drafts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.draftId);
  },
});

