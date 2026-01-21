import {
  a as p
} from "../_deps/K33OSGN4.js";
import {
  c as a,
  e as d
} from "../_deps/4U34M3I6.js";
import {
  a as s
} from "../_deps/RUVYHBJQ.js";

// convex/integrations/integrations.ts
d();
var y = p({
  args: { projectId: a.id("projects") },
  handler: /* @__PURE__ */ s(async (o, t) => {
    let r = await o.db.query("ga4Connections").withIndex("by_project", (e) => e.eq("projectId", t.projectId)).first(), n = await o.db.query("gscConnections").withIndex("by_project", (e) => e.eq("projectId", t.projectId)).first(), c = await o.db.query("oauthTokens").collect();
    return {
      projectId: t.projectId,
      ga4: r ? {
        connected: !0,
        propertyName: r.propertyName,
        lastSync: r.lastSync
      } : { connected: !1 },
      gsc: n ? {
        connected: !0,
        siteUrl: n.siteUrl,
        lastSync: n.lastSync
      } : { connected: !1 },
      cms: {
        wordpress: c.some((e) => e.platform === "wordpress"),
        shopify: c.some((e) => e.platform === "shopify"),
        webflow: c.some((e) => e.platform === "webflow")
      }
    };
  }, "handler")
});
export {
  y as getIntegrationsByProject
};
//# sourceMappingURL=integrations.js.map
