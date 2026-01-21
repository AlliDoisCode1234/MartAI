import {
  a as p,
  c as a
} from "../_deps/K33OSGN4.js";
import {
  c as t,
  e as m
} from "../_deps/4U34M3I6.js";
import {
  a as n
} from "../_deps/RUVYHBJQ.js";

// convex/ai/reports.ts
m();
var d = t.object({
  coverageScore: t.optional(t.number()),
  backlinksProxy: t.optional(t.number()),
  domainRatingProxy: t.optional(t.number()),
  organicKeywords: t.optional(t.number()),
  trafficEstimate: t.optional(t.number())
}), l = t.object({
  score: t.number(),
  sources: t.array(t.string())
}), j = a({
  args: {
    prospectId: t.optional(t.id("prospects")),
    projectId: t.optional(t.id("projects")),
    url: t.optional(t.string()),
    status: t.optional(t.string()),
    summary: t.optional(t.string()),
    metrics: t.optional(d),
    confidence: l,
    dataSources: t.optional(t.array(t.string())),
    crawlData: t.optional(t.object({
      title: t.optional(t.string()),
      description: t.optional(t.string()),
      wordCount: t.optional(t.number()),
      headings: t.optional(t.array(t.string())),
      loadTime: t.optional(t.number()),
      htmlSample: t.optional(t.string())
    }))
  },
  handler: /* @__PURE__ */ n(async (e, o) => {
    let r = Date.now();
    return await e.db.insert("aiReports", {
      prospectId: o.prospectId,
      projectId: o.projectId,
      url: o.url,
      status: o.status ?? "pending",
      summary: o.summary,
      metrics: o.metrics ?? {},
      confidence: o.confidence,
      dataSources: o.dataSources ?? [],
      crawlData: o.crawlData,
      createdAt: r,
      updatedAt: r
    });
  }, "handler")
}), w = a({
  args: {
    reportId: t.id("aiReports"),
    status: t.optional(t.string()),
    summary: t.optional(t.string()),
    metrics: t.optional(d),
    confidence: t.optional(l),
    dataSources: t.optional(t.array(t.string())),
    crawlData: t.optional(t.object({
      title: t.optional(t.string()),
      description: t.optional(t.string()),
      wordCount: t.optional(t.number()),
      headings: t.optional(t.array(t.string())),
      loadTime: t.optional(t.number()),
      htmlSample: t.optional(t.string())
    }))
  },
  handler: /* @__PURE__ */ n(async (e, o) => {
    let { reportId: r, ...i } = o;
    if (!await e.db.get(r))
      throw new Error("AI report not found");
    let s = { updatedAt: Date.now() };
    for (let [u, c] of Object.entries(i))
      c !== void 0 && (s[u] = c);
    return await e.db.patch(r, s), { success: !0 };
  }, "handler")
}), f = p({
  args: {
    prospectId: t.optional(t.id("prospects")),
    projectId: t.optional(t.id("projects")),
    limit: t.optional(t.number())
  },
  handler: /* @__PURE__ */ n(async (e, o) => {
    let r = e.db.query("aiReports").order("desc");
    return o.prospectId ? r = e.db.query("aiReports").withIndex("by_prospect", (i) => i.eq("prospectId", o.prospectId)).order("desc") : o.projectId && (r = e.db.query("aiReports").withIndex("by_project", (i) => i.eq("projectId", o.projectId)).order("desc")), o.limit ? r.take(o.limit) : r.collect();
  }, "handler")
}), h = p({
  args: {
    prospectId: t.optional(t.id("prospects")),
    projectId: t.optional(t.id("projects"))
  },
  handler: /* @__PURE__ */ n(async (e, o) => {
    if (!o.prospectId && !o.projectId)
      throw new Error("prospectId or projectId is required");
    return await (o.prospectId ? e.db.query("aiReports").withIndex("by_prospect", (i) => i.eq("prospectId", o.prospectId)).order("desc") : e.db.query("aiReports").withIndex("by_project", (i) => i.eq("projectId", o.projectId)).order("desc")).first();
  }, "handler")
});
export {
  j as createAiReport,
  h as getLatestAiReport,
  f as listAiReports,
  w as updateAiReport
};
//# sourceMappingURL=reports.js.map
