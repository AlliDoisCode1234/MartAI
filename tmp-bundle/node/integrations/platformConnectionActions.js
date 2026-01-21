"use node";
import {
  a as s,
  c as w,
  j as l,
  l as u,
  m as r,
  p as P
} from "../_deps/node/KFFAPE6U.js";
import {
  a as c
} from "../_deps/node/V7X2J7BI.js";

// convex/integrations/platformConnectionActions.ts
w();
P();
var I = s.union(
  s.literal("wordpress"),
  s.literal("shopify"),
  s.literal("wix"),
  s.literal("webflow"),
  s.literal("ghost")
), N = l({
  args: {
    siteUrl: s.string(),
    username: s.string(),
    applicationPassword: s.string()
  },
  handler: /* @__PURE__ */ c(async (o, e) => {
    let t = e.siteUrl.replace(/\/$/, ""), n = `${t}/wp-json/wp/v2`, p = "Basic " + Buffer.from(`${e.username}:${e.applicationPassword}`).toString("base64");
    try {
      let a = await fetch(`${t}/wp-json`, {
        headers: { Authorization: p }
      });
      if (!a.ok)
        return {
          success: !1,
          error: `Cannot connect to WordPress site. Status: ${a.status}`
        };
      let f = (await a.json()).name || "WordPress Site", d = await fetch(`${n}/users/me?context=edit`, {
        headers: { Authorization: p }
      });
      if (!d.ok)
        return {
          success: !1,
          error: "Invalid username or Application Password"
        };
      let i = (await d.json()).capabilities || {};
      return {
        success: !0,
        siteName: f,
        capabilities: {
          canPublishPosts: i.publish_posts || i.administrator || !1,
          canPublishPages: i.publish_pages || i.administrator || !1,
          canUploadMedia: i.upload_files || i.administrator || !1
        }
      };
    } catch (a) {
      return {
        success: !1,
        error: a instanceof Error ? a.message : "Connection failed"
      };
    }
  }, "handler")
}), U = l({
  args: {
    projectId: s.id("projects"),
    siteUrl: s.string(),
    username: s.string(),
    applicationPassword: s.string()
  },
  handler: /* @__PURE__ */ c(async (o, e) => {
    let t = await o.runAction(
      r.integrations.platformConnectionActions.testWordPressConnection,
      {
        siteUrl: e.siteUrl,
        username: e.username,
        applicationPassword: e.applicationPassword
      }
    );
    if (!t.success)
      return {
        success: !1,
        error: t.error
      };
    let n = await o.runMutation(
      u.integrations.platformConnections.saveConnection,
      {
        projectId: e.projectId,
        platform: "wordpress",
        siteUrl: e.siteUrl,
        siteName: t.siteName,
        credentials: {
          username: e.username,
          applicationPassword: e.applicationPassword
        }
      }
    );
    return await o.runMutation(r.integrations.platformConnections.updateValidationStatus, {
      connectionId: n,
      isValid: !0,
      siteName: t.siteName,
      capabilities: t.capabilities
    }), {
      success: !0,
      connectionId: n,
      siteName: t.siteName
    };
  }, "handler")
}), j = l({
  args: {
    connectionId: s.id("platformConnections")
  },
  handler: /* @__PURE__ */ c(async (o, e) => {
    let t = await o.runQuery(u.integrations.platformConnections.getConnection, {
      projectId: e.connectionId,
      // This is a workaround
      platform: "wordpress"
    });
    if (!t)
      return {
        success: !1,
        error: "Connection not found"
      };
    let n = await o.runAction(
      r.integrations.platformConnectionActions.testWordPressConnection,
      {
        siteUrl: t.siteUrl,
        username: t.credentials.username || "",
        applicationPassword: t.credentials.applicationPassword || ""
      }
    );
    return await o.runMutation(r.integrations.platformConnections.updateValidationStatus, {
      connectionId: e.connectionId,
      isValid: n.success,
      siteName: n.siteName,
      validationError: n.error,
      capabilities: n.capabilities
    }), {
      success: n.success,
      siteName: n.siteName,
      error: n.error
    };
  }, "handler")
});
export {
  U as connectWordPress,
  N as testWordPressConnection,
  j as validateWordPressConnection
};
//# sourceMappingURL=platformConnectionActions.js.map
