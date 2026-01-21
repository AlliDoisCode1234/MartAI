"use node";
import {
  a as h,
  b as E,
  c as K
} from "../_deps/node/57OLBLOV.js";
import "../_deps/node/BMIQ74CQ.js";
import {
  a as b,
  c as V,
  j as D,
  n as x,
  o as O,
  p as C
} from "../_deps/node/KFFAPE6U.js";
import {
  a as m,
  g as P
} from "../_deps/node/V7X2J7BI.js";

// convex/seo/agentActions.ts
V();

// lib/utils.ts
async function L(d, n = {}) {
  let { retries: t = 3, delay: e = 1e3, backoff: o = 2, onRetry: r } = n, i = 0, l = e;
  for (; ; )
    try {
      return await d();
    } catch (c) {
      if (i++, i > t)
        throw c;
      r && r(c, i), await new Promise((u) => setTimeout(u, l)), l *= o;
    }
}
m(L, "withRetry");

// lib/generators/keywordGenerator.ts
async function N(d, n, t, e, o) {
  if (!process.env.OPENAI_API_KEY && !process.env.VERCEL_AI_GATEWAY_KEY)
    return console.warn("OpenAI API key not found, returning mock keywords"), [
      {
        keyword: `${n} services`,
        intent: "commercial",
        priority: "high",
        reasoning: "Primary service keyword (Mock Data)",
        searchVolume: 1e3,
        difficulty: 45
      },
      {
        keyword: `best ${n} for ${t}`,
        intent: "commercial",
        priority: "high",
        reasoning: "High intent long-tail keyword (Mock Data)",
        searchVolume: 500,
        difficulty: 30
      },
      {
        keyword: `${n} trends 2025`,
        intent: "informational",
        priority: "medium",
        reasoning: "Trending topic for authority (Mock Data)",
        searchVolume: 2e3,
        difficulty: 60
      },
      {
        keyword: `how to choose ${n}`,
        intent: "informational",
        priority: "medium",
        reasoning: "Educational content for top of funnel (Mock Data)",
        searchVolume: 800,
        difficulty: 25
      },
      {
        keyword: `${n} pricing`,
        intent: "transactional",
        priority: "high",
        reasoning: "Bottom of funnel intent (Mock Data)",
        searchVolume: 300,
        difficulty: 50
      }
    ];
  let r = K("gpt-4o"), i = `You are an expert SEO keyword researcher. Generate a comprehensive list of 20-30 high-value keywords for ${d}, a ${n} company targeting ${t}.

Website: ${e}

Consider:
1. Primary service/product keywords
2. Long-tail keywords with buyer intent
3. Local SEO keywords if applicable
4. Competitor analysis keywords
5. Content gap opportunities
6. Commercial and transactional intent keywords

For each keyword, provide:
- The keyword phrase
- Estimated search intent (informational, commercial, transactional, navigational)
- Priority level (high, medium, low) based on relevance and opportunity
- Brief reasoning for why this keyword is valuable
- 2-3 related keyword variations

Focus on keywords that would help improve their website's visibility and drive qualified traffic.`, l = await L(
    async () => await E({
      model: r,
      prompt: i,
      tools: {
        generateKeywords: {
          description: "Generate SEO keyword suggestions with intent, priority, and reasoning",
          inputSchema: h.object({
            keywords: h.array(
              h.object({
                keyword: h.string().describe("The keyword phrase"),
                intent: h.enum(["informational", "commercial", "transactional", "navigational"]).describe("Search intent"),
                priority: h.enum(["high", "medium", "low"]).describe("Priority level"),
                reasoning: h.string().describe("Why this keyword is valuable"),
                relatedKeywords: h.array(h.string()).optional().describe("Related keyword variations"),
                estimatedVolume: h.number().optional().describe("Estimated monthly search volume"),
                estimatedDifficulty: h.number().optional().describe("Estimated keyword difficulty 0-100")
              })
            )
          }),
          execute: /* @__PURE__ */ m(async ({ keywords: u }) => u.map((s) => ({
            keyword: s.keyword,
            searchVolume: s.estimatedVolume,
            difficulty: s.estimatedDifficulty,
            intent: s.intent,
            priority: s.priority,
            reasoning: s.reasoning,
            relatedKeywords: s.relatedKeywords
          })), "execute")
        }
      }
    }),
    {
      onRetry: /* @__PURE__ */ m((u, s) => console.log(
        `Retry attempt ${s} for generateKeywords:`,
        u instanceof Error ? u.message : String(u)
      ), "onRetry")
    }
  ), c = l.toolResults ?? [];
  if (c.length > 0) {
    let u = c[0], s = u?.output ?? u?.result;
    if (s && Array.isArray(s))
      return s;
  }
  return W(l.text);
}
m(N, "generateKeywords");
function W(d) {
  let n = [], t = d.split(`
`).filter((o) => o.trim()), e = null;
  for (let o of t) {
    let r = o.trim();
    if (r.match(/^\d+\.|^[-*]/) || r.includes("keyword:")) {
      e && e.keyword && n.push({
        keyword: e.keyword,
        intent: e.intent ?? "informational",
        priority: e.priority ?? "medium",
        reasoning: e.reasoning ?? ""
      });
      let i = r.match(/(?:keyword:)?\s*([^:]+)/i);
      i && (e = {
        keyword: i[1].trim(),
        intent: "informational",
        priority: "medium",
        reasoning: ""
      });
    } else if (e)
      if (r.toLowerCase().includes("intent:")) {
        let i = r.match(/intent:\s*(\w+)/i);
        if (i) {
          let l = i[1].toLowerCase();
          ["informational", "commercial", "transactional", "navigational"].includes(l) && (e.intent = l);
        }
      } else if (r.toLowerCase().includes("priority:")) {
        let i = r.match(/priority:\s*(\w+)/i);
        if (i) {
          let l = i[1].toLowerCase();
          ["high", "medium", "low"].includes(l) && (e.priority = l);
        }
      } else r.toLowerCase().includes("reasoning:") || r.toLowerCase().includes("why:") ? e.reasoning = r.split(":").slice(1).join(":").trim() : e.reasoning || (e.reasoning = r);
  }
  return e && e.keyword && n.push({
    keyword: e.keyword,
    intent: e.intent ?? "informational",
    priority: e.priority ?? "medium",
    reasoning: e.reasoning ?? ""
  }), n.slice(0, 30);
}
m(W, "parseKeywordsFromText");

