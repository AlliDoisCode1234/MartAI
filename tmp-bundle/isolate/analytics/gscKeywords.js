import {
  a as w,
  b as m,
  d as h
} from "../_deps/K33OSGN4.js";
import {
  c as t,
  e as j
} from "../_deps/4U34M3I6.js";
import {
  a as y
} from "../_deps/RUVYHBJQ.js";

// convex/analytics/gscKeywords.ts
j();
var g = h({
  args: {
    projectId: t.id("projects"),
    syncDate: t.number(),
    keyword: t.string(),
    clicks: t.number(),
    impressions: t.number(),
    ctr: t.number(),
    position: t.number()
  },
  handler: /* @__PURE__ */ y(async (c, e) => await c.db.insert("gscKeywordSnapshots", {
    projectId: e.projectId,
    syncDate: e.syncDate,
    keyword: e.keyword,
    clicks: e.clicks,
    impressions: e.impressions,
    ctr: e.ctr,
    position: e.position
  }), "handler")
}), v = w({
  args: {
    projectId: t.id("projects"),
    limit: t.optional(t.number())
  },
  handler: /* @__PURE__ */ y(async (c, e) => {
    let p = await c.db.query("gscKeywordSnapshots").withIndex("by_project_date", (r) => r.eq("projectId", e.projectId)).order("desc").take(e.limit || 100), i = /* @__PURE__ */ new Map();
    for (let r of p)
      i.has(r.keyword) || i.set(r.keyword, r);
    return Array.from(i.values());
  }, "handler")
}), M = w({
  args: {
    projectId: t.id("projects"),
    keyword: t.string(),
    limit: t.optional(t.number())
  },
  handler: /* @__PURE__ */ y(async (c, e) => await c.db.query("gscKeywordSnapshots").withIndex(
    "by_project_keyword",
    (p) => p.eq("projectId", e.projectId).eq("keyword", e.keyword)
  ).order("desc").take(e.limit || 30), "handler")
}), S = m({
  args: {
    projectId: t.id("projects"),
    minImpressions: t.optional(t.number())
  },
  handler: /* @__PURE__ */ y(async (c, e) => {
    let p = await c.db.query("gscKeywordSnapshots").withIndex("by_project_date", (n) => n.eq("projectId", e.projectId)).order("desc").take(500), i = /* @__PURE__ */ new Map();
    for (let n of p)
      i.has(n.keyword) || i.set(n.keyword, n);
    let r = e.minImpressions || 500;
    return Array.from(i.values()).filter(
      (n) => n.position >= 5 && n.position <= 15 && n.impressions >= r
    );
  }, "handler")
}), D = m({
  args: {
    projectId: t.id("projects"),
    currentDate: t.number(),
    previousDate: t.number()
  },
  handler: /* @__PURE__ */ y(async (c, e) => {
    let p = await c.db.query("gscKeywordSnapshots").withIndex("by_project_date", (o) => o.eq("projectId", e.projectId)).filter((o) => o.gte(o.field("syncDate"), e.currentDate - 864e5)).collect(), i = await c.db.query("gscKeywordSnapshots").withIndex("by_project_date", (o) => o.eq("projectId", e.projectId)).filter(
      (o) => o.and(
        o.gte(o.field("syncDate"), e.previousDate - 1440 * 60 * 1e3),
        o.lt(o.field("syncDate"), e.currentDate - 1440 * 60 * 1e3)
      )
    ).collect(), r = new Map(p.map((o) => [o.keyword, o])), n = new Map(i.map((o) => [o.keyword, o])), a = [];
    for (let [o, d] of r) {
      let u = n.get(o);
      if (!u)
        a.push({
          keyword: o,
          currentPosition: d.position,
          previousPosition: null,
          positionChange: 0,
          impressionsChange: d.impressions,
          isNew: !0
        });
      else {
        let l = u.position - d.position, s = d.impressions - u.impressions;
        (Math.abs(l) >= 3 || Math.abs(s) > 100) && a.push({
          keyword: o,
          currentPosition: d.position,
          previousPosition: u.position,
          positionChange: l,
          impressionsChange: s,
          isNew: !1
        });
      }
    }
    return a;
  }, "handler")
}), K = w({
  args: {
    projectId: t.id("projects")
  },
  handler: /* @__PURE__ */ y(async (c, e) => {
    let p = await c.db.query("gscKeywordSnapshots").withIndex("by_project_date", (s) => s.eq("projectId", e.projectId)).order("desc").take(500);
    if (p.length === 0)
      return null;
    let i = /* @__PURE__ */ new Map();
    for (let s of p)
      i.has(s.keyword) || i.set(s.keyword, s);
    let r = Array.from(i.values()), n = 0, a = 0, o = 0;
    for (let s of r)
      n += s.clicks, a += s.impressions, o += s.position;
    let d = a > 0 ? n / a * 100 : 0, u = r.length > 0 ? o / r.length : 0, l = r.sort((s, k) => k.impressions - s.impressions).slice(0, 5).map((s) => ({
      keyword: s.keyword,
      clicks: s.clicks,
      impressions: s.impressions,
      ctr: s.ctr,
      position: s.position
    }));
    return {
      totalClicks: n,
      totalImpressions: a,
      avgCtr: Math.round(d * 100) / 100,
      avgPosition: Math.round(u * 10) / 10,
      topKeywords: l,
      keywordCount: r.length,
      lastSyncDate: p[0]?.syncDate || null
    };
  }, "handler")
});
export {
  K as getGSCDashboardStats,
  D as getKeywordChanges,
  M as getKeywordHistory,
  v as getLatestKeywords,
  S as getQuickWinKeywords,
  g as storeKeywordSnapshot
};
//# sourceMappingURL=gscKeywords.js.map
