import {
  a as p
} from "../_deps/K33OSGN4.js";
import {
  c as l,
  e as y
} from "../_deps/4U34M3I6.js";
import {
  a as d
} from "../_deps/RUVYHBJQ.js";

// convex/seo/keywordsData.ts
y();
var h = p({
  args: { projectId: l.id("projects") },
  handler: /* @__PURE__ */ d(async (c, e) => {
    let t = await c.db.query("keywords").withIndex("by_project", (r) => r.eq("projectId", e.projectId)).collect();
    return {
      projectId: e.projectId,
      keywords: t.sort((r, i) => {
        let o = { high: 3, medium: 2, low: 1 }, s = (o[i.priority || "medium"] || 0) - (o[r.priority || "medium"] || 0);
        return s !== 0 ? s : (i.searchVolume || 0) - (r.searchVolume || 0);
      }),
      stats: {
        total: t.length,
        highPriority: t.filter((r) => r.priority === "high").length,
        mediumPriority: t.filter((r) => r.priority === "medium").length,
        lowPriority: t.filter((r) => r.priority === "low").length,
        byStatus: {
          suggested: t.filter((r) => r.status === "suggested").length,
          approved: t.filter((r) => r.status === "approved").length,
          rejected: t.filter((r) => r.status === "rejected").length
        }
      }
    };
  }, "handler")
});
export {
  h as getKeywordsByProject
};
//# sourceMappingURL=keywordsData.js.map
