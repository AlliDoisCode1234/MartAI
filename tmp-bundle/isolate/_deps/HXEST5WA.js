import {
  a as p,
  c as b,
  d as h
} from "./K33OSGN4.js";
import {
  c as t,
  e as D
} from "./4U34M3I6.js";
import {
  a as o
} from "./RUVYHBJQ.js";

// convex/subscriptions/subscriptions.ts
D();

// node_modules/date-fns/constants.js
var _ = Math.pow(10, 8) * 24 * 60 * 60 * 1e3, S = -_;
var F = 3600;
var A = F * 24, L = A * 7, R = A * 365.2425, k = R / 12, G = k * 3, x = Symbol.for("constructDateFrom");

// node_modules/date-fns/constructFrom.js
function M(n, e) {
  return typeof n == "function" ? n(e) : n && typeof n == "object" && x in n ? n[x](e) : n instanceof Date ? new n.constructor(e) : new Date(e);
}
o(M, "constructFrom");

// node_modules/date-fns/toDate.js
function u(n, e) {
  return M(e || n, n);
}
o(u, "toDate");

// node_modules/date-fns/endOfMonth.js
function y(n, e) {
  let r = u(n, e?.in), a = r.getMonth();
  return r.setFullYear(r.getFullYear(), a + 1, 0), r.setHours(23, 59, 59, 999), r;
}
o(y, "endOfMonth");

// node_modules/date-fns/startOfMonth.js
function f(n, e) {
  let r = u(n, e?.in);
  return r.setDate(1), r.setHours(0, 0, 0, 0), r;
}
o(f, "startOfMonth");