// lib/generators/siteCrawler.ts
async function F(d) {
  let n = Date.now(), t = [], e = d.startsWith("http") ? d : `https://${d}`;
  try {
    let o = await fetch(e, {
      headers: {
        "User-Agent": "MartAI-SEO-Crawler/1.0",
        Accept: "text/html,application/xhtml+xml"
      },
      signal: AbortSignal.timeout(15e3)
      // 15 second timeout
    });
    if (!o.ok)
      throw new Error(`HTTP ${o.status}: ${o.statusText}`);
    let r = await o.text(), i = Date.now() - n, l = r.match(/<title[^>]*>([^<]*)<\/title>/i), c = l ? l[1].trim() : null;
    c ? c.length < 30 ? t.push("Title too short (< 30 chars)") : c.length > 60 && t.push("Title too long (> 60 chars)") : t.push("Missing page title");
    let u = r.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) || r.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i), s = u ? u[1].trim() : null;
    s ? s.length < 120 ? t.push("Meta description too short (< 120 chars)") : s.length > 160 && t.push("Meta description too long (> 160 chars)") : t.push("Missing meta description");
    let w = r.matchAll(/<h1[^>]*>([^<]*)<\/h1>/gi), g = Array.from(w, (y) => y[1].trim()).filter(Boolean);
    g.length === 0 ? t.push("Missing H1 tag") : g.length > 1 && t.push(`Multiple H1 tags found (${g.length})`);
    let S = r.matchAll(/<h2[^>]*>([^<]*)<\/h2>/gi), p = Array.from(S, (y) => y[1].trim()).filter(Boolean), f = r.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().split(/\s+/).filter((y) => y.length > 0).length;
    f < 300 && t.push("Thin content (< 300 words)");
    let a = /<meta[^>]*name=["']viewport["'][^>]*>/i.test(r);
    a || t.push("Missing viewport meta tag (mobile-unfriendly)");
    let k = r.matchAll(/<img[^>]*>/gi), I = Array.from(k), T = I.filter(
      (y) => !y[0].includes("alt=") || /alt=["']\s*["']/i.test(y[0])
    ).length;
    T > 0 && t.push(`${T} image(s) missing alt text`);
    let U = r.matchAll(/<a[^>]*href=["']([^"']*)["'][^>]*>/gi), G = Array.from(U), q = new URL(e).hostname, R = 0, M = 0;
    for (let y of G)
      try {
        let $ = y[1];
        if ($.startsWith("#") || $.startsWith("javascript:")) continue;
        $.startsWith("/") || $.includes(q) ? R++ : $.startsWith("http") && M++;
      } catch {
      }
    return i > 3e3 && t.push(`Slow page load (${(i / 1e3).toFixed(1)}s)`), {
      url: e,
      title: c,
      metaDescription: s,
      h1Tags: g,
      h2Tags: p,
      wordCount: f,
      loadTime: i,
      mobileFriendly: a,
      issues: t,
      images: {
        total: I.length,
        withoutAlt: T
      },
      links: {
        internal: R,
        external: M
      }
    };
  } catch (o) {
    let r = o instanceof Error ? o.message : "Unknown error";
    return {
      url: e,
      title: null,
      metaDescription: null,
      h1Tags: [],
      h2Tags: [],
      wordCount: 0,
      loadTime: Date.now() - n,
      mobileFriendly: !1,
      issues: [`Crawl failed: ${r}`],
      images: { total: 0, withoutAlt: 0 },
      links: { internal: 0, external: 0 }
    };
  }
}
m(F, "crawlWebsite");

