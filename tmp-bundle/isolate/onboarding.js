import {
  a as m,
  e as C
} from "./_deps/GTU362KY.js";
import {
  a as b
} from "./_deps/OFY2WAT7.js";
import "./_deps/ZRD5YQUR.js";
import {
  b as S,
  c,
  d as g
} from "./_deps/K33OSGN4.js";
import {
  c as t,
  e as f
} from "./_deps/4U34M3I6.js";
import {
  a as u
} from "./_deps/RUVYHBJQ.js";

// convex/onboarding.ts
f();
C();
var U = c({
  args: {
    step: t.union(
      t.literal("signupCompleted"),
      t.literal("planSelected"),
      t.literal("paymentCompleted"),
      t.literal("projectCreated"),
      t.literal("organizationCreated"),
      t.literal("ga4Connected"),
      t.literal("gscConnected")
    ),
    value: t.union(t.boolean(), t.string())
  },
  handler: /* @__PURE__ */ u(async (n, e) => {
    let r = await b.getUserId(n);
    if (!r) throw new Error("Unauthorized");
    let o = await n.db.get(r);
    if (!o) throw new Error("User not found");
    let i = o.onboardingSteps || {}, a = Date.now(), s = { ...i };
    if (s[e.step] = e.value, s[`${e.step}At`] = a, e.step === "signupCompleted" && e.value === !0 && !o.organizationId) {
      let p = await n.runMutation(m.teams.teams.createOrganization, {});
      s.organizationCreated = !0, s.organizationCreatedAt = a;
    }
    let d = {
      onboardingSteps: s,
      onboardingStatus: "in_progress",
      lastActiveAt: a,
      updatedAt: a
    };
    return e.step === "planSelected" && typeof e.value == "string" && (d.membershipTier = e.value), await n.db.patch(r, d), { success: !0 };
  }, "handler")
}), z = c({
  args: {
    steps: t.array(
      t.object({
        step: t.union(
          t.literal("signupCompleted"),
          t.literal("planSelected"),
          t.literal("paymentCompleted"),
          t.literal("projectCreated"),
          t.literal("ga4Connected"),
          t.literal("gscConnected")
        ),
        value: t.union(t.boolean(), t.string())
      })
    )
  },
  handler: /* @__PURE__ */ u(async (n, e) => {
    let r = await b.getUserId(n);
    if (!r) throw new Error("Unauthorized");
    let o = await n.db.get(r);
    if (!o) throw new Error("User not found");
    let i = Date.now(), a = { ...o.onboardingSteps || {} };
    for (let { step: s, value: d } of e.steps)
      a[s] = d, a[`${s}At`] = i;
    return await n.db.patch(r, {
      onboardingSteps: a,
      onboardingStatus: "in_progress",
      lastActiveAt: i,
      updatedAt: i
    }), { success: !0 };
  }, "handler")
}), E = g({
  args: {
    userId: t.id("users"),
    step: t.union(
      t.literal("signupCompleted"),
      t.literal("planSelected"),
      t.literal("paymentCompleted"),
      t.literal("projectCreated"),
      t.literal("ga4Connected"),
      t.literal("gscConnected")
    ),
    value: t.union(t.boolean(), t.string())
  },
  handler: /* @__PURE__ */ u(async (n, e) => {
    let r = await n.db.get(e.userId);
    if (!r) throw new Error("User not found");
    let o = r.onboardingSteps || {}, i = Date.now(), a = { ...o };
    return a[e.step] = e.value, a[`${e.step}At`] = i, await n.db.patch(e.userId, {
      onboardingSteps: a,
      onboardingStatus: "in_progress",
      lastActiveAt: i,
      updatedAt: i
    }), { success: !0 };
  }, "handler")
}), R = S({
  args: {
    userId: t.id("users")
  },
  handler: /* @__PURE__ */ u(async (n, e) => {
    let r = await n.db.get(e.userId);
    if (!r) throw new Error("User not found");
    let o = r.onboardingSteps || {}, i = ["signupCompleted", "planSelected", "paymentCompleted", "projectCreated"], a = ["ga4Connected", "gscConnected"], s = i.filter(
      (l) => o[l] === !0 || l === "planSelected" && typeof o[l] == "string"
    ).length, d = a.filter((l) => o[l] === !0).length, p = i.length + a.length, w = s + d, h = s === i.length;
    return {
      steps: o,
      completedSteps: w,
      totalSteps: p,
      completedRequired: s,
      totalRequired: i.length,
      isComplete: h,
      percentComplete: Math.round(w / p * 100)
    };
  }, "handler")
}), j = g({
  args: {
    userId: t.id("users"),
    bypassPayment: t.optional(t.boolean())
  },
  handler: /* @__PURE__ */ u(async (n, e) => {
    let r = Date.now(), o = await n.db.get(e.userId);
    if (!o) throw new Error("User not found");
    let s = (await n.db.query("subscriptions").withIndex("by_user", (d) => d.eq("userId", e.userId)).first())?.status === "active" || e.bypassPayment === !0;
    return await n.db.patch(e.userId, {
      onboardingStatus: "completed",
      accountStatus: s ? "active" : o.accountStatus,
      lastActiveAt: r,
      updatedAt: r
    }), n.scheduler.runAfter(0, m.integrations.hubspot.syncUserToHubspot, {
      userId: e.userId
    }), console.log(`[Onboarding] Marked complete for ${e.userId}. Active: ${s}`), { success: !0, accountStatus: s ? "active" : o.accountStatus };
  }, "handler")
});
export {
  R as getProgress,
  j as markComplete,
  z as updateMultipleSteps,
  U as updateOnboardingStep,
  E as updateStep
};
//# sourceMappingURL=onboarding.js.map
