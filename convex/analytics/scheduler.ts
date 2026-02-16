import { action } from '../_generated/server';
import { v } from 'convex/values';
import { api, internal } from '../_generated/api';

/**
 * Sync a single project's analytics data from GA4/GSC.
 * Used by the dashboard "Sync Data" button and post-OAuth callback.
 */
type SyncResult = {
  projectId: string;
  status: 'success' | 'error';
  data?: unknown;
  error?: string;
};

export const syncProject = action({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args): Promise<SyncResult> => {
    console.log(`[Analytics Scheduler] Syncing single project: ${args.projectId}`);
    try {
      const data: unknown = await ctx.runAction(internal.analytics.sync.syncProjectData, {
        projectId: args.projectId,
      });
      console.log(`[Analytics Scheduler] Single project sync complete: ${args.projectId}`);
      return { projectId: args.projectId, status: 'success', data };
    } catch (error) {
      console.error(`[Analytics Scheduler] Single project sync failed:`, error);
      return { projectId: args.projectId, status: 'error', error: String(error) };
    }
  },
});

/**
 * Sync ALL projects. Used only by the 6-hour cron job.
 * Do NOT call this from the dashboard — use syncProject instead.
 */
export const syncAllProjects = action({
  args: {},
  handler: async (
    ctx
  ): Promise<Array<{ projectId: any; status: string; data?: any; error?: string }>> => {
    const projects = await ctx.runQuery(internal.analytics.queries.getAllProjectsInternal);

    console.log(`[Analytics Scheduler] Syncing ${projects.length} projects...`);

    const results = [];

    for (const project of projects) {
      try {
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
