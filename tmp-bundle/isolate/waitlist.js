import {
  a as w,
  e as f
} from "./_deps/GTU362KY.js";
import {
  a as s,
  c as p
} from "./_deps/K33OSGN4.js";
import {
  c as t,
  e as b
} from "./_deps/4U34M3I6.js";
import {
  a as o
} from "./_deps/RUVYHBJQ.js";

// convex/waitlist.ts
b();
f();
var q = p({
  args: {
    email: t.string(),
    source: t.optional(t.string()),
    metadata: t.optional(
      t.object({
        referrer: t.optional(t.string()),
        utmSource: t.optional(t.string()),
        utmMedium: t.optional(t.string()),
        utmCampaign: t.optional(t.string()),
        userAgent: t.optional(t.string())
      })
    )
  },
  handler: /* @__PURE__ */ o(async (i, e) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email))
      throw new Error("Invalid email format");
    let a = e.email.toLowerCase().trim(), u = await i.db.query("waitlist").withIndex("by_email", (n) => n.eq("email", a)).first();
    if (u)
      return { id: u._id, alreadyExists: !0 };
    let r = Date.now(), l = await i.db.insert("waitlist", {
      email: a,
      source: e.source ?? "phoo.ai",
      metadata: e.metadata,
      status: "pending",
      createdAt: r
    }), d = await i.db.query("users").withIndex("email", (n) => n.eq("email", a)).first(), c = d?._id;
    return d || (c = await i.db.insert("users", {
      email: a,
      createdAt: r,
      updatedAt: r,
      role: "user",
      accountStatus: "inactive",
      // Activate when they complete onboarding
      onboardingStatus: "not_started",
      acquisitionSource: "waitlist_beta",
      acquisitionDate: r,
      acquisitionMetadata: {
        utmSource: e.metadata?.utmSource,
        utmMedium: e.metadata?.utmMedium,
        utmCampaign: e.metadata?.utmCampaign,
        referrer: e.metadata?.referrer,
        waitlistId: l
      },
      // Beta user fields - skip pricing/payment in onboarding
      // betaExpiresAt set when onboarding completes (6 months from then)
      isBetaUser: !0,
      membershipTier: "solo"
    })), await i.scheduler.runAfter(0, w.integrations.hubspot.syncWaitlistToHubspot, {
      email: a,
      source: e.source ?? "phoo.ai",
      utmSource: e.metadata?.utmSource,
      utmMedium: e.metadata?.utmMedium,
      utmCampaign: e.metadata?.utmCampaign
    }), { id: l, userId: c, alreadyExists: !1 };
  }, "handler")
}), x = s({
  args: {},
  handler: /* @__PURE__ */ o(async (i) => ({ count: (await i.db.query("waitlist").collect()).length }), "handler")
}), S = s({
  args: {
    limit: t.optional(t.number())
  },
  handler: /* @__PURE__ */ o(async (i, e) => {
    let m = e.limit ?? 100;
    return await i.db.query("waitlist").withIndex("by_created").order("desc").take(m);
  }, "handler")
});
export {
  x as getWaitlistCount,
  q as joinWaitlist,
  S as listWaitlistEntries
};
//# sourceMappingURL=waitlist.js.map