// convex/lib/services/intelligence.ts
C();
var A = class {
  static {
    m(this, "IntelligenceService");
  }
  ctx;
  constructor(n) {
    this.ctx = n;
  }
  /**
   * Ingest content into the RAG knowledge base.
   */
  async ingest(n, t, e = {}) {
    try {
      await this.ctx.runMutation(x.rag.add, {
        text: t,
        metadata: { ...e, source: n }
      }), console.log(`[IntelligenceService] Ingested ${n}`);
    } catch (o) {
      console.error(`[IntelligenceService] Ingestion failed for ${n}:`, o);
    }
  }
  /**
   * Retrieve relevant context from the RAG knowledge base.
   */
  async retrieve(n, t = 3) {
    try {
      let o = (await this.ctx.runQuery(x.rag.search, {
        query: n,
        limit: t
      })).map((r) => `[Source: ${r.metadata?.source || "Unknown"}]
${r.text}`).join(`

`);
      return o && console.log(
        `[IntelligenceService] Retrieved ${o.length} chars of context for query: "${n}"`
      ), o;
    } catch (e) {
      return console.warn(`[IntelligenceService] Retrieval failed for query: "${n}"`, e), "";
    }
  }
  async generate(n, t = "", e = {}) {
    let { api: o } = (C(), P(O)), r = crypto.randomUUID(), i = e.model || "gpt-4o", l = e.temperature || 0.7, c = "";
    if (e.persona)
      try {
        let a = await this.ctx.runQuery(o.ai.personas.getPersona, {
          name: e.persona
        });
        a ? c = a.systemPrompt : (console.warn(
          `[IntelligenceService] Persona '${e.persona}' not found. Using default.`
        ), c = `You are ${e.persona}.`);
      } catch (a) {
        console.error(`[IntelligenceService] Failed to load persona '${e.persona}'`, a), c = `You are ${e.persona}.`;
      }
    let u = `${c}
${t ? `
CONTEXT:
${t}
` : ""}
${n}`;
    console.log(`[IntelligenceService] Generating (Trace: ${r})...`);
    let { text: s, usage: w } = await this.callLLM(
      i,
      u,
      l
    );
    if (await this.logCost(w, i, r, e.userId), !e.useReflection)
      return { content: s, traceId: r, cost: 0 };
    console.log(`[IntelligenceService] Critiquing (Trace: ${r})...`);
    let { text: g, usage: S } = await this.critiqueDraft(
      s,
      e.persona || "Senior Analyst",
      c
    );
    await this.logCost(S, i, r, e.userId);
    let p = g.toLowerCase().trim();
    if (p.includes("no changes needed") || p.includes("no changes required") || p.includes("no improvements") || p === "")
      return console.log(`[IntelligenceService] Trace ${r} Complete - No refinement needed.`), {
        content: s,
        traceId: r,
        cost: 0,
        issues: [g]
      };
    console.log(`[IntelligenceService] Refining (Trace: ${r})...`);
    let { text: v, usage: f } = await this.refineDraft(
      s,
      g,
      e.persona || "Senior Analyst",
      c
    );
    return await this.logCost(f, i, r, e.userId), console.log(
      `[IntelligenceService] Trace ${r} Complete. Critique: ${g.substring(0, 100)}...`
    ), {
      content: v,
      traceId: r,
      cost: 0,
      issues: [g]
    };
  }
  async logCost(n, t, e, o) {
    if (n)
      try {
        await this.ctx.runAction(x.neutralCost.aiCosts.addAICost, {
          messageId: crypto.randomUUID(),
          threadId: e,
          modelId: t,
          providerId: "openai",
          usage: {
            completionTokens: n.completionTokens,
            promptTokens: n.promptTokens,
            totalTokens: n.totalTokens
          },
          userId: o
        });
      } catch (r) {
        console.error("[IntelligenceService] Failed to log cost:", r);
      }
  }
  /**
   * Call LLM with automatic multi-provider failover
   * Uses the AI router for intelligent provider selection and failover
   */
  async callLLM(n, t, e, o = 3) {
    let { api: r } = (C(), P(O));
    try {
      let i = await this.ctx.runAction(r.ai.router.router.generateWithFallback, {
        prompt: t,
        temperature: e,
        strategy: "balanced",
        userId: void 0
        // Can be passed from outer context if needed
      });
      return {
        text: i.content,
        usage: i.usage,
        modelUsed: `${i.provider}/${i.model}`
      };
    } catch (i) {
      throw console.error("[IntelligenceService] Multi-provider failover exhausted:", i.message), i;
    }
  }
  async critiqueDraft(n, t, e) {
    let o = `${e || `You are "${t}".`}
    
Your job is to bluntly but constructively critique this draft. 
Focus on: 
1. Search Intent mismatch. 
2. Brand Voice consistency. 
3. Missing semantic depth.

Return a concise paragraph of feedback. If it's perfect, say "No changes needed."

DRAFT:
${n.substring(0, 3e3)}... (truncated)`;
    return this.callLLM("gpt-4o", o, 0.5);
  }
  async refineDraft(n, t, e, o) {
    if (t.includes("No changes needed"))
      return { text: n, usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 } };
    let r = `You are a professional content writer.
    
Critique from ${e}:
"${t}"

Please rewrite the following draft to address this feedback. Keep what works, fix what doesn't.

ORIGINAL DRAFT:
${n}`;
    return this.callLLM("gpt-4o", r, 0.7);
  }
};

