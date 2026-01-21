import {
  c as u,
  d as f,
  e as d
} from "./GTU362KY.js";
import {
  a as m,
  f as p
} from "./RUVYHBJQ.js";

// convex/lib/services/intelligence.ts
d();
var h = class {
  static {
    m(this, "IntelligenceService");
  }
  ctx;
  constructor(t) {
    this.ctx = t;
  }
  /**
   * Ingest content into the RAG knowledge base.
   */
  async ingest(t, n, e = {}) {
    try {
      await this.ctx.runMutation(u.rag.add, {
        text: n,
        metadata: { ...e, source: t }
      }), console.log(`[IntelligenceService] Ingested ${t}`);
    } catch (s) {
      console.error(`[IntelligenceService] Ingestion failed for ${t}:`, s);
    }
  }
  /**
   * Retrieve relevant context from the RAG knowledge base.
   */
  async retrieve(t, n = 3) {
    try {
      let s = (await this.ctx.runQuery(u.rag.search, {
        query: t,
        limit: n
      })).map((r) => `[Source: ${r.metadata?.source || "Unknown"}]
${r.text}`).join(`

`);
      return s && console.log(
        `[IntelligenceService] Retrieved ${s.length} chars of context for query: "${t}"`
      ), s;
    } catch (e) {
      return console.warn(`[IntelligenceService] Retrieval failed for query: "${t}"`, e), "";
    }
  }
  async generate(t, n = "", e = {}) {
    let { api: s } = (d(), p(f)), r = crypto.randomUUID(), o = e.model || "gpt-4o", y = e.temperature || 0.7, a = "";
    if (e.persona)
      try {
        let g = await this.ctx.runQuery(s.ai.personas.getPersona, {
          name: e.persona
        });
        g ? a = g.systemPrompt : (console.warn(
          `[IntelligenceService] Persona '${e.persona}' not found. Using default.`
        ), a = `You are ${e.persona}.`);
      } catch (g) {
        console.error(`[IntelligenceService] Failed to load persona '${e.persona}'`, g), a = `You are ${e.persona}.`;
      }
    let I = `${a}
${n ? `
CONTEXT:
${n}
` : ""}
${t}`;
    console.log(`[IntelligenceService] Generating (Trace: ${r})...`);
    let { text: c, usage: $ } = await this.callLLM(
      o,
      I,
      y
    );
    if (await this.logCost($, o, r, e.userId), !e.useReflection)
      return { content: c, traceId: r, cost: 0 };
    console.log(`[IntelligenceService] Critiquing (Trace: ${r})...`);
    let { text: i, usage: v } = await this.critiqueDraft(
      c,
      e.persona || "Senior Analyst",
      a
    );
    await this.logCost(v, o, r, e.userId);
    let l = i.toLowerCase().trim();
    if (l.includes("no changes needed") || l.includes("no changes required") || l.includes("no improvements") || l === "")
      return console.log(`[IntelligenceService] Trace ${r} Complete - No refinement needed.`), {
        content: c,
        traceId: r,
        cost: 0,
        issues: [i]
      };
    console.log(`[IntelligenceService] Refining (Trace: ${r})...`);
    let { text: x, usage: w } = await this.refineDraft(
      c,
      i,
      e.persona || "Senior Analyst",
      a
    );
    return await this.logCost(w, o, r, e.userId), console.log(
      `[IntelligenceService] Trace ${r} Complete. Critique: ${i.substring(0, 100)}...`
    ), {
      content: x,
      traceId: r,
      cost: 0,
      issues: [i]
    };
  }
  async logCost(t, n, e, s) {
    if (t)
      try {
        await this.ctx.runAction(u.neutralCost.aiCosts.addAICost, {
          messageId: crypto.randomUUID(),
          threadId: e,
          modelId: n,
          providerId: "openai",
          usage: {
            completionTokens: t.completionTokens,
            promptTokens: t.promptTokens,
            totalTokens: t.totalTokens
          },
          userId: s
        });
      } catch (r) {
        console.error("[IntelligenceService] Failed to log cost:", r);
      }
  }
  /**
   * Call LLM with automatic multi-provider failover
   * Uses the AI router for intelligent provider selection and failover
   */
  async callLLM(t, n, e, s = 3) {
    let { api: r } = (d(), p(f));
    try {
      let o = await this.ctx.runAction(r.ai.router.router.generateWithFallback, {
        prompt: n,
        temperature: e,
        strategy: "balanced",
        userId: void 0
        // Can be passed from outer context if needed
      });
      return {
        text: o.content,
        usage: o.usage,
        modelUsed: `${o.provider}/${o.model}`
      };
    } catch (o) {
      throw console.error("[IntelligenceService] Multi-provider failover exhausted:", o.message), o;
    }
  }
  async critiqueDraft(t, n, e) {
    let s = `${e || `You are "${n}".`}
    
Your job is to bluntly but constructively critique this draft. 
Focus on: 
1. Search Intent mismatch. 
2. Brand Voice consistency. 
3. Missing semantic depth.

Return a concise paragraph of feedback. If it's perfect, say "No changes needed."

DRAFT:
${t.substring(0, 3e3)}... (truncated)`;
    return this.callLLM("gpt-4o", s, 0.5);
  }
  async refineDraft(t, n, e, s) {
    if (n.includes("No changes needed"))
      return { text: t, usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 } };
    let r = `You are a professional content writer.
    
Critique from ${e}:
"${n}"

Please rewrite the following draft to address this feedback. Keep what works, fix what doesn't.

ORIGINAL DRAFT:
${t}`;
    return this.callLLM("gpt-4o", r, 0.7);
  }
};

export {
  h as a
};
//# sourceMappingURL=UVDYN5Z3.js.map