// convex/subscriptions/subscriptions.ts
var U = {
  // Free: No subscription - used for feature gating only
  free: {
    priceMonthly: 0,
    features: {
      maxUrls: 0,
      maxKeywordIdeas: 0,
      maxAiReports: 0,
      maxContentPieces: 0,
      maxTeamMembers: 0
    }
  },
  // Solo: $59/mo - AI cost ~$0.13/mo (10x markup + intelligence value)
  // Target: Solopreneurs, freelancers, 1 website, getting started with SEO
  solo: {
    priceMonthly: 59,
    features: {
      maxUrls: 1,
      maxKeywordIdeas: 250,
      maxAiReports: 4,
      maxContentPieces: 4,
      maxTeamMembers: 1
    }
  },
  // Growth: $149/mo - AI cost ~$0.85/mo
  // Target: Growing businesses, 3 websites, content scaling
  growth: {
    priceMonthly: 149,
    features: {
      maxUrls: 3,
      maxKeywordIdeas: 1e3,
      maxAiReports: 12,
      maxContentPieces: 12,
      maxTeamMembers: 3
    }
  },
  // Team: $299/mo
  // Target: Marketing Teams
  team: {
    priceMonthly: 299,
    features: {
      maxUrls: 10,
      maxKeywordIdeas: 2500,
      maxAiReports: 30,
      maxContentPieces: 30,
      maxTeamMembers: 10
    }
  },
  // Enterprise: Custom - AI cost ~$4/mo (contact sales)
  // Target: Large companies, need API access, SLA, custom integrations, unlimited seats
  enterprise: {
    priceMonthly: 0,
    // Contact Sales
    features: {
      maxUrls: 999999,
      // Unlimited
      maxKeywordIdeas: 1e4,
      maxAiReports: 100,
      maxContentPieces: 100,
      maxTeamMembers: 999999
      // Unlimited
    }
  }
};
function P(n) {
  let e = n.toLowerCase();
  return U[e] ?? null;
}
o(P, "planConfig");
async function I(n, e) {
  return await n.db.query("subscriptions").withIndex("by_user", (r) => r.eq("userId", e)).first();
}
o(I, "getActiveSubscription");
async function g(n, e, r, a) {
  let s = await n.db.query("usageLimits").withIndex(
    "by_user_period",
    (c) => c.eq("userId", e).eq("periodStart", r)
  ).first() ?? null;
  if (s)
    return s;
  let i = await n.db.insert("usageLimits", {
    userId: e,
    periodStart: r,
    periodEnd: a,
    urlsAnalyzed: 0,
    keywordIdeasGenerated: 0,
    aiReportsGenerated: 0,
    contentPiecesPlanned: 0,
    updatedAt: Date.now()
  });
  return await n.db.get(i);
}
o(g, "getUsageDoc");
var q = {
  urls: "urlsAnalyzed",
  keywordIdeas: "keywordIdeasGenerated",
  aiReports: "aiReportsGenerated",
  contentPieces: "contentPiecesPlanned"
}, C = {
  urlsAnalyzed: "maxUrls",
  keywordIdeasGenerated: "maxKeywordIdeas",
  aiReportsGenerated: "maxAiReports",
  contentPiecesPlanned: "maxContentPieces"
}, Z = h({
  args: {
    userId: t.id("users"),
    planTier: t.string(),
    status: t.union(
      t.literal("active"),
      t.literal("trialing"),
      t.literal("grace_period"),
      t.literal("maintenance_mode"),
      t.literal("past_due"),
      t.literal("cancelled"),
      t.literal("expired")
    ),
    billingCycle: t.optional(t.union(t.literal("monthly"), t.literal("annual"))),
    startsAt: t.number(),
    renewsAt: t.optional(t.number()),
    cancelAt: t.optional(t.number()),
    oneTimeFeePaid: t.optional(t.boolean())
  },
  handler: /* @__PURE__ */ o(async (n, e) => {
    let r = Date.now(), a = P(e.planTier), s = await I(n, e.userId), i = {
      planTier: e.planTier,
      status: e.status,
      billingCycle: e.billingCycle,
      priceMonthly: a.priceMonthly,
      features: a.features,
      startsAt: e.startsAt,
      renewsAt: e.renewsAt,
      cancelAt: e.cancelAt,
      oneTimeFeePaid: e.oneTimeFeePaid,
      updatedAt: r
    };
    return s ? (await n.db.patch(s._id, i), s._id) : await n.db.insert("subscriptions", {
      userId: e.userId,
      ...i,
      createdAt: r
    });
  }, "handler")
}), ee = p({
  args: { userId: t.id("users") },
  handler: /* @__PURE__ */ o(async (n, e) => {
    let r = await I(n, e.userId);
    if (!r)
      return null;
    let a = Date.now(), s = new Date(a), i = f(s).getTime(), c = y(s).getTime(), l = await g(n, e.userId, i, c);
    return { subscription: r, usage: l };
  }, "handler")
}), te = p({
  args: {
    status: t.optional(
      t.union(
        t.literal("active"),
        t.literal("trialing"),
        t.literal("grace_period"),
        t.literal("maintenance_mode"),
        t.literal("past_due"),
        t.literal("cancelled"),
        t.literal("expired")
      )
    )
  },
  handler: /* @__PURE__ */ o(async (n, e) => e.status ? await n.db.query("subscriptions").withIndex("by_status", (r) => r.eq("status", e.status)).order("desc").collect() : await n.db.query("subscriptions").order("desc").collect(), "handler")
}), ne = b({
  args: {
    userId: t.id("users"),
    metric: t.union(
      t.literal("urls"),
      t.literal("keywordIdeas"),
      t.literal("aiReports"),
      t.literal("contentPieces")
    ),
    amount: t.optional(t.number())
  },
  handler: /* @__PURE__ */ o(async (n, e) => {
    let r = await I(n, e.userId);
    if (!r || r.status !== "active")
      throw new Error("Active subscription required");
    let a = P(r.planTier), s = new Date(Date.now()), i = f(s).getTime(), c = y(s).getTime(), l = await g(n, e.userId, i, c), d = q[e.metric], w = C[d], T = e.amount ?? 1, m = l[d] + T;
    if (m > a.features[w])
      throw new Error(`Plan limit reached for ${e.metric}`);
    return await n.db.patch(l._id, {
      [d]: m,
      updatedAt: Date.now()
    }), { success: !0, remaining: a.features[w] - m };
  }, "handler")
});

export {
  U as a,
  P as b,
  Z as c,
  ee as d,
  te as e,
  ne as f
};
//# sourceMappingURL=HXEST5WA.js.map
