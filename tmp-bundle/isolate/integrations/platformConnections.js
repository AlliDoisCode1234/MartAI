import {
  a as l,
  c as r,
  d as s
} from "../_deps/K33OSGN4.js";
import {
  c as t,
  e as c
} from "../_deps/4U34M3I6.js";
import {
  a as i
} from "../_deps/RUVYHBJQ.js";

// convex/integrations/platformConnections.ts
c();
var p = t.union(
  t.literal("wordpress"),
  t.literal("shopify"),
  t.literal("wix"),
  t.literal("webflow"),
  t.literal("ghost")
), m = l({
  args: {
    projectId: t.id("projects"),
    platform: p
  },
  handler: /* @__PURE__ */ i(async (o, e) => await o.db.query("platformConnections").withIndex(
    "by_project_platform",
    (a) => a.eq("projectId", e.projectId).eq("platform", e.platform)
  ).first(), "handler")
}), b = l({
  args: {
    projectId: t.id("projects")
  },
  handler: /* @__PURE__ */ i(async (o, e) => await o.db.query("platformConnections").withIndex("by_project", (a) => a.eq("projectId", e.projectId)).collect(), "handler")
}), j = r({
  args: {
    projectId: t.id("projects"),
    platform: p,
    siteUrl: t.string(),
    siteName: t.optional(t.string()),
    credentials: t.object({
      username: t.optional(t.string()),
      applicationPassword: t.optional(t.string()),
      apiKey: t.optional(t.string()),
      accessToken: t.optional(t.string()),
      refreshToken: t.optional(t.string())
    }),
    defaultPostType: t.optional(t.union(t.literal("post"), t.literal("page"))),
    defaultStatus: t.optional(
      t.union(t.literal("draft"), t.literal("publish"), t.literal("private"))
    )
  },
  handler: /* @__PURE__ */ i(async (o, e) => {
    let a = await o.db.query("platformConnections").withIndex(
      "by_project_platform",
      (d) => d.eq("projectId", e.projectId).eq("platform", e.platform)
    ).first(), n = Date.now();
    return a ? (await o.db.patch(a._id, {
      siteUrl: e.siteUrl,
      siteName: e.siteName,
      credentials: e.credentials,
      defaultPostType: e.defaultPostType,
      defaultStatus: e.defaultStatus,
      isValid: !1,
      // Reset validation
      updatedAt: n
    }), a._id) : await o.db.insert("platformConnections", {
      projectId: e.projectId,
      platform: e.platform,
      siteUrl: e.siteUrl,
      siteName: e.siteName,
      credentials: e.credentials,
      isValid: !1,
      defaultPostType: e.defaultPostType,
      defaultStatus: e.defaultStatus,
      createdAt: n,
      updatedAt: n
    });
  }, "handler")
}), w = r({
  args: {
    connectionId: t.id("platformConnections")
  },
  handler: /* @__PURE__ */ i(async (o, e) => (await o.db.delete(e.connectionId), { success: !0 }), "handler")
}), y = s({
  args: {
    connectionId: t.id("platformConnections"),
    isValid: t.boolean(),
    siteName: t.optional(t.string()),
    validationError: t.optional(t.string()),
    capabilities: t.optional(
      t.object({
        canPublishPosts: t.optional(t.boolean()),
        canPublishPages: t.optional(t.boolean()),
        canUploadMedia: t.optional(t.boolean()),
        canManageCategories: t.optional(t.boolean())
      })
    )
  },
  handler: /* @__PURE__ */ i(async (o, e) => {
    await o.db.patch(e.connectionId, {
      isValid: e.isValid,
      siteName: e.siteName,
      validationError: e.validationError,
      capabilities: e.capabilities,
      lastValidatedAt: Date.now(),
      updatedAt: Date.now()
    });
  }, "handler")
});
export {
  w as deleteConnection,
  m as getConnection,
  b as listConnections,
  p as platformValidator,
  j as saveConnection,
  y as updateValidationStatus
};
//# sourceMappingURL=platformConnections.js.map
