"use node";
import {
  a as y
} from "../_deps/node/XR6TCUSL.js";
import {
  a as c,
  c as h,
  k as l,
  l as d,
  m as g,
  p as m
} from "../_deps/node/KFFAPE6U.js";
import {
  a as p
} from "../_deps/node/V7X2J7BI.js";

// convex/analytics/insights.ts
h();
m();
var j = l({
  args: {
    projectId: c.id("projects"),
    ga4Data: c.optional(c.any()),
    gscData: c.optional(c.any())
  },
  handler: /* @__PURE__ */ p(async (i, n) => {
    let o = [];
    return n.ga4Data && o.push({
      type: "traffic_trend",
      title: "Traffic is stable",
      description: "Your traffic has been consistent over the last period.",
      action: "monitor",
      metadata: { source: "ga4" }
    }), n.gscData && o.push({
      type: "keyword_opportunity",
      title: "New keyword opportunities",
      description: "You are ranking for new keywords.",
      action: "create_content",
      metadata: { source: "gsc" }
    }), o;
  }, "handler")
}), b = l({
  args: {
    briefId: c.id("briefs"),
    metrics: c.any()
  },
  handler: /* @__PURE__ */ p(async (i, n) => ({
    recommendations: [
      {
        type: "refresh",
        reason: "Content is outdated",
        action: "Update statistics and examples"
      }
    ]
  }), "handler")
}), $ = l({
  args: {
    projectId: c.id("projects")
  },
  handler: /* @__PURE__ */ p(async (i, n) => {
    let o = [], r = await i.runQuery(g.analytics.gscKeywords.getQuickWinKeywords, {
      projectId: n.projectId,
      minImpressions: y.insights.quickWinMinImpressions / 2
      // Lower for enhanced insights
    });
    if (!r || r.length === 0)
      return console.log("[EnhancedInsights] No Quick Win keywords found"), o;
    console.log(`[EnhancedInsights] Found ${r.length} Quick Win keywords`);
    for (let e of r.slice(0, 5))
      try {
        let a = await i.runAction(d.seo.library.searchLibrary, {
          query: e.keyword,
          limit: 5
        });
        if (a && a.length > 0) {
          let t = a.filter(
            (s) => s.searchVolume > y.insights.highValueVolume && s.difficulty < y.insights.lowDifficulty + 10
          );
          t.length > 0 && o.push({
            type: "semantic_opportunity",
            title: `"${e.keyword}" + Related Keywords`,
            description: `You're ranking #${e.position.toFixed(0)} for "${e.keyword}" (${e.impressions} impressions). Related high-value keywords: ${t.map((s) => `${s.keyword} (${s.searchVolume}/mo)`).join(", ")}`,
            action: "Create comprehensive content targeting this topic cluster",
            metadata: {
              gscKeyword: e.keyword,
              gscPosition: e.position,
              gscImpressions: e.impressions,
              relatedKeywords: t.map((s) => ({
                keyword: s.keyword,
                volume: s.searchVolume,
                difficulty: s.difficulty,
                score: s._score
              }))
            }
          });
        }
      } catch (a) {
        console.error("[EnhancedInsights] Failed to search for related keywords:", a);
      }
    for (let e of o)
      await i.runMutation(d.analytics.analytics.storeInsight, {
        projectId: n.projectId,
        type: e.type,
        title: e.title,
        description: e.description,
        action: e.action,
        metadata: e.metadata
      });
    return console.log(`[EnhancedInsights] Generated ${o.length} semantic insights`), o;
  }, "handler")
}), K = l({
  args: {
    projectId: c.id("projects")
  },
  handler: /* @__PURE__ */ p(async (i, n) => {
    let o = await i.runQuery(d.analytics.gscKeywords.getLatestKeywords, {
      projectId: n.projectId,
      limit: 200
    }), r = new Set(
      o.map((t) => t.keyword.toLowerCase())
    ), e = [], a = await i.runQuery(d.seo.library.listKeywords, {
      paginationOpts: { numItems: 50 }
    });
    for (let t of a.page)
      !r.has(t.keyword.toLowerCase()) && t.searchVolume > y.insights.highValueVolume && t.difficulty < y.insights.lowDifficulty && e.push({
        keyword: t.keyword,
        searchVolume: t.searchVolume,
        difficulty: t.difficulty,
        intent: t.intent
      });
    if (e.length > 0) {
      let t = e.slice(0, 5);
      await i.runMutation(d.analytics.analytics.storeInsight, {
        projectId: n.projectId,
        type: "content_gap",
        title: `${e.length} Untapped Keywords Found`,
        description: `Your site isn't ranking for these high-value keywords: ${t.map((s) => `${s.keyword} (${s.searchVolume}/mo)`).join(", ")}. Create content targeting these opportunities.`,
        action: "Create new content",
        metadata: { gaps: t }
      });
    }
    return e;
  }, "handler")
}), C = l({
  args: {
    projectId: c.id("projects")
  },
  handler: /* @__PURE__ */ p(async (i, n) => {
    let o = await i.runQuery(d.analytics.gscKeywords.getLatestKeywords, {
      projectId: n.projectId,
      limit: 50
    });
    if (!o || o.length < 5)
      return [];
    let r = [], e = /* @__PURE__ */ new Map();
    for (let a of o) {
      let t = a.keyword.split(" ")[0].toLowerCase();
      e.has(t) || e.set(t, []), e.get(t).push(a);
    }
    for (let [a, t] of e)
      t.length >= 3 && r.push({
        name: a.charAt(0).toUpperCase() + a.slice(1),
        keywords: t.map((s) => s.keyword),
        totalImpressions: t.reduce(
          (s, u) => s + u.impressions,
          0
        ),
        avgPosition: t.reduce((s, u) => s + u.position, 0) / t.length
      });
    return r.length > 0 && await i.runMutation(d.analytics.analytics.storeInsight, {
      projectId: n.projectId,
      type: "cluster_suggestion",
      title: `${r.length} Topic Clusters Identified`,
      description: `Your keywords naturally group into ${r.length} topic clusters. Consider creating pillar content for: ${r.slice(0, 3).map((a) => a.name).join(", ")}`,
      action: "Generate topic clusters",
      metadata: { clusters: r.slice(0, 5) }
    }), r;
  }, "handler")
}), V = l({
  args: {
    projectId: c.id("projects")
  },
  handler: /* @__PURE__ */ p(async (i, n) => {
    let o = [], r = await i.runQuery(g.analytics.gscKeywords.getQuickWinKeywords, {
      projectId: n.projectId,
      minImpressions: 500
    });
    for (let e of (r || []).slice(0, 3))
      o.push({
        title: `Complete Guide: ${e.keyword.charAt(0).toUpperCase() + e.keyword.slice(1)}`,
        targetKeyword: e.keyword,
        reason: `Ranking #${e.position.toFixed(0)} with ${e.impressions} impressions - push to page 1`,
        priority: "high"
      });
    return o.length > 0 && await i.runMutation(d.analytics.analytics.storeInsight, {
      projectId: n.projectId,
      type: "brief_suggestion",
      title: `${o.length} Content Ideas Ready`,
      description: `Based on your Quick Wins, we suggest: ${o.map((e) => e.title).join(", ")}`,
      action: "Create briefs",
      metadata: { suggestions: o }
    }), o;
  }, "handler")
});
export {
  K as findContentGaps,
  b as generateContentInsights,
  $ as generateEnhancedInsights,
  j as generateInsights,
  V as suggestBriefs,
  C as suggestKeywordClusters
};
//# sourceMappingURL=insights.js.map
