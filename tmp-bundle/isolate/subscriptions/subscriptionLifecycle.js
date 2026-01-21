import {
  b as w,
  e as P
} from "../_deps/GTU362KY.js";
import {
  d as m,
  e as g
} from "../_deps/MF3OI5Q7.js";
import "../_deps/OFY2WAT7.js";
import "../_deps/ZRD5YQUR.js";
import {
  a as u,
  b as f,
  c as b,
  d,
  f as y
} from "../_deps/K33OSGN4.js";
import {
  c as r,
  e as I
} from "../_deps/4U34M3I6.js";
import {
  a as o
} from "../_deps/RUVYHBJQ.js";

// convex/subscriptions/subscriptionLifecycle.ts
I();
P();
var E = 7, p = E * 24 * 60 * 60 * 1e3, l = {
  canRead: !0,
  // View dashboard, data
  canGenerate: !1,
  // Generate keywords, briefs, drafts
  canPublish: !1,
  // Publish to WordPress, etc.
  canExport: !1,
  // Export data
  canConnect: !1
  // Connect new integrations
};
async function A(e, n) {
  return await e.db.query("subscriptions").withIndex("by_user", (t) => t.eq("userId", n)).first();
}
o(A, "getSubscriptionByUserId");
var G = u({
  args: { userId: r.id("users") },
  handler: /* @__PURE__ */ o(async (e, { userId: n }) => {
    let t = await e.auth.getUserIdentity();
    if (!t)
      throw new Error("Unauthorized");
    let a = await e.db.query("users").withIndex("email", (c) => c.eq("email", t.email)).first();
    if (!a)
      throw new Error("User not found");
    let i = a.role === "admin" || a.role === "super_admin";
    if (a._id !== n && !i)
      throw new Error("Access denied");
    let s = await A(e, n);
    return s ? s.status === "maintenance_mode" || s.status === "grace_period" || s.status === "past_due" ? {
      hasSubscription: !0,
      status: s.status,
      limits: l,
      message: s.status === "grace_period" ? "Payment failed. Please update your payment method." : "Subscription inactive. Please reactivate to continue.",
      graceEndsAt: s.status === "grace_period" && s.graceStartedAt ? s.graceStartedAt + p : null
    } : s.status === "cancelled" || s.status === "expired" ? {
      hasSubscription: !0,
      status: s.status,
      limits: l,
      message: "Subscription ended. Reactivate to continue creating content."
    } : {
      hasSubscription: !0,
      status: s.status,
      limits: {
        canRead: !0,
        canGenerate: !0,
        canPublish: !0,
        canExport: !0,
        canConnect: !0
      },
      message: null
    } : {
      hasSubscription: !1,
      status: null,
      limits: l,
      message: "No active subscription"
    };
  }, "handler")
}), x = u({
  args: {
    userId: r.id("users"),
    action: r.union(
      r.literal("read"),
      r.literal("generate"),
      r.literal("publish"),
      r.literal("export"),
      r.literal("connect")
    )
  },
  handler: /* @__PURE__ */ o(async (e, { userId: n, action: t }) => {
    let a = await e.auth.getUserIdentity();
    if (!a)
      throw new Error("Unauthorized");
    let i = await e.db.query("users").withIndex("email", (_) => _.eq("email", a.email)).first();
    if (!i)
      throw new Error("User not found");
    let s = i.role === "admin" || i.role === "super_admin";
    if (i._id !== n && !s)
      throw new Error("Access denied");
    let c = await A(e, n);
    if (!c)
      return { allowed: !1, reason: "No subscription found" };
    if (c.status === "active" || c.status === "trialing")
      return { allowed: !0, reason: null };
    let S = {
      read: "canRead",
      generate: "canGenerate",
      publish: "canPublish",
      export: "canExport",
      connect: "canConnect"
    }[t], h = l[S];
    return {
      allowed: h,
      reason: h ? null : "Action not available in current subscription status"
    };
  }, "handler")
}), R = d({
  args: { subscriptionId: r.id("subscriptions") },
  handler: /* @__PURE__ */ o(async (e, { subscriptionId: n }) => {
    let t = await e.db.get(n);
    if (!t) return { success: !1, error: "Subscription not found" };
    let a = Date.now();
    return await e.db.patch(n, {
      status: "grace_period",
      graceStartedAt: a,
      lastPaymentFailedAt: a,
      failedPaymentCount: (t.failedPaymentCount ?? 0) + 1,
      updatedAt: a
    }), { success: !0, graceEndsAt: a + p };
  }, "handler")
}), N = d({
  args: { subscriptionId: r.id("subscriptions") },
  handler: /* @__PURE__ */ o(async (e, { subscriptionId: n }) => {
    let t = await e.db.get(n);
    if (!t) return { success: !1, error: "Subscription not found" };
    let a = Date.now();
    return await e.db.patch(n, {
      status: "maintenance_mode",
      maintenanceStartedAt: a,
      updatedAt: a
    }), await e.db.patch(t.userId, {
      accountStatus: "inactive"
    }), { success: !0 };
  }, "handler")
}), U = d({
  args: { subscriptionId: r.id("subscriptions") },
  handler: /* @__PURE__ */ o(async (e, { subscriptionId: n }) => {
    let t = await e.db.get(n);
    if (!t) return { success: !1, error: "Subscription not found" };
    let a = Date.now();
    return await e.db.patch(n, {
      status: "active",
      graceStartedAt: void 0,
      maintenanceStartedAt: void 0,
      failedPaymentCount: 0,
      lastPaymentAt: a,
      updatedAt: a
    }), await e.db.patch(t.userId, {
      accountStatus: "active",
      lastPaymentAt: a,
      reactivatedAt: a
    }), { success: !0 };
  }, "handler")
}), k = d({
  args: {
    subscriptionId: r.id("subscriptions"),
    reason: r.optional(r.string())
  },
  handler: /* @__PURE__ */ o(async (e, { subscriptionId: n, reason: t }) => {
    let a = await e.db.get(n);
    if (!a) return { success: !1, error: "Subscription not found" };
    let i = Date.now();
    return await e.db.patch(n, {
      status: "cancelled",
      cancelAt: i,
      updatedAt: i
    }), await e.db.patch(a.userId, {
      accountStatus: "churned",
      churnedAt: i,
      churnReason: t
    }), { success: !0 };
  }, "handler")
}), L = b({
  args: {
    subscriptionId: r.id("subscriptions"),
    reason: r.optional(r.string())
  },
  handler: /* @__PURE__ */ o(async (e, { subscriptionId: n, reason: t }) => {
    await m(e);
    let a = await e.db.get(n);
    if (!a) throw new Error("Subscription not found");
    let i = Date.now();
    return await e.db.patch(n, {
      status: "active",
      graceStartedAt: void 0,
      maintenanceStartedAt: void 0,
      updatedAt: i
    }), await e.db.patch(a.userId, {
      accountStatus: "active",
      reactivatedAt: i
    }), console.log(
      `[AdminActivate] Subscription ${n} activated by admin. Reason: ${t ?? "N/A"}`
    ), { success: !0, previousStatus: a.status };
  }, "handler")
}), $ = b({
  args: {
    subscriptionId: r.id("subscriptions"),
    newPlanTier: r.string(),
    newBillingCycle: r.optional(r.union(r.literal("monthly"), r.literal("annual")))
  },
  handler: /* @__PURE__ */ o(async (e, { subscriptionId: n, newPlanTier: t, newBillingCycle: a }) => {
    await m(e);
    let i = await e.db.get(n);
    if (!i) throw new Error("Subscription not found");
    let s = Date.now();
    return await e.db.patch(n, {
      planTier: t,
      billingCycle: a ?? i.billingCycle,
      updatedAt: s
    }), await e.db.patch(i.userId, {
      membershipTier: t
    }), console.log(`[AdminPlanChange] Subscription ${n} changed to ${t}`), {
      success: !0,
      previousPlan: i.planTier,
      newPlan: t
    };
  }, "handler")
}), O = u({
  args: {},
  handler: /* @__PURE__ */ o(async (e) => (await g(e), (await e.db.query("subscriptions").withIndex("by_status", (t) => t.eq("status", "maintenance_mode")).collect()).map((t) => ({
    _id: t._id,
    userId: t.userId,
    planTier: t.planTier,
    maintenanceStartedAt: t.maintenanceStartedAt,
    billingCycle: t.billingCycle
  }))), "handler")
}), F = u({
  args: {},
  handler: /* @__PURE__ */ o(async (e) => (await g(e), (await e.db.query("subscriptions").withIndex("by_status", (t) => t.eq("status", "grace_period")).collect()).map((t) => ({
    _id: t._id,
    userId: t.userId,
    planTier: t.planTier,
    graceStartedAt: t.graceStartedAt,
    graceEndsAt: t.graceStartedAt ? t.graceStartedAt + p : null,
    failedPaymentCount: t.failedPaymentCount
  }))), "handler")
}), z = y({
  args: {},
  handler: /* @__PURE__ */ o(async (e) => {
    let n = await e.runQuery(
      w.subscriptions.subscriptionLifecycle.getGracePeriodSubscriptionsInternal,
      {}
    ), t = Date.now(), a = 0;
    for (let i of n)
      i.graceStartedAt && t > i.graceStartedAt + p && (await e.runMutation(
        w.subscriptions.subscriptionLifecycle.transitionToMaintenanceMode,
        { subscriptionId: i._id }
      ), a++, console.log(`[GracePeriodCheck] Transitioned ${i._id} to maintenance_mode`));
    return console.log(
      `[GracePeriodCheck] Checked ${n.length} subscriptions, transitioned ${a} to maintenance`
    ), { checked: n.length, transitioned: a };
  }, "handler")
}), B = f({
  args: {},
  handler: /* @__PURE__ */ o(async (e) => (await e.db.query("subscriptions").withIndex("by_status", (t) => t.eq("status", "grace_period")).collect()).map((t) => ({
    _id: t._id,
    userId: t.userId,
    graceStartedAt: t.graceStartedAt
  })), "handler")
});
export {
  E as GRACE_PERIOD_DAYS,
  p as GRACE_PERIOD_MS,
  l as MAINTENANCE_MODE_LIMITS,
  L as adminActivateSubscription,
  $ as adminChangeSubscriptionPlan,
  x as canPerformAction,
  k as cancelSubscription,
  z as checkGracePeriodExpiration,
  G as getEffectiveLimits,
  B as getGracePeriodSubscriptionsInternal,
  F as listGracePeriodSubscriptions,
  O as listMaintenanceModeSubscriptions,
  U as reactivateSubscription,
  R as transitionToGracePeriod,
  N as transitionToMaintenanceMode
};
//# sourceMappingURL=subscriptionLifecycle.js.map
