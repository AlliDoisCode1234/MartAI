import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

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
  userId: v.optional(v.id("users")),
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

export const createProspect = mutation({
  args: {
    ...baseProspectFields,
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("prospects", {
      firstName: args.firstName ?? "",
      lastName: args.lastName ?? "",
      email: args.email ?? "",
      phone: args.phone ?? "",
      companyName: args.companyName ?? "",
      monthlyRevenue: args.monthlyRevenue ?? "",
      marketingFrustration: args.marketingFrustration ?? "",
      investedBefore: args.investedBefore ?? "",
      timeline: args.timeline ?? "",
      source: args.source ?? "",
      status: args.status ?? "draft",
      userId: args.userId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateProspect = mutation({
  args: {
    prospectId: v.id("prospects"),
    ...baseProspectFields,
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { prospectId, ...rest } = args;
    const existing = await ctx.db.get(prospectId);
    if (!existing) {
      throw new Error("Prospect not found");
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
    prospectId: v.id("prospects"),
    ...detailFields,
    urls: v.optional(v.array(urlInput)),
    markCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const {
      prospectId,
      urls,
      markCompleted,
      ...detailPayload
    } = args;

    const existingProspect = await ctx.db.get(prospectId);
    if (!existingProspect) {
      throw new Error("Prospect not found");
    }

    const now = Date.now();

    // Upsert detail record
    const existingDetail = await ctx.db
      .query("prospectDetails")
      .withIndex("by_prospect", (q) => q.eq("prospectId", prospectId))
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
      await ctx.db.insert("prospectDetails", {
        prospectId,
        ...detailPayload,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Replace submitted URLs
    if (urls !== undefined) {
      const existingUrls = await ctx.db
        .query("submittedUrls")
        .withIndex("by_prospect", (q) => q.eq("prospectId", prospectId))
        .collect();

      for (const url of existingUrls) {
        await ctx.db.delete(url._id);
      }

      for (const entry of urls) {
        if (!entry.value) {
          continue;
        }
        await ctx.db.insert("submittedUrls", {
          prospectId,
          label: entry.label || "Link",
          url: entry.value,
          createdAt: now,
        });
      }
    }

    if (markCompleted) {
      await ctx.db.patch(prospectId, {
        status: "details_submitted",
        updatedAt: now,
      });
    } else {
      await ctx.db.patch(prospectId, {
        updatedAt: now,
      });
    }

    return { success: true };
  },
});

export const getProspect = query({
  args: { prospectId: v.id("prospects") },
  handler: async (ctx, args) => {
    const prospect = await ctx.db.get(args.prospectId);
    if (!prospect) return null;

    const detail = await ctx.db
      .query("prospectDetails")
      .withIndex("by_prospect", (q) => q.eq("prospectId", args.prospectId))
      .first();

    const urls = await ctx.db
      .query("submittedUrls")
      .withIndex("by_prospect", (q) => q.eq("prospectId", args.prospectId))
      .collect();

    return {
      prospect,
      detail,
      urls,
    };
  },
});

