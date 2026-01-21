import {
  d as y
} from "../_deps/MF3OI5Q7.js";
import {
  a as b
} from "../_deps/OFY2WAT7.js";
import "../_deps/ZRD5YQUR.js";
import {
  a as g,
  c as w
} from "../_deps/K33OSGN4.js";
import {
  c as e,
  e as E
} from "../_deps/4U34M3I6.js";
import {
  a as v
} from "../_deps/RUVYHBJQ.js";

// convex/analytics/eventTracking.ts
E();
var C = w({
  args: {
    event: e.string(),
    properties: e.optional(e.any()),
    sessionId: e.optional(e.string()),
    url: e.optional(e.string()),
    referrer: e.optional(e.string()),
    userAgent: e.optional(e.string()),
    trackId: e.optional(e.string())
  },
  handler: /* @__PURE__ */ v(async (s, n) => {
    let a = await b.getUserId(s);
    return await s.db.insert("analyticsEvents", {
      userId: a ?? void 0,
      sessionId: n.sessionId,
      event: n.event,
      properties: n.properties,
      url: n.url,
      referrer: n.referrer,
      userAgent: n.userAgent,
      trackId: n.trackId,
      timestamp: Date.now()
    });
  }, "handler")
}), O = g({
  args: {
    startDate: e.optional(e.number()),
    endDate: e.optional(e.number())
  },
  handler: /* @__PURE__ */ v(async (s, n) => {
    await y(s);
    let a = Date.now(), p = n.startDate || a - 720 * 60 * 60 * 1e3, i = n.endDate || a, l = await s.db.query("analyticsEvents").withIndex("by_timestamp").filter(
      (t) => t.and(t.gte(t.field("timestamp"), p), t.lte(t.field("timestamp"), i))
    ).collect(), c = {}, r = {};
    for (let t of l)
      c[t.event] = (c[t.event] || 0) + 1, t.userId && (r[t.event] || (r[t.event] = /* @__PURE__ */ new Set()), r[t.event].add(t.userId));
    let u = [
      "signup_started",
      "signup_completed",
      "project_created",
      "gsc_connected",
      "keywords_imported",
      "clusters_generated",
      "brief_created",
      "content_published"
    ];
    return {
      funnel: u.map((t, d) => {
        let m = c[t] || 0, I = r[t]?.size || 0, f = d > 0 ? c[u[d - 1]] || 1 : m, h = f > 0 ? m / f * 100 : 0;
        return {
          step: t,
          label: t.replace(/_/g, " ").replace(/\b\w/g, (D) => D.toUpperCase()),
          count: m,
          uniqueUsers: I,
          conversionRate: Math.round(h * 10) / 10
        };
      }),
      totalEvents: l.length,
      dateRange: { startDate: p, endDate: i }
    };
  }, "handler")
}), A = g({
  args: {
    event: e.optional(e.string()),
    groupBy: e.optional(e.union(e.literal("day"), e.literal("week"), e.literal("hour"))),
    days: e.optional(e.number())
  },
  handler: /* @__PURE__ */ v(async (s, n) => {
    await y(s);
    let a = n.days || 30, p = Date.now() - a * 24 * 60 * 60 * 1e3, i = s.db.query("analyticsEvents").withIndex("by_timestamp").filter((o) => o.gte(o.field("timestamp"), p));
    n.event && (i = i.filter((o) => o.eq(o.field("event"), n.event)));
    let l = await i.collect(), c = {}, r = n.groupBy || "day";
    for (let o of l) {
      let t = new Date(o.timestamp), d;
      if (r === "hour")
        d = `${t.toISOString().slice(0, 13)}:00`;
      else if (r === "week") {
        let m = new Date(t);
        m.setDate(t.getDate() - t.getDay()), d = m.toISOString().slice(0, 10);
      } else
        d = t.toISOString().slice(0, 10);
      c[d] = (c[d] || 0) + 1;
    }
    return { trend: Object.entries(c).sort(([o], [t]) => o.localeCompare(t)).map(([o, t]) => ({ date: o, count: t })), totalEvents: l.length };
  }, "handler")
}), U = g({
  args: {
    limit: e.optional(e.number()),
    days: e.optional(e.number())
  },
  handler: /* @__PURE__ */ v(async (s, n) => {
    await y(s);
    let a = n.days || 7, p = Date.now() - a * 24 * 60 * 60 * 1e3, i = await s.db.query("analyticsEvents").withIndex("by_timestamp").filter((r) => r.gte(r.field("timestamp"), p)).collect(), l = {};
    for (let r of i)
      l[r.event] = (l[r.event] || 0) + 1;
    return { topEvents: Object.entries(l).sort(([, r], [, u]) => u - r).slice(0, n.limit || 10).map(([r, u]) => ({ event: r, count: u })), totalEvents: i.length };
  }, "handler")
}), j = g({
  args: {
    limit: e.optional(e.number())
  },
  handler: /* @__PURE__ */ v(async (s, n) => (await y(s), await s.db.query("analyticsEvents").withIndex("by_timestamp").order("desc").take(n.limit || 50)), "handler")
});
export {
  A as getEventTrends,
  O as getFunnelMetrics,
  j as getRecentEvents,
  U as getTopEvents,
  C as trackEvent
};
//# sourceMappingURL=eventTracking.js.map
