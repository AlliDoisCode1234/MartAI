"use node";
import {
  a as S,
  c as H,
  k as G,
  l as Q,
  m as s,
  p as F
} from "../_deps/node/KFFAPE6U.js";
import {
  a as i
} from "../_deps/node/V7X2J7BI.js";

// convex/analytics/martaiRating.ts
H();
F();
var l = {
  visibility: 30,
  // Average position - core ranking signal
  trafficHealth: 25,
  // Session trends - SEMrush includes organic traffic
  ctrPerformance: 15,
  // Click-through rate - UX signal
  engagementQuality: 10,
  // Bounce rate - Core Web Vitals tie-breaker
  quickWinPotential: 10,
  // MartAI unique - actionable opportunities
  contentVelocity: 10
  // Content freshness signal
}, V = [
  { min: 97, tier: "top_performer", label: "\u{1F3C6} Top Performer" },
  { min: 95, tier: "super", label: "\u2B50 Super" },
  { min: 90, tier: "excellent", label: "\u{1F31F} Excellent" },
  { min: 80, tier: "really_good", label: "\u2705 Really Good" },
  { min: 60, tier: "good", label: "\u{1F535} Good" },
  { min: 40, tier: "fair", label: "\u{1F7E1} Fair" },
  { min: 0, tier: "needs_work", label: "\u{1F534} Needs Work" }
];
function E(e) {
  for (let t of V)
    if (e >= t.min)
      return { tier: t.tier, label: t.label };
  return { tier: "needs_work", label: "\u{1F534} Needs Work" };
}
i(E, "getTier");
function _(e) {
  return e === null || e === 0 ? 0 : e < 3 ? 95 : e < 5 ? 85 : e < 10 ? 70 : e < 15 ? 55 : e < 20 ? 40 : e < 30 ? 25 : e < 50 ? 15 : 5;
}
i(_, "scoreVisibility");
function $(e) {
  return e === null ? 0 : e >= 30 ? 95 : e >= 20 ? 85 : e >= 10 ? 75 : e >= 5 ? 65 : e >= 0 ? 55 : e >= -5 ? 40 : e >= -10 ? 25 : e >= -20 ? 15 : 5;
}
i($, "scoreTrafficHealth");
function v(e) {
  return e === null ? 0 : e >= 15 ? 95 : e >= 10 ? 85 : e >= 7 ? 75 : e >= 5 ? 65 : e >= 3 ? 50 : e >= 2 ? 35 : e >= 1 ? 25 : 10;
}
i(v, "scoreCTR");
function K(e) {
  return e === null ? 0 : e < 25 ? 95 : e < 35 ? 80 : e < 45 ? 65 : e < 55 ? 50 : e < 65 ? 35 : e < 75 ? 20 : 10;
}
i(K, "scoreEngagement");
function N(e) {
  return e >= 25 ? 90 : e >= 15 ? 80 : e >= 10 ? 70 : e >= 5 ? 60 : e >= 3 ? 50 : e >= 1 ? 40 : 30;
}
i(N, "scoreQuickWins");
function B(e, t) {
  if (t === 0) return 0;
  let n = e / t;
  return n >= 1.2 ? 90 : n >= 1 ? 80 : n >= 0.8 ? 65 : n >= 0.6 ? 50 : n >= 0.4 ? 35 : n >= 0.2 ? 20 : 10;
}
i(B, "scoreVelocity");
var U = G({
  args: {
    projectId: S.id("projects")
  },
  handler: /* @__PURE__ */ i(async (e, t) => {
    let n = Date.now(), W = n - 720 * 60 * 60 * 1e3, c = n - 10080 * 60 * 1e3, f = null, m = null;
    try {
      let r = await e.runQuery(Q.analytics.analytics.getAnalyticsData, {
        projectId: t.projectId,
        startDate: W,
        endDate: n,
        source: "gsc"
      });
      if (r && r.length > 0) {
        let o = r[r.length - 1];
        f = o.avgPosition || null, m = o.ctr || null;
      }
    } catch (r) {
      console.error("[MR] Failed to get GSC data:", r);
    }
    let y = null, d = null;
    try {
      let r = await e.runQuery(Q.analytics.analytics.getAnalyticsData, {
        projectId: t.projectId,
        startDate: W,
        endDate: n,
        source: "ga4"
      });
      if (r && r.length >= 2) {
        let o = r.filter((u) => u.date >= c), R = r.filter(
          (u) => u.date < c && u.date >= c - 10080 * 60 * 1e3
        ), q = o.reduce(
          (u, M) => u + (M.sessions || 0),
          0
        ), w = R.reduce(
          (u, M) => u + (M.sessions || 0),
          0
        );
        w > 0 && (y = (q - w) / w * 100), d = r[r.length - 1].bounceRate || null;
      }
    } catch (r) {
      console.error("[MR] Failed to get GA4 data:", r);
    }
    let b = 0;
    try {
      b = (await e.runQuery(s.analytics.gscKeywords.getQuickWinKeywords, {
        projectId: t.projectId,
        minImpressions: 300
      }))?.length || 0;
    } catch (r) {
      console.error("[MR] Failed to get Quick Wins:", r);
    }
    let p = 0, C = 4;
    try {
      let r = /* @__PURE__ */ new Date();
      r.setDate(1), r.setHours(0, 0, 0, 0), p = await e.runQuery(
        s.analytics.martaiRatingQueries.countBriefsThisMonth,
        {
          projectId: t.projectId,
          since: r.getTime()
        }
      ) || 0;
    } catch (r) {
      console.error("[MR] Failed to get briefs:", r);
    }
    let g = _(f), I = $(y), D = v(m), h = K(d), j = N(b), k = B(p, C), a = Math.round(
      (g * l.visibility + I * l.trafficHealth + D * l.ctrPerformance + h * l.engagementQuality + j * l.quickWinPotential + k * l.contentVelocity) / 100
    ), { tier: T, label: A } = E(a);
    return await e.runMutation(s.analytics.martaiRatingQueries.storeScore, {
      projectId: t.projectId,
      date: n,
      overall: a,
      tier: T,
      visibility: g,
      trafficHealth: I,
      ctrPerformance: D,
      engagementQuality: h,
      quickWinPotential: j,
      contentVelocity: k,
      rawMetrics: {
        avgPosition: f,
        sessionsChange: y,
        ctr: m,
        bounceRate: d,
        quickWinCount: b,
        briefsThisMonth: p
      }
    }), console.log(`[MR] Project ${t.projectId}: Score ${a} (${A})`), {
      overall: a,
      tier: T,
      label: A,
      components: {
        visibility: g,
        trafficHealth: I,
        ctrPerformance: D,
        engagementQuality: h,
        quickWinPotential: j,
        contentVelocity: k
      }
    };
  }, "handler")
});
export {
  U as calculateMartAIRating
};
//# sourceMappingURL=martaiRating.js.map
