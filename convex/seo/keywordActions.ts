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

export const generateClusters = action({
  args: {
    projectId: v.id("projects"),
    keywords: v.optional(v.array(keywordInputArg)),
    importFromGSC: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
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
