import {
  b as u,
  e as w
} from "../_deps/GTU362KY.js";
import {
  a as c,
  b as p,
  c as d,
  d as h
} from "../_deps/K33OSGN4.js";
import {
  c as t,
  e as g
} from "../_deps/4U34M3I6.js";
import {
  a as n
} from "../_deps/RUVYHBJQ.js";

// convex/publishing/scheduledPosts.ts
g();
w();
var m = d({
  args: {
    contentPieceId: t.id("contentPieces"),
    projectId: t.id("projects"),
    publishDate: t.number(),
    timezone: t.string(),
    platform: t.string(),
    tags: t.optional(t.array(t.string())),
    categories: t.optional(t.array(t.string())),
    slug: t.optional(t.string()),
    status: t.string()
  },
  handler: /* @__PURE__ */ n(async (e, s) => {
    let o = await e.db.insert("scheduledPosts", {
      ...s,
      tags: s.tags ?? [],
      categories: s.categories ?? [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }), r = s.publishDate - Date.now(), a = u.publishing.scheduledPosts.publishPost;
    return await e.scheduler.runAfter(r > 0 ? r : 0, a, { postId: o }), o;
  }, "handler")
}), I = h({
  args: { postId: t.id("scheduledPosts") },
  handler: /* @__PURE__ */ n(async (e, { postId: s }) => {
    let o = await e.db.get(s);
    if (o && o.status === "scheduled") {
      await e.db.patch(s, { status: "publishing", updatedAt: Date.now() });
      try {
        if (!o.contentPieceId)
          throw new Error("Legacy post - missing contentPieceId. Please delete and recreate.");
        if (!await e.db.get(o.contentPieceId)) throw new Error("Content piece not found");
        let a = await e.db.get(o.projectId);
        if (!a) throw new Error("Project not found");
        let i = await e.db.query("clients").withIndex("by_user", (l) => l.eq("userId", a.userId)).first();
        if (!i) throw new Error("Client not found");
        if (!await e.db.query("oauthTokens").withIndex(
          "by_client_platform",
          (l) => l.eq("clientId", i._id).eq("platform", o.platform)
        ).first()) throw new Error("OAuth connection not found");
        await e.db.patch(s, { updatedAt: Date.now() });
      } catch (r) {
        await e.db.patch(s, {
          status: "failed",
          errorMessage: r instanceof Error ? r.message : "Unknown error",
          updatedAt: Date.now()
        });
      }
    }
  }, "handler")
}), D = c({
  args: { projectId: t.id("projects") },
  handler: /* @__PURE__ */ n(async (e, { projectId: s }) => e.db.query("scheduledPosts").withIndex("by_project", (o) => o.eq("projectId", s)).collect(), "handler")
}), j = c({
  args: { projectId: t.id("projects"), status: t.string() },
  handler: /* @__PURE__ */ n(async (e, s) => (await e.db.query("scheduledPosts").withIndex("by_project", (r) => r.eq("projectId", s.projectId)).collect()).filter((r) => r.status === s.status), "handler")
}), A = d({
  args: {
    postId: t.id("scheduledPosts"),
    publishDate: t.optional(t.number()),
    timezone: t.optional(t.string()),
    tags: t.optional(t.array(t.string())),
    categories: t.optional(t.array(t.string())),
    slug: t.optional(t.string()),
    status: t.optional(t.string()),
    publishedUrl: t.optional(t.string()),
    errorMessage: t.optional(t.string())
  },
  handler: /* @__PURE__ */ n(async (e, s) => {
    let { postId: o, ...r } = s, a = await e.db.get(o);
    if (!a) throw new Error("Post not found");
    if (r.publishDate && r.publishDate !== a.publishDate) {
      let i = r.publishDate - Date.now();
      await e.scheduler.runAfter(
        i > 0 ? i : 0,
        u.publishing.scheduledPosts.publishPost,
        { postId: o }
      );
    }
    return e.db.patch(o, {
      ...r,
      updatedAt: Date.now()
    });
  }, "handler")
}), q = d({
  args: { postId: t.id("scheduledPosts") },
  handler: /* @__PURE__ */ n(async (e, { postId: s }) => e.db.patch(s, {
    status: "cancelled",
    updatedAt: Date.now()
  }), "handler")
}), E = d({
  args: { postId: t.id("scheduledPosts") },
  handler: /* @__PURE__ */ n(async (e, { postId: s }) => e.db.delete(s), "handler")
}), M = c({
  args: { postId: t.id("scheduledPosts") },
  handler: /* @__PURE__ */ n(async (e, { postId: s }) => await e.db.get(s), "handler")
}), S = p({
  args: { beforeTime: t.number() },
  handler: /* @__PURE__ */ n(async (e, { beforeTime: s }) => (await e.db.query("scheduledPosts").collect()).filter((r) => r.status === "scheduled" && r.publishDate <= s), "handler")
}), _ = d({
  args: { postId: t.id("scheduledPosts") },
  handler: /* @__PURE__ */ n(async (e, { postId: s }) => {
    let o = await e.db.get(s);
    if (!o) throw new Error("Post not found");
    if (o.status !== "failed")
      throw new Error("Post is not in failed status");
    await e.db.patch(s, {
      status: "scheduled",
      errorMessage: void 0,
      updatedAt: Date.now()
    });
    let r = Math.max(0, o.publishDate - Date.now());
    return await e.scheduler.runAfter(r, u.publishing.scheduledPosts.publishPost, {
      postId: s
    }), s;
  }, "handler")
});
export {
  q as cancelScheduledPost,
  m as createScheduledPost,
  E as deleteScheduledPost,
  S as getDuePosts,
  M as getScheduledPostById,
  D as getScheduledPosts,
  j as getScheduledPostsByStatus,
  I as publishPost,
  _ as retryFailedPublish,
  A as updateScheduledPost
};
//# sourceMappingURL=scheduledPosts.js.map
