"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import {
  generateKeywordClusters,
  importKeywordsFromGSC,
  type KeywordInput,
} from "../../lib/keywordClustering";
import { getGSCData } from "../../lib/googleAuth";

const keywordInputArg = v.object({
  keyword: v.string(),
  volume: v.optional(v.number()),
  difficulty: v.optional(v.number()),
  intent: v.optional(v.string()),
});

import { auth } from "../auth";
import { rateLimits, getRateLimitKey, type MembershipTier } from "../rateLimits";
import { ConvexError } from "convex/values";

export const generateClusters = action({
  args: {
    projectId: v.id("projects"),
    keywords: v.optional(v.array(keywordInputArg)),
    importFromGSC: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
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
    const rateLimitKey = getRateLimitKey("generateKeywordClusters", tier);
    const { ok, retryAfter } = await rateLimits.limit(ctx, rateLimitKey as any, {
      key: userId as string,
    });

    if (!ok) {
      const retryMinutes = Math.ceil(retryAfter / 1000 / 60);
      throw new ConvexError({
        kind: "RateLimitError",
        message: `Rate limit exceeded. You can generate ${tier === "free" ? "5 clusters per day" : tier === "admin" ? "200 clusters per hour" : `${tier} tier limit reached`}. Try again in ${retryMinutes} minute${retryMinutes !== 1 ? "s" : ""}.`,
        retryAfter,
      });
    }

    const project = await ctx.runQuery(api.projects.projects.getProjectById, {
      projectId: args.projectId,
    });

    let keywordInputs: KeywordInput[] = (args.keywords ?? []).map((keyword) => ({
      keyword: keyword.keyword,
      volume: keyword.volume,
      difficulty: keyword.difficulty,
      intent: keyword.intent,
    }));

    if (args.importFromGSC ?? false) {
      try {
        const connection = await ctx.runQuery(api.integrations.gscConnections.getGSCConnection, {
          projectId: args.projectId,
        });
        if (connection?.accessToken && connection?.siteUrl) {
          const gscData = await getGSCData(
            connection.accessToken,
            connection.siteUrl,
            "30daysAgo",
            "today",
            150,
          );
          const imported = importKeywordsFromGSC(gscData);
          if (imported.length > 0) {
            keywordInputs = keywordInputs.concat(imported);
            await ctx.runMutation(api.integrations.gscConnections.updateLastSync, {
              connectionId: connection._id,
            });
          }
        }
      } catch (error) {
        console.warn("GSC import failed:", error);
      }
    }

    if (keywordInputs.length === 0) {
      keywordInputs = buildFallbackKeywords(project ?? undefined);
    }

    if (keywordInputs.length === 0) {
      throw new Error("Unable to find keywords to cluster. Add keywords or connect GSC.");
    }

    const clusters = await generateKeywordClusters(
      keywordInputs,
      project?.websiteUrl,
      project?.industry,
    );

    let createdCount = 0;
    for (const cluster of clusters) {
      try {
        await ctx.runMutation(api.seo.keywordClusters.createCluster, {
          projectId: args.projectId,
          clusterName: cluster.clusterName,
          keywords: cluster.keywords,
          intent: cluster.intent,
          difficulty: cluster.difficulty,
          volumeRange: cluster.volumeRange,
          impactScore: cluster.impactScore,
          topSerpUrls: cluster.topSerpUrls,
          status: "active",
          createdAt: Date.now(),
        });
        createdCount += 1;
      } catch (error) {
        console.error("Failed to store cluster:", error);
      }
    }

    return {
      success: true,
      count: createdCount,
    };
  },
});

function buildFallbackKeywords(project?: { industry?: string; name?: string }): KeywordInput[] {
  const base = (project?.industry || project?.name || "growth marketing").toLowerCase();
  const topics = [
    `${base} strategy`,
    `${base} software`,
    `${base} tools`,
    `${base} best practices`,
    `${base} pricing`,
    `${base} case studies`,
    `${base} automation`,
    `${base} templates`,
  ];

  return topics.map((keyword, index) => ({
    keyword,
    volume: 500 - index * 30,
    difficulty: 35 + index * 3,
    intent: index < 3 ? "commercial" : index < 5 ? "transactional" : "informational",
  }));
}
