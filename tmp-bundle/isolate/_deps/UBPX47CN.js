import {
  a as I
} from "./K33OSGN4.js";
import {
  c as R,
  e as k
} from "./4U34M3I6.js";
import {
  a as p
} from "./RUVYHBJQ.js";

// convex/phoo/lib/rating.ts
k();
var c = {
  SEO_AUDIT: 0.35,
  // 35% - Technical SEO health
  KEYWORDS: 0.25,
  // 25% - Keyword strategy quality
  CLUSTERS: 0.25,
  // 25% - Content organization
  CONTENT: 0.15
  // 15% - Content execution
}, D = {
  POOR: { min: 0, max: 30, label: "Needs Work", color: "red" },
  FAIR: { min: 30, max: 50, label: "Fair", color: "orange" },
  GOOD: { min: 50, max: 70, label: "Good", color: "yellow" },
  GREAT: { min: 70, max: 85, label: "Great", color: "green" },
  EXCELLENT: { min: 85, max: 100, label: "Excellent", color: "teal" }
}, A = I({
  args: {
    projectId: R.id("projects")
  },
  handler: /* @__PURE__ */ p(async (e, l) => {
    if (!await e.db.get(l.projectId))
      return $("Project not found");
    let o = [], n = [], i = await e.db.query("seoAudits").withIndex("by_project", (t) => t.eq("projectId", l.projectId)).order("desc").first(), h = 0;
    i ? (h = i.overallScore, o.push({
      component: "SEO Health",
      score: h,
      weight: c.SEO_AUDIT,
      weighted: h * c.SEO_AUDIT,
      details: `Technical: ${i.technicalSeo.score}, On-Page: ${i.onPageSeo.score}, Content: ${i.contentQuality.score}`
    }), i.technicalSeo.score < 50 && n.push(`Technical SEO needs attention (${i.technicalSeo.score}/100)`), i.contentQuality.score < 50 && n.push(`Content quality could improve (${i.contentQuality.score}/100)`)) : (o.push({
      component: "SEO Health",
      score: 0,
      weight: c.SEO_AUDIT,
      weighted: 0,
      details: "No SEO audit available"
    }), n.push("Run an SEO audit to get insights on your site health"));
    let s = await e.db.query("keywords").withIndex("by_project", (t) => t.eq("projectId", l.projectId)).collect(), w = 0;
    if (s.length > 0) {
      let t = s.filter((r) => r.searchVolume && r.searchVolume > 0).length, d = s.filter((r) => r.difficulty !== void 0).length, g = s.filter((r) => r.priority === "high").length, E = s.filter(
        (r) => r.status === "approved" || r.status === "implemented"
      ).length, b = Math.min(s.length / 20, 1) * 30, O = (t + d) / (s.length * 2) * 30, u = (g + E) / (s.length * 2) * 40;
      w = Math.round(b + O + u), o.push({
        component: "Keyword Strategy",
        score: w,
        weight: c.KEYWORDS,
        weighted: w * c.KEYWORDS,
        details: `${s.length} keywords, ${t} with volume data, ${g} high priority`
      }), t < s.length * 0.5 && n.push(`${s.length - t} keywords missing search volume data`);
    } else
      o.push({
        component: "Keyword Strategy",
        score: 0,
        weight: c.KEYWORDS,
        weighted: 0,
        details: "No keywords discovered yet"
      }), n.push("Generate keywords to start building your SEO strategy");
    let a = await e.db.query("keywordClusters").withIndex("by_project", (t) => t.eq("projectId", l.projectId)).collect(), y = 0;
    if (a.length > 0) {
      let t = a.reduce((u, r) => u + r.impactScore, 0) / a.length, d = a.filter(
        (u) => u.status === "active" || u.status === "favorite"
      ).length, g = a.reduce((u, r) => u + r.difficulty, 0) / a.length, E = Math.min(a.length / 5, 1) * 30, b = t * 40, O = d / a.length * 30;
      y = Math.round(E + b + O), o.push({
        component: "Content Clusters",
        score: y,
        weight: c.CLUSTERS,
        weighted: y * c.CLUSTERS,
        details: `${a.length} clusters, avg impact ${(t * 100).toFixed(0)}%, avg difficulty ${g.toFixed(0)}`
      }), g > 70 && n.push(
        "Your clusters target high-difficulty keywords. Consider adding easier wins."
      );
    } else
      o.push({
        component: "Content Clusters",
        score: 0,
        weight: c.CLUSTERS,
        weighted: 0,
        details: "No topic clusters created"
      }), n.push("Create topic clusters to organize your content strategy");
    let m = await e.db.query("contentCalendars").withIndex("by_project", (t) => t.eq("projectId", l.projectId)).first(), S = await e.db.query("contentPieces").withIndex("by_project", (t) => t.eq("projectId", l.projectId)).collect(), f = 0;
    if (m || S.length > 0) {
      let t = m ? 40 : 0, d = Math.min(S.length / 5, 1) * 60;
      f = Math.round(t + d), o.push({
        component: "Content Execution",
        score: f,
        weight: c.CONTENT,
        weighted: f * c.CONTENT,
        details: `${S.length} content pieces${m ? ", active calendar" : ""}`
      });
    } else
      o.push({
        component: "Content Execution",
        score: 0,
        weight: c.CONTENT,
        weighted: 0,
        details: "No content calendar or content pieces"
      }), n.push("Create a content calendar to drive consistent publishing");
    let C = Math.round(o.reduce((t, d) => t + d.weighted, 0)), { status: N, color: j } = v(C), x = P(o, n);
    return {
      rating: C,
      status: N,
      color: j,
      breakdown: o,
      insights: n.slice(0, 3),
      // Top 3 insights
      topOpportunity: x
    };
  }, "handler")
});
function v(e) {
  return e >= 85 ? { status: "Excellent", color: "teal" } : e >= 70 ? { status: "Great", color: "green" } : e >= 50 ? { status: "Good", color: "yellow" } : e >= 30 ? { status: "Fair", color: "orange" } : { status: "Needs Work", color: "red" };
}
p(v, "getStatusFromRating");
function P(e, l) {
  let o = [...e].sort((n, i) => {
    let h = n.weight * (100 - n.score);
    return i.weight * (100 - i.score) - h;
  })[0];
  if (!o)
    return "Your SEO strategy is looking great! Keep creating quality content.";
  switch (o.component) {
    case "SEO Health":
      return "Run an SEO audit to identify technical issues and content gaps.";
    case "Keyword Strategy":
      return "Expand your keyword research with more search volume data.";
    case "Content Clusters":
      return "Create topic clusters to organize your content strategy.";
    case "Content Execution":
      return "Generate content briefs and build your publishing calendar.";
    default:
      return l[0] || "Continue building out your SEO foundation.";
  }
}
p(P, "determineTopOpportunity");
function $(e) {
  return {
    rating: 0,
    status: "Needs Work",
    color: "red",
    breakdown: [
      { component: "SEO Health", score: 0, weight: 0.35, weighted: 0, details: "No data" },
      { component: "Keyword Strategy", score: 0, weight: 0.25, weighted: 0, details: "No data" },
      { component: "Content Clusters", score: 0, weight: 0.25, weighted: 0, details: "No data" },
      { component: "Content Execution", score: 0, weight: 0.15, weighted: 0, details: "No data" }
    ],
    insights: [e],
    topOpportunity: "Start by running an SEO audit on your website."
  };
}
p($, "createDefaultRating");

export {
  c as a,
  D as b,
  A as c
};
//# sourceMappingURL=UBPX47CN.js.map
