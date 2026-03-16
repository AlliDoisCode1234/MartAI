/**
 * Workflow Trigger Mutations (WF-003)
 *
 * RBAC-gated mutations that start durable workflows.
 * userId is always derived from auth context, never from client args.
 *
 * Pattern:
 *   1. requireProjectAccess -> verifies caller has 'editor' role
 *   2. workflow.start -> begins durable workflow execution
 *   3. Return workflowId for client-side status polling
 *
 * Note: workflow.define() returns a RegisteredMutation<'internal', ...>
 * which is exactly what workflow.start() accepts as the second arg.
 */

import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { workflow } from './index';
import { requireProjectAccess } from './lib/rbac';
import { contentGenerationWorkflow } from './workflows/contentGenerationWorkflow';
import { calendarGenerationWorkflow } from './workflows/calendarGenerationWorkflow';
import { contentTypeValidator } from './phoo/contentTypes';

/**
 * Start a durable content generation workflow.
 *
 * Replaces: useAction(api.contentGeneration.generateContent)
 * With:     useMutation(api.workflowTriggers.startContentGeneration)
 */
export const startContentGeneration = mutation({
  args: {
    projectId: v.id('projects'),
    contentType: contentTypeValidator,
    title: v.string(),
    keywords: v.array(v.string()),
    clusterId: v.optional(v.id('keywordClusters')),
  },
  handler: async (ctx, args): Promise<{ workflowId: any }> => {
    // RBAC: verify caller has editor access to this project
    const { userId } = await requireProjectAccess(ctx, args.projectId, 'editor');

    // Start durable workflow — userId derived from auth, not client args.
    // workflow.define() returns a RegisteredMutation which is the correct
    // FunctionReference type for workflow.start().
    const workflowId = await workflow.start(
      ctx,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      contentGenerationWorkflow as any,
      {
        projectId: args.projectId,
        userId,
        contentType: args.contentType,
        title: args.title,
        keywords: args.keywords,
        clusterId: args.clusterId,
      }
    );

    return { workflowId };
  },
});

/**
 * Start a durable calendar generation workflow.
 *
 * Replaces: useAction(api.contentCalendar.generateCalendar.generateFullCalendar)
 * With:     useMutation(api.workflowTriggers.startCalendarGeneration)
 */
export const startCalendarGeneration = mutation({
  args: {
    projectId: v.id('projects'),
    websiteUrl: v.optional(v.string()),
    businessDescription: v.optional(v.string()),
    monthsAhead: v.optional(v.number()),
    useGa4Gsc: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<{ workflowId: any }> => {
    // RBAC: verify caller has editor access to this project
    const { userId } = await requireProjectAccess(ctx, args.projectId, 'editor');

    // Start durable workflow — userId derived from auth, not client args
    const workflowId = await workflow.start(
      ctx,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      calendarGenerationWorkflow as any,
      {
        projectId: args.projectId,
        userId,
        websiteUrl: args.websiteUrl,
        businessDescription: args.businessDescription,
        monthsAhead: args.monthsAhead,
        useGa4Gsc: args.useGa4Gsc,
      }
    );

    return { workflowId };
  },
});
