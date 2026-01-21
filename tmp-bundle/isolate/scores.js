import {
  a as p
} from "./_deps/K33OSGN4.js";
import {
  c as a,
  e as m
} from "./_deps/4U34M3I6.js";
import {
  a as s
} from "./_deps/RUVYHBJQ.js";

// convex/scores.ts
m();
var b = p({
  args: {
    projectId: a.id("projects")
  },
  handler: /* @__PURE__ */ s(async (c, t) => {
    if (!await c.db.get(t.projectId))
      return null;
    let u = await c.db.query("keywords").filter((e) => e.eq(e.field("projectId"), t.projectId)).collect(), f = await c.db.query("keywordClusters").filter((e) => e.eq(e.field("projectId"), t.projectId)).collect(), l = await c.db.query("contentPieces").filter((e) => e.eq(e.field("projectId"), t.projectId)).collect(), n = Math.min(100, u.length * 2), i = Math.min(100, f.length * 10), d = Math.min(100, l.length * 5), h = l.filter((e) => e.status === "published").length, j = Math.min(100, h * 10), o = Math.round(
      n * 0.25 + i * 0.25 + d * 0.25 + j * 0.25
    ), r;
    return o >= 80 ? r = "excellent" : o >= 60 ? r = "good" : o >= 40 ? r = "moderate" : r = "needs_work", {
      projectId: t.projectId,
      overall: o,
      tier: r,
      visibility: n,
      trafficHealth: i,
      ctrPerformance: d,
      quickWinPotential: Math.round((100 - o) * 0.7),
      lastCalculated: Date.now()
    };
  }, "handler")
});
export {
  b as getProjectScore
};
//# sourceMappingURL=scores.js.map