// convex/seo/agentActions.ts
var le = D({
  args: {
    website: b.string(),
    companyName: b.string(),
    industry: b.string(),
    targetAudience: b.string(),
    monthlyRevenueGoal: b.string()
  },
  handler: /* @__PURE__ */ m(async (d, n) => {
    console.log(`[SEO Agent] Starting analysis for ${n.companyName} (${n.website})`);
    let t;
    try {
      t = await F(n.website);
    } catch (a) {
      console.error("[SEO Agent] Crawl failed:", a);
    }
    let e = t?.issues ?? [], o = /* @__PURE__ */ m(() => {
      if (!t) return 50;
      let a = 100, k = e.length * 10;
      return Math.max(0, a - k);
    }, "calculateTechnicalScore"), r = /* @__PURE__ */ m(() => {
      if (!t) return 50;
      let a = e.filter(
        (k) => k.includes("H1") || k.includes("meta") || k.includes("heading")
      ).length;
      return Math.max(0, 100 - a * 15);
    }, "calculateOnPageScore"), i = /* @__PURE__ */ m(() => {
      if (!t) return 50;
      let a = t.wordCount;
      return Math.min(100, Math.max(0, a / 20 + 50));
    }, "calculateContentScore"), l = o(), c = r(), u = i(), s = Math.round((l + c + u + 65) / 4), w = [];
    try {
      w = await N(
        n.companyName,
        n.industry,
        n.targetAudience,
        n.website
      );
    } catch (a) {
      console.error("[SEO Agent] Keyword generation failed:", a);
    }
    let g = new A(d), S = `
    Business Info:
    Name: ${n.companyName}
    Industry: ${n.industry}
    Target Audience: ${n.targetAudience}
    Revenue Goal: ${n.monthlyRevenueGoal}
    
    Site Analysis Data:
    ${t ? JSON.stringify(
      {
        title: t.title,
        metaDescription: t.metaDescription,
        h1Tags: (t.h1Tags || []).slice(0, 10),
        // Limit to 10 headers
        wordCount: t.wordCount,
        loadTime: t.loadTime,
        mobileFriendly: t.mobileFriendly,
        issues: (t.issues || []).slice(0, 10)
        // Limit to 10 issues
      },
      null,
      2
    ) : "Crawl failed or skipped."}

    Generated Keywords:
    ${w.slice(0, 20).map((a) => `- ${a.keyword} (${a.intent})`).join(`
`)}

    Computed Scores:
    Technical: ${l}
    OnPage: ${c}
    Content: ${u}
    Overall: ${s}
    `, p = `Perform a comprehensive executive SEO Audit for this client.
    
    Analyze the provided technical data and keyword opportunities.
    Provide actionable recommendations prioritized by impact on their revenue goal (${n.monthlyRevenueGoal}).
    
    Be concise, professional, but authoritative. Use the "Mart" persona (Senior SEO Analyst).
    
    Output Format:
    Return a valid JSON object ONLY, with this structure:
    {
      "executiveSummary": "string",
      "top3Priorities": ["string", "string", "string"],
      "contentStrategy": "string",
      "technicalRecommendations": ["string"],
      "marketingAngle": "string"
    }
    `, v = await g.generate(p, S, {
      persona: "Mart",
      temperature: 0.7,
      useReflection: !0
      // Self-correct to ensure high quality
    }), f;
    try {
      let a = v.content.replace(/```json/g, "").replace(/```/g, "").trim();
      f = JSON.parse(a);
    } catch (a) {
      console.error("[SEO Agent] Failed to parse AI JSON:", a), f = {
        executiveSummary: v.content,
        top3Priorities: ["Review technical issues", "Update content", "Build backlinks"],
        contentStrategy: "Focus on high-intent keywords.",
        technicalRecommendations: e.slice(0, 3) || ["Check site speed"],
        marketingAngle: "Authority based approach"
      };
    }
    return {
      siteAnalysis: t,
      scores: {
        technical: l,
        onPage: c,
        content: u,
        overall: s
      },
      keywords: w,
      aiAnalysis: f,
      traceId: v.traceId
    };
  }, "handler")
});
export {
  le as runSEOAgent
};
//# sourceMappingURL=agentActions.js.map
