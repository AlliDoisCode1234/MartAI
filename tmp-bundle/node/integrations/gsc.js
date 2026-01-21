"use node";
import {
  a as n,
  c as p,
  j as i,
  l as a,
  m as c,
  p as d
} from "../_deps/node/KFFAPE6U.js";
import {
  a as r
} from "../_deps/node/V7X2J7BI.js";

// convex/integrations/gsc.ts
p();
d();
var C = i({
  args: {
    projectId: n.id("projects"),
    dateRange: n.object({
      startDate: n.string(),
      endDate: n.string()
    })
  },
  handler: /* @__PURE__ */ r(async (s, o) => {
    let e = await s.runQuery(a.integrations.gscConnections.getGSCConnection, {
      projectId: o.projectId
    });
    if (!e)
      throw new Error("GSC not connected");
    return {
      rows: ((await s.runAction(c.integrations.google.fetchGSCMetrics, {
        connectionId: e._id,
        siteUrl: e.siteUrl,
        accessToken: e.accessToken,
        refreshToken: e.refreshToken,
        startDate: o.dateRange.startDate,
        endDate: o.dateRange.endDate
      })).rows || []).map((t) => ({
        keys: t.keys || [],
        clicks: t.clicks || 0,
        impressions: t.impressions || 0,
        ctr: t.ctr || 0,
        position: t.position || 0
      }))
    };
  }, "handler")
});
export {
  C as fetchKeywordData
};
//# sourceMappingURL=gsc.js.map
