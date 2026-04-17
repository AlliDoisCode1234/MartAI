import { workflow } from '../index';
import { v } from 'convex/values';
import { internal } from '../_generated/api';

/**
 * Onboarding Orchestration Workflow (WF-003)
 *
 * Durable wrapper around the sequence of heavy AI Generation features triggered
 * after successful Step 3 project creation. This replaces the fragile client-side 
 * Promise.all chain with a highly resilient backend queue.
 *
 * AUTH ARCHITECTURE: Durable workflows lose ctx.auth context. All steps use
 * internal.* variants that accept explicit userId instead of reading from auth.
 * The userId is securely extracted by requireProjectAccess in the trigger
 * (workflowTriggers.ts) and passed as an immutable workflow argument.
 *
 * Steps:
 * 1. Mark generationStatus as "generating"
 * 2. Generate target keywords via `generateKeywordsFromUrlInternal`
 * 3. Form initial clusters via `generateClustersInternal`
 * 4. Construct content schedule via `generateFullCalendarInternal`
 * 5. Run scoring algorithm via `generatePreliminaryScoreInternal`
 * 6. Mark generationStatus as "complete"
 */
export const onboardingOrchestrationWorkflow = workflow.define({
  args: {
    projectId: v.id('projects'),
    userId: v.id('users'),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (step, args): Promise<any> => {
    try {
      // ── Step 1: Lock UI Status ──────────────────────────────────────
      await step.runMutation(internal.projects.projects.updateProjectInternal, {
        projectId: args.projectId,
        generationStatus: 'generating',
      });

      let successCount = 0;

      // ── Step 2: Keywords Generation ─────────────────────────────────
      try {
        const kwRes = await step.runAction(internal.seo.keywordActions.generateKeywordsFromUrlInternal, {
          projectId: args.projectId,
          userId: args.userId,
          limit: 30,
        });
        if (kwRes && kwRes.success) {
          successCount++;
        }
      } catch (err) {
        console.warn('[Orchestration] Keyword Gen Threw, continuing...', err);
      }

      // ── Step 3: Cluster Formation ───────────────────────────────────
      try {
        const clusRes = await step.runAction(internal.seo.keywordActions.generateClustersInternal, {
          projectId: args.projectId,
          userId: args.userId,
        });
        if (clusRes && clusRes.success) {
          successCount++;
        }
      } catch (err) {
        console.warn('[Orchestration] Cluster Gen Threw, continuing...', err);
      }

      // ── Step 4: Content Calendar ────────────────────────────────────
      try {
        const calRes = await step.runAction(internal.contentCalendar.generateCalendar.generateFullCalendarInternal, {
          projectId: args.projectId,
          userId: args.userId,
        });
        if (calRes && calRes.success) {
          successCount++;
        }
      } catch (err) {
        console.warn('[Orchestration] Calendar Gen Threw, continuing...', err);
      }

      // ── Step 5: Dashboard Metric Generation ─────────────────────────
      try {
        await step.runMutation(internal.analytics.martaiRatingQueries.generatePreliminaryScoreInternal, {
          projectId: args.projectId,
        });
        successCount++;
      } catch (err) {
        console.warn('[Orchestration] Rating Gen Failed, continuing...', err);
      }

      if (successCount === 0) {
        throw new Error('All orchestration generation primary steps failed critically.');
      }

      // ── Step 6: Mark Complete ───────────────────────────────────────
      await step.runMutation(internal.projects.projects.updateProjectInternal, {
        projectId: args.projectId,
        generationStatus: 'complete',
      });

      return { success: true, message: 'Onboarding orchestration structurally finalized' };
    } catch (e) {
      console.error('[Orchestration] Critical Failure:', e);
      // Failsafe: unlock the UI
      let recoveryMsg = '';
      try {
        await step.runMutation(internal.projects.projects.updateProjectInternal, {
          projectId: args.projectId,
          generationStatus: 'error',
        });
      } catch (updateErr) {
        console.error('[Orchestration] Failsafe Mutation Failed:', updateErr);
        recoveryMsg = ` | Recovery failed: ${updateErr instanceof Error ? updateErr.message : String(updateErr)}`;
      }
      
      return { 
        success: false, 
        message: (e instanceof Error ? e.message : 'Unknown error') + recoveryMsg
      };
    }
  },
});
