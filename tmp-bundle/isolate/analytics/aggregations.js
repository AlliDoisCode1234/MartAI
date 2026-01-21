import {
  a as r
} from "../_deps/K33OSGN4.js";
import "../_deps/4U34M3I6.js";
import {
  a as t
} from "../_deps/RUVYHBJQ.js";

// convex/analytics/aggregations.ts
var e = {
  count: /* @__PURE__ */ t(async (n) => 0, "count"),
  insert: /* @__PURE__ */ t(async (n, a) => {
  }, "insert")
}, s = {
  insert: /* @__PURE__ */ t(async (n, a) => {
  }, "insert")
}, c = r({
  args: {},
  handler: /* @__PURE__ */ t(async (n) => ({
    totalGenerations: await e.count(n)
  }), "handler")
});
export {
  s as costPerProject,
  c as getDashboardMetrics,
  e as totalGenerations
};
//# sourceMappingURL=aggregations.js.map
