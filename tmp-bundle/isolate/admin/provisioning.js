import {
  b as n,
  e as u
} from "../_deps/GTU362KY.js";
import {
  a
} from "../_deps/MF3OI5Q7.js";
import "../_deps/OFY2WAT7.js";
import "../_deps/ZRD5YQUR.js";
import {
  c as l
} from "../_deps/K33OSGN4.js";
import {
  c as e,
  e as o
} from "../_deps/4U34M3I6.js";
import {
  a as r
} from "../_deps/RUVYHBJQ.js";

// convex/admin/provisioning.ts
o();
u();
var b = l({
  args: {
    targetUserId: e.id("users"),
    planTier: e.string(),
    // 'team', 'enterprise', 'growth', 'active'
    status: e.union(
      e.literal("active"),
      e.literal("trialing"),
      e.literal("grace_period"),
      e.literal("maintenance_mode"),
      e.literal("past_due"),
      e.literal("cancelled"),
      e.literal("expired")
    ),
    billingCycle: e.optional(e.union(e.literal("monthly"), e.literal("annual"))),
    startsAt: e.optional(e.number())
  },
  handler: /* @__PURE__ */ r(async (i, t) => {
    await a(i, "sales");
    let s = t.startsAt ?? Date.now();
    return await i.scheduler.runAfter(0, n.subscriptions.subscriptions.upsertSubscription, {
      userId: t.targetUserId,
      planTier: t.planTier,
      status: t.status,
      billingCycle: t.billingCycle,
      startsAt: s,
      oneTimeFeePaid: !1
      // Default for manual provision
    }), { success: !0 };
  }, "handler")
});
export {
  b as provisionSubscription
};
//# sourceMappingURL=provisioning.js.map
