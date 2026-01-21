import {
  a
} from "../_deps/K33OSGN4.js";
import {
  c as n,
  e as l
} from "../_deps/4U34M3I6.js";
import {
  a as s
} from "../_deps/RUVYHBJQ.js";

// convex/integrations/wordpress.ts
l();
var f = a({
  args: {
    projectId: n.id("projects")
  },
  handler: /* @__PURE__ */ s(async (r, d) => {
    let e = await r.db.query("oauthTokens").withIndex("by_platform", (t) => t.eq("platform", "wordpress")).first();
    if (!e) {
      let t = await r.db.get(d.projectId);
      if (t) {
        let i = await r.db.query("clients").withIndex("by_user", (o) => o.eq("userId", t.userId)).first();
        i && (e = await r.db.query("oauthTokens").withIndex(
          "by_client_platform",
          (o) => o.eq("clientId", i._id).eq("platform", "wordpress")
        ).first());
      }
    }
    return e ? {
      url: e.siteUrl,
      username: "admin",
      // Placeholder
      password: e.accessToken
      // Placeholder
    } : null;
  }, "handler")
});
export {
  f as getConnection
};
//# sourceMappingURL=wordpress.js.map
