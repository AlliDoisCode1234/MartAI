"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { auth } from "../auth";
import { rateLimits, getRateLimitKey, type MembershipTier } from "../rateLimits";
import { ConvexError } from "convex/values";
import { generateDraftFromBrief } from "../../lib/draftGenerator";

export const generateDraft = action({
  args: {
    briefId: v.id("briefs"),
    regenerationNotes: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{
    success: boolean;
    draftId: any;
    content: string;
    qualityScore: number;
    toneScore: number;
    wordCount: number;
    status: string;
  }> => {
    // Get authenticated user
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Get user to check membership tier and role
    const user = await ctx.runQuery((api as any).users.current);
    if (!user) {
      throw new Error("User not found");
    }

    // Determine rate limit tier
    let tier: MembershipTier;
    if (user.role === "admin" || user.role === "super_admin") {
      tier = "admin";
    } else {
      tier = (user.membershipTier as MembershipTier) || "free";
    }

    // Check rate limit
    const rateLimitKey = getRateLimitKey("generateDraft", tier);
    const { ok, retryAfter } = await rateLimits.limit(ctx, rateLimitKey as any, {
      key: userId as string,
    });

    if (!ok) {
      const retryMinutes = Math.ceil(retryAfter / 1000 / 60);
      throw new ConvexError({
        kind: "RateLimitError",
        message: `Rate limit exceeded. You can generate ${tier === "free" ? "3 drafts per day" : tier === "admin" ? "100 drafts per hour" : `${tier} tier limit reached`}. Try again in ${retryMinutes} minute${retryMinutes !== 1 ? "s" : ""}.`,
        retryAfter,
      });
    }

    // Get brief
    const brief: any = await ctx.runQuery((api as any).content.briefs.getBriefById, {
      briefId: args.briefId,
    });

    if (!brief) {
      throw new Error("Brief not found");
    }

    // Check if brief has required details
    if (!brief.h2Outline || brief.h2Outline.length === 0) {
      throw new Error("Brief details not generated. Please generate brief details first.");
    }

    // Get cluster info
    let cluster = null;
    if (brief.clusterId) {
      const clusters = await ctx.runQuery((api as any).seo.keywordClusters.getClustersByProject, {
        projectId: brief.projectId,
      });
      cluster = clusters.find((c: any) => c._id === brief.clusterId);
    }

    // Get project details
    const project = await ctx.runQuery((api as any).projects.projects.getProjectById, {
      projectId: brief.projectId,
    });

    if (!project) {
      throw new Error("Project not found");
    }

    // Generate draft
    const draftResult = await generateDraftFromBrief(
      {
        title: brief.title,
        titleOptions: brief.titleOptions,
        h2Outline: brief.h2Outline,
        faqs: brief.faqs,
        metaTitle: brief.metaTitle,
        metaDescription: brief.metaDescription,
        internalLinks: brief.internalLinks,
        schemaSuggestion: brief.schemaSuggestion,
        cluster: cluster ? {
          clusterName: cluster.clusterName,
          keywords: cluster.keywords,
          intent: cluster.intent,
        } : undefined,
      },
      project.websiteUrl,
      project.industry,
      undefined, // brandVoice can be added later
      args.regenerationNotes
    );

    // Check if draft already exists
    const existingDraft: any = await ctx.runQuery((api as any).content.drafts.getDraftByBrief, {
      briefId: args.briefId,
    });

    let draftId;
    if (existingDraft) {
      // Update existing draft
      await ctx.runMutation((api as any).content.drafts.updateDraft, {
        draftId: existingDraft._id,
        content: draftResult.content,
        qualityScore: draftResult.qualityScore,
        toneScore: draftResult.toneScore,
        wordCount: draftResult.wordCount,
        status: 'draft',
        notes: args.regenerationNotes,
      });
      draftId = existingDraft._id;
    } else {
      // Create new draft
      draftId = await ctx.runMutation((api as any).content.drafts.createDraft, {
        briefId: args.briefId,
        projectId: brief.projectId,
        content: draftResult.content,
        qualityScore: draftResult.qualityScore,
        toneScore: draftResult.toneScore,
        wordCount: draftResult.wordCount,
        status: 'draft',
        notes: args.regenerationNotes,
      });
    }

    // Update brief status
    await ctx.runMutation((api as any).content.briefs.updateBrief, {
      briefId: args.briefId,
      status: 'in_progress',
    });

    return {
      success: true,
      draftId,
      ...draftResult,
      status: 'draft',
    };
  },
});
