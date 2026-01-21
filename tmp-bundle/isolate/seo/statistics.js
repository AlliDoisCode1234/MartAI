import {
  a as o,
  c as a
} from "../_deps/K33OSGN4.js";
import {
  c as t,
  e as s
} from "../_deps/4U34M3I6.js";
import {
  a as r
} from "../_deps/RUVYHBJQ.js";

// convex/seo/statistics.ts
s();
var p = a({
  args: {
    clientId: t.id("clients"),
    organicTraffic: t.optional(t.number()),
    organicKeywords: t.optional(t.number()),
    backlinks: t.optional(t.number()),
    referringDomains: t.optional(t.number()),
    avgPosition: t.optional(t.number()),
    clickThroughRate: t.optional(t.number()),
    impressions: t.optional(t.number()),
    periodStart: t.number(),
    periodEnd: t.number()
  },
  handler: /* @__PURE__ */ r(async (n, i) => await n.db.insert("seoStatistics", {
    clientId: i.clientId,
    organicTraffic: i.organicTraffic,
    organicKeywords: i.organicKeywords,
    backlinks: i.backlinks,
    referringDomains: i.referringDomains,
    avgPosition: i.avgPosition,
    clickThroughRate: i.clickThroughRate,
    impressions: i.impressions,
    periodStart: i.periodStart,
    periodEnd: i.periodEnd,
    createdAt: Date.now()
  }), "handler")
}), u = o({
  args: { clientId: t.id("clients") },
  handler: /* @__PURE__ */ r(async (n, i) => (await n.db.query("seoStatistics").withIndex("by_client", (e) => e.eq("clientId", i.clientId)).order("desc").take(1))[0] || null, "handler")
}), m = o({
  args: {
    clientId: t.id("clients"),
    periodStart: t.number(),
    periodEnd: t.number()
  },
  handler: /* @__PURE__ */ r(async (n, i) => (await n.db.query("seoStatistics").withIndex("by_client", (e) => e.eq("clientId", i.clientId)).collect()).filter(
    (e) => e.periodStart >= i.periodStart && e.periodEnd <= i.periodEnd
  ), "handler")
});
export {
  u as getLatestStatistics,
  m as getStatisticsByPeriod,
  p as upsertStatistics
};
//# sourceMappingURL=statistics.js.map
