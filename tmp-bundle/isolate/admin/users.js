import {
  d as y,
  e as d
} from "../_deps/MF3OI5Q7.js";
import "../_deps/OFY2WAT7.js";
import "../_deps/ZRD5YQUR.js";
import {
  a as u,
  c as m
} from "../_deps/K33OSGN4.js";
import {
  c as n,
  e as h
} from "../_deps/4U34M3I6.js";
import {
  a as s
} from "../_deps/RUVYHBJQ.js";

// convex/admin/users.ts
h();
function A(e, t) {
  return {
    _id: e._id,
    name: e.name,
    email: e.email,
    role: e.role,
    accountStatus: e.accountStatus ?? "active",
    subscriptionStatus: t?.status ?? null,
    subscriptionPlan: t?.planTier ?? null,
    billingCycle: t?.billingCycle ?? null,
    createdAt: e.createdAt ?? e._creationTime,
    lastActiveAt: e.lastActiveAt
  };
}
s(A, "filterUserTableFields");
function f(e, t, a) {
  return {
    // Basic info
    _id: e._id,
    name: e.name,
    email: e.email,
    image: e.image,
    role: e.role,
    membershipTier: e.membershipTier,
    bio: e.bio,
    preferences: e.preferences,
    createdAt: e.createdAt ?? e._creationTime,
    updatedAt: e.updatedAt,
    // Account status
    accountStatus: e.accountStatus ?? "active",
    churnedAt: e.churnedAt,
    churnReason: e.churnReason,
    reactivatedAt: e.reactivatedAt,
    lastPaymentAt: e.lastPaymentAt,
    // Onboarding
    onboardingStatus: e.onboardingStatus,
    onboardingSteps: e.onboardingSteps,
    lastActiveAt: e.lastActiveAt,
    // Engagement milestones
    engagementMilestones: e.engagementMilestones,
    // Subscription (if exists)
    subscription: t ? {
      _id: t._id,
      planTier: t.planTier,
      status: t.status,
      billingCycle: t.billingCycle,
      priceMonthly: t.priceMonthly,
      features: t.features,
      startsAt: t.startsAt,
      renewsAt: t.renewsAt,
      cancelAt: t.cancelAt,
      graceStartedAt: t.graceStartedAt,
      maintenanceStartedAt: t.maintenanceStartedAt,
      lastPaymentAt: t.lastPaymentAt,
      lastPaymentFailedAt: t.lastPaymentFailedAt,
      failedPaymentCount: t.failedPaymentCount
    } : null,
    // Projects summary
    projectCount: a.length,
    projects: a.map((r) => ({
      _id: r._id,
      name: r.name,
      websiteUrl: r.websiteUrl,
      createdAt: r.createdAt
    }))
  };
}
s(f, "filterUserDetailFields");
var I = u({
  args: {
    limit: n.optional(n.number()),
    accountStatus: n.optional(
      n.union(
        n.literal("active"),
        n.literal("inactive"),
        n.literal("churned"),
        n.literal("suspended")
      )
    )
  },
  handler: /* @__PURE__ */ s(async (e, t) => {
    await d(e);
    let a = t.limit || 50, i = await e.db.query("users").order("desc").take(a);
    return (await Promise.all(
      i.map(async (l) => {
        if (t.accountStatus && l.accountStatus !== t.accountStatus)
          return null;
        let w = await e.db.query("subscriptions").withIndex("by_user", (c) => c.eq("userId", l._id)).first();
        return A(l, w);
      })
    )).filter(Boolean);
  }, "handler")
}), _ = u({
  args: {
    userId: n.id("users")
  },
  handler: /* @__PURE__ */ s(async (e, t) => {
    await d(e);
    let a = await e.db.get(t.userId);
    if (!a)
      throw new Error("User not found");
    let r = await e.db.query("subscriptions").withIndex("by_user", (o) => o.eq("userId", t.userId)).first(), i = await e.db.query("projects").withIndex("by_user", (o) => o.eq("userId", t.userId)).collect();
    return f(a, r, i);
  }, "handler")
}), v = u({
  args: {
    email: n.string()
  },
  handler: /* @__PURE__ */ s(async (e, t) => {
    await d(e);
    let a = await e.db.query("users").withIndex("email", (i) => i.eq("email", t.email)).first();
    if (!a) return null;
    let r = await e.db.query("subscriptions").withIndex("by_user", (i) => i.eq("userId", a._id)).first();
    return A(a, r);
  }, "handler")
}), U = u({
  args: {},
  handler: /* @__PURE__ */ s(async (e) => {
    await d(e);
    let t = await e.db.query("users").filter((a) => a.or(a.eq(a.field("role"), "admin"), a.eq(a.field("role"), "super_admin"))).collect();
    return Promise.all(
      t.map(async (a) => {
        let r = await e.db.query("subscriptions").withIndex("by_user", (i) => i.eq("userId", a._id)).first();
        return A(a, r);
      })
    );
  }, "handler")
}), q = m({
  args: {
    userId: n.id("users"),
    role: n.union(
      n.literal("user"),
      n.literal("admin"),
      n.literal("super_admin"),
      n.literal("viewer")
    )
  },
  handler: /* @__PURE__ */ s(async (e, t) => {
    await y(e);
    let a = await e.db.get(t.userId);
    if (!a)
      throw new Error("User not found");
    return await e.db.patch(t.userId, {
      role: t.role,
      updatedAt: Date.now()
    }), console.log(`[AdminRoleChange] User ${t.userId} role changed to ${t.role}`), { success: !0, previousRole: a.role, newRole: t.role };
  }, "handler")
}), P = m({
  args: {
    userId: n.id("users"),
    accountStatus: n.union(
      n.literal("active"),
      n.literal("inactive"),
      n.literal("churned"),
      n.literal("suspended")
    ),
    reason: n.optional(n.string())
  },
  handler: /* @__PURE__ */ s(async (e, t) => {
    await y(e);
    let a = await e.db.get(t.userId);
    if (!a)
      throw new Error("User not found");
    let r = Date.now(), i = {
      accountStatus: t.accountStatus,
      updatedAt: r
    };
    return t.accountStatus === "churned" ? (i.churnedAt = r, i.churnReason = t.reason) : t.accountStatus === "active" && a.accountStatus !== "active" && (i.reactivatedAt = r), await e.db.patch(t.userId, i), console.log(`[AdminStatusChange] User ${t.userId} status changed to ${t.accountStatus}`), { success: !0, previousStatus: a.accountStatus, newStatus: t.accountStatus };
  }, "handler")
});
async function p(e) {
  let a = new TextEncoder().encode(e), r = await crypto.subtle.digest("SHA-256", a);
  return Array.from(new Uint8Array(r)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
s(p, "hashToken");
var R = m({
  args: {
    userId: n.id("users")
  },
  handler: /* @__PURE__ */ s(async (e, t) => {
    await d(e);
    let a = await e.db.get(t.userId);
    if (!a)
      throw new Error("User not found");
    if (!a.email)
      throw new Error("User has no email address");
    let r = Array.from(
      { length: 32 },
      () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0")
    ).join(""), i = await p(r), o = Date.now() + 3600 * 1e3, l = await e.auth.getUserIdentity(), w = l ? await e.db.query("users").filter((c) => c.eq(c.field("email"), l.email)).first() : null;
    return await e.db.insert("passwordResetTokens", {
      userId: t.userId,
      tokenHash: i,
      expiresAt: o,
      createdAt: Date.now(),
      triggeredBy: w?._id
    }), console.log(`[AdminPasswordReset] Reset email triggered for user ${t.userId}`), {
      success: !0,
      email: a.email,
      name: a.name,
      token: r
    };
  }, "handler")
});
export {
  v as getUserByEmail,
  _ as getUserDetails,
  U as listAdmins,
  I as listUsers,
  R as sendPasswordResetEmail,
  P as updateAccountStatus,
  q as updateUserRole
};
//# sourceMappingURL=users.js.map
