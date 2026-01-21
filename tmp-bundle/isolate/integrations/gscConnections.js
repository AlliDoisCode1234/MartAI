import {
  a,
  c as r
} from "../_deps/K33OSGN4.js";
import {
  c as n,
  e as d
} from "../_deps/4U34M3I6.js";
import {
  a as c
} from "../_deps/RUVYHBJQ.js";

// convex/integrations/gscConnections.ts
d();
var I = r({
  args: {
    projectId: n.id("projects"),
    siteUrl: n.string(),
    accessToken: n.string(),
    refreshToken: n.optional(n.string())
  },
  handler: /* @__PURE__ */ c(async (t, e) => {
    let o = await t.db.query("gscConnections").withIndex("by_project", (i) => i.eq("projectId", e.projectId)).first(), s = {
      projectId: e.projectId,
      siteUrl: e.siteUrl,
      accessToken: e.accessToken,
      refreshToken: e.refreshToken,
      lastSync: Date.now(),
      updatedAt: Date.now()
    };
    return o ? await t.db.patch(o._id, s) : await t.db.insert("gscConnections", {
      ...s,
      createdAt: Date.now()
    });
  }, "handler")
}), u = a({
  args: { projectId: n.id("projects") },
  handler: /* @__PURE__ */ c(async (t, e) => await t.db.query("gscConnections").withIndex("by_project", (o) => o.eq("projectId", e.projectId)).first(), "handler")
}), w = r({
  args: {
    connectionId: n.id("gscConnections")
  },
  handler: /* @__PURE__ */ c(async (t, e) => await t.db.patch(e.connectionId, {
    lastSync: Date.now(),
    updatedAt: Date.now()
  }), "handler")
}), k = r({
  args: {
    connectionId: n.id("gscConnections")
  },
  handler: /* @__PURE__ */ c(async (t, e) => {
    await t.db.delete(e.connectionId);
  }, "handler")
}), l = r({
  args: {
    connectionId: n.id("gscConnections"),
    accessToken: n.string(),
    refreshToken: n.optional(n.string())
  },
  handler: /* @__PURE__ */ c(async (t, e) => {
    let o = {
      accessToken: e.accessToken,
      updatedAt: Date.now()
    };
    e.refreshToken && (o.refreshToken = e.refreshToken), await t.db.patch(e.connectionId, o);
  }, "handler")
});
export {
  k as deleteGSCConnection,
  u as getGSCConnection,
  w as updateLastSync,
  l as updateTokens,
  I as upsertGSCConnection
};
//# sourceMappingURL=gscConnections.js.map
