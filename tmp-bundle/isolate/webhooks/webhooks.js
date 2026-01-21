import {
  b as s,
  c as w
} from "../_deps/MF3OI5Q7.js";
import {
  a as d
} from "../_deps/OFY2WAT7.js";
import "../_deps/ZRD5YQUR.js";
import {
  a as I,
  c as h
} from "../_deps/K33OSGN4.js";
import {
  c as r,
  e as l
} from "../_deps/4U34M3I6.js";
import {
  a
} from "../_deps/RUVYHBJQ.js";

// convex/webhooks/webhooks.ts
l();
var m = [
  "brief.created",
  "brief.updated",
  "draft.created",
  "draft.published",
  "insight.generated",
  "sync.completed",
  "project.created",
  "project.updated"
], j = h({
  args: {
    projectId: r.optional(r.id("projects")),
    organizationId: r.optional(r.id("organizations")),
    name: r.string(),
    url: r.string(),
    events: r.array(r.string()),
    description: r.optional(r.string()),
    headers: r.optional(r.any())
  },
  handler: /* @__PURE__ */ a(async (e, o) => {
    let n = await d.getUserId(e);
    if (!n)
      throw new Error("Unauthorized");
    if (o.projectId)
      await w(e, o.projectId, "admin");
    else if (o.organizationId)
      await s(e, o.organizationId, "admin");
    else
      throw new Error("Either projectId or organizationId is required");
    try {
      new URL(o.url);
    } catch {
      throw new Error("Invalid webhook URL");
    }
    let t = crypto.randomUUID() + "-" + crypto.randomUUID(), i = Date.now();
    return { webhookId: await e.db.insert("webhooks", {
      projectId: o.projectId,
      organizationId: o.organizationId,
      userId: n,
      name: o.name,
      url: o.url,
      secret: t,
      events: o.events,
      isActive: !0,
      description: o.description,
      headers: o.headers,
      createdAt: i,
      updatedAt: i
    }), secret: t };
  }, "handler")
}), z = I({
  args: { projectId: r.id("projects") },
  handler: /* @__PURE__ */ a(async (e, o) => {
    if (!await d.getUserId(e))
      return [];
    try {
      await w(e, o.projectId, "viewer");
    } catch {
      return [];
    }
    return await e.db.query("webhooks").withIndex("by_project", (t) => t.eq("projectId", o.projectId)).collect();
  }, "handler")
}), U = I({
  args: { organizationId: r.id("organizations") },
  handler: /* @__PURE__ */ a(async (e, o) => {
    if (!await d.getUserId(e))
      return [];
    try {
      await s(e, o.organizationId, "viewer");
    } catch {
      return [];
    }
    return await e.db.query("webhooks").withIndex("by_org", (t) => t.eq("organizationId", o.organizationId)).collect();
  }, "handler")
}), v = h({
  args: {
    webhookId: r.id("webhooks"),
    name: r.optional(r.string()),
    url: r.optional(r.string()),
    events: r.optional(r.array(r.string())),
    isActive: r.optional(r.boolean()),
    description: r.optional(r.string()),
    headers: r.optional(r.any())
  },
  handler: /* @__PURE__ */ a(async (e, o) => {
    if (!await d.getUserId(e))
      throw new Error("Unauthorized");
    let t = await e.db.get(o.webhookId);
    if (!t)
      throw new Error("Webhook not found");
    if (t.projectId ? await w(e, t.projectId, "admin") : t.organizationId && await s(e, t.organizationId, "admin"), o.url)
      try {
        new URL(o.url);
      } catch {
        throw new Error("Invalid webhook URL");
      }
    let { webhookId: i, ...c } = o, b = { updatedAt: Date.now() };
    for (let [p, u] of Object.entries(c))
      u !== void 0 && (b[p] = u);
    return await e.db.patch(i, b), { success: !0 };
  }, "handler")
}), E = h({
  args: { webhookId: r.id("webhooks") },
  handler: /* @__PURE__ */ a(async (e, o) => {
    if (!await d.getUserId(e))
      throw new Error("Unauthorized");
    let t = await e.db.get(o.webhookId);
    if (!t)
      throw new Error("Webhook not found");
    t.projectId ? await w(e, t.projectId, "admin") : t.organizationId && await s(e, t.organizationId, "admin");
    let i = await e.db.query("webhookDeliveries").withIndex("by_webhook", (c) => c.eq("webhookId", o.webhookId)).collect();
    for (let c of i)
      await e.db.delete(c._id);
    return await e.db.delete(o.webhookId), { success: !0 };
  }, "handler")
}), q = h({
  args: { webhookId: r.id("webhooks") },
  handler: /* @__PURE__ */ a(async (e, o) => {
    if (!await d.getUserId(e))
      throw new Error("Unauthorized");
    let t = await e.db.get(o.webhookId);
    if (!t)
      throw new Error("Webhook not found");
    t.projectId ? await w(e, t.projectId, "admin") : t.organizationId && await s(e, t.organizationId, "admin");
    let i = crypto.randomUUID() + "-" + crypto.randomUUID();
    return await e.db.patch(o.webhookId, {
      secret: i,
      updatedAt: Date.now()
    }), { secret: i };
  }, "handler")
}), W = I({
  args: {
    webhookId: r.id("webhooks"),
    limit: r.optional(r.number())
  },
  handler: /* @__PURE__ */ a(async (e, o) => {
    if (!await d.getUserId(e))
      return [];
    let t = await e.db.get(o.webhookId);
    if (!t)
      return [];
    try {
      t.projectId ? await w(e, t.projectId, "viewer") : t.organizationId && await s(e, t.organizationId, "viewer");
    } catch {
      return [];
    }
    return await e.db.query("webhookDeliveries").withIndex("by_webhook", (i) => i.eq("webhookId", o.webhookId)).order("desc").take(o.limit || 50);
  }, "handler")
});
export {
  m as WEBHOOK_EVENTS,
  j as createWebhook,
  E as deleteWebhook,
  W as getWebhookDeliveries,
  U as getWebhooksByOrganization,
  z as getWebhooksByProject,
  q as regenerateWebhookSecret,
  v as updateWebhook
};
//# sourceMappingURL=webhooks.js.map
