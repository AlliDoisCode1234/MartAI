import {
  a as v
} from "../_deps/HXEST5WA.js";
import {
  d as A
} from "../_deps/MF3OI5Q7.js";
import "../_deps/OFY2WAT7.js";
import "../_deps/ZRD5YQUR.js";
import {
  a as m
} from "../_deps/K33OSGN4.js";
import "../_deps/4U34M3I6.js";
import {
  a as p
} from "../_deps/RUVYHBJQ.js";

// convex/subscriptions/subscriptionMetrics.ts
var I = m({
  args: {},
  handler: /* @__PURE__ */ p(async (a) => {
    await A(a);
    let s = Date.now(), n = s - 720 * 60 * 60 * 1e3, M = s - 1440 * 60 * 60 * 1e3, o = await a.db.query("subscriptions").collect(), e = o.filter((t) => t.status === "active"), c = e.reduce((t, r) => {
      let f = r.planTier?.toLowerCase() || "solo", g = v[f]?.priceMonthly ?? 0, w = r.billingCycle === "annual" ? g * 0.83 : g;
      return t + w;
    }, 0), i = {};
    for (let t of e) {
      let r = t.planTier || "unknown";
      i[r] = (i[r] || 0) + 1;
    }
    let l = o.filter(
      (t) => t.status === "cancelled" && t.cancelAt && t.cancelAt > n
    ), u = e.filter(
      (t) => t.createdAt && t.createdAt > n
    ), h = o.filter(
      (t) => t.createdAt && t.createdAt <= n && t.createdAt > M
    ).length || 1, y = (u.length - h) / h * 100, d = (e.length > 0 ? c / e.length : 0) * 12;
    return {
      mrr: c,
      mrrFormatted: `$${c.toLocaleString()}`,
      activeCount: e.length,
      tierBreakdown: Object.entries(i).map(([t, r]) => ({
        tier: t,
        count: r,
        percentage: Math.round(r / e.length * 100) || 0
      })),
      newThisMonth: u.length,
      churnedThisMonth: l.length,
      churnRate: e.length > 0 ? Math.round(l.length / e.length * 100 * 10) / 10 : 0,
      growthRate: Math.round(y * 10) / 10,
      estimatedLtv: Math.round(d),
      ltvFormatted: `$${Math.round(d).toLocaleString()}`
    };
  }, "handler")
});
export {
  I as getSubscriptionMetrics
};
//# sourceMappingURL=subscriptionMetrics.js.map
