import {
  b as a
} from "../_deps/K33OSGN4.js";
import {
  c as i,
  e as s
} from "../_deps/4U34M3I6.js";
import {
  a as d
} from "../_deps/RUVYHBJQ.js";

// convex/webhooks/webhookQueries.ts
s();
var b = a({
  args: {
    projectId: i.optional(i.id("projects")),
    organizationId: i.optional(i.id("organizations")),
    event: i.string()
  },
  handler: /* @__PURE__ */ d(async (r, t) => {
    let e = [];
    if (t.projectId) {
      let n = await r.db.query("webhooks").withIndex("by_project", (o) => o.eq("projectId", t.projectId)).filter((o) => o.eq(o.field("isActive"), !0)).collect();
      e = [...e, ...n];
    }
    if (t.organizationId) {
      let n = await r.db.query("webhooks").withIndex("by_org", (o) => o.eq("organizationId", t.organizationId)).filter((o) => o.eq(o.field("isActive"), !0)).collect();
      e = [...e, ...n];
    }
    return e.filter((n) => n.events.includes(t.event));
  }, "handler")
}), y = a({
  args: { deliveryId: i.id("webhookDeliveries") },
  handler: /* @__PURE__ */ d(async (r, t) => await r.db.get(t.deliveryId), "handler")
}), h = a({
  args: { webhookId: i.id("webhooks") },
  handler: /* @__PURE__ */ d(async (r, t) => await r.db.get(t.webhookId), "handler")
}), w = a({
  args: {},
  handler: /* @__PURE__ */ d(async (r) => {
    let t = Date.now();
    return await r.db.query("webhookDeliveries").withIndex("by_status", (e) => e.eq("status", "retrying")).filter(
      (e) => e.and(e.neq(e.field("nextRetryAt"), void 0), e.lte(e.field("nextRetryAt"), t))
    ).take(100);
  }, "handler")
});
export {
  b as getActiveWebhooksForEvent,
  y as getDeliveryById,
  w as getPendingRetries,
  h as getWebhookById
};
//# sourceMappingURL=webhookQueries.js.map
