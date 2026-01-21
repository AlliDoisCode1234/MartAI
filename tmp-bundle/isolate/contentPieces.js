import {
  a as l
} from "./_deps/OFY2WAT7.js";
import "./_deps/ZRD5YQUR.js";
import {
  a as u,
  c as p
} from "./_deps/K33OSGN4.js";
import {
  c as e,
  e as j,
  n as f,
  x as y
} from "./_deps/4U34M3I6.js";
import {
  a as c
} from "./_deps/RUVYHBJQ.js";

// convex/contentPieces.ts
y();
j();
var E = u({
  args: {
    projectId: e.id("projects"),
    status: e.optional(
      e.union(
        e.literal("generating"),
        e.literal("draft"),
        e.literal("approved"),
        e.literal("published"),
        e.literal("scheduled")
      )
    ),
    limit: e.optional(e.number())
  },
  handler: /* @__PURE__ */ c(async (r, t) => {
    if (!await l.getUserId(r)) return [];
    let o = await r.db.query("contentPieces").withIndex("by_project", (a) => a.eq("projectId", t.projectId)).collect(), i = o;
    return t.status && (i = o.filter((a) => a.status === t.status)), i.sort((a, h) => h.updatedAt - a.updatedAt), t.limit && (i = i.slice(0, t.limit)), i;
  }, "handler")
}), q = u({
  args: {
    projectId: e.id("projects"),
    status: e.optional(
      e.union(
        e.literal("generating"),
        e.literal("draft"),
        e.literal("approved"),
        e.literal("published"),
        e.literal("scheduled")
      )
    ),
    paginationOpts: f
  },
  handler: /* @__PURE__ */ c(async (r, t) => {
    if (!await l.getUserId(r))
      return { page: [], isDone: !0, continueCursor: "" };
    let n = await r.db.query("contentPieces").withIndex("by_project_created", (o) => o.eq("projectId", t.projectId)).order("desc").paginate(t.paginationOpts);
    return t.status ? {
      ...n,
      page: n.page.filter((o) => o.status === t.status)
    } : n;
  }, "handler")
}), v = u({
  args: {
    contentPieceId: e.id("contentPieces")
  },
  handler: /* @__PURE__ */ c(async (r, t) => await l.getUserId(r) ? await r.db.get(t.contentPieceId) : null, "handler")
}), z = u({
  args: {
    projectId: e.id("projects"),
    startDate: e.optional(e.number()),
    endDate: e.optional(e.number())
  },
  handler: /* @__PURE__ */ c(async (r, t) => {
    if (!await l.getUserId(r)) return [];
    let o = (await r.db.query("contentPieces").withIndex("by_project_scheduled", (i) => i.eq("projectId", t.projectId)).collect()).filter((i) => i.scheduledDate != null);
    return t.startDate && (o = o.filter((i) => (i.scheduledDate ?? 0) >= t.startDate)), t.endDate && (o = o.filter((i) => (i.scheduledDate ?? 0) <= t.endDate)), o.sort((i, a) => (i.scheduledDate ?? 0) - (a.scheduledDate ?? 0)), o;
  }, "handler")
}), C = p({
  args: {
    projectId: e.id("projects"),
    contentType: e.union(
      // Core Pages
      e.literal("homepage"),
      e.literal("about"),
      e.literal("service"),
      e.literal("landing"),
      // Blog Content
      e.literal("blog"),
      e.literal("blogVersus"),
      e.literal("blogVideo"),
      e.literal("contentRefresh"),
      // Conversion
      e.literal("leadMagnet"),
      e.literal("paidProduct"),
      // Local/Geo
      e.literal("areasWeServe"),
      // Specialty
      e.literal("employment"),
      e.literal("mentorship"),
      e.literal("donate"),
      e.literal("events"),
      e.literal("partner"),
      e.literal("program")
    ),
    title: e.string(),
    keywords: e.array(e.string()),
    clusterId: e.optional(e.id("keywordClusters"))
  },
  handler: /* @__PURE__ */ c(async (r, t) => {
    let d = await l.getUserId(r);
    if (!d) throw new Error("Unauthorized");
    let n = await r.db.get(t.projectId);
    if (!n || n.userId !== d)
      throw new Error("Project not found");
    let o = Date.now();
    return await r.db.insert("contentPieces", {
      projectId: t.projectId,
      clusterId: t.clusterId,
      contentType: t.contentType,
      title: t.title,
      h2Outline: [],
      keywords: t.keywords,
      status: "generating",
      createdAt: o,
      updatedAt: o
    });
  }, "handler")
}), S = p({
  args: {
    contentPieceId: e.id("contentPieces"),
    title: e.optional(e.string()),
    content: e.optional(e.string()),
    h2Outline: e.optional(e.array(e.string())),
    metaTitle: e.optional(e.string()),
    metaDescription: e.optional(e.string()),
    status: e.optional(
      e.union(
        e.literal("generating"),
        e.literal("draft"),
        e.literal("approved"),
        e.literal("published"),
        e.literal("scheduled")
      )
    ),
    seoScore: e.optional(e.number()),
    wordCount: e.optional(e.number())
  },
  handler: /* @__PURE__ */ c(async (r, t) => {
    let d = await l.getUserId(r);
    if (!d) throw new Error("Unauthorized");
    let n = await r.db.get(t.contentPieceId);
    if (!n) throw new Error("Content not found");
    let o = await r.db.get(n.projectId);
    if (!o || o.userId !== d)
      throw new Error("Unauthorized");
    let { contentPieceId: i, ...a } = t, h = Object.fromEntries(
      Object.entries(a).filter(([, w]) => w !== void 0)
    );
    return await r.db.patch(i, {
      ...h,
      updatedAt: Date.now()
    }), i;
  }, "handler")
}), A = p({
  args: {
    contentPieceId: e.id("contentPieces")
  },
  handler: /* @__PURE__ */ c(async (r, t) => {
    let d = await l.getUserId(r);
    if (!d) throw new Error("Unauthorized");
    let n = await r.db.get(t.contentPieceId);
    if (!n) throw new Error("Content not found");
    let o = await r.db.get(n.projectId);
    if (!o || o.userId !== d)
      throw new Error("Unauthorized");
    return await r.db.delete(t.contentPieceId), { success: !0 };
  }, "handler")
}), O = p({
  args: {
    contentPieceId: e.id("contentPieces")
  },
  handler: /* @__PURE__ */ c(async (r, t) => {
    let d = await l.getUserId(r);
    if (!d) throw new Error("Unauthorized");
    let n = await r.db.get(t.contentPieceId);
    if (!n) throw new Error("Content not found");
    let o = await r.db.get(n.projectId);
    if (!o || o.userId !== d)
      throw new Error("Unauthorized");
    let i = Date.now();
    return await r.db.insert("contentPieces", {
      projectId: n.projectId,
      clusterId: n.clusterId,
      contentType: n.contentType,
      title: `${n.title} (Copy)`,
      content: n.content,
      h2Outline: n.h2Outline || [],
      metaTitle: n.metaTitle,
      metaDescription: n.metaDescription,
      keywords: n.keywords || [],
      status: "draft",
      // Always start as draft
      seoScore: n.seoScore,
      wordCount: n.wordCount,
      createdAt: i,
      updatedAt: i
    });
  }, "handler")
}), T = u({
  args: {
    projectId: e.id("projects")
  },
  handler: /* @__PURE__ */ c(async (r, t) => {
    if (!await l.getUserId(r)) return null;
    let n = await r.db.query("contentPieces").withIndex("by_project", (s) => s.eq("projectId", t.projectId)).collect(), o = n.length, i = n.filter((s) => s.status === "draft").length, a = n.filter((s) => s.status === "approved").length, h = n.filter((s) => s.status === "published").length, w = n.filter((s) => s.status === "scheduled").length, I = n.filter((s) => s.seoScore !== void 0), b = I.length > 0 ? Math.round(
      I.reduce((s, g) => s + (g.seoScore ?? 0), 0) / I.length
    ) : null;
    return {
      total: o,
      drafts: i,
      approved: a,
      published: h,
      scheduled: w,
      avgScore: b
    };
  }, "handler")
}), _ = p({
  args: {
    contentPieceId: e.id("contentPieces"),
    publishDate: e.number()
  },
  handler: /* @__PURE__ */ c(async (r, t) => {
    let d = await l.getUserId(r);
    if (!d) throw new Error("Unauthorized");
    let n = await r.db.get(t.contentPieceId);
    if (!n) throw new Error("Content not found");
    let o = await r.db.get(n.projectId);
    if (!o || o.userId !== d)
      throw new Error("Unauthorized");
    if (t.publishDate <= Date.now())
      throw new Error("Publish date must be in the future");
    return await r.db.patch(t.contentPieceId, {
      status: "scheduled",
      scheduledDate: t.publishDate,
      // Keep arg name if needed but map to schema field
      updatedAt: Date.now()
    }), { success: !0, publishDate: t.publishDate };
  }, "handler")
}), k = u({
  args: {
    projectId: e.id("projects"),
    startDate: e.optional(e.number()),
    endDate: e.optional(e.number())
  },
  handler: /* @__PURE__ */ c(async (r, t) => {
    if (!await l.getUserId(r)) return [];
    let o = (await r.db.query("contentPieces").withIndex("by_project", (i) => i.eq("projectId", t.projectId)).collect()).filter((i) => i.status === "scheduled" && i.scheduledDate);
    return t.startDate && (o = o.filter((i) => (i.scheduledDate ?? 0) >= (t.startDate ?? 0))), t.endDate && (o = o.filter((i) => (i.scheduledDate ?? 0) <= (t.endDate ?? 0))), o.sort((i, a) => (i.scheduledDate ?? 0) - (a.scheduledDate ?? 0)), o;
  }, "handler")
}), B = p({
  args: {
    contentPieceId: e.id("contentPieces")
  },
  handler: /* @__PURE__ */ c(async (r, t) => {
    let d = await l.getUserId(r);
    if (!d) throw new Error("Unauthorized");
    let n = await r.db.get(t.contentPieceId);
    if (!n) throw new Error("Content not found");
    let o = await r.db.get(n.projectId);
    if (!o || o.userId !== d)
      throw new Error("Unauthorized");
    return await r.db.patch(t.contentPieceId, {
      status: "draft",
      scheduledDate: void 0,
      updatedAt: Date.now()
    }), { success: !0 };
  }, "handler")
});
export {
  C as create,
  O as duplicate,
  v as getById,
  T as getStats,
  E as listByProject,
  q as listByProjectPaginated,
  z as listByScheduledDate,
  k as listScheduled,
  A as remove,
  _ as schedule,
  B as unschedule,
  S as update
};
//# sourceMappingURL=contentPieces.js.map
