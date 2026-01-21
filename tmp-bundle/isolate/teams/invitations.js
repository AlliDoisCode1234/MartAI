import {
  a as f,
  e as q
} from "../_deps/GTU362KY.js";
import {
  d as w
} from "../_deps/ZRD5YQUR.js";
import {
  a as v,
  c as g
} from "../_deps/K33OSGN4.js";
import {
  c as d,
  e as E
} from "../_deps/4U34M3I6.js";
import {
  a as l
} from "../_deps/RUVYHBJQ.js";

// convex/teams/invitations.ts
E();
q();
function A() {
  let e = new Uint8Array(16);
  crypto.getRandomValues(e), e[6] = e[6] & 15 | 64, e[8] = e[8] & 63 | 128;
  let i = Array.from(e).map((t) => t.toString(16).padStart(2, "0")).join("");
  return `${i.slice(0, 8)}-${i.slice(8, 12)}-${i.slice(12, 16)}-${i.slice(16, 20)}-${i.slice(20)}`;
}
l(A, "generateInviteToken");
var _ = 10080 * 60 * 1e3, C = v({
  args: { organizationId: d.id("organizations") },
  handler: /* @__PURE__ */ l(async (e, i) => {
    let t = await w(e);
    if (!t) throw new Error("Not authenticated");
    let o = await e.db.query("teamMembers").withIndex(
      "by_user_org",
      (r) => r.eq("userId", t).eq("organizationId", i.organizationId)
    ).first();
    if (!o || !["owner", "admin"].includes(o.role))
      throw new Error("Insufficient permissions to view invitations");
    let n = await e.db.query("organizationInvitations").withIndex("by_org", (r) => r.eq("organizationId", i.organizationId)).filter((r) => r.eq(r.field("status"), "pending")).collect();
    return await Promise.all(
      n.map(async (r) => {
        let m = await e.db.get(r.invitedBy);
        return {
          ...r,
          inviterName: m?.name,
          isExpired: r.expiresAt < Date.now()
        };
      })
    );
  }, "handler")
}), $ = v({
  args: { token: d.string() },
  handler: /* @__PURE__ */ l(async (e, i) => {
    let t = await e.db.query("organizationInvitations").withIndex("by_token", (n) => n.eq("token", i.token)).first();
    if (!t)
      return { valid: !1, error: "Invitation not found" };
    if (t.status !== "pending")
      return { valid: !1, error: "Invitation already used or revoked" };
    if (t.expiresAt < Date.now())
      return { valid: !1, error: "Invitation has expired" };
    let o = await e.db.get(t.organizationId);
    return {
      valid: !0,
      invitation: {
        email: t.email,
        role: t.role,
        organizationName: o?.name
      }
    };
  }, "handler")
}), S = g({
  args: {
    organizationId: d.id("organizations"),
    email: d.string(),
    role: d.union(d.literal("admin"), d.literal("editor"), d.literal("viewer"))
  },
  handler: /* @__PURE__ */ l(async (e, i) => {
    let t = await w(e);
    if (!t) throw new Error("Not authenticated");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.email))
      throw new Error("Invalid email format");
    let n = await e.db.query("teamMembers").withIndex(
      "by_user_org",
      (a) => a.eq("userId", t).eq("organizationId", i.organizationId)
    ).first();
    if (!n || !["owner", "admin"].includes(n.role))
      throw new Error("Only owners and admins can invite members");
    let s = await e.db.get(i.organizationId);
    if (!s) throw new Error("Organization not found");
    let r = await e.db.query("teamMembers").withIndex("by_org", (a) => a.eq("organizationId", i.organizationId)).filter((a) => a.eq(a.field("status"), "active")).collect(), m = await e.db.query("organizationInvitations").withIndex("by_org", (a) => a.eq("organizationId", i.organizationId)).filter((a) => a.eq(a.field("status"), "pending")).collect(), I = s.seatsPurchased ?? s.maxMembers ?? 1, h = r.length + m.length;
    if (h >= I)
      throw new Error(
        `Seat limit reached (${h}/${I}). Upgrade your plan for more seats.`
      );
    if (await e.db.query("organizationInvitations").withIndex("by_email", (a) => a.eq("email", i.email.toLowerCase())).filter(
      (a) => a.and(
        a.eq(a.field("organizationId"), i.organizationId),
        a.eq(a.field("status"), "pending")
      )
    ).first())
      throw new Error("An invitation has already been sent to this email");
    let b = await e.db.query("users").withIndex("email", (a) => a.eq("email", i.email.toLowerCase())).first();
    if (b) {
      let a = await e.db.query("teamMembers").withIndex(
        "by_user_org",
        (y) => y.eq("userId", b._id).eq("organizationId", i.organizationId)
      ).first();
      if (a && a.status === "active")
        throw new Error("This user is already a member of the organization");
    }
    let u = A(), c = Date.now(), p = await e.db.insert("organizationInvitations", {
      organizationId: i.organizationId,
      email: i.email.toLowerCase(),
      role: i.role,
      invitedBy: t,
      token: u,
      expiresAt: c + _,
      status: "pending",
      createdAt: c
    });
    await e.db.insert("teamAuditLogs", {
      organizationId: i.organizationId,
      actorId: t,
      action: "member_invited",
      details: { email: i.email.toLowerCase(), newRole: i.role },
      createdAt: c
    });
    let z = await e.db.get(t);
    return e.scheduler.runAfter(0, f.email.emailActions.sendTeamInviteEmail, {
      email: i.email.toLowerCase(),
      inviterName: z?.name,
      orgName: s.name,
      role: i.role,
      token: u
    }), { inviteId: p, token: u };
  }, "handler")
}), D = g({
  args: { token: d.string() },
  handler: /* @__PURE__ */ l(async (e, i) => {
    let t = await w(e);
    if (!t) throw new Error("Not authenticated");
    let o = await e.db.get(t);
    if (!o?.email) throw new Error("User email not found");
    let n = await e.db.query("organizationInvitations").withIndex("by_token", (I) => I.eq("token", i.token)).first();
    if (!n)
      throw new Error("Invitation not found");
    if (n.status !== "pending")
      throw new Error("Invitation already used or revoked");
    if (n.expiresAt < Date.now())
      throw await e.db.patch(n._id, { status: "expired" }), new Error("Invitation has expired");
    if (n.email.toLowerCase() !== o.email.toLowerCase())
      throw new Error("This invitation was sent to a different email address");
    if (o.organizationId)
      throw new Error("You already belong to an organization. Multi-org support coming soon.");
    let s = Date.now();
    await e.db.insert("teamMembers", {
      userId: t,
      organizationId: n.organizationId,
      role: n.role,
      status: "active",
      invitedBy: n.invitedBy,
      invitedAt: n.createdAt,
      joinedAt: s,
      createdAt: s,
      updatedAt: s
    }), await e.db.patch(t, {
      organizationId: n.organizationId,
      onboardingStatus: "completed"
    }), await e.db.patch(n._id, { status: "accepted" }), await e.db.insert("teamAuditLogs", {
      organizationId: n.organizationId,
      actorId: t,
      action: "member_joined",
      details: { email: o.email, newRole: n.role },
      createdAt: s
    });
    let r = await e.db.get(n.invitedBy), m = await e.db.get(n.organizationId);
    return r?.email && e.scheduler.runAfter(0, f.email.emailActions.sendInviteAcceptedEmail, {
      inviterEmail: r.email,
      memberName: o.name,
      memberEmail: o.email,
      orgName: m?.name,
      role: n.role
    }), { success: !0, organizationId: n.organizationId };
  }, "handler")
}), R = g({
  args: {
    invitationId: d.id("organizationInvitations")
  },
  handler: /* @__PURE__ */ l(async (e, i) => {
    let t = await w(e);
    if (!t) throw new Error("Not authenticated");
    let o = await e.db.get(i.invitationId);
    if (!o) throw new Error("Invitation not found");
    let n = await e.db.query("teamMembers").withIndex(
      "by_user_org",
      (s) => s.eq("userId", t).eq("organizationId", o.organizationId)
    ).first();
    if (!n || !["owner", "admin"].includes(n.role))
      throw new Error("Only owners and admins can revoke invitations");
    if (o.status !== "pending")
      throw new Error("Can only revoke pending invitations");
    return await e.db.patch(i.invitationId, { status: "revoked" }), await e.db.insert("teamAuditLogs", {
      organizationId: o.organizationId,
      actorId: t,
      action: "invite_revoked",
      details: { email: o.email },
      createdAt: Date.now()
    }), { success: !0 };
  }, "handler")
});
export {
  D as acceptInvitation,
  S as createInvitation,
  C as getPendingInvitations,
  R as revokeInvitation,
  $ as validateInviteToken
};
//# sourceMappingURL=invitations.js.map
