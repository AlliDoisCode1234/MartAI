import {
  a as o,
  c as a
} from "../_deps/K33OSGN4.js";
import {
  c as e,
  e as d
} from "../_deps/4U34M3I6.js";
import {
  a as n
} from "../_deps/RUVYHBJQ.js";

// convex/seo/seoAudits.ts
d();
var u = a({
  args: {
    clientId: e.optional(e.id("clients")),
    projectId: e.optional(e.id("projects")),
    website: e.string(),
    overallScore: e.number(),
    technicalSeo: e.object({
      score: e.number(),
      issues: e.array(e.string()),
      recommendations: e.array(e.string())
    }),
    onPageSeo: e.object({
      score: e.number(),
      issues: e.array(e.string()),
      recommendations: e.array(e.string())
    }),
    contentQuality: e.object({
      score: e.number(),
      issues: e.array(e.string()),
      recommendations: e.array(e.string())
    }),
    backlinks: e.object({
      score: e.number(),
      issues: e.array(e.string()),
      recommendations: e.array(e.string())
    }),
    priorityActions: e.array(e.string()),
    pageSpeed: e.optional(e.number()),
    mobileFriendly: e.optional(e.boolean()),
    sslEnabled: e.optional(e.boolean()),
    indexedPages: e.optional(e.number()),
    crawlErrors: e.optional(e.number())
  },
  handler: /* @__PURE__ */ n(async (r, t) => {
    if (!t.clientId && !t.projectId)
      throw new Error("Either clientId or projectId must be provided.");
    return await r.db.insert("seoAudits", {
      clientId: t.clientId,
      projectId: t.projectId,
      website: t.website,
      overallScore: t.overallScore,
      technicalSeo: t.technicalSeo,
      onPageSeo: t.onPageSeo,
      contentQuality: t.contentQuality,
      backlinks: t.backlinks,
      priorityActions: t.priorityActions,
      pageSpeed: t.pageSpeed,
      mobileFriendly: t.mobileFriendly,
      sslEnabled: t.sslEnabled,
      indexedPages: t.indexedPages,
      crawlErrors: t.crawlErrors,
      createdAt: Date.now()
    });
  }, "handler")
}), b = o({
  args: { clientId: e.id("clients") },
  handler: /* @__PURE__ */ n(async (r, t) => (await r.db.query("seoAudits").withIndex("by_client", (c) => c.eq("clientId", t.clientId)).order("desc").take(1))[0] || null, "handler")
}), p = o({
  args: { projectId: e.id("projects") },
  handler: /* @__PURE__ */ n(async (r, t) => (await r.db.query("seoAudits").withIndex("by_project", (c) => c.eq("projectId", t.projectId)).order("desc").take(1))[0] || null, "handler")
}), y = o({
  args: { clientId: e.id("clients") },
  handler: /* @__PURE__ */ n(async (r, t) => await r.db.query("seoAudits").withIndex("by_client", (i) => i.eq("clientId", t.clientId)).order("desc").collect(), "handler")
});
export {
  u as createAudit,
  y as getAuditsByClient,
  b as getLatestAudit,
  p as getLatestAuditByProject
};
//# sourceMappingURL=seoAudits.js.map
