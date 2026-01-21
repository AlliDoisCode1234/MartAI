import {
  e as l
} from "../_deps/MF3OI5Q7.js";
import "../_deps/OFY2WAT7.js";
import "../_deps/ZRD5YQUR.js";
import {
  a as o
} from "../_deps/K33OSGN4.js";
import "../_deps/4U34M3I6.js";
import {
  a as c
} from "../_deps/RUVYHBJQ.js";

// convex/admin/dashboard.ts
var U = o({
  args: {},
  handler: /* @__PURE__ */ c(async (n) => {
    await l(n);
    let s = Date.now(), m = s - 720 * 60 * 60 * 1e3, d = s - 10080 * 60 * 1e3, e = await n.db.query("users").collect(), p = e.length, _ = e.filter(
      (t) => t._creationTime && t._creationTime > d
    ).length, u = e.filter(
      (t) => t.lastActiveAt && t.lastActiveAt > m
    ).length, y = (await n.db.query("subscriptions").collect()).filter((t) => t.status === "active"), v = await n.db.query("analyticsEvents").withIndex("by_timestamp").order("desc").take(10), b = e.filter((t) => t._creationTime).sort((t, i) => (i._creationTime ?? 0) - (t._creationTime ?? 0)).slice(0, 5).map((t) => ({
      _id: t._id,
      name: t.name || "Unknown",
      email: t.email,
      createdAt: t._creationTime
    })), a = [];
    for (let t = 6; t >= 0; t--) {
      let i = s - t * 24 * 60 * 60 * 1e3, g = i + 1440 * 60 * 1e3, h = e.filter(
        (r) => r._creationTime && r._creationTime >= i && r._creationTime < g
      ).length, T = new Date(i).toISOString().slice(0, 10);
      a.push({ date: T, count: h });
    }
    return {
      totalUsers: p,
      newUsersThisWeek: _,
      activeUsers: u,
      activeSubscriptions: y.length,
      recentActivity: v.map((t) => ({
        _id: t._id,
        event: t.event,
        timestamp: t.timestamp,
        url: t.url
      })),
      recentUsers: b,
      userTrend: a
    };
  }, "handler")
});
export {
  U as getAdminDashboardMetrics
};
//# sourceMappingURL=dashboard.js.map
