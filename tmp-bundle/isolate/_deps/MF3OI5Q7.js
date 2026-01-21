import {
  a
} from "./OFY2WAT7.js";
import {
  a as s
} from "./RUVYHBJQ.js";

// convex/lib/rbac.ts
var c = {
  super_admin: 100,
  admin: 80,
  sales: 60,
  // Can provision/view but not change system config
  user: 50,
  viewer: 10
}, l = {
  owner: 100,
  admin: 80,
  editor: 50,
  viewer: 10
};
async function d(e, r) {
  let o = await a.getUserId(e);
  if (!o)
    throw new Error("Unauthorized: Not logged in");
  let t = await e.db.get(o);
  if (!t)
    throw new Error("Unauthorized: User not found");
  let n = t.role || "viewer", i = c[n] || 0, u = c[r];
  if (i < u)
    throw new Error(`Forbidden: Requires ${r} role or higher`);
  return { userId: o, role: n };
}
s(d, "requireAdminRole");
async function m(e, r, o) {
  let t = await a.getUserId(e);
  if (!t)
    throw new Error("Unauthorized: Not logged in");
  let n = await e.db.query("teamMembers").withIndex("by_user_org", (w) => w.eq("userId", t).eq("organizationId", r)).first();
  if (!n || n.status !== "active")
    throw new Error("Forbidden: Not a member of this organization");
  let i = n.role, u = l[i] || 0, x = l[o];
  if (u < x)
    throw new Error(`Forbidden: Requires ${o} role or higher in this organization`);
  return { userId: t, role: i, membership: n };
}
s(m, "requireOrgRole");
async function I(e, r, o = "viewer") {
  let t = await a.getUserId(e);
  if (!t)
    throw new Error("Unauthorized: Not logged in");
  let n = await e.db.get(r);
  if (!n)
    throw new Error("Not found: Project does not exist");
  if (n.userId === t)
    return { userId: t, project: n, role: "owner" };
  if (n.organizationId) {
    let { role: i } = await m(e, n.organizationId, o);
    return { userId: t, project: n, role: i };
  }
  throw new Error("Forbidden: No access to this project");
}
s(I, "requireProjectAccess");
async function f(e) {
  let { userId: r } = await d(e, "super_admin");
  return r;
}
s(f, "requireSuperAdmin");
async function g(e) {
  let { userId: r } = await d(e, "admin");
  return r;
}
s(g, "requireAdmin");
async function C(e, r) {
  try {
    return await d(e, r);
  } catch {
    return null;
  }
}
s(C, "checkAdminRole");
async function p(e, r, o) {
  try {
    return await m(e, r, o);
  } catch {
    return null;
  }
}
s(p, "checkOrgRole");
async function h(e, r, o) {
  let t = await e.db.query("subscriptions").withIndex("by_user", (u) => u.eq("userId", r)).first();
  if (!t || t.status !== "active")
    return !1;
  let i = t.features?.[o];
  return i === !0 || typeof i == "number" && i > 0;
}
s(h, "canAccessFeature");
async function b(e, r) {
  let o = await e.db.query("subscriptions").withIndex("by_user", (t) => t.eq("userId", r)).first();
  return !o || o.status !== "active" ? null : o.planTier;
}
s(b, "getSubscriptionTier");

export {
  d as a,
  m as b,
  I as c,
  f as d,
  g as e,
  C as f,
  p as g,
  h,
  b as i
};
//# sourceMappingURL=MF3OI5Q7.js.map
