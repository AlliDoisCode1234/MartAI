import {
  c as d
} from "../_deps/MF3OI5Q7.js";
import "../_deps/OFY2WAT7.js";
import "../_deps/ZRD5YQUR.js";
import {
  a as y,
  c as u
} from "../_deps/K33OSGN4.js";
import {
  c as t,
  e as g
} from "../_deps/4U34M3I6.js";
import {
  a as c
} from "../_deps/RUVYHBJQ.js";

// convex/seo/keywordClusters.ts
g();
var C = t.object({
  keyword: t.string(),
  volume: t.optional(t.number()),
  difficulty: t.optional(t.number()),
  intent: t.optional(t.string())
}), k = u({
  args: {
    projectId: t.id("projects"),
    clusterName: t.string(),
    keywords: t.array(t.string()),
    intent: t.string(),
    // informational, commercial, transactional, navigational
    difficulty: t.number(),
    // 0-100
    volumeRange: t.object({
      min: t.number(),
      max: t.number()
    }),
    impactScore: t.number(),
    topSerpUrls: t.array(t.string()),
    status: t.string(),
    // active, hidden, favorite
    createdAt: t.number()
  },
  handler: /* @__PURE__ */ c(async (r, e) => (await d(r, e.projectId, "editor"), await r.db.insert("keywordClusters", {
    projectId: e.projectId,
    clusterName: e.clusterName,
    keywords: e.keywords,
    intent: e.intent,
    difficulty: e.difficulty,
    volumeRange: e.volumeRange,
    impactScore: e.impactScore,
    topSerpUrls: e.topSerpUrls,
    status: e.status || "active",
    createdAt: e.createdAt || Date.now(),
    updatedAt: Date.now()
  })), "handler")
}), S = y({
  args: { projectId: t.id("projects") },
  handler: /* @__PURE__ */ c(async (r, e) => (await d(r, e.projectId, "viewer"), await r.db.query("keywordClusters").withIndex("by_project", (o) => o.eq("projectId", e.projectId)).collect()), "handler")
}), A = y({
  args: { projectId: t.id("projects") },
  handler: /* @__PURE__ */ c(async (r, e) => (await d(r, e.projectId, "viewer"), (await r.db.query("keywordClusters").withIndex("by_project", (s) => s.eq("projectId", e.projectId)).collect()).filter((s) => s.status !== "hidden")), "handler")
}), R = u({
  args: {
    clusterId: t.id("keywordClusters"),
    clusterName: t.optional(t.string()),
    keywords: t.optional(t.array(t.string())),
    intent: t.optional(t.string()),
    difficulty: t.optional(t.number()),
    volumeRange: t.optional(
      t.object({
        min: t.number(),
        max: t.number()
      })
    ),
    impactScore: t.optional(t.number()),
    status: t.optional(t.string())
  },
  handler: /* @__PURE__ */ c(async (r, e) => {
    let o = await r.db.get(e.clusterId);
    if (!o) throw new Error("Cluster not found");
    await d(r, o.projectId, "editor");
    let { clusterId: s, ...p } = e, l = { updatedAt: Date.now() };
    for (let [m, i] of Object.entries(p))
      i !== void 0 && (l[m] = i);
    return await r.db.patch(s, l);
  }, "handler")
}), D = u({
  args: {
    clusterId: t.id("keywordClusters"),
    status: t.string()
    // active, hidden, favorite
  },
  handler: /* @__PURE__ */ c(async (r, e) => {
    let o = await r.db.get(e.clusterId);
    if (!o) throw new Error("Cluster not found");
    return await d(r, o.projectId, "editor"), await r.db.patch(e.clusterId, {
      status: e.status,
      updatedAt: Date.now()
    });
  }, "handler")
}), E = u({
  args: {
    projectId: t.id("projects"),
    volumeWeight: t.optional(t.number()),
    intentWeight: t.optional(t.number()),
    difficultyWeight: t.optional(t.number())
  },
  handler: /* @__PURE__ */ c(async (r, e) => {
    await d(r, e.projectId, "editor");
    let o = await r.db.query("keywordClusters").withIndex("by_project", (i) => i.eq("projectId", e.projectId)).collect(), s = e.volumeWeight ?? 0.4, p = e.intentWeight ?? 0.3, l = e.difficultyWeight ?? 0.3, m = {
      transactional: 1,
      commercial: 0.8,
      informational: 0.6,
      navigational: 0.4
    };
    for (let i of o) {
      let w = (i.volumeRange.min + i.volumeRange.max) / 2, f = Math.min(w / 1e4, 1), n = m[i.intent] || 0.5, a = 1 - i.difficulty / 100, h = s * f + p * n + l * a;
      await r.db.patch(i._id, {
        impactScore: Math.round(h * 100) / 100,
        updatedAt: Date.now()
      });
    }
    return { success: !0, updated: o.length };
  }, "handler")
}), W = u({
  args: { clusterId: t.id("keywordClusters") },
  handler: /* @__PURE__ */ c(async (r, e) => {
    let o = await r.db.get(e.clusterId);
    if (!o) throw new Error("Cluster not found");
    await d(r, o.projectId, "editor"), await r.db.delete(e.clusterId);
  }, "handler")
}), q = u({
  args: {
    clusterIds: t.array(t.id("keywordClusters"))
  },
  handler: /* @__PURE__ */ c(async (r, e) => {
    if (e.clusterIds.length < 2)
      throw new Error("Need at least 2 clusters to merge");
    let o = [];
    for (let n of e.clusterIds) {
      let a = await r.db.get(n);
      a && o.push(a);
    }
    if (o.length === 0)
      throw new Error("No valid clusters found to merge");
    let s = o[0];
    await d(r, s.projectId, "editor");
    let p = /* @__PURE__ */ new Set();
    o.forEach((n) => n.keywords.forEach((a) => p.add(a)));
    let l = /* @__PURE__ */ new Set();
    o.forEach((n) => n.topSerpUrls?.forEach((a) => l.add(a)));
    let m = o.reduce((n, a) => n + a.volumeRange.min, 0), i = o.reduce((n, a) => n + a.volumeRange.max, 0), w = o.reduce((n, a) => n + a.difficulty, 0) / o.length, f = await r.db.insert("keywordClusters", {
      projectId: s.projectId,
      clusterName: `${s.clusterName} (Merged)`,
      keywords: Array.from(p),
      intent: s.intent,
      // Keep intent of primary
      difficulty: w,
      volumeRange: { min: m, max: i },
      impactScore: s.impactScore,
      // Initial score, can be reranked later
      topSerpUrls: Array.from(l).slice(0, 10),
      // Keep top 10 unique
      status: "active",
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    for (let n of o)
      await r.db.delete(n._id);
    return f;
  }, "handler")
});
export {
  k as createCluster,
  W as deleteCluster,
  A as getActiveClusters,
  S as getClustersByProject,
  q as mergeClusters,
  E as rerankClusters,
  R as updateCluster,
  D as updateClusterStatus
};
//# sourceMappingURL=keywordClusters.js.map
