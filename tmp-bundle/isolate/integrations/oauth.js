import {
  a,
  c as r
} from "../_deps/K33OSGN4.js";
import {
  c as t,
  e as l
} from "../_deps/4U34M3I6.js";
import {
  a as i
} from "../_deps/RUVYHBJQ.js";

// convex/integrations/oauth.ts
l();
var h = r({
  args: {
    clientId: t.id("clients"),
    platform: t.string(),
    accessToken: t.string(),
    refreshToken: t.optional(t.string()),
    tokenExpiry: t.optional(t.number()),
    siteUrl: t.string(),
    shopifyShop: t.optional(t.string()),
    wordpressSiteId: t.optional(t.string())
  },
  handler: /* @__PURE__ */ i(async (o, e) => {
    let n = await o.db.query("oauthTokens").withIndex(
      "by_client_platform",
      (d) => d.eq("clientId", e.clientId).eq("platform", e.platform)
    ).first(), s = {
      clientId: e.clientId,
      platform: e.platform,
      accessToken: e.accessToken,
      refreshToken: e.refreshToken,
      tokenExpiry: e.tokenExpiry,
      siteUrl: e.siteUrl,
      shopifyShop: e.shopifyShop,
      wordpressSiteId: e.wordpressSiteId,
      updatedAt: Date.now()
    };
    return n ? await o.db.patch(n._id, s) : await o.db.insert("oauthTokens", {
      ...s,
      createdAt: Date.now()
    });
  }, "handler")
}), f = a({
  args: {
    clientId: t.id("clients"),
    platform: t.string()
  },
  handler: /* @__PURE__ */ i(async (o, e) => await o.db.query("oauthTokens").withIndex(
    "by_client_platform",
    (n) => n.eq("clientId", e.clientId).eq("platform", e.platform)
  ).first(), "handler")
}), k = r({
  args: {
    tokenId: t.id("oauthTokens")
  },
  handler: /* @__PURE__ */ i(async (o, e) => {
    await o.db.delete(e.tokenId);
  }, "handler")
});
export {
  f as getOAuthToken,
  k as removeOAuthToken,
  h as storeOAuthToken
};
//# sourceMappingURL=oauth.js.map
