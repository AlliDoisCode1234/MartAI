import {
  a as s,
  c
} from "../_deps/K33OSGN4.js";
import {
  c as n,
  e as i
} from "../_deps/4U34M3I6.js";
import {
  a as r
} from "../_deps/RUVYHBJQ.js";

// convex/integrations/ga4Connections.ts
i();
var I = c({
  args: {
    projectId: n.id("projects"),
    propertyId: n.string(),
    propertyName: n.string(),
    accessToken: n.string(),
    refreshToken: n.optional(n.string())
  },
  handler: /* @__PURE__ */ r(async (t, e) => {
    let o = await t.db.query("ga4Connections").withIndex("by_project", (d) => d.eq("projectId", e.projectId)).first(), a = {
      projectId: e.projectId,
      propertyId: e.propertyId,
      propertyName: e.propertyName,
      accessToken: e.accessToken,
      refreshToken: e.refreshToken,
      lastSync: Date.now(),
      updatedAt: Date.now()
    };
    return o ? await t.db.patch(o._id, a) : await t.db.insert("ga4Connections", {
      ...a,
      createdAt: Date.now()
    });
  }, "handler")
}), h = s({
  args: { projectId: n.id("projects") },
  handler: /* @__PURE__ */ r(async (t, e) => await t.db.query("ga4Connections").withIndex("by_project", (o) => o.eq("projectId", e.projectId)).first(), "handler")
}), u = c({
  args: {
    connectionId: n.id("ga4Connections")
  },
  handler: /* @__PURE__ */ r(async (t, e) => await t.db.patch(e.connectionId, {
    lastSync: Date.now(),
    updatedAt: Date.now()
  }), "handler")
}), w = c({
  args: {
    connectionId: n.id("ga4Connections")
  },
  handler: /* @__PURE__ */ r(async (t, e) => {
    await t.db.delete(e.connectionId);
  }, "handler")
}), k = c({
  args: {
    connectionId: n.id("ga4Connections"),
    accessToken: n.string(),
    refreshToken: n.optional(n.string())
  },
  handler: /* @__PURE__ */ r(async (t, e) => {
    let o = {
      accessToken: e.accessToken,
      updatedAt: Date.now()
    };
    e.refreshToken && (o.refreshToken = e.refreshToken), await t.db.patch(e.connectionId, o);
  }, "handler")
});
export {
  w as deleteGA4Connection,
  h as getGA4Connection,
  u as updateLastSync,
  k as updateTokens,
  I as upsertGA4Connection
};
//# sourceMappingURL=ga4Connections.js.map
