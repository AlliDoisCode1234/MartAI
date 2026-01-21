import {
  a as j,
  b as y,
  c as b,
  d as I
} from "../_deps/K33OSGN4.js";
import {
  c as e,
  e as m
} from "../_deps/4U34M3I6.js";
import {
  a as c
} from "../_deps/RUVYHBJQ.js";

// convex/analytics/martaiRatingQueries.ts
m();
var S = I({
  args: {
    projectId: e.id("projects"),
    date: e.number(),
    overall: e.number(),
    tier: e.string(),
    visibility: e.number(),
    trafficHealth: e.number(),
    ctrPerformance: e.number(),
    engagementQuality: e.number(),
    quickWinPotential: e.number(),
    contentVelocity: e.number(),
    rawMetrics: e.optional(e.any())
  },
  handler: /* @__PURE__ */ c(async (r, t) => await r.db.insert("projectScores", t), "handler")
}), k = j({
  args: {
    projectId: e.id("projects")
  },
  handler: /* @__PURE__ */ c(async (r, t) => await r.db.query("projectScores").withIndex("by_project_date", (o) => o.eq("projectId", t.projectId)).order("desc").first(), "handler")
}), _ = j({
  args: {
    projectId: e.id("projects"),
    limit: e.optional(e.number())
  },
  handler: /* @__PURE__ */ c(async (r, t) => await r.db.query("projectScores").withIndex("by_project_date", (o) => o.eq("projectId", t.projectId)).order("desc").take(t.limit || 30), "handler")
}), x = y({
  args: {
    projectId: e.id("projects"),
    since: e.number()
  },
  handler: /* @__PURE__ */ c(async (r, t) => (await r.db.query("contentPieces").withIndex("by_project", (n) => n.eq("projectId", t.projectId)).filter((n) => n.gte(n.field("createdAt"), t.since)).collect()).length, "handler")
}), M = b({
  args: {
    projectId: e.id("projects")
  },
  handler: /* @__PURE__ */ c(async (r, t) => {
    let o = await r.db.query("projectScores").withIndex("by_project_date", (a) => a.eq("projectId", t.projectId)).first();
    if (o)
      return o;
    let l = (await r.db.query("keywords").withIndex("by_project", (a) => a.eq("projectId", t.projectId)).collect()).length, u = (await r.db.query("keywordClusters").withIndex("by_project", (a) => a.eq("projectId", t.projectId)).collect()).length, i = 5;
    l >= 10 ? i = 40 : l >= 5 ? i = 25 : l >= 1 && (i = 15);
    let p = 5;
    u >= 3 ? p = 30 : u >= 1 && (p = 15);
    let s = Math.min(i + p + 10, 80), d = "needs_work";
    s >= 60 ? d = "good" : s >= 40 && (d = "fair");
    let f = await r.db.insert("projectScores", {
      projectId: t.projectId,
      date: Date.now(),
      overall: s,
      tier: d,
      visibility: 0,
      trafficHealth: 0,
      ctrPerformance: 0,
      engagementQuality: 0,
      quickWinPotential: i,
      contentVelocity: p,
      rawMetrics: {
        quickWinCount: l,
        briefsThisMonth: u
      }
    });
    return console.log(`[MR] Preliminary score for ${t.projectId}: ${s} (${d})`), { _id: f, overall: s, tier: d };
  }, "handler")
});
export {
  x as countBriefsThisMonth,
  M as generatePreliminaryScore,
  k as getLatestScore,
  _ as getScoreHistory,
  S as storeScore
};
//# sourceMappingURL=martaiRatingQueries.js.map
