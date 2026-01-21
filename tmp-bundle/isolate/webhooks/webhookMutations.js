import {
  d as r
} from "../_deps/K33OSGN4.js";
import {
  c as e,
  e as p
} from "../_deps/4U34M3I6.js";
import {
  a
} from "../_deps/RUVYHBJQ.js";

// convex/webhooks/webhookMutations.ts
p();
var c = 3, m = r({
  args: {
    webhookId: e.id("webhooks"),
    event: e.string(),
    payload: e.any()
  },
  handler: /* @__PURE__ */ a(async (n, t) => {
    let o = Date.now();
    return { deliveryId: await n.db.insert("webhookDeliveries", {
      webhookId: t.webhookId,
      event: t.event,
      payload: t.payload,
      status: "pending",
      attempts: 0,
      maxAttempts: c,
      createdAt: o
    }) };
  }, "handler")
}), b = r({
  args: {
    deliveryId: e.id("webhookDeliveries"),
    status: e.union(
      e.literal("pending"),
      e.literal("success"),
      e.literal("failed"),
      e.literal("retrying")
    ),
    responseStatus: e.optional(e.number()),
    responseBody: e.optional(e.string()),
    responseTime: e.optional(e.number()),
    attempts: e.optional(e.number()),
    nextRetryAt: e.optional(e.number()),
    error: e.optional(e.string())
  },
  handler: /* @__PURE__ */ a(async (n, t) => {
    let { deliveryId: o, ...i } = t, s = {
      lastAttemptAt: Date.now()
    };
    for (let [l, d] of Object.entries(i))
      d !== void 0 && (s[l] = d);
    await n.db.patch(o, s);
  }, "handler")
});
export {
  m as createDeliveryAndSend,
  b as updateDeliveryStatus
};
//# sourceMappingURL=webhookMutations.js.map
