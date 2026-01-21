import {
  a as l
} from "../_deps/OFY2WAT7.js";
import "../_deps/ZRD5YQUR.js";
import {
  a as g,
  c as u
} from "../_deps/K33OSGN4.js";
import {
  c as e,
  e as I
} from "../_deps/4U34M3I6.js";
import {
  a as d
} from "../_deps/RUVYHBJQ.js";

// convex/organizations/organizations.ts
I();
var b = u({
  args: {
    name: e.string(),
    slug: e.string(),
    logoUrl: e.optional(e.string()),
    plan: e.optional(
      e.union(
        e.literal("free"),
        e.literal("starter"),
        e.literal("growth"),
        e.literal("pro"),
        e.literal("enterprise")
      )
    )
  },
  handler: /* @__PURE__ */ d(async (n, t) => {
    let a = await l.getUserId(n);
    if (!a)
      throw new Error("Unauthorized");
    if (await n.db.query("organizations").withIndex("by_slug", (o) => o.eq("slug", t.slug)).first())
      throw new Error("Organization slug already exists");
    let r = Date.now(), i = await n.db.insert("organizations", {
      name: t.name,
      slug: t.slug,
      logoUrl: t.logoUrl,
      plan: t.plan || "free",
      maxProjects: t.plan === "enterprise" ? 100 : t.plan === "pro" ? 20 : 5,
      maxMembers: t.plan === "enterprise" ? 50 : t.plan === "pro" ? 10 : 3,
      ownerId: a,
      createdAt: r,
      updatedAt: r
    });
    return await n.db.insert("teamMembers", {
      userId: a,
      organizationId: i,
      role: "owner",
      status: "active",
      joinedAt: r,
      createdAt: r,
      updatedAt: r
    }), { organizationId: i };
  }, "handler")
}), f = g({
  args: { organizationId: e.id("organizations") },
  handler: /* @__PURE__ */ d(async (n, t) => await n.db.get(t.organizationId), "handler")
}), h = g({
  args: { slug: e.string() },
  handler: /* @__PURE__ */ d(async (n, t) => await n.db.query("organizations").withIndex("by_slug", (a) => a.eq("slug", t.slug)).first(), "handler")
}), y = g({
  args: {},
  handler: /* @__PURE__ */ d(async (n) => {
    let t = await l.getUserId(n);
    if (!t)
      return [];
    let a = await n.db.query("teamMembers").withIndex("by_user", (r) => r.eq("userId", t)).filter((r) => r.eq(r.field("status"), "active")).collect();
    return (await Promise.all(
      a.map(async (r) => {
        let i = await n.db.get(r.organizationId);
        return i ? { ...i, role: r.role } : null;
      })
    )).filter(Boolean);
  }, "handler")
}), q = u({
  args: {
    organizationId: e.id("organizations"),
    name: e.optional(e.string()),
    logoUrl: e.optional(e.string()),
    billingEmail: e.optional(e.string())
  },
  handler: /* @__PURE__ */ d(async (n, t) => {
    let a = await l.getUserId(n);
    if (!a)
      throw new Error("Unauthorized");
    let s = await n.db.query("teamMembers").withIndex(
      "by_user_org",
      (w) => w.eq("userId", a).eq("organizationId", t.organizationId)
    ).first();
    if (!s || !["owner", "admin"].includes(s.role))
      throw new Error("Insufficient permissions");
    let { organizationId: r, ...i } = t, o = { updatedAt: Date.now() };
    for (let [w, c] of Object.entries(i))
      c !== void 0 && (o[w] = c);
    return await n.db.patch(r, o), { success: !0 };
  }, "handler")
}), O = u({
  args: { organizationId: e.id("organizations") },
  handler: /* @__PURE__ */ d(async (n, t) => {
    let a = await l.getUserId(n);
    if (!a)
      throw new Error("Unauthorized");
    let s = await n.db.get(t.organizationId);
    if (!s)
      throw new Error("Organization not found");
    if (s.ownerId !== a)
      throw new Error("Only the owner can delete an organization");
    let r = await n.db.query("teamMembers").withIndex("by_org", (o) => o.eq("organizationId", t.organizationId)).collect();
    for (let o of r)
      await n.db.delete(o._id);
    let i = await n.db.query("organizationInvitations").withIndex("by_org", (o) => o.eq("organizationId", t.organizationId)).collect();
    for (let o of i)
      await n.db.delete(o._id);
    return await n.db.delete(t.organizationId), { success: !0 };
  }, "handler")
});
export {
  b as createOrganization,
  O as deleteOrganization,
  y as getMyOrganizations,
  f as getOrganizationById,
  h as getOrganizationBySlug,
  q as updateOrganization
};
//# sourceMappingURL=organizations.js.map
