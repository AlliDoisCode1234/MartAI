import {
  e as d
} from "./_deps/MF3OI5Q7.js";
import "./_deps/OFY2WAT7.js";
import "./_deps/ZRD5YQUR.js";
import {
  a as l
} from "./_deps/K33OSGN4.js";
import {
  c as o,
  e as m
} from "./_deps/4U34M3I6.js";
import {
  a as n
} from "./_deps/RUVYHBJQ.js";

// convex/admin.ts
m();
function u(t) {
  return {
    _id: t._id,
    name: t.name,
    email: t.email,
    role: t.role,
    createdAt: t.createdAt ?? t._creationTime,
    onboardingStatus: t.onboardingStatus
  };
}
n(u, "filterUserFields");
var w = l({
  args: {},
  handler: /* @__PURE__ */ n(async (t) => {
    await d(t);
    let i = await t.db.query("users").order("desc").collect();
    return await Promise.all(
      i.map(async (e) => {
        let s = await t.db.query("subscriptions").withIndex("by_user", (a) => a.eq("userId", e._id)).first();
        return {
          ...u(e),
          subscription: s ? {
            planTier: s.planTier,
            status: s.status
          } : null
        };
      })
    );
  }, "handler")
}), g = l({
  args: { userId: o.id("users") },
  handler: /* @__PURE__ */ n(async (t, i) => {
    await d(t);
    let r = await t.db.get(i.userId);
    if (!r) return null;
    let e = await t.db.query("subscriptions").withIndex("by_user", (s) => s.eq("userId", r._id)).first();
    return {
      ...u(r),
      subscription: e ? {
        planTier: e.planTier,
        status: e.status
      } : null
    };
  }, "handler")
}), h = l({
  args: { limit: o.optional(o.number()) },
  handler: /* @__PURE__ */ n(async (t, i) => {
    await d(t);
    let r = i.limit ?? 100, e = await t.db.query("keywords").order("desc").take(r);
    return await Promise.all(
      e.map(async (a) => {
        let c = a.projectId ? await t.db.get(a.projectId) : null;
        return {
          ...a,
          clientName: c?.name || "Unknown Project"
        };
      })
    );
  }, "handler")
});
export {
  h as getAllKeywords,
  w as getAllUsers,
  g as getUser
};
//# sourceMappingURL=admin.js.map
