import {
  c as m,
  e as u,
  f as c,
  j as i
} from "./YW3B7PJC.js";
import {
  a as p
} from "./RUVYHBJQ.js";

// convex/ai/providers/openai.ts
var a = class l {
  static {
    p(this, "OpenAIProvider");
  }
  name = "openai";
  // Updated January 2026 - Latest OpenAI models
  static MODELS = [
    {
      modelId: "gpt-4o",
      displayName: "GPT-4o",
      capabilities: ["chat", "vision", "function_calling", "structured_output"],
      contextWindow: 128e3,
      costPer1kInputTokens: 0.25,
      // $2.50/1M
      costPer1kOutputTokens: 1,
      // $10/1M
      priority: 1
      // Standard tier
    },
    {
      modelId: "gpt-4o-mini",
      displayName: "GPT-4o Mini",
      capabilities: ["chat", "vision", "function_calling", "structured_output"],
      contextWindow: 128e3,
      costPer1kInputTokens: 0.015,
      // $0.15/1M
      costPer1kOutputTokens: 0.06,
      // $0.60/1M
      priority: 2
      // Cheap tier
    },
    {
      modelId: "o3-mini",
      displayName: "O3 Mini (Reasoning)",
      capabilities: ["chat", "structured_output"],
      contextWindow: 2e5,
      costPer1kInputTokens: 1.1,
      // $1.10/1M
      costPer1kOutputTokens: 4.4,
      // $4.40/1M
      priority: 3
      // Premium reasoning tier
    }
  ];
  isConfigured() {
    return !!process.env.OPENAI_API_KEY;
  }
  getModels() {
    return l.MODELS;
  }
  async generateText(e, t = "gpt-4o") {
    let n = Date.now();
    try {
      let r = i(t), s = await m({
        model: r,
        prompt: e.prompt,
        system: e.systemPrompt,
        temperature: e.temperature,
        stopSequences: e.stopSequences
        // maxTokens is controlled by model defaults
      }), o = s.usage;
      return {
        content: s.text,
        usage: {
          promptTokens: o?.promptTokens || o?.inputTokens || 0,
          completionTokens: o?.completionTokens || o?.outputTokens || 0,
          totalTokens: o?.totalTokens || (o?.promptTokens || 0) + (o?.completionTokens || 0)
        },
        finishReason: s.finishReason || "stop",
        latencyMs: Date.now() - n,
        model: t,
        provider: this.name
      };
    } catch (r) {
      let s = r instanceof Error ? r.message : "Unknown error";
      throw new Error(`[OpenAI] ${t} failed: ${s}`);
    }
  }
  async generateEmbeddings(e) {
    if (e.length === 1) {
      let { embedding: n } = await u({
        model: i.embedding("text-embedding-3-small"),
        value: e[0]
      });
      return [n];
    }
    let { embeddings: t } = await c({
      model: i.embedding("text-embedding-3-small"),
      values: e
    });
    return t;
  }
  async healthCheck() {
    let e = Date.now();
    try {
      return await this.generateText({ prompt: "Say OK", maxTokens: 5, temperature: 0 }, "gpt-4o-mini"), { healthy: !0, latencyMs: Date.now() - e };
    } catch (t) {
      let n = t instanceof Error ? t.message : "Unknown error";
      return {
        healthy: !1,
        latencyMs: Date.now() - e,
        error: n
      };
    }
  }
}, T = new a();

export {
  a,
  T as b
};
//# sourceMappingURL=L63FM7PU.js.map
