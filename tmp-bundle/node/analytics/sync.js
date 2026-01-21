"use node";
import {
  a as l
} from "../_deps/node/XR6TCUSL.js";
import {
  a as C,
  c as T,
  k as A,
  l as a,
  m as r,
  p as M
} from "../_deps/node/KFFAPE6U.js";
import {
  a as w
} from "../_deps/node/V7X2J7BI.js";

// convex/analytics/sync.ts
T();
M();
var O = A({
  args: {
    projectId: C.id("projects")
  },
  handler: /* @__PURE__ */ w(async (t, S) => {
    let s = S.projectId, d = Date.now(), h = new Date(d).toISOString().split("T")[0], m = new Date(d - l.sync.defaultDays * 24 * 60 * 60 * 1e3).toISOString().split("T")[0], u = await t.runQuery(a.integrations.ga4Connections.getGA4Connection, {
      projectId: s
    }), g = await t.runQuery(a.integrations.gscConnections.getGSCConnection, {
      projectId: s
    }), i = null, o = null;
    if (u)
      try {
        let n = await t.runAction(r.integrations.google.fetchGA4Metrics, {
          connectionId: u._id,
          projectId: s,
          propertyId: u.propertyId,
          accessToken: u.accessToken,
          refreshToken: u.refreshToken,
          startDate: m,
          endDate: h
        });
        if (n.rows && n.rows.length > 0) {
          let c = n.rows[0], e = /* @__PURE__ */ w((p) => parseFloat(c.metricValues[p]?.value || "0"), "getValue");
          i = {
            sessions: e(0),
            users: e(1),
            engagementDuration: e(2),
            pageViews: e(3),
            bounceRate: e(4),
            avgSessionDuration: e(5),
            newUsers: e(6)
          };
        }
        await t.runMutation(a.integrations.ga4Connections.updateLastSync, {
          connectionId: u._id
        });
      } catch (n) {
        console.error(`GA4 Sync Failed for project ${s}:`, n);
      }
    if (g)
      try {
        let n = await t.runAction(r.integrations.google.fetchGSCMetrics, {
          connectionId: g._id,
          siteUrl: g.siteUrl,
          accessToken: g.accessToken,
          refreshToken: g.refreshToken,
          startDate: m,
          endDate: h
        });
        if (n.rows && n.rows.length > 0) {
          let c = 0, e = 0, p = 0;
          for (let y of n.rows) {
            let b = y.keys?.[0] || "unknown", f = y.clicks || 0, k = y.impressions || 0, D = y.ctr || 0, I = y.position || 0;
            c += f, e += k, p += I, await t.runMutation(r.analytics.gscKeywords.storeKeywordSnapshot, {
              projectId: s,
              syncDate: d,
              keyword: b,
              clicks: f,
              impressions: k,
              ctr: D,
              position: I
            });
          }
          p = n.rows.length > 0 ? p / n.rows.length : 0, o = {
            clicks: c,
            impressions: e,
            ctr: e > 0 ? c / e * 100 : 0,
            position: p
          };
        }
        await t.runMutation(a.integrations.gscConnections.updateLastSync, {
          connectionId: g._id
        });
      } catch (n) {
        console.error(`GSC Sync Failed for project ${s}:`, n);
      }
    i && (await t.runMutation(a.analytics.analytics.storeAnalyticsData, {
      projectId: s,
      date: d,
      source: "ga4",
      sessions: i.sessions,
      pageViews: i.pageViews,
      bounceRate: i.bounceRate,
      avgSessionDuration: i.avgSessionDuration,
      leads: 0,
      // Placeholder
      revenue: 0
      // Placeholder
    }), i.sessions < l.insights.lowTrafficSessions && await t.runMutation(a.analytics.analytics.storeInsight, {
      projectId: s,
      type: "underperformer",
      title: "Low Organic Traffic",
      description: `Only ${i.sessions} sessions detected in the last 30 days. Consider publishing more content.`,
      action: "Plan Content",
      metadata: { sessions: i.sessions }
    }), i.bounceRate > l.insights.highBounceRate && await t.runMutation(a.analytics.analytics.storeInsight, {
      projectId: s,
      type: "quick_win",
      title: "High Bounce Rate",
      description: `Your bounce rate is ${i.bounceRate.toFixed(1)}%. Improve page load speed and content relevance.`,
      action: "Optimize UX",
      metadata: { bounceRate: i.bounceRate }
    })), o && (await t.runMutation(a.analytics.analytics.storeAnalyticsData, {
      projectId: s,
      date: d,
      // We are saving "Sync Date" as the data point for trend tracking
      source: "gsc",
      clicks: o.clicks,
      impressions: o.impressions,
      ctr: o.ctr,
      avgPosition: o.position
    }), o.impressions > l.insights.highImpressionsThreshold && o.ctr < l.insights.lowCTR && await t.runMutation(a.analytics.analytics.storeInsight, {
      projectId: s,
      type: "quick_win",
      title: "High Impressions, Low CTR",
      description: "You are ranking but not getting clicks. Improve your meta titles and descriptions.",
      action: "Optimize Metadata",
      metadata: { ctr: o.ctr, impressions: o.impressions }
    }));
    try {
      let n = await t.runQuery(r.analytics.gscKeywords.getQuickWinKeywords, {
        projectId: s,
        minImpressions: l.insights.quickWinMinImpressions
      });
      if (n && n.length > 0) {
        let c = n.slice(0, 5);
        await t.runMutation(a.analytics.analytics.storeInsight, {
          projectId: s,
          type: "quick_win",
          title: `${n.length} Quick Win Keywords Found`,
          description: `You have ${n.length} keywords ranking on page 2 with high impressions. Top opportunities: ${c.map((e) => e.keyword).join(", ")}`,
          action: "Create Content",
          metadata: {
            keywords: c.map(
              (e) => ({
                keyword: e.keyword,
                position: e.position,
                impressions: e.impressions
              })
            )
          }
        });
      }
    } catch (n) {
      console.error("Quick Win detection failed:", n);
    }
    try {
      await t.runAction(r.analytics.insights.generateEnhancedInsights, {
        projectId: s
      });
    } catch (n) {
      console.error("Enhanced insights generation failed:", n);
    }
    try {
      await t.runAction(r.analytics.insights.findContentGaps, {
        projectId: s
      });
    } catch (n) {
      console.error("Content gap detection failed:", n);
    }
    try {
      await t.runAction(r.analytics.insights.suggestKeywordClusters, {
        projectId: s
      });
    } catch (n) {
      console.error("Cluster suggestion failed:", n);
    }
    try {
      await t.runAction(r.analytics.insights.suggestBriefs, {
        projectId: s
      });
    } catch (n) {
      console.error("Brief suggestion failed:", n);
    }
    try {
      await t.runAction(r.analytics.martaiRating.calculateMartAIRating, {
        projectId: s
      });
    } catch (n) {
      console.error("MartAI Rating calculation failed:", n);
    }
    return { ga4Data: i, gscData: o };
  }, "handler")
});
export {
  O as syncProjectData
};
//# sourceMappingURL=sync.js.map
