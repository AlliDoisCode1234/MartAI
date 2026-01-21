"use node";
import {
  a,
  c as I,
  k as c,
  m as r,
  p as m
} from "../_deps/node/KFFAPE6U.js";
import {
  a as l
} from "../_deps/node/V7X2J7BI.js";

// convex/webhooks/webhookActions.ts
I();
m();
var v = 3, w = [6e4, 3e5, 9e5], S = c({
  args: {
    projectId: a.optional(a.id("projects")),
    organizationId: a.optional(a.id("organizations")),
    event: a.string(),
    payload: a.any()
  },
  handler: /* @__PURE__ */ l(async (s, e) => {
    let t = await s.runQuery(
      r.webhooks.webhookQueries.getActiveWebhooksForEvent,
      {
        projectId: e.projectId,
        organizationId: e.organizationId,
        event: e.event
      }
    );
    if (t.length === 0)
      return console.log(`[Webhooks] No webhooks registered for event: ${e.event}`), { delivered: 0 };
    console.log(`[Webhooks] Triggering ${t.length} webhooks for event: ${e.event}`);
    for (let i of t)
      await s.runMutation(r.webhooks.webhookMutations.createDeliveryAndSend, {
        webhookId: i._id,
        event: e.event,
        payload: e.payload
      });
    return { delivered: t.length };
  }, "handler")
}), T = c({
  args: {
    deliveryId: a.id("webhookDeliveries")
  },
  handler: /* @__PURE__ */ l(async (s, e) => {
    let t = await s.runQuery(r.webhooks.webhookQueries.getDeliveryById, {
      deliveryId: e.deliveryId
    });
    if (!t)
      return console.error(`[Webhooks] Delivery not found: ${e.deliveryId}`), { success: !1, error: "Delivery not found" };
    let i = await s.runQuery(r.webhooks.webhookQueries.getWebhookById, {
      webhookId: t.webhookId
    });
    if (!i || !i.isActive)
      return await s.runMutation(r.webhooks.webhookMutations.updateDeliveryStatus, {
        deliveryId: e.deliveryId,
        status: "failed",
        error: "Webhook is inactive or deleted"
      }), { success: !1, error: "Webhook inactive" };
    let h = JSON.stringify({
      event: t.event,
      timestamp: Date.now(),
      payload: t.payload
    }), b = (await import("node:crypto")).createHmac("sha256", i.secret).update(h).digest("hex"), p = {
      "Content-Type": "application/json",
      "X-Webhook-Event": t.event,
      "X-Webhook-Signature": `sha256=${b}`,
      "X-Webhook-Timestamp": Date.now().toString(),
      ...i.headers || {}
    }, y = Date.now();
    try {
      let o = await fetch(i.url, {
        method: "POST",
        headers: p,
        body: h
      }), d = Date.now() - y, n = await o.text().catch(() => "");
      if (o.ok)
        return await s.runMutation(r.webhooks.webhookMutations.updateDeliveryStatus, {
          deliveryId: e.deliveryId,
          status: "success",
          responseStatus: o.status,
          responseBody: n.substring(0, 500),
          responseTime: d
        }), { success: !0 };
      {
        let u = t.attempts + 1;
        if (u < v) {
          let k = Date.now() + w[u - 1];
          await s.runMutation(r.webhooks.webhookMutations.updateDeliveryStatus, {
            deliveryId: e.deliveryId,
            status: "retrying",
            responseStatus: o.status,
            responseBody: n.substring(0, 500),
            responseTime: d,
            attempts: u,
            nextRetryAt: k,
            error: `HTTP ${o.status}`
          });
        } else
          await s.runMutation(r.webhooks.webhookMutations.updateDeliveryStatus, {
            deliveryId: e.deliveryId,
            status: "failed",
            responseStatus: o.status,
            responseBody: n.substring(0, 500),
            responseTime: d,
            attempts: u,
            error: `Max retries exceeded. Last: HTTP ${o.status}`
          });
        return { success: !1, status: o.status };
      }
    } catch (o) {
      let d = Date.now() - y, n = t.attempts + 1;
      if (n < v) {
        let u = Date.now() + w[n - 1];
        await s.runMutation(r.webhooks.webhookMutations.updateDeliveryStatus, {
          deliveryId: e.deliveryId,
          status: "retrying",
          responseTime: d,
          attempts: n,
          nextRetryAt: u,
          error: o.message
        });
      } else
        await s.runMutation(r.webhooks.webhookMutations.updateDeliveryStatus, {
          deliveryId: e.deliveryId,
          status: "failed",
          responseTime: d,
          attempts: n,
          error: `Max retries exceeded. Last: ${o.message}`
        });
      return { success: !1, error: o.message };
    }
  }, "handler")
});
export {
  T as sendWebhook,
  S as triggerWebhook
};
//# sourceMappingURL=webhookActions.js.map
