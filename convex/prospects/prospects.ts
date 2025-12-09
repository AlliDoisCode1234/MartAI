import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';

const baseProspectFields = {
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  email: v.optional(v.string()),
  phone: v.optional(v.string()),
  companyName: v.optional(v.string()),
  monthlyRevenue: v.optional(v.string()),
  marketingFrustration: v.optional(v.string()),
  investedBefore: v.optional(v.string()),
  timeline: v.optional(v.string()),
  source: v.optional(v.string()),
  userId: v.optional(v.id('users')),
} as const;

const detailFields = {
  businessName: v.optional(v.string()),
  topPriority: v.optional(v.string()),
  marketingTried: v.optional(v.string()),
  goals: v.optional(v.string()),
  supportNeeds: v.optional(v.array(v.string())),
  idealOutcome: v.optional(v.string()),
  additionalNotes: v.optional(v.string()),
  hearAbout: v.optional(v.string()),
  sendSms: v.optional(v.string()),
} as const;

const urlInput = v.object({
  label: v.string(),
  value: v.string(),
});

type ProspectDetailPayload = {
  prospectId: Id<'prospects'>;
  businessName?: string;
  topPriority?: string;
  marketingTried?: string;
  goals?: string;
  supportNeeds?: string[];
  idealOutcome?: string;
  additionalNotes?: string;
  hearAbout?: string;
  sendSms?: string;
  urls?: Array<{ label: string; value: string }>;
  markCompleted?: boolean;
};

async function persistProspectDetails(ctx: any, args: ProspectDetailPayload) {
  const { prospectId, urls, markCompleted, ...detailPayload } = args;
  const existingProspect = await ctx.db.get(prospectId);
  if (!existingProspect) {
    throw new Error('Prospect not found');
  }

  const now = Date.now();

  const existingDetail = await ctx.db
    .query('prospectDetails')
    .withIndex('by_prospect', (q: any) => q.eq('prospectId', prospectId))
    .first();

  if (existingDetail) {
    const updates: Record<string, any> = { updatedAt: now };
    for (const [key, value] of Object.entries(detailPayload)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }
    await ctx.db.patch(existingDetail._id, updates);
  } else {
    await ctx.db.insert('prospectDetails', {
      prospectId,
      ...detailPayload,
      createdAt: now,
      updatedAt: now,
    });
  }

  if (urls !== undefined) {
    const existingUrls = await ctx.db
      .query('submittedUrls')
      .withIndex('by_prospect', (q: any) => q.eq('prospectId', prospectId))
      .collect();

    for (const url of existingUrls) {
      await ctx.db.delete(url._id);
    }

    for (const entry of urls) {
      if (!entry.value) {
        continue;
      }
      await ctx.db.insert('submittedUrls', {
        prospectId,
        label: entry.label || 'Link',
        url: entry.value,
        createdAt: now,
      });
    }
  }

  if (markCompleted) {
    await ctx.db.patch(prospectId, {
      status: 'details_submitted',
      updatedAt: now,
    });
  } else {
    await ctx.db.patch(prospectId, {
      updatedAt: now,
    });
  }

  return { success: true };
}

