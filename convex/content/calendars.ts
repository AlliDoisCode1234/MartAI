import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';

const calendarPayload = {
  prospectId: v.optional(v.id('prospects')),
  projectId: v.optional(v.id('projects')),
  briefId: v.optional(v.id('briefs')),
  title: v.string(),
  contentType: v.string(),
  primaryKeyword: v.optional(v.string()),
  supportingKeywords: v.optional(v.array(v.string())),
  status: v.optional(v.string()),
  publishDate: v.optional(v.number()),
  notes: v.optional(v.string()),
  heroOffer: v.optional(v.string()),
};

export const upsertCalendarItem = mutation({
  args: {
    itemId: v.optional(v.id('contentCalendars')),
    ...calendarPayload,
  },
  handler: async (ctx, args) => {
    const { itemId, ...rest } = args;
    const timestamp = Date.now();

    if (!rest.projectId && !rest.prospectId) {
      throw new Error('projectId or prospectId is required');
    }

    if (itemId) {
      const existing = await ctx.db.get(itemId);
      if (!existing) {
        throw new Error('Calendar item not found');
      }
      const updates: Record<string, any> = { updatedAt: timestamp };
      for (const [key, value] of Object.entries(rest)) {
        if (value !== undefined) {
          updates[key] = value;
        }
      }
      await ctx.db.patch(itemId, updates);
      return itemId;
    }

    return await ctx.db.insert('contentCalendars', {
      ...rest,
      status: rest.status ?? 'idea',
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const listCalendarItems = query({
  args: {
    projectId: v.optional(v.id('projects')),
    prospectId: v.optional(v.id('prospects')),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.projectId && !args.prospectId) {
      throw new Error('projectId or prospectId is required');
    }

    const builder = args.projectId
      ? ctx.db
          .query('contentCalendars')
          .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
          .order('desc')
      : ctx.db
          .query('contentCalendars')
          .withIndex('by_prospect', (q) => q.eq('prospectId', args.prospectId!))
          .order('desc');

    let items = await builder.collect();

    if (args.status) {
      items = items.filter((item) => item.status === args.status);
    }
    return items;
  },
});

/**
 * Get calendar items for a date range (optimized for month view)
 */
export const getCalendarByDateRange = query({
  args: {
    projectId: v.id('projects'),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    // Get all items for project and filter by date range
    const items = await ctx.db
      .query('contentCalendars')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    return items.filter(
      (item) =>
        item.publishDate && item.publishDate >= args.startDate && item.publishDate <= args.endDate
    );
  },
});

/**
 * Update calendar item status
 */
export const updateItemStatus = mutation({
  args: {
    itemId: v.id('contentCalendars'),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.itemId);
    if (!existing) {
      throw new Error('Calendar item not found');
    }
    await ctx.db.patch(args.itemId, {
      status: args.status,
      updatedAt: Date.now(),
    });
    return args.itemId;
  },
});

/**
 * Update calendar item date (for rescheduling)
 */
export const updateItemDate = mutation({
  args: {
    itemId: v.id('contentCalendars'),
    publishDate: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.itemId);
    if (!existing) {
      throw new Error('Calendar item not found');
    }
    await ctx.db.patch(args.itemId, {
      publishDate: args.publishDate,
      updatedAt: Date.now(),
    });
    return args.itemId;
  },
});

/**
 * Delete calendar item
 */
export const deleteCalendarItem = mutation({
  args: {
    itemId: v.id('contentCalendars'),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.itemId);
    if (!existing) {
      throw new Error('Calendar item not found');
    }
    await ctx.db.delete(args.itemId);
    return args.itemId;
  },
});
