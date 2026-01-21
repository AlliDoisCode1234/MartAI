import {
  f as m
} from "./_deps/MF3OI5Q7.js";
import {
  a as o
} from "./_deps/OFY2WAT7.js";
import "./_deps/ZRD5YQUR.js";
import {
  a as i,
  c as d
} from "./_deps/K33OSGN4.js";
import {
  c as s,
  e as g
} from "./_deps/4U34M3I6.js";
import {
  a as n
} from "./_deps/RUVYHBJQ.js";

// convex/users.ts
g();
function u(e) {
  return {
    _id: e._id,
    name: e.name,
    email: e.email,
    role: e.role,
    createdAt: e.createdAt ?? e._creationTime,
    onboardingStatus: e.onboardingStatus
  };
}
n(u, "filterUserFields");
var w = i({
  args: {},
  handler: /* @__PURE__ */ n(async (e) => {
    let t = await o.getUserId(e);
    if (t === null)
      return null;
    let r = await e.db.get(t);
    return r ? {
      _id: r._id,
      name: r.name,
      email: r.email,
      image: r.image,
      role: r.role,
      membershipTier: r.membershipTier,
      createdAt: r.createdAt ?? r._creationTime,
      onboardingStatus: r.onboardingStatus,
      onboardingSteps: r.onboardingSteps,
      // Boolean flag for password (never return actual hash)
      hasPassword: !!r.passwordHash
    } : null;
  }, "handler")
}), I = w, A = d({
  args: {},
  handler: /* @__PURE__ */ n(async (e) => {
    let t = await o.getUserId(e);
    if (t === null)
      throw new Error("Not authenticated");
    let r = await e.db.get(t), a = Date.now(), l = 4320 * 60 * 60 * 1e3, c = {
      onboardingStatus: "completed"
    };
    r?.isBetaUser && !r.betaExpiresAt && (c.betaExpiresAt = a + l), await e.db.patch(t, c);
  }, "handler")
}), S = d({
  args: { userId: s.id("users") },
  handler: /* @__PURE__ */ n(async (e, t) => {
    let r = await o.getUserId(e);
    if (r === null)
      throw new Error("Not authenticated");
    let a = await e.db.get(r);
    if (!a || a.role !== "admin" && a.role !== "super_admin")
      throw new Error("Unauthorized: Admin access required");
    await e.db.patch(t.userId, { onboardingStatus: "in_progress" });
  }, "handler")
}), _ = i({
  args: { userId: s.id("users") },
  handler: /* @__PURE__ */ n(async (e, t) => {
    let r = await o.getUserId(e);
    if (!r)
      throw new Error("Unauthorized: Not logged in");
    let a = await e.db.get(t.userId);
    if (!a) return null;
    if (r === t.userId || await m(e, "admin"))
      return u(a);
    throw new Error("Forbidden: Cannot access other users data");
  }, "handler")
}), y = i({
  args: {},
  handler: /* @__PURE__ */ n(async (e) => {
    let t = await o.getUserId(e);
    if (!t)
      return [];
    let r = await e.db.get(t);
    return !r || r.role !== "admin" && r.role !== "super_admin" ? [] : (await e.db.query("users").collect()).map(u);
  }, "handler")
});
export {
  A as completeOnboarding,
  I as current,
  _ as getById,
  y as listAll,
  w as me,
  S as resetOnboarding
};
//# sourceMappingURL=users.js.map