export const createProspect = mutation({
  args: {
    ...baseProspectFields,
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert('prospects', {
      firstName: args.firstName ?? '',
      lastName: args.lastName ?? '',
      email: args.email ?? '',
      phone: args.phone ?? '',
      companyName: args.companyName ?? '',
      monthlyRevenue: args.monthlyRevenue ?? '',
      marketingFrustration: args.marketingFrustration ?? '',
      investedBefore: args.investedBefore ?? '',
      timeline: args.timeline ?? '',
      source: args.source ?? '',
      status: args.status ?? 'draft',
      userId: args.userId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateProspect = mutation({
  args: {
    prospectId: v.id('prospects'),
    ...baseProspectFields,
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { prospectId, ...rest } = args;
    const existing = await ctx.db.get(prospectId);
    if (!existing) {
      throw new Error('Prospect not found');
    }

    const updates: Record<string, any> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }

    await ctx.db.patch(prospectId, updates);
    return { success: true };
  },
});

export const saveProspectDetails = mutation({
  args: {
    prospectId: v.id('prospects'),
    ...detailFields,
    urls: v.optional(v.array(urlInput)),
    markCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return persistProspectDetails(ctx, args);
  },
});

export const completeProspectIntake = mutation({
  args: {
    prospectId: v.id('prospects'),
    ...detailFields,
    urls: v.optional(v.array(urlInput)),
  },
  handler: async (ctx, args) => {
    await persistProspectDetails(ctx, { ...args, markCompleted: true });

    const prospect = await ctx.db.get(args.prospectId);
    const detail = await ctx.db
      .query('prospectDetails')
      .withIndex('by_prospect', (q) => q.eq('prospectId', args.prospectId))
      .first();
    const urls = await ctx.db
      .query('submittedUrls')
      .withIndex('by_prospect', (q) => q.eq('prospectId', args.prospectId))
      .collect();

    return {
      success: true,
      prospect,
      detail,
      urls,
    };
  },
});

export const getProspect = query({
  args: { prospectId: v.id('prospects') },
  handler: async (ctx, args) => {
    const prospect = await ctx.db.get(args.prospectId);
    if (!prospect) return null;

    const detail = await ctx.db
      .query('prospectDetails')
      .withIndex('by_prospect', (q) => q.eq('prospectId', args.prospectId))
      .first();

    const urls = await ctx.db
      .query('submittedUrls')
      .withIndex('by_prospect', (q) => q.eq('prospectId', args.prospectId))
      .collect();

    return {
      prospect,
      detail,
      urls,
    };
  },
});

export const listProspects = query({
  args: {
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const baseQuery = args.status
      ? ctx.db
          .query('prospects')
          .withIndex('by_status', (idx) => idx.eq('status', args.status!))
          .order('desc')
      : ctx.db.query('prospects').order('desc');

    const prospects = await (args.limit ? baseQuery.take(args.limit) : baseQuery.collect());

    return Promise.all(
      prospects.map(async (prospect) => {
        const detail = await ctx.db
          .query('prospectDetails')
          .withIndex('by_prospect', (q2) => q2.eq('prospectId', prospect._id))
          .first();

        const urls = await ctx.db
          .query('submittedUrls')
          .withIndex('by_prospect', (q2) => q2.eq('prospectId', prospect._id))
          .collect();

        return { prospect, detail, urls };
      })
    );
  },
});

export const updateProspectStatus = mutation({
  args: {
    prospectId: v.id('prospects'),
    status: v.string(),
    assignedUserId: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    const { prospectId, status, assignedUserId } = args;
    const existing = await ctx.db.get(prospectId);
    if (!existing) {
      throw new Error('Prospect not found');
    }

    await ctx.db.patch(prospectId, {
      status,
      userId: assignedUserId ?? existing.userId,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// ============================================
// ONBOARDING PROSPECT MUTATIONS
// ============================================

/**
 * Creates a prospect from the onboarding flow (before paywall)
 * Captures lead data immediately when user enters their website
 */
export const createOnboardingProspect = mutation({
  args: {
    email: v.string(),
    companyName: v.optional(v.string()),
    websiteUrl: v.string(),
    planSelected: v.optional(v.string()),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if prospect already exists by email
    const existing = await ctx.db
      .query('prospects')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();

    if (existing) {
      // Update existing prospect with new data
      await ctx.db.patch(existing._id, {
        companyName: args.companyName ?? existing.companyName,
        websiteUrl: args.websiteUrl,
        planSelected: args.planSelected ?? existing.planSelected,
        updatedAt: now,
      });
      return existing._id;
    }

    // Create new prospect
    return await ctx.db.insert('prospects', {
      email: args.email,
      companyName: args.companyName ?? '',
      websiteUrl: args.websiteUrl,
      planSelected: args.planSelected,
      source: args.source ?? 'onboarding',
      status: 'initial_submitted',
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Updates prospect data when form fields change (auto-save on dirty)
 */
export const updateOnboardingProspect = mutation({
  args: {
    prospectId: v.id('prospects'),
    companyName: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    planSelected: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { prospectId, ...updates } = args;
    const existing = await ctx.db.get(prospectId);
    if (!existing) {
      throw new Error('Prospect not found');
    }

    const patchData: Record<string, any> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        patchData[key] = value;
      }
    }

    await ctx.db.patch(prospectId, patchData);
    return { success: true };
  },
});

/**
 * Converts a prospect to a paying user after payment is completed
 * Updates both the prospect record and the user record
 */
export const convertProspectToUser = mutation({
  args: {
    prospectId: v.id('prospects'),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const prospect = await ctx.db.get(args.prospectId);
    if (!prospect) {
      throw new Error('Prospect not found');
    }

    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update prospect as converted
    await ctx.db.patch(args.prospectId, {
      status: 'converted',
      convertedAt: now,
      convertedUserId: args.userId,
      userId: args.userId,
      updatedAt: now,
    });

    // Update user with prospect conversion tracking
    await ctx.db.patch(args.userId, {
      previousProspect: true,
      prospectConvertedAt: now,
      prospectId: args.prospectId,
    });

    return { success: true, prospectId: args.prospectId, userId: args.userId };
  },
});

/**
 * Gets a prospect by email (for checking if user already started onboarding)
 */
export const getProspectByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('prospects')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();
  },
});
