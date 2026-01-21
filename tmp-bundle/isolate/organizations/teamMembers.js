import {
  a as u
} from "../_deps/OFY2WAT7.js";
import "../_deps/ZRD5YQUR.js";
import {
  a as I,
  c as l
} from "../_deps/K33OSGN4.js";
import {
  c as o,
  e as h
} from "../_deps/4U34M3I6.js";
import {
  a as w
} from "../_deps/RUVYHBJQ.js";

// convex/organizations/teamMembers.ts
h();
var p = I({
  args: { organizationId: o.id("organizations") },
  handler: /* @__PURE__ */ w(async (e, i) => {
    let t = await u.getUserId(e);
    if (!t)
      return [];
    if (!await e.db.query("teamMembers").withIndex(
      "by_user_org",
      (d) => d.eq("userId", t).eq("organizationId", i.organizationId)
    ).first())
      return [];
    let n = await e.db.query("teamMembers").withIndex("by_org", (d) => d.eq("organizationId", i.organizationId)).collect();
    return await Promise.all(
      n.map(async (d) => {
        let m = await e.db.get(d.userId);
        return {
          ...d,
          user: m ? {
            name: m.name,
            email: m.email,
            image: m.image
          } : null
        };
      })
    );
  }, "handler")
}), z = l({
  args: {
    organizationId: o.id("organizations"),
    email: o.string(),
    role: o.union(o.literal("admin"), o.literal("editor"), o.literal("viewer"))
  },
  handler: /* @__PURE__ */ w(async (e, i) => {
    let t = await u.getUserId(e);
    if (!t)
      throw new Error("Unauthorized");
    let r = await e.db.query("teamMembers").withIndex(
      "by_user_org",
      (a) => a.eq("userId", t).eq("organizationId", i.organizationId)
    ).first();
    if (!r || !["owner", "admin"].includes(r.role))
      throw new Error("Insufficient permissions");
    let n = await e.db.get(i.organizationId);
    if (!n)
      throw new Error("Organization not found");
    let s = await e.db.query("teamMembers").withIndex("by_org", (a) => a.eq("organizationId", i.organizationId)).collect();
    if (n.maxMembers && s.length >= n.maxMembers)
      throw new Error(`Organization has reached the maximum of ${n.maxMembers} members`);
    if (await e.db.query("organizationInvitations").withIndex("by_email", (a) => a.eq("email", i.email)).filter(
      (a) => a.and(
        a.eq(a.field("organizationId"), i.organizationId),
        a.eq(a.field("status"), "pending")
      )
    ).first())
      throw new Error("User already has a pending invitation");
    let m = crypto.randomUUID(), b = Date.now() + 10080 * 60 * 1e3;
    return await e.db.insert("organizationInvitations", {
      organizationId: i.organizationId,
      email: i.email,
      role: i.role,
      invitedBy: t,
      token: m,
      expiresAt: b,
      status: "pending",
      createdAt: Date.now()
    }), { success: !0, token: m };
  }, "handler")
}), y = l({
  args: { token: o.string() },
  handler: /* @__PURE__ */ w(async (e, i) => {
    let t = await u.getUserId(e);
    if (!t)
      throw new Error("Unauthorized");
    let r = await e.db.query("organizationInvitations").withIndex("by_token", (d) => d.eq("token", i.token)).first();
    if (!r)
      throw new Error("Invalid invitation");
    if (r.status !== "pending")
      throw new Error("Invitation is no longer valid");
    if (Date.now() > r.expiresAt)
      throw await e.db.patch(r._id, { status: "expired" }), new Error("Invitation has expired");
    if ((await e.db.get(t))?.email !== r.email)
      throw new Error("Invitation email does not match your account");
    let s = Date.now();
    return await e.db.insert("teamMembers", {
      userId: t,
      organizationId: r.organizationId,
      role: r.role,
      status: "active",
      invitedBy: r.invitedBy,
      invitedAt: r.createdAt,
      joinedAt: s,
      createdAt: s,
      updatedAt: s
    }), await e.db.patch(r._id, { status: "accepted" }), { success: !0, organizationId: r.organizationId };
  }, "handler")
}), v = l({
  args: {
    memberId: o.id("teamMembers"),
    role: o.union(o.literal("admin"), o.literal("editor"), o.literal("viewer"))
  },
  handler: /* @__PURE__ */ w(async (e, i) => {
    let t = await u.getUserId(e);
    if (!t)
      throw new Error("Unauthorized");
    let r = await e.db.get(i.memberId);
    if (!r)
      throw new Error("Member not found");
    if (r.role === "owner")
      throw new Error("Cannot change owner role");
    let n = await e.db.query("teamMembers").withIndex(
      "by_user_org",
      (s) => s.eq("userId", t).eq("organizationId", r.organizationId)
    ).first();
    if (!n || !["owner", "admin"].includes(n.role))
      throw new Error("Insufficient permissions");
    if (n.role === "admin" && r.role === "admin")
      throw new Error("Admins cannot modify other admins");
    return await e.db.patch(i.memberId, {
      role: i.role,
      updatedAt: Date.now()
    }), { success: !0 };
  }, "handler")
}), M = l({
  args: { memberId: o.id("teamMembers") },
  handler: /* @__PURE__ */ w(async (e, i) => {
    let t = await u.getUserId(e);
    if (!t)
      throw new Error("Unauthorized");
    let r = await e.db.get(i.memberId);
    if (!r)
      throw new Error("Member not found");
    if (r.role === "owner")
      throw new Error("Cannot remove the owner");
    let n = await e.db.query("teamMembers").withIndex(
      "by_user_org",
      (s) => s.eq("userId", t).eq("organizationId", r.organizationId)
    ).first();
    if (r.userId === t)
      return await e.db.delete(i.memberId), { success: !0 };
    if (!n || !["owner", "admin"].includes(n.role))
      throw new Error("Insufficient permissions");
    if (n.role === "admin" && r.role === "admin")
      throw new Error("Admins cannot remove other admins");
    return await e.db.delete(i.memberId), { success: !0 };
  }, "handler")
});
export {
  y as acceptInvitation,
  p as getTeamMembers,
  z as inviteMember,
  M as removeMember,
  v as updateMemberRole
};
//# sourceMappingURL=teamMembers.js.map
