"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { generateBriefDetails, type ClusterInfo } from "../../lib/briefGenerator";

export const generateBrief = action({
  args: {
    briefId: v.id("briefs"),
    projectId: v.id("projects"),
    clusterId: v.optional(v.id("keywordClusters")),
  },
  handler: async (ctx, args) => {
    // Get project info
    const project = await ctx.runQuery(api.projects.projects.getProjectById, {
      projectId: args.projectId,
    });

    if (!project) {
      throw new Error("Project not found");
    }

    // Get cluster info if available
    let clusterInfo: ClusterInfo;
    
    if (args.clusterId) {
      // We need a query to get cluster by ID. 
      // convex/seo/keywordClusters.ts has getClustersByProject but not getClusterById?
      // Let's check if we can get it. 
      // Actually, we can use internal query or just pass the data if we had it.
      // But action should fetch it.
      // If getClusterById is missing, we might need to add it or use internal query.
      // Let's assume we can fetch it via a new query or filter.
      // For now, I'll use a placeholder if cluster is missing or if I can't fetch it easily.
      
      // Wait, I can use `ctx.runQuery(api.seo.keywordClusters.getClustersByProject, ...)` and find it.
      const clusters = await ctx.runQuery(api.seo.keywordClusters.getClustersByProject, {
        projectId: args.projectId,
      });
      const cluster = clusters.find(c => c._id === args.clusterId);
      
      if (cluster) {
        clusterInfo = {
          clusterName: cluster.clusterName,
          keywords: cluster.keywords,
          intent: cluster.intent,
          volumeRange: cluster.volumeRange,
        };
      } else {
        // Fallback if ID provided but not found
        clusterInfo = {
          clusterName: "General Topic",
          keywords: [project.industry || "Business"],
          intent: "informational",
          volumeRange: { min: 100, max: 1000 },
        };
      }
    } else {
      // Fallback if no cluster ID
      // We need the brief title to know what to generate?
      // The brief should already exist (we passed briefId).
      const brief = await ctx.runQuery(api.content.briefs.getBriefById, {
        briefId: args.briefId,
      });
      
      if (!brief) throw new Error("Brief not found");

      clusterInfo = {
        clusterName: brief.title,
        keywords: [brief.title],
        intent: "informational",
        volumeRange: { min: 0, max: 0 },
      };
    }

    // Generate details
    const details = await generateBriefDetails(
      clusterInfo,
      project.websiteUrl,
      project.industry
    );

    // Update brief with details
    await ctx.runMutation(api.content.briefs.updateBrief, {
      briefId: args.briefId,
      ...details,
      status: "in_progress",
    });

    return { success: true };
  },
});
