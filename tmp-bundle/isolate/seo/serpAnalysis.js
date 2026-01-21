import {
  a as c,
  e as y
} from "../_deps/GTU362KY.js";
import {
  a,
  c as l,
  e as p
} from "../_deps/K33OSGN4.js";
import {
  c as e,
  e as u
} from "../_deps/4U34M3I6.js";
import {
  a as n
} from "../_deps/RUVYHBJQ.js";

// convex/seo/serpAnalysis.ts
u();
y();
var w = a({
  args: { projectId: e.id("projects") },
  handler: /* @__PURE__ */ n(async (r, t) => await r.db.query("serpAnalyses").withIndex("by_project", (s) => s.eq("projectId", t.projectId)).order("desc").collect(), "handler")
}), b = a({
  args: { projectId: e.id("projects") },
  handler: /* @__PURE__ */ n(async (r, t) => (await r.db.query("serpAnalyses").withIndex("by_project", (o) => o.eq("projectId", t.projectId)).collect()).length, "handler")
}), g = a({
  args: { projectId: e.id("projects") },
  handler: /* @__PURE__ */ n(async (r, t) => {
    let s = await r.db.query("serpAnalyses").withIndex("by_project", (d) => d.eq("projectId", t.projectId)).collect(), o = 1, i = Math.max(0, o - s.length);
    return {
      canAnalyze: s.length < o,
      used: s.length,
      limit: o,
      remaining: i
    };
  }, "handler")
}), I = l({
  args: {
    projectId: e.id("projects"),
    keyword: e.string(),
    location: e.optional(e.string()),
    results: e.array(
      e.object({
        position: e.number(),
        url: e.string(),
        domain: e.string(),
        title: e.string(),
        snippet: e.optional(e.string()),
        isAd: e.optional(e.boolean())
      })
    ),
    searchVolume: e.optional(e.number()),
    difficulty: e.optional(e.number()),
    source: e.optional(e.string())
  },
  handler: /* @__PURE__ */ n(async (r, t) => {
    let s = await r.db.query("serpAnalyses").withIndex(
      "by_project_keyword",
      (o) => o.eq("projectId", t.projectId).eq("keyword", t.keyword)
    ).first();
    return s ? (await r.db.patch(s._id, {
      results: t.results,
      searchVolume: t.searchVolume,
      difficulty: t.difficulty,
      source: t.source,
      analyzedAt: Date.now()
    }), s._id) : await r.db.insert("serpAnalyses", {
      projectId: t.projectId,
      keyword: t.keyword,
      location: t.location,
      results: t.results,
      searchVolume: t.searchVolume,
      difficulty: t.difficulty,
      source: t.source,
      analyzedAt: Date.now()
    });
  }, "handler")
}), A = p({
  args: {
    projectId: e.id("projects"),
    keyword: e.string(),
    location: e.optional(e.string())
  },
  handler: /* @__PURE__ */ n(async (r, t) => {
    if (!(await r.runQuery(c.seo.serpAnalysis.canAnalyze, {
      projectId: t.projectId
    })).canAnalyze)
      return {
        success: !1,
        error: "SERP analysis limit reached. Upgrade to analyze more keywords.",
        limitReached: !0
      };
    try {
      let o = m(t.keyword);
      return await r.runMutation(c.seo.serpAnalysis.storeSerpResults, {
        projectId: t.projectId,
        keyword: t.keyword,
        location: t.location || "US",
        results: o,
        searchVolume: Math.floor(Math.random() * 1e4) + 100,
        difficulty: Math.floor(Math.random() * 100),
        source: "mock"
      }), {
        success: !0,
        results: o
      };
    } catch (o) {
      return console.error("SERP analysis failed:", o), {
        success: !1,
        error: o?.message || "Failed to analyze SERP"
      };
    }
  }, "handler")
});
function m(r) {
  let t = [
    "wikipedia.org",
    "forbes.com",
    "hubspot.com",
    "neilpatel.com",
    "moz.com",
    "semrush.com",
    "ahrefs.com",
    "searchenginejournal.com",
    "backlinko.com",
    "contentmarketinginstitute.com"
  ], s = [
    "The Complete Guide to",
    "How to Master",
    "10 Best",
    "What is",
    "Beginner's Guide to",
    "7 Tips for",
    "The Ultimate",
    "Everything You Need to Know About",
    "Why",
    "How"
  ];
  return t.map((o, i) => ({
    position: i + 1,
    url: `https://www.${o}/${r.toLowerCase().replace(/\s+/g, "-")}`,
    domain: o,
    title: `${s[i]} ${r} | ${o.split(".")[0].charAt(0).toUpperCase() + o.split(".")[0].slice(1)}`,
    snippet: `Learn everything about ${r}. This comprehensive guide covers the most important aspects...`,
    isAd: !1
  }));
}
n(m, "generateMockSerpResults");
export {
  A as analyzeSERP,
  g as canAnalyze,
  b as getAnalysisCount,
  w as getByProject,
  I as storeSerpResults
};
//# sourceMappingURL=serpAnalysis.js.map
