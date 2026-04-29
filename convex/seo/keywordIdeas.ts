import { mutation, query, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { v } from "convex/values";
import { requireProjectAccess } from "../lib/rbac";

const keywordInput = {
  prospectId: v.optional(v.id("prospects")),
  projectId: v.optional(v.id("projects")),
  primaryKeyword: v.string(),
  supportingKeywords: v.optional(v.array(v.string())),
  intent: v.optional(v.string()),
  trafficPotential: v.optional(v.number()),
  kdScore: v.optional(v.number()),
  cpc: v.optional(v.number()),
  entities: v.optional(v.array(v.string())),
  serpNotes: v.optional(v.string()),
  priority: v.optional(v.string()),
  status: v.optional(v.string()),
};

/**
 * Validates write access. Resolves prospect associations to project contexts to prevent RBAC bypasses.
 */
async function verifyKeywordWriteAccess(ctx: MutationCtx, args: { projectId?: Id<"projects">, ideaId?: Id<"keywordIdeas">, prospectId?: Id<"prospects"> }) {
  let targetProjectId = args.projectId;
  
  if (!targetProjectId && args.ideaId) {
    const existing = await ctx.db.get(args.ideaId);
    targetProjectId = existing?.projectId;
  }

  // If no direct project ID but prospect is associated, resolve prospect to user project to enforce RBAC
  if (!targetProjectId && args.prospectId) {
    const prospect = await ctx.db.get(args.prospectId);
    const prospectUserId = prospect?.userId;
    if (prospectUserId) {
      const project = await ctx.db
        .query("projects")
        .withIndex("by_user", (q) => q.eq("userId", prospectUserId))
        .first();
      if (project) {
        targetProjectId = project._id;
      }
    }
  }

  if (targetProjectId) {
    await requireProjectAccess(ctx, targetProjectId, 'editor');
  }
}

async function insertIdea(ctx: MutationCtx, args: {
  prospectId?: Id<"prospects">;
  projectId?: Id<"projects">;
  primaryKeyword: string;
  supportingKeywords?: string[];
  intent?: string;
  trafficPotential?: number;
  kdScore?: number;
  cpc?: number;
  entities?: string[];
  serpNotes?: string;
  priority?: string;
  status?: string;
}) {
  const now = Date.now();
  return await ctx.db.insert("keywordIdeas", {
    prospectId: args.prospectId,
    projectId: args.projectId,
    primaryKeyword: args.primaryKeyword,
    supportingKeywords: args.supportingKeywords ?? [],
    intent: args.intent,
    trafficPotential: args.trafficPotential,
    kdScore: args.kdScore,
    cpc: args.cpc,
    entities: args.entities ?? [],
    serpNotes: args.serpNotes,
    priority: args.priority,
    status: args.status ?? "candidate",
    createdAt: now,
    updatedAt: now,
  });
}

export const createKeywordIdea = mutation({
  args: keywordInput,
  handler: async (ctx, args) => {
    await verifyKeywordWriteAccess(ctx, args);
    return await insertIdea(ctx, args);
  },
});

export const upsertKeywordIdea = mutation({
  args: {
    ideaId: v.optional(v.id("keywordIdeas")),
    ...keywordInput,
  },
  handler: async (ctx, args) => {
    await verifyKeywordWriteAccess(ctx, args);
    
    const { ideaId, ...rest } = args;
    if (!ideaId) {
      return await insertIdea(ctx, rest);
    }

    const existing = await ctx.db.get(ideaId);
    if (!existing) {
      throw new Error("Keyword idea not found");
    }

    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }

    await ctx.db.patch(ideaId, updates);
    return ideaId;
  },
});

export const listKeywordIdeas = query({
  args: {
    prospectId: v.optional(v.id("prospects")),
    projectId: v.optional(v.id("projects")),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Verify project-level access via requireProjectAccess (RBAC)
    if (args.projectId) { 
      await requireProjectAccess(ctx, args.projectId, 'viewer'); 
    }
    
    let builder = ctx.db.query("keywordIdeas").order("desc");

    if (args.prospectId) {
      builder = ctx.db
        .query("keywordIdeas")
        .withIndex("by_prospect", (q) => q.eq("prospectId", args.prospectId))
        .order("desc");
    } else if (args.projectId) {
      builder = ctx.db
        .query("keywordIdeas")
        .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
        .order("desc");
    }

    const ideas = await builder.collect();
    return args.status ? ideas.filter((idea) => idea.status === args.status) : ideas;
  },
});

export const updateKeywordIdeaStatus = mutation({
  args: {
    ideaId: v.id("keywordIdeas"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await verifyKeywordWriteAccess(ctx, args);
    
    const { ideaId, status } = args;
    const existing = await ctx.db.get(ideaId);
    if (!existing) {
      throw new Error("Keyword idea not found");
    }
    await ctx.db.patch(ideaId, { status, updatedAt: Date.now() });
    return { success: true };
  },
});
