import {
  d as w
} from "../_deps/ZRD5YQUR.js";
import {
  a as u,
  c as l
} from "../_deps/K33OSGN4.js";
import {
  c as d,
  e as f
} from "../_deps/4U34M3I6.js";
import {
  a as m
} from "../_deps/RUVYHBJQ.js";

// convex/teams/teams.ts
f();
var b = [
  "happy",
  "clever",
  "swift",
  "bright",
  "brave",
  "calm",
  "bold",
  "eager",
  "fancy",
  "gentle",
  "jolly",
  "keen",
  "lively",
  "merry",
  "noble",
  "proud",
  "quick",
  "sharp",
  "witty",
  "zesty",
  "cosmic",
  "stellar",
  "lunar",
  "solar"
], I = [
  "lemming",
  "falcon",
  "otter",
  "panda",
  "koala",
  "dolphin",
  "phoenix",
  "tiger",
  "eagle",
  "wolf",
  "bear",
  "fox",
  "owl",
  "hawk",
  "raven",
  "lynx",
  "jaguar",
  "panther",
  "cheetah",
  "leopard",
  "griffin",
  "dragon"
];
function c() {
  let e = b[Math.floor(Math.random() * b.length)], r = I[Math.floor(Math.random() * I.length)], t = Math.floor(Math.random() * 9e3) + 1e3;
  return `${e}-${r}-${t}`;
}
m(c, "generateSlug");
var M = u({
  args: {},
  handler: /* @__PURE__ */ m(async (e) => {
    let r = await w(e);
    if (!r) return null;
    let t = await e.db.get(r);
    return t?.organizationId ? e.db.get(t.organizationId) : null;
  }, "handler")
}), q = u({
  args: { organizationId: d.id("organizations") },
  handler: /* @__PURE__ */ m(async (e, r) => {
    let t = await w(e);
    if (!t) throw new Error("Not authenticated");
    if (!await e.db.query("teamMembers").withIndex(
      "by_user_org",
      (n) => n.eq("userId", t).eq("organizationId", r.organizationId)
    ).first())
      throw new Error("Not a member of this organization");
    let a = await e.db.query("teamMembers").withIndex("by_org", (n) => n.eq("organizationId", r.organizationId)).filter((n) => n.eq(n.field("status"), "active")).collect();
    return await Promise.all(
      a.map(async (n) => {
        let g = await e.db.get(n.userId);
        return {
          ...n,
          user: g ? {
            id: g._id,
            name: g.name,
            email: g.email,
            image: g.image
          } : null
        };
      })
    );
  }, "handler")
}), E = u({
  args: { organizationId: d.id("organizations") },
  handler: /* @__PURE__ */ m(async (e, r) => {
    if (!await w(e)) throw new Error("Not authenticated");
    let o = await e.db.get(r.organizationId);
    if (!o) throw new Error("Organization not found");
    let a = await e.db.get(o.ownerId), i = 1;
    a?.membershipTier === "growth" ? i = 3 : a?.membershipTier === "enterprise" && (i = o.seatsPurchased ?? o.maxMembers ?? 999);
    let n = await e.db.query("teamMembers").withIndex("by_org", (s) => s.eq("organizationId", r.organizationId)).filter((s) => s.eq(s.field("status"), "active")).collect(), g = await e.db.query("organizationInvitations").withIndex("by_org", (s) => s.eq("organizationId", r.organizationId)).filter((s) => s.eq(s.field("status"), "pending")).collect();
    return {
      used: n.length,
      pending: g.length,
      max: i,
      remaining: i - n.length - g.length
    };
  }, "handler")
}), v = l({
  args: {
    name: d.optional(d.string())
  },
  handler: /* @__PURE__ */ m(async (e, r) => {
    let t = await w(e);
    if (!t) throw new Error("Not authenticated");
    let o = await e.db.get(t);
    if (o?.organizationId)
      return o.organizationId;
    let a = c(), i = await e.db.query("organizations").withIndex("by_slug", (h) => h.eq("slug", a)).first();
    for (; i; )
      a = c(), i = await e.db.query("organizations").withIndex("by_slug", (h) => h.eq("slug", a)).first();
    let n = Date.now(), g = 1;
    o?.membershipTier === "growth" ? g = 3 : o?.membershipTier === "enterprise" && (g = 999);
    let s = await e.db.insert("organizations", {
      name: r.name || a,
      slug: a,
      plan: o?.membershipTier || "starter",
      maxMembers: g,
      ownerId: t,
      createdAt: n,
      updatedAt: n
    });
    return await e.db.insert("teamMembers", {
      userId: t,
      organizationId: s,
      role: "owner",
      status: "active",
      joinedAt: n,
      createdAt: n,
      updatedAt: n
    }), await e.db.patch(t, { organizationId: s }), s;
  }, "handler")
}), A = l({
  args: {},
  handler: /* @__PURE__ */ m(async (e) => {
    let r = await w(e);
    if (!r) throw new Error("Not authenticated");
    let t = await e.db.get(r);
    if (!t?.organizationId) throw new Error("No organization found");
    let o = await e.db.get(t.organizationId);
    if (!o || o.ownerId !== r)
      throw new Error("Only the organization owner can sync seats");
    let a = 1;
    return t.membershipTier === "growth" ? a = 3 : t.membershipTier === "enterprise" && (a = 999), await e.db.patch(t.organizationId, {
      plan: t.membershipTier || "starter",
      maxMembers: a,
      updatedAt: Date.now()
    }), { success: !0, maxMembers: a };
  }, "handler")
}), _ = l({
  args: {
    organizationId: d.id("organizations"),
    name: d.string()
  },
  handler: /* @__PURE__ */ m(async (e, r) => {
    let t = await w(e);
    if (!t) throw new Error("Not authenticated");
    let o = await e.db.query("teamMembers").withIndex(
      "by_user_org",
      (n) => n.eq("userId", t).eq("organizationId", r.organizationId)
    ).first();
    if (!o || o.role !== "owner")
      throw new Error("Only the owner can update organization name");
    let a = await e.db.get(r.organizationId);
    if (!a) throw new Error("Organization not found");
    let i = a.name;
    return await e.db.patch(r.organizationId, {
      name: r.name,
      updatedAt: Date.now()
    }), await e.db.insert("teamAuditLogs", {
      organizationId: r.organizationId,
      actorId: t,
      action: "org_name_changed",
      details: { previousName: i, newName: r.name },
      createdAt: Date.now()
    }), { success: !0 };
  }, "handler")
}), N = l({
  args: {
    organizationId: d.id("organizations"),
    targetMemberId: d.id("teamMembers"),
    newRole: d.union(d.literal("admin"), d.literal("editor"), d.literal("viewer"))
  },
  handler: /* @__PURE__ */ m(async (e, r) => {
    let t = await w(e);
    if (!t) throw new Error("Not authenticated");
    let o = await e.db.query("teamMembers").withIndex(
      "by_user_org",
      (n) => n.eq("userId", t).eq("organizationId", r.organizationId)
    ).first();
    if (!o || o.role !== "owner")
      throw new Error("Only the owner can change member roles");
    let a = await e.db.get(r.targetMemberId);
    if (!a || a.organizationId !== r.organizationId)
      throw new Error("Member not found in this organization");
    if (a.role === "owner")
      throw new Error("Cannot change the owner's role");
    let i = a.role;
    return await e.db.patch(r.targetMemberId, {
      role: r.newRole,
      updatedAt: Date.now()
    }), await e.db.insert("teamAuditLogs", {
      organizationId: r.organizationId,
      actorId: t,
      targetUserId: a.userId,
      action: "role_changed",
      details: { previousRole: i, newRole: r.newRole },
      createdAt: Date.now()
    }), { success: !0 };
  }, "handler")
}), T = l({
  args: {
    organizationId: d.id("organizations"),
    targetMemberId: d.id("teamMembers")
  },
  handler: /* @__PURE__ */ m(async (e, r) => {
    let t = await w(e);
    if (!t) throw new Error("Not authenticated");
    let o = await e.db.query("teamMembers").withIndex(
      "by_user_org",
      (n) => n.eq("userId", t).eq("organizationId", r.organizationId)
    ).first();
    if (!o || !["owner", "admin"].includes(o.role))
      throw new Error("Only owners and admins can remove members");
    let a = await e.db.get(r.targetMemberId);
    if (!a || a.organizationId !== r.organizationId)
      throw new Error("Member not found in this organization");
    if (a.role === "owner")
      throw new Error("Cannot remove the owner from the organization");
    if (a.userId === t)
      throw new Error("Cannot remove yourself. Leave the organization instead.");
    let i = await e.db.get(a.userId);
    return await e.db.delete(r.targetMemberId), i && await e.db.patch(a.userId, { organizationId: void 0 }), await e.db.insert("teamAuditLogs", {
      organizationId: r.organizationId,
      actorId: t,
      targetUserId: a.userId,
      action: "member_removed",
      details: { email: i?.email },
      createdAt: Date.now()
    }), { success: !0 };
  }, "handler")
});
export {
  v as createOrganization,
  M as getMyOrganization,
  E as getSeatUsage,
  q as getTeamMembers,
  T as removeMember,
  A as syncSeatsWithTier,
  N as updateMemberRole,
  _ as updateOrganizationName
};
//# sourceMappingURL=teams.js.map
