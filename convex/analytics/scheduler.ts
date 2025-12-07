import { action } from '../_generated/server';
import { api, internal } from '../_generated/api';

export const syncAllProjects = action({
  args: {},
  handler: async (
    ctx
  ): Promise<Array<{ projectId: any; status: string; data?: any; error?: string }>> => {
    // Get all projects via internal query
    const projects = await ctx.runQuery(internal.analytics.queries.getAllProjectsInternal);

    // Log start
    console.log(`[Analytics Scheduler] Syncing ${projects.length} projects...`);

    const results = [];

    for (const project of projects) {
      try {
        // Call the internal sync action directly
        // Note: internal actions must be called via 'internal' object
        const data = await ctx.runAction(internal.analytics.sync.syncProjectData, {
          projectId: project._id,
        });

        results.push({ projectId: project._id, status: 'success', data });
        console.log(`[Analytics Scheduler] Synced Project ${project.name} (${project._id})`);
      } catch (error) {
        console.error(`[Analytics Scheduler] Failed to sync project ${project._id}:`, error);
        results.push({ projectId: project._id, status: 'error', error: String(error) });
      }
    }

    return results;
  },
});
