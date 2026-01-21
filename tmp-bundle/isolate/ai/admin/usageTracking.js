import {
  a as y,
  d as T
} from "../../_deps/K33OSGN4.js";
import {
  c as r,
  e as g
} from "../../_deps/4U34M3I6.js";
import {
  a as k
} from "../../_deps/RUVYHBJQ.js";

// convex/ai/admin/usageTracking.ts
g();
var b = {
  // OpenAI
  "gpt-4o": { input: 25e-4, output: 0.01 },
  "gpt-4o-mini": { input: 15e-5, output: 6e-4 },
  "o3-mini": { input: 11e-4, output: 44e-4 },
  // Anthropic
  "claude-sonnet-4-20250514": { input: 3e-3, output: 0.015 },
  "claude-haiku-4-20251015": { input: 25e-5, output: 125e-5 },
  "claude-opus-4-20250522": { input: 0.015, output: 0.075 },
  // Google
  "gemini-2.5-flash": { input: 15e-5, output: 6e-4 },
  "gemini-2.0-flash": { input: 75e-6, output: 3e-4 },
  "gemini-2.5-pro": { input: 125e-5, output: 5e-3 }
};
function D(a, t, i) {
  let n = b[a] || { input: 1e-3, output: 2e-3 }, p = t / 1e3 * n.input, s = i / 1e3 * n.output;
  return Math.round((p + s) * 1e6) / 1e6;
}
k(D, "calculateCost");
function m(a = Date.now()) {
  return new Date(a).toISOString().split("T")[0];
}
k(m, "getDateKey");
var U = T({
  args: {
    userId: r.id("users"),
    projectId: r.optional(r.id("projects")),
    provider: r.string(),
    model: r.string(),
    taskType: r.string(),
    inputTokens: r.number(),
    outputTokens: r.number()
  },
  handler: /* @__PURE__ */ k(async (a, t) => {
    let i = m(), n = D(t.model, t.inputTokens, t.outputTokens), p = Date.now(), s = await a.db.query("aiUsage").withIndex("by_user_date", (e) => e.eq("userId", t.userId).eq("dateKey", i)).filter(
      (e) => e.and(
        e.eq(e.field("provider"), t.provider),
        e.eq(e.field("model"), t.model),
        e.eq(e.field("projectId"), t.projectId)
      )
    ).first();
    if (s) {
      let e = s.taskBreakdown || {}, c = (e[t.taskType] || 0) + 1;
      return await a.db.patch(s._id, {
        requestCount: s.requestCount + 1,
        inputTokens: s.inputTokens + t.inputTokens,
        outputTokens: s.outputTokens + t.outputTokens,
        totalTokens: s.totalTokens + t.inputTokens + t.outputTokens,
        costUsd: s.costUsd + n,
        taskBreakdown: {
          ...e,
          [t.taskType]: c
        },
        updatedAt: p
      }), { type: "updated", id: s._id, cost: n };
    } else
      return { type: "created", id: await a.db.insert("aiUsage", {
        userId: t.userId,
        projectId: t.projectId,
        provider: t.provider,
        model: t.model,
        dateKey: i,
        requestCount: 1,
        inputTokens: t.inputTokens,
        outputTokens: t.outputTokens,
        totalTokens: t.inputTokens + t.outputTokens,
        costUsd: n,
        taskBreakdown: {
          [t.taskType]: 1
        },
        createdAt: p,
        updatedAt: p
      }), cost: n };
  }, "handler")
}), I = y({
  args: {},
  handler: /* @__PURE__ */ k(async (a) => {
    let t = /* @__PURE__ */ new Date(), n = new Date(t.getFullYear(), t.getMonth(), 1).toISOString().split("T")[0], s = (await a.db.query("aiUsage").collect()).filter((o) => o.dateKey >= n), e = {}, c = 0, l = 0, u = 0;
    for (let o of s)
      c += o.costUsd, l += o.totalTokens, u += o.requestCount, e[o.provider] || (e[o.provider] = { cost: 0, tokens: 0, requests: 0 }), e[o.provider].cost += o.costUsd, e[o.provider].tokens += o.totalTokens, e[o.provider].requests += o.requestCount;
    return {
      totalCost: Math.round(c * 100) / 100,
      totalTokens: l,
      totalRequests: u,
      byProvider: Object.entries(e).map(([o, d]) => ({
        provider: o,
        cost: Math.round(d.cost * 100) / 100,
        tokens: d.tokens,
        requests: d.requests
      })),
      startDate: n,
      endDate: m()
    };
  }, "handler")
}), q = y({
  args: {
    userId: r.id("users"),
    days: r.optional(r.number())
    // Default 30
  },
  handler: /* @__PURE__ */ k(async (a, t) => {
    let i = t.days || 30, n = /* @__PURE__ */ new Date();
    n.setDate(n.getDate() - i);
    let p = n.toISOString().split("T")[0], s = await a.db.query("aiUsage").withIndex("by_user_date", (u) => u.eq("userId", t.userId)).filter((u) => u.gte(u.field("dateKey"), p)).collect(), e = s.reduce((u, o) => u + o.costUsd, 0), c = s.reduce((u, o) => u + o.totalTokens, 0), l = s.reduce((u, o) => u + o.requestCount, 0);
    return {
      totalCost: Math.round(e * 100) / 100,
      totalTokens: c,
      totalRequests: l,
      days: i,
      records: s.length
    };
  }, "handler")
}), C = y({
  args: {
    days: r.optional(r.number())
    // Default 7
  },
  handler: /* @__PURE__ */ k(async (a, t) => {
    let i = t.days || 7, n = /* @__PURE__ */ new Date();
    n.setDate(n.getDate() - i);
    let p = n.toISOString().split("T")[0], e = (await a.db.query("aiUsage").collect()).filter((d) => d.dateKey >= p), c = {};
    for (let d of e)
      c[d.dateKey] = (c[d.dateKey] || 0) + d.costUsd;
    let l = [], u = new Date(n), o = /* @__PURE__ */ new Date();
    for (; u <= o; ) {
      let d = u.toISOString().split("T")[0];
      l.push({
        date: d,
        cost: Math.round((c[d] || 0) * 100) / 100
      }), u.setDate(u.getDate() + 1);
    }
    return l;
  }, "handler")
});
export {
  C as getDailyCostTrend,
  I as getMonthlyUsageSummary,
  q as getUserUsage,
  U as recordUsage
};
//# sourceMappingURL=usageTracking.js.map
