import {
  e as A
} from "../_deps/MF3OI5Q7.js";
import "../_deps/OFY2WAT7.js";
import "../_deps/ZRD5YQUR.js";
import {
  a as g
} from "../_deps/K33OSGN4.js";
import {
  c as d,
  e as v
} from "../_deps/4U34M3I6.js";
import {
  a
} from "../_deps/RUVYHBJQ.js";

// convex/subscriptions/userHealth.ts
v();
var p = {
  healthy: 80,
  // 80-100: Actively using, paying on time
  atRisk: 50,
  // 50-79: Declining engagement or payment issues
  critical: 0
  // 0-49: High churn probability
}, s = {
  paymentHistory: 0.3,
  engagementRecency: 0.3,
  featureAdoption: 0.25,
  loginFrequency: 0.15
};
function b(e) {
  return e >= p.healthy ? "healthy" : e >= p.atRisk ? "at_risk" : "critical";
}
a(b, "calculateTier");
function S(e) {
  if (!e) return 0;
  let t = e.failedPaymentCount ?? 0, o = e.status === "maintenance_mode" ? 50 : e.status === "grace_period" ? 30 : e.status === "past_due" ? 40 : 0, r = Math.min(t * 20, 100);
  return Math.max(0, 100 - r - o);
}
a(S, "calculatePaymentScore");
function w(e, t) {
  let o = Date.now(), r = e ? (o - e) / (1e3 * 60 * 60 * 24) : 365, i;
  if (r <= 7 ? i = 100 : r <= 30 ? i = 100 - (r - 7) / 23 * 50 : r <= 60 ? i = 50 - (r - 30) / 30 * 50 : i = 0, t) {
    let n = [
      t.firstDraftCreatedAt,
      t.firstBriefCreatedAt,
      t.firstClusterCreatedAt
    ].filter((c) => c && o - c < 2592e6).length;
    i = Math.min(100, i + n * 5);
  }
  return i;
}
a(w, "calculateEngagementScore");
function C(e) {
  if (!e) return 0;
  let t = [
    "firstKeywordCreatedAt",
    "firstClusterCreatedAt",
    "firstBriefCreatedAt",
    "firstDraftCreatedAt",
    "firstContentPublishedAt",
    "firstGa4ConnectedAt",
    "firstGscConnectedAt",
    "firstWordPressConnectedAt"
  ];
  return t.filter(
    (r) => e[r] !== void 0
  ).length / t.length * 100;
}
a(C, "calculateAdoptionScore");
function H(e) {
  if (!e) return 0;
  let o = (Date.now() - e) / (1e3 * 60 * 60 * 24);
  return o <= 7 ? 100 : o <= 30 ? 50 : 0;
}
a(H, "calculateLoginScore");
var I = g({
  args: { userId: d.id("users") },
  handler: /* @__PURE__ */ a(async (e, { userId: t }) => {
    let o = await e.auth.getUserIdentity();
    if (!o)
      throw new Error("Unauthorized");
    let r = await e.db.query("users").withIndex("email", (y) => y.eq("email", o.email)).first();
    if (!r)
      throw new Error("User not found");
    let i = r.role === "admin" || r.role === "super_admin";
    if (r._id !== t && !i)
      throw new Error("Access denied");
    let n = await e.db.get(t);
    if (!n)
      throw new Error("User not found");
    let c = await e.db.query("subscriptions").withIndex("by_user", (y) => y.eq("userId", t)).first(), f = S(c), m = w(
      n.lastActiveAt,
      n.engagementMilestones
    ), h = C(
      n.engagementMilestones
    ), l = H(n.lastActiveAt), u = Math.round(
      f * s.paymentHistory + m * s.engagementRecency + h * s.featureAdoption + l * s.loginFrequency
    ), R = b(u);
    return {
      overall: u,
      tier: R,
      factors: {
        payment: Math.round(f),
        engagement: Math.round(m),
        adoption: Math.round(h),
        login: Math.round(l)
      }
      // Don't return sensitive data
    };
  }, "handler")
}), T = g({
  args: {
    tier: d.optional(d.union(d.literal("at_risk"), d.literal("critical")))
  },
  handler: /* @__PURE__ */ a(async (e, { tier: t }) => {
    await A(e);
    let o = await e.db.query("subscriptions").collect(), r = [];
    for (let i of o) {
      let n = await e.db.get(i.userId);
      if (!n) continue;
      let c = S(i), f = w(
        n.lastActiveAt,
        n.engagementMilestones
      ), m = C(
        n.engagementMilestones
      ), h = H(n.lastActiveAt), l = Math.round(
        c * s.paymentHistory + f * s.engagementRecency + m * s.featureAdoption + h * s.loginFrequency
      ), u = b(l);
      t && u !== t || !t && u === "healthy" || r.push({
        userId: i.userId,
        email: n.email,
        name: n.name,
        healthScore: l,
        healthTier: u,
        subscriptionStatus: i.status,
        lastActiveAt: n.lastActiveAt
      });
    }
    return r.sort((i, n) => i.healthScore - n.healthScore);
  }, "handler")
});
export {
  p as HEALTH_THRESHOLDS,
  I as computeUserHealth,
  T as listAtRiskUsers
};
//# sourceMappingURL=userHealth.js.map
