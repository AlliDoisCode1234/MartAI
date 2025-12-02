"use node";

import { action } from "../_generated/server";
import { api } from "../_generated/api";

export const syncAllProjects = action({
  args: {},
  handler: async (ctx) => {
    // Get all projects
    // We need a query to get all projects. 
    // Assuming api.projects.projects.getAllProjects exists or similar.
    // If not, we can use an internal query.
    // Let's assume we need to fetch them.
    
    // Since we don't have a direct "getAllProjects" visible in previous searches,
    // let's use the internal query pattern if possible, or just fetch via a new query.
    // I'll create a simple query in this file to get all projects if needed, 
    // but actions can't define queries.
    
    // Let's try to use `api.projects.projects.list` if it exists, or `api.admin.getAllUsers` 
    // and then get projects for each user? No, that's inefficient.
    
    // Best practice: Create an internal query to get all projects for the cron.
    const projects = await ctx.runQuery(api.analytics.scheduler.getAllProjectsInternal);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error("CRON_SECRET is not defined");
      return;
    }

    const results = [];

    for (const project of projects) {
      try {
        const response = await fetch(`${appUrl}/api/analytics/sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${cronSecret}`,
          },
          body: JSON.stringify({ projectId: project._id }),
        });

        if (!response.ok) {
          const text = await response.text();
          console.error(`Failed to sync project ${project._id}: ${text}`);
          results.push({ projectId: project._id, status: "failed", error: text });
        } else {
          const data = await response.json();
          results.push({ projectId: project._id, status: "success", data });
        }
      } catch (error) {
        console.error(`Error syncing project ${project._id}:`, error);
        results.push({ projectId: project._id, status: "error", error: String(error) });
      }
    }

    return results;
  },
});

import { internalQuery } from "../_generated/server";

export const getAllProjectsInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").collect();
  },
});
