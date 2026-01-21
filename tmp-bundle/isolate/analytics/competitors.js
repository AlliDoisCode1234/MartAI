import {
  f as t
} from "../_deps/K33OSGN4.js";
import {
  c as o,
  e as i
} from "../_deps/4U34M3I6.js";
import {
  a as r
} from "../_deps/RUVYHBJQ.js";

// convex/analytics/competitors.ts
i();
var m = t({
  args: {
    projectId: o.id("projects"),
    competitorDomains: o.array(o.string())
  },
  handler: /* @__PURE__ */ r(async (n, e) => [
    {
      domain: e.competitorDomains[0],
      overlap: 0.5,
      opportunities: ["keyword1", "keyword2"]
    }
  ], "handler")
});
export {
  m as analyzeCompetitors
};
//# sourceMappingURL=competitors.js.map
