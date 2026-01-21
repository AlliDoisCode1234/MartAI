import {
  a as c,
  e as s
} from "../_deps/GTU362KY.js";
import {
  a as i,
  c as d,
  f as a
} from "../_deps/K33OSGN4.js";
import {
  c as e,
  e as p
} from "../_deps/4U34M3I6.js";
import {
  a as t
} from "../_deps/RUVYHBJQ.js";

// convex/seo/rankings.ts
p();
s();
var k = d({
  args: {
    projectId: e.id("projects"),
    keyword: e.string(),
    position: e.number(),
    url: e.string(),
    searchEngine: e.string(),
    location: e.optional(e.string())
  },
  handler: /* @__PURE__ */ t(async (o, r) => await o.db.insert("rankings", {
    projectId: r.projectId,
    keyword: r.keyword,
    position: r.position,
    url: r.url,
    searchEngine: r.searchEngine,
    location: r.location,
    date: Date.now()
  }), "handler")
}), l = i({
  args: {
    projectId: e.id("projects"),
    keyword: e.string()
  },
  handler: /* @__PURE__ */ t(async (o, r) => await o.db.query("rankings").withIndex(
    "by_project_keyword",
    (n) => n.eq("projectId", r.projectId).eq("keyword", r.keyword)
  ).order("desc").collect(), "handler")
}), u = i({
  args: { projectId: e.id("projects") },
  handler: /* @__PURE__ */ t(async (o, r) => await o.db.query("rankings").withIndex("by_project", (n) => n.eq("projectId", r.projectId)).order("desc").take(100), "handler")
}), w = a({
  args: {
    projectId: e.id("projects")
  },
  handler: /* @__PURE__ */ t(async (o, r) => (await o.runMutation(c.seo.rankings.addRanking, {
    projectId: r.projectId,
    keyword: "example keyword",
    position: Math.floor(Math.random() * 10) + 1,
    url: "https://example.com",
    searchEngine: "google"
  }), { updated: !0 }), "handler")
});
export {
  k as addRanking,
  l as getRankingsByKeyword,
  u as getRankingsByProject,
  w as updateRankings
};
//# sourceMappingURL=rankings.js.map
