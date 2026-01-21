import {
  b as p
} from "../_deps/J7ZPJBHN.js";
import "../_deps/GTU362KY.js";
import {
  a as l,
  c as u,
  d as w
} from "../_deps/K33OSGN4.js";
import {
  c as o,
  e as I
} from "../_deps/4U34M3I6.js";
import {
  a as m
} from "../_deps/RUVYHBJQ.js";

// convex/admin/impersonation.ts
I();
var c = 3600 * 1e3, U = u({
  args: {
    targetUserId: o.id("users"),
    reason: o.optional(o.string()),
    permissions: o.optional(o.union(o.literal("read_only"), o.literal("full_access")))
  },
  handler: /* @__PURE__ */ m(async (t, s) => {
    let n = await t.auth.getUserIdentity();
    if (!n)
      throw new Error("Not authenticated");
    let e = await t.db.query("users").filter((d) => d.eq(d.field("email"), n.email)).first();
    if (!e)
      throw new Error("Admin user not found");
    if (e.role !== "super_admin")
      throw new Error("Unauthorized");
    {
      let { ok: d, retryAfter: f } = await p.limit(t, "admin_impersonation", {
        key: e._id
      });
      if (!d)
        throw new Error(
          `Rate limit exceeded. Try again in ${Math.ceil((f ?? 60) / 60)} minutes.`
        );
    }
    let i = await t.db.get(s.targetUserId);
    if (!i)
      throw new Error("Target user not found");
    if (i.role === "super_admin" && i._id !== e._id)
      throw new Error("Unauthorized");
    let a = await t.db.query("impersonationSessions").withIndex(
      "by_admin_active",
      (d) => d.eq("adminUserId", e._id).eq("status", "active")
    ).collect();
    for (let d of a)
      await t.db.patch(d._id, {
        status: "ended",
        endedAt: Date.now(),
        endReason: "admin_logout"
      });
    let r = Date.now();
    return {
      sessionId: await t.db.insert("impersonationSessions", {
        adminUserId: e._id,
        adminEmail: e.email ?? "unknown",
        targetUserId: s.targetUserId,
        targetEmail: i.email ?? "unknown",
        status: "active",
        permissions: s.permissions ?? "full_access",
        startedAt: r,
        expiresAt: r + c,
        reason: s.reason,
        actionsCount: 0
      }),
      targetUser: {
        id: i._id,
        name: i.name,
        email: i.email
      },
      expiresAt: r + c
    };
  }, "handler")
}), b = u({
  args: {
    sessionId: o.optional(o.id("impersonationSessions"))
  },
  handler: /* @__PURE__ */ m(async (t, s) => {
    let n = await t.auth.getUserIdentity();
    if (!n)
      throw new Error("Not authenticated");
    let e = await t.db.query("users").filter((a) => a.eq(a.field("email"), n.email)).first();
    if (!e)
      throw new Error("User not found");
    let i;
    if (s.sessionId ? i = await t.db.get(s.sessionId) : i = await t.db.query("impersonationSessions").withIndex(
      "by_admin_active",
      (a) => a.eq("adminUserId", e._id).eq("status", "active")
    ).first(), !i)
      return { ended: !1, message: "No active session found" };
    if (i.adminUserId !== e._id)
      throw new Error("Cannot end another admin's session");
    return await t.db.patch(i._id, {
      status: "ended",
      endedAt: Date.now(),
      endReason: "manual"
    }), { ended: !0, message: "Impersonation session ended" };
  }, "handler")
}), E = l({
  args: {},
  handler: /* @__PURE__ */ m(async (t) => {
    let s = await t.auth.getUserIdentity();
    if (!s)
      return null;
    let n = await t.db.query("users").filter((a) => a.eq(a.field("email"), s.email)).first();
    if (!n)
      return null;
    let e = await t.db.query("impersonationSessions").withIndex(
      "by_admin_active",
      (a) => a.eq("adminUserId", n._id).eq("status", "active")
    ).first();
    if (!e)
      return null;
    if (e.expiresAt < Date.now())
      return {
        ...e,
        isExpired: !0
      };
    let i = await t.db.get(e.targetUserId);
    return {
      sessionId: e._id,
      targetUserId: e.targetUserId,
      targetEmail: e.targetEmail,
      targetName: i?.name ?? "Unknown",
      permissions: e.permissions,
      startedAt: e.startedAt,
      expiresAt: e.expiresAt,
      reason: e.reason,
      isExpired: !1
    };
  }, "handler")
}), A = l({
  args: {
    limit: o.optional(o.number())
  },
  handler: /* @__PURE__ */ m(async (t, s) => {
    let n = await t.auth.getUserIdentity();
    if (!n)
      return [];
    let e = await t.db.query("users").filter((r) => r.eq(r.field("email"), n.email)).first();
    if (!e || e.role !== "super_admin")
      return [];
    let i = s.limit ?? 50;
    return (await t.db.query("impersonationSessions").order("desc").take(i)).map((r) => ({
      id: r._id,
      adminEmail: r.adminEmail,
      targetEmail: r.targetEmail,
      status: r.status,
      permissions: r.permissions,
      startedAt: r.startedAt,
      endedAt: r.endedAt,
      reason: r.reason,
      actionsCount: r.actionsCount
    }));
  }, "handler")
}), q = u({
  args: {
    sessionId: o.id("impersonationSessions")
  },
  handler: /* @__PURE__ */ m(async (t, s) => {
    let n = await t.auth.getUserIdentity();
    if (!n)
      throw new Error("Not authenticated");
    let e = await t.db.query("users").filter((a) => a.eq(a.field("email"), n.email)).first();
    if (!e)
      throw new Error("User not found");
    let i = await t.db.get(s.sessionId);
    if (!(!i || i.status !== "active")) {
      if (i.adminUserId !== e._id)
        throw new Error("Unauthorized");
      await t.db.patch(s.sessionId, {
        actionsCount: (i.actionsCount ?? 0) + 1
      });
    }
  }, "handler")
}), S = w({
  args: {},
  handler: /* @__PURE__ */ m(async (t) => {
    let s = Date.now(), n = await t.db.query("impersonationSessions").withIndex("by_status", (i) => i.eq("status", "active")).collect(), e = 0;
    for (let i of n)
      i.expiresAt < s && (await t.db.patch(i._id, {
        status: "expired",
        endedAt: s,
        endReason: "expired"
      }), e++);
    return e > 0 && console.log(`[ImpersonationCleanup] Marked ${e} expired sessions`), { cleanedCount: e };
  }, "handler")
});
export {
  S as cleanupExpiredSessions,
  b as endImpersonation,
  E as getActiveSession,
  A as getImpersonationHistory,
  U as startImpersonation,
  q as trackImpersonationAction
};
//# sourceMappingURL=impersonation.js.map
