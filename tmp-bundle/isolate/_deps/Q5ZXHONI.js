import {
  a as d
} from "./S27PWT2U.js";
import {
  a,
  b as c,
  e as p
} from "./GTU362KY.js";
import {
  c as t,
  e as l
} from "./4U34M3I6.js";
import {
  a as s
} from "./RUVYHBJQ.js";

// convex/workflows/analyticsWorkflows.ts
l();
p();
var f = d.define({
  args: {
    projectId: t.id("projects"),
    dateRange: t.object({
      startDate: t.string(),
      // YYYY-MM-DD
      endDate: t.string()
      // YYYY-MM-DD
    })
  },
  returns: t.object({
    status: t.literal("synced"),
    ga4Synced: t.boolean(),
    gscSynced: t.boolean(),
    insightsGenerated: t.number(),
    dateRange: t.object({
      startDate: t.string(),
      endDate: t.string()
    })
  }),
  handler: /* @__PURE__ */ s(async (e, n) => {
    let o = await e.runQuery(a.integrations.ga4Connections.getGA4Connection, {
      projectId: n.projectId
    });
    o && await e.runMutation(a.integrations.ga4Connections.updateLastSync, {
      connectionId: o._id
    });
    let r = await e.runQuery(a.integrations.gscConnections.getGSCConnection, {
      projectId: n.projectId
    });
    r && await e.runMutation(a.integrations.gscConnections.updateLastSync, {
      connectionId: r._id
    });
    let u = await e.runAction(c.analytics.insights.generateInsights, {
      projectId: n.projectId,
      ga4Data: o ?? void 0,
      gscData: r ?? void 0
    });
    for (let i of u)
      await e.runMutation(a.analytics.analytics.storeInsight, {
        projectId: n.projectId,
        type: i.type,
        title: i.title,
        description: i.description,
        action: i.action,
        metadata: i.metadata
      });
    return {
      status: "synced",
      ga4Synced: !!o,
      gscSynced: !!r,
      insightsGenerated: u.length,
      dateRange: n.dateRange
    };
  }, "handler")
}), j = d.define({
  args: {
    briefId: t.id("briefs"),
    analysisType: t.union(t.literal("underperformer"), t.literal("top_gainer"), t.literal("decay"))
  },
  returns: t.object({
    status: t.literal("analyzed"),
    recommendations: t.array(
      t.object({
        type: t.string(),
        reason: t.string(),
        action: t.string()
      })
    )
  }),
  handler: /* @__PURE__ */ s(async (e, n) => ({
    status: "analyzed",
    recommendations: (await e.runAction(c.analytics.insights.generateContentInsights, {
      briefId: n.briefId,
      metrics: { type: n.analysisType }
    })).recommendations
  }), "handler")
}), b = d.define({
  args: {
    projectId: t.id("projects"),
    competitorDomains: t.array(t.string())
  },
  returns: t.object({
    status: t.literal("completed"),
    competitorsAnalyzed: t.number(),
    opportunitiesFound: t.number()
  }),
  handler: /* @__PURE__ */ s(async (e, n) => {
    let o = await e.runAction(c.analytics.competitors.analyzeCompetitors, {
      projectId: n.projectId,
      competitorDomains: n.competitorDomains
    });
    return {
      status: "completed",
      competitorsAnalyzed: n.competitorDomains.length,
      opportunitiesFound: o.reduce(
        (r, u) => r + (u.opportunities?.length || 0),
        0
      )
    };
  }, "handler")
}), w = d.define({
  args: {
    projectId: t.id("projects")
  },
  returns: t.object({
    status: t.literal("updated"),
    updated: t.boolean()
  }),
  handler: /* @__PURE__ */ s(async (e, n) => ({
    status: "updated",
    updated: (await e.runAction(c.seo.rankings.updateRankings, {
      projectId: n.projectId
    })).updated
  }), "handler")
});

export {
  f as a,
  j as b,
  b as c,
  w as d
};
//# sourceMappingURL=Q5ZXHONI.js.map
