import {
  b as p,
  e as u
} from "../_deps/GTU362KY.js";
import {
  c as n
} from "../_deps/MF3OI5Q7.js";
import "../_deps/OFY2WAT7.js";
import "../_deps/ZRD5YQUR.js";
import {
  a as s,
  c
} from "../_deps/K33OSGN4.js";
import {
  c as e,
  e as w
} from "../_deps/4U34M3I6.js";
import {
  a as i
} from "../_deps/RUVYHBJQ.js";

// convex/seo/keywords.ts
u();
w();
var m = c({
  args: {
    projectId: e.id("projects"),
    keywords: e.array(
      e.object({
        keyword: e.string(),
        searchVolume: e.optional(e.number()),
        difficulty: e.optional(e.number()),
        cpc: e.optional(e.number()),
        intent: e.optional(e.string()),
        priority: e.optional(e.string())
      })
    )
  },
  handler: /* @__PURE__ */ i(async (r, t) => {
    let o = await n(r, t.projectId, "editor"), d = [];
    for (let a of t.keywords) {
      let y = await r.db.insert("keywords", {
        projectId: t.projectId,
        keyword: a.keyword,
        searchVolume: a.searchVolume,
        difficulty: a.difficulty,
        cpc: a.cpc,
        intent: a.intent,
        priority: a.priority || "medium",
        status: "suggested",
        createdAt: Date.now()
      });
      d.push(y);
    }
    return d.length > 0 && o.userId && await r.scheduler.runAfter(0, p.lib.engagementMilestones.trackEngagement, {
      userId: o.userId,
      milestone: "keyword",
      incrementTotal: !0
    }), d;
  }, "handler")
}), g = s({
  args: { projectId: e.id("projects") },
  handler: /* @__PURE__ */ i(async (r, t) => (await n(r, t.projectId, "viewer"), await r.db.query("keywords").withIndex("by_project", (o) => o.eq("projectId", t.projectId)).order("desc").collect()), "handler")
}), f = c({
  args: {
    keywordId: e.id("keywords"),
    status: e.string(),
    priority: e.optional(e.string())
  },
  handler: /* @__PURE__ */ i(async (r, t) => {
    let o = await r.db.get(t.keywordId);
    return o ? (await n(r, o.projectId, "editor"), await r.db.patch(t.keywordId, {
      status: t.status,
      priority: t.priority || o.priority
    })) : null;
  }, "handler")
}), h = s({
  args: {
    projectId: e.id("projects"),
    status: e.string()
  },
  handler: /* @__PURE__ */ i(async (r, t) => (await n(r, t.projectId, "viewer"), (await r.db.query("keywords").withIndex("by_project", (d) => d.eq("projectId", t.projectId)).collect()).filter((d) => d.status === t.status)), "handler")
}), b = s({
  args: {
    projectId: e.id("projects"),
    paginationOpts: e.any()
    // pagination options (cursor, numItems)
  },
  handler: /* @__PURE__ */ i(async (r, t) => (await n(r, t.projectId, "viewer"), await r.db.query("keywords").withIndex("by_project", (o) => o.eq("projectId", t.projectId)).order("desc").paginate(t.paginationOpts)), "handler")
}), q = s({
  args: { keywordId: e.id("keywords") },
  handler: /* @__PURE__ */ i(async (r, t) => {
    let o = await r.db.get(t.keywordId);
    return o ? (await n(r, o.projectId, "viewer"), o) : null;
  }, "handler")
});
export {
  m as createKeywords,
  q as getKeyword,
  b as getKeywords,
  g as getKeywordsByProject,
  h as getKeywordsByStatus,
  f as updateKeywordStatus
};
//# sourceMappingURL=keywords.js.map
