import {
  a as u
} from "./S27PWT2U.js";
import {
  a as s,
  e as w
} from "./GTU362KY.js";
import {
  c as e,
  e as i
} from "./4U34M3I6.js";
import {
  a as n
} from "./RUVYHBJQ.js";

// convex/workflows/keywordWorkflows.ts
i();
w();
var k = u.define({
  args: {
    projectId: e.id("projects"),
    keywords: e.array(
      e.object({
        keyword: e.string(),
        searchVolume: e.optional(e.number()),
        difficulty: e.optional(e.number()),
        intent: e.optional(e.string())
      })
    )
  },
  returns: e.object({
    keywordCount: e.number(),
    clusterCount: e.number(),
    status: e.literal("clusters_generated"),
    message: e.string()
  }),
  handler: /* @__PURE__ */ n(async (r, t) => {
    let o = await r.runMutation(s.seo.keywords.createKeywords, {
      projectId: t.projectId,
      keywords: t.keywords
    });
    await r.runAction(s.seo.keywordActions.generateClusters, {
      projectId: t.projectId
    });
    let d = await r.runQuery(s.seo.keywordClusters.getActiveClusters, {
      projectId: t.projectId
    });
    return await r.runMutation(s.seo.keywordClusters.rerankClusters, {
      projectId: t.projectId
    }), {
      keywordCount: o.length,
      clusterCount: d.length,
      status: "clusters_generated",
      message: "Keyword clusters generated. Review and refine as needed."
    };
  }, "handler")
}), p = u.define({
  args: {
    projectId: e.id("projects"),
    dateRange: e.object({
      startDate: e.string(),
      // YYYY-MM-DD
      endDate: e.string()
      // YYYY-MM-DD
    })
  },
  returns: e.object({
    keywordCount: e.number(),
    clusterCount: e.number(),
    status: e.literal("clusters_generated"),
    message: e.string(),
    source: e.literal("google_search_console"),
    dateRange: e.object({
      startDate: e.string(),
      endDate: e.string()
    })
  }),
  handler: /* @__PURE__ */ n(async (r, t) => {
    let d = (await r.runAction(s.integrations.gsc.fetchKeywordData, {
      projectId: t.projectId,
      dateRange: t.dateRange
    })).rows.map((a) => ({
      keyword: a.keys[0],
      searchVolume: a.impressions,
      difficulty: void 0,
      // GSC doesn't provide difficulty
      intent: void 0
      // Will be determined by AI clustering
    })), l = await r.runMutation(s.seo.keywords.createKeywords, {
      projectId: t.projectId,
      keywords: d
    });
    await r.runAction(s.seo.keywordActions.generateClusters, {
      projectId: t.projectId
    }), await r.runMutation(s.seo.keywordClusters.rerankClusters, {
      projectId: t.projectId
    });
    let c = await r.runQuery(s.seo.keywordClusters.getActiveClusters, {
      projectId: t.projectId
    });
    return {
      keywordCount: l.length,
      clusterCount: c.length,
      status: "clusters_generated",
      message: "Keyword clusters generated. Review and refine as needed.",
      source: "google_search_console",
      dateRange: t.dateRange
    };
  }, "handler")
}), C = u.define({
  args: {
    projectId: e.id("projects"),
    clusterIds: e.array(e.id("keywordClusters")),
    action: e.union(e.literal("merge"), e.literal("split"), e.literal("recluster"))
  },
  returns: e.object({
    status: e.union(e.literal("merged"), e.literal("split"), e.literal("reclustered")),
    clusterIds: e.optional(e.array(e.id("keywordClusters"))),
    clusterId: e.optional(e.id("keywordClusters"))
  }),
  handler: /* @__PURE__ */ n(async (r, t) => t.action === "merge" ? {
    clusterId: await r.runMutation(s.seo.keywordClusters.mergeClusters, {
      clusterIds: t.clusterIds
    }),
    status: "merged"
  } : t.action === "split" ? {
    clusterIds: await r.runAction(s.seo.keywordActions.splitCluster, {
      clusterId: t.clusterIds[0]
    }),
    status: "split"
  } : {
    clusterIds: await r.runAction(s.seo.keywordActions.reclusterKeywords, {
      clusterIds: t.clusterIds
    }),
    status: "reclustered"
  }, "handler")
});

export {
  k as a,
  p as b,
  C as c
};
//# sourceMappingURL=UURW52ZU.js.map
