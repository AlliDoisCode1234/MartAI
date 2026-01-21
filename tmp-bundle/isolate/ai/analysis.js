import {
  b as K,
  c as M
} from "../_deps/J7ZPJBHN.js";
import {
  a as m,
  e as S
} from "../_deps/GTU362KY.js";
import {
  a as b
} from "../_deps/OFY2WAT7.js";
import "../_deps/ZRD5YQUR.js";
import {
  e as P
} from "../_deps/K33OSGN4.js";
import {
  c as p,
  d as I,
  e as j
} from "../_deps/4U34M3I6.js";
import {
  a as s
} from "../_deps/RUVYHBJQ.js";

// convex/ai/analysis.ts
j();
S();
j();
var G = P({
  args: {
    prospectId: p.optional(p.id("prospects")),
    projectId: p.optional(p.id("projects")),
    url: p.optional(p.string()),
    force: p.optional(p.boolean())
  },
  handler: /* @__PURE__ */ s(async (e, r) => {
    let t = await b.getUserId(e);
    if (!t)
      throw new Error("Unauthorized");
    let o = await e.runQuery(m.users.current);
    if (!o)
      throw new Error("User not found");
    let n;
    o.role === "admin" || o.role === "super_admin" ? n = "admin" : n = o.membershipTier || "free";
    let a = M("aiAnalysis", n), { ok: u, retryAfter: l } = await K.limit(e, a, {
      key: t
    });
    if (!u) {
      let i = Math.ceil(l / 1e3 / 60);
      throw new I({
        kind: "RateLimitError",
        message: `Rate limit exceeded. You can generate ${n === "free" ? "2 reports per day" : n === "admin" ? "50 reports per day" : `${n} tier limit reached`}. Try again in ${i} minute${i !== 1 ? "s" : ""}.`,
        retryAfter: l
      });
    }
    if (!r.prospectId && !r.projectId && !r.url)
      throw new Error("Provide a prospectId, projectId, or url to analyze.");
    let c = await k(e, r), y = c.prospectId, f = c.projectId;
    console.info("Starting MartAI pipeline", c);
    let R = `Running MartAI intelligence pipeline for ${c.url}`, g = await e.runMutation(m.ai.reports.createAiReport, {
      prospectId: y,
      projectId: f,
      url: c.url,
      status: "pending",
      summary: R,
      metrics: {
        coverageScore: 0,
        backlinksProxy: 0,
        domainRatingProxy: 0,
        organicKeywords: 0,
        trafficEstimate: 0
      },
      confidence: {
        score: 0,
        sources: []
      },
      dataSources: []
    });
    try {
      let i = await T(c.url), d = await $(c, i), C = A(i, d), w = E(c, d);
      return await e.runMutation(m.ai.reports.updateAiReport, {
        reportId: g,
        status: "completed",
        summary: d.summary,
        metrics: {
          coverageScore: d.coverageScore,
          backlinksProxy: d.backlinksProxy,
          domainRatingProxy: d.domainRatingProxy,
          organicKeywords: d.organicKeywords,
          trafficEstimate: d.trafficEstimate
        },
        confidence: C,
        dataSources: d.sources,
        crawlData: {
          title: i.metadata.title,
          description: i.metadata.description,
          wordCount: i.wordCount,
          headings: i.headings,
          loadTime: i.loadTime,
          htmlSample: i.htmlSample
        }
      }), await v(e, w, {
        ...c,
        prospectId: y,
        projectId: f
      }), await x(e, w, {
        ...c,
        prospectId: y,
        projectId: f
      }), {
        reportId: g.toString(),
        metrics: d,
        keywordIdeasCreated: w.length
      };
    } catch (i) {
      throw console.error("MartAI pipeline failed", i), await e.runMutation(m.ai.reports.updateAiReport, {
        reportId: g,
        status: "failed",
        summary: i?.message || "Pipeline failed unexpectedly"
      }), i;
    }
  }, "handler")
});
async function k(e, r) {
  if (r.url)
    return {
      url: h(r.url),
      prospectId: r.prospectId,
      projectId: r.projectId,
      hints: {}
    };
  if (r.prospectId) {
    let t = await e.runQuery(m.prospects.prospects.getProspect, {
      prospectId: r.prospectId
    });
    if (!t)
      throw new Error("Prospect not found");
    let o = t.urls?.[0]?.url;
    if (!o)
      throw new Error("Prospect is missing URLs to analyze");
    return {
      url: h(o),
      prospectId: r.prospectId,
      hints: {
        companyName: t.prospect?.companyName,
        industry: void 0
      }
    };
  }
  if (r.projectId) {
    let t = await e.runQuery(m.projects.projects.getProjectById, {
      projectId: r.projectId
    });
    if (!t)
      throw new Error("Project not found");
    return {
      url: h(t.websiteUrl),
      projectId: r.projectId,
      hints: {
        companyName: t.name,
        industry: t.industry
      }
    };
  }
  throw new Error("Unable to resolve target.");
}
s(k, "resolveTarget");
async function T(e) {
  try {
    let r = await fetch(e, { method: "GET" }), t = await r.text(), n = t.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean), a = Number(r.headers.get("Server-Timing")?.split("=")[1]) || 1200;
    return {
      url: e,
      htmlSample: t.slice(0, 4e3),
      wordCount: n.length,
      headings: _(t),
      metadata: {
        title: U(t, "title"),
        description: N(t, "description")
      },
      loadTime: a
    };
  } catch {
    return {
      url: e,
      htmlSample: "",
      wordCount: 0,
      headings: [],
      metadata: {},
      loadTime: 0
    };
  }
}
s(T, "smartCrawl");
async function $(e, r) {
  let t = Math.min(100, Math.round(r.wordCount / 25)), o = Math.round(t * 2.1), n = Math.min(100, Math.round(o / 3)), a = Math.max(25, Math.round(t * 3)), u = Math.round(a * 12);
  return {
    summary: [
      `Analyzed ${e.hints.companyName || "the site"} (${e.url}).`,
      `Estimated traffic: ${u.toLocaleString()} visits / mo.`,
      `Keyword coverage: ${t}% with ~${a} organic phrases.`
    ].join(" "),
    coverageScore: t,
    backlinksProxy: o,
    domainRatingProxy: n,
    organicKeywords: a,
    trafficEstimate: u,
    sources: ["smart_crawl", "heuristic_ai"]
  };
}
s($, "knowledgeFusion");
function A(e, r) {
  let t = e.wordCount > 0 ? 40 : 0, o = e.metadata.title ? 15 : 0, n = Math.min(100, t + o + r.coverageScore * 0.3);
  return {
    score: Math.round(n),
    sources: ["smart_crawl", "heuristic_ai"]
  };
}
s(A, "scoreConfidence");
function E(e, r) {
  let t = e.hints.companyName?.toLowerCase().includes("chef") ? "culinary" : "growth";
  return ["informational", "commercial", "transactional"].map((n, a) => ({
    primaryKeyword: `${t} ${n} strategy ${a + 1}`,
    supportingKeywords: [
      `${t} keyword research`,
      `${n} content ideas`,
      `${t} automation`
    ],
    intent: n,
    trafficPotential: r.trafficEstimate - a * 120,
    kdScore: Math.max(12, r.domainRatingProxy - a * 5),
    cpc: 2.5 + a,
    priority: a === 0 ? "high" : a === 1 ? "medium" : "low"
  }));
}
s(E, "generateKeywordIdeas");
async function v(e, r, t) {
  for (let o of r)
    await e.runMutation(m.seo.keywordIdeas.createKeywordIdea, {
      prospectId: t.prospectId,
      projectId: t.projectId,
      primaryKeyword: o.primaryKeyword,
      supportingKeywords: o.supportingKeywords,
      intent: o.intent,
      trafficPotential: o.trafficPotential,
      kdScore: o.kdScore,
      cpc: o.cpc,
      priority: o.priority,
      serpNotes: `Generated by MartAI pipeline on ${(/* @__PURE__ */ new Date()).toISOString()}`
    });
}
s(v, "persistKeywordIdeas");
async function x(e, r, t) {
  if (!t.projectId || r.length === 0)
    return;
  let o = r[0];
  await e.runMutation(m.content.calendars.upsertCalendarItem, {
    projectId: t.projectId,
    prospectId: t.prospectId,
    title: `Keyword Focus: ${F(o.primaryKeyword)}`,
    contentType: "long_form_article",
    primaryKeyword: o.primaryKeyword,
    supportingKeywords: o.supportingKeywords,
    status: "idea",
    publishDate: Date.now() + 10080 * 60 * 1e3,
    notes: "Autogenerated by MartAI intelligence layer. Adjust schedule before committing."
  });
}
s(x, "persistCalendarPreview");
function U(e, r) {
  let t = e.match(new RegExp(`<${r}[^>]*>(.*?)</${r}>`, "i"));
  return t ? t[1].trim() : void 0;
}
s(U, "extractTag");
function N(e, r) {
  let t = new RegExp(`<meta[^>]+name=["']${r}["'][^>]+content=["'](.*?)["']`, "i"), o = e.match(t);
  return o ? o[1].trim() : void 0;
}
s(N, "extractMeta");
function _(e) {
  return Array.from(e.matchAll(/<(h[1-3])[^>]*>(.*?)<\/\1>/gi)).map((t) => t[2].replace(/<[^>]+>/g, "").trim());
}
s(_, "extractHeadings");
function h(e) {
  return !e.startsWith("http://") && !e.startsWith("https://") ? `https://${e}` : e;
}
s(h, "normalizeUrl");
function F(e) {
  return e ? e.charAt(0).toUpperCase() + e.slice(1) : "";
}
s(F, "capitalize");
export {
  G as runPipeline
};
//# sourceMappingURL=analysis.js.map
