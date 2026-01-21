import {
  a as s
} from "../_deps/K33OSGN4.js";
import {
  c as r,
  e as p
} from "../_deps/4U34M3I6.js";
import {
  a as n
} from "../_deps/RUVYHBJQ.js";

// convex/content/quickWins.ts
p();
var f = s({
  args: {
    projectId: r.id("projects"),
    limit: r.optional(r.number())
  },
  handler: /* @__PURE__ */ n(async (i, c) => (await i.db.query("keywords").withIndex("by_project", (t) => t.eq("projectId", c.projectId)).collect()).filter((t) => {
    let o = t.difficulty ?? 100, u = t.searchVolume ?? 0;
    return o <= 30 && u >= 100;
  }).map((t) => {
    let o = t.difficulty ?? 1, l = (t.searchVolume ?? 0) / Math.max(o, 1);
    return {
      ...t,
      opportunityScore: l
    };
  }).sort((t, o) => o.opportunityScore - t.opportunityScore).slice(0, c.limit ?? 5), "handler")
}), m = s({
  args: {
    projectId: r.id("projects")
  },
  handler: /* @__PURE__ */ n(async (i, c) => (await i.db.query("keywords").withIndex("by_project", (e) => e.eq("projectId", c.projectId)).collect()).filter((e) => {
    let t = e.difficulty ?? 100, o = e.searchVolume ?? 0;
    return t <= 30 && o >= 100;
  }).length, "handler")
});
export {
  m as getQuickWinCount,
  f as getQuickWins
};
//# sourceMappingURL=quickWins.js.map
