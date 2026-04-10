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
      const data = (await ctx.runAction(internal.analytics.sync.syncProjectData, {
        projectId: args.projectId,
      })) as unknown;
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
  ): Promise<Array<{ projectId: string; status: string; data?: unknown; error?: string }>> => {
    const projects = await ctx.runQuery(internal.analytics.queries.getAllProjectsInternal);

    // Pre-filter: only sync projects that have at least one integration connected
    // Batched concurrent mapping to prevent Action runtime timeouts
    const connectedProjects = [];
    const BATCH_SIZE = 25;
    
    for (let i = 0; i < projects.length; i += BATCH_SIZE) {
      const batch = projects.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async (project: any) => {
          try {
            const [ga4, gsc] = await Promise.all([
              ctx.runQuery(internal.integrations.ga4Connections.getGA4ConnectionInternal, {
                projectId: project._id,
              }),
              ctx.runQuery(internal.integrations.gscConnections.getGSCConnectionInternal, {
                projectId: project._id,
              }),
            ]);
            return ga4 || gsc ? project : null;
          } catch (error) {
            console.error(`Failed integration lookup for project ${project._id}:`, error);
            // Default to syncing if lookup fails, to be safe
            return project;
          }
        })
      );
      
      for (const result of batchResults) {
        if (result) connectedProjects.push(result);
      }
    }

    console.log(
      `[Analytics Scheduler] ${connectedProjects.length}/${projects.length} projects have integrations. Scheduling syncs...`
    );

    const results = [];
    let delayMs = 0;
    const baseDelayMs = 2000;
    const MAX_DELAY_MS = 5 * 60 * 1000; // 5 minute ceiling

    for (const project of connectedProjects) {
      try {
        const jitter = Math.floor(Math.random() * 500);
        const boundedDelay = Math.min(delayMs + jitter, MAX_DELAY_MS);

        await ctx.scheduler.runAfter(boundedDelay, internal.analytics.sync.syncProjectData, {
          projectId: project._id,
        });

        results.push({ projectId: project._id, status: 'scheduled', delayMs: boundedDelay });
        console.log(
          `[Analytics Scheduler] Queued Project ${project.name} (${project._id}) in ${boundedDelay}ms`
        );

        // Increment the delay for the next project to spread out the API load
        delayMs += baseDelayMs;
      } catch (error) {
        console.error(
          `[Analytics Scheduler] Failed to schedule sync for project ${project._id}:`,
          error
        );
        results.push({ projectId: project._id, status: 'error', error: String(error) });
      }
    }

    return results;
  },
});
