import {
  a as _,
  e as C
} from "../_deps/GTU362KY.js";
import {
  a as I,
  c as j
} from "../_deps/K33OSGN4.js";
import {
  c as t,
  e as R
} from "../_deps/4U34M3I6.js";
import {
  a as p
} from "../_deps/RUVYHBJQ.js";

// convex/analytics/analytics.ts
R();
C();
var M = j({
  args: {
    projectId: t.id("projects"),
    date: t.number(),
    // timestamp
    source: t.string(),
    // ga4, gsc
    sessions: t.optional(t.number()),
    clicks: t.optional(t.number()),
    impressions: t.optional(t.number()),
    ctr: t.optional(t.number()),
    avgPosition: t.optional(t.number()),
    leads: t.optional(t.number()),
    revenue: t.optional(t.number()),
    // Expanded GA4 metrics
    pageViews: t.optional(t.number()),
    bounceRate: t.optional(t.number()),
    avgSessionDuration: t.optional(t.number()),
    newUsers: t.optional(t.number())
  },
  handler: /* @__PURE__ */ p(async (s, e) => {
    let { projectId: d, date: y, source: a, ...u } = e, m = await s.db.query("analyticsData").withIndex(
      "by_project_date_source",
      (D) => D.eq("projectId", d).eq("date", y).eq("source", a)
    ).first(), v = {
      projectId: d,
      date: y,
      source: a,
      ...u,
      updatedAt: Date.now()
    };
    return m ? await s.db.patch(m._id, v) : await s.db.insert("analyticsData", {
      ...v,
      createdAt: Date.now()
    });
  }, "handler")
}), S = I({
  args: {
    projectId: t.id("projects"),
    startDate: t.number(),
    endDate: t.number(),
    source: t.optional(t.string())
  },
  handler: /* @__PURE__ */ p(async (s, e) => (await s.db.query("analyticsData").withIndex("by_project_date", (a) => a.eq("projectId", e.projectId)).collect()).filter(
    (a) => a.date >= e.startDate && a.date <= e.endDate && (!e.source || a.source === e.source)
  ).sort((a, u) => a.date - u.date), "handler")
}), B = I({
  args: {
    projectId: t.id("projects"),
    startDate: t.number(),
    endDate: t.number()
  },
  handler: /* @__PURE__ */ p(async (s, e) => {
    let y = (await s.db.query("analyticsData").withIndex("by_project_date", (n) => n.eq("projectId", e.projectId)).collect()).filter((n) => n.date >= e.startDate && n.date <= e.endDate), a = y.filter((n) => n.source === "ga4"), u = y.filter((n) => n.source === "gsc"), m = a.reduce((n, i) => n + (i.sessions || 0), 0), v = u.reduce((n, i) => n + (i.clicks || 0), 0), D = u.reduce((n, i) => n + (i.impressions || 0), 0), o = a.reduce((n, i) => n + (i.leads || 0), 0), g = a.reduce((n, i) => n + (i.revenue || 0), 0), b = D > 0 ? v / D * 100 : 0, r = u.length > 0 ? u.reduce((n, i) => n + (i.avgPosition || 0), 0) / u.length : 0, h = m > 0 ? o / m * 100 : 0;
    return {
      sessions: m,
      clicks: v,
      impressions: D,
      ctr: b,
      avgPosition: r,
      leads: o,
      revenue: g,
      conversionRate: h
    };
  }, "handler")
}), L = I({
  args: {
    projectId: t.id("projects"),
    startDate: t.number(),
    endDate: t.number()
  },
  handler: /* @__PURE__ */ p(async (s, e) => {
    let d = e.endDate - e.startDate, y = e.startDate - d, a = e.startDate - 1, u = await s.db.query("analyticsData").withIndex("by_project_date", (r) => r.eq("projectId", e.projectId)).collect(), m = u.filter((r) => r.date >= e.startDate && r.date <= e.endDate), v = u.filter((r) => r.date >= y && r.date <= a), D = /* @__PURE__ */ p((r) => {
      let h = r.filter((c) => c.source === "ga4"), n = r.filter((c) => c.source === "gsc"), i = h.reduce((c, l) => c + (l.sessions || 0), 0), w = n.reduce((c, l) => c + (l.clicks || 0), 0), f = n.reduce((c, l) => c + (l.impressions || 0), 0), q = h.reduce((c, l) => c + (l.leads || 0), 0), k = h.reduce((c, l) => c + (l.revenue || 0), 0), P = f > 0 ? w / f * 100 : 0, x = n.length > 0 ? n.reduce((c, l) => c + (l.avgPosition || 0), 0) / n.length : 0, A = i > 0 ? q / i * 100 : 0;
      return { sessions: i, clicks: w, ctr: P, avgPosition: x, leads: q, revenue: k, conversionRate: A };
    }, "calculateMetrics"), o = D(m), g = D(v), b = /* @__PURE__ */ p((r, h) => h === 0 ? r > 0 ? 100 : 0 : (r - h) / h * 100, "calculateChange");
    return {
      sessions: {
        value: o.sessions,
        change: b(o.sessions, g.sessions)
      },
      clicks: { value: o.clicks, change: b(o.clicks, g.clicks) },
      ctr: { value: o.ctr, change: b(o.ctr, g.ctr) },
      avgPosition: {
        value: o.avgPosition,
        change: b(o.avgPosition, g.avgPosition)
      },
      leads: { value: o.leads, change: b(o.leads, g.leads) },
      revenue: {
        value: o.revenue,
        change: b(o.revenue, g.revenue)
      },
      conversionRate: {
        value: o.conversionRate,
        change: b(o.conversionRate, g.conversionRate)
      }
    };
  }, "handler")
}), U = j({
  args: {
    projectId: t.id("projects"),
    type: t.string(),
    // top_gainer, underperformer, quick_win
    title: t.string(),
    description: t.string(),
    action: t.optional(t.string()),
    metadata: t.optional(t.any())
  },
  handler: /* @__PURE__ */ p(async (s, e) => await s.db.insert("insights", {
    projectId: e.projectId,
    type: e.type,
    title: e.title,
    description: e.description,
    action: e.action,
    metadata: e.metadata,
    status: "active",
    createdAt: Date.now(),
    updatedAt: Date.now()
  }), "handler")
}), V = I({
  args: {
    projectId: t.id("projects"),
    type: t.optional(t.string())
  },
  handler: /* @__PURE__ */ p(async (s, e) => (await s.db.query("insights").withIndex("by_project", (a) => a.eq("projectId", e.projectId)).collect()).filter((a) => !e.type || a.type === e.type).filter((a) => a.status === "active").sort((a, u) => u.createdAt - a.createdAt), "handler")
}), $ = j({
  args: {
    insightId: t.id("insights")
  },
  handler: /* @__PURE__ */ p(async (s, e) => {
    let d = await s.db.get(e.insightId);
    if (!d) throw new Error("Insight not found");
    ["keyword_opportunity", "quick_win", "top_gainer"].includes(d.type) && await s.runMutation(_["content/briefs"].createBrief, {
      projectId: d.projectId,
      title: `Insight: ${d.title}`,
      scheduledDate: Date.now() + 10080 * 60 * 1e3,
      // Tentative date +1 week
      status: "planned",
      metaTitle: d.title,
      metaDescription: d.description
      // planId is optional, creating an "Unplanned Brief"
    }), await s.db.patch(e.insightId, {
      status: "applied",
      updatedAt: Date.now()
    });
  }, "handler")
});
export {
  $ as applyInsight,
  S as getAnalyticsData,
  L as getDashboardKPIs,
  V as getInsights,
  B as getKPIs,
  M as storeAnalyticsData,
  U as storeInsight
};
//# sourceMappingURL=analytics.js.map
