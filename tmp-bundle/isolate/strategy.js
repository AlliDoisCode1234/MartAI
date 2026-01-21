import {
  a as n
} from "./_deps/K33OSGN4.js";
import {
  c,
  e as u
} from "./_deps/4U34M3I6.js";
import {
  a as d
} from "./_deps/RUVYHBJQ.js";

// convex/strategy.ts
u();
var f = n({
  args: {
    projectId: c.id("projects")
  },
  handler: /* @__PURE__ */ d(async (r, e) => {
    let l = await r.db.get(e.projectId);
    if (!l)
      return null;
    let s = await r.db.query("keywords").filter((t) => t.eq(t.field("projectId"), e.projectId)).collect(), o = await r.db.query("contentPieces").filter((t) => t.eq(t.field("projectId"), e.projectId)).collect(), i = await r.db.query("keywordClusters").filter((t) => t.eq(t.field("projectId"), e.projectId)).collect();
    return {
      projectId: e.projectId,
      projectName: l.name,
      stats: {
        keywordCount: s.length,
        briefCount: o.length,
        clusterCount: i.length,
        publishedCount: o.filter((t) => t.status === "published").length,
        draftCount: o.filter((t) => t.status === "draft").length
      },
      lastUpdated: Date.now()
    };
  }, "handler")
});
export {
  f as getFullStrategy
};
//# sourceMappingURL=strategy.js.map
