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
 * CRITICAL: workflow.start() requires a FunctionReference from the generated API tree,
 * NOT a direct JS import of the workflow.define() return value.
 * Use: internal.workflows.<filename>.<exportName>
 */

import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { workflow } from './index';
import { internal } from './_generated/api';
import { requireProjectAccess } from './lib/rbac';
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
    // Must use API reference, NOT direct import (Convex runtime wraps direct
    // imports in a guard that is not a valid FunctionReference).
    const workflowId = await workflow.start(
      ctx,
      internal.workflows.contentGenerationWorkflow.contentGenerationWorkflow,
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
      internal.workflows.calendarGenerationWorkflow.calendarGenerationWorkflow,
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
