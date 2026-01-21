import {
  d as l
} from "../_deps/MF3OI5Q7.js";
import "../_deps/OFY2WAT7.js";
import "../_deps/ZRD5YQUR.js";
import {
  a as u
} from "../_deps/K33OSGN4.js";
import {
  c as i,
  e as f
} from "../_deps/4U34M3I6.js";
import {
  a as c
} from "../_deps/RUVYHBJQ.js";

// convex/admin/costs.ts
f();
var k = u({
  args: {
    limit: i.optional(i.number())
  },
  handler: /* @__PURE__ */ c(async (s, n) => {
    await l(s);
    let r = n.limit ?? 50;
    return await s.db.query("neutralCost:aiCosts").order("desc").take(r);
  }, "handler")
}), q = u({
  args: {},
  handler: /* @__PURE__ */ c(async (s) => {
    await l(s);
    let n = await s.db.query("neutralCost:aiCosts").collect(), r = n.reduce((o, t) => o + (t.cost?.totalCost || 0), 0), m = n.reduce(
      (o, t) => o + (t.usage?.totalTokens || 0),
      0
    ), e = {};
    for (let o of n) {
      let t = o.modelId || "unknown";
      e[t] || (e[t] = { cost: 0, count: 0 }), e[t].cost += o.cost?.totalCost || 0, e[t].count += 1;
    }
    let y = Date.now(), d = [];
    for (let o = 6; o >= 0; o--) {
      let t = y - o * 24 * 60 * 60 * 1e3, C = t + 1440 * 60 * 1e3, b = n.filter((a) => a._creationTime >= t && a._creationTime < C).reduce((a, p) => a + (p.cost?.totalCost || 0), 0), g = new Date(t).toISOString().slice(0, 10);
      d.push({ date: g, count: Math.round(b * 100) });
    }
    return {
      totalCost: r,
      totalTokens: m,
      totalGenerations: n.length,
      byModel: Object.entries(e).map(([o, t]) => ({
        model: o,
        cost: t.cost,
        count: t.count
      })),
      dailyCosts: d
    };
  }, "handler")
});
export {
  q as getAICostSummary,
  k as getAllAICosts
};
//# sourceMappingURL=costs.js.map
