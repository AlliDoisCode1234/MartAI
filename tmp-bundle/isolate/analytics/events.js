import {
  a as d
} from "../_deps/OFY2WAT7.js";
import "../_deps/ZRD5YQUR.js";
import {
  a as c,
  c as I
} from "../_deps/K33OSGN4.js";
import {
  c as e,
  e as w
} from "../_deps/4U34M3I6.js";
import {
  a as u
} from "../_deps/RUVYHBJQ.js";

// convex/analytics/events.ts
w();
var D = I({
  args: {
    sessionId: e.optional(e.string()),
    event: e.string(),
    trackId: e.optional(e.string()),
    properties: e.optional(e.any()),
    url: e.optional(e.string()),
    referrer: e.optional(e.string()),
    userAgent: e.optional(e.string())
  },
  handler: /* @__PURE__ */ u(async (r, t) => {
    let s = await d.getUserId(r);
    return await r.db.insert("analyticsEvents", {
      userId: s ?? void 0,
      sessionId: t.sessionId,
      event: t.event,
      trackId: t.trackId,
      properties: t.properties,
      url: t.url,
      referrer: t.referrer,
      userAgent: t.userAgent,
      timestamp: Date.now()
    }), { success: !0 };
  }, "handler")
}), h = c({
  args: {
    userId: e.id("users"),
    limit: e.optional(e.number())
  },
  handler: /* @__PURE__ */ u(async (r, t) => {
    let s = await d.getUserId(r);
    if (!s) return [];
    let i = await r.db.get(s);
    return !i || i.role !== "admin" && i.role !== "super_admin" ? [] : await r.db.query("analyticsEvents").withIndex("by_user", (o) => o.eq("userId", t.userId)).order("desc").take(t.limit ?? 100);
  }, "handler")
}), E = c({
  args: {
    startDate: e.optional(e.number()),
    endDate: e.optional(e.number())
  },
  handler: /* @__PURE__ */ u(async (r, t) => {
    let s = await d.getUserId(r);
    if (!s) return null;
    let i = await r.db.get(s);
    if (!i || i.role !== "admin" && i.role !== "super_admin")
      return null;
    let l = Date.now(), o = t.startDate ?? l - 720 * 60 * 60 * 1e3, m = t.endDate ?? l, a = await r.db.query("analyticsEvents").withIndex("by_timestamp").filter(
      (n) => n.and(n.gte(n.field("timestamp"), o), n.lte(n.field("timestamp"), m))
    ).collect(), p = {};
    for (let n of a)
      p[n.event] = (p[n.event] || 0) + 1;
    let v = new Set(a.map((n) => n.sessionId).filter(Boolean)), f = new Set(
      a.map((n) => n.userId).filter(Boolean).map(String)
    );
    return {
      totalEvents: a.length,
      uniqueSessions: v.size,
      uniqueUsers: f.size,
      eventCounts: p,
      dateRange: { startDate: o, endDate: m }
    };
  }, "handler")
});
export {
  h as getEventsByUser,
  E as getFunnelMetrics,
  D as trackEvent
};
//# sourceMappingURL=events.js.map
