/**
 * Phoo Chat Actions
 *
 * Component Hierarchy:
 * convex/phoo/agent/chat.ts (this file)
 *
 * Convex actions for Phoo chat functionality.
 */

import { action } from '../../_generated/server';
import { v } from 'convex/values';
import { phooAgent, phooFaqAgent, phooTools } from './phoo';
import { auth } from '../../auth';

/**
 * Create a new chat thread with Phoo
 */
export const createThread = action({
  args: {
    projectId: v.optional(v.id('projects')),
    initialMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    // Use FAQ mode for unauthenticated users
    const agent = userId ? phooAgent : phooFaqAgent;

    const { threadId, thread } = await agent.createThread(ctx, {
      userId: userId ?? undefined,
    });

    // If there's an initial message, send it
    if (args.initialMessage) {
      const result = await thread.generateText({
        prompt: args.initialMessage,
        // Only provide tools for authenticated users
        ...(userId ? { tools: phooTools } : {}),
      });

      return {
        threadId,
        response: result.text,
        isAuthenticated: !!userId,
      };
    }

    return {
      threadId,
      response: null,
      isAuthenticated: !!userId,
    };
  },
});

/**
 * Continue an existing chat thread
 */
export const sendMessage = action({
  args: {
    threadId: v.string(),
    message: v.string(),
    projectId: v.optional(v.id('projects')),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    // Use FAQ mode for unauthenticated users
    const agent = userId ? phooAgent : phooFaqAgent;

    const { thread } = await agent.continueThread(ctx, {
      threadId: args.threadId,
    });

    const result = await thread.generateText({
      prompt: args.message,
      // Only provide tools for authenticated users
      ...(userId ? { tools: phooTools } : {}),
    });

    return {
      response: result.text,
      isAuthenticated: !!userId,
    };
  },
});

/**
 * Stream a message response
 */
export const streamMessage = action({
  args: {
    threadId: v.string(),
    message: v.string(),
    projectId: v.optional(v.id('projects')),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    // Use FAQ mode for unauthenticated users
    const agent = userId ? phooAgent : phooFaqAgent;

    const { thread } = await agent.continueThread(ctx, {
      threadId: args.threadId,
    });

    // Stream the response
    const result = await thread.streamText({
      prompt: args.message,
      // Only provide tools for authenticated users
      ...(userId ? { tools: phooTools } : {}),
    });

    return {
      response: result.text,
      isAuthenticated: !!userId,
    };
  },
});

/**
 * Get thread messages (for display)
 *
 * NOTE: The @convex-dev/agent component manages its own message storage.
 * To get thread messages, use the agent's listMessages API:
 *
 * ```typescript
 * import { components } from '../_generated/api';
 * const messages = await ctx.runQuery(components.agent.messages.list, { threadId });
 * ```
 *
 * See: https://docs.convex.dev/agents/messages
 */
